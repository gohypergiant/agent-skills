import { describe, expect, it } from "vitest";
import { _starPatternToRegex } from "../cli/generate-tests"; 

describe("starPatternToRegex", () => {
  it("matches any string when pattern is '*'", () => {
    const regex = _starPatternToRegex("*");
    expect(regex.test("")).toBe(true);
    expect(regex.test("a")).toBe(true);
    expect(regex.test("abc")).toBe(true);
    expect(regex.test("a/b")).toBe(true);
  });

  it("matches '*.json' patterns", () => {
    const regex = _starPatternToRegex("*.json");
    expect(regex.test("a.json")).toBe(true);
    expect(regex.test("sample-app.json")).toBe(true);
    expect(regex.test("a.json.bak")).toBe(false);
  });

  it("matches prefix patterns like 'sample-*.json'", () => {
    const regex = _starPatternToRegex("sample-*.json");
    expect(regex.test("sample-a.json")).toBe(true);
    expect(regex.test("sample-app.json")).toBe(true);
    expect(regex.test("samples-app.json")).toBe(false);
    expect(regex.test("sample-app.json.bak")).toBe(false);
  });

  it("handles multiple stars", () => {
    const regex = _starPatternToRegex("a*b*c.json");
    expect(regex.test("abc.json")).toBe(true);
    expect(regex.test("aZZbYYc.json")).toBe(true);
    expect(regex.test("aZZbYYc.json.bak")).toBe(false);
  });

  it("treats regex metacharacters literally", () => {
    const regex = _starPatternToRegex("file(1)*.json");
    expect(regex.test("file(1).json")).toBe(true);
    expect(regex.test("file(1)abc.json")).toBe(true);
    expect(regex.test("file11abc.json")).toBe(false);
  });

  it("is anchored (matches the entire filename)", () => {
    const regex = _starPatternToRegex("a.json");
    expect(regex.test("a.json")).toBe(true);
    expect(regex.test("xa.json")).toBe(false);
    expect(regex.test("a.jsonx")).toBe(false);
  });

  it("produces an anchored regex source", () => {
    const regex = _starPatternToRegex("*.json");
    expect(regex.source.startsWith("^")).toBe(true);
    expect(regex.source.endsWith("$")).toBe(true);
  });
});
