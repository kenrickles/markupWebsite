"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
const links = [
  ["Work", "projects"],
  ["About", "about"],
  ["Experience", "experience"],
  ["Contact", "contact"],
];
export default function SiteNav() {
  const { theme, toggle: toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    links.forEach(([, id]) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <header className="site-header">
      <div className="wrap nav-inner">
        <Link href="/" className="wordmark" aria-label="Kenrick Tan home">
          kenrick<span>les</span>
          <b>.</b>
        </Link>
        <button
          className="menu-toggle"
          ref={toggle}
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="primary-nav"
          className={open ? "nav-links is-open" : "nav-links"}
          aria-label="Primary navigation"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              toggle.current?.focus();
            }
          }}
        >
          {links.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <a href="mailto:kenrickles@gmail.com" className="nav-contact">
            Get in touch <ArrowUpRight size={16} />
          </a>
          <button
            className="theme-toggle"
            aria-label="Open command palette"
            onClick={() => {
              setOpen(false);
              window.dispatchEvent(new Event("open-command-palette"));
            }}
          >
            <Search size={16} />
          </button>
          <Link href="/resume/">Résumé</Link>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={theme === "dark" ? "Daylight Ops" : "Ember & Ink"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
