import { test, expect } from "@playwright/test";

test("desktop notes expose the full work history and project summaries", async ({
  page,
}) => {
  const failures: string[] = [];
  page.on("pageerror", (error) => failures.push(error.message));
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Hi, I’m Kenrick.",
  );
  await expect(page.getByRole("img", { name: "Kenrick Tan" })).toBeVisible();
  await page
    .getByRole("button", { name: "Open experience", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Galaxy Digital", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Versent Singapore" }),
  ).toBeAttached();
  await page
    .getByRole("button", { name: "Open projects", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Things I’ve built." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "AI where the work happens" }),
  ).toBeAttached();
  await page.getByRole("button", { name: "Previous note" }).click();
  await expect(
    page.getByRole("heading", { name: "The journey so far." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Next note" }).click();
  await expect(
    page.getByRole("heading", { name: "Things I’ve built." }),
  ).toBeVisible();
  expect(failures).toEqual([]);
});

test("window controls restore content through the dock", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Open contact", exact: true }).click();
  await page.getByRole("button", { name: "Minimize notes" }).click();
  await expect(
    page.getByRole("region", { name: "Portfolio notes" }),
  ).not.toBeVisible();
  await page.getByRole("button", { name: "Open notes", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Hi, I’m Kenrick." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Expand window", exact: true })
    .click();
  await expect(page.locator(".notes-window")).toHaveClass(/notes-expanded/);
  await page.getByRole("button", { name: "Restore window" }).click();
  await expect(page.locator(".notes-window")).not.toHaveClass(/notes-expanded/);
  await page.getByRole("button", { name: "Close notes" }).click();
  await page.getByRole("button", { name: "A little about Kenrick" }).click();
  await expect(
    page.getByRole("region", { name: "Portfolio notes" }),
  ).toBeVisible();
});

test("notes search filters navigation and recovers from empty results", async ({
  page,
}, info) => {
  test.skip(
    info.project.name === "mobile",
    "Compact navigation uses scrollable note tabs.",
  );
  await page.goto("./");
  const search = page.getByRole("textbox", { name: "Search notes" });
  await search.fill("zzzz");
  await expect(page.getByRole("status")).toHaveText("No matching notes.");
  await search.fill("Prudential");
  await page.getByRole("button", { name: /The journey so far Galaxy/ }).click();
  await expect(
    page.getByRole("heading", { name: "The journey so far." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Open introduction" }).click();
  await expect(search).toHaveValue("");
});

test("contact links and printable résumé remain usable", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Open contact", exact: true }).click();
  await expect(page.locator(".contact-letter")).toHaveAttribute(
    "href",
    "mailto:kenrickles@gmail.com",
  );
  await page.getByRole("link", { name: "Open résumé", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Kenrick Tan", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Print / Save as PDF" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "← Back to portfolio" }).click();
  await expect(
    page.getByRole("heading", { name: "Hi, I’m Kenrick." }),
  ).toBeVisible();
});

test("responsive content stays reachable with reduced motion and blocked storage", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException("Denied", "SecurityError");
    };
    Storage.prototype.setItem = () => {
      throw new DOMException("Denied", "SecurityError");
    };
  });
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: "Hi, I’m Kenrick." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Open contact", exact: true }).click();
  await expect(page.locator(".contact-letter")).toBeVisible();
  expect(
    await page
      .locator(".note-content")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  await page.screenshot({
    path: info.outputPath("contact.png"),
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("résumé remains accessible without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(
    page.getByRole("heading", { name: "Hi, I’m Kenrick." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Open résumé", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Kenrick Tan", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Experience", exact: true }),
  ).toBeVisible();
  await context.close();
});

test("desktop window dragging and resizing keep the titlebar reachable", async ({
  page,
}, info) => {
  test.skip(
    info.project.name === "mobile",
    "Touch screens use a fixed compact window.",
  );
  await page.goto("./");
  await page.getByRole("button", { name: "Open introduction" }).click();
  const window = page.locator(".notes-window");
  const before = await window.boundingBox();
  if (!before) throw new Error("Notes window missing");
  const title = page.locator(".notes-titlebar");
  const bar = await title.boundingBox();
  if (!bar) throw new Error("Titlebar missing");
  await page.mouse.move(bar.x + bar.width / 2, bar.y + 20);
  await page.mouse.down();
  await page.mouse.move(bar.x + bar.width / 2 + 60, bar.y + 60, { steps: 8 });
  await page.mouse.up();
  const moved = await window.boundingBox();
  expect(moved!.x).toBeGreaterThan(before.x + 40);
  expect(moved!.y).toBeGreaterThan(before.y + 20);
  const handle = await page.locator(".window-resize").boundingBox();
  if (!handle) throw new Error("Resize handle missing");
  await page.mouse.move(
    handle.x + handle.width - 4,
    handle.y + handle.height - 4,
  );
  await page.mouse.down();
  await page.mouse.move(handle.x - 65, handle.y - 30, { steps: 8 });
  await page.mouse.up();
  const resized = await window.boundingBox();
  expect(resized!.width).toBeLessThan(moved!.width - 40);
  expect(resized!.x).toBeGreaterThanOrEqual(0);
  expect(resized!.y).toBeGreaterThanOrEqual(34);
});
