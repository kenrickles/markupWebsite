import { test, expect, type Page } from "@playwright/test";
import { completeTerminal, executeTerminal } from "../src/lib/terminal";
import { introduction } from "../src/lib/introduction";

async function openTerminal(page: Page) {
  await page
    .getByRole("button", { name: "Open interactive terminal", exact: true })
    .click();
  const terminal = page.getByRole("region", { name: "Terminal", exact: true });
  await expect(terminal).toBeVisible();
  return terminal;
}
async function command(page: Page, value: string) {
  const input = page.getByRole("textbox", {
    name: "Terminal input",
    exact: true,
  });
  await input.fill(value);
  await input.press("Enter");
}

test("filesystem uses the real profile and handles paths, quotes and completion", () => {
  const ctx = {
    cwd: "/",
    previousCwd: "/",
    history: [],
    theme: "light" as const,
  };
  expect(executeTerminal('cat "about.md"', ctx).lines[0].text).toContain(
    introduction.paragraphs[4],
  );
  expect(executeTerminal("cd experience/../experience", ctx).cwd).toBe(
    "/experience",
  );
  expect(executeTerminal("cd ../../..", ctx).cwd).toBe("/");
  expect(executeTerminal('cat "unfinished', ctx).lines[0].tone).toBe("error");
  expect(executeTerminal("cat experience", ctx).lines[0].text).toContain(
    "is a directory",
  );
  expect(executeTerminal("cd about.md", ctx).lines[0].text).toContain(
    "not a directory",
  );
  expect(
    executeTerminal("open https://example.com", ctx).action,
  ).toBeUndefined();
  expect(completeTerminal("cd exp", "/").input).toBe("cd experience/");
  expect(completeTerminal("cat ../abo", "/experience").input).toBe(
    "cat ../about.md ",
  );
  expect(completeTerminal("cat experience/01", "/").input).toBe(
    "cat experience/01-galaxy-digital.md ",
  );
  expect(completeTerminal("open m", "/").input).toBe("open messages ");
});

