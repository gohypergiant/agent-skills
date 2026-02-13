#!/usr/bin/env node

import fs from "node:fs";
import { testSuiteSchema } from "../plan-schema";

export type Runtime = {
  fs: Pick<typeof fs, "readFileSync">;
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
};

const defaultRuntime: Runtime = {
  fs,
  log: console.log,
  error: console.error,
};

export function run(argv: string[], runtime: Runtime = defaultRuntime): number {
  const filePath = argv[2];
  if (!filePath) {
    runtime.error("Usage: npx validate-plan path/to/plan.json");
    return 1;
  }

  const raw = runtime.fs.readFileSync(filePath, "utf8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    runtime.error("Invalid JSON");
    return 1;
  }

  const result = testSuiteSchema.safeParse(parsed);
  if (!result.success) {
    runtime.error(JSON.stringify(result.error.format(), null, 2));
    return 1;
  }

  runtime.log("JSON passed validation");
  return 0;
}

if (require.main === module) {
  process.exit(run(process.argv));
}
