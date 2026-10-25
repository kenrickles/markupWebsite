import { introduction } from "./introduction";
import { experiences, education } from "./profile";
import { certifications } from "./recoveredProfile";

export type TerminalLine = {
  text: string;
  tone?: "muted" | "success" | "error" | "accent" | "command";
};
export const terminalBanner: TerminalLine[] = [
  { text: "Kenrick’s Mac · Portfolio shell", tone: "success" },
  {
    text: "A little filesystem. A few opinions. Type help to explore.",
    tone: "muted",
  },
];
type Entry = { kind: "file"; content: string } | { kind: "directory" };
const files: Record<string, Entry> = {
  "/": { kind: "directory" },
  "/about.md": {
    kind: "file",
    content: [
      introduction.lead,
      introduction.name,
      introduction.heading.join("\n"),
      ...introduction.paragraphs,
    ].join("\n\n"),
  },
  "/principles.md": {
    kind: "file",
    content: introduction.paragraphs.slice(2).join("\n\n"),
  },
  "/contact.md": {
    kind: "file",
    content:
      "Email     kenrickles@gmail.com\nGitHub    github.com/kenrickles\nLinkedIn  linkedin.com/in/kenrick-tan\nTelegram  t.me/kenrickles\n\nTry: open github, open linkedin, open telegram",
  },
  "/education.md": {
    kind: "file",
    content: [
      ...education.map(
        (e) =>
          `${e.school}\n${e.program}\n${e.timeframe} · ${e.location}\n${e.highlights.join("\n")}`,
      ),
      ...certifications.map(
        (c) => `${c.title}\n${c.organization} · ${c.timeframe}`,
      ),
    ].join("\n\n"),
  },
  "/skills.md": {
    kind: "file",
    content: [...new Set(experiences.flatMap((e) => e.stack))].join("\n"),
  },
  "/experience": { kind: "directory" },
};
experiences.forEach((job, i) => {
  const slug = job.company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-$/, "");
  files[`/experience/${String(i + 1).padStart(2, "0")}-${slug}.md`] = {
    kind: "file",
    content: `${job.company}\n${job.role}\n${job.timeframe} · ${job.location}\n\n${job.highlights.map((h) => `• ${h}`).join("\n")}\n${job.stack.length ? `\nTools & areas: ${job.stack.join(", ")}` : ""}`,
  };
});

export const terminalLinks = {
  github: "https://github.com/kenrickles",
  linkedin: "https://linkedin.com/in/kenrick-tan",
  telegram: "https://t.me/kenrickles",
  resume: "/resume/",
};
export type TerminalTarget =
  | keyof typeof terminalLinks
  | "about"
  | "experience"
  | "education"
  | "contact"
  | "messages"
  | "projects"
  | "notes"
  | "roadmap"
  | "tools";
export const terminalTargets: TerminalTarget[] = [
  "about",
  "experience",
  "education",
  "contact",
  "messages",
  "projects",
  "notes",
  "roadmap",
  "tools",
  "resume",
  "github",
  "linkedin",
  "telegram",
];
const commands = [
  "help",
  "whoami",
  "projects",
  "now",
  "contact",
  "writing",
  "roadmap",
  "tools",
  "pwd",
  "ls",
  "cd",
  "cat",
  "open",
  "history",
  "clear",
  "exit",
  "theme",
  "agent",
  "sudo",
  "git",
  "kubectl",
];
export const displayPath = (cwd: string) => (cwd === "/" ? "~" : `~${cwd}`);
export const terminalPrompt = (cwd: string) =>
  `kenrick@portfolio ${displayPath(cwd)} %`;
