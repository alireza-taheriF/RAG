import { LabPlayground } from "@/components/lab-playground";
import Link from "next/link";

export default function LabPage() {
  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 md:px-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs text-amber-200">Grounded RAG · offline eval · no API key</p>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">آزمایشگاه RAG سنجش</h1>
          <p className="text-sm leading-8 text-zinc-400 md:text-base">
            BM25، TF-IDF و هیبرید RRF، پاسخ extractive با استناد، امتناع وقتی مدرک نیست.
            جدول متریک‌ها در{" "}
            <Link href="/eval" className="text-amber-200 underline-offset-4 hover:underline">
              هارنس ارزیابی
            </Link>
            .
          </p>
        </div>
        <LabPlayground />
      </main>
    </div>
  );
}
