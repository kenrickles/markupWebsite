"use client";

import { useEffect, useRef } from "react";
import { useStaticMode } from "./useStaticMode";

/**
 * TiltCard — C1. 3D perspective tilt that tracks the pointer.
 * Wrap any block; add data-tilt-max (deg, default 6) to tune.
 */
export default function TiltCard({
  children,
  className = "",
  max = 6,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const isStatic = useStaticMode();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isStatic) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateZ(0)`;
      el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
      el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
    };
    const onLeave = () => {
      el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.style.transform = "";
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    };
  }, [max, isStatic]);

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      style={{ transition: "transform 0.18s ease-out" }}
    >
      {children}
    </div>
  );
}
