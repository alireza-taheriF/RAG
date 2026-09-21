const RRF_K = 60;

export function rrf(rankLists: number[][], k = RRF_K): number[] {
  const n = rankLists[0]?.length ?? 0;
  const scores = new Array(n).fill(0);
  for (const scoresRaw of rankLists) {
    const order = scoresRaw
      .map((s, i) => [s, i] as const)
      .sort((a, b) => b[0] - a[0]);
    order.forEach(([, idx], rank) => {
      scores[idx] += 1 / (k + rank + 1);
    });
  }
  return scores;
}

export function topKIndices(scores: number[], k: number): number[] {
  return scores
    .map((s, i) => [s, i] as const)
    .filter(([s]) => s > 0)
    .sort((a, b) => b[0] - a[0])
    .slice(0, k)
    .map(([, i]) => i);
}
