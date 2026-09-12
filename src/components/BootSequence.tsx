'use client';

import { useEffect, useRef, useState } from 'react';
import { useStaticMode } from './useStaticMode';

/**
 * BootSequence — B1. The site "boots" like a secure node:
 * module checks flash by, then the profile is revealed.
 * Session-aware (once per browser session), skippable via click/key/`boot skip`.
 */

const CHECKS: [string, string][] = [
  ['POST', 'OK'],
  ['CPU cores', '8 × vCPU @ 3.2GHz'],
  ['memory', '64 GiB ECC'],
  ['secure boot chain', 'VERIFIED'],
  ['k8s control plane', 'REACHABLE · v1.31'],
  ['gitops agent', 'SYNCED'],
  ['secrets vault', 'UNSEALED · HSM BACKED'],
  ['observability stack', 'PROMETHEUS + GRAFANA UP'],
  ['error budget', '97.4% remaining'],
  ['profile module', 'LOADING…'],
];

const TOTAL_MS = 2600;

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const isStatic = useStaticMode();
  const [visible, setVisible] = useState(false);
  const [lines, setLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (isStatic) {
      doneRef.current = true;
      onDone();
      return;
    }
    if (sessionStorage.getItem('booted') === '1') {
      doneRef.current = true;
      onDone();
      return;
    }
    setVisible(true);
    document.documentElement.style.overflow = 'hidden';

    const lineTimer = setInterval(() => {
      setLines((n) => Math.min(n + 1, CHECKS.length));
    }, TOTAL_MS / (CHECKS.length + 1));
    const progTimer = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 9 + 4, 100));
    }, TOTAL_MS / 30);

    const finishTimer = setTimeout(() => finish(), TOTAL_MS);
    const keySkip = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish();
    };
    window.addEventListener('keydown', keySkip);

    function finish() {
      if (doneRef.current) return;
      doneRef.current = true;
      clearInterval(lineTimer);
      clearInterval(progTimer);
      clearTimeout(finishTimer);
      window.removeEventListener('keydown', keySkip);
      sessionStorage.setItem('booted', '1');
      setLines(CHECKS.length);
      setProgress(100);
      setLeaving(true);
      setTimeout(() => {
        setVisible(false);
        document.documentElement.style.overflow = '';
        onDone();
      }, 550);
    }
    finishRef.current = finish;

    return () => {
      clearInterval(lineTimer);
      clearInterval(progTimer);
      clearTimeout(finishTimer);
      window.removeEventListener('keydown', keySkip);
      document.documentElement.style.overflow = '';
    };
  }, [isStatic, onDone]);

  const root = useRef<HTMLDivElement | null>(null);
  const finishRef = useRef<() => void>(() => {});

  if (!visible) return null;

  return (
    <div
      ref={root}
      role="status"
      aria-label="System boot sequence"
      onClick={() => finishRef.current()}
      className={`boot-screen fixed inset-0 z-[999] flex cursor-pointer flex-col justify-center bg-[#0d1117] p-8 font-[family-name:var(--font-geist-mono)] text-[13px] transition-opacity duration-500 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="mx-auto w-full max-w-2xl">
        <p className="mb-6 text-[11px] uppercase tracking-[0.4em] text-[#f0a848]">
          kenrick.sys — secure node boot
        </p>
        <div className="space-y-1.5">
          {CHECKS.slice(0, lines).map(([label, status], i) => (
            <div key={label} className="flex justify-between gap-6">
              <span className="text-[#e8edf2]">
                <span className="text-[#97a4b3]">[{String(i).padStart(2, '0')}]</span>{' '}
                {label}
                {i === lines - 1 && !leaving && (
                  <span className="ml-1 inline-block h-[0.9em] w-[0.5em] translate-y-[2px] animate-pulse bg-[#f0a848]" />
                )}
              </span>
              <span className={status.includes('OK') || status.includes('UP') ? 'text-[#62d0c3]' : 'text-[#97a4b3]'}>
                {status}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-4">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#f0a848] to-[#62d0c3] transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="w-12 text-right text-[11px] text-[#97a4b3]">
            {Math.round(progress)}%
          </span>
        </div>
        <p className="mt-6 text-center text-[10px] uppercase tracking-[0.35em] text-[#97a4b3]/60">
          press esc to skip
        </p>
      </div>
    </div>
  );
}
