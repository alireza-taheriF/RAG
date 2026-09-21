import { ngrams, tokenize, tokenF1 } from "@/rag/tokenize";
import type { AskResult, GoldItem, ItemMetrics } from "@/rag/types";

function dcg(rels: number[]): number {
  return rels.reduce((s, r, i) => s + r / Math.log2(i + 2), 0);
}

export function retrievalMetrics(result: AskResult, gold: GoldItem, k: number) {
  const relevant = new Set(gold.relevantDocIds);
  if (relevant.size === 0) {
    return { recallAtK: 0, mrr: 0, ndcgAtK: 0, hitRate: 0 };
  }
  const retrieved = result.hits.slice(0, k);
  const got = new Set<string>();
  let firstRank = 0;
  const binary: number[] = [];
  retrieved.forEach((h, i) => {
    const ok = relevant.has(h.docId);
    binary.push(ok ? 1 : 0);
    if (ok) {
      got.add(h.docId);
      if (!firstRank) firstRank = i + 1;
    }
  });
  const recallAtK = got.size / relevant.size;
  const mrr = firstRank ? 1 / firstRank : 0;
  const ideal = [...binary].sort((a, b) => b - a);
  const idcg = dcg(ideal);
  const ndcgAtK = idcg === 0 ? 0 : dcg(binary) / idcg;
  return { recallAtK, mrr, ndcgAtK, hitRate: firstRank ? 1 : 0 };
}

export function faithfulnessScore(answer: string, contexts: string[]): number {
  if (answer.startsWith("در منابع بازیابی‌شده")) return 1;
  const ctx = tokenize(contexts.join(" "));
  const ctxSet = new Set(ngrams(ctx, 3));
  const sentences = answer
    .split(/(?<=[.!?؟])\s+/)
    .map((s) => s.replace(/\[[^\]]+\]/g, "").trim())
    .filter((s) => s.length > 12);
  if (sentences.length === 0) return 1;
  let ok = 0;
  for (const s of sentences) {
    const grams = ngrams(tokenize(s), 3);
    if (grams.length === 0) continue;
    const hit = grams.filter((g) => ctxSet.has(g)).length / grams.length;
    if (hit >= 0.35) ok += 1;
  }
  return ok / sentences.length;
}

export function scoreItem(gold: GoldItem, result: AskResult, k: number): ItemMetrics {
  const retrieval = retrievalMetrics(result, gold, k);
  const contexts = result.hits.map((h) => h.text ?? h.preview);
  const shouldAbstain = gold.kind === "unanswerable";
  const f1 = shouldAbstain
    ? result.abstained
      ? 1
      : 0
    : result.abstained
      ? 0
      : tokenF1(result.answer, gold.goldAnswer);
  const faithful = faithfulnessScore(result.answer, contexts);
  return {
    questionId: gold.id,
    configId: result.configId,
    ...retrieval,
    answerF1: f1,
    faithfulness: faithful,
    unsupportedRate: result.abstained ? 0 : 1 - faithful,
    grounded: result.abstained ? (shouldAbstain ? 1 : 0) : faithful,
    abstained: result.abstained,
    shouldAbstain,
    abstainCorrect: result.abstained === shouldAbstain ? 1 : 0,
    latencyMs: result.latencyMs,
  };
}
