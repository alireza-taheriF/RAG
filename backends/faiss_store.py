"""FAISS inner-product index over L2-normalized embeddings (cosine)."""

from __future__ import annotations

from typing import Any

import numpy as np

from backends.base import Chunk, Embedder, SearchHit
from backends.embeddings import l2_normalize
from backends.tracing import call_traced


def _default_embedder() -> Any:
    from backends.embeddings import SentenceTransformerEmbedder

    return SentenceTransformerEmbedder()


class FaissStore:
    """Default offline store. Unit tests inject embeddings and do not download a model."""

    def __init__(self, embedder: Embedder | None = None) -> None:
        self.embedder = embedder
        self._chunks: list[Chunk] = []
        self._index: Any = None

    def index(self, chunks: list[Chunk]) -> None:
        def _index() -> None:
            self._chunks = list(chunks)
            if not chunks:
                self._index = None
                return
            if self.embedder is None:
                self.embedder = _default_embedder()
            vectors = l2_normalize(np.asarray(self.embedder.embed([chunk["text"] for chunk in chunks])))
            import faiss

            index = faiss.IndexFlatIP(int(vectors.shape[1]))
            index.add(vectors)
            self._index = index

        call_traced("faiss.index", _index)

    def search(self, query: str, k: int) -> list[SearchHit]:
        def _search() -> list[SearchHit]:
            if self._index is None or k <= 0 or not self._chunks:
                return []
            if self.embedder is None:
                self.embedder = _default_embedder()
            query_vector = l2_normalize(np.asarray(self.embedder.embed([query])))
            limit = min(k, len(self._chunks))
            scores, ids = self._index.search(query_vector, limit)
            hits: list[SearchHit] = []
            for score, idx in zip(scores[0], ids[0]):
                if int(idx) < 0:
                    continue
                chunk = self._chunks[int(idx)]
                hits.append(
                    {
                        "chunk_id": chunk["id"],
                        "score": float(score),
                        "text": chunk["text"],
                    }
                )
            return hits

        return call_traced("faiss.search", _search)
