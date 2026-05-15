import type { Page, TestInfo } from "@playwright/test";

export async function attachFailureArtifacts(args: {
  page: Page;
  testInfo: TestInfo;
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
