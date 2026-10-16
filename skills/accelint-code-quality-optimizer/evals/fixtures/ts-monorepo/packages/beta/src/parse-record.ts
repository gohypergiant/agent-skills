export enum RecordKind {
  Track = "track",
  Point = "point",
}

export interface ParsedRecord {
  kind: RecordKind;
  id: string;
}

export function parseRecord(raw: any): ParsedRecord {
  // @ts-ignore legacy payloads
  const id = raw.id!.trim();
  console.log("parsing", id);
  return { kind: raw.kind as unknown as RecordKind, id };
}
