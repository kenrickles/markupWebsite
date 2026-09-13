'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { useStaticMode } from './useStaticMode';

/**
 * HeroTerminal — the signature moment.
 * A glitch-free "deploy log" that types itself out on load, with a blinking
 * cursor and a status line that resolves to 100% before yielding to the page.
 * Lines echo Kenrick's real stack (K8s, Helm, GitOps, release gating).
 */
const LINES: { text: string; tone: 'cmd' | 'ok' | 'info' | 'warn' }[] = [
  { text: '$ git push origin release/protocol-v2 --follow-tags', tone: 'cmd' },
  { text: '✔ CI green: build · provenance · vulnerability scan', tone: 'ok' },
  { text: '$ helm upgrade protocol-node ./charts/node --atomic \\', tone: 'cmd' },
  { text: '    --set image.tag=2.14.1 --set canary.weight=5', tone: 'cmd' },
  { text: '→ canary healthy · promoting to 40+ clusters across 7 envs', tone: 'info' },
  { text: '✔ release gated · rollback plan armed · audit trail written', tone: 'ok' },
  { text: 'complex systems, shipped calmly_', tone: 'warn' },
];

gsap.registerPlugin(TextPlugin);

const TONE_CLASS: Record<string, string> = {
  cmd: 'text-[color:var(--fg)]',
  ok: 'text-[#62d0c3]',
  info: 'text-[color:var(--muted)]',
  warn: 'text-[#f0a848]',
};

export default function HeroTerminal() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const linesRef = useRef<HTMLDivElement[]>([]);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const isStatic = useStaticMode();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (isStatic) {
      // static render — show everything
      linesRef.current.forEach((el) => (el.style.opacity = '1'));
      return;
    }

    let visSync: (() => void) | null = null;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'none' }, paused: document.hidden });
      const typeSpeed = 0.014; // s per char

      LINES.forEach((line, i) => {
        const el = linesRef.current[i];
        if (!el) return;
        const chars = line.text.length;
        tl.set(el, { opacity: 1 }, '+=0.08')
          .fromTo(
            el,
            { text: '' },
            { text: line.text, duration: Math.min(chars * typeSpeed, 0.9), ease: 'none' },
            '<',
          );
      });

      // resolve bar: fill to 100% after last line
      tl.fromTo(
        '.hero-terminal__bar-fill',
        { width: '0%' },
        { width: '100%', duration: 1.1, ease: 'power2.inOut' },
        '+=0.15',
      ).fromTo(
        '.hero-terminal__status',
        { opacity: 0, y: 4 },
        { opacity: 1, y: 0, duration: 0.4 },
        '-=0.5',
      );

      // blinking cursor (independent loop)
      gsap.to(cursorRef.current, { opacity: 0, duration: 0.55, repeat: -1, yoyo: true, ease: 'steps(1)' });

      // subtle scanline shimmer on the whole terminal
      gsap.to('.hero-terminal__scan', {
        backgroundPositionY: '100%',
        duration: 9,
        repeat: -1,
        ease: 'none',
      });

      // If the tab is hidden (or becomes hidden), pause the intro and resume when visible.
      // rAF throttling in hidden tabs freezes tweens — pausing keeps them in sync instead.
      visSync = () => {
        if (document.hidden) tl.pause();
        else tl.play();
      };
      if (document.hidden) tl.pause(0);
      document.addEventListener('visibilitychange', visSync);

    }, root);

    return () => {
      if (visSync) document.removeEventListener('visibilitychange', visSync);
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
          kenrick@galaxy — zsh
        </span>
      </div>

      {/* scanline shimmer */}
      <div className="hero-terminal__scan pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(240,168,72,0.05)_50%,transparent_100%)] bg-[length:100%_300%]" />

      <div className="relative space-y-1.5">
        {LINES.map((line, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) linesRef.current[i] = el;
            }}
            className={`${TONE_CLASS[line.tone]} ${isStatic ? '' : 'opacity-0'}`}
          >
            {line.tone === 'warn' ? (
              <>
                <span className="text-[#f0a848]">{line.text}</span>
                <span ref={cursorRef} className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[2px] bg-[#f0a848]" />
              </>
            ) : (
              line.text
            )}
          </div>
        ))}
      </div>

      {/* status bar */}
      <div className="relative mt-5 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
          <div className="hero-terminal__bar-fill h-full rounded-full bg-gradient-to-r from-[#f0a848] to-[#62d0c3]" style={{ width: isStatic ? '100%' : '0%' }} />
        </div>
        <span className={`hero-terminal__status text-[10px] uppercase tracking-[0.3em] text-[#f0a848] ${isStatic ? '' : 'opacity-0'}`}>
          release · ready
        </span>
      </div>
    </div>
  );
}
