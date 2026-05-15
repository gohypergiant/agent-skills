import { z } from "zod";

/**
 * Valid Playwright keyboard key names
 * Source: https://playwright.dev/docs/api/class-keyboard#keyboard-press
 */
export const validPlaywrightKeys = [
  "Enter",
  "Tab",
  "Escape",
  "Backspace",
  "Delete",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "Insert",
  "Space",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
  "Shift",
  "Control",
  "Alt",
  "Numpad0",
  "Numpad1",
  "Numpad2",
  "Numpad3",
  "Numpad4",
  "Numpad5",
  "Numpad6",
  "Numpad7",
  "Numpad8",
  "Numpad9",
  "NumpadAdd",
  "NumpadSubtract",
  "NumpadDecimal",
  "NumpadEnter",
] as const;

/**
 * Characters that can be typed without holding Shift on a US keyboard
 */
const unmodifiedCharacters = "abcdefghijklmnopqrstuvwxyz0123456789`-=[]\\;',./";

/**
 * Zod validator for keyboard keys for presses
 * Accepts either:
 * - A single unmodified character (no Shift required on US keyboard)
 * - A valid Playwright key name from the list above (case-insensitive)
 */
export const pressKeyValidator = z.string().transform((val, ctx) => {
  // Single characters must match exactly (case-sensitive)
  if (val.length === 1) {
    if (unmodifiedCharacters.includes(val)) {
      return val;
    }
    ctx.addIssue({
      code: "custom",
      message: "Key must be a single unmodified character (a-z, 0-9, or symbols that don't require Shift) or a valid Playwright key name (e.g., Enter, Tab, Escape, Space, ArrowLeft, F1, etc.).",
    });
    return z.NEVER;
  }

  // Named keys: case-insensitive lookup, return canonical casing
  const lowerInput = val.toLowerCase();
  const matchedKey = validPlaywrightKeys.find(k => k.toLowerCase() === lowerInput);

  if (matchedKey) {
    return matchedKey;
  }

  ctx.addIssue({
    code: "custom",
    message: "Key must be a single unmodified character (a-z, 0-9, or symbols that don't require Shift) or a valid Playwright key name (e.g., Enter, Tab, Escape, Space, ArrowLeft, F1, etc.).",
  });
  return z.NEVER;
});

/**
 * Valid modifier keys for the application under test
 * These are the only keys that can be held down with keyDown/keyUp actions
 */
export const validModifierKeys = ["Shift", "Control", "a"] as const;

/**
 * Zod validator for modifier keys (keyDown/keyUp actions)
 * Only accepts the specific modifier keys used by the application under test (case-insensitive)
 */
export const modifierKeyValidator = z.string().transform((val, ctx) => {
  // Case-insensitive lookup, return canonical casing
  const lowerInput = val.toLowerCase();
  const matchedKey = validModifierKeys.find(k => k.toLowerCase() === lowerInput);

  if (matchedKey) {
    return matchedKey;
  }

  ctx.addIssue({
    code: "custom",
    message: 'Key must be one of the valid modifier keys for this application: "Shift", "Control", or "a".',
  });
  return z.NEVER;
});
