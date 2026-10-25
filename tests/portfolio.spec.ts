import { test, expect, type Page } from "@playwright/test";

async function openContact(page: Page) {
  await page
    .getByRole("button", { name: "Open introduction", exact: true })
    .click();
  const back = page.getByRole("button", {
    name: "Back to note list",
    exact: true,
  });
  if (await back.isVisible()) await back.click();
  await page.getByRole("button", { name: /^Say hello/ }).click();
}

test("recovered introduction, work history, and chronology render without errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Kenrick Tan",
  );
  await expect(page.locator(".note-content")).toContainText(
    "I value T-shaped thinking: building depth in my craft while staying curious about the fields around it.",
  );
  await expect(page.getByRole("img", { name: "Kenrick Tan" })).toBeVisible();
  await expect(page.getByText("Selected work", { exact: true })).toHaveCount(0);
  await page
    .getByRole("button", { name: "Open experience", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Galaxy Digital", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".desktop-experience")).toContainText(
    "AI Champion",
  );
  await expect(
    page.getByRole("heading", {
      name: "Singapore Management University",
      exact: true,
    }),
  ).toBeAttached();
  await expect(page.locator(".desktop-experience")).toContainText("S$356,000");
  await expect(page.locator(".desktop-experience")).not.toContainText("Swype");
  await expect(page.locator(".desktop-experience")).not.toContainText(
    "mindPower",
  );
  await page.getByRole("button", { name: "Previous note" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Kenrick Tan",
  );
  await page.getByRole("button", { name: "Next note" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Experience",
  );
  expect(errors).toEqual([]);
});

test("note search finds recovered roles and handles no results", async ({
  page,
}) => {
  await page.goto("./");
  const back = page.getByRole("button", {
    name: "Back to note list",
    exact: true,
  });
  if (await back.isVisible()) await back.click();
  const search = page.getByRole("textbox", { name: "Search notes" });
  await search.fill("no-such-note");
  await expect(page.getByRole("status")).toHaveText("No matching notes.");
  await search.fill("Management Associate");
  await page.getByRole("button", { name: /^Experience Galaxy/ }).click();
  await expect(page.locator(".note-content")).toContainText(
    "Management Associate Program goal of S$356,000",
  );
  await page
    .getByRole("button", { name: "Open introduction", exact: true })
    .click();
  if (await back.isVisible()) await back.click();
  await expect(search).toHaveValue("");
  await page.getByRole("button", { name: /^Education & recognition/ }).click();
  await expect(page.locator(".note-content")).toContainText("IE University");
  await expect(
    page.getByRole("link", { name: "Verify Certification" }),
  ).toHaveAttribute("href", /credly.com/);
  await expect(page.locator(".note-content")).toContainText(
    "CID Director Awards",
  );
});

test("Messages is a separate fictional agent conversation app", async ({
  page,
}) => {
  await page.goto("./");
  await page
    .getByRole("button", { name: "Open Messages", exact: true })
    .click();
  const messages = page.getByRole("region", { name: "Messages", exact: true });
  await expect(messages).toBeVisible();
  await messages
    .getByRole("button", {
      name: "Conversation with The agent group chat",
      exact: true,
    })
    .click();
  await expect(messages.getByRole("log")).toContainText(
    "remove the roadmap. add the website.",
  );
  await expect(messages).toContainText("Fictional conversations");
  const back = messages.getByRole("button", {
    name: "Back to conversation list",
    exact: true,
  });
  if (await back.isVisible()) await back.click();
  await messages
    .getByRole("button", {
      name: "Conversation with Research Agent",
      exact: true,
    })
    .click();
  await expect(messages.getByRole("log")).toContainText(
    "i’m leaning towards unplugging you",
  );
  await expect(messages.getByRole("textbox")).toBeDisabled();
  await messages
    .getByRole("button", { name: "Minimize Messages", exact: true })
    .click();
  await expect(messages).not.toBeVisible();
  await page
    .getByRole("button", { name: "Open Messages", exact: true })
    .click();
  await expect(messages).toBeVisible();
  await expect(messages.getByRole("log")).toContainText(
    "i’m leaning towards unplugging you",
  );
  await messages
    .getByRole("button", { name: "Close Messages", exact: true })
    .click();
  await expect(messages).not.toBeAttached();
});

test("window controls restore Notes and printable resume contains the recovered content", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Minimize notes" }).click();
  await expect(
    page.getByRole("region", { name: "Portfolio notes" }),
  ).not.toBeVisible();
  await page.getByRole("button", { name: "Open notes", exact: true }).click();
  await page
    .getByRole("button", { name: "Expand window", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Portfolio notes", exact: true }),
  ).toHaveClass(/notes-expanded/);
  await page
    .getByRole("button", { name: "Restore window", exact: true })
    .click();
  await page.getByRole("link", { name: "Open résumé", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Print / Save as PDF" }),
  ).toBeVisible();
  await expect(page.locator(".resume-page")).toContainText("Galaxy Digital");
  await expect(page.locator(".resume-page")).toContainText("Financial Adviser");
  await expect(page.locator(".resume-page")).toContainText(
    "CID Director Awards",
  );
});

test("Apple menu and native appearance panel remain compact", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Apple menu", exact: true }).click();
  await page
    .getByRole("button", { name: "About Kenrick Tan", exact: true })
    .click();
  const about = page.getByRole("dialog", {
    name: "About Kenrick Tan",
    exact: true,
  });
  await expect(about).toContainText("Galaxy Digital");
  expect((await about.boundingBox())!.height).toBeLessThan(450);
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Appearance settings", exact: true })
    .click();
  const settings = page.getByRole("dialog", {
    name: "Appearance settings",
    exact: true,
  });
  await settings.getByRole("button", { name: "Dark", exact: true }).click();
  await expect(page.locator(".desktop-portfolio")).toHaveClass(/desktop-night/);
  await settings.getByRole("button", { name: "Light", exact: true }).click();
  await expect(page.locator(".desktop-portfolio")).not.toHaveClass(
    /desktop-night/,
  );
  await page.keyboard.press("Escape");
});

test("reduced motion and blocked storage keep both apps usable without clipping", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
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
  await openContact(page);
  await expect(page.locator(".contact-letter")).toHaveAttribute(
    "href",
    "mailto:kenrickles@gmail.com",
  );
  expect(
    await page
      .locator(".note-content")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Open Messages", exact: true })
    .click();
  const messages = page.getByRole("region", { name: "Messages", exact: true });
  await messages
    .getByRole("button", {
      name: "Conversation with Deploy Agent",
      exact: true,
    })
    .click();
  expect(
    await messages
      .locator(".agent-thread")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: info.outputPath("agent-messages.png"),
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("removed case studies are absent from routes and sitemap", async ({
  request,
}) => {
  const response = await request.get("./case-studies/protocol-flight-deck/");
  expect(response.status()).toBe(404);
  const map = await request.get("./sitemap.xml");
  expect(await map.text()).not.toContain("case-studies");
});

test("resume remains accessible without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Kenrick Tan",
  );
  await page.getByRole("link", { name: "Open résumé", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Kenrick Tan", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".resume-page")).toContainText(
    "Teaching Assistant",
  );
  await expect(page.locator(".resume-page")).not.toContainText("Swype");
  await expect(page.locator(".resume-page")).not.toContainText("mindPower");
  await context.close();
});
