import type { Chunk } from "@/rag/types";
import { tokenize } from "@/rag/tokenize";

export type TfidfIndex = {
  chunks: Chunk[];
  idf: Map<string, number>;
  vectors: Map<string, number>[];
  norms: number[];
};

export function buildTfidf(chunks: Chunk[]): TfidfIndex {
  const df = new Map<string, number>();
  for (const chunk of chunks) {
    for (const t of new Set(chunk.tokens)) df.set(t, (df.get(t) ?? 0) + 1);
  }
  const N = chunks.length || 1;
  const idf = new Map<string, number>();
  for (const [term, n] of df) idf.set(term, Math.log((N + 1) / (n + 1)) + 1);

  const vectors: Map<string, number>[] = [];
  const norms: number[] = [];
  for (const chunk of chunks) {
    const tf = new Map<string, number>();
    for (const t of chunk.tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    const vec = new Map<string, number>();
    let norm = 0;
    for (const [term, count] of tf) {
      const w = (1 + Math.log(count)) * (idf.get(term) ?? 0);
      vec.set(term, w);
      norm += w * w;
    }
    vectors.push(vec);
    norms.push(Math.sqrt(norm) || 1);
  }
  return { chunks, idf, vectors, norms };
}

export function scoreTfidf(query: string, index: TfidfIndex): number[] {
  const tf = new Map<string, number>();
  for (const t of tokenize(query)) tf.set(t, (tf.get(t) ?? 0) + 1);
  const qv = new Map<string, number>();
  let qn = 0;
  for (const [term, count] of tf) {
    const w = (1 + Math.log(count)) * (index.idf.get(term) ?? 0);
    qv.set(term, w);
    qn += w * w;
  }
  const qnorm = Math.sqrt(qn) || 1;
  return index.vectors.map((vec, i) => {
    let dot = 0;
    for (const [term, w] of qv) {
      const cw = vec.get(term);
      if (cw) dot += w * cw;
    }
    return dot / (qnorm * index.norms[i]);
  });
}
