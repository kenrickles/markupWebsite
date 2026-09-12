'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * ScrambleText — B4. Text resolves from glitch characters (matrix-decode).
 * Cycles through random glyphs then locks in left-to-right.
 * Static/reduced-motion renders the final text immediately.
 */

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01';

export default function ScrambleText({
  text,
  className = '',

  duration = 1400,
}: {
  text: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  duration?: number;
}) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLElement | null>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const params = new URLSearchParams(window.location.search);
    if (reduce || params.get('static') === '1') return;

    // start once visible
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
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const settled = Math.floor(t * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === ' ' || i < settled) {
          out += ch;
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setDisplay(out);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };
    setDisplay(''); // blank before start
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [armed, text, duration]);

  return (
    <span ref={ref as React.Ref<HTMLSpanElement>} className={className} aria-label={text}>
      {display || '\u00A0'}
    </span>
  );
}
