import { z } from "zod";

/**
 * Zod validator for tag strings - ensures tags start with '@'
 */
export const tagValidator = z.string().refine(
  (tag) => tag.startsWith('@'),
  { message: "Tags must start with '@'" }
);
