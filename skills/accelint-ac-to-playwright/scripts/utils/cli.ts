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

export function handleCliCommonErrors(params: {
  parsed: ParsedArgs;
  runtime: CliRuntime;
  printUsage: UsagePrinter;
  required?: Record<string, string>;
}): number | null {
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

  return null;
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
