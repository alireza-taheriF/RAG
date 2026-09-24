"""Optional Weaviate adapter. A missing WEAVIATE_URL raises ConfigError before any network call."""

from __future__ import annotations

import os
from typing import Any
from urllib.parse import urlparse

import numpy as np

from backends.base import Chunk, ConfigError, Embedder, SearchHit
from backends.embeddings import l2_normalize

COLLECTION = "SanjeshChunk"


class WeaviateStore:
    def __init__(
        self,
        url: str | None = None,
        api_key: str | None = None,
        embedder: Embedder | None = None,
    ) -> None:
        self.url = url if url is not None else os.environ.get("WEAVIATE_URL")
        self.api_key = api_key if api_key is not None else os.environ.get("WEAVIATE_API_KEY")
        if not self.url:
            raise ConfigError(
                "WeaviateStore requires WEAVIATE_URL. "
                "This backend is optional; FAISS is the offline path."
            )
        self.embedder = embedder

    def _connect(self) -> Any:
        import weaviate
        from weaviate.classes.init import Auth

        parsed = urlparse(self.url)
        host = parsed.hostname or "localhost"
        secure = parsed.scheme == "https"
        http_port = parsed.port or (443 if secure else 8080)
        grpc_port = int(os.environ.get("WEAVIATE_GRPC_PORT", "50051"))
        auth = Auth.api_key(self.api_key) if self.api_key else None
        return weaviate.connect_to_custom(
            http_host=host,
            http_port=http_port,
            http_secure=secure,
            grpc_host=host,
            grpc_port=grpc_port,
            grpc_secure=secure,
            auth_credentials=auth,
        )

    def _embedder(self) -> Embedder:
        if self.embedder is None:
            from backends.embeddings import SentenceTransformerEmbedder

            self.embedder = SentenceTransformerEmbedder()
        return self.embedder

    def index(self, chunks: list[Chunk]) -> None:
        from weaviate.classes.config import Configure, DataType, Property

        vectors = l2_normalize(np.asarray(self._embedder().embed([chunk["text"] for chunk in chunks])))
        client = self._connect()
        try:
            if client.collections.exists(COLLECTION):
                client.collections.delete(COLLECTION)
            client.collections.create(
                COLLECTION,
                vectorizer_config=Configure.Vectorizer.none(),
                properties=[
                    Property(name="chunk_id", data_type=DataType.TEXT),
                    Property(name="doc_id", data_type=DataType.TEXT),
                    Property(name="text", data_type=DataType.TEXT),
                ],
            )
            collection = client.collections.get(COLLECTION)
            with collection.batch.dynamic() as batch:
                for chunk, vector in zip(chunks, vectors):
                    batch.add_object(
                        properties={
                            "chunk_id": chunk["id"],
                            "doc_id": chunk["docId"],
                            "text": chunk["text"],
                        },
                        vector=vector.tolist(),
                    )
        finally:
            client.close()

    def search(self, query: str, k: int) -> list[SearchHit]:
        if k <= 0:
            return []
        from weaviate.classes.query import MetadataQuery

        query_vector = l2_normalize(np.asarray(self._embedder().embed([query])))[0]
        client = self._connect()
        try:
            result = client.collections.get(COLLECTION).query.near_vector(
                near_vector=query_vector.tolist(),
                limit=k,
                return_metadata=MetadataQuery(distance=True),
                return_properties=["chunk_id", "text"],
            )
            hits: list[SearchHit] = []
            for obj in result.objects:
                distance = obj.metadata.distance if obj.metadata else None
                score = 0.0 if distance is None else 1.0 - float(distance)
                props = obj.properties or {}
                hits.append(
                    {
                        "chunk_id": str(props.get("chunk_id", "")),
                        "score": score,
                        "text": str(props.get("text", "")),
                    }
                )
            return hits
        finally:
            client.close()
