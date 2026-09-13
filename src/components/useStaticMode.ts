"use client";
import { useSyncExternalStore } from "react";

// Session-only choice. A visitor can explicitly opt into motion even when their
// device requests reduction; without that action the device preference wins.
let preference: boolean | undefined;
const event = "portfolio-motion";
function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const deviceChanged = () => {
    preference = undefined;
    callback();
  };
  media.addEventListener("change", deviceChanged);
  window.addEventListener("popstate", callback);
  window.addEventListener(event, callback);
  return () => {
    media.removeEventListener("change", deviceChanged);
    window.removeEventListener("popstate", callback);
    window.removeEventListener(event, callback);
  };
}
function snapshot() {
  return (
    new URLSearchParams(window.location.search).get("static") === "1" ||
    (preference ??
      window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  );
}
export function toggleMotion() {
  preference = !snapshot();
  window.dispatchEvent(new Event(event));
}
/** Skip animation, never functionality. Server and no-JS render remain readable. */
export function useStaticMode() {
  return useSyncExternalStore(subscribe, snapshot, () => true);
}
