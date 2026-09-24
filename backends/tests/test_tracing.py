import builtins

from backends.tracing import call_traced


def test_tracing_is_noop_without_key() -> None:
    calls = {"n": 0}

    def body() -> int:
        calls["n"] += 1
        return 3

    assert call_traced("faiss.search", body) == 3
    assert calls["n"] == 1


def test_tracing_does_not_fail_when_langsmith_cannot_load(monkeypatch) -> None:
    monkeypatch.setenv("LANGSMITH_API_KEY", "test-key")
    real_import = builtins.__import__

    def guarded(name, globals=None, locals=None, fromlist=(), level=0):
        if name == "langsmith" or name.startswith("langsmith."):
            raise ImportError("langsmith blocked for the offline test")
        return real_import(name, globals, locals, fromlist, level)

    monkeypatch.setattr(builtins, "__import__", guarded)
    assert call_traced("generate", lambda: "ok") == "ok"
