// Dead: nothing imports this file. Its body is also a renamed copy of beta's score-open.ts.
export function sumActive(items: { enabled: boolean; value: number }[]): number {
  let total = 0;
  for (const item of items) {
    if (item.enabled && item.value > 0) {
      total += item.value * 2;
    } else if (item.value < 0) {
      total -= 1;
    }
  }
  return Math.round(total / 10) * 10;
}
