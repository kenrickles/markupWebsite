"use client";

import { useEffect, useRef } from "react";
import { useStaticMode } from "./useStaticMode";

/**
 * MagneticCursor — C1. A custom cursor that:
 *  - follows the pointer with a soft lerp
 *  - "magnetizes" (expands + snaps) toward interactive elements [data-magnetic]
 *  - blends over cards with [data-tilt] to hint interactivity
 * Desktop pointers only; disabled for touch and reduced motion.
 */
export default function MagneticCursor() {
  const isStatic = useStaticMode();
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      isStatic ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add("has-magnetic-cursor");

    let mx = -100,
      my = -100; // raw mouse
    let dx = -100,
      dy = -100; // dot lerp
    let rx = -100,
      ry = -100; // ring lerp (slower)
    let magnetX = -100,
      magnetY = -100,
      magnetR = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      dot.style.visibility = "visible";
      ring.style.visibility = "visible";
      mx = e.clientX;
      my = e.clientY;

      // find nearest magnetic element within range
      const els = document.querySelectorAll<HTMLElement>("[data-magnetic]");
      let best: HTMLElement | null = null;
      let bestDist = 120;
      for (const el of Array.from(els)) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const d = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (d < bestDist) {
          bestDist = d;
          best = el;
        }
      }
      if (best) {
        const r = best.getBoundingClientRect();
        magnetX = r.left + r.width / 2;
        magnetY = r.top + r.height / 2;
        magnetR = Math.max(r.width, r.height) / 2 + 10;
        best.classList.add("magnet-active");
        Array.from(els).forEach(
          (el) => el !== best && el.classList.remove("magnet-active"),
        );
      } else {
        magnetR = 0;
        Array.from(els).forEach((el) => el.classList.remove("magnet-active"));
      }
    };

    const tick = () => {
      // dot snaps fast
      dx += (mx - dx) * 0.55;
      dy += (my - dy) * 0.55;
      // ring drifts slower; snaps to magnet when active
      const tx = magnetR > 0 ? magnetX : mx;
      const ty = magnetR > 0 ? magnetY : my;
      rx += (tx - rx) * (magnetR > 0 ? 0.3 : 0.16);
      ry += (ty - ry) * (magnetR > 0 ? 0.3 : 0.16);

      const ringSize = magnetR > 0 ? magnetR * 2 : 34;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%,-50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%,-50%)`;
      ring.style.width = `${ringSize}px`;
      ring.style.height = `${ringSize}px`;
      ring.style.opacity = magnetR > 0 ? "0.9" : "0.5";

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      dot.style.visibility = "hidden";
      ring.style.visibility = "hidden";
      document.body.classList.remove("has-magnetic-cursor");
      document
        .querySelectorAll(".magnet-active")
        .forEach((el) => el.classList.remove("magnet-active"));
    };
  }, [isStatic]);

  return (
    <>
      <div ref={dotRef} className="magnetic-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="magnetic-cursor-ring" aria-hidden="true" />
    </>
  );
}
