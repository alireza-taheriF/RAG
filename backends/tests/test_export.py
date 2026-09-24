import json
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]


def test_exported_ids_stay_stable() -> None:
    chunks_path = ROOT / "data" / "chunks.json"
    gold_path = ROOT / "data" / "gold.json"
    if not chunks_path.exists() or not gold_path.exists():
        pytest.skip("run npm run export-corpus")
    chunks = json.loads(chunks_path.read_text(encoding="utf-8"))
    gold = json.loads(gold_path.read_text(encoding="utf-8"))
    assert chunks
    for chunk in chunks:
        assert chunk["id"] == f"{chunk['docId']}#{chunk['index']}"
    assert len(gold) == 48
    assert sum(1 for item in gold if item["kind"] == "unanswerable") == 8
