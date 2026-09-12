'use client';

import { useEffect, useState } from 'react';
import { TerminalSquare } from 'lucide-react';
import TerminalShell from './TerminalShell';

/**
 * TerminalLauncher — client-side toggle + global Cmd/Ctrl+` shortcut.
 * Reads the current theme so the shell matches.
 */
export default function TerminalLauncher({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '`') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-terminal', onOpenEvent);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-terminal', onOpenEvent);
    };
  }, []);

  return (
    <>
      <button
        className={`terminal-launch ${className}`}
        onClick={() => setOpen(true)}
        aria-label="Open interactive terminal"
      >
        <TerminalSquare size={16} />
        <span>
          Open terminal <kbd>⌘`</kbd>
        </span>
      </button>
      {open && <TerminalShell onClose={() => setOpen(false)} />}
    </>
  );
}
