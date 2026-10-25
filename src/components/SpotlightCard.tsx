"use client";
// Adapted from React Bits SpotlightCard. License and attribution: THIRD_PARTY_NOTICES.md.
import { type PointerEvent, type PropsWithChildren } from "react";
export default function SpotlightCard({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) {
  function move(event: PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--mouse-x",
      `${event.clientX - rect.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--mouse-y",
      `${event.clientY - rect.top}px`,
    );
  }
  return (
    <div className={`spotlight-card ${className}`} onPointerMove={move}>
      {children}
    </div>
  );
}
