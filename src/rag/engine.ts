import { buildBm25, scoreBm25, type Bm25Index } from "@/rag/bm25";
import { chunkDocuments } from "@/rag/chunk";
import { corpus } from "@/rag/corpus";
import { generateGroundedAnswer } from "@/rag/generate";
import { rrf, topKIndices } from "@/rag/hybrid";
import { buildTfidf, scoreTfidf, type TfidfIndex } from "@/rag/tfidf";
import type { AskResult, Chunk, Hit, RagConfig } from "@/rag/types";

export const RAG_CONFIGS: RagConfig[] = [
  {
    id: "bm25-k4",
    label: "BM25 · k=4",
    retriever: "bm25",
    k: 4,
    description: "بیس‌لاین واژگانی با چهار قطعه؛ نزدیک به چیزی که مولد واقعاً می‌بیند.",
  },
  {
    id: "bm25-k8",
    label: "BM25 · k=8",
    retriever: "bm25",
    k: 8,
    description: "k بزرگ‌تر؛ Recall بالاتر اما زمینه شلوغ‌تر و تأخیر بیشتر.",
  },
  {
    id: "tfidf-k4",
    label: "TF-IDF · k=4",
    retriever: "tfidf",
    k: 4,
    description: "کسینوس TF-IDF روی همان قطعات؛ مقایسه با BM25.",
  },
  {
    id: "hybrid-k6",
    label: "Hybrid RRF · k=6",
    retriever: "hybrid",
    k: 6,
    description: "ادغام رتبهٔ BM25 و TF-IDF با Reciprocal Rank Fusion.",
  },
  {
    id: "closed-book",
    label: "بدون بازیابی",
    retriever: "none",
    k: 0,
    description: "کنترل منفی: مولد بدون قطعه باید امتناع کند.",
  },
];

export type Engine = {
  chunks: Chunk[];
  bm25: Bm25Index;
  tfidf: TfidfIndex;
};

let cached: Engine | null = null;

export function getEngine(): Engine {
  if (cached) return cached;
  const chunks = chunkDocuments(corpus);
  cached = {
    chunks,
    bm25: buildBm25(chunks),
    tfidf: buildTfidf(chunks),
  };
  return cached;
}

export function getConfig(id: string): RagConfig {
  return RAG_CONFIGS.find((c) => c.id === id) ?? RAG_CONFIGS[0];
}

function hitsFromScores(engine: Engine, scores: number[], k: number): Hit[] {
  return topKIndices(scores, k).map((idx, rank) => ({
    chunk: engine.chunks[idx],
    score: scores[idx],
    rank: rank + 1,
  }));
}

export function retrieve(engine: Engine, query: string, config: RagConfig): Hit[] {
  if (config.retriever === "none" || config.k <= 0) return [];
  if (config.retriever === "bm25") {
    return hitsFromScores(engine, scoreBm25(query, engine.bm25), config.k);
  }
  if (config.retriever === "tfidf") {
    return hitsFromScores(engine, scoreTfidf(query, engine.tfidf), config.k);
  }
  const fused = rrf([scoreBm25(query, engine.bm25), scoreTfidf(query, engine.tfidf)]);
  return hitsFromScores(engine, fused, config.k);
}

export function ask(query: string, configId: string): AskResult {
  const started = performance.now();
  const engine = getEngine();
  const config = getConfig(configId);
  const t0 = performance.now();
  const hits = retrieve(engine, query, config);
  const retrievalMs = performance.now() - t0;
  const t1 = performance.now();
  const generated = generateGroundedAnswer(query, hits);
  const generateMs = performance.now() - t1;
  return {
    configId: config.id,
    query,
    answer: generated.answer,
    abstained: generated.abstained,
    citations: generated.citations,
    hits: hits.map((h) => ({
      chunkId: h.chunk.id,
      docId: h.chunk.docId,
      title: h.chunk.title,
      rank: h.rank,
      score: Number(h.score.toFixed(4)),
      preview: h.chunk.text.slice(0, 220),
      text: h.chunk.text,
    })),
    latencyMs: Number((performance.now() - started).toFixed(2)),
    retrievalMs: Number(retrievalMs.toFixed(2)),
    generateMs: Number(generateMs.toFixed(2)),
  };
}

export function corpusStats() {
  const engine = getEngine();
  const docs = new Set(engine.chunks.map((c) => c.docId));
  return {
    documents: docs.size,
    chunks: engine.chunks.length,
    avgTokens: Math.round(
      engine.chunks.reduce((s, c) => s + c.tokens.length, 0) / (engine.chunks.length || 1)
    ),
  };
}
