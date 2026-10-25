# Kenrick Tan · macOS portfolio

The homepage adapts Vanessa Li’s macOS desktop reference into a portfolio with Apple-style SVG app icons, native system typography, a Notes reader, Apple menu, appearance controls, dock magnification, desktop folders, and a printable résumé. It reuses the reference SVG artwork and wallpaper, with attribution in THIRD_PARTY_NOTICES.md. The full source analysis and implementation decisions are in [docs/desktop-reference-review.md](docs/desktop-reference-review.md).

Professional content remains separate in `src/lib/profile.ts`, `src/lib/caseStudies.ts`, and `src/components/PortfolioNoteContent.tsx`. Galaxy Digital is included. The supplied `kenrickles/Loveit` repository contains the theme/demo rather than personal Hugo content, so its placeholders were not imported. Existing project data is retained without adding outcome claims.

Desktop windows support dragging, corner resizing, zoom, and close/minimize. Compact windows switch between a searchable notes list and reader. All dock items have useful actions. The menu bar clock uses Singapore time. Reduced motion and blocked storage are supported.

## Development and verification

Use Node 22. Run `npm ci`, `npm run dev`, `npm run typecheck`, and `npm run build`. Output is the static `out/` directory. `npm start` serves that export. `npm test` runs the browser regression suite after building; the PR workflow checks both the root domain and `/markupWebsite` base path.

Existing résumé and case-study routes remain available. To build for a project path, set `NEXT_PUBLIC_BASE_PATH=/markupWebsite` and the matching `NEXT_PUBLIC_SITE_URL` during both build and test.
