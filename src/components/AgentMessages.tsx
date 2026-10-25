"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ChevronLeft, Maximize2, Minus, X } from "lucide-react";
import {
  agentConversations,
  type AgentConversation,
} from "@/lib/agentConversations";

/** Adapted from Vanessa Li's Messages layout: conversation list, grouped bubbles, compact back navigation. */
function Avatar({
  conversation,
  small = false,
}: {
  conversation: AgentConversation;
  small?: boolean;
}) {
  return (
    <span
      className={`agent-avatar${small ? " agent-avatar-small" : ""}`}
      style={{ background: conversation.color }}
      aria-hidden="true"
    >
      {conversation.initials}
    </span>
  );
}
export default function AgentMessages({
  minimized,
  front,
  onFocus,
  onClose,
  onMinimize,
}: {
  minimized: boolean;
  front: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
}) {
  const [selectedId, setSelectedId] = useState(agentConversations[0].id);
  const [compactThread, setCompactThread] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const selected = agentConversations.find((c) => c.id === selectedId)!;
  const thread = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const drag = useRef<{
    x: number;
    y: number;
    left: number;
    top: number;
    width: number;
    height: number;
    resize: boolean;
  } | null>(null);
  useEffect(() => {
    thread.current?.scrollTo({ top: thread.current.scrollHeight });
  }, [selectedId, compactThread]);
  const start = (e: PointerEvent<HTMLElement>, resize = false) => {
    if (
      expanded ||
      window.innerWidth <= 640 ||
      e.button !== 0 ||
      (e.target as HTMLElement).closest("button")
    )
      return;
    const rect = panel.current?.getBoundingClientRect();
    if (!rect || !panel.current) return;
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      resize,
    };
    panel.current.style.animation = "none";
    panel.current.style.transition = "none";
    panel.current.style.scale = "none";
    panel.current.style.translate = "none";
    panel.current.style.left = `${rect.left}px`;
    panel.current.style.top = `${rect.top}px`;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };
  const move = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    const el = panel.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (d.resize) {
      el.style.width = `${Math.max(440, Math.min(window.innerWidth - d.left - 8, d.width + dx))}px`;
      el.style.height = `${Math.max(330, Math.min(window.innerHeight - d.top - 95, d.height + dy))}px`;
    } else {
      el.style.left = `${Math.max(8, Math.min(window.innerWidth - d.width - 8, d.left + dx))}px`;
      el.style.top = `${Math.max(35, Math.min(window.innerHeight - 140, d.top + dy))}px`;
    }
  };
  const stop = () => {
    drag.current = null;
  };
  const zoom = () => {
    panel.current?.removeAttribute("style");
    setExpanded(!expanded);
  };
  useEffect(() => {
    const reset = () => panel.current?.removeAttribute("style");
    window.addEventListener("resize", reset);
    return () => window.removeEventListener("resize", reset);
  }, []);
  return (
    <section
      ref={panel}
      className={`notes-window agent-messages-window${expanded ? " notes-expanded" : ""}${front ? " front-window" : ""}`}
      aria-label="Messages"
      hidden={minimized}
      onPointerDownCapture={onFocus}
    >
      <header
        className="notes-titlebar"
        onPointerDown={(e) => start(e)}
        onPointerMove={move}
        onPointerUp={stop}
        onPointerCancel={stop}
        onLostPointerCapture={stop}
        onDoubleClick={(e) => {
          if (!(e.target as HTMLElement).closest("button")) zoom();
        }}
      >
        <div className="traffic-lights">
          <button
            className="traffic-close"
            aria-label="Close Messages"
            onClick={onClose}
          >
            <X size={9} />
          </button>
          <button
            className="traffic-minimize"
            aria-label="Minimize Messages"
            onClick={onMinimize}
          >
            <Minus size={9} />
          </button>
          <button
            className="traffic-expand"
            aria-label={
              expanded ? "Restore Messages window" : "Expand Messages window"
            }
            onClick={zoom}
          >
            <Maximize2 size={8} />
          </button>
        </div>
        <span>Messages</span>
      </header>
      <div
        className={`agent-messages-layout${compactThread ? " compact-show-thread" : ""}`}
      >
        <aside className="agent-conversations" aria-label="Agent conversations">
          <p className="agent-conversation-label">Kenrick & the agents</p>
          {agentConversations.map((c) => (
            <button
              key={c.id}
              aria-current={selectedId === c.id ? "true" : undefined}
              aria-label={`Conversation with ${c.name}`}
              className={`agent-conversation${selectedId === c.id ? " agent-conversation-selected" : ""}`}
              onClick={() => {
                setSelectedId(c.id);
                setCompactThread(true);
              }}
            >
              <Avatar conversation={c} />
              <span>
                <strong>{c.name}</strong>
                <small>{c.messages[c.messages.length - 1].text}</small>
              </span>
              <time>{c.time}</time>
            </button>
          ))}
        </aside>
        <div className="agent-chat">
          <header className="agent-chat-header">
            <button
              className="agent-chat-back"
              aria-label="Back to conversation list"
              onClick={() => setCompactThread(false)}
            >
              <ChevronLeft size={17} />
            </button>
            <Avatar conversation={selected} small />
            <div>
              <h2>{selected.name}</h2>
              <p>Fictional conversations. Real supervision energy.</p>
            </div>
          </header>
          <div
            ref={thread}
            className="agent-thread"
            role="log"
            aria-label={`Chat with ${selected.name}`}
          >
            <p className="agent-thread-date">iMessage · {selected.time}</p>
            {selected.messages.map((msg, i) => (
              <div
                key={i}
                className={`agent-message-group ${msg.from === "me" ? "agent-message-mine" : "agent-message-theirs"}${i > 0 && selected.messages[i - 1].from !== msg.from ? " agent-message-gap" : ""}`}
              >
                {msg.speaker && (
                  <span className="agent-speaker">{msg.speaker}</span>
                )}
                <p className="agent-bubble">{msg.text}</p>
              </div>
            ))}
            <p className="agent-delivered">
              {selected.messages.at(-1)?.from === "me"
                ? "Read. Reluctantly."
                : "The agent is reconsidering its life choices."}
            </p>
          </div>
          <footer className="agent-composer">
            <input
              disabled
              aria-label="Message composer (scripted conversations)"
              placeholder="iMessage"
            />
            <span>Scripted agent banter · no messages are sent</span>
          </footer>
        </div>
      </div>
      <div
        className="window-resize"
        aria-hidden="true"
        onPointerDown={(e) => start(e, true)}
        onPointerMove={move}
        onPointerUp={stop}
        onPointerCancel={stop}
      />
    </section>
  );
}
