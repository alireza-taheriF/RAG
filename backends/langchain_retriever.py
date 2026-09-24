"""LangChain retriever over an existing FaissStore. It does not build a second index."""

from __future__ import annotations

from typing import Any

from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever


class FaissLangChainRetriever(BaseRetriever):
    store: Any
    k: int = 4

    def _get_relevant_documents(self, query: str, *, run_manager: Any = None) -> list[Document]:
        del run_manager
        hits = self.store.search(query, self.k)
        return [
            Document(
                page_content=hit["text"],
                metadata={"chunk_id": hit["chunk_id"], "score": hit["score"]},
            )
            for hit in hits
        ]
