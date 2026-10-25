"use client";
import { useRef, useState, type CSSProperties } from "react";
import MacIcon, { type MacIconName } from "./MacIcons";

import type { DesktopApp } from "@/lib/desktop";
type Action = DesktopApp | "settings";
const apps: {
  icon: MacIconName;
  label: string;
  action?: Action;
  href?: string;
}[] = [
  { icon: "finder", label: "Open recommended tools", action: "finder" },
  { icon: "safari", label: "Open Safari profile", action: "safari" },
  { icon: "mail", label: "Email Kenrick", href: "mailto:kenrickles@gmail.com" },
  { icon: "messages", label: "Open Messages", action: "messages" },
  { icon: "notes", label: "Open writing", action: "notes" },
  { icon: "reminders", label: "Open roadmap", action: "reminders" },
  { icon: "terminal", label: "Open interactive terminal", action: "terminal" },
  { icon: "settings", label: "Appearance settings", action: "settings" },
];
export default function MacDock({
  onAction,
  active,
  running,
}: {
  onAction: (action: Action) => void;
  active: string;
  running: DesktopApp[];
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
                app.action && running.includes(app.action as DesktopApp)
                  ? "dock-active"
                  : ""
              }
            />
          </>
        );
        const shared = {
          className: "dock-app",
          "aria-current": app.action === active ? ("true" as const) : undefined,
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
