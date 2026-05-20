import { z } from "zod";
import { modifierKeyValidator, pressKeyValidator } from "./keyboard-key-validator";
import { mouseButtonValidator, wheelDirectionValidator } from "./mouse-validator";
import { tagValidator } from "./tag-validator";
import { targetValidator } from "./target-validator";

/**
 * Step schemas
 */
const clickStep = z.object({
  type: z.literal("action").default("action"),
  action: z.literal("click"),
  target: targetValidator,
}).strict();

const doubleClickStep = z.object({
  type: z.literal("action").default("action"),
  action: z.literal("doubleClick"),
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  button: mouseButtonValidator.optional().default("left"),
}).strict();

const dragStep = z.object({
  type: z.literal("action").default("action"),
  action: z.literal("drag"),
  fromX: z.number().int().min(0),
  fromY: z.number().int().min(0),
  toX: z.number().int().min(0),
  toY: z.number().int().min(0),
  button: mouseButtonValidator.optional().default("left"),
}).strict();

const expectNotVisibleStep = z.object({
  type: z.literal("assertion").default("assertion"),
  action: z.literal("expectNotVisible"),
  target: targetValidator,
}).strict();

const expectTextStep = z.object({
  type: z.literal("assertion").default("assertion"),
  action: z.literal("expectText"),
  target: targetValidator,
  value: z.string(),
}).strict();

const expectUrlStep = z.object({
  type: z.literal("assertion").default("assertion"),
  action: z.literal("expectUrl"),
  value: z.string(),
}).strict();

const expectVisibleStep = z.object({
  type: z.literal("assertion").default("assertion"),
  action: z.literal("expectVisible"),
  target: targetValidator,
}).strict();

const fillStep = z.object({
  type: z.literal("action").default("action"),
  action: z.literal("fill"),
  target: targetValidator,
  value: z.string(),
}).strict();

const gotoStep = z.object({
  type: z.literal("action").default("action"),
  action: z.literal("goto"),
  value: z.string(),
}).strict();

const hoverStep = z.object({
  type: z.literal("action").default("action"),
  action: z.literal("hover"),
  target: targetValidator,
}).strict();

const keyDownStep = z.object({
  type: z.literal("action").default("action"),
  action: z.literal("keyDown"),
  value: modifierKeyValidator,
}).strict();

const keyUpStep = z.object({
  type: z.literal("action").default("action"),
  action: z.literal("keyUp"),
  value: modifierKeyValidator,
}).strict();

const mouseClickStep = z.object({
  type: z.literal("action").default("action"),
  action: z.literal("mouseClick"),
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  button: mouseButtonValidator.optional().default("left"),
}).strict();

const mouseDownStep = z.object({
  type: z.literal("action").default("action"),
  action: z.literal("mouseDown"),
  button: mouseButtonValidator.optional().default("left"),
}).strict();

const mouseMoveStep = z.object({
  type: z.literal("action").default("action"),
  action: z.literal("mouseMove"),
  x: z.number().int().min(0),
  y: z.number().int().min(0),
}).strict();

const mouseUpStep = z.object({
  type: z.literal("action").default("action"),
  action: z.literal("mouseUp"),
  button: mouseButtonValidator.optional().default("left"),
}).strict();

const pressStep = z.object({
  type: z.literal("action").default("action"),
  action: z.literal("press"),
  value: pressKeyValidator,
}).strict();

const reloadStep = z.object({
  type: z.literal("action").default("action"),
  action: z.literal("reload"),
}).strict();

const scrollStep = z.object({
  type: z.literal("action").default("action"),
  action: z.literal("scroll"),
  direction: wheelDirectionValidator,
  amount: z.number().int().positive(),
}).strict();

const selectStep = z.object({
  type: z.literal("action").default("action"),
  action: z.literal("select"),
  target: targetValidator,
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
  tags: z.array(tagValidator).min(1).optional(),
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
    // Helper to check if a step is an action (not an assertion)
    const isAction = (step: z.infer<typeof stepSchema>): boolean => {
      return step.type === "action";
    };

    // Helper to count actions between two indices
    const countActionsBetween = (startIndex: number, endIndex: number): number => {
      let count = 0;
      for (let i = startIndex + 1; i < endIndex; i++) {
        if (isAction(test.steps[i])) {
          count++;
        }
      }
      return count;
    };

    // Group visibility assertions by target
    const assertionsByTarget = new Map<string, Array<{
      index: number;
      action: "expectVisible" | "expectNotVisible";
    }>>();

    test.steps.forEach((step, index) => {
      if (step.action === "expectVisible" || step.action === "expectNotVisible") {
        const targetAssertions = assertionsByTarget.get(step.target);
        if (targetAssertions) {
          targetAssertions.push({
            index,
            action: step.action,
          });
        } else {
          assertionsByTarget.set(step.target, [{
            index,
            action: step.action,
          }]);
        }
      }
    });

    // Validate each target
    for (const [target, assertions] of assertionsByTarget.entries()) {
      // Must have exactly 2 assertions
      if (assertions.length !== 2) {
        ctx.addIssue({
          code: "custom",
          message: `Target "${target}" has ${assertions.length} visibility assertion(s), but must have exactly 2 (one expectVisible and one expectNotVisible with exactly one action between them).`,
          path: ["steps"],
        });
        hasError = true;
        break;
      }

      const [first, second] = assertions;

      // Must be opposite types
      if (first.action === second.action) {
        ctx.addIssue({
          code: "custom",
          message: `Target "${target}" has two ${first.action} assertions. Visibility assertions must be opposite types (one expectVisible and one expectNotVisible).`,
          path: ["steps", second.index, "action"],
        });
        hasError = true;
        break;
      }

      // Must have exactly 1 action between them
      const actionCount = countActionsBetween(first.index, second.index);
      if (actionCount !== 1) {
        ctx.addIssue({
          code: "custom",
          message: `Target "${target}" has ${actionCount} action(s) between visibility assertions at steps ${first.index} and ${second.index}, but must have exactly 1 action.`,
          path: ["steps", second.index, "action"],
        });
        hasError = true;
        break;
      }
    }
  }
}).strict();

/**
 * Exports
*/
export const testSuiteSchema = z.object({
  suiteName: z.string(),
  tags: z.array(tagValidator).min(1).optional(),
  source: z.object({
    repo: z.string(),
    path: z.string(),
  }).strict(),
  tests: z.array(testSchema).min(1),
}).strict();

export type TestSuite = z.infer<typeof testSuiteSchema>;
