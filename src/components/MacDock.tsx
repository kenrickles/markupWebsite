"use client";
import { useRef, useState, type CSSProperties } from "react";
import MacIcon, { type MacIconName } from "./MacIcons";

type Action =
  "about" | "projects" | "experience" | "contact" | "terminal" | "settings";
const apps: {
  icon: MacIconName;
  label: string;
  action?: Action;
  href?: string;
}[] = [
  { icon: "finder", label: "Open projects", action: "projects" },
  {
    icon: "safari",
    label: "Visit GitHub",
    href: "https://github.com/kenrickles",
  },
  { icon: "mail", label: "Email Kenrick", href: "mailto:kenrickles@gmail.com" },
  { icon: "messages", label: "Open contact", action: "contact" },
  { icon: "notes", label: "Open notes", action: "about" },
  { icon: "reminders", label: "Open experience", action: "experience" },
  { icon: "terminal", label: "Open interactive terminal", action: "terminal" },
  { icon: "document", label: "Open résumé", href: "/resume/" },
  { icon: "settings", label: "Appearance settings", action: "settings" },
];
export default function MacDock({
  onAction,
  opened,
  active,
}: {
  onAction: (action: Action) => void;
  opened: boolean;
  active: string;
}) {
  const dock = useRef<HTMLElement>(null);
  const [scales, setScales] = useState<number[]>([]);
  return (
    <nav
      ref={dock}
      className="desktop-dock"
      aria-label="Application dock"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        setScales(
          Array.from(dock.current?.children ?? []).map((child) => {
            const rect = child.getBoundingClientRect();
            return (
              1 +
              0.5 *
                Math.max(
                  0,
                  1 - Math.abs(e.clientX - (rect.left + rect.width / 2)) / 130,
                )
            );
          }),
        );
      }}
      onPointerLeave={() => setScales([])}
    >
      {apps.map((app, i) => {
        const style = { "--dock-scale": scales[i] ?? 1 } as CSSProperties;
        const content = (
          <>
            <MacIcon name={app.icon} />
            <span className="dock-tooltip">
              {
                (
                  {
                    finder: "Finder",
                    safari: "Safari",
                    mail: "Mail",
                    messages: "Messages",
                    notes: "Notes",
                    reminders: "Reminders",
                    terminal: "Terminal",
                    document: "Résumé",
                    settings: "System Settings",
                  } as Record<string, string>
                )[app.icon]
              }
            </span>
            <i
              className={
                opened && (app.icon === "notes" || app.action === active)
                  ? "dock-active"
                  : ""
              }
            />
          </>
        );
        const shared = {
          className: "dock-app",
          style,
          "aria-label": app.label,
        };
        return app.href ? (
          app.href.startsWith("/") ? (
            <Link key={app.icon} href={app.href} {...shared}>
              {content}
            </Link>
          ) : (
            <a
              key={app.icon}
              href={app.href}
              {...shared}
              target={app.href.startsWith("https") ? "_blank" : undefined}
              rel="noreferrer"
            >
              {content}
            </a>
          )
        ) : (
          <button
            key={app.icon}
            {...shared}
            onClick={() => onAction(app.action!)}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}
import Link from "next/link";
