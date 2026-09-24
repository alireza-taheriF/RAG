from backends.generate import ABSTAIN, generate_grounded_answer


def test_empty_hits_abstain() -> None:
    result = generate_grounded_answer("سؤال", [])
    assert result["abstained"] is True
    assert result["answer"] == ABSTAIN
    assert result["citations"] == []


def test_low_overlap_abstains() -> None:
    hits = [{"chunk_id": "x#0", "score": 0.2, "text": "این متن هیچ اشتراکی با پرسش ندارد و طولانی است."}]
    result = generate_grounded_answer("قیمت سهام اپل", hits)
    assert result["abstained"] is True


def test_overlapping_sentence_is_cited() -> None:
    text = "نقطه قوت بازیابی واژگانی تطبیق دقیق اصطلاحات نادر مثل نام متریک است."
    hits = [{"chunk_id": "bm25#0", "score": 1.0, "text": text}]
    result = generate_grounded_answer("نقطه قوت بازیابی واژگانی تطبیق دقیق اصطلاحات", hits)
    assert result["abstained"] is False
    assert "[bm25#0]" in str(result["answer"])
    assert result["citations"] == ["bm25#0"]
