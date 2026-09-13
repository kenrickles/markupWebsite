"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useStaticMode, toggleMotion } from "./useStaticMode";

const routes = [
  "M52 144H146L208 206",
  "M448 144H354L292 206",
  "M52 356H146L208 294",
  "M448 356H354L292 294",
];

/** Decorative, deliberately abstract signal flow—not live infrastructure telemetry. */
export default function SignalEngine() {
  const root = useRef<HTMLDivElement>(null);
  const isStatic = useStaticMode();
  useEffect(() => {
    const el = root.current;
    if (!el || isStatic) return;
    let inView = false;
    const motion = gsap.timeline({ paused: true });
    const ctx = gsap.context(() => {
      motion.to(
        ".signal-ring-outer",
        {
          rotation: 360,
          svgOrigin: "250 250",
          duration: 22,
          ease: "none",
          repeat: -1,
        },
        0,
      );
      motion.to(
        ".signal-ring-inner",
        {
          rotation: -360,
          svgOrigin: "250 250",
          duration: 14,
          ease: "none",
          repeat: -1,
        },
        0,
      );
      motion.to(
        ".signal-packet",
        {
          strokeDashoffset: -100,
          duration: 2.8,
          stagger: 0.35,
          ease: "none",
          repeat: -1,
        },
        0,
      );
      motion.to(
        ".signal-core",
        { y: -9, duration: 2.4, ease: "sine.inOut", repeat: -1, yoyo: true },
        0,
      );
      motion.to(
        ".signal-halo",
        {
          scale: 1.16,
          opacity: 0.2,
          svgOrigin: "250 250",
          duration: 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        },
        0,
      );
    }, el);
    const sync = () =>
      motion.paused(
        !inView || document.hidden || !!document.querySelector("dialog[open]"),
      );
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("portfolio-modal", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("portfolio-modal", sync);
      motion.kill();
      ctx.revert();
    };
  }, [isStatic]);

  return (
    <div className="signal-engine" ref={root}>
      <div className="signal-caption mono">
        <span>FIG. 01 / SIGNAL ENGINE</span>
        <span>KT / 01</span>
      </div>
      <svg
        className="signal-canvas"
        viewBox="0 0 500 500"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="signal-grid"
            width="25"
            height="25"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="currentColor" opacity=".18" />
          </pattern>
          <radialGradient id="signal-glow">
            <stop stopColor="currentColor" stopOpacity=".13" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="500" height="500" fill="url(#signal-grid)" />
        <circle cx="250" cy="250" r="240" fill="url(#signal-glow)" />
        <circle cx="250" cy="250" r="185" className="signal-guide" />
        <g className="signal-ring-outer" stroke="currentColor" strokeWidth="2">
          <circle
            cx="250"
            cy="250"
            r="185"
            strokeDasharray="170 80 8 210 100 595"
          />
          <circle cx="250" cy="65" r="5" fill="currentColor" />
        </g>
        <circle
          className="signal-ring-inner"
          cx="250"
          cy="250"
          r="146"
          stroke="var(--accent-2)"
          strokeWidth="1.5"
          strokeDasharray="85 100 4 170 40 518"
        />
        {routes.map((d, i) => (
          <g key={d}>
            <path d={d} className="signal-route" />
            <path
              className="signal-packet"
              d={d}
              pathLength="100"
              stroke={i % 2 ? "var(--accent-2)" : "currentColor"}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="5 95"
            />
          </g>
        ))}
        <circle
          className="signal-halo"
          cx="250"
          cy="250"
          r="87"
          stroke="currentColor"
          opacity=".5"
        />
        <g
          className="signal-core"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        >
          <path d="m250 185 58 33v65l-58 33-58-33v-65Z" fill="var(--surface)" />
          <path d="m192 218 58 34 58-34M250 252v64M250 185v67" />
          <path
            d="m192 218 58-33 58 33-58 34Z"
            fill="currentColor"
            fillOpacity=".15"
          />
          <circle cx="250" cy="252" r="5" fill="currentColor" />
        </g>
        {[
          [52, 144, "01"],
          [448, 144, "02"],
          [52, 356, "03"],
          [448, 356, "04"],
        ].map(([x, y, label]) => (
          <g key={label}>
            <rect
              x={Number(x) - 18}
              y={Number(y) - 18}
              width="36"
              height="36"
              rx="4"
              fill="var(--bg)"
              stroke="currentColor"
            />
            <text
              x={x}
              y={Number(y) + 4}
              textAnchor="middle"
              fill="var(--fg)"
              stroke="none"
              fontSize="11"
              fontFamily="monospace"
            >
              {label}
            </text>
          </g>
        ))}
        <text
          x="250"
          y="400"
          textAnchor="middle"
          fill="var(--muted)"
          fontSize="10"
          letterSpacing="3"
          fontFamily="monospace"
        >
          BUILD / SHIP / REFINE
        </text>
      </svg>
      <div className="signal-controls mono">
        <span>Complexity → clarity</span>
        <button
          type="button"
          onClick={toggleMotion}
          aria-pressed={!isStatic}
          aria-label="Animate portfolio"
        >
          <span className="motion-indicator" data-playing={!isStatic} />
          {isStatic ? "Motion off" : "Motion on"}
        </button>
      </div>
    </div>
  );
}
