"use client";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent,
} from "react";
import { Maximize2, Minus, X } from "lucide-react";
import { appNames, type DesktopApp } from "@/lib/desktop";

export default function AppWindow({
  app,
  visible,
  front,
  onFocus,
  onClose,
  onMinimize,
  toolbar,
  children,
}: {
  app: DesktopApp;
  visible: boolean;
  front: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  toolbar?: ReactNode;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);
  const gesture = useRef<{
    x: number;
    y: number;
    left: number;
    top: number;
    width: number;
    height: number;
    resize: boolean;
  } | null>(null);
  const zoom = () => {
    root.current?.removeAttribute("style");
    setExpanded((v) => !v);
  };
  useEffect(() => {
    const reset = () => root.current?.removeAttribute("style");
    const command = (event: Event) => {
      const { app: target, action } = (event as CustomEvent).detail;
      if (target !== app) return;
      if (action === "zoom") {
        reset();
        setExpanded((v) => !v);
      }
      if (action === "find")
        root.current
          ?.querySelector<HTMLInputElement>('input[type="search"]')
          ?.focus();
    };
    window.addEventListener("resize", reset);
    window.addEventListener("desktop-window", command);
    return () => {
      window.removeEventListener("resize", reset);
      window.removeEventListener("desktop-window", command);
    };
  }, [app]);
  const begin = (e: PointerEvent<HTMLElement>, resize = false) => {
    if (
      expanded ||
      window.innerWidth <= 760 ||
      e.button !== 0 ||
      (!resize && (e.target as HTMLElement).closest("button, a, input"))
    )
      return;
    const el = root.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.animation = "none";
    el.style.transition = "none";
    el.style.translate = "none";
    el.style.transform = "none";
    gesture.current = {
      x: e.clientX,
      y: e.clientY,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      resize,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };
  const move = (e: PointerEvent<HTMLElement>) => {
    const g = gesture.current,
      el = root.current;
    if (!g || !el) return;
    if (g.resize) {
      el.style.width = `${Math.max(520, Math.min(window.innerWidth - g.left - 12, g.width + e.clientX - g.x))}px`;
      el.style.height = `${Math.max(340, Math.min(window.innerHeight - g.top - 100, g.height + e.clientY - g.y))}px`;
    } else {
      el.style.left = `${Math.max(8, Math.min(window.innerWidth - g.width - 8, g.left + e.clientX - g.x))}px`;
      el.style.top = `${Math.max(36, Math.min(window.innerHeight - 140, g.top + e.clientY - g.y))}px`;
    }
  };
  const end = () => {
    gesture.current = null;
  };
  return (
    <section
      ref={root}
      hidden={!visible}
      className={`notes-window application-window ${app}-window ${app}-application${expanded ? " notes-expanded" : ""}${front ? " front-window" : ""}`}
      aria-label={appNames[app]}
      onPointerDownCapture={onFocus}
    >
      <header
        className={`notes-titlebar app-titlebar ${toolbar ? "has-toolbar" : ""}`}
        onPointerDown={(e) => begin(e)}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onLostPointerCapture={end}
        onDoubleClick={(e) => {
          if (!(e.target as HTMLElement).closest("button, a, input")) zoom();
        }}
      >
        <div className="traffic-lights">
          <button
            className="traffic-close"
            aria-label={`Close ${appNames[app]}`}
            onClick={onClose}
          >
            <X size={9} />
          </button>
          <button
            className="traffic-minimize"
            aria-label={`Minimize ${appNames[app]}`}
            onClick={onMinimize}
          >
            <Minus size={9} />
          </button>
          <button
            className="traffic-expand"
            aria-label={`${expanded ? "Restore" : "Expand"} ${appNames[app]} window`}
            onClick={zoom}
          >
            <Maximize2 size={8} />
          </button>
        </div>
        {toolbar ?? <span>{appNames[app]}</span>}
      </header>
      <div className="app-workspace">{children}</div>
      <button
        className="window-resize"
        aria-label={`Resize ${appNames[app]} (arrow keys)`}
        onPointerDown={(e) => begin(e, true)}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onLostPointerCapture={end}
        onKeyDown={(e) => {
          if (expanded || !e.key.startsWith("Arrow") || !root.current) return;
          e.preventDefault();
          const rect = root.current.getBoundingClientRect();
          root.current.style.width = `${Math.max(520, Math.min(window.innerWidth - rect.left - 12, rect.width + (e.key === "ArrowRight" ? 20 : e.key === "ArrowLeft" ? -20 : 0)))}px`;
          root.current.style.height = `${Math.max(340, Math.min(window.innerHeight - rect.top - 100, rect.height + (e.key === "ArrowDown" ? 20 : e.key === "ArrowUp" ? -20 : 0)))}px`;
        }}
      />
    </section>
  );
}
