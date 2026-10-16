import { expect, it } from "vitest";
import { formatCount } from "./format-count";

it("should format thousands", () => {
  expect(formatCount(1500)).toBe("1.5k");
  expect(formatCount(2)).toBeTruthy();
});
