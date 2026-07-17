import { describe, expect, it } from "vitest";
import { modifierKeyValidator, pressKeyValidator } from "../keyboard-key-validator";

describe("pressKeyValidator", () => {
  describe("single characters", () => {
    it("accepts lowercase letters", () => {
      const result = pressKeyValidator.safeParse("a");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("a");
      }
    });

    it("accepts digits", () => {
      const result = pressKeyValidator.safeParse("5");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("5");
      }
    });

    it("accepts unmodified symbols", () => {
      const result = pressKeyValidator.safeParse("-");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("-");
      }
    });

    it("rejects uppercase letters (require Shift)", () => {
      const result = pressKeyValidator.safeParse("A");
      expect(result.success).toBe(false);
    });

    it("rejects symbols that require Shift", () => {
      const result = pressKeyValidator.safeParse("+");
      expect(result.success).toBe(false);
    });
  });

  describe("named keys - case sensitivity", () => {
    it("accepts properly-cased key names", () => {
      const result = pressKeyValidator.safeParse("Enter");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("Enter");
      }
    });

    it("accepts lowercase key names and normalizes to proper case", () => {
      const result = pressKeyValidator.safeParse("enter");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("Enter");
      }
    });
  });

  describe("named keys - various key types", () => {
    it("accepts arrow keys with case normalization", () => {
      const result = pressKeyValidator.safeParse("arrowleft");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("ArrowLeft");
      }
    });

    it("accepts function keys with case normalization", () => {
      const result = pressKeyValidator.safeParse("f12");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("F12");
      }
    });

    it("accepts tab key with case normalization", () => {
      const result = pressKeyValidator.safeParse("TAB");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("Tab");
      }
    });
  });

  describe("invalid keys", () => {
    it("rejects invalid key names", () => {
      const result = pressKeyValidator.safeParse("InvalidKey");
      expect(result.success).toBe(false);
    });

    it("rejects empty strings", () => {
      const result = pressKeyValidator.safeParse("");
      expect(result.success).toBe(false);
    });
  });
});

describe("modifierKeyValidator", () => {
  describe("case sensitivity", () => {
    it("accepts properly-cased modifier keys", () => {
      const result = modifierKeyValidator.safeParse("Shift");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("Shift");
      }
    });

    it("accepts lowercase modifier keys and normalizes to proper case", () => {
      const result = modifierKeyValidator.safeParse("control");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("Control");
      }
    });
  });

  describe("app-specific modifier 'a'", () => {
    it("accepts lowercase 'a'", () => {
      const result = modifierKeyValidator.safeParse("a");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("a");
      }
    });

    it("accepts uppercase 'A' and normalizes to lowercase", () => {
      const result = modifierKeyValidator.safeParse("A");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("a");
      }
    });
  });

  describe("invalid modifiers", () => {
    it("rejects non-modifier keys", () => {
      const result = modifierKeyValidator.safeParse("Enter");
      expect(result.success).toBe(false);
    });

    it("rejects invalid modifier names", () => {
      const result = modifierKeyValidator.safeParse("Alt");
      expect(result.success).toBe(false);
    });

    it("rejects empty strings", () => {
      const result = modifierKeyValidator.safeParse("");
      expect(result.success).toBe(false);
    });
  });
});
