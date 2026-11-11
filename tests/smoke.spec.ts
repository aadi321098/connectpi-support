import { test, expect } from "@playwright/test";

test.describe("Phase 0 Smoke Tests", () => {
  test("Loads homepage and verifies landmarks and zero horizontal overflow", async ({
    page,
  }) => {
    await page.goto("/");

    // 1. Verify semantic landmarks exist
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();

    const header = page.locator('header[role="banner"]');
    await expect(header).toBeVisible();

    const main = page.locator("main#main-content");
    await expect(main).toBeVisible();

    const footer = page.locator('footer[role="contentinfo"]');
    await expect(footer).toBeVisible();

    // 2. Verify no horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(hasHorizontalOverflow).toBe(false);
  });

  test("Mobile drawer operates with keyboard accessible focus", async ({
    page,
  }, testInfo) => {
    // Only run on mobile viewport
    if (testInfo.project.name !== "mobile-390") {
      test.skip();
    }

    await page.goto("/");

    const menuButton = page.locator('button[aria-label="Open menu"]');
    await expect(menuButton).toBeVisible();

    // Open drawer
    await menuButton.click();

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Press Escape to close
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
});
