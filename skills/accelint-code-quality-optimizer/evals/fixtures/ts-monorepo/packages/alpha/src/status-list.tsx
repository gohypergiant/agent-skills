import { formatCount } from "@/format-count";

export function StatusList({ labels }: { labels: string[] }) {
  const Row = (label: string) => <li key={label}>{`${label} ${formatCount(label.length)}`}</li>;
  return <ul>{labels.map(Row)}</ul>;
}
