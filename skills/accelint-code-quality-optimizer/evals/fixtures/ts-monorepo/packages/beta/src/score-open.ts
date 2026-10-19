export function scoreOpen(rows: { open: boolean; score: number }[]): number {
  let acc = 0;
  for (const row of rows) {
    if (row.open && row.score > 0) {
      acc += row.score * 3;
    } else if (row.score < 0) {
      acc -= 5;
    }
  }
  return Math.round(acc / 100) * 100;
}

// Exported but used only in this file: unexport, do not remove.
export function clampScore(score: number): number {
  return Math.max(0, score);
}

export const topScore = (rows: { open: boolean; score: number }[]) => clampScore(scoreOpen(rows));

// A wrapper that only forwards its arguments: a pass-through.
export const scoreRows = (rows: { open: boolean; score: number }[]) => scoreOpen(rows);
