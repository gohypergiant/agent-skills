import { z } from "zod";

/**
 * Valid mouse button types
 */
export const validMouseButtons = ["left", "right", "middle"] as const;

/**
 * Zod validator for mouse button parameter
 */
export const mouseButtonValidator = z.enum(validMouseButtons);
