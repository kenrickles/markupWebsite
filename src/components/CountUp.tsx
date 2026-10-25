"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useStaticMode } from "./useStaticMode";

/**
 * useCountUp — animates a numeric metric from 0 to its target value
 * when it scrolls into view. Parses values like "40+", "5.2", "99.95%",
 * "250 Projects", "$125k" and preserves prefix/suffix decorations.
 *
 * Returns a ref to attach to the <span> whose text gets animated.
 */
export function useCountUp(target: string, duration = 1.6) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isStatic = useStaticMode();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isStatic) {
      el.textContent = target;
      return;
    }

    // decompose: prefix, numeric part, suffix
    const match = target.match(/^([^\d]*)([\d.,]+)(.*)$/);
    if (!match) {
      el.textContent = target;
      return;
    }
    const [, prefix, numeric, suffix] = match;
    const decimals = (numeric.split(".")[1] || "").length;
    const end = parseFloat(numeric.replace(/,/g, ""));
    if (Number.isNaN(end)) {
      el.textContent = target;
      return;
    }

    const state = { v: 0 };
    const fmt = (v: number) => {
      const fixed = v.toFixed(decimals);
      return numeric.includes(",")
        ? Number(fixed).toLocaleString("en-US")
        : fixed;
    };

    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(
        state,
        { v: 0 },
        {
          v: end,
          duration,
          ease: "power2.out",
          paused: true,
          onUpdate: () => {
            el.textContent = `${prefix}${fmt(state.v)}${suffix}`;
          },
        },
      );

      // fire when visible (IntersectionObserver is robust to scroll/lenis modes)
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            tween.play();
            io.disconnect();
          }
        },
        { threshold: 0.4 },
      );
      io.observe(el);
      return () => io.disconnect();
    }, el);

    return () => ctx.revert();
  }, [target, duration, isStatic]);

  return ref;
}

/** Metric — drop-in count-up stat */
export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useCountUp(value);
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
