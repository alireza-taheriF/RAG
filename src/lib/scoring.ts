import { type Goal, type Project } from "@/data/projects";

export function overallScore(project: Project, goal: Goal): number {
  const { phdImpact, industryImpact, resumeImpact, importance } = project;
  let weighted: number;
  if (goal === "phd") {
    weighted = 0.55 * phdImpact + 0.2 * resumeImpact + 0.1 * industryImpact + 0.15 * importance;
  } else if (goal === "industry") {
    weighted =
      0.55 * industryImpact + 0.2 * resumeImpact + 0.1 * phdImpact + 0.15 * importance;
  } else {
    weighted =
      0.32 * phdImpact + 0.32 * industryImpact + 0.2 * resumeImpact + 0.16 * importance;
  }
  return Math.round(weighted * 10) / 10;
}

export function scoreLabel(score: number): string {
  if (score >= 9) return "حیاتی";
  if (score >= 8) return "خیلی بالا";
  if (score >= 7) return "بالا";
  if (score >= 6) return "متوسط رو به بالا";
  return "اختیاری";
}

export function impactBlurb(score: number): string {
  if (score >= 9.2) return "می‌تواند محور رزومه باشد";
  if (score >= 8.5) return "تأثیر قوی روی رزومه";
  if (score >= 7.5) return "تأثیر واضح اگر خوب اجرا شود";
  if (score >= 6.5) return "مکمل است، نه ستون اصلی";
  return "فقط اگر وقت اضافه داری";
}
