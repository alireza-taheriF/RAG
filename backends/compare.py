"""Compare FaissStore.search with the LangChain retriever on the exported gold set.

Top-1 chunk ids must match. The retriever calls the same FaissStore.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backends.faiss_store import FaissStore  # noqa: E402
from backends.langchain_retriever import FaissLangChainRetriever  # noqa: E402


def load_json(name: str) -> list[dict]:
    path = ROOT / "data" / name
    if not path.exists():
        raise SystemExit(f"missing {path}. Run npm run export-corpus first.")
    return json.loads(path.read_text(encoding="utf-8"))


def compare(store: FaissStore, gold: list[dict], k: int = 4) -> dict:
    retriever = FaissLangChainRetriever(store=store, k=k)
    rows = []
    mismatches = 0
    for item in gold:
        direct = store.search(item["question"], k)
        via_langchain = retriever.invoke(item["question"])
        direct_id = direct[0]["chunk_id"] if direct else None
        langchain_id = via_langchain[0].metadata["chunk_id"] if via_langchain else None
        match = direct_id == langchain_id
        if not match:
            mismatches += 1
        rows.append(
            {
                "id": item["id"],
                "direct": direct_id,
                "langchain": langchain_id,
                "match": match,
            }
        )
    return {
        "k": k,
        "n": len(gold),
        "top1Matches": len(gold) - mismatches,
        "top1Mismatches": mismatches,
        "rows": rows,
    }


def main() -> None:
    chunks = load_json("chunks.json")
    gold = load_json("gold.json")
    store = FaissStore()
    store.index(chunks)
    report = compare(store, gold, k=4)
    out = ROOT / "backends" / "results" / "langchain_parity.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {out} mismatches={report['top1Mismatches']}")
    if report["top1Mismatches"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
