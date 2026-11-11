import { test, expect } from "@playwright/test";

test.describe("Phase 1: Category and Article Pages", () => {
  const categoryUrl = "/connectpi-web/getting-started";
  const articleUrl = "/connectpi-web/getting-started/create-your-profile";

  test("Category page renders articles, breadcrumb and no horizontal overflow", async ({
    page,
  }) => {
    await page.goto(categoryUrl);

    // Verify H1 and category info
    const heading = page.locator("h1");
    await expect(heading).toContainText("Getting started");

    // Verify at least one article card exists
    const articleLink = page.locator('a[href*="create-your-profile"]');
    await expect(articleLink).toBeVisible();

    // Verify breadcrumb exists
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb).toBeAttached();

    // Verify no horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(hasHorizontalOverflow).toBe(false);
  });

  test("Article page renders MDX elements, TOC, and feedback widget", async ({
    page,
  }) => {
    await page.goto(articleUrl);

    // Verify H1
    const heading = page.locator("h1");
    await expect(heading).toContainText("How to create your profile");

    // Verify MDX Steps component rendered
    const steps = page.locator("ol.space-y-6");
    await expect(steps).toBeVisible();

    // Verify MDX Callout rendered
    const callout = page.locator('aside[role="note"]');
    await expect(callout).toBeVisible();

    // Verify Feedback widget operates
    const yesButton = page.locator('button[aria-label="Yes, this article was helpful"]');
    await expect(yesButton).toBeVisible();
    await yesButton.click();

    const thankYouMsg = page.locator('div[aria-live="polite"]');
    await expect(thankYouMsg).toContainText("Thank you for your feedback");

    // Verify no horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(hasHorizontalOverflow).toBe(false);
  });

  test("Responsive layout: sidebar and TOC visibility by breakpoint", async ({
    page,
  }, testInfo) => {
    await page.goto(articleUrl);

    const desktopSidebar = page.locator('aside[aria-label="Category Navigation"]');
    const wideTocRail = page.locator('nav[aria-label="On this page"].hidden.xl\\:block');
    const mobileTocDisclosure = page.locator('button[aria-label="Table of contents"]');

    if (testInfo.project.name === "mobile-390") {
      // Sidebar should be hidden on mobile
      await expect(desktopSidebar).not.toBeVisible();
      // TOC disclosure should be available
      await expect(mobileTocDisclosure).toBeVisible();
    } else if (testInfo.project.name === "desktop-1280") {
      // Sidebar should be visible on desktop
      await expect(desktopSidebar).toBeVisible();
      // TOC right rail should be visible on >=1280
      await expect(wideTocRail).toBeVisible();
    }
  });

  test("JSON-LD structured data is present and valid JSON", async ({ page }) => {
    await page.goto(articleUrl);

    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();
    expect(count).toBeGreaterThanOrEqual(2);

    for (let i = 0; i < count; i++) {
      const content = await jsonLdScripts.nth(i).textContent();
      expect(content).toBeTruthy();
      const parsed = JSON.parse(content || "{}");
      expect(parsed["@context"]).toBe("https://schema.org");
    }
  });
});
