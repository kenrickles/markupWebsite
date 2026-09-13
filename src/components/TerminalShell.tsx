"use client";

import { useEffect, useRef, useState } from "react";
import { useStaticMode } from "./useStaticMode";
import { useTheme } from "./ThemeProvider";
import { useRouter } from "next/navigation";
import Modal from "./Modal";

/**
 * TerminalShell — A2. A REAL interactive terminal easter egg.
 * Supports: history (↑/↓), tab completion, help, whoami, kubectl, cat,
 * theme toggle, clear, sudo, and hidden commands.
 * Reachable via the "OPEN TERMINAL" button in the hero and Cmd+K.
 */

type Line = { text: string; tone: "cmd" | "ok" | "err" | "info" | "accent" };

const BANNER: Line[] = [
  { text: "kenrick-shell v2.6.1 — type `help` to get started", tone: "info" },
];

const COMMANDS: Record<
  string,
  { desc: string; run: (args: string[], ctx: Ctx) => Line[] }
> = {
  help: {
    desc: "list available commands",
    run: (_args, ctx) => [
      { text: "available commands:", tone: "info" },
      ...Object.keys(COMMANDS)
        .sort()
        .map((c) => ({
          text: `  ${c.padEnd(14)} ${COMMANDS[c].desc}`,
          tone: "cmd" as const,
        })),
      {
        text: `theme: currently ${ctx.theme} — try \`theme light\` / \`theme dark\``,
        tone: "info",
      },
    ],
  },
  whoami: {
    desc: "who is this guy",
    run: () => [
      {
        text: "Kenrick Tan — Protocol Engineer @ Galaxy Digital, Singapore.",
        tone: "ok",
      },
      {
        text: "CKA certified. 5+ yrs SRE/DevSecOps. Ex-Prudential, Partior, Versent.",
        tone: "ok",
      },
      { text: "Believes: if it isn't in git, it doesn't exist.", tone: "info" },
    ],
  },
  kubectl: {
    desc: "interact with the (fake) cluster",
    run: (args) => {
      const sub = args[0];
      if (sub === "get") {
        if (args[1] === "pods")
          return [
            {
              text: "NAME                          READY   STATUS    AGE",
              tone: "cmd",
            },
            {
              text: "portfolio-web-7d9f8b6c5-x2vqm   1/1     Running   99d",
              tone: "ok",
            },
            {
              text: "protocol-node-0                 1/1     Running   210d",
              tone: "ok",
            },
            {
              text: "protocol-node-1                 1/1     Running   210d",
              tone: "ok",
            },
            {
              text: "me-even-though-im-not-a-pod     1/1     Running   ∞",
              tone: "accent",
            },
          ];
        if (args[1] === "skills")
          return [
            { text: "SKILL                     PROFICIENCY", tone: "cmd" },
            {
              text: "kubernetes                ████████████ expert",
              tone: "ok",
            },
            {
              text: "terraform                 ██████████   expert",
              tone: "ok",
            },
            {
              text: "github-actions            ██████████   expert",
              tone: "ok",
            },
            {
              text: "helm                      █████████    advanced",
              tone: "ok",
            },
            {
              text: "go                        ███████      solid",
              tone: "ok",
            },
            {
              text: "python                    ███████      solid",
              tone: "ok",
            },
          ];
        if (args[1] === "experience")
          return [
            {
              text: "galaxy-digital    protocol-engineer       2025→now",
              tone: "ok",
            },
            {
              text: "prudential        sre-specialist          2024→2025",
              tone: "ok",
            },
            {
              text: "partior           sr-devsecops-eng        2023→2024",
              tone: "ok",
            },
            {
              text: "partior           devsecops-eng           2022→2023",
              tone: "ok",
            },
            {
              text: "versent           associate-cloud-eng     2021→2022",
              tone: "ok",
            },
          ];
        if (args[1] === "contact")
          return [
            { text: "email:    kenrickles@gmail.com", tone: "ok" },
            { text: "github:   github.com/kenrickles", tone: "ok" },
            { text: "linkedin: linkedin.com/in/kenrick-tan", tone: "ok" },
            { text: "telegram: t.me/kenrickles", tone: "ok" },
          ];
        return [
          {
            text: `error: nothing to get named '${args[1] ?? ""}' — try pods, skills, experience, contact`,
            tone: "err",
          },
        ];
      }
      if (sub === "describe")
        return [
          {
            text: "Protocol engineer. Calm under pager pressure. Ships daily.",
            tone: "ok",
          },
        ];
      return [
        {
          text: "usage: kubectl get <pods|skills|experience|contact>",
          tone: "err",
        },
      ];
    },
  },
  cat: {
    desc: "print a file (try cat /etc/motto)",
    run: (args, ctx) => {
      const f = args[0];
      if (f === "/etc/motto")
        return [
          { text: "\"If it isn't in git, it doesn't exist.\"", tone: "ok" },
        ];
      if (f?.includes("resume")) {
        ctx.onOpen("/resume/");
        return [{ text: "Opening printable résumé…", tone: "info" }];
      }
      if (f === "/dev/coffee")
        return [
          {
            text: "☕ brewing… deploy blocked until caffeination completes",
            tone: "info",
          },
        ];
      return [{ text: `cat: ${f ?? ""}: no such file`, tone: "err" }];
    },
  },
  theme: {
    desc: "theme dark | light — switch color scheme",
    run: (args, ctx) => {
      const t = args[0];
      if (t !== "dark" && t !== "light")
        return [
          {
            text: `usage: theme dark|light (current: ${ctx.theme})`,
            tone: "err",
          },
        ];
      ctx.setTheme(t);
      return [
        {
          text: `theme → ${t === "dark" ? "Ember & Ink" : "Daylight Ops"}`,
          tone: "ok",
        },
      ];
    },
  },
  clear: { desc: "clear the screen", run: () => [] },
  sudo: {
    desc: "escalate… or try",
    run: (args) => {
      if (args.join(" ").includes("make me a sandwich"))
        return [{ text: "🥪 okay. one sandwich, coming up.", tone: "accent" }];
      return [
        {
          text: "kenrick is not in the sudoers file. This incident will be reported. 🚨",
          tone: "err",
        },
      ];
    },
  },
  exit: {
    desc: "close the terminal",
    run: (_args, ctx) => {
      ctx.onClose();
      return [];
    },
  },
  open: {
    desc: "open <github|linkedin|telegram|resume>",
    run: (args, ctx) => {
      const dest = args[0];
      const map: Record<string, string> = {
        github: "https://github.com/kenrickles",
        linkedin: "https://linkedin.com/in/kenrick-tan",
        telegram: "https://t.me/kenrickles",
        resume: "/resume/",
      };
      if (dest && map[dest]) {
        ctx.onOpen(map[dest]);
        return [{ text: `opening ${dest}…`, tone: "ok" }];
      }
      return [
        { text: "usage: open <github|linkedin|telegram|resume>", tone: "err" },
      ];
    },
  },
};

