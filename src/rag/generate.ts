import type { Hit } from "@/rag/types";
import { tokenize } from "@/rag/tokenize";

export const ABSTAIN =
  "در منابع بازیابی‌شده مدرک کافی نیست. پاسخ را حدس نمی‌زنم.";

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?؟।])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
}

function overlapCount(queryTokens: string[], text: string): number {
  const st = new Set(tokenize(text));
  let hit = 0;
  for (const t of queryTokens) if (st.has(t)) hit += 1;
  return hit;
}

function overlapScore(queryTokens: string[], sentence: string): number {
  if (!queryTokens.length) return 0;
  return overlapCount(queryTokens, sentence) / queryTokens.length;
}

export function generateGroundedAnswer(query: string, hits: Hit[]): {
  answer: string;
  abstained: boolean;
  citations: string[];
} {
  if (hits.length === 0) {
    return { answer: ABSTAIN, abstained: true, citations: [] };
  }

  const qTokens = tokenize(query);
  const topHits = overlapCount(qTokens, hits[0].chunk.text);
  if (topHits < 2) {
    return { answer: ABSTAIN, abstained: true, citations: [] };
  }

  const scored: { text: string; chunkId: string; score: number }[] = [];
  for (const hit of hits) {
    for (const s of sentences(hit.chunk.text)) {
      const n = overlapCount(qTokens, s);
      if (n < 2 && overlapScore(qTokens, s) < 0.22) continue;
      scored.push({
        text: s,
        chunkId: hit.chunk.id,
        score: overlapScore(qTokens, s) + 1 / (hit.rank + 8),
      });
    }
  }
  scored.sort((a, b) => b.score - a.score);

  const picked: typeof scored = [];
  const used = new Set<string>();
  for (const item of scored) {
    const key = item.text.slice(0, 80);
    if (used.has(key)) continue;
    used.add(key);
    picked.push(item);
    if (picked.length >= 3) break;
  }

  if (picked.length === 0) {
    return { answer: ABSTAIN, abstained: true, citations: [] };
  }

  const citations = [...new Set(picked.map((p) => p.chunkId))];
  const answer = picked.map((p) => `${p.text} [${p.chunkId}]`).join(" ");
  return { answer, abstained: false, citations };
}
