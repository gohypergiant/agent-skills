import { badgeText } from "./badge-for-record";
import { RecordKind } from "./parse-record";

type StoredRecord = { id: string; savedAt: number };

export class RecordStore {
  static capacity = 100;
  private items: StoredRecord[] = [];

  add(record: StoredRecord): StoredRecord {
    this.items.push(record);
    return record;
  }

  label(record: StoredRecord): string {
    return badgeText({ kind: RecordKind.Track, id: record.id }, this.items.length);
  }
}
