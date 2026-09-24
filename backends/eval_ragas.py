"""FAISS retrieval metrics plus optional ragas-as-judge.

Unanswerable gold items are scored only for abstention. They are not sent to the judge.
Without OPENAI_API_KEY the judge fields are null and the script still writes retrieval numbers.
"""

from __future__ import annotations

import json
import os
import sys
from collections.abc import Callable
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backends.embeddings import MODEL_NAME  # noqa: E402
from backends.faiss_store import FaissStore  # noqa: E402
from backends.generate import generate_grounded_answer  # noqa: E402
from backends.metrics import mean, retrieval_metrics  # noqa: E402

Judge = Callable[[list[dict[str, Any]]], dict[str, float | None]]


def _round(value: float) -> float:
    return round(float(value), 4)


def _nullable(value: Any) -> float | None:
    if value is None:
        return None
    return _round(value)


def _doc_id(chunk_id: str, doc_of: dict[str, str]) -> str:
    if chunk_id in doc_of:
        return doc_of[chunk_id]
    return chunk_id.rsplit("#", 1)[0]


def build_report(
    chunks: list[dict],
    gold: list[dict],
    store: FaissStore,
    k: int = 4,
    judge: Judge | None = None,
) -> dict[str, Any]:
    doc_of = {chunk["id"]: chunk["docId"] for chunk in chunks}
    recall_values: list[float] = []
    mrr_values: list[float] = []
    hit_values: list[float] = []
    abstain_correct: list[float] = []
    unanswerable = 0
    unanswerable_correct = 0
    samples: list[dict[str, Any]] = []

    for item in gold:
        hits = store.search(item["question"], k)
        generated = generate_grounded_answer(item["question"], hits)
        abstained = bool(generated["abstained"])
        should_abstain = item["kind"] == "unanswerable"
        correct = abstained == should_abstain
        abstain_correct.append(1.0 if correct else 0.0)
        if should_abstain:
            unanswerable += 1
            if abstained:
                unanswerable_correct += 1
        else:
            stats = retrieval_metrics(
                [_doc_id(hit["chunk_id"], doc_of) for hit in hits],
                list(item.get("relevantDocIds") or []),
            )
            recall_values.append(stats["recallAtK"])
            mrr_values.append(stats["mrr"])
            hit_values.append(stats["hitRate"])
            if not abstained:
                samples.append(
                    {
                        "user_input": item["question"],
                        "response": generated["answer"],
                        "retrieved_contexts": [hit["text"] for hit in hits],
                        "reference": item.get("goldAnswer", ""),
                    }
                )

    if judge is None:
        ragas = skipped_judge("OPENAI_API_KEY not set; ragas-as-judge is optional")
    elif not samples:
        ragas = skipped_judge("no non-abstaining answerable items to judge")
    else:
        try:
            scores = judge(samples)
            ragas = {
                "status": "ok",
                "reason": None,
                "nJudged": len(samples),
                "faithfulness": _nullable(scores.get("faithfulness")),
                "answer_relevancy": _nullable(scores.get("answer_relevancy")),
                "context_precision": _nullable(scores.get("context_precision")),
            }
        except Exception as exc:
            ragas = skipped_judge(f"ragas judge failed: {exc}")
            ragas["nJudged"] = 0

    return {
        "ranAt": datetime.now(timezone.utc).isoformat(),
        "backend": "faiss",
        "embeddingModel": MODEL_NAME,
        "k": k,
        "retrieval": {
            "recallAtK": _round(mean(recall_values)),
            "mrr": _round(mean(mrr_values)),
            "hitRate": _round(mean(hit_values)),
            "nAnswerable": len(recall_values),
        },
        "abstention": {
            "accuracy": _round(mean(abstain_correct)),
            "unanswerable": unanswerable,
            "unanswerableCorrect": unanswerable_correct,
        },
        "ragas": ragas,
    }


def skipped_judge(reason: str) -> dict[str, Any]:
    return {
        "status": "skipped",
        "reason": reason,
        "nJudged": 0,
        "faithfulness": None,
        "answer_relevancy": None,
        "context_precision": None,
    }


def ragas_judge(samples: list[dict[str, Any]]) -> dict[str, float | None]:
    if not os.environ.get("OPENAI_API_KEY"):
        raise RuntimeError("OPENAI_API_KEY not set")
    from langchain_openai import ChatOpenAI
    from ragas import EvaluationDataset, evaluate
    from ragas.llms import LangchainLLMWrapper

    try:
        from ragas.metrics.collections import (
            Faithfulness,
            LLMContextPrecisionWithReference,
            ResponseRelevancy,
        )
    except ImportError:
        from ragas.metrics import (  # type: ignore[no-redef]
            Faithfulness,
            LLMContextPrecisionWithReference,
            ResponseRelevancy,
        )

    llm = LangchainLLMWrapper(ChatOpenAI(model=os.environ.get("RAGAS_MODEL", "gpt-4o-mini")))
    dataset = EvaluationDataset.from_list(samples)
    result = evaluate(
        dataset=dataset,
        metrics=[
            Faithfulness(),
            ResponseRelevancy(),
            LLMContextPrecisionWithReference(),
        ],
        llm=llm,
    )
    frame = result.to_pandas()
    return {
        "faithfulness": _column(frame, ("faithfulness",)),
        "answer_relevancy": _column(frame, ("answer_relevancy", "response_relevancy")),
        "context_precision": _column(
            frame,
            ("context_precision", "llm_context_precision_with_reference"),
        ),
    }


def _column(frame: Any, names: tuple[str, ...]) -> float | None:
    for name in names:
        if name in frame.columns:
            series = frame[name].dropna()
            if len(series) == 0:
                return None
            return _round(float(series.mean()))
    return None


def load_json(name: str) -> list[dict]:
    path = ROOT / "data" / name
    if not path.exists():
        raise SystemExit(f"missing {path}. Run npm run export-corpus first.")
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> None:
    chunks = load_json("chunks.json")
    gold = load_json("gold.json")
    store = FaissStore()
    store.index(chunks)
    judge = ragas_judge if os.environ.get("OPENAI_API_KEY") else None
    report = build_report(chunks, gold, store, k=4, judge=judge)
    out = ROOT / "backends" / "results" / "ragas.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(
        f"wrote {out} retrieval recall={report['retrieval']['recallAtK']} "
        f"ragas={report['ragas']['status']}"
    )


if __name__ == "__main__":
    main()
