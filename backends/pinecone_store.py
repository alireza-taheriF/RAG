"""Optional Pinecone adapter. Missing credentials raise ConfigError and do not call the network."""

from __future__ import annotations

import os
from typing import Any

import numpy as np

from backends.base import Chunk, ConfigError, Embedder, SearchHit
from backends.embeddings import l2_normalize

NAMESPACE = "sanjesh"


class PineconeStore:
    def __init__(
        self,
        api_key: str | None = None,
        index_name: str | None = None,
        embedder: Embedder | None = None,
    ) -> None:
        self.api_key = api_key if api_key is not None else os.environ.get("PINECONE_API_KEY")
        self.index_name = index_name if index_name is not None else os.environ.get("PINECONE_INDEX")
        if not self.api_key or not self.index_name:
            raise ConfigError(
                "PineconeStore requires PINECONE_API_KEY and PINECONE_INDEX. "
                "This backend is optional; FAISS is the offline path."
            )
        self.embedder = embedder
        self._index: Any = None

    def _client_index(self) -> Any:
        if self._index is not None:
            return self._index
        from pinecone import Pinecone

        self._index = Pinecone(api_key=self.api_key).Index(self.index_name)
        return self._index

    def _embedder(self) -> Embedder:
        if self.embedder is None:
            from backends.embeddings import SentenceTransformerEmbedder

            self.embedder = SentenceTransformerEmbedder()
        return self.embedder

    def index(self, chunks: list[Chunk]) -> None:
        vectors = l2_normalize(np.asarray(self._embedder().embed([chunk["text"] for chunk in chunks])))
        index = self._client_index()
        try:
            index.delete(delete_all=True, namespace=NAMESPACE)
        except Exception:
            # An empty namespace is fine; the upsert below replaces Sanjesh vectors.
            pass
        payload = [
            {
                "id": chunk["id"],
                "values": vector.tolist(),
                "metadata": {
                    "text": chunk["text"],
                    "doc_id": chunk["docId"],
                },
            }
            for chunk, vector in zip(chunks, vectors)
        ]
        for start in range(0, len(payload), 100):
            index.upsert(vectors=payload[start : start + 100], namespace=NAMESPACE)

    def search(self, query: str, k: int) -> list[SearchHit]:
        if k <= 0:
            return []
        query_vector = l2_normalize(np.asarray(self._embedder().embed([query])))[0]
        result = self._client_index().query(
            vector=query_vector.tolist(),
            top_k=k,
            include_metadata=True,
            namespace=NAMESPACE,
        )
        hits: list[SearchHit] = []
        for match in result.matches:
            metadata = match.metadata or {}
            hits.append(
                {
                    "chunk_id": match.id,
                    "score": float(match.score),
                    "text": str(metadata.get("text", "")),
                }
            )
        return hits
