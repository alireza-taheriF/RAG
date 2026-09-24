from backends.faiss_store import FaissStore
from backends.tests.fixtures import CHUNKS, TableEmbedder


def test_faiss_top1_on_three_chunks() -> None:
    store = FaissStore(embedder=TableEmbedder())
    store.index(CHUNKS)
    hits = store.search("alpha", 2)
    assert len(hits) == 2
    assert hits[0]["chunk_id"] == "a#0"
    assert hits[0]["text"] == "alpha"
    assert hits[0]["score"] == 1.0


def test_faiss_search_without_index_is_empty() -> None:
    store = FaissStore(embedder=TableEmbedder())
    assert store.search("alpha", 3) == []
