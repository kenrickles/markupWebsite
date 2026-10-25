export type DesktopApp =
  "safari" | "notes" | "reminders" | "finder" | "messages" | "terminal";
export type SafariTab = "overview" | "experience" | "projects" | "resume";
export const appNames: Record<DesktopApp, string> = {
  safari: "Safari",
  notes: "Notes",
  reminders: "Reminders",
  finder: "Finder",
  messages: "Messages",
  terminal: "Terminal",
};
export function windowCommand(app: DesktopApp, action: "zoom" | "find") {
  window.dispatchEvent(
    new CustomEvent("desktop-window", { detail: { app, action } }),
  );
}
