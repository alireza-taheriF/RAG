"use client";

import { useMemo, useState } from "react";
import {
  antiProjects,
  categoryLabel,
  projects,
  stackAdvice,
  type Category,
  type Goal,
  type Project,
} from "@/data/projects";
import { impactBlurb, overallScore, scoreLabel } from "@/lib/scoring";
import { ScoreMeter } from "@/components/score-meter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const goals: { id: Goal; title: string; desc: string }[] = [
  {
    id: "both",
    title: "هر دو مسیر",
    desc: "اگر هنوز بین PhD و صنعت مرددی؛ برای اکثر دانشجویان ترم ۳ همین درست است.",
  },
  {
    id: "phd",
    title: "ورود پژوهشی (PhD)",
    desc: "مقاله، داستان پژوهشی، بازتولید. مناسب‌ترین مسیر عملی ایران→آمریکا برای خیلی‌ها.",
  },
  {
    id: "industry",
    title: "ورود صنعتی",
    desc: "سیستم قابل‌اثبات، eval، OSS. استخدام مستقیم آمریکا از ایران سخت است؛ این‌ها پله می‌سازند.",
  },
];

const categories: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "research", label: "پژوهش" },
  { id: "systems", label: "سیستم" },
  { id: "llm", label: "LLM" },
  { id: "oss", label: "متن‌باز" },
  { id: "data", label: "داده" },
  { id: "competition", label: "مسابقه" },
  { id: "writing", label: "نوشتن" },
];

function termBadge(fit: Project["termFit"]) {
  if (fit === "core") return { label: "کار اصلی ترم ۳", className: "bg-amber-400 text-zinc-950" };
  if (fit === "high") return { label: "هم‌زمان شدنی", className: "bg-teal-400/90 text-zinc-950" };
  if (fit === "medium") return { label: "اگر ظرفیت داری", className: "bg-zinc-600 text-zinc-50" };
  return { label: "بعداً / مشروط", className: "bg-zinc-800 text-zinc-300" };
}