const ALL_FLAGS = [
  "get",
  "pods",
  "skills",
  "experience",
  "contact",
  "dark",
  "light",
  "/etc/motto",
  "/dev/coffee",
  "github",
  "linkedin",
  "telegram",
  "resume",
  "make me a sandwich",
];

type Ctx = {
  theme: string;
  setTheme: (t: "dark" | "light") => void;
  onClose: () => void;
  onOpen: (url: string) => void;
};

export default function TerminalShell({ onClose }: { onClose: () => void }) {
  const isStatic = useStaticMode();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [waiting, setWaiting] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  // native <dialog> focuses its first focusable child (the close button) on showModal —
  // steal focus to the input so users can type immediately
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const run = (raw: string) => {
    const cmdline = raw.trim();
    if (!cmdline) return;
    setLines((l) => [...l, { text: `$ ${cmdline}`, tone: "cmd" }]);
    setHistory((h) => [cmdline, ...h]);
    setHistIdx(-1);

    const [cmd, ...args] = cmdline.split(/\s+/);
    const ctx: Ctx = {
      theme,
      setTheme,
      onClose,
      onOpen: (url) => {
        if (url.startsWith("http"))
          window.open(url, "_blank", "noopener,noreferrer");
        else {
          onClose();
          router.push(url);
        }
      },
    };

    const command = COMMANDS[cmd.toLowerCase()];
    if (!command) {
      setLines((l) => [
        ...l,
        { text: `command not found: ${cmd} — try \`help\``, tone: "err" },
      ]);
      return;
    }
    const out = command.run(args, ctx);
    if (cmd.toLowerCase() === "clear") {
      setLines(BANNER);
      return;
    }
    if (!out.length || isStatic) {
      setLines((l) => [...l, ...out]);
      setWaiting(false);
      return;
    }
    // Output timers are cancelled when the dialog closes.
    setWaiting(true);
    out.forEach((line, i) => {
      timers.current.push(
        setTimeout(
          () => {
            setLines((l) => [...l, line]);
            if (i === out.length - 1) setWaiting(false);
          },
          90 * (i + 1),
        ),
      );
    });
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !waiting) {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      if (history[next]) {
        setHistIdx(next);
        setInput(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next >= 0 ? history[next] : "");
    } else if (e.key === "Tab" && !e.shiftKey && input.trim()) {
      const parts = input.split(/\s+/);
      if (parts.length <= 1) {
        const match = Object.keys(COMMANDS).find((c) => c.startsWith(parts[0]));
        if (match) {
          e.preventDefault();
          setInput(match + " ");
        }
      } else {
        const last = parts[parts.length - 1];
        const match = ALL_FLAGS.find((f) => f.startsWith(last));
        if (match) {
          e.preventDefault();
          parts[parts.length - 1] = match;
          setInput(parts.join(" "));
        }
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const toneClass: Record<Line["tone"], string> = {
    cmd: "text-[color:var(--fg)]",
    ok: "text-[#62d0c3]",
    err: "text-[#f0605f]",
    info: "text-[color:var(--muted)]",
    accent: "text-[#f0a848]",
  };

  return (
    <Modal label="Interactive terminal" onClose={onClose}>
      <div
        className="terminal-shell flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-[color:var(--border)] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
            kenrick-shell — interactive
          </span>
          <button
            onClick={onClose}
            aria-label="Close terminal"
            className="ml-auto text-[color:var(--muted)] hover:text-[#f0a848]"
          >
            ✕
          </button>
        </div>
        <div
          ref={scrollRef}
          role="log"
          aria-label="Terminal output"
          aria-live="polite"
          aria-relevant="additions"
          className="flex-1 space-y-1 overflow-y-auto p-5 font-[family-name:var(--font-geist-mono)] text-[12.5px] leading-6"
        >
          {lines.map((l, i) => (
            <div
              key={i}
              className={toneClass[l.tone]}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {l.text}
            </div>
          ))}
          {waiting && <div className="text-[color:var(--muted)]">▌</div>}
        </div>
        <div className="flex items-center gap-2 border-t border-[color:var(--border)] px-5 py-3.5 font-[family-name:var(--font-geist-mono)] text-[12.5px]">
          <span className="text-[#f0a848]">$</span>
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            className="flex-1 bg-transparent text-[color:var(--fg)] caret-[#f0a848] outline-none"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            aria-label="Terminal input"
          />
          <button
            className="hidden rounded-md border border-[color:var(--border)] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)] hover:border-[#f0a848] hover:text-[#f0a848] sm:block"
            onClick={() => {
              onClose();
              router.push("/resume/");
            }}
          >
            View résumé
          </button>
        </div>
      </div>
    </Modal>
  );
}
