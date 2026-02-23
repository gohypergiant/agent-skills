import { z } from "zod";

/**
 * Valid mouse button types
 */
export const validMouseButtons = ["left", "right", "middle"] as const;

/**
 * Zod validator for mouse button parameter
 */
export const mouseButtonValidator = z.enum(validMouseButtons);

/**
 * Valid mouse wheel scroll directions
 */
export const validWheelDirections = ["up", "down", "left", "right"] as const;

/**
 * Zod validator for mouse wheel direction parameter
 */
export const wheelDirectionValidator = z.enum(validWheelDirections);
