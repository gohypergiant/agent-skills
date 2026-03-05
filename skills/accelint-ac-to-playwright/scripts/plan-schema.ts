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

const dragStep = z.object({
  action: z.literal("drag"),
  fromX: z.number().int().min(0),
  fromY: z.number().int().min(0),
  toX: z.number().int().min(0),
  toY: z.number().int().min(0),
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

const hoverStep = z.object({
  action: z.literal("hover"),
  target: z.string(),
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

const reloadStep = z.object({
  action: z.literal("reload"),
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
  dragStep,
  expectNotVisibleStep,
  expectTextStep,
  expectUrlStep,
  expectVisibleStep,
  fillStep,
  gotoStep,
  hoverStep,
  keyDownStep,
  keyUpStep,
  mouseClickStep,
  mouseDownStep,
  mouseMoveStep,
  mouseUpStep,
  pressStep,
  reloadStep,
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
}).superRefine((test, ctx) => {
  let unpairedMouseDown: { index: number; button: string } | null = null;
  let unpairedKeyDown: { index: number; value: string } | null = null;
  let hasError = false;

  for (let index = 0; index < test.steps.length; index++) {
    const step = test.steps[index];
    if (step.action === "mouseDown") {
      // If there's already an unpaired mouseDown, that's an error (regardless of button)
      if (unpairedMouseDown !== null) {
        ctx.addIssue({
          code: "custom",
          message: `mouseDown at step ${index} occurs before completing the previous mouseDown at step ${unpairedMouseDown.index}. Each mouseDown must be followed by exactly one mouseUp before another mouseDown.`,
          path: ["steps", index, "action"],
        });
        hasError = true;
        break;
      }
      // Track the button that was pressed (schema guarantees button exists via default)
      unpairedMouseDown = { index, button: step.button };
    } else if (step.action === "mouseUp") {
      // mouseUp without a preceding unpaired mouseDown is an error
      if (unpairedMouseDown === null) {
        ctx.addIssue({
          code: "custom",
          message: `mouseUp at step ${index} has no preceding mouseDown. mouseUp requires a mouseDown action earlier in the steps array.`,
          path: ["steps", index, "action"],
        });
        hasError = true;
        break;
      } else {
        // Check that the button matches (schema guarantees button exists via default)
        if (step.button !== unpairedMouseDown.button) {
          ctx.addIssue({
            code: "custom",
            message: `mouseUp at step ${index} uses button "${step.button}" but the paired mouseDown at step ${unpairedMouseDown.index} used button "${unpairedMouseDown.button}". The button must match between mouseDown and mouseUp.`,
            path: ["steps", index, "button"],
          });
          hasError = true;
          break;
        }
        // Pair completed, reset tracker
        unpairedMouseDown = null;
      }
    } else if (step.action === "keyDown") {
      // If there's already an unpaired keyDown, that's an error
      if (unpairedKeyDown !== null) {
        ctx.addIssue({
          code: "custom",
          message: `keyDown at step ${index} occurs before completing the previous keyDown at step ${unpairedKeyDown.index}. Each keyDown must be followed by exactly one keyUp before another keyDown.`,
          path: ["steps", index, "action"],
        });
        hasError = true;
        break;
      }
      // Track the modifier key that was pressed
      unpairedKeyDown = { index, value: step.value };
    } else if (step.action === "keyUp") {
      // keyUp without a preceding unpaired keyDown is an error
      if (unpairedKeyDown === null) {
        ctx.addIssue({
          code: "custom",
          message: `keyUp at step ${index} has no preceding keyDown. keyUp requires a keyDown action earlier in the steps array.`,
          path: ["steps", index, "action"],
        });
        hasError = true;
        break;
      } else {
        // Check that the modifier key matches
        if (step.value !== unpairedKeyDown.value) {
          ctx.addIssue({
            code: "custom",
            message: `keyUp at step ${index} uses key "${step.value}" but the paired keyDown at step ${unpairedKeyDown.index} used key "${unpairedKeyDown.value}". The modifier key must match between keyDown and keyUp.`,
            path: ["steps", index, "value"],
          });
          hasError = true;
          break;
        }
        // Pair completed, reset tracker
        unpairedKeyDown = null;
      }
    }
  }

  // After processing all steps, check if there's an unpaired mouseDown (only if no error yet)
  if (!hasError && unpairedMouseDown !== null) {
    ctx.addIssue({
      code: "custom",
      message: `mouseDown at step ${unpairedMouseDown.index} has no following mouseUp. Each mouseDown must be followed by exactly one mouseUp.`,
      path: ["steps", unpairedMouseDown.index, "action"],
    });
  }

  // Check if there's an unpaired keyDown (only if no error yet)
  if (!hasError && unpairedKeyDown !== null) {
    ctx.addIssue({
      code: "custom",
      message: `keyDown at step ${unpairedKeyDown.index} has no following keyUp. Each keyDown must be followed by exactly one keyUp.`,
      path: ["steps", unpairedKeyDown.index, "action"],
    });
  }

  // Validate visibility assertion pairing
  if (!hasError) {
    const visibilityAssertions: Array<{
      index: number;
      action: "expectVisible" | "expectNotVisible";
      target: string;
    }> = [];

    // Collect all visibility assertions
    test.steps.forEach((step, index) => {
      if (step.action === "expectVisible" || step.action === "expectNotVisible") {
        visibilityAssertions.push({
          index,
          action: step.action,
          target: step.target,
        });
      }
    });

    // Validate each visibility assertion has a proper pair
    for (const assertion of visibilityAssertions) {
      const oppositeAction = assertion.action === "expectVisible"
        ? "expectNotVisible"
        : "expectVisible";

      // Check for pair immediately before (at index - 2, with one action at index - 1)
      const hasPairBefore =
        assertion.index >= 2 &&
        visibilityAssertions.some(other =>
          other.index === assertion.index - 2 &&
          other.action === oppositeAction &&
          other.target === assertion.target
        ) &&
        // Ensure step at index - 1 is an action (not an assertion)
        !["expectVisible", "expectNotVisible", "expectText", "expectUrl"].includes(
          test.steps[assertion.index - 1].action
        );

      // Check for pair immediately after (at index + 2, with one action at index + 1)
      const hasPairAfter =
        assertion.index + 2 < test.steps.length &&
        visibilityAssertions.some(other =>
          other.index === assertion.index + 2 &&
          other.action === oppositeAction &&
          other.target === assertion.target
        ) &&
        // Ensure step at index + 1 is an action (not an assertion)
        !["expectVisible", "expectNotVisible", "expectText", "expectUrl"].includes(
          test.steps[assertion.index + 1].action
        );

      if (!hasPairBefore && !hasPairAfter) {
        ctx.addIssue({
          code: "custom",
          message: `${assertion.action} at step ${assertion.index} for target "${assertion.target}" must be paired with ${oppositeAction} for the same target, with exactly one action between them. Pattern: ${oppositeAction} → action → ${assertion.action} OR ${assertion.action} → action → ${oppositeAction}.`,
          path: ["steps", assertion.index, "action"],
        });
        hasError = true;
        break;
      }
    }
  }
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
