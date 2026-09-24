from backends.eval_ragas import build_report
from backends.faiss_store import FaissStore
from backends.metrics import retrieval_metrics
from backends.tests.fixtures import TableEmbedder

CHUNK_TEXT = "نقطه قوت بازیابی واژگانی تطبیق دقیق اصطلاحات نادر مثل نام متریک است."


class ConstantEmbedder:
    def embed(self, texts: list[str]):
        import numpy as np

        return np.ones((len(texts), 3), dtype=np.float32)


def test_retrieval_metrics_match_harness_shape() -> None:
    stats = retrieval_metrics(["a", "c", "b"], ["a", "b"])
    assert stats["recallAtK"] == 1.0
    assert stats["mrr"] == 1.0
    assert stats["hitRate"] == 1.0
    assert retrieval_metrics(["c"], ["a"])["hitRate"] == 0.0


def test_unanswerable_is_abstention_not_a_judged_answer() -> None:
    chunks = [
        {
            "id": "bm25#0",
            "docId": "bm25",
            "title": "BM25",
            "index": 0,
            "text": CHUNK_TEXT,
        }
    ]
    gold = [
        {
            "id": "u",
            "question": CHUNK_TEXT,
            "kind": "unanswerable",
            "goldAnswer": "باید امتناع شود.",
            "relevantDocIds": [],
        },
        {
            "id": "a",
            "question": "نقطه قوت بازیابی واژگانی تطبیق دقیق اصطلاحات",
            "kind": "factual",
            "goldAnswer": "تطبیق دقیق اصطلاحات.",
            "relevantDocIds": ["bm25"],
        },
    ]
    store = FaissStore(embedder=ConstantEmbedder())
    store.index(chunks)
    seen: list[str] = []

    def judge(samples: list[dict]) -> dict[str, float]:
        seen.extend(sample["user_input"] for sample in samples)
        return {"faithfulness": 0.5, "answer_relevancy": 0.25, "context_precision": 1.0}

    report = build_report(chunks, gold, store, k=4, judge=judge)
    assert CHUNK_TEXT not in seen
    assert seen == ["نقطه قوت بازیابی واژگانی تطبیق دقیق اصطلاحات"]
    assert report["ragas"]["status"] == "ok"
    assert report["ragas"]["faithfulness"] == 0.5
    assert report["retrieval"]["recallAtK"] == 1.0
    assert report["retrieval"]["nAnswerable"] == 1
    assert report["abstention"]["unanswerable"] == 1
    assert report["abstention"]["unanswerableCorrect"] == 0
