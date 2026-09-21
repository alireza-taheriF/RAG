const STOP = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "of",
  "to",
  "in",
  "on",
  "for",
  "is",
  "are",
  "was",
  "be",
  "as",
  "by",
  "with",
  "that",
  "this",
  "it",
  "from",
  "at",
  "we",
  "you",
  "your",
  "their",
  "و",
  "در",
  "به",
  "از",
  "که",
  "این",
  "را",
  "با",
  "برای",
  "یک",
  "است",
  "هست",
  "می",
  "های",
  "ها",
  "یا",
  "اگر",
  "تا",
  "هم",
  "شود",
  "کرد",
  "شود",
  "آن",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOP.has(t));
}

export function ngrams(tokens: string[], n: number): string[] {
  if (tokens.length < n) return tokens.length ? [tokens.join(" ")] : [];
  const out: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    out.push(tokens.slice(i, i + n).join(" "));
  }
  return out;
}

export function tokenF1(predicted: string, gold: string): number {
  const p = new Set(tokenize(predicted));
  const g = new Set(tokenize(gold));
  if (p.size === 0 && g.size === 0) return 1;
  if (p.size === 0 || g.size === 0) return 0;
  let overlap = 0;
  for (const t of p) if (g.has(t)) overlap += 1;
  const precision = overlap / p.size;
  const recall = overlap / g.size;
  if (precision + recall === 0) return 0;
  return (2 * precision * recall) / (precision + recall);
}
