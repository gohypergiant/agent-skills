import { z } from "zod";
import { modifierKeyValidator, pressKeyValidator } from "./keyboard-key-validator";
import { mouseButtonValidator, wheelDirectionValidator } from "./mouse-validator";

/**
 * Step schemas
 */
const clickStep = z.object({
  action: z.literal("click"),
  target: z.string(),
}).strict();

const doubleClickStep = z.object({
  action: z.literal("doubleClick"),
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  button: mouseButtonValidator.optional().default("left"),
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

const keyDownStep = z.object({
  action: z.literal("keyDown"),
  value: modifierKeyValidator,
}).strict();

const keyUpStep = z.object({
  action: z.literal("keyUp"),
  value: modifierKeyValidator,
}).strict();

const mouseClickStep = z.object({
  action: z.literal("mouseClick"),
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  button: mouseButtonValidator.optional().default("left"),
}).strict();

const mouseDownStep = z.object({
  action: z.literal("mouseDown"),
  button: mouseButtonValidator.optional().default("left"),
}).strict();

const mouseMoveStep = z.object({
  action: z.literal("mouseMove"),
  x: z.number().int().min(0),
  y: z.number().int().min(0),
}).strict();

const mouseUpStep = z.object({
  action: z.literal("mouseUp"),
  button: mouseButtonValidator.optional().default("left"),
}).strict();

const pressStep = z.object({
  action: z.literal("press"),
  value: pressKeyValidator,
}).strict();

const scrollStep = z.object({
  action: z.literal("scroll"),
  direction: wheelDirectionValidator,
  amount: z.number().int().positive(),
}).strict();

const selectStep = z.object({
  action: z.literal("select"),
  target: z.string(),
  value: z.string(),
}).strict();

export const stepSchema = z.discriminatedUnion("action", [
  clickStep,
  doubleClickStep,
  expectNotVisibleStep,
  expectTextStep,
  expectUrlStep,
  expectVisibleStep,
  fillStep,
  gotoStep,
  keyDownStep,
  keyUpStep,
  mouseClickStep,
  mouseDownStep,
  mouseMoveStep,
  mouseUpStep,
  pressStep,
  scrollStep,
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
