export type CorpusDoc = {
  id: string;
  title: string;
  titleEn: string;
  text: string;
};

export type Chunk = {
  id: string;
  docId: string;
  title: string;
  index: number;
  text: string;
  tokens: string[];
};

export type RetrieverName = "bm25" | "tfidf" | "hybrid" | "none";

export type RagConfig = {
  id: string;
  label: string;
  retriever: RetrieverName;
  k: number;
  description: string;
};

export type Hit = {
  chunk: Chunk;
  score: number;
  rank: number;
};

export type AskResult = {
  configId: string;
  query: string;
  answer: string;
  abstained: boolean;
  citations: string[];
    hits: Array<{
      chunkId: string;
      docId: string;
      title: string;
      rank: number;
      score: number;
      preview: string;
      text?: string;
    }>;
  latencyMs: number;
  retrievalMs: number;
  generateMs: number;
};

export type GoldItem = {
  id: string;
  question: string;
  language: "fa" | "en";
  kind: "factual" | "comparison" | "procedure" | "unanswerable";
  goldAnswer: string;
  relevantDocIds: string[];
};

export type ItemMetrics = {
  questionId: string;
  configId: string;
  recallAtK: number;
  mrr: number;
  ndcgAtK: number;
  hitRate: number;
  answerF1: number;
  faithfulness: number;
  unsupportedRate: number;
  grounded: number;
  abstained: boolean;
  shouldAbstain: boolean;
  abstainCorrect: number;
  latencyMs: number;
};

export type ConfigSummary = {
  configId: string;
  label: string;
  n: number;
  recallAtK: number;
  mrr: number;
  ndcgAtK: number;
  hitRate: number;
  answerF1: number;
  faithfulness: number;
  unsupportedRate: number;
  grounded: number;
  abstainAccuracy: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
};
