import { EvalDashboard } from "@/components/eval-dashboard";
import { compactHarness, runHarness } from "@/rag/harness";

export default function EvalPage() {
  const initial = compactHarness(runHarness());
  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 md:px-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs text-amber-200">هارنس · ۴۸ سؤال طلایی · ۵ پیکربندی</p>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">ارزیابی آفلاین RAG</h1>
          <p className="text-sm leading-8 text-zinc-400 md:text-base">
            Recall@k، MRR، nDCG، همپوشانی پاسخ با طلایی، وفاداری به زمینه، نرخ ادعای بدون منبع، دقت امتناع، و p50/p95 تأخیر.
            کنترل منفی بدون بازیابی باید حدس نزند.
          </p>
        </div>
        <EvalDashboard initial={initial} />
      </main>
    </div>
  );
}
