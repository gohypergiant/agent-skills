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
] as const;

/**
 * Characters that can be typed without holding Shift on a US keyboard
 */
const unmodifiedCharacters = "abcdefghijklmnopqrstuvwxyz0123456789`-=[]\\;',./";

/**
 * Zod validator for keyboard keys for presses
 * Accepts either:
 * - A single unmodified character (no Shift required on US keyboard)
 * - A valid Playwright key name from the list above
 */
export const pressKeyValidator = z.string().refine(
  (val): val is string => {
    // Allow single unmodified characters only
    if (val.length === 1) {
      return unmodifiedCharacters.includes(val);
    }
    // Allow named Playwright keys
    return (validPlaywrightKeys as readonly string[]).includes(val);
  },
  {
    message: "Key must be a single unmodified character (a-z, 0-9, or symbols that don't require Shift) or a valid Playwright key name (e.g., Enter, Tab, Escape, Space, ArrowLeft, F1, etc.).",
  }
);

/**
 * Valid modifier keys for the application under test
 * These are the only keys that can be held down with keyDown/keyUp actions
 */
export const validModifierKeys = ["Shift", "Control", "a"] as const;

/**
 * Zod validator for modifier keys (keyDown/keyUp actions)
 * Only accepts the specific modifier keys used by the application under test
 */
export const modifierKeyValidator = z.string().refine(
  (val): val is string => {
    return (validModifierKeys as readonly string[]).includes(val);
  },
  {
    message: 'Key must be one of the valid modifier keys for this application: "Shift", "Control", or "a".',
  }
);
