"use client";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Maximize2,
  Minus,
  PanelLeft,
  Search,
  X,
} from "lucide-react";
import { experiences, education, awards } from "@/lib/profile";
import {
  recoveredHome,
  certifications,
  recoveredRecognition,
} from "@/lib/recoveredProfile";
import AgentMessages from "./AgentMessages";
import { assetPath } from "@/lib/site";
import { terminalLinks, type TerminalTarget } from "@/lib/terminal";
import { useRouter } from "next/navigation";
import MacIcon from "./MacIcons";
import MacDock from "./MacDock";
import MacMenuBar from "./MacMenuBar";
import Modal from "./Modal";
import TerminalShell from "./TerminalShell";
import { useTheme } from "./ThemeProvider";
import PortfolioNoteContent, {
  type PortfolioNote as Note,
} from "./PortfolioNoteContent";

const notes: {
  id: Note;
  title: string;
  preview: string;
  category: string;
  search: string;
}[] = [
  {
    id: "about",
    title: recoveredHome.title,
    preview: "Protocol Engineer at Galaxy Digital",
    category: "Pinned",
    search: recoveredHome.subtitle,
  },
  {
    id: "experience",
    title: "Experience",
    preview: "Galaxy Digital, Prudential, Partior & Versent",
    category: "Work",
    search: JSON.stringify(experiences),
  },
  {
    id: "education",
    title: "Education & recognition",
    preview: "Rocket Academy · Singapore Management University",
    category: "Personal",
    search: JSON.stringify([
      education,
      awards,
      certifications,
      recoveredRecognition,
    ]),
  },
  {
    id: "contact",
    title: "Say hello",
    preview: "Have a hard problem? Let’s think it through.",
    category: "Personal",
    search: "kenrickles@gmail.com GitHub LinkedIn Telegram",
  },
];

