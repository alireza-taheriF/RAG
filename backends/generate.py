"""Extractive generator. Port of src/rag/generate.ts, including its abstain rule."""

from __future__ import annotations

import re

from backends.base import SearchHit
from backends.tokenize import tokenize
from backends.tracing import call_traced

ABSTAIN = "در منابع بازیابی‌شده مدرک کافی نیست. پاسخ را حدس نمی‌زنم."

_SENTENCE = re.compile(r"(?<=[.!?؟।])\s+|\n+")


def _sentences(text: str) -> list[str]:
    return [part.strip() for part in _SENTENCE.split(text) if len(part.strip()) > 20]


def _overlap_count(query_tokens: list[str], text: str) -> int:
    present = set(tokenize(text))
    return sum(1 for token in query_tokens if token in present)


def _overlap_score(query_tokens: list[str], sentence: str) -> float:
    if not query_tokens:
        return 0.0
    return _overlap_count(query_tokens, sentence) / len(query_tokens)


def _generate(query: str, hits: list[SearchHit]) -> dict[str, object]:
    if not hits:
        return {"answer": ABSTAIN, "abstained": True, "citations": []}

    query_tokens = tokenize(query)
    if _overlap_count(query_tokens, hits[0]["text"]) < 2:
        return {"answer": ABSTAIN, "abstained": True, "citations": []}

    scored: list[dict[str, object]] = []
    for rank, hit in enumerate(hits, start=1):
        for sentence in _sentences(hit["text"]):
            overlap = _overlap_count(query_tokens, sentence)
            score = _overlap_score(query_tokens, sentence)
            if overlap < 2 and score < 0.22:
                continue
            scored.append(
                {
                    "text": sentence,
                    "chunkId": hit["chunk_id"],
                    "score": score + 1 / (rank + 8),
                }
            )
    scored.sort(key=lambda item: float(item["score"]), reverse=True)

    picked: list[dict[str, object]] = []
    used: set[str] = set()
    for item in scored:
        key = str(item["text"])[:80]
        if key in used:
            continue
        used.add(key)
        picked.append(item)
        if len(picked) >= 3:
            break

    if not picked:
        return {"answer": ABSTAIN, "abstained": True, "citations": []}

    citations: list[str] = []
    for item in picked:
        chunk_id = str(item["chunkId"])
        if chunk_id not in citations:
            citations.append(chunk_id)
    answer = " ".join(f"{item['text']} [{item['chunkId']}]" for item in picked)
    return {"answer": answer, "abstained": False, "citations": citations}


def generate_grounded_answer(query: str, hits: list[SearchHit]) -> dict[str, object]:
    return call_traced("generate", lambda: _generate(query, hits))
