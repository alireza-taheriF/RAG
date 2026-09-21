import type { Chunk } from "@/rag/types";
import { tokenize } from "@/rag/tokenize";

const K1 = 1.2;
const B = 0.75;

export type Bm25Index = {
  chunks: Chunk[];
  df: Map<string, number>;
  avgdl: number;
  N: number;
};

export function buildBm25(chunks: Chunk[]): Bm25Index {
  const df = new Map<string, number>();
  let total = 0;
  for (const chunk of chunks) {
    total += chunk.tokens.length;
    const unique = new Set(chunk.tokens);
    for (const t of unique) df.set(t, (df.get(t) ?? 0) + 1);
  }
  return {
    chunks,
    df,
    avgdl: chunks.length ? total / chunks.length : 0,
    N: chunks.length,
  };
}

function idf(term: string, index: Bm25Index): number {
  const n = index.df.get(term) ?? 0;
  return Math.log((index.N - n + 0.5) / (n + 0.5) + 1);
}

export function scoreBm25(query: string, index: Bm25Index): number[] {
  const qTokens = tokenize(query);
  const scores = new Array(index.chunks.length).fill(0);
  for (let i = 0; i < index.chunks.length; i++) {
    const chunk = index.chunks[i];
    const tf = new Map<string, number>();
    for (const t of chunk.tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    const dl = chunk.tokens.length || 1;
    let s = 0;
    for (const term of qTokens) {
      const freq = tf.get(term) ?? 0;
      if (!freq) continue;
      const denom = freq + K1 * (1 - B + B * (dl / (index.avgdl || 1)));
      s += idf(term, index) * ((freq * (K1 + 1)) / denom);
    }
    scores[i] = s;
  }
  return scores;
}
