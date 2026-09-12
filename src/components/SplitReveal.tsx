'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useStaticMode } from './useStaticMode';

/**
 * SplitReveal — word-by-word masked rise for display headlines.
 * (React-Bits SplitText-inspired, implemented locally — no premium plugin needed.)
 * Splits text into words, each wrapped in an overflow-hidden span so the
 * rise is masked; staggered on mount (or on scroll if `scroll` prop set).
 */
export default function SplitReveal({
  text,
  className = '',
  delay = 0,
  stagger = 0.07,
  scroll = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  scroll?: boolean;
}) {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const isStatic = useStaticMode();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (isStatic) return;

    const words = Array.from(root.querySelectorAll('.sr-word-inner'));
    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(
        words,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger,
          delay,
          paused: true,
        },
      );
      if (scroll) {
        const io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              tween.play();
              io.disconnect();
            }
          },
          { threshold: 0.3 },
        );
        io.observe(root);
        return () => io.disconnect();
      }
      tween.play();
    }, root);
    return () => ctx.revert();
  }, [text, delay, stagger, scroll, isStatic]);

  return (
    <span ref={rootRef} className={`sr-root inline-block ${className}`} aria-label={text}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="sr-word inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
          <span className="sr-word-inner inline-block will-change-transform">
            {word}
            {i < text.split(' ').length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </span>
  );
}
