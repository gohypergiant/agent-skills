import { expect, it, vi } from "vitest";
import { parseRecord } from "../src/parse-record";

it("should parse a record", () => {
  const log = vi.spyOn(console, "log");
  expect(parseRecord({ id: " a ", kind: "track" })).toBeDefined();
  expect(log).toHaveBeenCalled();
});
