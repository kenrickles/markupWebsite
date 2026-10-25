"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BatteryFull, Moon, SlidersHorizontal, Sun, Wifi } from "lucide-react";
import { AppleLogo } from "./MacIcons";

type Menu =
  "Apple" | "File" | "Edit" | "View" | "Window" | "Help" | "Appearance";
export default function MacMenuBar({
  opened,
  appName,
  night,
  clock,
  onToggleTheme,
  onAbout,
  onOpen,
  onClose,
  onMinimize,
  onExpand,
  onFind,
}: {
  opened: boolean;
  appName?: string;
  night: boolean;
  clock: string;
  onToggleTheme: () => void;
  onAbout: () => void;
  onOpen: () => void;
  onClose: () => void;
  onMinimize?: () => void;
  onExpand: () => void;
  onFind: () => void;
}) {
  const [menu, setMenu] = useState<Menu | null>(null);
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const outside = (e: globalThis.PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setMenu(null);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        root.current
          ?.querySelector<HTMLElement>("[aria-expanded=true]")
          ?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  const run = (fn: () => void) => {
    setMenu(null);
    fn();
  };
  const button = (name: Menu) => (
    <button
      key={name}
      aria-expanded={menu === name}
      aria-controls={menu === name ? "mac-menu" : undefined}
      onClick={() => setMenu(menu === name ? null : name)}
      className={menu === name ? "menu-open" : ""}
    >
      {name}
    </button>
  );
  return (
    <header ref={root} className="desktop-menubar">
      <div className="menu-left">
        <button
          className={`apple-menu-button${menu === "Apple" ? " menu-open" : ""}`}
          aria-label="Apple menu"
          aria-expanded={menu === "Apple"}
          onClick={() => setMenu(menu === "Apple" ? null : "Apple")}
        >
          <AppleLogo />
        </button>
        <strong>{appName ?? (opened ? "Notes" : "Finder")}</strong>
        <nav aria-label="Desktop menu">
          {(["File", "Edit", "View", "Window", "Help"] as Menu[]).map(button)}
        </nav>
      </div>
      <div className="menu-right">
        <button
          aria-label={night ? "Switch to light mode" : "Switch to dark mode"}
          onClick={onToggleTheme}
        >
          {night ? <Moon size={15} /> : <Sun size={15} />}
        </button>
        <Wifi size={15} aria-hidden="true" />
        <BatteryFull size={23} aria-hidden="true" />
        <button
          aria-label="Control Center"
          aria-expanded={menu === "Appearance"}
          onClick={() => setMenu(menu === "Appearance" ? null : "Appearance")}
        >
          <SlidersHorizontal size={15} />
        </button>
        <time>{clock}</time>
      </div>
      {menu && (
        <div
          id="mac-menu"
          className={`mac-menu mac-menu-${menu.toLowerCase()}`}
          aria-label={`${menu} menu`}
        >
          {menu === "Apple" && (
            <>
              <button onClick={() => run(onAbout)}>About Kenrick Tan</button>
              <hr />
              <button onClick={() => run(() => setMenu("Appearance"))}>
                System Settings…
              </button>
              <Link href="/resume/" onClick={() => setMenu(null)}>
                Résumé…
              </Link>
              <hr />
              <button onClick={() => run(onClose)}>
                Close {appName ?? "Notes"}
              </button>
            </>
          )}
          {menu === "File" && (
            <>
              <button onClick={() => run(onOpen)}>
                Open {appName ?? "Notes"} <kbd>↵</kbd>
              </button>
              <Link href="/resume/" onClick={() => setMenu(null)}>
                Print résumé…
              </Link>
              <hr />
              <button onClick={() => run(onClose)}>Close Window</button>
            </>
          )}
          {menu === "Edit" && (
            <button onClick={() => run(onFind)}>
              {appName === "Terminal" ? (
                "Focus Command Line"
              ) : (
                <>
                  Find in Notes… <kbd>⌘F</kbd>
                </>
              )}
            </button>
          )}
          {menu === "View" && (
            <>
              <button onClick={() => run(onExpand)}>Zoom Window</button>
              <button onClick={() => run(onToggleTheme)}>
                {night ? "Light Appearance" : "Dark Appearance"}
              </button>
            </>
          )}
          {menu === "Window" && (
            <>
              <button onClick={() => run(onMinimize ?? onClose)}>
                Minimize
              </button>
              <button onClick={() => run(onOpen)}>
                Bring {appName ?? "Notes"} to Front
              </button>
              <button onClick={() => run(onExpand)}>Zoom</button>
            </>
          )}
          {menu === "Help" && (
            <>
              <button onClick={() => run(onAbout)}>About This Portfolio</button>
              <a href="mailto:kenrickles@gmail.com">Contact Kenrick</a>
              <a
                href="https://github.com/kenrickles"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </>
          )}
          {menu === "Appearance" && (
            <>
              <strong>Appearance</strong>
              <div className="appearance-options">
                <button
                  aria-pressed={!night}
                  onClick={() => {
                    if (night) onToggleTheme();
                  }}
                >
                  <span className="appearance-preview" />
                  <span>Light</span>
                </button>
                <button
                  aria-pressed={night}
                  onClick={() => {
                    if (!night) onToggleTheme();
                  }}
                >
                  <span className="appearance-preview appearance-dark" />
                  <span>Dark</span>
                </button>
              </div>
              <p>Change this portfolio’s appearance.</p>
            </>
          )}
        </div>
      )}
    </header>
  );
}
