"use client";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Folder,
  NotebookPen,
  Search,
} from "lucide-react";
import Link from "next/link";
import AppWindow from "./AppWindow";
import type { Writing } from "@/lib/writing";
const categories = ["All writing", "Engineering", "Thinking", "Life"];
export default function WritingApp({
  posts,
  slug,
  select,
  visible,
  front,
  onFocus,
  onClose,
  onMinimize,
}: {
  posts: Writing[];
  slug?: string;
  select: (slug: string) => void;
  visible: boolean;
  front: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
}) {
  const [category, setCategory] = useState("All writing");
  const [query, setQuery] = useState("");
  const [list, setList] = useState(false);
  const post = posts.find((p) => p.slug === slug);
  const filtered = posts.filter(
    (p) =>
      (category === "All writing" || p.category === category) &&
      `${p.title} ${p.description} ${p.tags.join(" ")} ${p.text}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <AppWindow
      app="notes"
      visible={visible}
      front={front}
      onFocus={onFocus}
      onClose={onClose}
      onMinimize={onMinimize}
    >
      <div className={`writing-layout${list ? " writing-show-list" : ""}`}>
        <aside className="writing-sidebar" aria-label="Writing navigation">
          <label className="note-search">
            <Search size={14} />
            <input
              type="search"
              aria-label="Search writing"
              placeholder="Search writing"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <p className="app-sidebar-label">MY WRITINGS</p>
          <div className="writing-folders">
            {categories.map((c) => (
              <button
                key={c}
                aria-pressed={c === category}
                onClick={() => setCategory(c)}
              >
                <Folder size={15} />
                <span>{c}</span>
                <small>
                  {c === "All writing"
                    ? posts.length
                    : posts.filter((p) => p.category === c).length}
                </small>
              </button>
            ))}
          </div>
          <div className="writing-list">
            {filtered.map((p) => (
              <button
                key={p.slug}
                className={p.slug === slug ? "note-selected" : ""}
                aria-current={p.slug === slug ? "page" : undefined}
                onClick={() => {
                  select(p.slug);
                  setList(false);
                }}
              >
                <strong>{p.title}</strong>
                <span>
                  {p.category} · {p.minutes} min
                </span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="writing-list-empty">
                {query ? "No matching writing." : "No notes yet."}
              </p>
            )}
          </div>
          <footer className="sidebar-footer">
            {posts.length} published {posts.length === 1 ? "note" : "notes"}
          </footer>
        </aside>
        <div className="writing-reader">
          <div className="writing-toolbar">
            <button className="writing-back" onClick={() => setList((v) => !v)}>
              <ArrowLeft size={14} /> {list ? "Reader" : "Writing"}
            </button>
            <span>Kenrick’s Notes</span>
            {post && (
              <Link
                href={`/writing/${post.slug}/`}
                aria-label="Open article permalink"
              >
                <ArrowUpRight size={15} />
              </Link>
            )}
          </div>
          {post ? (
            <article className="writing-article" key={post.slug}>
              <p className="profile-kicker">
                {post.kind.toUpperCase()} · {post.category.toUpperCase()}
              </p>
              <h1>{post.title}</h1>
              <p className="writing-description">{post.description}</p>
              <div className="writing-meta">
                <time dateTime={post.date}>{post.date}</time> · {post.minutes}{" "}
                min read
              </div>
              <div
                className="markdown-body"
                dangerouslySetInnerHTML={{ __html: post.html }}
              />
            </article>
          ) : (
            <div className="app-empty writing-empty">
              <NotebookPen size={44} strokeWidth={1.2} />
              <span className="profile-kicker">
                ENGINEERING · THINKING · LIFE
              </span>
              <h1>Good thoughts take time.</h1>
              <p>
                This is where I’ll share what I’m learning, questions I’m
                sitting with, and ideas worth passing on.
              </p>
              <span className="empty-status">Nothing published yet.</span>
            </div>
          )}
        </div>
      </div>
    </AppWindow>
  );
}
