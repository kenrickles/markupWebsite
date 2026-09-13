"use client";
import { useEffect, useRef } from "react";
import { useStaticMode } from "./useStaticMode";
const GLYPHS = "!<>-_\\/[]{}=+*^?#01";
export default function ScrambleText({
  text,
  className = "",
  duration = 1400,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isStatic = useStaticMode();
  useEffect(() => {
    const el = ref.current;
    if (!el || isStatic) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const start = Date.now();
        timer = setInterval(() => {
          const progress = Math.min(
            (Date.now() - start) / Math.max(duration, 1),
            1,
          );
          if (progress === 1 || document.hidden) {
            el.textContent = text;
            clearInterval(timer);
            return;
          }
          el.textContent = [...text]
            .map((char, i) =>
              char === " " || i < progress * text.length
                ? char
                : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            )
            .join("");
        }, 40);
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearInterval(timer);
      el.textContent = text;
    };
  }, [text, duration, isStatic]);
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
