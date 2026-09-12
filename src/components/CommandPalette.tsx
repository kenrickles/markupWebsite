'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  Copy,
  Download,
  Github,
  Linkedin,
  Mail,
  Moon,
  Search,
  Send,
  Sun,
  TerminalSquare,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

/**
 * CommandPalette — C4. ⌘K / Ctrl+K opens it. "/" works outside inputs.
 * Sections jump, theme toggle, social links, copy email, terminal.
 * Arrow keys + Enter, Esc to close. Filter-as-you-type.
 */

type Item = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  keywords?: string;
  perform: (ctx: { toggleTheme: () => void; copyEmail: () => void }) => void;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState(0);
  const [toast, setToast] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const { toggle: toggleTheme, theme } = useTheme();
  const router = useRouter();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  };

  const items: Item[] = useMemo(() => {
    const jump = (id: string, label: string): Item => ({
      id: `go-${id}`,
      label,
      hint: 'section',
      icon: <ArrowUpRight size={15} />,
      perform: () => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      },
    });
    const external = (id: string, label: string, url: string, icon: React.ReactNode): Item => ({
      id,
      label,
      hint: 'link',
      icon,
      perform: () => window.open(url, '_blank'),
    });
    return [
      jump('projects', 'Go to Work'),
      jump('about', 'Go to About'),
      jump('experience', 'Go to Experience'),
      jump('education', 'Go to Education'),
      jump('contact', 'Go to Contact'),
      {
        id: 'terminal',
        label: 'Open terminal',
        hint: '⌘`',
        icon: <TerminalSquare size={15} />,
        keywords: 'shell cli kubectl',
        perform: () => {
          window.dispatchEvent(new CustomEvent('open-terminal'));
        },
      },
      {
        id: 'theme',
        label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
        hint: theme,
        icon: theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />,
        keywords: 'theme daylight ember appearance',
        perform: ({ toggleTheme }) => toggleTheme(),
      },
      {
        id: 'copy-email',
        label: 'Copy email address',
        hint: 'kenrickles@gmail.com',
        icon: <Copy size={15} />,
        keywords: 'mail contact',
        perform: ({ copyEmail }) => copyEmail(),
      },
      external('github', 'GitHub — kenrickles', 'https://github.com/kenrickles', <Github size={15} />),
      external('linkedin', 'LinkedIn — kenrick-tan', 'https://linkedin.com/in/kenrick-tan', <Linkedin size={15} />),
      external('telegram', 'Telegram — kenrickles', 'https://t.me/kenrickles', <Send size={15} />),
      {
        id: 'email',
        label: 'Compose email',
        hint: 'mailto',
        icon: <Mail size={15} />,
        perform: () => {
          window.location.href = 'mailto:kenrickles@gmail.com';
        },
      },
      {
        id: 'download',
        label: 'Download resume',
        hint: 'pdf',
        icon: <Download size={15} />,
        keywords: 'cv resume',
        perform: () => showToast('Resume download would go here — wire to /resume.pdf'),
      },
    ];
  }, [theme, toggleTheme, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        (it.keywords ?? '').toLowerCase().includes(q) ||
        (it.hint ?? '').toLowerCase().includes(q),
    );
  }, [items, query]);

  // open/close + shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const inInput = ['INPUT', 'TEXTAREA'].includes(
        (e.target as HTMLElement)?.tagName,
      );
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === '/' && !inInput) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // focus + reset on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  // keep selection in view
  useEffect(() => {
    const el = listRef.current?.querySelector('[data-selected="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [sel, filtered.length]);

  const copyEmail = () => {
    navigator.clipboard?.writeText('kenrickles@gmail.com');
    showToast('Email copied to clipboard');
  };

  const run = (item: Item) => {
    setOpen(false);
    item.perform({ toggleTheme, copyEmail });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[sel]) run(filtered[sel]);
    }
  };

  return (
    <>
      {toast && (
        <div className="cmdk-toast" role="status">
          {toast}
        </div>
      )}
      {open && (
        <div
          className="cmdk-overlay"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className="cmdk"
            role="dialog"
            aria-label="Command palette"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cmdk-search-row">
              <Search size={16} className="cmdk-search-icon" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSel(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Type a command or search…"
                aria-label="Command palette search"
                spellCheck={false}
              />
              <kbd>esc</kbd>
            </div>
            <div className="cmdk-list" ref={listRef} role="listbox">
              {filtered.length === 0 && (
                <div className="cmdk-empty">No matching commands</div>
              )}
              {filtered.map((item, i) => (
                <button
                  key={item.id}
                  data-selected={i === sel}
                  className="cmdk-item"
                  role="option"
                  aria-selected={i === sel}
                  onMouseEnter={() => setSel(i)}
                  onClick={() => run(item)}
                >
                  <span className="cmdk-item-icon">{item.icon}</span>
                  <span className="cmdk-item-label">{item.label}</span>
                  {item.hint && <span className="cmdk-item-hint">{item.hint}</span>}
                </button>
              ))}
            </div>
            <div className="cmdk-footer">
              <span>
                <kbd>↑↓</kbd> navigate
              </span>
              <span>
                <kbd>↵</kbd> select
              </span>
              <span>
                <kbd>esc</kbd> close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
