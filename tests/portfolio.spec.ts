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
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator(".work-link").first().click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Protocol Reliability Flight Deck",
  );
  await context.close();
});

test("terminal works with reduced motion, shares theme and restores focus", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  await page.goto("./");
  const launch = page.getByRole("button", {
    name: "Open interactive terminal",
  });
  await launch.click();
  const terminal = page.getByRole("dialog", { name: "Interactive terminal" });
  await expect(terminal).toBeVisible();
  const input = terminal.getByRole("textbox", { name: "Terminal input" });
  await expect(input).toBeFocused();
  await input.fill("theme light");
  await input.press("Enter");
  await expect(page.locator("html")).toHaveClass(/light/);
  await expect(terminal.getByRole("log")).toContainText("Daylight Ops");
  await input.press("ArrowUp");
  await expect(input).toHaveValue("theme light");
  await input.fill("");
  await input.press("Shift+Tab");
  await expect(
    terminal.getByRole("button", { name: "Close terminal" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(terminal).not.toBeVisible();
  await expect(launch).toBeFocused();
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/light/);
});

test("command palette handles empty results, résumé navigation and terminal handoff", async ({
  page,
}) => {
  await page.goto("./?static=1");
  await page.keyboard.press("Control+k");
  const palette = page.getByRole("dialog", { name: "Command palette" });
  await expect(palette).toBeVisible();
  const search = palette.getByRole("combobox");
  await search.fill("no-such-command");
  await search.press("ArrowDown");
  await search.press("Enter");
  await expect(palette.getByText("No matching commands")).toBeVisible();
  await search.fill("terminal");
  await search.press("Enter");
  await expect(
    page.getByRole("dialog", { name: "Interactive terminal" }),
  ).toBeVisible();
  await expect(palette).not.toBeVisible();
  const terminal = page.getByRole("textbox", { name: "Terminal input" });
  await terminal.fill("open resume");
  await terminal.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Kenrick Tan", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Print / Save as PDF" }),
  ).toBeVisible();
});

test("reduced motion can change during a visit without disabling controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("./");
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await expect(page.locator("html")).toHaveClass(/static-mode/);
  await page.getByRole("button", { name: "Open interactive terminal" }).click();
  await expect(
    page.getByRole("dialog", { name: "Interactive terminal" }),
  ).toBeVisible();
});

test("blocked storage does not crash theme or terminal interactions", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException("Denied", "SecurityError");
    };
    Storage.prototype.setItem = () => {
      throw new DOMException("Denied", "SecurityError");
    };
  });
  await page.goto("./?static=1");
  await page.getByRole("button", { name: "Open interactive terminal" }).click();
  const input = page.getByRole("textbox", { name: "Terminal input" });
  await input.fill("theme light");
  await input.press("Enter");
  await expect(page.locator("html")).toHaveClass(/light/);
  await input.fill("help");
  await input.press("Enter");
  await expect(page.getByRole("log")).toContainText("available commands:");
  expect(errors).toEqual([]);
});

test("light theme has no horizontal overflow and exports share metadata", async ({
  page,
  request,
  baseURL,
}, testInfo) => {
  await page.goto("./?static=1&theme=light");
  await expect(page.locator("html")).toHaveClass(/light/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("light-home.png"),
    fullPage: true,
  });
  expect((await request.get(`${baseURL}sitemap.xml`)).status()).toBe(200);
  expect((await request.get(`${baseURL}missing-page/`)).status()).toBe(404);
});
