"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Copy,
  FileText,
  Github,
  Linkedin,
  Mail,
  Moon,
  Search,
  Send,
  Sun,
  TerminalSquare,
  X,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import Modal from "./Modal";

type Item = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  run: () => void;
};
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [toast, setToast] = useState("");
  const list = useRef<HTMLDivElement>(null);
  const { theme, toggle } = useTheme();
  const router = useRouter();
  useEffect(() => {
    const show = () => {
      setQuery("");
      setSelected(0);
      setOpen(true);
    };
    const key = (event: KeyboardEvent) => {
      const editing = (event.target as HTMLElement)?.closest(
        'input,textarea,select,[contenteditable="true"]',
      );
      const anotherModal = document.querySelector(
        'dialog[open]:not([aria-label="Command palette"])',
      );
      if (anotherModal) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (
          document.querySelector('dialog[aria-label="Command palette"][open]')
        )
          setOpen(false);
        else show();
      } else if (
        event.key === "/" &&
        !editing &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        event.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", key);
    window.addEventListener("open-command-palette", show);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("open-command-palette", show);
    };
  }, []);
  function notify(message: string) {
    setToast(message);
  }
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText("kenrickles@gmail.com");
      notify("Email copied to clipboard");
    } catch {
      notify("Could not copy. Email: kenrickles@gmail.com");
    }
  }
  const jump = (id: string, label: string): Item => ({
    id,
    label: `Go to ${label}`,
    icon: <ArrowUpRight size={16} />,
    run: () => router.push(`/#${id}`),
  });
  const external = (
    id: string,
    label: string,
    url: string,
    icon: React.ReactNode,
  ): Item => ({
    id,
    label,
    icon,
    run: () => window.open(url, "_blank", "noopener,noreferrer"),
  });
  const items: Item[] = [
    jump("projects", "Work"),
    jump("about", "About"),
    jump("experience", "Experience"),
    jump("education", "Education"),
    jump("contact", "Contact"),
    {
      id: "terminal",
      label: "Open terminal",
      hint: "shell cli kubectl",
      icon: <TerminalSquare size={16} />,
      run: () => window.dispatchEvent(new Event("open-terminal")),
    },
    {
      id: "theme",
      label: theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
      hint: "theme appearance",
      icon: theme === "dark" ? <Sun size={16} /> : <Moon size={16} />,
      run: toggle,
    },
    {
      id: "copy-email",
      label: "Copy email address",
      hint: "kenrickles@gmail.com",
      icon: <Copy size={16} />,
      run: copyEmail,
    },
    external(
      "github",
      "GitHub — kenrickles",
      "https://github.com/kenrickles",
      <Github size={16} />,
    ),
    external(
      "linkedin",
      "LinkedIn — kenrick-tan",
      "https://linkedin.com/in/kenrick-tan",
      <Linkedin size={16} />,
    ),
    external(
      "telegram",
      "Telegram — kenrickles",
      "https://t.me/kenrickles",
      <Send size={16} />,
    ),
    {
      id: "email",
      label: "Compose email",
      icon: <Mail size={16} />,
      run: () => {
        window.location.href = "mailto:kenrickles@gmail.com";
      },
    },
    {
      id: "resume",
      label: "View printable résumé",
      hint: "cv resume pdf",
      icon: <FileText size={16} />,
      run: () => router.push("/resume/"),
    },
  ];
  const filtered = items.filter((item) =>
    `${item.label} ${item.hint ?? ""}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const index = Math.min(selected, Math.max(filtered.length - 1, 0));
  useEffect(() => {
    list.current
      ?.querySelector('[data-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [selected, query]);
  function run(item: Item) {
    setOpen(false);
    item.run();
  }
  return (
    <>
      {toast && (
        <div className="cmdk-toast" role="status">
          {toast}
        </div>
      )}
      {open && (
        <Modal label="Command palette" onClose={() => setOpen(false)}>
          <div className="cmdk">
            <div className="cmdk-search-row">
              <Search size={16} />
              <input
                autoFocus
                role="combobox"
                aria-label="Command palette search"
                aria-expanded="true"
                aria-controls="command-results"
                aria-autocomplete="list"
                aria-activedescendant={
                  filtered[index] ? `command-${filtered[index].id}` : undefined
                }
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelected(
                      Math.min(index + 1, Math.max(filtered.length - 1, 0)),
                    );
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelected(Math.max(index - 1, 0));
                  }
                  if (e.key === "Enter" && filtered[index]) {
                    e.preventDefault();
                    run(filtered[index]);
                  }
                }}
                placeholder="Type a command or search…"
                spellCheck={false}
              />
              <button
                className="dialog-close"
                aria-label="Close command palette"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div
              className="cmdk-list"
              id="command-results"
              role="listbox"
              aria-label="Commands"
              ref={list}
            >
              {filtered.length === 0 && (
                <div className="cmdk-empty" role="status">
                  No matching commands
                </div>
              )}
              {filtered.map((item, i) => (
                <div
                  id={`command-${item.id}`}
                  key={item.id}
                  role="option"
                  aria-selected={i === index}
                  data-selected={i === index}
                  className="cmdk-item"
                  onMouseEnter={() => setSelected(i)}
                  onClick={() => run(item)}
                >
                  <span className="cmdk-item-icon">{item.icon}</span>
                  <span className="cmdk-item-label">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="cmdk-footer">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
