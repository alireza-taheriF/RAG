import numpy as np

CHUNKS = [
    {
        "id": "a#0",
        "docId": "a",
        "title": "A",
        "index": 0,
        "text": "alpha",
    },
    {
        "id": "b#0",
        "docId": "b",
        "title": "B",
        "index": 0,
        "text": "beta",
    },
    {
        "id": "c#0",
        "docId": "c",
        "title": "C",
        "index": 0,
        "text": "gamma",
    },
]


class TableEmbedder:
    """Fixed vectors. Tests never download a sentence-transformer."""

    def __init__(self) -> None:
        self.table = {
            "alpha": np.array([1.0, 0.0, 0.0], dtype=np.float32),
            "beta": np.array([0.0, 1.0, 0.0], dtype=np.float32),
            "gamma": np.array([0.0, 0.0, 1.0], dtype=np.float32),
        }

    def embed(self, texts: list[str]) -> np.ndarray:
        return np.vstack([self.table[text] for text in texts])
