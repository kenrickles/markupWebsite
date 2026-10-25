"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  LockKeyhole,
  PanelLeft,
  Share,
} from "lucide-react";
import Link from "next/link";
import PortfolioNoteContent from "./PortfolioNoteContent";
import ResumeContent from "./ResumeContent";
import AppWindow from "./AppWindow";
import { assetPath } from "@/lib/site";
import type { SafariTab } from "@/lib/desktop";
import type { Writing } from "@/lib/writing";
export const safariTabs: { id: SafariTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Résumé" },
];
export default function SafariApp({
  visible,
  front,
  tab,
  navigate,
  onFocus,
  onClose,
  onMinimize,
  openNotes,
  latest,
}: {
  visible: boolean;
  front: boolean;
  tab: SafariTab;
  navigate: (tab: SafariTab) => void;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  openNotes: () => void;
  latest?: Writing;
}) {
  const [sidebar, setSidebar] = useState(false);
  const [history, setHistory] = useState<SafariTab[]>([tab]);
  const [cursor, setCursor] = useState(0);
  const [shareStatus, setShareStatus] = useState("");
  const pane = useRef<HTMLDivElement>(null);
  const travelling = useRef(false);
  useEffect(() => {
    pane.current?.scrollTo(0, 0);
    if (travelling.current) {
      travelling.current = false;
      return;
    }
    setHistory((h) =>
      h[cursor] === tab ? h : [...h.slice(0, cursor + 1), tab],
    );
    setCursor((c) => (history[c] === tab ? c : c + 1));
    // Navigation is recorded only when the selected tab changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);
  const travel = (step: number) => {
    const next = cursor + step;
    if (next < 0 || next >= history.length) return;
    travelling.current = true;
    setCursor(next);
    navigate(history[next]);
  };
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus("Link copied");
    } catch {
      setShareStatus("Copy the link from your browser’s address bar.");
    }
  };
  const tabKeys = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % safariTabs.length;
    else if (event.key === "ArrowLeft")
      next = (index + safariTabs.length - 1) % safariTabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = safariTabs.length - 1;
    else return;
    event.preventDefault();
    navigate(safariTabs[next].id);
    document.getElementById(`safari-tab-${safariTabs[next].id}`)?.focus();
  };
  const controls = (
    <div className="safari-toolbar">
      <div className="safari-navigation">
        <button
          aria-label="Toggle Safari sidebar"
          aria-expanded={sidebar}
          onClick={() => setSidebar((v) => !v)}
        >
          <PanelLeft size={18} />
        </button>
        <button
          aria-label="Safari back"
          disabled={cursor === 0}
          onClick={() => travel(-1)}
        >
          <ChevronLeft size={21} />
        </button>
        <button
          aria-label="Safari forward"
          disabled={cursor >= history.length - 1}
          onClick={() => travel(1)}
        >
          <ChevronRight size={21} />
        </button>
      </div>
      <div className="safari-address" aria-label="Current page address">
        <LockKeyhole size={11} />
        <span>kenrickles.com</span>
        <span className="safari-path"> / {tab === "overview" ? "" : tab}</span>
      </div>
      <button
        className="safari-share"
        aria-label="Copy page link"
        onClick={share}
      >
        <Share size={18} />
      </button>
    </div>
  );
  return (
    <AppWindow
      app="safari"
      visible={visible}
      front={front}
      onFocus={onFocus}
      onClose={onClose}
      onMinimize={onMinimize}
      toolbar={controls}
    >
      <div
        className="safari-tabs"
        role="tablist"
        aria-label="Professional profile"
      >
        {safariTabs.map((item, index) => (
          <button
            key={item.id}
            id={`safari-tab-${item.id}`}
            role="tab"
            aria-selected={tab === item.id}
            aria-controls="safari-panel"
            tabIndex={tab === item.id ? 0 : -1}
            onKeyDown={(event) => tabKeys(event, index)}
            onClick={() => navigate(item.id)}
          >
            <span className="safari-favicon">k.</span>
            {item.label}
          </button>
        ))}
      </div>
      <div className={`safari-browser${sidebar ? " safari-sidebar-open" : ""}`}>
        {sidebar && (
          <aside className="safari-sidebar" aria-label="Safari bookmarks">
            <p>Favourites</p>
            <a
              href="https://github.com/kenrickles"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight size={13} />
            </a>
            <a
              href="https://linkedin.com/in/kenrick-tan"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <ArrowUpRight size={13} />
            </a>
            <a href="mailto:kenrickles@gmail.com">
              Email Kenrick <ArrowUpRight size={13} />
            </a>
            <button onClick={openNotes}>
              My writing <ArrowUpRight size={13} />
            </button>
          </aside>
        )}
        <div
          className="safari-page"
          ref={pane}
          id="safari-panel"
          role="tabpanel"
          aria-labelledby={`safari-tab-${tab}`}
          tabIndex={0}
        >
          <header className="profile-masthead">
            <span>KENRICK TAN</span>
            <span>Protocol Engineer · Singapore</span>
          </header>
          <div className="safari-page-content">
            {tab === "overview" && (
              <>
                <div className="profile-kicker">A LITTLE ABOUT ME</div>
                <div className="profile-overview">
                  <PortfolioNoteContent
                    active="about"
                    select={(note) => {
                      if (note === "experience") navigate("experience");
                      else if (note === "contact")
                        document
                          .getElementById("profile-contact")
                          ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  />
                </div>
                <button className="writing-invitation" onClick={openNotes}>
                  <span>
                    <small>{latest ? "LATEST WRITING" : "NOTES"}</small>
                    <strong>
                      {latest?.title ?? "A space to think out loud."}
                    </strong>
                    <span>
                      {latest?.description ??
                        "Engineering, thinking and life. Nothing published yet."}
                    </span>
                  </span>
                  <ArrowUpRight size={22} />
                </button>
              </>
            )}
            {tab === "experience" && (
              <>
                <PortfolioNoteContent active="experience" select={() => {}} />
                <div className="profile-education">
                  <PortfolioNoteContent active="education" select={() => {}} />
                </div>
              </>
            )}
            {tab === "projects" && (
              <>
                <div className="profile-kicker">SELECTED WORK</div>
                <h1>Projects</h1>
                <p className="section-intro">
                  Things I build, with room for what comes next.
                </p>
                <article className="project-entry">
                  <span className="entry-date">PERSONAL PROJECT</span>
                  <h2>This little desktop</h2>
                  <p>
                    My personal website, bringing together my professional
                    background, writing and public roadmap through a familiar
                    desktop interface.
                  </p>
                  <div className="note-tags">
                    <span>Next.js</span>
                    <span>TypeScript</span>
                    <span>React</span>
                  </div>
                  <a
                    className="profile-link"
                    href="https://github.com/kenrickles/markupWebsite"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Explore the source <ArrowUpRight size={15} />
                  </a>
                </article>
                <p className="quiet-note">
                  More projects will be added as they are ready to share.
                </p>
              </>
            )}
            {tab === "resume" && (
              <>
                <div className="resume-actions">
                  <a
                    className="primary-action"
                    href={assetPath("/kenrick-tan-resume.pdf")}
                    download
                  >
                    <ArrowDownToLine size={15} /> Download PDF
                  </a>
                  <Link href="/resume/">
                    Open printable version <ArrowUpRight size={14} />
                  </Link>
                </div>
                <div className="safari-resume">
                  <ResumeContent />
                </div>
              </>
            )}
            <footer className="profile-footer" id="profile-contact">
              <span>Let’s stay in touch.</span>
              <a href="mailto:kenrickles@gmail.com">
                Email <ArrowUpRight size={12} />
              </a>
              <a
                href="https://github.com/kenrickles"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <ArrowUpRight size={12} />
              </a>
              <a
                href="https://linkedin.com/in/kenrick-tan"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn <ArrowUpRight size={12} />
              </a>
            </footer>
          </div>
        </div>
      </div>
      {shareStatus && (
        <button
          className="share-status"
          role="status"
          onClick={() => setShareStatus("")}
        >
          {shareStatus}
        </button>
      )}
    </AppWindow>
  );
}
