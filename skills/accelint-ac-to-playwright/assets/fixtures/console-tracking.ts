import type { ConsoleMessage, Page, TestInfo } from "@playwright/test";

export async function setupConsoleTracking(args: {
  page: Page;
  testInfo: TestInfo;
}) {
  const { page, testInfo } = args;
  const consoleMessages: Array<{ type: string; text: string; stepIndex: number; timestamp: string; location: { url: string; lineNumber?: number; columnNumber?: number } }> = [];
  let currentStep = 0;

  page.on('console', (msg: ConsoleMessage) => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      stepIndex: currentStep,
      timestamp: new Date().toISOString(),
      location: msg.location()
    });
  });

  return {
    setStep: (step: number) => { currentStep = step; },
    attachMessages: async () => {
      if (consoleMessages.length > 0) {
        await testInfo.attach('console-messages', {
          contentType: 'application/json',
          body: Buffer.from(JSON.stringify(consoleMessages, null, 2), 'utf8')
        });
      }
    }
  };
}
