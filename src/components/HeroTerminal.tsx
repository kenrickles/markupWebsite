"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useStaticMode } from "./useStaticMode";

/**
 * HeroTerminal — the signature moment.
 * A glitch-free "deploy log" that types itself out on load, with a blinking
 * cursor and a status line that resolves to 100% before yielding to the page.
 * Lines echo Kenrick's real stack (K8s, Helm, GitOps, release gating).
 */
const LINES: { text: string; tone: "cmd" | "ok" | "info" | "warn" }[] = [
  { text: "$ git push origin release/protocol-v2 --follow-tags", tone: "cmd" },
  { text: "✔ CI green: build · provenance · vulnerability scan", tone: "ok" },
  {
    text: "$ helm upgrade protocol-node ./charts/node --atomic \\",
    tone: "cmd",
  },
  { text: "    --set image.tag=2.14.1 --set canary.weight=5", tone: "cmd" },
  {
    text: "→ canary healthy · promoting to 40+ clusters across 7 envs",
    tone: "info",
  },
  {
    text: "✔ release gated · rollback plan armed · audit trail written",
    tone: "ok",
  },
  { text: "complex systems, shipped calmly_", tone: "warn" },
];

gsap.registerPlugin(TextPlugin);

const TONE_CLASS: Record<string, string> = {
  cmd: "text-[color:var(--fg)]",
  ok: "text-[#62d0c3]",
  info: "text-[color:var(--muted)]",
  warn: "text-[#f0a848]",
};

export default function HeroTerminal() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const linesRef = useRef<HTMLSpanElement[]>([]);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const isStatic = useStaticMode();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (isStatic) {
      // static render — show everything
      linesRef.current.forEach((el) => (el.style.opacity = "1"));
      return;
    }

    let inView = false;
    const timeline = gsap.timeline({
      paused: true,
      defaults: { ease: "none" },
    });
    const ctx = gsap.context(() => {
      LINES.forEach((line, i) => {
        const el = linesRef.current[i];
        if (!el) return;
        timeline.fromTo(
          el,
          { text: "" },
          {
            text: line.text,
            duration: Math.min(line.text.length * 0.014, 0.9),
          },
          "+=.08",
        );
      });
      timeline.fromTo(
        ".hero-terminal__bar-fill",
        { width: "0%" },
        { width: "100%", duration: 0.8 },
      );
    }, root);
    const sync = () => {
      if (inView && !document.hidden) timeline.play();
      else timeline.pause();
    };
    const observer = new IntersectionObserver((entries) => {
      inView = entries.some((entry) => entry.isIntersecting);
      sync();
    });
    observer.observe(root);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      timeline.kill();
      ctx.revert();
    };
  }, [isStatic]);

  return (
    <div
      ref={rootRef}
      className="hero-terminal relative overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 text-[12.5px] leading-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
      aria-label="Simulated deployment log"
    >
      {/* window chrome */}
      <div className="mb-4 flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
          kenrick — deployment simulation
        </span>
      </div>

      {/* scanline shimmer */}
      <div className="hero-terminal__scan pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(240,168,72,0.05)_50%,transparent_100%)] bg-[length:100%_300%]" />

      <div className="relative space-y-1.5">
        {LINES.map((line, i) => (
          <div key={i} className={TONE_CLASS[line.tone]}>
            <span
              ref={(el) => {
                if (el) linesRef.current[i] = el;
              }}
            >
              {line.text}
            </span>
            {line.tone === "warn" && (
              <span
                ref={cursorRef}
                aria-hidden="true"
                className="terminal-caret"
              />
            )}
          </div>
        ))}
      </div>

      {/* status bar */}
      <div className="relative mt-5 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
          <div
            className="hero-terminal__bar-fill h-full rounded-full bg-gradient-to-r from-[#f0a848] to-[#62d0c3]"
            style={{ width: "100%" }}
          />
        </div>
        <span
          className={`hero-terminal__status text-[10px] uppercase tracking-[0.3em] text-[#f0a848] `}
        >
          release · ready
        </span>
      </div>
    </div>
  );
}
