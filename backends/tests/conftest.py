import os
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

_OPTIONAL_KEYS = (
    "LANGSMITH_API_KEY",
    "LANGSMITH_TRACING",
    "PINECONE_API_KEY",
    "PINECONE_INDEX",
    "WEAVIATE_URL",
    "WEAVIATE_API_KEY",
    "OPENAI_API_KEY",
    "RAGAS_JUDGE",
)


@pytest.fixture(autouse=True)
def clear_optional_credentials(monkeypatch: pytest.MonkeyPatch) -> None:
    for key in _OPTIONAL_KEYS:
        monkeypatch.delenv(key, raising=False)
    os.environ.pop("LANGSMITH_API_KEY", None)