export function ProjectExplorer() {
  const [goal, setGoal] = useState<Goal>("both");
  const [category, setCategory] = useState<Category | "all">("all");
  const [openId, setOpenId] = useState<string | null>("thesis-paper");

  const ranked = useMemo(() => {
    return projects
      .filter((p) => category === "all" || p.category === category)
      .map((p) => ({ project: p, score: overallScore(p, goal) }))
      .sort((a, b) => b.score - a.score || a.project.rankHint - b.project.rankHint);
  }, [goal, category]);

  const topThree = useMemo(() => {
    return projects
      .map((p) => ({ project: p, score: overallScore(p, goal) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [goal]);

  return (
    <div className="space-y-10">
      <section className="grid gap-3 md:grid-cols-3">
        {goals.map((g) => {
          const active = goal === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setGoal(g.id)}
              className={`rounded-2xl border p-4 text-right transition ${
                active
                  ? "border-amber-400/70 bg-amber-400/10 shadow-[0_0_0_1px_rgba(251,191,36,0.2)]"
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600"
              }`}
            >
              <div className="text-sm font-semibold text-zinc-50">{g.title}</div>
              <p className="mt-2 text-xs leading-6 text-zinc-400">{g.desc}</p>
            </button>
          );
        })}
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5 md:p-7">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-50">اگر ترم ۳ فقط سه کار بکنی</h2>
            <p className="mt-1 max-w-2xl text-sm leading-7 text-zinc-400">
              امتیازها نسبت به هدف انتخاب‌شده وزن می‌شوند. ستون اصلی رزومه باید کم‌تعداد و عمیق باشد، نه لیست بلند پروژه‌های درسی.
            </p>
          </div>
          <p className="text-xs text-zinc-500">مرتب‌شده برای: {goals.find((g) => g.id === goal)?.title}</p>
        </div>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {topThree.map(({ project, score }, i) => (
            <li
              key={project.id}
              className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4"
            >
              <span className="font-mono text-3xl font-bold text-amber-400/80">{i + 1}</span>
              <h3 className="mt-2 text-sm font-medium leading-6 text-zinc-100">{project.titleFa}</h3>
              <p className="mt-3 font-mono text-2xl font-semibold text-amber-200">
                {score.toFixed(1)}
                <span className="text-sm text-zinc-500"> /۱۰</span>
              </p>
              <p className="mt-1 text-xs text-zinc-500">{impactBlurb(score)}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 rounded-2xl bg-zinc-900 p-4">
          <p className="text-xs font-medium text-zinc-300">بسته پیشنهادی همین ترم</p>
          <ul className="mt-2 list-disc space-y-1 pr-5 text-sm leading-7 text-zinc-400">
            {stackAdvice[goal].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Button
              key={c.id}
              type="button"
              size="sm"
              variant={category === c.id ? "default" : "outline"}
              onClick={() => setCategory(c.id)}
              className={
                category === c.id
                  ? "bg-amber-400 text-zinc-950 hover:bg-amber-300"
                  : "border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800"
              }
            >
              {c.label}
            </Button>
          ))}
        </div>

        <p className="text-xs text-zinc-500">{ranked.length} پروژه در این نما</p>

        <div className="space-y-4">
          {ranked.map(({ project, score }, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              score={score}
              rank={index + 1}
              open={openId === project.id}
              onToggle={() => setOpenId(openId === project.id ? null : project.id)}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-zinc-800 bg-zinc-950 text-zinc-100 ring-zinc-800">
          <CardHeader>
            <CardTitle>کارهایی که رزومه را ضعیف می‌کنند</CardTitle>
            <CardDescription className="text-zinc-400">
              این‌ها رایج‌اند و معمولاً سیگنال منفی یا خنثی می‌دهند.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {antiProjects.map((item) => (
              <div key={item.title} className="border-b border-zinc-800 pb-3 last:border-0">
                <p className="text-sm font-medium text-rose-200">{item.title}</p>
                <p className="mt-1 text-sm leading-7 text-zinc-400">{item.reason}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950 text-zinc-100 ring-zinc-800">
          <CardHeader>
            <CardTitle>چطور امتیاز داده‌ام</CardTitle>
            <CardDescription className="text-zinc-400">
              عددها نظر قطعی بازار نیستند؛ وزن‌دهی صریح برای پروفایل توست: ارشد AI، ترم ۳، مقصد آمریکا.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-zinc-300">
            <p>
              <span className="text-amber-200">اهمیت:</span> آیا این کار در ۱۲ ماه آینده ارزش وقت پایان‌نامه را دارد؟
            </p>
            <p>
              <span className="text-amber-200">تأثیر رزومه:</span> چقدر یک ریکروتر یا کمیته در ۳۰ ثانیه آن را می‌فهمد و باور می‌کند؟
            </p>
            <p>
              <span className="text-amber-200">PhD:</span> مقاله، دیتاست، بازتولید، نامه توصیه.
            </p>
            <p>
              <span className="text-amber-200">صنعت:</span> سیستم، متریک، OSS، سرو کردن مدل.
            </p>
            <p className="text-zinc-500">
              امتیاز کلی = ترکیب وزن‌دار همین چهار عدد بر اساس هدفی که بالا انتخاب کردی. کار «حیاتی» یعنی بدون آن رزومه برای آمریکا ناقص می‌ماند؛ کار «اختیاری» یعنی فقط بعد از ستون اصلی.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ProjectCard({
  project,
  score,
  rank,
  open,
  onToggle,
}: {
  project: Project;
  score: number;
  rank: number;
  open: boolean;
  onToggle: () => void;
}) {
  const fit = termBadge(project.termFit);
  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/90">
      <button type="button" onClick={onToggle} className="w-full p-5 text-right md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 font-mono text-lg text-amber-300">
              {rank}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold leading-7 text-zinc-50">{project.titleFa}</h3>
                <Badge className={fit.className}>{fit.label}</Badge>
                <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                  {categoryLabel[project.category]}
                </Badge>
              </div>
              <p className="mt-1 font-mono text-xs text-zinc-500">{project.titleEn}</p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">{project.why}</p>
            </div>
          </div>
          <div className="shrink-0 rounded-2xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-center">
            <div className="text-[11px] text-zinc-500">امتیاز کلی این هدف</div>
            <div className="font-mono text-3xl font-bold text-amber-300">{score.toFixed(1)}</div>
            <div className="text-xs text-amber-100/80">{scoreLabel(score)}</div>
            <div className="mt-1 text-[11px] text-zinc-500">{impactBlurb(score)}</div>
          </div>
        </div>
      </button>

      {open ? (
        <div className="border-t border-zinc-800 px-5 pb-6 md:px-6">
          <div className="grid gap-6 py-5 md:grid-cols-4">
            <ScoreMeter
              label="اهمیت (چقدر وقت بگذار)"
              value={project.importance}
              hint="نسبت به بقیه گزینه‌های همین ترم"
              accent="gold"
            />
            <ScoreMeter
              label="تأثیر روی رزومه"
              value={project.resumeImpact}
              hint="قابل‌اسکن و قابل‌باور بودن"
              accent="gold"
            />
            <ScoreMeter
              label="مسیر PhD آمریکا"
              value={project.phdImpact}
              hint="کمیته پذیرش و نامه توصیه"
              accent="teal"
            />
            <ScoreMeter
              label="مسیر صنعت"
              value={project.industryImpact}
              hint="ML engineer / applied scientist"
              accent="teal"
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
            <span className="rounded-full bg-zinc-900 px-3 py-1">زمان: {project.effortWeeks}</span>
            <span className="rounded-full bg-zinc-900 px-3 py-1">سختی: {project.difficulty}/۵</span>
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-zinc-900 px-3 py-1">
                {tag}
              </span>
            ))}
          </div>

          <Tabs defaultValue="why" className="mt-6">
            <TabsList className="h-auto w-full flex-wrap justify-start bg-zinc-900">
              <TabsTrigger value="why" className="px-3">
                چرا مهم است
              </TabsTrigger>
              <TabsTrigger value="resume" className="px-3">
                اثر روی رزومه
              </TabsTrigger>
              <TabsTrigger value="us" className="px-3">
                مسیر آمریکا
              </TabsTrigger>
              <TabsTrigger value="do" className="px-3">
                چطور بزن
              </TabsTrigger>
              <TabsTrigger value="line" className="px-3">
                خط رزومه
              </TabsTrigger>
            </TabsList>
            <TabsContent value="why" className="mt-4 text-sm leading-8 text-zinc-300">
              {project.why}
            </TabsContent>
            <TabsContent value="resume" className="mt-4 text-sm leading-8 text-zinc-300">
              {project.resumeWhy}
            </TabsContent>
            <TabsContent value="us" className="mt-4 text-sm leading-8 text-zinc-300">
              {project.usWhy}
            </TabsContent>
            <TabsContent value="do" className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-zinc-100">خروجی قابل‌قبول</h4>
                <ul className="mt-2 list-disc space-y-1 pr-5 text-sm leading-7 text-zinc-400">
                  {project.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-zinc-100">نقشه اجرا</h4>
                <ul className="mt-2 list-disc space-y-1 pr-5 text-sm leading-7 text-zinc-400">
                  {project.plan.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-rose-200">غلط‌های رایج</h4>
                <ul className="mt-2 list-disc space-y-1 pr-5 text-sm leading-7 text-zinc-400">
                  {project.pitfalls.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="line" className="mt-4">
              <pre className="overflow-x-auto rounded-2xl bg-zinc-900 p-4 text-left font-mono text-xs leading-6 text-amber-100 whitespace-pre-wrap">
                {project.resumeLine}
              </pre>
            </TabsContent>
          </Tabs>
        </div>
      ) : null}
    </article>
  );
}

export function ContextNotes() {
  return (
    <Accordion className="rounded-3xl border border-zinc-800 bg-zinc-950 px-4">
      <AccordionItem value="iran-us">
        <AccordionTrigger className="text-right text-zinc-100 hover:no-underline">
          واقعیت مسیر ایران → آمریکا در AI (بخوان قبل از شروع ده پروژه)
        </AccordionTrigger>
        <AccordionContent className="text-zinc-400">
          <div className="space-y-3 pb-2 text-sm leading-8">
            <p>
              استخدام تمام‌وقت شرکت آمریکایی وقتی هنوز در ایران هستی معمولاً به‌خاطر تحریم، بانک، و محدودیت تصدیق هویت practically بسته یا بسیار سخت است. رزومه قوی این در را جادویی باز نمی‌کند؛ رزومه قوی مسیرهایی را باز می‌کند که بعداً به آمریکا می‌رسند: پذیرش PhD با فاند، مستر با حمایت، ریموت/جابجایی از اروپا یا کانادا، یا اینترنشیپ بعد از ورود با ویزای دانشجویی.
            </p>
            <p>
              برای خیلی از دانشجویان ارشد AI ایران، <strong className="font-medium text-zinc-200">مقاله + استاد قوی + انگلیسی + یک آرتیفکت عمومی</strong> هنوز بالاترین امید ریاضی برای خاک آمریکاست. صنعت را کنار نگذار؛ فقط انتظار «آفر گوگل از تهران» را ستون برنامه نکن.
            </p>
            <p>
              ترم ۳ را با ده پروژه موازی نکش. یک داستان بساز: سؤال پژوهشی، سیستم، عدد، لینک. بقیه تزئین است.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
