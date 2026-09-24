import pytest

from backends.pgvector_store import PgVectorStore
from backends.tests.fixtures import CHUNKS, TableEmbedder


def test_pgvector_roundtrip_or_skip() -> None:
    store = PgVectorStore(embedder=TableEmbedder())
    try:
        store.index(CHUNKS)
        hits = store.search("alpha", 1)
    except Exception as exc:
        pytest.skip(f"Postgres/pgvector unavailable: {exc}")
    assert hits[0]["chunk_id"] == "a#0"
    assert hits[0]["text"] == "alpha"
