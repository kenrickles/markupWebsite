"use client";
import { TerminalSquare } from "lucide-react";

/** All launch points share the desktop's single terminal session. */
export default function TerminalLauncher({
  className = "",
}: {
  className?: string;
}) {
  return (
    <button
      className={`terminal-launch ${className}`}
      aria-label="Open interactive terminal"
      onClick={() => window.dispatchEvent(new Event("open-terminal"))}
    >
      <TerminalSquare size={16} />
      <span>
        Open terminal <kbd>⌘`</kbd>
      </span>
    </button>
  );
}
