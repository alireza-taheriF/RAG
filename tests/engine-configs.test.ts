import assert from "node:assert/strict";
import { test } from "node:test";
import { RAG_CONFIGS } from "@/rag/engine";

test("lexical configs stay the offline five", () => {
  assert.deepEqual(
    RAG_CONFIGS.map((config) => config.id),
    ["bm25-k4", "bm25-k8", "tfidf-k4", "hybrid-k6", "closed-book"],
  );
});
