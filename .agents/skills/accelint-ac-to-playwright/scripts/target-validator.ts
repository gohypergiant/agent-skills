import { z } from "zod";
import { areaKeywords, componentKeywords } from "../references/target-vocabulary";

/**
 * Zod validator for target strings - enforces area.component.intent pattern
 */
export const targetValidator = z.string().superRefine((target, ctx) => {
  const parts = target.split(".");

  // Check structure first
  if (parts.length !== 3) {
    ctx.addIssue({
      code: "custom",
      message: "Target must follow area.component.intent pattern with exactly two dots"
    });
    return;
  }

  const [area, component, intent] = parts;

  // Check area vocabulary
  if (!areaKeywords.includes(area as typeof areaKeywords[number])) {
    ctx.addIssue({
      code: "custom",
      message: `Invalid area keyword. Must be one of: ${areaKeywords.join(", ")}`
    });
    return;
  }

  // Check component vocabulary
  if (!componentKeywords.includes(component as typeof componentKeywords[number])) {
    ctx.addIssue({
      code: "custom",
      message: `Invalid component keyword. Must be one of: ${componentKeywords.join(", ")}`
    });
    return;
  }

  // Check intent format
  if (!intent) {
    ctx.addIssue({
      code: "custom",
      message: "Target intent cannot be empty"
    });
    return;
  }

  if (!/^[a-z]+(-[a-z]+)*$/.test(intent)) {
    ctx.addIssue({
      code: "custom",
      message: "Intent must be lowercase letters only, multi-word joined with dashes (no spaces, underscores, or uppercase)"
    });
    return;
  }
});
