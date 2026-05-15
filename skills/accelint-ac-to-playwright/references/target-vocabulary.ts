/**
 * Controlled vocabulary for target area keywords.
 * Last item in array is the fallback when no specific area matches.
 */
export const areaKeywords = [
  "nav",
  "header",
  "footer",
  "form",
  "drawer",
  "card",
  "toast",
  "modal",
  "table",
  "page",
  "area",
] as const;

/**
 * Controlled vocabulary for target component keywords.
 * Last item in array is the fallback when no specific component matches.
 */
export const componentKeywords = [
  "button",
  "link",
  "input",
  "dropdown",
  "checkbox",
  "radio",
  "text",
  "div",
  "component",
] as const;
