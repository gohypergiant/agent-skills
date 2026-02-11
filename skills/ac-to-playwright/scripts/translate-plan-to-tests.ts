// This script converts a json test plan file to a Playwright test file.

// Types

type GeneratedFile = {
  path: string;
  content: string;
};

export type PlanFile = {
  suiteName: string;
  tags?: string[];
  source: {
    repo: string;
    path: string;
  };
  tests: Test[];
};

export type Step = { 
  action: "click"; target: string }
  | { action: "expectNotVisible"; target: string }
  | { action: "expectText"; target: string; value: string }
  | { action: "expectUrl"; value: string }
  | { action: "expectVisible"; target: string }
  | { action: "fill"; target: string; value: string }
  | { action: "goto"; value: string }
  | { action: "select"; target: string; value: string };
  
export type Test = {
  name: string;
  startUrl: string;
  tags?: string[];
  steps: Step[];
};

// Main functionality

// Translates one plan (which can contain many tests) to one test file
type TranslatePlanOptions = {
  outDir: string;
};

export function translatePlan(
  planFile: PlanFile,
  options: TranslatePlanOptions
): GeneratedFile {
  const lines: string[] = [];

  lines.push(`import { expect, test } from "@playwright/test";`);
  lines.push(``);

  // Set up group
  const sourceDescription =
    planFile.source.repo === "external"
      ? `external file: ${planFile.source.path}`
      : `${planFile.source.repo}/${planFile.source.path}`;

  if (planFile.tags?.length) {
    lines.push(`test.describe(${JSON.stringify(planFile.suiteName)}, {`);
    lines.push(`  tag: ${formatTags(planFile.tags)},`);
  } else {
    lines.push(`test.describe(${JSON.stringify(planFile.suiteName)}, {`);
  }
  lines.push(`  annotation: {`);
  lines.push(`    type: "source",`);
  lines.push(`    description: ${JSON.stringify(sourceDescription)}`);
  lines.push(`  }`);
  lines.push(`}, () => {`);

  // Write tests
  for (const test of planFile.tests) {
    lines.push(translateSingleTest(test));
  }

  // Helper to attach diagnostics on failure
  lines.push(`});`);
  lines.push(``);
  lines.push(`async function attachFailureArtifacts(args: {`);
  lines.push(`  page: import("@playwright/test").Page;`);
  lines.push(`  testInfo: import("@playwright/test").TestInfo;`);
  lines.push(`  stepIndex: number;`);
  lines.push(`  action: string;`);
  lines.push(`  testId?: string;`);
  lines.push(`}) {`);
  lines.push(`  const { page, testInfo, stepIndex, action, testId } = args;`);
  lines.push(`  if (!testInfo) return;`);
  lines.push(`  const payload = {`);
  lines.push(`    url: page.url(),`);
  lines.push(`    stepIndex,`);
  lines.push(`    action,`);
  lines.push(`    testId,`);
  lines.push(`  };`);
  lines.push(`  await testInfo.attach("step failure", {`);
  lines.push(`    contentType: "application/json",`);
  lines.push(`    body: Buffer.from(JSON.stringify(payload, null, 2), "utf8"),`);
  lines.push(`  });`);
  lines.push(`  try {`);
  lines.push(`    const screenshot = await page.screenshot({ fullPage: true });`);
  lines.push(`    await testInfo.attach("step screenshot", {`);
  lines.push(`      contentType: "image/png",`);
  lines.push(`      body: screenshot,`);
  lines.push(`    });`);
  lines.push(`  } catch {`);
  lines.push(`    // ignore screenshot issues`);
  lines.push(`  }`);
  lines.push(`  try {`);
  lines.push(`    const video = page.video?.();`);
  lines.push(`    if (video) {`);
  lines.push(`      const path = await video.path();`);
  lines.push(`      await testInfo.attach("step video", {`);
  lines.push(`        contentType: "video/webm",`);
  lines.push(`        path,`);
  lines.push(`      });`);
  lines.push(`    }`);
  lines.push(`  } catch {`);
  lines.push(`    // ignore video issues`);
  lines.push(`  }`);
  lines.push(`}`);

  const suiteSlug = slug(planFile.suiteName);
  if (!suiteSlug) {
    throw new Error(
      `Invalid suiteName: "${planFile.suiteName}". Name must contain at least one alphanumeric character (a-z or 0-9).`
    );
  }

  return {
    path: joinOutDir(options.outDir, `${suiteSlug}.spec.ts`),
    content: lines.join("\n"),
  };
}

// Helper functions

// Translates a single test within a plan
function translateSingleTest(test: Test): string {
  const lines: string[] = [];
  
  if (test.tags?.length) {
    lines.push(`  test(${JSON.stringify(test.name)}, {`);
    lines.push(`    tag: ${formatTags(test.tags)}`);
    lines.push(`  }, async ({ page }, testInfo) => {`);
  } else {
    lines.push(`  test(${JSON.stringify(test.name)}, async ({ page }, testInfo) => {`);
  }

  lines.push(`    await page.goto(${JSON.stringify(test.startUrl)});`);

  test.steps.forEach((step, index) => {
    lines.push(``);
    lines.push(renderStep(step, index + 1));
  });

  lines.push(`  });`);
  lines.push(``);

  return lines.join("\n");
}

