import { z } from "zod";

/**
 * Step schemas
 */
const clickStep = z.object({
  action: z.literal("click"),
  target: z.string(),
}).strict();

const expectNotVisibleStep = z.object({
  action: z.literal("expectNotVisible"),
  target: z.string(),
}).strict();

const expectTextStep = z.object({
  action: z.literal("expectText"),
  target: z.string(),
  value: z.string(),
}).strict();

const expectUrlStep = z.object({
  action: z.literal("expectUrl"),
  value: z.string(),
}).strict();

const expectVisibleStep = z.object({
  action: z.literal("expectVisible"),
  target: z.string(),
}).strict();

const fillStep = z.object({
  action: z.literal("fill"),
  target: z.string(),
  value: z.string(),
}).strict();

const gotoStep = z.object({
  action: z.literal("goto"),
  value: z.string(),
}).strict();

const selectStep = z.object({
  action: z.literal("select"),
  target: z.string(),
  value: z.string(),
}).strict();

export const stepSchema = z.discriminatedUnion("action", [
  clickStep,
  expectNotVisibleStep,
  expectTextStep,
  expectUrlStep,
  expectVisibleStep,
  fillStep,
  gotoStep,
  selectStep,
]);

/**
 * Test + Suite schemas
 */
export const testSchema = z.object({
  name: z.string(),
  startUrl: z.string(),
  tags: z.array(z.string()).min(1).optional(),
  steps: z.array(stepSchema).min(1),
}).strict();

export const testSuiteSchema = z.object({
  suiteName: z.string(),
  tags: z.array(z.string()).min(1).optional(),
  source: z.object({
    repo: z.string(),
    path: z.string(),
  }).strict(),
  tests: z.array(testSchema).min(1),
}).strict();

export type TestSuite = z.infer<typeof testSuiteSchema>;
