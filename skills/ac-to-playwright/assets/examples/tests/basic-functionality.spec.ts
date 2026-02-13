import { expect, test } from "@playwright/test";

test.describe("Basic functionality", {
  tag: "@smoke",
  annotation: {
    type: "source",
    description: "agent-skills/skills/ac-to-playwright/assets/examples/acceptance/sample-app-functionality.feature"
  }
}, () => {
  test("user changes circle color from settings", async ({ page }, testInfo) => {
    await page.goto("/settings");

    try {
      await expect(page.getByTestId("page.div.pink-circle")).toHaveCount(1);
      await expect(page.getByTestId("page.div.pink-circle")).toBeHidden();
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "expectNotVisible", testId: "page.div.pink-circle" });
      throw error;
    }

    try {
      await expect(page.getByTestId("page.div.plain-circle")).toHaveCount(1);
      await expect(page.getByTestId("page.div.plain-circle")).toBeVisible();
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "expectVisible", testId: "page.div.plain-circle" });
      throw error;
    }

    try {
      await expect(page.getByTestId("page.dropdown.color-choice")).toHaveCount(1);
      await page.getByTestId("page.dropdown.color-choice").selectOption("Pink");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 3, action: "select", testId: "page.dropdown.color-choice" });
      throw error;
    }

    try {
      await expect(page.getByTestId("page.div.pink-circle")).toHaveCount(1);
      await expect(page.getByTestId("page.div.pink-circle")).toBeVisible();
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 4, action: "expectVisible", testId: "page.div.pink-circle" });
      throw error;
    }

    try {
      await expect(page.getByTestId("page.div.plain-circle")).toHaveCount(1);
      await expect(page.getByTestId("page.div.plain-circle")).toBeHidden();
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 5, action: "expectNotVisible", testId: "page.div.plain-circle" });
      throw error;
    }
  });

  test("user submits name and sees welcome message", async ({ page }, testInfo) => {
    await page.goto("/");

    try {
      await expect(page.getByTestId("page.input.fname")).toHaveCount(1);
      await page.getByTestId("page.input.fname").fill("Harry Potter");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "fill", testId: "page.input.fname" });
      throw error;
    }

    try {
      await expect(page.getByTestId("page.button.submit")).toHaveCount(1);
      await page.getByTestId("page.button.submit").click();
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "click", testId: "page.button.submit" });
      throw error;
    }

    try {
      await expect(page.getByTestId("page.text.fname-output")).toHaveCount(1);
      await expect(page.getByTestId("page.text.fname-output")).toContainText("Hello, Harry Potter.");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 3, action: "expectText", testId: "page.text.fname-output" });
      throw error;
    }
  });

});

async function attachFailureArtifacts(args: {
  page: import("@playwright/test").Page;
  testInfo: import("@playwright/test").TestInfo;
  stepIndex: number;
  action: string;
  testId?: string;
}) {
  const { page, testInfo, stepIndex, action, testId } = args;
  if (!testInfo) return;
  const payload = {
    url: page.url(),
    stepIndex,
    action,
    testId,
  };
  await testInfo.attach("step failure", {
    contentType: "application/json",
    body: Buffer.from(JSON.stringify(payload, null, 2), "utf8"),
  });
  try {
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach("step screenshot", {
      contentType: "image/png",
      body: screenshot,
    });
  } catch {
    // ignore screenshot issues
  }
  try {
    const video = page.video?.();
    if (video) {
      const path = await video.path();
      await testInfo.attach("step video", {
        contentType: "video/webm",
        path,
      });
    }
  } catch {
    // ignore video issues
  }
}