import { test, expect } from "@playwright/test";

test("Safari starts on Overview and preserves profile content and tab history", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  const safari = page.getByRole("region", { name: "Safari", exact: true });
  await expect(safari).toBeVisible();
  await expect(safari.getByRole("tab", { name: /Overview/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(safari).toContainText("T-shaped thinking");
  await expect(safari).toContainText("おもてなし");
  await expect(safari).toContainText("paying it forward");
  await safari.getByRole("tab", { name: /Experience/ }).click();
  await expect(
    safari.getByRole("heading", { name: "Galaxy Digital", exact: true }),
  ).toBeVisible();
  await expect(safari).toContainText("AI Champion");
  await expect(safari).toContainText("CID Director Awards");
  await safari
    .getByRole("button", { name: "Safari back", exact: true })
    .click();
  await expect(safari.getByRole("tab", { name: /Overview/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await safari
    .getByRole("button", { name: "Safari forward", exact: true })
    .click();
  await expect(safari.getByRole("tab", { name: /Experience/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await safari.getByRole("tab", { name: /Projects/ }).click();
  await expect(
    safari.getByRole("link", { name: "Explore the source" }),
  ).toHaveAttribute("href", "https://github.com/kenrickles/markupWebsite");
  expect(errors).toEqual([]);
});

test("Notes has an honest empty state and excludes draft titles and content", async ({
  page,
  request,
  isMobile,
}) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Open writing", exact: true }).click();
  const notes = page.getByRole("region", { name: "Notes", exact: true });
  await expect(notes).toContainText("Nothing published yet.");
  await expect(notes).not.toContainText("The Renaissance Developer");
  const back = notes.getByRole("button", { name: "Writing", exact: true });
  if (isMobile) await back.click();
  await expect(
    notes.getByText("0 published notes", { exact: true }),
  ).toBeVisible();
  await notes
    .getByRole("searchbox", { name: "Search writing" })
    .fill("Renaissance");
  await expect(notes).toContainText("No matching writing.");
  await notes
    .getByRole("button", { name: "Engineering 0", exact: true })
    .click();
  const map = await request.get("./sitemap.xml");
  expect(await map.text()).not.toContain("renaissance-developer");
  expect((await request.get("./writing/renaissance-developer/")).status()).toBe(
    404,
  );
  expect((await request.get("./writing/_empty/")).status()).toBe(404);
});

test("roadmap filters public aspirations without visitor-editable completion", async ({
  page,
}) => {
  await page.goto("./#reminders");
  const roadmap = page.getByRole("region", { name: "Reminders", exact: true });
  await expect(roadmap).toContainText("0/5 completed");
  await expect(roadmap.getByRole("checkbox")).toHaveCount(0);
  await roadmap.getByRole("button", { name: /^Completed/ }).click();
  await expect(roadmap).toContainText("A place for milestones.");
  await roadmap.getByRole("button", { name: /^Planned/ }).click();
  await expect(roadmap.getByRole("listitem")).toHaveCount(5);
});

test("Finder has searchable categories and no invented recommendations", async ({
  page,
}) => {
  await page.goto("./#finder");
  const finder = page.getByRole("region", { name: "Finder", exact: true });
  await expect(finder).toContainText("No recommendations added yet.");
  await finder.getByRole("button", { name: "Books", exact: true }).click();
  await expect(
    finder.getByRole("button", { name: "Books", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await finder.getByRole("searchbox").fill("unknown");
  await expect(finder).toContainText("No matching resources.");
});

test("Safari controls preserve selected tab and offer a real PDF download", async ({
  page,
  request,
}) => {
  await page.goto("./#safari/resume");
  const safari = page.getByRole("region", { name: "Safari", exact: true });
  await expect(
    safari.getByRole("link", { name: "Download PDF", exact: true }),
  ).toBeVisible();
  const href = await safari
    .getByRole("link", { name: "Download PDF", exact: true })
    .getAttribute("href");
  const response = await request.get(href!);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  await safari
    .getByRole("button", { name: "Minimize Safari", exact: true })
    .click();
  await expect(safari).not.toBeVisible();
  await page
    .getByRole("button", { name: "Open Safari profile", exact: true })
    .click();
  await expect(safari.getByRole("tab", { name: /Résumé/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await safari
    .getByRole("button", { name: "Expand Safari window", exact: true })
    .click();
  await expect(safari).toHaveClass(/notes-expanded/);
  await safari
    .getByRole("button", { name: "Restore Safari window", exact: true })
    .click();
  await safari.getByRole("link", { name: "Open printable version" }).click();
  await expect(page.locator(".resume-page")).toContainText(
    "Teaching Assistant",
  );
});

test("Messages remains separate and preserves its conversation when minimized", async ({
  page,
}) => {
  await page.goto("./");
  await page
    .getByRole("button", { name: "Open Messages", exact: true })
    .click();
  const messages = page.getByRole("region", { name: "Messages", exact: true });
  await messages
    .getByRole("button", {
      name: "Conversation with Research Agent",
      exact: true,
    })
    .click();
  await expect(messages.getByRole("log")).toContainText(
    "i’m leaning towards unplugging you",
  );
  await expect(messages).toContainText("Fictional conversations");
  await messages
    .getByRole("button", { name: "Minimize Messages", exact: true })
    .click();
  await expect(messages).not.toBeVisible();
  await page
    .getByRole("button", { name: "Open Messages", exact: true })
    .click();
  await expect(messages.getByRole("log")).toContainText(
    "i’m leaning towards unplugging you",
  );
});

test("appearance, reduced motion, blocked storage and narrow layouts remain usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("Blocked");
    };
    Storage.prototype.setItem = () => {
      throw new Error("Blocked");
    };
  });
  await page.goto("./");
  await page
    .getByRole("button", { name: "Appearance settings", exact: true })
    .click();
  const settings = page.getByRole("dialog", {
    name: "Appearance settings",
    exact: true,
  });
  await settings.getByRole("button", { name: "Light", exact: true }).click();
  await expect(page.locator(".desktop-portfolio")).not.toHaveClass(
    /desktop-night/,
  );
  await settings.getByRole("button", { name: "Dark", exact: true }).click();
  await expect(page.locator(".desktop-portfolio")).toHaveClass(/desktop-night/);
  await page.keyboard.press("Escape");
  for (const label of [
    "Open writing",
    "Open roadmap",
    "Open recommended tools",
    "Open Safari profile",
  ]) {
    await page.getByRole("button", { name: label, exact: true }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    expect(
      await page
        .locator(".application-window.front-window")
        .evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
  }
});

test("resume and writing index are available without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await page
    .getByRole("link", { name: "complete résumé", exact: true })
    .click();
  await expect(page.locator(".resume-page")).toContainText("Galaxy Digital");
  await expect(page.locator(".resume-page")).toContainText("Financial Adviser");
  await page.goto(`${baseURL}writing/`);
  await expect(
    page.getByText("Nothing published yet.", { exact: true }),
  ).toBeVisible();
  await context.close();
});

test("dock stays in the viewport while Safari scrolls and the viewport changes", async ({
  page,
}) => {
  await page.goto("./#safari/experience");
  const dock = page.getByRole("navigation", { name: "Application dock" });
  const safari = page.getByRole("region", { name: "Safari", exact: true });
  const reader = safari.getByRole("tabpanel");
  const assertDock = async () => {
    await expect(dock).toBeVisible();
    const geometry = await dock.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const viewport = window.visualViewport;
      return {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        height: viewport?.height ?? innerHeight,
        width: viewport?.width ?? innerWidth,
        scrollY: window.scrollY,
      };
    });
    expect(geometry.top).toBeGreaterThanOrEqual(0);
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.height);
    expect(geometry.left).toBeGreaterThanOrEqual(0);
    expect(geometry.right).toBeLessThanOrEqual(geometry.width);
    expect(geometry.scrollY).toBe(0);
  };
  await assertDock();
  // Real wheel input exercises the article scroller and scroll chaining at its edge.
  await reader.hover();
  await page.mouse.wheel(0, 100000);
  await expect
    .poll(() => reader.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(0);
  await page.mouse.wheel(0, 100000);
  await assertDock();
  await safari
    .getByRole("button", { name: "Expand Safari window", exact: true })
    .click();
  await assertDock();
  // Short landscape viewports used to put the dock below the 450px desktop minimum.
  await page.setViewportSize({ width: 844, height: 390 });
  await assertDock();
  await page.setViewportSize({ width: 390, height: 600 });
  await assertDock();
  await page.setViewportSize({ width: 390, height: 740 });
  await assertDock();
  await dock.getByRole("button", { name: "Open writing", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "Notes", exact: true }),
  ).toHaveClass(/front-window/);
});
