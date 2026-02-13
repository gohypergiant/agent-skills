import { expect, test } from "@playwright/test";

test.describe("Site navigation", {
  tag: "@navigation",
  annotation: {
    type: "source",
    description: "agent-skills/skills/ac-to-playwright/assets/examples/acceptance/sample-app.feature"
  }
}, () => {
  test("user navigates to the settings page", {
    tag: "@smoke"
  }, async ({ page }, testInfo) => {
    await page.goto("/");

    try {
      await expect(page.getByTestId("header.link.settings")).toHaveCount(1);
      await page.getByTestId("header.link.settings").click();
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "click", testId: "header.link.settings" });
      throw error;
    }

    try {
      await expect(page).toHaveURL(/\/settings/);
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "expectUrl" });
      throw error;
    }

    try {
      await expect(page.getByTestId("header.text.page-heading")).toHaveCount(1);
      await expect(page.getByTestId("header.text.page-heading")).toContainText("Settings");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 3, action: "expectText", testId: "header.text.page-heading" });
      throw error;
    }
  });

  test("user navigates to the home page", {
    tag: ["@regression", "@wip"]
  }, async ({ page }, testInfo) => {
    await page.goto("/settings");

    try {
      await expect(page.getByTestId("header.link.home")).toHaveCount(1);
      await page.getByTestId("header.link.home").click();
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "click", testId: "header.link.home" });
      throw error;
    }

    try {
      await expect(page).toHaveURL(/\//);
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "expectUrl" });
      throw error;
    }

    try {
      await expect(page.getByTestId("header.text.page-heading")).toHaveCount(1);
      await expect(page.getByTestId("header.text.page-heading")).toContainText("Home");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 3, action: "expectText", testId: "header.text.page-heading" });
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