import { expect, test } from "@playwright/test";
import { setupConsoleTracking } from "./fixtures/console-tracking";
import { attachFailureArtifacts } from "./fixtures/error-handling";

test.describe("Comprehensive action and assertion coverage", {
  tag: ["@comprehensive-test", "@automation-ready"],
  annotation: {
    type: "source",
    description: "agent-skills/skills/accelint-ac-to-playwright/assets/evals/PERFECT-AC.feature"
  }
}, () => {
  test("multiple visibility state changes", {
    tag: ["@visibility-changes", "@smoke"]
  }, async ({ page }, testInfo) => {
    const tracker = await setupConsoleTracking({ page, testInfo });

    await page.goto("/test");

    tracker.setStep(1);
    try {
      try {
        await expect(page.getByTestId("drawer.div.settings-panel")).toHaveCount(0);
      } catch {
        await expect(page.getByTestId("drawer.div.settings-panel")).toHaveCount(1);
        await expect(page.getByTestId("drawer.div.settings-panel")).not.toBeVisible();
      }
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "expectNotVisible", testId: "drawer.div.settings-panel" });
      throw error;
    }

    tracker.setStep(2);
    try {
      try {
        await expect(page.getByTestId("modal.text.welcome")).toHaveCount(0);
      } catch {
        await expect(page.getByTestId("modal.text.welcome")).toHaveCount(1);
        await expect(page.getByTestId("modal.text.welcome")).not.toBeVisible();
      }
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "expectNotVisible", testId: "modal.text.welcome" });
      throw error;
    }

    tracker.setStep(3);
    try {
      await expect(page.getByTestId("card.text.tutorial")).toHaveCount(1);
      await expect(page.getByTestId("card.text.tutorial")).toBeVisible();
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 3, action: "expectVisible", testId: "card.text.tutorial" });
      throw error;
    }

    tracker.setStep(4);
    try {
      await expect(page.getByTestId("page.button.toggle-interface")).toHaveCount(1);
      await page.getByTestId("page.button.toggle-interface").click();
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 4, action: "click", testId: "page.button.toggle-interface" });
      throw error;
    }

    tracker.setStep(5);
    try {
      await expect(page.getByTestId("drawer.div.settings-panel")).toHaveCount(1);
      await expect(page.getByTestId("drawer.div.settings-panel")).toBeVisible();
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 5, action: "expectVisible", testId: "drawer.div.settings-panel" });
      throw error;
    }

    tracker.setStep(6);
    try {
      await expect(page.getByTestId("modal.text.welcome")).toHaveCount(1);
      await expect(page.getByTestId("modal.text.welcome")).toBeVisible();
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 6, action: "expectVisible", testId: "modal.text.welcome" });
      throw error;
    }

    tracker.setStep(7);
    try {
      try {
        await expect(page.getByTestId("card.text.tutorial")).toHaveCount(0);
      } catch {
        await expect(page.getByTestId("card.text.tutorial")).toHaveCount(1);
        await expect(page.getByTestId("card.text.tutorial")).not.toBeVisible();
      }
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 7, action: "expectNotVisible", testId: "card.text.tutorial" });
      throw error;
    }

    await tracker.attachMessages();
  });

  test("keyboard modifier combination", {
    tag: "@keyboard-modifier-combo"
  }, async ({ page }, testInfo) => {
    const tracker = await setupConsoleTracking({ page, testInfo });

    await page.goto("/test");

    tracker.setStep(1);
    try {
      await page.keyboard.down("Shift");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "keyDown" });
      throw error;
    }

    tracker.setStep(2);
    try {
      await page.keyboard.press("e");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "press" });
      throw error;
    }

    tracker.setStep(3);
    try {
      await page.keyboard.up("Shift");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 3, action: "keyUp" });
      throw error;
    }

    tracker.setStep(4);
    try {
      await expect(page.getByTestId("header.text.banner")).toHaveCount(1);
      await expect(page.getByTestId("header.text.banner")).toContainText("Edit mode activated");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 4, action: "expectText", testId: "header.text.banner" });
      throw error;
    }

    await tracker.attachMessages();
  });

  test("keyboard hold and release sequence", {
    tag: "@keyboard-hold-sequence"
  }, async ({ page }, testInfo) => {
    const tracker = await setupConsoleTracking({ page, testInfo });

    await page.goto("/test");

    tracker.setStep(1);
    try {
      await page.keyboard.down("Shift");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "keyDown" });
      throw error;
    }

    tracker.setStep(2);
    try {
      await expect(page.getByTestId("page.button.item")).toHaveCount(1);
      await page.getByTestId("page.button.item").click();
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "click", testId: "page.button.item" });
      throw error;
    }

    tracker.setStep(3);
    try {
      await page.keyboard.up("Shift");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 3, action: "keyUp" });
      throw error;
    }

    tracker.setStep(4);
    try {
      await expect(page.getByTestId("page.text.selection")).toHaveCount(1);
      await expect(page.getByTestId("page.text.selection")).toContainText("Multi-select enabled");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 4, action: "expectText", testId: "page.text.selection" });
      throw error;
    }

    await tracker.attachMessages();
  });

  test("element-based actions and basic assertions", {
    tag: ["@basic-interactions", "@smoke"]
  }, async ({ page }, testInfo) => {
    const tracker = await setupConsoleTracking({ page, testInfo });

    await page.goto("/test");

    tracker.setStep(1);
    try {
      await expect(page.getByTestId("form.button.login")).toHaveCount(1);
      await page.getByTestId("form.button.login").click();
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "click", testId: "form.button.login" });
      throw error;
    }

    tracker.setStep(2);
    try {
      await expect(page.getByTestId("form.input.email")).toHaveCount(1);
      await page.getByTestId("form.input.email").fill("test@example.com");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "fill", testId: "form.input.email" });
      throw error;
    }

    tracker.setStep(3);
    try {
      await expect(page.getByTestId("form.input.password")).toHaveCount(1);
      await page.getByTestId("form.input.password").fill("secure123");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 3, action: "fill", testId: "form.input.password" });
      throw error;
    }

    tracker.setStep(4);
    try {
      await expect(page.getByTestId("form.dropdown.plan")).toHaveCount(1);
      await page.getByTestId("form.dropdown.plan").selectOption({ label: "Premium Plan" });
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 4, action: "select", testId: "form.dropdown.plan" });
      throw error;
    }

    tracker.setStep(5);
    try {
      await page.keyboard.press("Enter");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 5, action: "press" });
      throw error;
    }

    tracker.setStep(6);
    try {
      await expect(page).toHaveURL(/\/success(?:\/(?:[?#]|$)|[?#]|$)/);
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 6, action: "expectUrl" });
      throw error;
    }

    tracker.setStep(7);
    try {
      await expect(page.getByTestId("page.text.success")).toHaveCount(1);
      await expect(page.getByTestId("page.text.success")).toContainText("Submitted successfully");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 7, action: "expectText", testId: "page.text.success" });
      throw error;
    }

    await tracker.attachMessages();
  });

  test("mouse drag operation", {
    tag: "@mouse-drag"
  }, async ({ page }, testInfo) => {
    const tracker = await setupConsoleTracking({ page, testInfo });

    await page.goto("/test");

    tracker.setStep(1);
    try {
      await page.mouse.move(100, 100);
      await page.mouse.down();
      await page.mouse.move(300, 300);
      await page.mouse.up();
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "drag" });
      throw error;
    }

    tracker.setStep(2);
    try {
      await expect(page.getByTestId("toast.text.success")).toHaveCount(1);
      await expect(page.getByTestId("toast.text.success")).toContainText("Zoom area has been set");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "expectText", testId: "toast.text.success" });
      throw error;
    }

    await tracker.attachMessages();
  });

  test("mouse position, press, and release sequence", {
    tag: "@mouse-click-sequence"
  }, async ({ page }, testInfo) => {
    const tracker = await setupConsoleTracking({ page, testInfo });

    await page.goto("/test");

    tracker.setStep(1);
    try {
      await page.mouse.move(150, 200);
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "mouseMove" });
      throw error;
    }

    tracker.setStep(2);
    try {
      await page.mouse.down();
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "mouseDown" });
      throw error;
    }

    tracker.setStep(3);
    try {
      await page.keyboard.press("p");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 3, action: "press" });
      throw error;
    }

    tracker.setStep(4);
    try {
      await page.mouse.up();
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 4, action: "mouseUp" });
      throw error;
    }

    tracker.setStep(5);
    try {
      await expect(page.getByTestId("toast.text.success")).toHaveCount(1);
      await expect(page.getByTestId("toast.text.success")).toContainText("Point marked");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 5, action: "expectText", testId: "toast.text.success" });
      throw error;
    }

    await tracker.attachMessages();
  });

  test("coordinate-based double-click", {
    tag: "@mouse-single-and-double-click"
  }, async ({ page }, testInfo) => {
    const tracker = await setupConsoleTracking({ page, testInfo });

    await page.goto("/test");

    tracker.setStep(1);
    try {
      await page.mouse.click(250, 50);
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "mouseClick" });
      throw error;
    }

    tracker.setStep(2);
    try {
      await page.mouse.dblclick(250, 100);
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "doubleClick" });
      throw error;
    }

    tracker.setStep(3);
    try {
      await expect(page.getByTestId("modal.text.distance")).toHaveCount(1);
      await expect(page.getByTestId("modal.text.distance")).toContainText("Distance between these points is 50");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 3, action: "expectText", testId: "modal.text.distance" });
      throw error;
    }

    await tracker.attachMessages();
  });

  test("user scrolls on the page", {
    tag: "@scrolling"
  }, async ({ page }, testInfo) => {
    const tracker = await setupConsoleTracking({ page, testInfo });

    await page.goto("/test");

    tracker.setStep(1);
    try {
      await page.mouse.wheel(0, 200);
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "scroll" });
      throw error;
    }

    tracker.setStep(2);
    try {
      await page.mouse.wheel(75, 0);
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "scroll" });
      throw error;
    }

    tracker.setStep(3);
    try {
      await expect(page.getByTestId("page.text.position")).toHaveCount(1);
      await expect(page.getByTestId("page.text.position")).toContainText("You scrolled to the southeast");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 3, action: "expectText", testId: "page.text.position" });
      throw error;
    }

    await tracker.attachMessages();
  });

  test("page reload action", {
    tag: "@page-reload"
  }, async ({ page }, testInfo) => {
    const tracker = await setupConsoleTracking({ page, testInfo });

    await page.goto("/test");

    tracker.setStep(1);
    try {
      await expect(page.getByTestId("nav.link.refresh")).toHaveCount(1);
      await page.getByTestId("nav.link.refresh").click();
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "click", testId: "nav.link.refresh" });
      throw error;
    }

    tracker.setStep(2);
    try {
      await page.reload();
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "reload" });
      throw error;
    }

    tracker.setStep(3);
    try {
      await expect(page.getByTestId("header.text.status")).toHaveCount(1);
      await expect(page.getByTestId("header.text.status")).toContainText("Page refreshed");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 3, action: "expectText", testId: "header.text.status" });
      throw error;
    }

    await tracker.attachMessages();
  });

  test("hover interaction", {
    tag: "@hover-action"
  }, async ({ page }, testInfo) => {
    const tracker = await setupConsoleTracking({ page, testInfo });

    await page.goto("/test");

    tracker.setStep(1);
    try {
      await expect(page.getByTestId("card.button.info")).toHaveCount(1);
      await page.getByTestId("card.button.info").hover();
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "hover", testId: "card.button.info" });
      throw error;
    }

    tracker.setStep(2);
    try {
      await expect(page.getByTestId("card.text.tooltip")).toHaveCount(1);
      await expect(page.getByTestId("card.text.tooltip")).toContainText("Additional information");
    } catch (error) {
      await attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "expectText", testId: "card.text.tooltip" });
      throw error;
    }

    await tracker.attachMessages();
  });

});