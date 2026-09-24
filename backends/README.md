# Vector backends

These stores sit beside the TypeScript lexical harness. They do not add a sixth config to `src/rag/engine.ts`.

## Interface

`VectorStore.index(chunks)` and `VectorStore.search(query, k) -> [{chunk_id, score, text}]`.

| Module | When it runs |
| --- | --- |
| `faiss_store.py` | Default. `IndexFlatIP` on L2-normalized embeddings (cosine). This is the only backend the offline tests exercise. |
| `pgvector_store.py` | `docker compose up -d`, then `PGVECTOR_URL` (default `postgresql://sanjesh:sanjesh@127.0.0.1:5432/sanjesh`). Cosine distance (`<=>`). The integration test skips if Postgres is down. |
| `pinecone_store.py` | `PINECONE_API_KEY` and `PINECONE_INDEX`. Otherwise `ConfigError`, and the unit test skips the live call. |
| `weaviate_store.py` | `WEAVIATE_URL` (optional `WEAVIATE_API_KEY`). Otherwise `ConfigError`. |
| `langchain_retriever.py` | Calls an existing `FaissStore`. It does not build another index. |
| `eval_ragas.py` | Retrieval numbers always. ragas faithfulness / answer relevancy / context precision only when `OPENAI_API_KEY` is set. |
| `tracing.py` | LangSmith spans for index, search, and generate when `LANGSMITH_API_KEY` is set. Otherwise a no-op. |

## Embedding model

`sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`

Cache directory: `models/` (`HF_HOME` and `SENTENCE_TRANSFORMERS_HOME`). Do not commit those weights.

Unit tests inject a fake embedder and do not download this model.

## Commands

```bash
npm run export-corpus
python -m pip install -r requirements.txt
python -m pytest backends/tests -q
```

Optional paths (model download, Docker, or API keys):

```bash
python -m pip install -r requirements-optional.txt
python backends/compare.py
python backends/eval_ragas.py
docker compose up -d
```

`compare.py` writes `backends/results/langchain_parity.json` and exits non-zero if any top-1 chunk id differs.

`eval_ragas.py` writes `backends/results/ragas.json`. Questions with `kind: unanswerable` are scored for abstention only. The `/eval` page renders that file under the lexical table when it exists.

Generation is the extractive policy in `src/rag/generate.ts`: abstain when there are no hits or the top chunk shares fewer than two query tokens; otherwise up to three cited sentences.
