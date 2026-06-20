import { test, expect } from "@playwright/test";

test.describe("Thai Lee — تاي لي", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads with RTL Arabic and correct title", async ({ page }) => {
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(html).toHaveAttribute("lang", "ar");
    await expect(page).toHaveTitle(/تاي لي/);
  });

  test("hero headline and CTAs are visible", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("link", { name: /احجز طاولة/ }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /استعرض القائمة/ })).toBeVisible();
  });

  test("preloader hides", async ({ page }) => {
    await page.waitForTimeout(1500);
    const display = await page.locator("#preloader").evaluate((el) => getComputedStyle(el).display);
    expect(display).toBe("none");
  });

  test("signature wok motion SVG is present", async ({ page }) => {
    await expect(page.locator(".wok-scene")).toBeVisible();
    expect(await page.locator(".wok-scene .noodle").count()).toBeGreaterThan(0);
    expect(await page.locator(".wok-scene .flame").count()).toBeGreaterThan(0);
  });

  test("trust bar cites real Google rating", async ({ page }) => {
    await expect(page.getByText(/4.3/).first()).toBeVisible();
    await expect(page.getByText(/1,076/)).toBeVisible();
  });

  test("menu shows real dishes without invented prices", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "باد تاي" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "كاري تايلندي" })).toBeVisible();
    // no SAR/ريال price tokens anywhere
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/ريال|﷼|SAR/);
  });

  test("full-screen mobile menu opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: /فتح القائمة/ }).click();
    const menu = page.locator("#mobileMenu");
    await expect(menu).toBeVisible();
    const box = await menu.boundingBox();
    expect(box!.width).toBeGreaterThan(380);
    await page.getByRole("button", { name: /إغلاق القائمة/ }).click();
    await expect(menu).toBeHidden();
  });

  test("reservation form validates then builds summary + localStorage", async ({ page }) => {
    await page.locator("#reserveForm").scrollIntoViewIfNeeded();
    await page.locator("#reserveSubmit").click();
    await expect(page.locator(".field.invalid").first()).toBeVisible();

    await page.fill("#rName", "نورة العتيبي");
    await page.fill("#rPhone", "0501234567");
    await page.selectOption("#rGuests", "4");
    await page.selectOption("#rType", "حجز طاولة");
    await page.fill("#rDate", "2026-07-01");
    await page.fill("#rTime", "20:30");
    await page.locator("#reserveSubmit").click();

    await expect(page.locator("#summary")).toBeVisible();
    await expect(page.getByText("نورة العتيبي")).toBeVisible();

    const stored = await page.evaluate(() => localStorage.getItem("thaiLeeReservations"));
    expect(stored).toContain("نورة العتيبي");
  });

  test("maps link present", async ({ page }) => {
    const maps = page.locator('a[href*="google.com/maps"]').first();
    await expect(maps).toHaveAttribute("href", /Thai%20lee%20Jeddah/);
  });

  test("no horizontal scroll at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });

  test("gallery lightbox opens", async ({ page }) => {
    await page.locator(".g-item").first().click();
    await expect(page.locator("#lightbox")).toBeVisible();
    await page.locator("#lbClose").click();
    await expect(page.locator("#lightbox")).toBeHidden();
  });
});
