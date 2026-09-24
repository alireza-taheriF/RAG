"""Retrieval numbers in the same shape as src/rag/metrics.ts."""

from __future__ import annotations


def retrieval_metrics(doc_ids: list[str], relevant_doc_ids: list[str]) -> dict[str, float]:
    relevant = set(relevant_doc_ids)
    if not relevant:
        return {"recallAtK": 0.0, "mrr": 0.0, "hitRate": 0.0}
    found: set[str] = set()
    first_rank = 0
    for rank, doc_id in enumerate(doc_ids, start=1):
        if doc_id in relevant:
            found.add(doc_id)
            if not first_rank:
                first_rank = rank
    return {
        "recallAtK": len(found) / len(relevant),
        "mrr": (1.0 / first_rank) if first_rank else 0.0,
        "hitRate": 1.0 if first_rank else 0.0,
    }


def mean(values: list[float]) -> float:
    if not values:
        return 0.0
    return sum(values) / len(values)
