# JSDoc Documentation Standards

## Scope

All functions, type aliases, interfaces, constants, and classes (both exported and internal) must have well-formed JSDoc comments.

## Directive Comments Are Exempt

**Tool directive comments must be left unchanged.** These include:
- Linter directives: `// eslint-disable-next-line`, `// biome-ignore lint/suspicious/noExplicitAny: reason`
- Formatter directives: `// prettier-ignore`
- Tool-specific comments: `// biome-ignore-all assist/source/organizeImports: reason`
- Type checker directives: `// @ts-expect-error`, `// @ts-ignore`

These comments have specific syntaxes required by their respective tools and **must not be modified or reformatted** to follow JSDoc conventions. They serve a different purpose than documentation comments.

**Exported code** requires comprehensive documentation with all applicable tags.

**Internal code** may use reduced documentation: description, `@template`, `@param`, and `@returns` only (can omit `@example` and `@throws`).

## @example Code Fence Requirement

All `@example` tags **must** use code fences with the appropriate language identifier:
- Use `javascript` for `.js` files
- Use `typescript` for `.ts` files
- Use `jsx` for `.jsx` files
- Use `tsx` for `.tsx` files

**❌ Incorrect: No code fence**
```ts
/**
 * @example
 * const result = add(1, 2); // 3
 */
```

**❌ Incorrect: Code fence without language**
```ts
/**
 * @example
 * ```
 * const result = add(1, 2); // 3
 * ```
 */
```

**✅ Correct: Code fence with language identifier**
```ts
/**
 * @example
 * ```typescript
 * const result = add(1, 2); // 3
 * ```
 */
```

## Functions

### Required (all functions)
- Description (clear summary)
- `@param` for each parameter
- `@template` for each generic type parameter
- `@returns` (unless return type is `void`)

### Required (exported functions only)
- `@throws` for each thrown error type
- `@example` with working code snippet

### Optional
- `@remarks` - Additional context
- `@see` / `@link` - Related references
- `@deprecated` - Deprecation notice

### Examples

**❌ Incorrect: Missing required tags**
```ts
export function clamp(min: number, max: number, value: number): number {
  if (min > max) {
    throw new RangeError(`min (${min}) > max (${max})`);
  }
  return Math.max(min, Math.min(max, value));
}
```

**✅ Correct: Complete documentation**
```ts
/**
 * Clamps a number within the specified bounds.
 *
 * @param min - The lower bound to clamp to.
 * @param max - The upper bound to clamp to.
 * @param value - The number value to clamp to the given range.
 * @returns The clamped value.
 *
 * @throws {RangeError} Throws if min > max.
 *
 * @example
 * ```typescript
 * const value = clamp(5, 15, 10); // 10
 * const value = clamp(5, 15, 2);  // 5
 * const value = clamp(5, 15, 20); // 15
 * ```
 */
export function clamp(min: number, max: number, value: number): number {
  if (min > max) {
    throw new RangeError(`min (${min}) > max (${max})`);
  }
  return Math.max(min, Math.min(max, value));
}
```

**❌ Incorrect: Generic function without @template**
```ts
/**
 * Returns the first element of an array.
 *
 * @param arr - The array to get the first element from.
 * @returns The first element.
 */
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

**✅ Correct: Generic function with @template**
```ts
/**
 * Returns the first element of an array.
 *
 * @template T - The type of elements in the array.
 * @param arr - The array to get the first element from.
 * @returns The first element, or undefined if array is empty.
 *
 * @example
 * ```typescript
 * const num = first([1, 2, 3]); // 1
 * const str = first(['a', 'b']); // 'a'
 * const none = first([]); // undefined
 * ```
 */
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

**❌ Incorrect: void function with @returns**
```ts
/**
 * Logs a message to the console.
 *
 * @param message - The message to log.
 * @returns Nothing (incorrect - should be omitted for void).
 */
function log(message: string): void {
  console.log(message);
}
```

**✅ Correct: void function without @returns**
```ts
/**
 * Logs a message to the console.
 *
 * @param message - The message to log.
 *
 * @example
 * ```typescript
 * log('Hello, world!');
 * ```
 */
function log(message: string): void {
  console.log(message);
}
```

### Object Parameters with Destructuring

When a function accepts an object parameter that is destructured, document the object properties using nested `@param` tags with dot notation. This provides developers with clear understanding of the expected object structure.

**❌ Incorrect: Single @param without property details**
```tsx
/**
 * Container component for grouping multiple accordions together.
 *
 * @param props - Accordion components props.
 * @returns The rendered accordion group component.
 */
export function AccordionGroup({
  ref,
  children,
  className,
  variant = 'cozy',
  isDisabled,
  ...rest
}: AccordionGroupProps) {
  // ...
}
```

**❌ Incorrect: Documenting each destructured parameter separately**
```tsx
/**
 * Container component for grouping multiple accordions together.
 *
 * @param ref - Ref object for the accordion group element.
 * @param children - Accordion components to include in the group.
 * @param className - Additional CSS class names.
 * @param variant - Visual density variant (compact or cozy).
 * @param isDisabled - Whether all accordions in the group are disabled.
 * @param rest - Additional DisclosureGroup props.
 * @returns The rendered accordion group component.
 */
export function AccordionGroup({
  ref,
  children,
  className,
  variant = 'cozy',
  isDisabled,
  ...rest
}: AccordionGroupProps) {
  // ...
}
```