function pathFor(value: string, cwd: string) {
  const path = value.replace(/^\/Users\/kenrick(?=\/|$)/, "~");
  const absolute = path.startsWith("/") || path.startsWith("~");
  const parts = (absolute ? path.replace(/^~/, "") : `${cwd}/${path}`).split(
    "/",
  );
  const result: string[] = [];
  for (const part of parts) {
    if (part === "..") result.pop();
    else if (part && part !== ".") result.push(part);
  }
  return `/${result.join("/")}`;
}
function children(path: string) {
  const prefix = path === "/" ? "/" : `${path}/`;
  return Object.keys(files).filter(
    (p) =>
      p.startsWith(prefix) &&
      p !== path &&
      !p.slice(prefix.length).includes("/"),
  );
}
function distance(a: string, b: string) {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 0; i < a.length; i++) {
    const next = [i + 1];
    for (let j = 0; j < b.length; j++)
      next.push(
        Math.min(next[j] + 1, row[j + 1] + 1, row[j] + (a[i] === b[j] ? 0 : 1)),
      );
    row = next;
  }
  return row[b.length];
}
function suggest(value: string, options: string[]) {
  if (value.length > 80) return "";
  const best = options
    .map((name) => ({ name, score: distance(value, name) }))
    .sort((a, b) => a.score - b.score)[0];
  return best && best.score <= 2 ? ` Did you mean ${best.name}?` : "";
}
function tokenize(raw: string): string[] | null {
  const tokens: string[] = [];
  let token = "",
    quote = "",
    escaped = false,
    started = false;
  for (const char of raw) {
    if (escaped) {
      token += char;
      escaped = false;
      started = true;
    } else if (char === "\\" && quote !== "'") {
      escaped = true;
      started = true;
    } else if (quote) {
      if (char === quote) quote = "";
      else token += char;
    } else if (char === '"' || char === "'") {
      quote = char;
      started = true;
    } else if (/\s/.test(char)) {
      if (started) tokens.push(token);
      token = "";
      started = false;
    } else {
      token += char;
      started = true;
    }
  }
  if (quote || escaped) return null;
  if (started) tokens.push(token);
  return tokens;
}
type Context = {
  cwd: string;
  previousCwd: string;
  history: string[];
  theme: "dark" | "light";
};
export type TerminalResult = {
  lines: TerminalLine[];
  cwd?: string;
  previousCwd?: string;
  action?: TerminalTarget | "exit";
  theme?: "dark" | "light";
  clear?: boolean;
};
export function executeTerminal(raw: string, ctx: Context): TerminalResult {
  const out = (text: string, tone?: TerminalLine["tone"]): TerminalResult => ({
    lines: [{ text, tone }],
  });
  const error = (text: string) => out(text, "error");
  const tokens = tokenize(raw);
  if (!tokens)
    return error("Unclosed quote or escape. Finish the command and try again.");
  const [command, ...args] = tokens;
  if (!command) return { lines: [] };
  const arg = args[0];
  if (command === "help")
    return out(
      [
        "EXPLORE",
        "  ls [path]          List files",
        "  cd [directory]     Move around (.., ~ and - work)",
        "  pwd                Show your location",
        "  cat <file>         Read a file",
        "  whoami             Meet Kenrick",
        "",
        "OPEN",
        "  open <app>         about · experience · education · contact",
        "                     projects · notes · roadmap · tools · messages",
        "                     resume · github · linkedin · telegram",
        "  projects / writing / roadmap / tools    Open an app",
        "  now                Current direction",
        "  contact            Ways to get in touch",
        "",
        "SESSION",
        "  history            Commands from this visit",
        "  clear              Clear the screen (Ctrl+L)",
        "  theme dark|light   Change the desktop appearance",
        "  exit               Close this window",
        "",
        "↑↓ history · Tab complete · Ctrl+C cancel input",
        "Curious? Try agent status.",
      ].join("\n"),
    );
  if (
    ["projects", "writing", "roadmap", "tools", "contact"].includes(command)
  ) {
    if (args.length) return error(`usage: ${command}`);
    const target = (
      command === "writing" ? "notes" : command
    ) as TerminalTarget;
    return {
      lines: [{ text: `Opening ${command}…`, tone: "muted" }],
      action: target,
    };
  }
  if (command === "now")
    return out(
      "Protocol Engineer at Galaxy Digital.\nExploring blockchain, infrastructure and practical AI.\n\nFor my public aspirations: roadmap\nFor published thoughts: writing",
    );
  if (command === "whoami")
    return out(
      `${introduction.name}\n${experiences[0].role} at ${experiences[0].company} · ${experiences[0].location}\n\n${introduction.heading.join("\n")}\n\nRead more: cat about.md`,
      "success",
    );
  if (command === "pwd")
    return out(`/Users/kenrick${ctx.cwd === "/" ? "" : ctx.cwd}`);
  if (command === "ls" || command === "cd") {
    if (args.length > 1)
      return error(
        `usage: ${command} [${command === "cd" ? "directory" : "path"}]`,
      );
    const path =
      command === "cd" && arg === "-"
        ? ctx.previousCwd
        : pathFor(arg ?? (command === "cd" ? "~" : "."), ctx.cwd);
    const entry = files[path];
    if (!entry) return error(`${command}: ${arg}: no such file or directory`);
    if (command === "cd") {
      if (entry.kind !== "directory")
        return error(`cd: ${arg}: not a directory`);
      return {
        lines: arg === "-" ? [{ text: displayPath(path), tone: "muted" }] : [],
        cwd: path,
        previousCwd: ctx.cwd,
      };
    }
    if (entry.kind === "file") return out(path.split("/").at(-1)!);
    return {
      lines: children(path).map((p) => ({
        text: `${p.split("/").at(-1)}${files[p].kind === "directory" ? "/" : ""}`,
        tone: files[p].kind === "directory" ? "accent" : undefined,
      })),
    };
  }
  if (command === "cat") {
    if (!args.length) return error("usage: cat <file> (try cat about.md)");
    return {
      lines: args.flatMap((name) => {
        const path = pathFor(name, ctx.cwd),
          entry = files[path];
        if (!entry)
          return [
            {
              text: `cat: ${name}: no such file.${suggest(
                name,
                children(ctx.cwd)
                  .filter((p) => files[p].kind === "file")
                  .map((p) => p.split("/").at(-1)!),
              )}`,
              tone: "error" as const,
            },
          ];
        if (entry.kind === "directory")
          return [
            {
              text: `cat: ${name}: is a directory. Try ls ${name}`,
              tone: "error" as const,
            },
          ];
        return [{ text: entry.content }];
      }),
    };
  }
  if (command === "open") {
    if (args.length !== 1 || !terminalTargets.includes(arg as TerminalTarget))
      return error(`usage: open <${terminalTargets.join("|")}>`);
    return {
      lines: [{ text: `Opening ${arg}…`, tone: "muted" }],
      action: arg as TerminalTarget,
    };
  }
  if (command === "history")
    return out(
      ctx.history
        .map((h, i) => `${String(i + 1).padStart(3)}  ${h}`)
        .join("\n"),
    );
  if (command === "clear") return { lines: [], clear: true };
  if (command === "exit") return { lines: [], action: "exit" };
  if (command === "theme") {
    if (args.length !== 1 || (arg !== "dark" && arg !== "light"))
      return error(`usage: theme dark|light (current: ${ctx.theme})`);
    return {
      lines: [{ text: `Desktop appearance: ${arg}`, tone: "success" }],
      theme: arg,
    };
  }
  if (command === "agent")
    return args.length === 1 && arg === "status"
      ? out(
          "planner     planning\nbuilder     waiting for planner\nreviewer    requesting confirmation\nkenrick     doing it himself",
          "success",
        )
      : error("usage: agent status");
  if (command === "sudo")
    return args.join(" ") === "ship"
      ? out(
          "permission granted.\nunusual. normally you ask me another six times.",
          "accent",
        )
      : error("No extra permissions here. Try sudo ship.");
  if (command === "git")
    return args.length === 1 && arg === "blame"
      ? out("nice try. you approved the PR.", "accent")
      : error("This repository has one working git command: git blame.");
  if (command === "kubectl") {
    if (args.length === 2 && arg === "get") {
      if (args[1] === "experience")
        return out(
          experiences
            .map((e) => `${e.company}\n  ${e.role} · ${e.timeframe}`)
            .join("\n\n"),
        );
      if (args[1] === "skills")
        return out((files["/skills.md"] as { content: string }).content);
      if (args[1] === "contact")
        return out((files["/contact.md"] as { content: string }).content);
      if (args[1] === "pods")
        return out(
          "Portfolio simulation\n\nwebsite       Running\nagents        Overthinking\npatience      CrashLoopBackOff",
          "accent",
        );
    }
    return error("usage: kubectl get <experience|skills|contact|pods>");
  }
  return error(
    `command not found: ${command}.${suggest(command, commands)} Type help for commands.`,
  );
}

