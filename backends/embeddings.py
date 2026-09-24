"""Local MiniLM embeddings. Weights stay in models/ or the HF cache."""

from __future__ import annotations

import os
from pathlib import Path

import numpy as np

# Multilingual MiniLM so the Persian corpus is embeddable offline.
MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"


def repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def l2_normalize(vectors: np.ndarray) -> np.ndarray:
    array = np.asarray(vectors, dtype=np.float32)
    if array.ndim == 1:
        array = array.reshape(1, -1)
    norms = np.linalg.norm(array, axis=1, keepdims=True)
    norms = np.maximum(norms, 1e-12)
    return np.ascontiguousarray(array / norms, dtype=np.float32)


class SentenceTransformerEmbedder:
    """Lazy local model. Constructing it downloads weights on first use."""

    def __init__(self, model_name: str = MODEL_NAME) -> None:
        self.model_name = model_name
        cache = repo_root() / "models"
        cache.mkdir(parents=True, exist_ok=True)
        os.environ.setdefault("HF_HOME", str(cache / "hf"))
        os.environ.setdefault("SENTENCE_TRANSFORMERS_HOME", str(cache / "sentence-transformers"))
        from sentence_transformers import SentenceTransformer

        self.model = SentenceTransformer(model_name, cache_folder=str(cache / "sentence-transformers"))
        self.dim = int(self.model.get_sentence_embedding_dimension())

    def embed(self, texts: list[str]) -> np.ndarray:
        if not texts:
            return np.zeros((0, self.dim), dtype=np.float32)
        vectors = self.model.encode(texts, convert_to_numpy=True, normalize_embeddings=False)
        return np.asarray(vectors, dtype=np.float32)
