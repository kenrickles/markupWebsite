"use client";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  window.addEventListener("popstate", callback);
  return () => {
    media.removeEventListener("change", callback);
    window.removeEventListener("popstate", callback);
  };
}
function snapshot() {
  return (
    new URLSearchParams(window.location.search).get("static") === "1" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
/** Skip animation, never functionality. Also reacts to OS preference changes. */
export function useStaticMode() {
  return useSyncExternalStore(subscribe, snapshot, () => true);
}
