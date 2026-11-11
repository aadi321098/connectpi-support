import { test, expect } from "@playwright/test";

test.describe("Phase 2: Search and Home Page", () => {
  test("Home page renders hero, search field, app cards, and popular articles", async ({
    page,
  }) => {
    await page.goto("/");

    // Verify H1
    const h1 = page.locator("h1");
    await expect(h1).toContainText("Hi, how can we help?");

    // Verify SearchField exists
    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput).toBeVisible();

    // Verify "Choose your app" cards
    const appCards = page.locator('a[href*="/connectpi-web"]');
    await expect(appCards.first()).toBeVisible();

    // Verify Popular articles
    const popularSection = page.locator("#popular");
    await expect(popularSection).toBeVisible();

    // Verify WebSite JSON-LD with SearchAction
    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();
    let hasSearchAction = false;
    for (let i = 0; i < count; i++) {
      const content = await jsonLdScripts.nth(i).textContent();
      if (content?.includes("SearchAction")) {
        hasSearchAction = true;
        break;
      }
    }
    expect(hasSearchAction).toBe(true);
  });

  test("Search index is lazy-loaded only after focus", async ({ page }) => {
    let indexRequested = false;
    page.on("request", (req) => {
      if (req.url().includes("search-index")) {
        indexRequested = true;
      }
    });

    await page.goto("/");
    // Before focusing, index should NOT be requested
    expect(indexRequested).toBe(false);

    // Focus the search input
    const searchInput = page.locator('input[type="search"]').first();
    await searchInput.focus();

    // Give it a brief moment for the fetch to trigger
    await page.waitForTimeout(300);
    expect(indexRequested).toBe(true);
  });

  test("Typo-tolerant instant search suggestions with combobox pattern", async ({
    page,
  }) => {
    await page.goto("/");

    const searchInput = page.locator('input[type="search"]').first();
    await searchInput.focus();
    // Type typo: "loging" instead of "login"
    await searchInput.fill("loging");

    // Wait for combobox suggestions dropdown
    const listbox = page.locator('ul[role="listbox"]');
    await expect(listbox).toBeVisible({ timeout: 5000 });

    // Verify suggestion found
    const suggestionItem = page.locator('li[role="option"]');
    await expect(suggestionItem.first()).toContainText("log in");

    // Test Escape key closes listbox
    await page.keyboard.press("Escape");
    await expect(listbox).not.toBeVisible();
  });

  test("Search results page displays matching articles and zero-results state", async ({
    page,
  }) => {
    // 1. Successful query
    await page.goto("/search?q=profile");
    const results = page.locator('a[href*="create-your-profile"]');
    await expect(results.first()).toBeVisible();

    // 2. Zero-results state
    await page.goto("/search?q=xyznonexistentterm");
    const noResultsMsg = page.getByRole("heading", { name: /No results found/i });
    await expect(noResultsMsg).toBeVisible();
  });
});
