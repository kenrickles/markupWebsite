# Kenrick Tan · macOS portfolio

The homepage adapts Vanessa Li’s macOS desktop reference into a portfolio with Apple-style SVG app icons, native system typography, a Notes reader, Apple menu, appearance controls, dock magnification, desktop folders, and a printable résumé. It reuses the reference SVG artwork and wallpaper, with attribution in THIRD_PARTY_NOTICES.md. The full source analysis and implementation decisions are in [docs/desktop-reference-review.md](docs/desktop-reference-review.md).

Professional content lives in `src/lib/profile.ts` and `src/lib/recoveredProfile.ts`; the user-written biography is shared from `src/lib/introduction.ts`. The original Hugo content has been recovered from `Gmar1289/personalSite` at commit `b0a70ff3b1c44ddf02b26b6f88e10b4b80f33802`; Galaxy and later engineering roles are retained. See [docs/recovered-content.md](docs/recovered-content.md) for source links and reconciliation details.

Selected Work and the former case-study pages have been removed. Messages is a separate window with fictional Kenrick/AI-agent conversations, clickable threads, compact navigation, and normal window controls. Its scripted copy lives in `src/lib/agentConversations.ts`.

Desktop windows support dragging, corner resizing, zoom, and close/minimize. Compact windows switch between a searchable notes list and reader. All dock items have useful actions. The menu bar clock uses Singapore time. Reduced motion and blocked storage are supported.

## Terminal

The dock and Cmd/Ctrl+backtick open one native desktop terminal. Its transcript, working directory, history and unfinished input survive closing or minimising the window during the page visit. The window supports dragging, corner resizing (including arrow keys), zoom and app focus switching.

The browser-local filesystem in `src/lib/terminal.ts` draws from the same profile and biography as Notes. Use `ls`, `cd experience`, `cat 01-galaxy-digital.md`, `cat ~/principles.md`, `whoami`, or `help`. `open messages`, `open experience` and the other listed targets open the corresponding app or link. `agent status`, `sudo ship` and `git blame` are fictional Easter eggs. No commands run on a server or access a visitor’s filesystem.

Tab completion follows the current command and directory; ambiguous matches are listed. Up/Down restores the draft after history browsing; Ctrl+C cancels input; Ctrl+L clears output. Mobile has tappable starter commands and a submit button, and the window adapts to the visible viewport when the software keyboard opens. The session resets on page reload.

## Development and verification

Use Node 22. Run `npm ci`, `npm run dev`, `npm run typecheck`, and `npm run build`. Output is the static `out/` directory. `npm start` serves that export. `npm test` runs the browser regression suite after building; the PR workflow checks both the root domain and `/markupWebsite` base path.

The printable résumé remains at `/resume/`; former case-study URLs now return 404. To build for a project path, set `NEXT_PUBLIC_BASE_PATH=/markupWebsite` and the matching `NEXT_PUBLIC_SITE_URL` during both build and test.
