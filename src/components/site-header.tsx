import Link from "next/link";

const links = [
  { href: "/", label: "نقشه رزومه" },
  { href: "/lab", label: "سیستم RAG" },
  { href: "/eval", label: "هارنس ارزیابی" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/lab" className="text-sm font-semibold tracking-tight text-amber-200">
          سنجش
          <span className="mr-2 font-mono text-[10px] text-zinc-500">SANJESH</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
