from typing import Protocol, TypedDict


class ConfigError(RuntimeError):
    """Raised when an optional backend is missing its URL or API key."""


class Chunk(TypedDict):
    id: str
    text: str
    docId: str
    title: str
    index: int


class SearchHit(TypedDict):
    chunk_id: str
    score: float
    text: str


class Embedder(Protocol):
    def embed(self, texts: list[str]) -> object:
        """Return an array of shape (len(texts), dim)."""


class VectorStore(Protocol):
    def index(self, chunks: list[Chunk]) -> None:
        """Replace the store contents with these chunks."""

    def search(self, query: str, k: int) -> list[SearchHit]:
        """Return up to k hits, highest score first."""
