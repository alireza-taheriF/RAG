"use client";

import { useMemo, useRef, useState } from "react";
import { ask, corpusStats, RAG_CONFIGS } from "@/rag/engine";
import { goldSet } from "@/rag/gold";
import type { AskResult } from "@/rag/types";

const SAMPLES = goldSet.filter((g) => g.kind !== "unanswerable").slice(0, 6);
const OUT_OF_DOMAIN = goldSet.filter((g) => g.kind === "unanswerable")[0];

export function LabPlayground() {
  const initialQuery = SAMPLES[0]?.question ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [configId, setConfigId] = useState("hybrid-k6");
  const [result, setResult] = useState<AskResult | null>(() =>
    initialQuery ? ask(initialQuery, "hybrid-k6") : null
  );
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLElement | null>(null);
  const meta = useMemo(() => corpusStats(), []);
  const active = RAG_CONFIGS.find((c) => c.id === configId);

  function run(nextQuery = query, nextConfig = configId) {
    const q = nextQuery.trim();
    if (q.length < 3) {
      setError("سؤال را کامل‌تر بنویس.");
      setResult(null);
      return;
    }
    setError(null);
    try {
      const next = ask(q, nextConfig);
      setResult(next);
      queueMicrotask(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "اجرای بازیابی شکست خورد.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <section className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-zinc-50">پرس‌وجوی مقید به منبع</h2>
            <p className="mt-1 text-sm leading-7 text-zinc-400">
              پاسخ فقط از قطعات بازیابی‌شده ساخته می‌شود. اگر مدرک نباشد، سیستم امتناع می‌کند — بدون مدل ابری.
            </p>
          </div>
          <p className="font-mono text-xs text-zinc-500">
            {meta.documents} سند · {meta.chunks} قطعه
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {RAG_CONFIGS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`rounded-full px-3 py-1.5 text-xs ${
                c.id === configId
                  ? "bg-amber-400 font-medium text-zinc-950"
                  : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              }`}
              onClick={() => {
                setConfigId(c.id);
                if (query.trim().length >= 3) run(query, c.id);
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
        {active ? <p className="text-xs leading-6 text-zinc-500">{active.description}</p> : null}

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={4}
          placeholder="سؤال را به فارسی یا انگلیسی بنویس…"
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-400/60"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => run()}
            className="rounded-lg bg-amber-400 px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-300"
          >
            بپرس
          </button>
          <button
            type="button"
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
            onClick={() => {
              setQuery(OUT_OF_DOMAIN.question);
              run(OUT_OF_DOMAIN.question, configId);
            }}
          >
            سؤال خارج از دامنه
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setQuery(s.question);
                run(s.question, configId);
              }}
              className="rounded-full border border-zinc-800 px-3 py-1 text-right text-[11px] leading-5 text-zinc-400 hover:border-amber-400/40 hover:text-amber-100"
            >
              {s.question}
            </button>
          ))}
        </div>
        {error ? (
          <p className="rounded-xl border border-rose-900/60 bg-rose-950/40 px-3 py-2 text-sm text-rose-200">
            {error}
          </p>
        ) : null}
      </section>

      <section ref={resultRef} className="space-y-4 lg:sticky lg:top-16">
        {!result ? (
          <div className="rounded-3xl border border-dashed border-zinc-800 p-8 text-sm leading-7 text-zinc-500">
            هنوز پاسخی نیست. یک سؤال نمونه را بزن یا خودت بنویس. خروجی باید قطعه، امتیاز و استناد داشته باشد.
          </div>
        ) : (
          <div className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex flex-wrap gap-3 font-mono text-[11px] text-zinc-500">
              <span>end-to-end {result.latencyMs}ms</span>
              <span>بازیابی {result.retrievalMs}ms</span>
              <span>تولید {result.generateMs}ms</span>
              <span>{result.abstained ? "امتناع" : "پاسخ مقید"}</span>
            </div>
            <p className={`text-sm leading-8 ${result.abstained ? "text-amber-200" : "text-zinc-200"}`}>
              {result.answer}
            </p>
            {result.citations.length ? (
              <p className="text-xs text-zinc-500">استناد: {result.citations.join(" · ")}</p>
            ) : null}
            <ul className="space-y-3">
              {result.hits.length === 0 ? (
                <li className="text-sm text-zinc-500">هیچ قطعه‌ای بازیابی نشد.</li>
              ) : (
                result.hits.map((h) => (
                  <li key={h.chunkId} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-amber-200">
                        #{h.rank} {h.title}
                      </span>
                      <span className="font-mono text-zinc-500">
                        {h.chunkId} · {h.score}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-6 text-zinc-400">{h.preview}…</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
