import type * as fs from "node:fs";
import * as path from "node:path";
import { vi } from "vitest";
import { _extractSourceDescription, type CliRuntime } from "../cli/generate-tests";

type FakeDirent = { name: string };

type FakeStat = {
  isDirectory: () => boolean;
  isFile: () => boolean;
};

type RuntimeOverrides = Omit<Partial<CliRuntime>, "fs" | "path"> & {
  fs?: Partial<CliRuntime["fs"]>;
  path?: Partial<CliRuntime["path"]>;
};

type RuntimeState = {
  runtime: CliRuntime;
  dirListings: Map<string, FakeDirent[]>;
  dirs: Set<string>;
  files: Set<string>;
  logs: string[];
  errors: string[];
};

// Helper functions

// Makes sure paths are strings 
function toPathKey(p: Parameters<CliRuntime["fs"]["existsSync"]>[0]): string {
  if (typeof p === "string") return p;
  if (p instanceof URL) return p.pathname;
  return p.toString(); 
}

// Builds fake filesystem and runtime
export function makeRuntime(overrides?: RuntimeOverrides): RuntimeState {
  const dirListings = new Map<string, FakeDirent[]>();
  const dirs = new Set<string>();
  const files = new Set<string>();

  const logs: string[] = [];
  const errors: string[] = [];

  const defaultRuntime: CliRuntime = {
    fs: {
      existsSync: vi.fn((p) => {
        const key = toPathKey(p);
        return dirs.has(key) || files.has(key);
      }),

      statSync: vi.fn<CliRuntime["fs"]["statSync"]>((p) => {
        const key = toPathKey(p);

        const stat: FakeStat = {
          isDirectory: () => dirs.has(key),
          isFile: () => files.has(key),
        };

        return stat as fs.Stats;
      }),

      readdirSync: vi.fn((p) => {
        const entries = dirListings.get(toPathKey(p)) ?? [];
        // Return FakeDirent[] which has .name property used by production code
        return entries;
      }),

      readFileSync: vi.fn<CliRuntime["fs"]["readFileSync"]>(),
      mkdirSync: vi.fn<CliRuntime["fs"]["mkdirSync"]>(),
      writeFileSync: vi.fn<CliRuntime["fs"]["writeFileSync"]>(),
    },

    path: {
      resolve: path.resolve,
      dirname: path.dirname,
      basename: path.basename,
      join: path.join,
      isAbsolute: path.isAbsolute,
      parse: path.parse,
    },

    appendSummaryEntry: vi.fn(() => 0),
    createMarkdownSummary: vi.fn(() => 0),
    extractSourceDescription: _extractSourceDescription,
    now: () => new Date("2026-01-28T14:03:52Z"),
    log: vi.fn((...args: unknown[]) => logs.push(args.join(" "))),
    error: vi.fn((...args: unknown[]) => errors.push(args.join(" "))),
  };

  const runtime: CliRuntime = {
    ...defaultRuntime,
    ...overrides,
    fs: { ...defaultRuntime.fs, ...overrides?.fs },
    path: { ...defaultRuntime.path, ...overrides?.path },
  };

  return { runtime, dirListings, dirs, files, logs, errors };
}

// Populates the fake filesystem
export function addDir(state: RuntimeState, dirPath: string, entries: string[]): string {
  const abs = path.resolve(dirPath);
  state.dirs.add(abs);
  state.dirListings.set(abs, entries.map((name) => ({ name })));
  return abs;
}

// Populates the fake filesystem
export function addFile(state: RuntimeState, filePath: string): string {
  const abs = path.resolve(filePath);
  state.files.add(abs);
  return abs;
}
