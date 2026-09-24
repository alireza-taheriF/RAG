"""Port of src/rag/tokenize.ts. Same stop list and Ye/Ke normalization."""

from __future__ import annotations

import unicodedata

STOP = {
    "the",
    "a",
    "an",
    "and",
    "or",
    "of",
    "to",
    "in",
    "on",
    "for",
    "is",
    "are",
    "was",
    "be",
    "as",
    "by",
    "with",
    "that",
    "this",
    "it",
    "from",
    "at",
    "we",
    "you",
    "your",
    "their",
    "و",
    "در",
    "به",
    "از",
    "که",
    "این",
    "را",
    "با",
    "برای",
    "یک",
    "است",
    "هست",
    "می",
    "های",
    "ها",
    "یا",
    "اگر",
    "تا",
    "هم",
    "شود",
    "کرد",
    "آن",
}


def _is_token_char(ch: str) -> bool:
    category = unicodedata.category(ch)
    return category.startswith("L") or category.startswith("N")


def tokenize(text: str) -> list[str]:
    normalized = unicodedata.normalize("NFKC", text.lower())
    normalized = normalized.replace("ي", "ی").replace("ك", "ک")
    tokens: list[str] = []
    buffer: list[str] = []
    for ch in normalized:
        if _is_token_char(ch):
            buffer.append(ch)
        elif buffer:
            tokens.append("".join(buffer))
            buffer = []
    if buffer:
        tokens.append("".join(buffer))
    return [token for token in tokens if len(token) > 1 and token not in STOP]
