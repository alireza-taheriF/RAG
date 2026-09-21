import { ContextNotes, ProjectExplorer } from "@/components/project-explorer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(251,191,36,0.12),transparent_40%),radial-gradient(circle_at_90%_20%,rgba(45,212,191,0.1),transparent_35%)]" />
      <header className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-8 pt-10 md:px-6 md:pt-12">
        <p className="w-fit rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">
          ارشد AI · ترم ۳ · ایران → آمریکا
        </p>
        <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-50 md:text-5xl md:leading-[1.15]">
            پروژه‌هایی که رزومهٔ هوش مصنوعی‌ات را برای آمریکا واقعاً جلو می‌برند
          </h1>
          <p className="text-base leading-8 text-zinc-400 md:text-lg">
            این یک لیست انگیزشی از «ایده‌های باحال» نیست. هر مورد امتیاز اهمیت، تأثیر رزومه، ارزش برای PhD و ارزش برای صنعت دارد، با دلیل و نقشه اجرا. فرض پروفایل: دانشجوی ارشد هوش مصنوعی در ترم ۳ که می‌خواهد از ایران خارج شود و مقصد نهایی‌اش آمریکاست.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/lab"
            className="rounded-full bg-amber-400 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-300"
          >
            سیستم RAG را باز کن
          </Link>
          <Link
            href="/eval"
            className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
          >
            جدول هارنس ارزیابی
          </Link>
        </div>
        <ContextNotes />
      </header>
      <main className="relative mx-auto w-full max-w-6xl px-4 pb-24 md:px-6">
        <ProjectExplorer />
      </main>
    </div>
  );
}
