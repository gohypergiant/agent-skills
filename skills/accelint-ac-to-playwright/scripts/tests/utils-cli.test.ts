import { describe, expect, it, vi } from "vitest";
import { handleCliCommonErrors } from "../utils/cli";

describe("handleCliCommonErrors", () => {
  it("returns null when there are no help/errors and required is omitted", () => {
    const log = vi.fn();
    const error = vi.fn();
    const printUsage = vi.fn();

    const result = handleCliCommonErrors({
      parsed: { help: false, errors: [] },
      runtime: { log, error },
      printUsage,
    });

    expect(result).toBeNull();
    expect(printUsage).not.toHaveBeenCalled();
    expect(log).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });

  it("returns null when required keys are present and truthy", () => {
    const log = vi.fn();
    const error = vi.fn();
    const printUsage = vi.fn();

    const result = handleCliCommonErrors({
      parsed: { help: false, errors: [], summaryJson: "summary.json" },
      runtime: { log, error },
      printUsage,
      required: { summaryJson: "Error: Missing required option: --summary-json <path>" },
    });

    expect(result).toBeNull();
    expect(printUsage).not.toHaveBeenCalled();
    expect(log).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });

  it("returns 1 when a required key is missing", () => {
    const log = vi.fn();
    const error = vi.fn();
    const printUsage = vi.fn();

    const result = handleCliCommonErrors({
      parsed: { help: false, errors: [] },
      runtime: { log, error },
      printUsage,
      required: { summaryJson: "Error: Missing required option: --summary-json <path>" },
    });

    expect(result).toBe(1);
    expect(error).toHaveBeenCalledWith(
      "Error: Missing required option: --summary-json <path>"
    );
    expect(printUsage).toHaveBeenCalledWith(error);
  });

  it("returns 1 when a required key is present but falsy", () => {
    const log = vi.fn();
    const error = vi.fn();
    const printUsage = vi.fn();

    const result = handleCliCommonErrors({
      parsed: { help: false, errors: [], summaryJson: "" },
      runtime: { log, error },
      printUsage,
      required: { summaryJson: "Error: Missing required option: --summary-json <path>" },
    });

    expect(result).toBe(1);
    expect(error).toHaveBeenCalledWith(
      "Error: Missing required option: --summary-json <path>"
    );
    expect(printUsage).toHaveBeenCalledWith(error);
  });

});
