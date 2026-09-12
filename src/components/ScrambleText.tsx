'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * ScrambleText — B4. Text resolves from glitch characters (matrix-decode).
 * Uses setInterval (not rAF) so background/occluded tabs still complete —
 * Chrome throttles rAF to zero for hidden windows, which froze the decode forever.
 */
const GLYPHS = '!<>-_\\/[]{}—=+*^?#01';

export default function ScrambleText({
  text,
  className = '',
  duration = 1400,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement | null>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const params = new URLSearchParams(window.location.search);
    if (reduce || params.get('static') === '1') return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArmed(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!armed) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const t = Math.min((Date.now() - start) / duration, 1);
      if (t >= 1) {
        setDisplay(text);
        clearInterval(timer);
        return;
      }
      const settled = Math.floor(t * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        out += ch === ' ' || i < settled ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(out);
    }, 40);
    // hard fallback: no matter what, show the final text
    const fallback = setTimeout(() => {
      clearInterval(timer);
      setDisplay(text);
    }, duration + 600);
    return () => {
      clearInterval(timer);
      clearTimeout(fallback);
    };
  }, [armed, text, duration]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {display}
    </span>
  );
}
