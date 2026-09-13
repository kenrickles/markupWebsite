"use client";
import { createContext, useContext, useSyncExternalStore } from "react";

type Theme = "dark" | "light";
const KEY = "kenrick-theme";
function apply(theme: Theme) {
  document.documentElement.classList.toggle("light", theme === "light");
}
function preference(): Theme {
  const forced = new URLSearchParams(window.location.search).get("theme");
  if (forced === "light" || forced === "dark") return forced;
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* Storage is optional. */
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}
function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: light)");
  const update = () => {
    apply(preference());
    callback();
  };
  const storage = (event: StorageEvent) => {
    if (event.key === KEY || event.key === null) update();
  };
  update();
  window.addEventListener("portfolio-theme", callback);
  window.addEventListener("storage", storage);
  media.addEventListener("change", update);
  return () => {
    window.removeEventListener("portfolio-theme", callback);
    window.removeEventListener("storage", storage);
    media.removeEventListener("change", update);
  };
}
function setTheme(theme: Theme) {
  apply(theme);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* Still usable in memory. */
  }
  window.dispatchEvent(new Event("portfolio-theme"));
}
function snapshot(): Theme {
  return document.documentElement.classList.contains("light")
    ? "light"
    : "dark";
}
function toggle() {
  setTheme(snapshot() === "dark" ? "light" : "dark");
}
const ThemeCtx = createContext({ theme: "dark" as Theme, toggle, setTheme });
export const useTheme = () => useContext(ThemeCtx);
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useSyncExternalStore(
    subscribe,
    snapshot,
    () => "dark" as Theme,
  );
  return (
    <ThemeCtx.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}
