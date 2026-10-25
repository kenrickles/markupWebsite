"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  CornerDownLeft,
  Maximize2,
  Minus,
  TerminalSquare,
  X,
} from "lucide-react";
import {
  completeTerminal,
  displayPath,
  executeTerminal,
  terminalBanner,
  terminalPrompt,
  type TerminalLine,
  type TerminalTarget,
} from "@/lib/terminal";

type Props = {
  visible: boolean;
  front: boolean;
  expanded: boolean;
  theme: "dark" | "light";
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onExpand: () => void;
  onTheme: (theme: "dark" | "light") => void;
  onOpen: (target: TerminalTarget) => void;
};

/** A browser-local portfolio shell. The session remains mounted when its window closes. */
export default function TerminalShell({
  visible,
  front,
  expanded,
  theme,
  onFocus,
  onClose,
  onMinimize,
  onExpand,
  onTheme,
  onOpen,
}: Props) {
  const [lines, setLines] = useState<TerminalLine[]>(terminalBanner);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("/");
  const [previousCwd, setPreviousCwd] = useState("/");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const draft = useRef("");
  const panel = useRef<HTMLElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const gesture = useRef<{
    x: number;
    y: number;
    left: number;
    top: number;
    width: number;
    height: number;
    resize: boolean;
  } | null>(null);

  useEffect(() => {
    transcript.current?.scrollTo({ top: transcript.current.scrollHeight });
  }, [lines, visible]);
  useEffect(() => {
    if (visible && front && window.matchMedia("(pointer: fine)").matches)
      inputRef.current?.focus({ preventScroll: true });
  }, [visible, front]);
  useEffect(() => {
    const focus = () => {
      if (visible) inputRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener("focus-terminal-input", focus);
    return () => window.removeEventListener("focus-terminal-input", focus);
  }, [visible]);
  useEffect(() => {
    // Match the visible viewport when a mobile software keyboard opens.
    const viewport = window.visualViewport;
    const reset = () => {
      const el = panel.current;
      if (!el) return;
      if (window.innerWidth <= 640 && viewport) {
        const keyboard = viewport.height < window.innerHeight - 100;
        el.style.setProperty(
          "--terminal-mobile-height",
          `${Math.max(160, viewport.height - (keyboard ? 48 : 132))}px`,
        );
      } else el.style.removeProperty("--terminal-mobile-height");
    };
    const resize = () => {
      panel.current?.removeAttribute("style");
      reset();
    };
    window.addEventListener("resize", resize);
    viewport?.addEventListener("resize", reset);
    reset();
    return () => {
      window.removeEventListener("resize", resize);
      viewport?.removeEventListener("resize", reset);
    };
  }, []);
  useEffect(() => {
    // Zoom restores the default geometry when returning to the normal window.
    for (const prop of [
      "width",
      "height",
      "left",
      "top",
      "animation",
      "transition",
      "transform",
      "translate",
    ])
      panel.current?.style.removeProperty(prop);
  }, [expanded]);

  const append = (next: TerminalLine[]) =>
    setLines((old) => [...old, ...next].slice(-800));
  const run = (value: string, refocus = false) => {
    const command = value.trim();
    if (!command) return;
    const updatedHistory = [...history, command].slice(-200);
    const result = executeTerminal(command, {
      cwd,
      previousCwd,
      history: updatedHistory,
      theme,
    });
    setHistory(updatedHistory);
    setHistoryIndex(-1);
    draft.current = "";
    setInput("");
    if (result.clear) setLines([]);
    else
      append([
        { text: `${terminalPrompt(cwd)} ${command}`, tone: "command" },
        ...result.lines,
      ]);
    if (result.cwd !== undefined) setCwd(result.cwd);
    if (result.previousCwd !== undefined) setPreviousCwd(result.previousCwd);
    if (result.theme) onTheme(result.theme);
    if (result.action === "exit") onClose();
    else if (result.action) onOpen(result.action);
    else if (refocus) inputRef.current?.focus({ preventScroll: true });
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      append([{ text: `${terminalPrompt(cwd)} ${input}^C`, tone: "muted" }]);
      setInput("");
      setHistoryIndex(-1);
      draft.current = "";
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setLines([]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      if (historyIndex === -1) draft.current = input;
      const next =
        historyIndex === -1
          ? history.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next]);
    } else if (e.key === "ArrowDown") {
      if (historyIndex === -1) return;
      e.preventDefault();
      const next = historyIndex + 1;
      setHistoryIndex(next >= history.length ? -1 : next);
      setInput(next >= history.length ? draft.current : history[next]);
    } else if (
      e.key === "Tab" &&
      !e.shiftKey &&
      input.trim() &&
      e.currentTarget.selectionStart === input.length
    ) {
      const completion = completeTerminal(input, cwd);
      if (completion.input !== input || completion.choices.length) {
        e.preventDefault();
        setInput(completion.input);
        if (completion.choices.length)
          append([{ text: completion.choices.join("   "), tone: "muted" }]);
      }
    }
  };
  const start = (e: PointerEvent<HTMLElement>, resize: boolean) => {
    if (
      expanded ||
      window.innerWidth <= 640 ||
      e.button !== 0 ||
      (!resize && (e.target as HTMLElement).closest("button"))
    )
      return;
    const el = panel.current,
      rect = el?.getBoundingClientRect();
    if (!el || !rect) return;
    gesture.current = {
      x: e.clientX,
      y: e.clientY,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      resize,
    };
    Object.assign(el.style, {
      animation: "none",
      transition: "none",
      transform: "none",
      translate: "none",
      left: `${rect.left}px`,
      top: `${rect.top}px`,
    });
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };
  const move = (e: PointerEvent<HTMLElement>) => {
    const g = gesture.current,
      el = panel.current;
    if (!g || !el) return;
    if (g.resize) {
      el.style.width = `${Math.max(360, Math.min(window.innerWidth - g.left - 8, g.width + e.clientX - g.x))}px`;
      el.style.height = `${Math.max(280, Math.min(window.innerHeight - g.top - 100, g.height + e.clientY - g.y))}px`;
    } else {
      el.style.left = `${Math.max(8, Math.min(window.innerWidth - g.width - 8, g.left + e.clientX - g.x))}px`;
      el.style.top = `${Math.max(40, Math.min(window.innerHeight - g.height - 95, g.top + e.clientY - g.y))}px`;
    }
  };
  const stop = () => {
    gesture.current = null;
  };
  return (
    <section
      ref={panel}
      hidden={!visible}
      aria-label="Terminal"
      className={`notes-window portfolio-terminal${expanded ? " notes-expanded" : ""}${front ? " front-window" : ""}`}
      onPointerDownCapture={onFocus}
    >
      <header
        className="notes-titlebar terminal-titlebar"
        onPointerDown={(e) => start(e, false)}
        onPointerMove={move}
        onPointerUp={stop}
        onPointerCancel={stop}
        onLostPointerCapture={stop}
        onDoubleClick={(e) => {
          if (!(e.target as HTMLElement).closest("button")) onExpand();
        }}
      >
        <div className="traffic-lights">
          <button
            className="traffic-close"
            aria-label="Close terminal"
            onClick={onClose}
          >
            <X size={9} />
          </button>
          <button
            className="traffic-minimize"
            aria-label="Minimize terminal"
            onClick={onMinimize}
          >
            <Minus size={9} />
          </button>
          <button
            className="traffic-expand"
            aria-label={
              expanded ? "Restore terminal window" : "Expand terminal window"
            }
            onClick={onExpand}
          >
            <Maximize2 size={8} />
          </button>
        </div>
        <span className="terminal-window-title">
          <TerminalSquare size={13} aria-hidden="true" />
          kenrick — portfolio
        </span>
      </header>
      <div className="terminal-workspace">
        <div
          ref={transcript}
          className="terminal-output"
          role="log"
          aria-label="Terminal output"
          aria-live="polite"
          aria-relevant="additions"
          tabIndex={0}
        >
          {lines.map((line, i) => (
            <div
              className={`terminal-line terminal-${line.tone ?? "text"}`}
              key={i}
            >
              {line.text}
            </div>
          ))}
        </div>
        <div className="terminal-input-area">
          <form
            className="terminal-command-form"
            onSubmit={(e) => {
              e.preventDefault();
              run(input, true);
            }}
          >
            <label
              className="terminal-prompt"
              htmlFor="portfolio-terminal-input"
            >
              <span>kenrick@portfolio</span> <b>{displayPath(cwd)}</b> %
            </label>
            <div className="terminal-input-row">
              <input
                id="portfolio-terminal-input"
                ref={inputRef}
                aria-label="Terminal input"
                aria-describedby="terminal-keyboard-hint"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setHistoryIndex(-1);
                }}
                onKeyDown={onKey}
                placeholder="Type a command…"
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                enterKeyHint="go"
                maxLength={2000}
              />
              <button
                type="submit"
                aria-label="Run command"
                disabled={!input.trim()}
              >
                <CornerDownLeft size={16} />
              </button>
            </div>
          </form>
          <nav
            className="terminal-starters"
            aria-label="Suggested terminal commands"
          >
            {["help", "ls", "cat about.md", "agent status"].map((command) => (
              <button key={command} onClick={() => run(command)}>
                {command}
              </button>
            ))}
          </nav>
        </div>
        <footer className="terminal-status" id="terminal-keyboard-hint">
          <span>↑↓ history · Tab complete · Ctrl+C cancel · Ctrl+L clear</span>
          <span>Portfolio shell</span>
        </footer>
      </div>
      <button
        className="window-resize terminal-resize"
        aria-label="Resize terminal (arrow keys)"
        onPointerDown={(e) => start(e, true)}
        onPointerMove={move}
        onPointerUp={stop}
        onPointerCancel={stop}
        onLostPointerCapture={stop}
        onKeyDown={(e) => {
          const el = panel.current;
          if (!el || expanded || !e.key.startsWith("Arrow")) return;
          e.preventDefault();
          const rect = el.getBoundingClientRect();
          el.style.width = `${Math.max(360, Math.min(window.innerWidth - rect.left - 8, rect.width + (e.key === "ArrowRight" ? 20 : e.key === "ArrowLeft" ? -20 : 0)))}px`;
          el.style.height = `${Math.max(280, Math.min(window.innerHeight - rect.top - 100, rect.height + (e.key === "ArrowDown" ? 20 : e.key === "ArrowUp" ? -20 : 0)))}px`;
        }}
      />
    </section>
  );
}