// Create file name slug from suite name
function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Creates a clean output path with user-specified target dir
function joinOutDir(outDir: string, filename: string): string {
  const trimmed = outDir.replace(/[/\\]+$/, "");
  const separator =
    trimmed.includes("\\") && !trimmed.includes("/") ? "\\" : "/";
  return `${trimmed}${separator}${filename}`;
}

// Converts a string to a regex literal, escaping all special regex characters
  function toRegexLiteral(pattern: string): string {
    const escaped = pattern
      .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")  // Escape all regex metacharacters
      .replace(/\//g, "\\/");                  // Also escape forward slashes for the literal
    return `/${escaped}/`;
  }

// Outputs tags in the correct format for Playwright
function formatTags(tags: string[]): string {
  if (tags.length === 1) return JSON.stringify(tags[0]);
  
  return `[${tags.map((tag) => JSON.stringify(tag)).join(", ")}]`;
}

// Step actions
function renderStep(step: Step, stepIndex: number): string {
  switch (step.action) {
    case "click": {
      const locator = `page.getByTestId(${JSON.stringify(step.target)})`;
      return [
        `    try {`,
        `      await expect(${locator}).toHaveCount(1);`,
        `      await ${locator}.click();`,
        `    } catch (error) {`,
        `      await attachFailureArtifacts({ page, testInfo, stepIndex: ${stepIndex}, action: "${step.action}", testId: ${JSON.stringify(step.target)} });`,
        `      throw error;`,
        `    }`
      ].join("\n");
    }

    case "expectNotVisible": {
      const locator = `page.getByTestId(${JSON.stringify(step.target)})`;
      return [
        `    try {`,
        `      await expect(${locator}).toHaveCount(1);`,
        `      await expect(${locator}).toBeHidden();`,
        `    } catch (error) {`,
        `      await attachFailureArtifacts({ page, testInfo, stepIndex: ${stepIndex}, action: "${step.action}", testId: ${JSON.stringify(step.target)} });`,
        `      throw error;`,
        `    }`
      ].join("\n");
    }

    case "expectText": {
      const locator = `page.getByTestId(${JSON.stringify(step.target)})`;
      return [
        `    try {`,
        `      await expect(${locator}).toHaveCount(1);`,
        `      await expect(${locator}).toContainText(${JSON.stringify(step.value)});`,
        `    } catch (error) {`,
        `      await attachFailureArtifacts({ page, testInfo, stepIndex: ${stepIndex}, action: "${step.action}", testId: ${JSON.stringify(step.target)} });`,
        `      throw error;`,
        `    }`
      ].join("\n");
    }

    case "expectUrl":
      return [
        `    try {`,
        `      await expect(page).toHaveURL(${toRegexLiteral(step.value)});`,
        `    } catch (error) {`,
        `      await attachFailureArtifacts({ page, testInfo, stepIndex: ${stepIndex}, action: "${step.action}" });`,
        `      throw error;`,
        `    }`
      ].join("\n");

    case "expectVisible": {
      const locator = `page.getByTestId(${JSON.stringify(step.target)})`;
      return [
        `    try {`,
        `      await expect(${locator}).toHaveCount(1);`,
        `      await expect(${locator}).toBeVisible();`,
        `    } catch (error) {`,
        `      await attachFailureArtifacts({ page, testInfo, stepIndex: ${stepIndex}, action: "${step.action}", testId: ${JSON.stringify(step.target)} });`,
        `      throw error;`,
        `    }`
      ].join("\n");
    }

    case "fill": {
      const locator = `page.getByTestId(${JSON.stringify(step.target)})`;
      return [
        `    try {`,
        `      await expect(${locator}).toHaveCount(1);`,
        `      await ${locator}.fill(${JSON.stringify(step.value)});`,
        `    } catch (error) {`,
        `      await attachFailureArtifacts({ page, testInfo, stepIndex: ${stepIndex}, action: "${step.action}", testId: ${JSON.stringify(step.target)} });`,
        `      throw error;`,
        `    }`
      ].join("\n");
    }

    case "goto":
      return [
        `    try {`,
        `      await page.goto(${JSON.stringify(step.value)});`,
        `    } catch (error) {`,
        `      await attachFailureArtifacts({ page, testInfo, stepIndex: ${stepIndex}, action: "${step.action}" });`,
        `      throw error;`,
        `    }`
      ].join("\n");
    
    case "select": {
      const locator = `page.getByTestId(${JSON.stringify(step.target)})`;
      return [
        `    try {`,
        `      await expect(${locator}).toHaveCount(1);`,
        `      await ${locator}.selectOption(${JSON.stringify(step.value)});`,
        `    } catch (error) {`,
        `      await attachFailureArtifacts({ page, testInfo, stepIndex: ${stepIndex}, action: "${step.action}", testId: ${JSON.stringify(step.target)} });`,
        `      throw error;`,
        `    }`
      ].join("\n");
    }

    default: {
      throw new Error(`Unsupported step: ${JSON.stringify(step)}`);
    }
  }
}

// @internal exports for unit tests
export { 
  formatTags as _formatTags,
  joinOutDir as _joinOutDir,
  renderStep as _renderStep, 
  slug as _slug, 
  toRegexLiteral as _toRegexLiteral,
  translateSingleTest as _translateSingleTest
};
