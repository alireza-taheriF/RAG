import pytest

from backends.base import ConfigError
from backends.pinecone_store import PineconeStore
from backends.weaviate_store import WeaviateStore


def test_pinecone_missing_key_raises_and_skips_live_call() -> None:
    with pytest.raises(ConfigError, match="PINECONE_API_KEY"):
        PineconeStore()
    pytest.skip("PINECONE_API_KEY not set")


def test_weaviate_missing_url_raises_and_skips_live_call() -> None:
    with pytest.raises(ConfigError, match="WEAVIATE_URL"):
        WeaviateStore()
    pytest.skip("WEAVIATE_URL not set")
