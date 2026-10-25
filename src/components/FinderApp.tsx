"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Code2,
  Folder,
  Search,
  Wrench,
} from "lucide-react";
import {
  recommendationCategories,
  recommendations,
} from "@/lib/recommendations";
import AppWindow from "./AppWindow";
export default function FinderApp(props: {
  visible: boolean;
  front: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
}) {
  const [category, setCategory] = useState("All resources");
  const [query, setQuery] = useState("");
  const entries = recommendations.filter(
    (r) =>
      (category === "All resources" || r.category === category) &&
      `${r.name} ${r.why} ${r.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <AppWindow app="finder" {...props}>
      <div className="finder-layout">
        <aside className="finder-sidebar">
          <p className="app-sidebar-label">FAVOURITES</p>
          <nav aria-label="Resource categories">
            {recommendationCategories.map((c, i) => (
              <button
                key={c}
                aria-pressed={c === category}
                onClick={() => setCategory(c)}
              >
                {i === 2 ? (
                  <Code2 size={16} />
                ) : i === 3 ? (
                  <BookOpen size={16} />
                ) : (
                  <Folder size={16} />
                )}
                <span>{c}</span>
              </button>
            ))}
          </nav>
        </aside>
        <div className="finder-main">
          <header className="finder-toolbar">
            <h1>Recommended tools</h1>
            <label className="note-search">
              <Search size={14} />
              <input
                type="search"
                aria-label="Search resources"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </header>
          <div className="finder-entries">
            {entries.length ? (
              entries.map((entry) => (
                <article className="resource-entry" key={entry.name}>
                  <span className="profile-kicker">{entry.category}</span>
                  <h2>
                    <a href={entry.href} target="_blank" rel="noreferrer">
                      {entry.name} <ArrowUpRight size={16} />
                    </a>
                  </h2>
                  <p>{entry.why}</p>
                  <p className="resource-tradeoff">{entry.tradeoff}</p>
                </article>
              ))
            ) : (
              <div className="app-empty">
                <Wrench size={42} strokeWidth={1.2} />
                <h2>
                  {query
                    ? "No matching resources."
                    : "A considered collection."}
                </h2>
                <p>
                  {query
                    ? "Try another search or category."
                    : "Tools, software, books and resources I would recommend, with a few words on why. I’m putting this shelf together."}
                </p>
                {!query && (
                  <span className="empty-status">
                    No recommendations added yet.
                  </span>
                )}
              </div>
            )}
          </div>
          <footer className="finder-status">
            {entries.length} items <span>Recommendations · {category}</span>
          </footer>
        </div>
      </div>
    </AppWindow>
  );
}
