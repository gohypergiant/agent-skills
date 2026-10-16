import type { ParsedRecord } from "./parse-record";

export default function pickRecords(records: ParsedRecord[], kind: string) {
  return records.filter((record) => record.kind === (kind as ParsedRecord["kind"]));
}
