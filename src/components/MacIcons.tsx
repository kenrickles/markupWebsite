import { useId } from "react";
import { DockIcon, type DockIconId } from "./MacAppIcons";
export type MacIconName = DockIconId | "folder" | "document" | "terminal";

/** Apple menu mark adapted from the reference MenuBar.tsx. */
export function AppleLogo() {
  return (
    <svg
      viewBox="0 0 814 1000"
      width="14"
      height="15"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M788 341c-6 4-109 62-109 190 0 148 130 200 134 202-1 3-21 71-69 141-43 61-88 122-156 122s-86-40-165-40c-77 0-104 41-167 41s-107-57-157-126C41 788 0 665 0 548c0-187 122-286 242-286 64 0 117 42 157 42 38 0 97-45 170-45 27 0 127 3 219 82zM554 172c32-38 55-90 55-143 0-7-1-15-2-21-52 2-114 35-152 78-29 33-57 86-57 139 0 8 1 16 2 19 3 1 9 1 14 1 47 0 106-31 140-73z" />
    </svg>
  );
}

/** Reference app icons plus portfolio-specific desktop files and Terminal. */
export default function MacIcon({
  name,
  className = "",
}: {
  name: MacIconName;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  if (name !== "folder" && name !== "document" && name !== "terminal")
    return <DockIcon id={name} className={`mac-icon ${className}`} />;
  return (
    <svg
      viewBox="0 0 64 64"
      className={`mac-icon ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-folder`} x2="0" y2="1">
          <stop stopColor="#91ddff" />
          <stop offset="1" stopColor="#39a7e9" />
        </linearGradient>
        <linearGradient id={`${id}-paper`} x2="0" y2="1">
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#ecf0f6" />
        </linearGradient>
      </defs>
      {name === "folder" ? (
        <>
          <path
            d="M5 20a5 5 0 0 1 5-5h17l7 7h20a5 5 0 0 1 5 5v26a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5Z"
            fill="#2498ce"
          />
          <path
            d="M5 24h54v29a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5Z"
            fill={`url(#${id}-folder)`}
          />
          <path d="M8 25h48" stroke="#c5efff" strokeWidth="1.2" />
        </>
      ) : name === "document" ? (
        <>
          <path
            d="M15 5h24l12 12v41a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z"
            fill={`url(#${id}-paper)`}
            stroke="#c3c8d0"
            strokeWidth=".7"
          />
          <path
            d="M39 5v12h12"
            fill="#dde2e9"
            stroke="#bbc1ca"
            strokeWidth=".7"
          />
          <path
            d="M21 26h20M21 31h20M21 36h15"
            stroke="#a2abb9"
            strokeWidth="1.5"
          />
          <rect x="17" y="43" width="29" height="13" rx="2" fill="#4b8be4" />
          <text
            x="31.5"
            y="52.5"
            textAnchor="middle"
            fontSize="8"
            fill="white"
            fontFamily="Arial"
            fontWeight="600"
          >
            CV
          </text>
        </>
      ) : (
        <>
          <rect
            x="3"
            y="3"
            width="58"
            height="58"
            rx="13"
            fill="#333840"
            stroke="#0002"
          />
          <rect
            x="7"
            y="10"
            width="50"
            height="44"
            rx="4"
            fill="#111317"
            stroke="#777"
            strokeWidth=".7"
          />
          <path
            d="m15 23 8 7-8 7m12 1h13"
            fill="none"
            stroke="#f7f7fa"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}
