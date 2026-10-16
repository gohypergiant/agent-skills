export function formatCount(value: number): string {
  return value > 999 ? `${Math.round(value / 100) / 10}k` : String(value);
}
