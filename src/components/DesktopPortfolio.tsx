"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import AgentMessages from "./AgentMessages";
import { assetPath } from "@/lib/site";
import { terminalLinks, type TerminalTarget } from "@/lib/terminal";
import MacIcon from "./MacIcons";
import MacDock from "./MacDock";
import MacMenuBar from "./MacMenuBar";
import Modal from "./Modal";
import TerminalShell from "./TerminalShell";
import { useTheme } from "./ThemeProvider";
import {
  appNames,
  windowCommand,
  type DesktopApp,
  type SafariTab,
} from "@/lib/desktop";
import SafariApp from "./SafariApp";
import WritingApp from "./WritingApp";
import RoadmapApp from "./RoadmapApp";
import FinderApp from "./FinderApp";
import type { Writing } from "@/lib/writing";
type AppState = { open: boolean; minimized: boolean };
const initialApps: Record<DesktopApp, AppState> = {
  safari: { open: true, minimized: false },
  notes: { open: false, minimized: false },
  finder: { open: false, minimized: false },
  reminders: { open: false, minimized: false },
  messages: { open: false, minimized: false },
  terminal: { open: false, minimized: false },
};
export default function DesktopPortfolio({
  posts = [],
}: {
  posts?: Writing[];
}) {
  const [apps, setApps] = useState(initialApps);
  const [front, setFront] = useState<DesktopApp>("safari");
  const [tab, setTab] = useState<SafariTab>("overview");
  const [slug, setSlug] = useState<string | undefined>(posts[0]?.slug);
  const [clock, setClock] = useState("Singapore · SGT");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [terminalExpanded, setTerminalExpanded] = useState(false);
  const { theme, setTheme } = useTheme();
  const night = theme === "dark";
  const openApp = (app: DesktopApp) => {
    setApps((previous) => ({
      ...previous,
      [app]: { open: true, minimized: false },
    }));
    setFront(app);
  };
  const navigate = (value: SafariTab) => {
    setTab(value);
    openApp("safari");
    window.location.hash = `safari/${value}`;
  };
  const openNotes = (value = posts[0]?.slug) => {
    setSlug(value);
    openApp("notes");
    window.location.hash = value ? `notes/${value}` : "notes";
  };
  const visible = (app: DesktopApp) => apps[app].open && !apps[app].minimized;
  const dismiss = (app: DesktopApp, minimize = false) => {
    setApps((previous) => ({
      ...previous,
      [app]: { open: minimize, minimized: minimize },
    }));
    const fallback = (Object.keys(apps) as DesktopApp[]).find(
      (id) => id !== app && visible(id),
    );
    if (fallback) setFront(fallback);
  };
  const props = (app: DesktopApp) => ({
    visible: visible(app),
    front: front === app,
    onFocus: () => setFront(app),
    onClose: () => dismiss(app),
    onMinimize: () => dismiss(app, true),
  });
  const toggleTheme = () => {
    setTheme(night ? "light" : "dark");
  };
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
    const fromHash = () => {
      const [app, page] = window.location.hash.slice(1).split("/");
      const legacy: Record<string, SafariTab> = {
        about: "overview",
        experience: "experience",
        education: "experience",
        contact: "overview",
        projects: "projects",
        resume: "resume",
      };
      if (app === "safari" || legacy[app]) {
        setTab(
          legacy[app] ??
            (["overview", "experience", "projects", "resume"].includes(page)
              ? (page as SafariTab)
              : "overview"),
        );
        setApps((previous) => ({
          ...previous,
          safari: { open: true, minimized: false },
        }));
        setFront("safari");
      } else if (["notes", "reminders", "finder"].includes(app)) {
        const id = app as DesktopApp;
        setApps((previous) => ({
          ...previous,
          [id]: { open: true, minimized: false },
        }));
        setFront(id);
        if (app === "notes")
          setSlug(posts.find((p) => p.slug === page)?.slug ?? posts[0]?.slug);
      }
    };
    const frame = requestAnimationFrame(fromHash);
    window.addEventListener("hashchange", fromHash);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", fromHash);
    };
  }, [posts]);
  useEffect(() => {
    const show = () => {
      setApps((previous) => ({
        ...previous,
        terminal: { open: true, minimized: false },
      }));
      setFront("terminal");
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
  const terminalTarget = (target: TerminalTarget) => {
    if (target === "about" || target === "contact") navigate("overview");
    else if (target === "experience" || target === "education")
      navigate("experience");
    else if (target === "projects") navigate("projects");
    else if (target === "resume") navigate("resume");
    else if (target === "notes") openNotes();
    else if (target === "roadmap") {
      openApp("reminders");
      window.location.hash = "reminders";
    } else if (target === "tools") {
      openApp("finder");
      window.location.hash = "finder";
    } else if (target === "messages") openApp("messages");
    else window.open(terminalLinks[target], "_blank", "noopener,noreferrer");
  };
  const anyVisible = Object.keys(apps).some((id) => visible(id as DesktopApp));
  return (
    <main className={`desktop-portfolio${night ? " desktop-night" : ""}`}>
      <a
        className="desktop-skip"
        href="#desktop-content"
        onClick={() => {
          openApp("safari");
          requestAnimationFrame(() =>
            document.getElementById("safari-panel")?.focus(),
          );
        }}
      >
        Skip to content
      </a>
      <MacMenuBar
        appName={anyVisible ? appNames[front] : "Finder"}
        opened={anyVisible}
        night={night}
        clock={clock}
        onToggleTheme={toggleTheme}
        onAbout={() => setAboutOpen(true)}
        onOpen={() => openApp(front)}
        onClose={() => dismiss(front)}
        onMinimize={() => dismiss(front, true)}
        onExpand={() => {
          if (front === "terminal") setTerminalExpanded((v) => !v);
          else if (front === "messages")
            window.dispatchEvent(new Event("zoom-messages"));
          else windowCommand(front, "zoom");
        }}
        onFind={() => {
          if (front === "terminal")
            window.dispatchEvent(new Event("focus-terminal-input"));
          else if (front === "finder" || front === "notes")
            windowCommand(front, "find");
          else {
            openNotes();
            requestAnimationFrame(() => windowCommand("notes", "find"));
          }
        }}
      />
      <nav className="desktop-files" aria-label="Desktop shortcuts">
        <button onClick={() => navigate("resume")}>
          <MacIcon name="document" />
          <span>Kenrick — Résumé</span>
        </button>
        <button className="desktop-writing" onClick={() => openNotes()}>
          <MacIcon name="notes" />
          <span>{posts[0] ? "Latest writing" : "My writing"}</span>
          {posts[0] && <small>{posts[0].title}</small>}
        </button>
      </nav>
      <div id="desktop-content">
        <SafariApp
          {...props("safari")}
          tab={tab}
          navigate={navigate}
          openNotes={() => openNotes()}
          latest={posts[0]}
        />
        <WritingApp
          {...props("notes")}
          posts={posts}
          slug={slug}
          select={openNotes}
        />
        <RoadmapApp {...props("reminders")} />
        <FinderApp {...props("finder")} />
      </div>
      {!anyVisible && (
        <button className="reopen-note" onClick={() => navigate("overview")}>
          <MacIcon name="safari" />
          <strong>Kenrick’s Safari</strong>
          <span>Open profile</span>
        </button>
      )}
      {apps.messages.open && (
        <AgentMessages
          minimized={apps.messages.minimized}
          front={front === "messages"}
          onFocus={() => setFront("messages")}
          onClose={() => dismiss("messages")}
          onMinimize={() => dismiss("messages", true)}
        />
      )}
      <MacDock
        active={front}
        running={(Object.keys(apps) as DesktopApp[]).filter(
          (id) => apps[id].open,
        )}
        onAction={(action) => {
          if (action === "settings") setSettingsOpen(true);
          else if (action === "notes") openNotes();
          else if (action === "safari") {
            openApp("safari");
            window.location.hash = `safari/${tab}`;
          } else {
            openApp(action);
            if (action === "reminders" || action === "finder")
              window.location.hash = action;
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
            <button
              className="native-about-link"
              onClick={() => {
                setAboutOpen(false);
                navigate("resume");
              }}
            >
              View résumé <ArrowUpRight size={12} />
            </button>
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
        visible={visible("terminal")}
        front={front === "terminal"}
        expanded={terminalExpanded}
        theme={night ? "dark" : "light"}
        onFocus={() => setFront("terminal")}
        onClose={() => dismiss("terminal")}
        onMinimize={() => dismiss("terminal", true)}
        onExpand={() => setTerminalExpanded((v) => !v)}
        onTheme={(value) => {
          setTheme(value);
        }}
        onOpen={terminalTarget}
      />
      <noscript>
        <div className="desktop-noscript">
          Read my <Link href="/resume/">complete résumé</Link> or{" "}
          <Link href="/writing/">published writing</Link>.
        </div>
      </noscript>
    </main>
  );
}