export default function DesktopPortfolio() {
  const [active, setActive] = useState<Note>("about");
  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [night, setNight] = useState(false);
  const [clock, setClock] = useState("Singapore · SGT");
  const [compactList, setCompactList] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const router = useRouter();
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalMinimized, setTerminalMinimized] = useState(false);
  const [terminalExpanded, setTerminalExpanded] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [messagesMinimized, setMessagesMinimized] = useState(false);
  const [frontApp, setFrontApp] = useState<"notes" | "messages" | "terminal">(
    "notes",
  );
  const { setTheme } = useTheme();
  const [history, setHistory] = useState<Note[]>(["about"]);
  const [cursor, setCursor] = useState(0);
  const windowRef = useRef<HTMLElement>(null);
  const gesture = useRef<{
    x: number;
    y: number;
    left: number;
    top: number;
    width: number;
    height: number;
    mode: "move" | "resize";
  } | null>(null);
  const beginGesture = (
    e: PointerEvent<HTMLElement>,
    mode: "move" | "resize",
  ) => {
    if (
      expanded ||
      window.innerWidth <= 760 ||
      e.button !== 0 ||
      (e.target as HTMLElement).closest("button")
    )
      return;
    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect || !windowRef.current) return;
    // Direct pointer manipulation must not compete with entrance or layout motion.
    const el = windowRef.current;
    el.style.transition = "none";
    el.style.animation = "none";
    el.style.translate = "none";
    el.style.transform = "none";
    el.style.left = `${rect.left}px`;
    el.style.top = `${rect.top}px`;
    gesture.current = {
      x: e.clientX,
      y: e.clientY,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      mode,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };
  const moveGesture = (e: PointerEvent<HTMLElement>) => {
    const g = gesture.current;
    const el = windowRef.current;
    if (!g || !el) return;
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    el.style.transform = "none";
    el.style.left = `${g.left}px`;
    el.style.top = `${g.top}px`;
    if (g.mode === "move") {
      el.style.left = `${Math.max(8, Math.min(window.innerWidth - g.width - 8, g.left + dx))}px`;
      el.style.top = `${Math.max(42, Math.min(window.innerHeight - 140, g.top + dy))}px`;
    } else {
      el.style.width = `${Math.max(520, Math.min(window.innerWidth - g.left - 12, g.width + dx))}px`;
      el.style.height = `${Math.max(340, Math.min(window.innerHeight - g.top - 110, g.height + dy))}px`;
    }
  };
  const endGesture = () => {
    gesture.current = null;
  };
  const toggleExpanded = () => {
    windowRef.current?.removeAttribute("style");
    setExpanded(!expanded);
  };
  useEffect(() => {
    const reset = () => {
      windowRef.current?.removeAttribute("style");
    };
    window.addEventListener("resize", reset);
    return () => window.removeEventListener("resize", reset);
  }, []);
  const contentRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const update = () =>
      setClock(
        new Intl.DateTimeFormat("en-SG", {
          timeZone: "Asia/Singapore",
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(new Date()),
      );
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [active]);
  useEffect(() => {
    const fromHash = () => {
      const aliases: Record<string, Note> = {
        about: "about",
        projects: "about",
        experience: "experience",
        contact: "contact",
        education: "education",
      };
      const note = aliases[window.location.hash.slice(1)];
      if (note) {
        setActive(note);
        setHistory([note]);
        setCursor(0);
        setOpened(true);
      }
    };
    const frame = requestAnimationFrame(fromHash);
    window.addEventListener("hashchange", fromHash);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", fromHash);
    };
  }, []);
  const select = (id: Note) => {
    setOpened(true);
    setFrontApp("notes");
    setCompactList(false);
    if (id !== active) {
      setHistory([...history.slice(0, cursor + 1), id]);
      setCursor(cursor + 1);
      setActive(id);
    }
  };
  const travel = (direction: number) => {
    const next = cursor + direction;
    if (next >= 0 && next < history.length) {
      setCursor(next);
      setActive(history[next]);
    }
  };
  const filtered = notes.filter((n) =>
    `${n.title} ${n.preview} ${n.search}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  const toggleTheme = () => {
    setNight(!night);
    setTheme(night ? "light" : "dark");
  };
  const openIntroduction = () => {
    setQuery("");
    select("about");
  };
  const findNotes = () => {
    setOpened(true);
    setCompactList(true);
    requestAnimationFrame(() =>
      document.getElementById("notes-search")?.focus(),
    );
  };
  const openMessages = () => {
    setMessagesOpen(true);
    setMessagesMinimized(false);
    setFrontApp("messages");
  };
  const openTerminal = () => {
    setTerminalOpen(true);
    setTerminalMinimized(false);
    setFrontApp("terminal");
  };
  const closeTerminal = () => {
    setTerminalOpen(false);
    setTerminalMinimized(false);
    setFrontApp("notes");
  };
  const minimizeTerminal = () => {
    setTerminalMinimized(true);
    setFrontApp("notes");
  };
  const terminalTarget = (target: TerminalTarget) => {
    if (target === "messages") openMessages();
    else if (
      target === "about" ||
      target === "experience" ||
      target === "education" ||
      target === "contact"
    ) {
      setQuery("");
      select(target);
    } else if (target === "resume") router.push(terminalLinks.resume);
    else window.open(terminalLinks[target], "_blank", "noopener,noreferrer");
  };
  useEffect(() => {
    const show = () => {
      setTerminalOpen(true);
      setTerminalMinimized(false);
      setFrontApp("terminal");
    };
    const key = (event: KeyboardEvent) => {
      if (document.querySelector("dialog[open]")) return;
      if ((event.metaKey || event.ctrlKey) && event.code === "Backquote") {
        event.preventDefault();
        show();
      }
    };
    window.addEventListener("open-terminal", show);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("open-terminal", show);
      window.removeEventListener("keydown", key);
    };
  }, []);
  return (
    <main className={`desktop-portfolio${night ? " desktop-night" : ""}`}>
      <a className="desktop-skip" href="#note-content">
        Skip to content
      </a>
      <MacMenuBar
        appName={
          frontApp === "terminal" && terminalOpen && !terminalMinimized
            ? "Terminal"
            : frontApp === "messages" && messagesOpen && !messagesMinimized
              ? "Messages"
              : opened
                ? "Notes"
                : "Finder"
        }
        opened={opened}
        night={night}
        clock={clock}
        onToggleTheme={toggleTheme}
        onAbout={() => setAboutOpen(true)}
        onOpen={
          frontApp === "terminal"
            ? openTerminal
            : frontApp === "messages"
              ? openMessages
              : openIntroduction
        }
        onClose={() => {
          if (frontApp === "terminal") closeTerminal();
          else if (frontApp === "messages") {
            setMessagesOpen(false);
            setFrontApp("notes");
          } else setOpened(false);
        }}
        onMinimize={() => {
          if (frontApp === "terminal") minimizeTerminal();
          else if (frontApp === "messages") {
            setMessagesMinimized(true);
            setFrontApp("notes");
          } else setOpened(false);
        }}
        onExpand={() => {
          if (frontApp === "terminal") setTerminalExpanded((value) => !value);
          else if (frontApp === "messages")
            window.dispatchEvent(new Event("zoom-messages"));
          else {
            setOpened(true);
            toggleExpanded();
          }
        }}
        onFind={() => {
          if (frontApp === "terminal")
            window.dispatchEvent(new Event("focus-terminal-input"));
          else findNotes();
        }}
      />
      <nav className="desktop-files" aria-label="Desktop shortcuts">
        <Link href="/resume/">
          <MacIcon name="document" />
          <span>Kenrick — Résumé</span>
        </Link>
      </nav>
      {opened ? (
        <section
          ref={windowRef}
          className={`notes-window${expanded ? " notes-expanded" : ""}${frontApp === "notes" ? " front-window" : ""}`}
          onPointerDownCapture={() => setFrontApp("notes")}
          aria-label="Portfolio notes"
        >
          <header
            className="notes-titlebar"
            onPointerDown={(e) => beginGesture(e, "move")}
            onPointerMove={moveGesture}
            onPointerUp={endGesture}
            onPointerCancel={endGesture}
            onLostPointerCapture={endGesture}
            onDoubleClick={(e) => {
              if (!(e.target as HTMLElement).closest("button"))
                toggleExpanded();
            }}
          >
            <div className="traffic-lights">
              <button
                className="traffic-close"
                aria-label="Close notes"
                onClick={() => setOpened(false)}
              >
                <X size={9} />
              </button>
              <button
                className="traffic-minimize"
                aria-label="Minimize notes"
                onClick={() => setOpened(false)}
              >
                <Minus size={9} />
              </button>
              <button
                className="traffic-expand"
                aria-label={expanded ? "Restore window" : "Expand window"}
                onClick={toggleExpanded}
              >
                <Maximize2 size={8} />
              </button>
            </div>
            <span>Notes</span>
          </header>
          <div
            className={`notes-layout${compactList ? " compact-show-list" : ""}`}
          >
            <aside className="notes-sidebar" aria-label="Notes navigation">
              <label className="note-search">
                <Search size={12} />
                <input
                  id="notes-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  aria-label="Search notes"
                />
              </label>
              <div className="notes-list">
                {["Pinned", "Work", "Personal"].map((category) => {
                  const group = filtered.filter((n) => n.category === category);
                  return (
                    group.length > 0 && (
                      <div className="note-group" key={category}>
                        <p className="note-group-label">{category}</p>
                        {group.map((n) => (
                          <button
                            className={`note-item${active === n.id ? " note-selected" : ""}`}
                            aria-current={active === n.id ? "page" : undefined}
                            key={n.id}
                            onClick={() => select(n.id)}
                          >
                            <strong>{n.title}</strong>
                            <span>{n.preview}</span>
                          </button>
                        ))}
                      </div>
                    )
                  );
                })}
                {filtered.length === 0 && (
                  <p className="search-empty" role="status">
                    No matching notes.
                  </p>
                )}
              </div>
              <footer className="sidebar-footer">{notes.length} notes</footer>
            </aside>
            <div className="note-main">
              <div className="note-toolbar">
                <div>
                  <button
                    className="back-to-notes"
                    aria-label="Back to note list"
                    onClick={() => setCompactList(true)}
                  >
                    <ChevronLeft size={16} />
                    Notes
                  </button>
                  <button
                    className="wide-sidebar-button"
                    aria-label="Find a note"
                    onClick={findNotes}
                  >
                    <PanelLeft size={16} />
                  </button>
                  <button
                    aria-label="Previous note"
                    disabled={cursor === 0}
                    onClick={() => travel(-1)}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    aria-label="Next note"
                    disabled={cursor === history.length - 1}
                    onClick={() => travel(1)}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <Link href="/resume/" aria-label="Open printable résumé">
                  <FileText size={16} />
                </Link>
              </div>
              <article
                id="note-content"
                className="note-content"
                ref={contentRef}
                tabIndex={-1}
              >
                <div className="note-dateline">Kenrick Tan · Portfolio</div>
                <PortfolioNoteContent active={active} select={select} />
              </article>
            </div>
          </div>
          <div
            className="window-resize"
            aria-hidden="true"
            onPointerDown={(e) => beginGesture(e, "resize")}
            onPointerMove={moveGesture}
            onPointerUp={endGesture}
            onPointerCancel={endGesture}
            onLostPointerCapture={endGesture}
          />
        </section>
      ) : (
        <button className="reopen-note" onClick={() => setOpened(true)}>
          <MacIcon name="notes" />
          <strong>Kenrick’s Notes</strong>
          <span>Open Notes</span>
        </button>
      )}
      {messagesOpen && (
        <AgentMessages
          minimized={messagesMinimized}
          front={frontApp === "messages"}
          onFocus={() => setFrontApp("messages")}
          onClose={() => {
            setMessagesOpen(false);
            setFrontApp("notes");
          }}
          onMinimize={() => {
            setMessagesMinimized(true);
            setFrontApp("notes");
          }}
        />
      )}
      <MacDock
        opened={opened}
        active={
          frontApp === "terminal" && terminalOpen
            ? "terminal"
            : frontApp === "messages" && messagesOpen
              ? "messages"
              : active
        }
        terminalRunning={terminalOpen}
        onAction={(action) => {
          if (action === "messages") {
            openMessages();
          } else if (action === "settings") setSettingsOpen(true);
          else if (action === "terminal") openTerminal();
          else {
            setQuery("");
            select(action);
          }
        }}
      />
      {aboutOpen && (
        <Modal label="About Kenrick Tan" onClose={() => setAboutOpen(false)}>
          <div className="native-about">
            <button
              className="native-close"
              aria-label="Close About"
              onClick={() => setAboutOpen(false)}
            >
              <X size={10} />
            </button>
            <Image
              src={assetPath("/kenrick.jpg")}
              alt="Kenrick Tan"
              width={100}
              height={100}
            />
            <h2>Kenrick Tan</h2>
            <p>Protocol Engineer</p>
            <p>Galaxy Digital · Singapore</p>
            <Link href="/resume/">View résumé…</Link>
            <small>© {new Date().getFullYear()} Kenrick Tan</small>
          </div>
        </Modal>
      )}
      {settingsOpen && (
        <Modal
          label="Appearance settings"
          onClose={() => setSettingsOpen(false)}
        >
          <div className="native-about native-settings">
            <button
              className="native-close"
              aria-label="Close settings"
              onClick={() => setSettingsOpen(false)}
            >
              <X size={10} />
            </button>
            <MacIcon name="settings" />
            <h2>Appearance</h2>
            <div className="appearance-options">
              <button
                aria-pressed={!night}
                onClick={() => {
                  if (night) toggleTheme();
                }}
              >
                <span className="appearance-preview" />
                Light
              </button>
              <button
                aria-pressed={night}
                onClick={() => {
                  if (!night) toggleTheme();
                }}
              >
                <span className="appearance-preview appearance-dark" />
                Dark
              </button>
            </div>
          </div>
        </Modal>
      )}
      <TerminalShell
        visible={terminalOpen && !terminalMinimized}
        front={frontApp === "terminal"}
        expanded={terminalExpanded}
        theme={night ? "dark" : "light"}
        onFocus={() => setFrontApp("terminal")}
        onClose={closeTerminal}
        onMinimize={minimizeTerminal}
        onExpand={() => setTerminalExpanded((value) => !value)}
        onTheme={(theme) => {
          setNight(theme === "dark");
          setTheme(theme);
        }}
        onOpen={terminalTarget}
      />
      <noscript>
        <div className="desktop-noscript">
          Read my <Link href="/resume/">complete résumé</Link>.
        </div>
      </noscript>
    </main>
  );
}
