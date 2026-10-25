# Kenrick Tan · macOS portfolio

The homepage adapts Vanessa Li’s macOS desktop reference into a portfolio with Apple-style SVG app icons, native system typography, a Notes reader, Apple menu, appearance controls, dock magnification, desktop folders, and a printable résumé. It reuses the reference SVG artwork and wallpaper, with attribution in THIRD_PARTY_NOTICES.md. The full source analysis and implementation decisions are in [docs/desktop-reference-review.md](docs/desktop-reference-review.md).

Professional content lives in `src/lib/profile.ts` and `src/lib/recoveredProfile.ts`. The original Hugo content has been recovered from `Gmar1289/personalSite` at commit `b0a70ff3b1c44ddf02b26b6f88e10b4b80f33802`; Galaxy and later engineering roles are retained. See [docs/recovered-content.md](docs/recovered-content.md) for source links and reconciliation details.

Selected Work and the former case-study pages have been removed. Messages is a separate window with fictional Kenrick/AI-agent conversations, clickable threads, compact navigation, and normal window controls. Its scripted copy lives in `src/lib/agentConversations.ts`.

Desktop windows support dragging, corner resizing, zoom, and close/minimize. Compact windows switch between a searchable notes list and reader. All dock items have useful actions. The menu bar clock uses Singapore time. Reduced motion and blocked storage are supported.

## Development and verification

Use Node 22. Run `npm ci`, `npm run dev`, `npm run typecheck`, and `npm run build`. Output is the static `out/` directory. `npm start` serves that export. `npm test` runs the browser regression suite after building; the PR workflow checks both the root domain and `/markupWebsite` base path.

The printable résumé remains at `/resume/`; former case-study URLs now return 404. To build for a project path, set `NEXT_PUBLIC_BASE_PATH=/markupWebsite` and the matching `NEXT_PUBLIC_SITE_URL` during both build and test.
