"""LangSmith tracing. Unset LANGSMITH_API_KEY is a no-op and never fails the run."""

from __future__ import annotations

import os
from collections.abc import Callable
from typing import TypeVar

T = TypeVar("T")


def tracing_enabled() -> bool:
    return bool(os.environ.get("LANGSMITH_API_KEY"))


def call_traced(name: str, fn: Callable[[], T]) -> T:
    if not tracing_enabled():
        return fn()

    started = False

    def wrapped() -> T:
        nonlocal started
        started = True
        return fn()

    try:
        from langsmith import traceable
    except Exception:
        return fn()

    try:
        return traceable(name=name)(wrapped)()
    except Exception:
        if started:
            raise
        return fn()
