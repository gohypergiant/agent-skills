import * as path from "node:path";
import { vi } from "vitest";
import type { CliRuntime as AppendRuntime } from "../cli/append-json-summary-entry";
import type { CliRuntime as MarkdownRuntime } from "../cli/create-markdown-summary";

type AppendRuntimeOverrides = Omit<Partial<AppendRuntime>, "fs" | "path"> & {
  fs?: Partial<AppendRuntime["fs"]>;
  path?: Partial<AppendRuntime["path"]>;
};

type MarkdownRuntimeOverrides = Omit<Partial<MarkdownRuntime>, "fs" | "path"> & {
  fs?: Partial<MarkdownRuntime["fs"]>;
  path?: Partial<MarkdownRuntime["path"]>;
};

type RuntimeState<T> = {
  runtime: T;
  logs: string[];
  errors: string[];
};

export function makeAppendRuntime(
  overrides?: AppendRuntimeOverrides
): RuntimeState<AppendRuntime> {
  const logs: string[] = [];
  const errors: string[] = [];

  const defaultRuntime: AppendRuntime = {
    fs: {
      existsSync: vi.fn() as unknown as AppendRuntime["fs"]["existsSync"],
      readFileSync: vi.fn() as unknown as AppendRuntime["fs"]["readFileSync"],
      mkdirSync: vi.fn() as unknown as AppendRuntime["fs"]["mkdirSync"],
      writeFileSync: vi.fn() as unknown as AppendRuntime["fs"]["writeFileSync"],
    },
    path: {
      dirname: path.dirname,
    },
    log: vi.fn((...args: unknown[]) => logs.push(args.join(" "))),
    error: vi.fn((...args: unknown[]) => errors.push(args.join(" "))),
  };

  const runtime: AppendRuntime = {
    ...defaultRuntime,
    ...overrides,
    fs: { ...defaultRuntime.fs, ...overrides?.fs },
    path: { ...defaultRuntime.path, ...overrides?.path },
  };

  return { runtime, logs, errors };
}

export function makeMarkdownRuntime(
  overrides?: MarkdownRuntimeOverrides
): RuntimeState<MarkdownRuntime> {
  const logs: string[] = [];
  const errors: string[] = [];

  const defaultRuntime: MarkdownRuntime = {
    fs: {
      readFileSync: vi.fn() as unknown as MarkdownRuntime["fs"]["readFileSync"],
      mkdirSync: vi.fn() as unknown as MarkdownRuntime["fs"]["mkdirSync"],
      writeFileSync: vi.fn() as unknown as MarkdownRuntime["fs"]["writeFileSync"],
    },
    path: {
      dirname: path.dirname,
    },
    log: vi.fn((...args: unknown[]) => logs.push(args.join(" "))),
    error: vi.fn((...args: unknown[]) => errors.push(args.join(" "))),
  };

  const runtime: MarkdownRuntime = {
    ...defaultRuntime,
    ...overrides,
    fs: { ...defaultRuntime.fs, ...overrides?.fs },
    path: { ...defaultRuntime.path, ...overrides?.path },
  };

  return { runtime, logs, errors };
}