/** Complete only the current command's arguments, preserving paths and directories. */
export function completeTerminal(
  input: string,
  cwd: string,
): { input: string; choices: string[] } {
  const parts = input.split(/\s+/),
    last = parts.at(-1) ?? "";
  const command = parts[0];
  let candidates: string[] = [];
  if (parts.length === 1) candidates = commands;
  else if (command === "open" && parts.length === 2)
    candidates = terminalTargets;
  else if (command === "theme" && parts.length === 2)
    candidates = ["dark", "light"];
  else if (command === "agent" && parts.length === 2) candidates = ["status"];
  else if (command === "git" && parts.length === 2) candidates = ["blame"];
  else if (command === "sudo" && parts.length === 2) candidates = ["ship"];
  else if (command === "kubectl" && parts.length === 2) candidates = ["get"];
  else if (command === "kubectl" && parts[1] === "get" && parts.length === 3)
    candidates = ["experience", "skills", "contact", "pods"];
  else if (["cd", "cat", "ls"].includes(command)) {
    const split = last.lastIndexOf("/"),
      prefix = split >= 0 ? last.slice(0, split + 1) : "";
    const directory = pathFor(prefix || ".", cwd);
    candidates = children(directory)
      .filter((p) => command !== "cd" || files[p].kind === "directory")
      .map(
        (p) =>
          `${prefix}${p.split("/").at(-1)}${files[p].kind === "directory" ? "/" : ""}`,
      );
  }
  const matches = candidates.filter((c) => c.startsWith(last));
  if (!matches.length) return { input, choices: [] };
  let common = matches[0];
  for (const match of matches)
    while (!match.startsWith(common)) common = common.slice(0, -1);
  const suffix = matches.length === 1 && !common.endsWith("/") ? " " : "";
  return {
    input: input.slice(0, input.length - last.length) + common + suffix,
    choices: matches.length > 1 ? matches : [],
  };
}
