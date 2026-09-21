import { cn } from "@/lib/utils";

export function ScoreMeter({
  label,
  value,
  hint,
  accent = "gold",
}: {
  label: string;
  value: number;
  hint?: string;
  accent?: "gold" | "teal" | "rose";
}) {
  const width = Math.min(100, Math.max(0, (value / 10) * 100));
  const bar =
    accent === "gold"
      ? "bg-gradient-to-l from-amber-300 to-orange-500"
      : accent === "teal"
        ? "bg-gradient-to-l from-teal-200 to-cyan-600"
        : "bg-gradient-to-l from-rose-200 to-rose-600";

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs text-zinc-300">{label}</span>
        <span className="font-mono text-sm font-semibold tabular-nums text-amber-100">
          {value.toFixed(1)}
          <span className="text-zinc-500">/10</span>
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={cn("h-full rounded-full transition-all duration-500", bar)}
          style={{ width: `${width}%` }}
        />
      </div>
      {hint ? <p className="text-[11px] leading-relaxed text-zinc-500">{hint}</p> : null}
    </div>
  );
}
