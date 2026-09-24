from backends.faiss_store import FaissStore
from backends.langchain_retriever import FaissLangChainRetriever
from backends.tests.fixtures import CHUNKS, TableEmbedder


def test_langchain_top1_matches_faiss_store() -> None:
    store = FaissStore(embedder=TableEmbedder())
    store.index(CHUNKS)
    retriever = FaissLangChainRetriever(store=store, k=1)
    for text, chunk_id in (("alpha", "a#0"), ("beta", "b#0"), ("gamma", "c#0")):
        direct = store.search(text, 1)[0]["chunk_id"]
        via = retriever.invoke(text)[0].metadata["chunk_id"]
        assert direct == chunk_id
        assert via == direct


def test_langchain_calls_the_same_store() -> None:
    store = FaissStore(embedder=TableEmbedder())
    store.index(CHUNKS)
    calls = {"n": 0}
    original = store.search

    def wrapped(query: str, k: int):
        calls["n"] += 1
        return original(query, k)

    store.search = wrapped  # type: ignore[method-assign]
    docs = FaissLangChainRetriever(store=store, k=1).invoke("gamma")
    assert calls["n"] == 1
    assert docs[0].metadata["chunk_id"] == "c#0"