test("visitors explore files, work history and accurate biography", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./");
  const terminal = await openTerminal(page);
  const log = terminal.getByRole("log");
  await terminal.getByRole("button", { name: "ls", exact: true }).click();
  await expect(log).toContainText("experience/");
  await expect(log).toContainText("principles.md");
  await command(page, "cd experience");
  await expect(terminal.locator(".terminal-prompt")).toContainText(
    "~/experience",
  );
  await command(page, "ls");
  await expect(log).toContainText("01-galaxy-digital.md");
  await expect(log).not.toContainText("swype");
  await expect(log).not.toContainText("mindpower");
  await command(page, "cat 01-galaxy-digital.md");
  await expect(log).toContainText("Sep 2025 — Present");
  await expect(log).toContainText("AI Champion");
  await terminal
    .getByRole("button", { name: "cat ~/about.md", exact: true })
    .click();
  await expect(log).toContainText(introduction.lead);
  await command(page, "cat ../about.md");
  await expect(log).toContainText(introduction.paragraphs[3]);
  await command(page, "cd ..");
  await command(page, "cat principles.md");
  await expect(log).toContainText("paying it forward");
  await command(page, "whoam");
  await expect(log).toContainText("Did you mean whoami?");
  await command(page, "<img src=x onerror=alert(1)>");
  await expect(log.locator("img")).toHaveCount(0);
  expect(
    await terminal.evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("completion, history draft, cancellation and clear behave like a shell", async ({
  page,
}) => {
  await page.goto("./");
  const terminal = await openTerminal(page);
  const input = terminal.getByRole("textbox");
  await input.fill("cat abo");
  await input.press("Tab");
  await expect(input).toHaveValue("cat about.md ");
  await input.press("Enter");
  await input.fill("unfinished draft");
  await input.press("ArrowUp");
  await expect(input).toHaveValue("cat about.md");
  await input.press("ArrowDown");
  await expect(input).toHaveValue("unfinished draft");
  await input.press("Control+c");
  await expect(input).toHaveValue("");
  await expect(terminal.getByRole("log")).toContainText("unfinished draft^C");
  await command(page, "sudo ship");
  await expect(terminal.getByRole("log")).toContainText(
    "normally you ask me another six times",
  );
  await command(page, "history");
  await expect(terminal.getByRole("log")).toContainText("2  sudo ship");
  await input.fill("keep this draft");
  await input.press("Control+l");
  await expect(terminal.getByRole("log")).toBeEmpty();
  await expect(input).toHaveValue("keep this draft");
  await input.fill("cat ");
  await input.press("Tab");
  await expect(terminal.getByRole("log")).toContainText("about.md");
  await expect(input).toBeFocused();
  await input.fill("");
  await input.press("Tab");
  await expect(input).not.toBeFocused();
});

test("window controls preserve session and cooperate with Notes and Messages", async ({
  page,
}) => {
  await page.goto("./");
  const terminal = await openTerminal(page);
  await command(page, "cd experience");
  await command(page, "git blame");
  await terminal
    .getByRole("button", { name: "Expand terminal window", exact: true })
    .click();
  await expect(terminal).toHaveClass(/notes-expanded/);
  await terminal
    .getByRole("button", { name: "Restore terminal window", exact: true })
    .click();
  await expect(terminal).not.toHaveClass(/notes-expanded/);
  await terminal
    .getByRole("button", { name: "Minimize terminal", exact: true })
    .click();
  await expect(terminal).not.toBeVisible();
  await openTerminal(page);
  await expect(terminal.getByRole("log")).toContainText("you approved the PR");
  await expect(terminal.locator(".terminal-prompt")).toContainText(
    "~/experience",
  );
  await command(page, "open messages");
  const messages = page.getByRole("region", { name: "Messages", exact: true });
  await expect(messages).toHaveClass(/front-window/);
  await openTerminal(page);
  await expect(terminal).toHaveClass(/front-window/);
  await command(page, "open experience");
  await expect(page.getByRole("region", { name: "Safari" })).toHaveClass(
    /front-window/,
  );
  await expect(
    page.getByRole("heading", { name: "Galaxy Digital", exact: true }),
  ).toBeVisible();
  await openTerminal(page);
  await terminal
    .getByRole("button", { name: "Close terminal", exact: true })
    .click();
  await openTerminal(page);
  await expect(terminal.locator(".terminal-prompt")).toContainText(
    "~/experience",
  );
  await command(page, "exit");
  await expect(terminal).not.toBeVisible();
});

test("desktop drag, keyboard resize, menu controls and shortcut share one window", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Desktop window manipulation uses the wide layout");
  await page.goto("./");
  await page.keyboard.press("Control+Backquote");
  const terminal = page.getByRole("region", { name: "Terminal", exact: true });
  await expect(terminal).toBeVisible();
  await expect(terminal.getByRole("textbox")).toBeFocused();
  const before = (await terminal.boundingBox())!;
  await page.mouse.move(before.x + 250, before.y + 18);
  await page.mouse.down();
  await page.mouse.move(before.x + 300, before.y + 43, { steps: 5 });
  await page.mouse.up();
  const moved = (await terminal.boundingBox())!;
  expect(moved.x).toBeGreaterThan(before.x + 30);
  expect(moved.y).toBeGreaterThan(before.y + 15);
  const resize = terminal.getByRole("button", {
    name: "Resize terminal (arrow keys)",
    exact: true,
  });
  await resize.focus();
  await resize.press("ArrowRight");
  await expect
    .poll(async () => (await terminal.boundingBox())!.width)
    .toBeGreaterThan(moved.width + 10);
  await page.getByRole("button", { name: "View", exact: true }).click();
  await page.getByRole("button", { name: "Zoom Window", exact: true }).click();
  await expect(terminal).toHaveClass(/notes-expanded/);
  await page.getByRole("button", { name: "File", exact: true }).click();
  await page.getByRole("button", { name: "Close Window", exact: true }).click();
  await expect(terminal).not.toBeVisible();
  await page.keyboard.press("Control+Backquote");
  await expect(terminal).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Terminal", exact: true }),
  ).toHaveCount(1);
});

test("touch starters, appearance, reduced motion and resume routing", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("Storage blocked");
    };
    Storage.prototype.setItem = () => {
      throw new Error("Storage blocked");
    };
  });
  await page.goto("./");
  const terminal = await openTerminal(page);
  await terminal
    .getByRole("button", { name: "agent status", exact: true })
    .click();
  await expect(terminal.getByRole("log")).toContainText(
    "kenrick     doing it himself",
  );
  await command(page, "theme dark");
  await expect(page.locator(".desktop-portfolio")).toHaveClass(/desktop-night/);
  await command(page, "theme light");
  await expect(page.locator(".desktop-portfolio")).not.toHaveClass(
    /desktop-night/,
  );
  await terminal.getByRole("textbox").fill("whoami");
  await terminal
    .getByRole("button", { name: "Run command", exact: true })
    .click();
  await expect(terminal.getByRole("log")).toContainText(
    "Protocol Engineer at Galaxy Digital",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: test.info().outputPath("terminal.png"),
    fullPage: true,
  });
  await command(page, "open resume");
  await expect(page).toHaveURL(/#safari\/resume$/);
  await expect(
    page.getByRole("heading", { name: "Kenrick Tan", exact: true }),
  ).toBeVisible();
});
