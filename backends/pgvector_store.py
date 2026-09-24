"""pgvector store. Cosine distance on the same normalized embeddings as FAISS."""

from __future__ import annotations

import os
from typing import Any

import numpy as np

from backends.base import Chunk, ConfigError, Embedder, SearchHit
from backends.embeddings import l2_normalize

DEFAULT_DSN = "postgresql://sanjesh:sanjesh@127.0.0.1:5432/sanjesh"


def _vector_literal(vector: np.ndarray) -> str:
    return "[" + ",".join(str(float(value)) for value in vector.tolist()) + "]"


class PgVectorStore:
    def __init__(self, dsn: str | None = None, embedder: Embedder | None = None) -> None:
        self.dsn = dsn or os.environ.get("PGVECTOR_URL") or DEFAULT_DSN
        self.embedder = embedder

    def _connect(self) -> Any:
        try:
            import psycopg
        except ImportError as exc:
            raise ConfigError("psycopg is not installed. pip install -r requirements-optional.txt") from exc
        return psycopg.connect(self.dsn, connect_timeout=2)

    def index(self, chunks: list[Chunk]) -> None:
        if chunks and self.embedder is None:
            from backends.embeddings import SentenceTransformerEmbedder

            self.embedder = SentenceTransformerEmbedder()
        vectors = (
            l2_normalize(np.asarray(self.embedder.embed([chunk["text"] for chunk in chunks])))
            if chunks
            else np.zeros((0, 3), dtype=np.float32)
        )
        dim = int(vectors.shape[1]) if len(chunks) else 3
        with self._connect() as conn:
            with conn.cursor() as cur:
                cur.execute("CREATE EXTENSION IF NOT EXISTS vector")
                cur.execute("DROP TABLE IF EXISTS sanjesh_chunks")
                cur.execute(
                    f"""
                    CREATE TABLE sanjesh_chunks (
                        chunk_id TEXT PRIMARY KEY,
                        doc_id TEXT NOT NULL,
                        title TEXT,
                        chunk_index INT,
                        body TEXT NOT NULL,
                        embedding vector({dim})
                    )
                    """
                )
                for chunk, vector in zip(chunks, vectors):
                    cur.execute(
                        """
                        INSERT INTO sanjesh_chunks
                            (chunk_id, doc_id, title, chunk_index, body, embedding)
                        VALUES (%s, %s, %s, %s, %s, %s::vector)
                        """,
                        (
                            chunk["id"],
                            chunk["docId"],
                            chunk.get("title", ""),
                            int(chunk.get("index", 0)),
                            chunk["text"],
                            _vector_literal(vector),
                        ),
                    )
            conn.commit()

    def search(self, query: str, k: int) -> list[SearchHit]:
        if k <= 0:
            return []
        if self.embedder is None:
            from backends.embeddings import SentenceTransformerEmbedder

            self.embedder = SentenceTransformerEmbedder()
        query_vector = l2_normalize(np.asarray(self.embedder.embed([query])))[0]
        literal = _vector_literal(query_vector)
        with self._connect() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT chunk_id, body, 1 - (embedding <=> %s::vector) AS score
                    FROM sanjesh_chunks
                    ORDER BY embedding <=> %s::vector
                    LIMIT %s
                    """,
                    (literal, literal, k),
                )
                rows = cur.fetchall()
        return [
            {"chunk_id": row[0], "score": float(row[2]), "text": row[1]}
            for row in rows
        ]
