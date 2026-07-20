type CliRuntime = {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
};

type ParsedArgs = {
  help: boolean;
  errors: string[];
  [key: string]: unknown;
};

type UsagePrinter = (log: (...args: unknown[]) => void) => void;

/**
 * Handle common CLI errors (help flag, parse errors, missing required options).
 * Returns -1 to signal "no errors found, caller should continue".
 * Returns 0 for help text displayed successfully.
 * Returns 1 for validation errors.
 */
export function handleCliCommonErrors(params: {
  parsed: ParsedArgs;
  runtime: CliRuntime;
  printUsage: UsagePrinter;
  required?: Record<string, string>;
}): number {
  const { parsed, runtime, printUsage, required } = params;

  if (parsed.help) {
    printUsage(runtime.log);
    return 0;
  }

  if (parsed.errors.length) {
    for (const message of parsed.errors) runtime.error(message);
    printUsage(runtime.error);
    return 1;
  }

  if (required) {
    for (const [key, message] of Object.entries(required)) {
      if (!(key in parsed)) {
        return failRequired(runtime, printUsage, message);
      }
      if (!(parsed as Record<string, unknown>)[key]) {
        return failRequired(runtime, printUsage, message);
      }
    }
  }

  return -1;
}

function failRequired(
  runtime: CliRuntime,
  printUsage: UsagePrinter,
  message: string
): number {
  runtime.error(message);
  printUsage(runtime.error);
  return 1;
}