**✅ Correct: Documenting object parameter with nested properties**
```tsx
/**
 * Container component for grouping multiple accordions together with shared configuration.
 *
 * Provides coordinated behavior for multiple accordions, controlling
 * whether multiple sections can be expanded simultaneously.
 *
 * @param props - The accordion group props.
 * @param props.ref - Reference to the root div element.
 * @param props.children - Accordion components to render within the group.
 * @param props.className - Additional CSS class names.
 * @param props.variant - Visual variant of the accordions ('compact' or 'cozy').
 * @param props.isDisabled - Whether all accordions in the group are disabled.
 * @returns The accordion group component.
 *
 * @example
 * ```tsx
 * <AccordionGroup variant="compact">
 *   <Accordion title="Section 1">Content 1</Accordion>
 *   <Accordion title="Section 2">Content 2</Accordion>
 * </AccordionGroup>
 * ```
 */
export function AccordionGroup({
  ref,
  children,
  className,
  variant = 'cozy',
  isDisabled,
  ...rest
}: AccordionGroupProps) {
  // ...
}
```

**✅ Correct: Nested object properties**
```ts
/**
 * Initializes a database connection with configuration options.
 *
 * @param config - Database configuration options.
 * @param config.host - Database server hostname.
 * @param config.port - Database server port.
 * @param config.credentials - Authentication credentials.
 * @param config.credentials.username - Database username.
 * @param config.credentials.password - Database password.
 * @param config.pool - Connection pool settings.
 * @param config.pool.min - Minimum number of connections.
 * @param config.pool.max - Maximum number of connections.
 * @returns Database connection instance.
 *
 * @example
 * ```typescript
 * const db = initDatabase({
 *   host: 'localhost',
 *   port: 5432,
 *   credentials: { username: 'admin', password: 'secret' },
 *   pool: { min: 2, max: 10 }
 * });
 * ```
 */
function initDatabase(config: DatabaseConfig): Database {
  // ...
}
```

## Types and Interfaces

### Required (all types/interfaces)
- Description (clear summary)
- `@template` for each generic type parameter

### Optional
- Property descriptions (inline)
- `@remarks` - Additional context

### Examples

**❌ Incorrect: Type without documentation**
```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

**✅ Correct: Type with complete documentation**
```ts
/**
 * Represents the result of an operation that can succeed or fail.
 *
 * @template T - The type of the success value.
 * @template E - The type of the error.
 */
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

**❌ Incorrect: Interface without property descriptions**
```ts
/**
 * Configuration for the API client.
 */
interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}
```

**✅ Correct: Interface with property descriptions**
```ts
/**
 * Configuration for the API client.
 */
interface ApiConfig {
  /** The base URL for API requests. */
  baseUrl: string;

  /** Request timeout in milliseconds. */
  timeout: number;

  /** Number of times to retry failed requests. */
  retries: number;
}
```

## Constants

### Required (all constants)
- Description (clear summary)

### Examples

**❌ Incorrect: Constant without documentation**
```ts
const MAX_RETRIES = 3;
```

**✅ Correct: Constant with documentation**
```ts
/**
 * Maximum number of retry attempts for failed requests.
 */
const MAX_RETRIES = 3;
```

**✅ Correct: Complex constant with documentation**
```ts
/**
 * HTTP status code mappings.
 */
const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
} as const;
```

## Classes

### Required (all classes)
- Description (clear summary)
- `@template` for each generic type parameter

### Required (exported classes only)
- `@example` with working code snippet

### Optional
- `@remarks` - Additional context
- `@see` / `@link` - Related references
- `@deprecated` - Deprecation notice

### Examples

**❌ Incorrect: Class without documentation**
```ts
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }
}
```

**✅ Correct: Class with complete documentation**
```ts
/**
 * A generic FIFO (First-In-First-Out) queue.
 *
 * @template T - The type of elements in the queue.
 *
 * @example
 * ```typescript
 * const queue = new Queue<number>();
 * queue.enqueue(1);
 * queue.enqueue(2);
 * console.log(queue.dequeue()); // 1
 * console.log(queue.dequeue()); // 2
 * console.log(queue.dequeue()); // undefined
 * ```
 */
class Queue<T> {
  private items: T[] = [];

  /**
   * Adds an item to the end of the queue.
   *
   * @param item - The item to add to the queue.
   *
   * @example
   * ```typescript
   * queue.enqueue(42);
   * ```
   */
  enqueue(item: T): void {
    this.items.push(item);
  }

  /**
   * Removes and returns the item at the front of the queue.
   *
   * @returns The first item in the queue, or undefined if empty.
   *
   * @example
   * ```typescript
   * const item = queue.dequeue();
   * ```
   */
  dequeue(): T | undefined {
    return this.items.shift();
  }
}
```

**❌ Incorrect: Deprecated class without notice**
```ts
/**
 * Legacy user authentication handler.
 */
class AuthHandler {
  authenticate(token: string): boolean {
    // ...
  }
}
```

**✅ Correct: Deprecated class with notice**
```ts
/**
 * Legacy user authentication handler.
 *
 * @deprecated Use `AuthService` instead. This class will be removed in v3.0.
 * @see {@link AuthService}
 *
 * @example
 * ```typescript
 * // Don't use this:
 * const auth = new AuthHandler();
 *
 * // Use this instead:
 * const auth = new AuthService();
 * ```
 */
class AuthHandler {
  /**
   * Authenticates a user with a token.
   *
   * @param token - The authentication token.
   * @returns True if authentication succeeds.
   *
   * @deprecated Use `AuthService.authenticate()` instead.
   */
  authenticate(token: string): boolean {
    // ...
  }
}
```
