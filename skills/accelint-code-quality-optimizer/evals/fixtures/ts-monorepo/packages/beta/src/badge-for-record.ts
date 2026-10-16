import { formatCount } from "@fixture/alpha";
import type { ParsedRecord } from "./parse-record";

export function badgeText(record: ParsedRecord, count: number): string {
  return `${record.id} (${formatCount(count)})`;
}
