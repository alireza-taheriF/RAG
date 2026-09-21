import { ask, corpusStats, RAG_CONFIGS } from "@/rag/engine";
import { goldSet } from "@/rag/gold";
import { scoreItem } from "@/rag/metrics";
import type { ConfigSummary, ItemMetrics } from "@/rag/types";

function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function percentile(xs: number[], p: number): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const idx = Math.min(s.length - 1, Math.max(0, Math.ceil(p * s.length) - 1));
  return s[idx];
}

function summarize(configId: string, items: ItemMetrics[]): ConfigSummary {
  const cfg = RAG_CONFIGS.find((c) => c.id === configId)!;
  const answerable = items.filter((i) => !i.shouldAbstain);
  const lat = items.map((i) => i.latencyMs);
  const retrievalPool = answerable.length ? answerable : items;
  return {
    configId,
    label: cfg.label,
    n: items.length,
    recallAtK: mean(retrievalPool.map((i) => i.recallAtK)),
    mrr: mean(retrievalPool.map((i) => i.mrr)),
    ndcgAtK: mean(retrievalPool.map((i) => i.ndcgAtK)),
    hitRate: mean(retrievalPool.map((i) => i.hitRate)),
    answerF1: mean(items.map((i) => i.answerF1)),
    faithfulness: mean(items.map((i) => i.faithfulness)),
    unsupportedRate: mean(answerable.map((i) => i.unsupportedRate)),
    grounded: mean(items.map((i) => i.grounded)),
    abstainAccuracy: mean(items.map((i) => i.abstainCorrect)),
    p50LatencyMs: percentile(lat, 0.5),
    p95LatencyMs: percentile(lat, 0.95),
  };
}

export function runHarness() {
  const started = Date.now();
  const items: ItemMetrics[] = [];
  const traces = [];
  for (const config of RAG_CONFIGS) {
    for (const gold of goldSet) {
      const result = ask(gold.question, config.id);
      items.push(scoreItem(gold, result, Math.max(config.k, 1)));
      traces.push({
        questionId: gold.id,
        question: gold.question,
        kind: gold.kind,
        configId: config.id,
        answer: result.answer,
        abstained: result.abstained,
        citations: result.citations,
        hitDocIds: result.hits.map((h) => h.docId),
      });
    }
  }
  const byConfig = RAG_CONFIGS.map((c) =>
    summarize(
      c.id,
      items.filter((i) => i.configId === c.id)
    )
  );
  const answerable = goldSet.filter((g) => g.kind !== "unanswerable").length;
  const unanswerable = goldSet.length - answerable;
  return {
    ranAt: new Date().toISOString(),
    durationMs: Date.now() - started,
    corpus: corpusStats(),
    gold: {
      n: goldSet.length,
      answerable,
      unanswerable,
    },
    configs: RAG_CONFIGS,
    summaries: byConfig,
    items,
    traces,
  };
}

export function compactHarness(result: ReturnType<typeof runHarness>) {
  const { traces, items, ...rest } = result;
  return {
    ...rest,
    items,
    traces: traces.map((t) => ({
      questionId: t.questionId,
      question: t.question,
      kind: t.kind,
      configId: t.configId,
      abstained: t.abstained,
      answer: t.answer.slice(0, 280),
      hitDocIds: t.hitDocIds,
    })),
  };
}

export type HarnessResult = ReturnType<typeof runHarness>;
export type CompactHarness = ReturnType<typeof compactHarness>;

