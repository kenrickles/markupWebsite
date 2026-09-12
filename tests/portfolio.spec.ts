import { test, expect } from "@playwright/test";

test("export renders, navigates and exposes case-study interactions", async ({
  page,
}, testInfo) => {
  const failures: string[] = [];
  page.on("pageerror", (e) => failures.push(e.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      failures.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Complex systems.",
  );
  await expect(page.locator(".hero-line").first()).toHaveCSS("opacity", "1");
  await page.locator(".portrait-frame img").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator(".portrait-frame img")
        .evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
    )
    .toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("heading", { level: 1 }).scrollIntoViewIfNeeded();
  await page.screenshot({
    path: testInfo.outputPath("home.png"),
    fullPage: true,
  });
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open menu" }).click();
  }
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Work", exact: true })
    .click();
  await expect(page.locator("#projects")).toBeInViewport();
  await page.locator(".work-link").first().click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Protocol Reliability Flight Deck",
  );
  await page.getByRole("button", { name: /Telemetry Bus/ }).click();
  await expect(page.locator("#architecture-detail")).toContainText(
    "Prometheus + log pipelines",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("case-study.png"),
    fullPage: true,
  });
  await page.getByRole("link", { name: /Back to work/ }).click();
  await page
    .locator("summary")
    .filter({ hasText: "Prudential Singapore" })
    .click();
  await expect(
    page.locator("details").filter({ hasText: "Prudential Singapore" }),
  ).toHaveAttribute("open", "");
  expect(failures).toEqual([]);
});

test("reduced motion keeps content visible and native scrolling", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await expect(page.locator(".hero-line").first()).toHaveCSS("opacity", "1");
  await page.getByRole("link", { name: "Explore my work" }).click();
  await expect(page.locator("#projects")).toBeInViewport();
});

test("content and project links remain available without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/kenrick-portfolio/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator(".work-link").first().click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Protocol Reliability Flight Deck",
  );
  await context.close();
});
