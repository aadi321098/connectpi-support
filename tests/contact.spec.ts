import { test, expect } from "@playwright/test";

test.describe("Phase 3: Contact Form and API Endpoints", () => {
  test("Loads contact page with 2-column layout and form fields", async ({
    page,
  }) => {
    await page.goto("/contact");

    const h1 = page.locator("h1");
    await expect(h1).toContainText("Contact ConnectPi Support");

    // Check primary fields
    await expect(page.locator("#contact-product")).toBeVisible();
    await expect(page.locator("#contact-type")).toBeVisible();
    await expect(page.locator("#contact-name")).toBeVisible();
    await expect(page.locator("#contact-email")).toBeVisible();
    await expect(page.locator("#contact-subject")).toBeVisible();
    await expect(page.locator("#contact-message")).toBeVisible();

    // Verify no horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(hasHorizontalOverflow).toBe(false);
  });

  test("Inquiry type toggle reveals conditional bug report fields", async ({
    page,
  }) => {
    await page.goto("/contact");

    // Initially device field should not exist
    await expect(page.locator("#contact-device")).not.toBeVisible();

    // Select "Bug Report"
    await page.locator("#contact-type").selectOption("bug");

    // Conditional fields should appear
    await expect(page.locator("#contact-device")).toBeVisible();
    await expect(page.locator("#contact-os")).toBeVisible();
  });

  test("Client-side validation flags empty required fields", async ({
    page,
  }) => {
    await page.goto("/contact");

    // Submit without filling fields
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Errors should appear
    const nameError = page.locator("#contact-name-error");
    await expect(nameError).toBeVisible();

    const emailError = page.locator("#contact-email-error");
    await expect(emailError).toBeVisible();

    const subjectError = page.locator("#contact-subject-error");
    await expect(subjectError).toBeVisible();

    const messageError = page.locator("#contact-message-error");
    await expect(messageError).toBeVisible();
  });

  test("Submits valid inquiry and shows success confirmation", async ({
    page,
  }) => {
    await page.goto("/contact");

    await page.locator("#contact-name").fill("John Doe");
    await page.locator("#contact-email").fill("johndoe@example.com");
    await page.locator("#contact-subject").fill("Question about Loyalty Points");
    await page.locator("#contact-message").fill("Hello, how do daily login rewards work in ConnectPi?");

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Verify success view
    const successHeading = page.locator("h3:has-text('Message Received!')");
    await expect(successHeading).toBeVisible({ timeout: 8000 });
  });

  test("API: /api/health endpoint returns status ok", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("ok");
    expect(data.uptime).toBeDefined();
  });

  test("API: /api/contact rejects bot submissions via honeypot silently", async ({
    request,
  }) => {
    const res = await request.post("/api/contact", {
      data: {
        product: "connectpi-web",
        type: "question",
        name: "SpamBot",
        email: "bot@spam.com",
        subject: "Spam Subject",
        message: "Spam message body text here",
        consent: true,
        honeypot: "I am a bot",
      },
    });

    // Returns 200 OK without processing to confuse bots
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });
});
