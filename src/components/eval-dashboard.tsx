"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ConfigSummary, ItemMetrics, RagConfig } from "@/rag/types";

export type RagasReport = {
  ranAt: string;
  backend: string;
  embeddingModel: string;
  k: number;
  retrieval: {
    recallAtK: number;
    mrr: number;
    hitRate: number;
    nAnswerable: number;
  };
  abstention: {
    accuracy: number;
    unanswerable: number;
    unanswerableCorrect: number;
  };
  ragas: {
    status: string;
    reason?: string | null;
    nJudged?: number;
    faithfulness: number | null;
    answer_relevancy: number | null;
    context_precision: number | null;
  };
};

export type EvalResponse = {
  ranAt: string;
  durationMs: number;
  corpus: { documents: number; chunks: number; avgTokens: number };
  gold: { n: number; answerable: number; unanswerable: number };
  configs: RagConfig[];
  summaries: ConfigSummary[];
  items: ItemMetrics[];
  traces: Array<{
    questionId: string;
    question: string;
    kind: string;
    configId: string;
    abstained: boolean;
    answer: string;
    hitDocIds: string[];
  }>;
  error?: string;
};

function pct(n: number) {
  return `${Math.round(n * 1000) / 10}%`;
}

function metric(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return pct(value);
}

export function EvalDashboard({
  initial,
  ragasReport,
}: {
  initial: EvalResponse;
  ragasReport?: RagasReport | null;
}) {
  const [data, setData] = useState<EvalResponse>(initial);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [configId, setConfigId] = useState("hybrid-k6");
  const [kind, setKind] = useState<"all" | "unanswerable" | "answerable">("all");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/eval", { method: "POST" });
      const json = (await res.json()) as EvalResponse;
      if (!res.ok) throw new Error(json.error ?? "eval failed");
      setData(json);
    } catch {
      setError("اجرای دوباره شکست خورد. جدول فعلی هنوز از اجرای سرور است.");
    } finally {
      setLoading(false);
    }
  }

  const winner = useMemo(() => {
    if (!data.summaries.length) return null;
    return [...data.summaries].sort(
      (a, b) =>
        b.hitRate + b.faithfulness + b.abstainAccuracy - (a.hitRate + a.faithfulness + a.abstainAccuracy)
    )[0];
  }, [data]);

  const traces = useMemo(() => {
    return data.traces.filter((t) => {
      if (t.configId !== configId) return false;
      if (kind === "unanswerable") return t.kind === "unanswerable";
      if (kind === "answerable") return t.kind !== "unanswerable";
      return true;
    });
  }, [data, configId, kind]);

  return (
    <div className="space-y-8">
      {error ? (
        <p className="rounded-2xl border border-rose-900/60 bg-rose-950/40 p-3 text-sm text-rose-200">{error}</p>
      ) : null}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500">
            {data.gold.n} سؤال ({data.gold.answerable} قابل‌پاسخ · {data.gold.unanswerable} خارج از دامنه) ·{" "}
            {data.corpus.documents} سند · {data.corpus.chunks} قطعه · {data.durationMs}ms
          </p>
          {winner ? (
            <p className="mt-2 text-sm text-amber-100">
              روی این holdout، پیکربندی نسبتاً متعادل: <strong>{winner.label}</strong> با hit rate{" "}
              {pct(winner.hitRate)} و دقت امتناع {pct(winner.abstainAccuracy)}.
            </p>
          ) : null}
        </div>
        <Button variant="outline" className="border-zinc-700" onClick={() => void load()} disabled={loading}>
          {loading ? "در حال اجرا…" : "اجرای دوباره"}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-zinc-800">
        <table className="w-full min-w-[720px] text-right text-sm">
          <thead className="bg-zinc-900 text-xs text-zinc-400">
            <tr>
              {[
                "پیکربندی",
                "Recall@k",
                "MRR",
                "nDCG",
                "Hit",
                "Answer F1",
                "وفاداری",
                "ادعای بی‌منبع",
                "دقت امتناع",
                "p50",
                "p95",
              ].map((h) => (
                <th key={h} className="px-3 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.summaries.map((row) => (
              <tr
                key={row.configId}
                className={`border-t border-zinc-800 ${
                  row.configId === winner?.configId ? "bg-amber-400/5" : ""
                }`}
              >
                <td className="px-3 py-3 font-medium text-zinc-100">{row.label}</td>
                <td className="px-3 py-3 font-mono text-xs">{pct(row.recallAtK)}</td>
                <td className="px-3 py-3 font-mono text-xs">{pct(row.mrr)}</td>
                <td className="px-3 py-3 font-mono text-xs">{pct(row.ndcgAtK)}</td>
                <td className="px-3 py-3 font-mono text-xs">{pct(row.hitRate)}</td>
                <td className="px-3 py-3 font-mono text-xs">{pct(row.answerF1)}</td>
                <td className="px-3 py-3 font-mono text-xs">{pct(row.faithfulness)}</td>
                <td className="px-3 py-3 font-mono text-xs">{pct(row.unsupportedRate)}</td>
                <td className="px-3 py-3 font-mono text-xs">{pct(row.abstainAccuracy)}</td>
                <td className="px-3 py-3 font-mono text-xs">{row.p50LatencyMs.toFixed(2)}ms</td>
                <td className="px-3 py-3 font-mono text-xs">{row.p95LatencyMs.toFixed(2)}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ragasReport ? (
        <section className="space-y-3 rounded-3xl border border-zinc-800 p-4">
          <div>
            <h2 className="text-base font-medium text-zinc-100">بازیابی متراکم · FAISS</h2>
            <p className="mt-1 text-xs leading-6 text-zinc-500">
              این جدول جدا از هارنس واژگانی بالاست. مدل {ragasReport.embeddingModel}، k={ragasReport.k}،{" "}
              {ragasReport.retrieval.nAnswerable} سؤال قابل‌پاسخ. سؤال‌های خارج از دامنه فقط برای امتناع حساب
              می‌شوند.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-right text-sm">
              <thead className="text-xs text-zinc-400">
                <tr>
                  {["Recall@k", "MRR", "Hit", "دقت امتناع", "وفاداری ragas", "ربط پاسخ", "دقت زمینه"].map(
                    (heading) => (
                      <th key={heading} className="px-3 py-2 font-medium">
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-zinc-800">
                  <td className="px-3 py-3 font-mono text-xs">{pct(ragasReport.retrieval.recallAtK)}</td>
                  <td className="px-3 py-3 font-mono text-xs">{pct(ragasReport.retrieval.mrr)}</td>
                  <td className="px-3 py-3 font-mono text-xs">{pct(ragasReport.retrieval.hitRate)}</td>
                  <td className="px-3 py-3 font-mono text-xs">{pct(ragasReport.abstention.accuracy)}</td>
                  <td className="px-3 py-3 font-mono text-xs">{metric(ragasReport.ragas.faithfulness)}</td>
                  <td className="px-3 py-3 font-mono text-xs">{metric(ragasReport.ragas.answer_relevancy)}</td>
                  <td className="px-3 py-3 font-mono text-xs">{metric(ragasReport.ragas.context_precision)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs leading-6 text-zinc-500">
            امتناع روی سؤال‌های خارج از دامنه: {ragasReport.abstention.unanswerableCorrect} از{" "}
            {ragasReport.abstention.unanswerable}.{" "}
            {ragasReport.ragas.status === "ok"
              ? `داور ragas روی ${ragasReport.ragas.nJudged ?? 0} پاسخ غیرممتنع اجرا شده است.`
              : `داور ragas اجرا نشده است. ${ragasReport.ragas.reason ?? ""}`}
          </p>
        </section>
      ) : null}

      <p className="text-xs leading-6 text-zinc-500">
        Recall/MRR/nDCG فقط روی سؤال‌های قابل‌پاسخ میانگین گرفته شده‌اند. کنترل «بدون بازیابی» باید امتناع کند.
        وفاداری با همپوشانی ۳-گرام پاسخ و زمینه تقریب زده می‌شود، نه با داور LLM.
      </p>

      <div className="flex flex-wrap gap-2">
        {data.configs.map((c) => (
          <Button
            key={c.id}
            size="sm"
            variant={configId === c.id ? "default" : "outline"}
            className={
              configId === c.id
                ? "bg-amber-400 text-zinc-950 hover:bg-amber-300"
                : "border-zinc-700 bg-transparent"
            }
            onClick={() => setConfigId(c.id)}
          >
            ردپا: {c.label}
          </Button>
        ))}
        <Button
          size="sm"
          variant="outline"
          className="border-zinc-700"
          onClick={() => setKind(kind === "unanswerable" ? "all" : "unanswerable")}
        >
          {kind === "unanswerable" ? "همهٔ انواع" : "فقط خارج از دامنه"}
        </Button>
      </div>

      <ul className="space-y-3">
        {traces.slice(0, 24).map((t) => (
          <li key={`${t.configId}-${t.questionId}`} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
              <span>
                {t.questionId} · {t.kind}
              </span>
              <span>{t.abstained ? "امتناع" : "پاسخ"}</span>
            </div>
            <p className="mt-2 text-sm text-zinc-200">{t.question}</p>
            <p className="mt-2 text-sm leading-7 text-zinc-400">{t.answer}</p>
            <p className="mt-2 font-mono text-[11px] text-zinc-600">
              docs: {t.hitDocIds.join(", ") || "—"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
