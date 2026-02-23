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
 * Zod validator for keyboard keys
 * Accepts either:
 * - A single unmodified character (no Shift required on US keyboard)
 * - A valid Playwright key name from the list above
 */
export const keyValidator = z.string().refine(
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
