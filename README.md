# Kenrick Tan | Portfolio

Personal website and interactive portfolio for Kenrick Tan, Protocol Engineer at Galaxy Digital.

The site brings together my background, experience, writing, and ways to get in touch through an interactive desktop interface.

## Features

- Interactive desktop with movable, resizable application windows and a dock
- About, experience, and education content maintained in one place
- Notes reader and Messages conversations
- Browser-based terminal for exploring the portfolio using familiar commands
- Printable résumé
- Responsive layouts, keyboard controls, and reduced-motion support
- Static export for straightforward hosting

### Terminal

Open Terminal from the dock or press `Cmd/Ctrl + \``.

Try `help`, `ls`, `whoami`, `cd experience`, `cat 01-galaxy-digital.md`, or `cat ~/principles.md`. Use `open` to navigate to supported apps and links.

The terminal runs entirely in the browser. It does not execute shell commands on a server or access the visitor's local filesystem. Command history and the active session remain available while the page is open and reset on reload.

## Tech stack

- Next.js 16 and React 19
- TypeScript
- Tailwind CSS
- GSAP and Lenis
- Lucide icons
- Playwright for browser tests

## Getting started

Requires Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev        # Start the development server
npm run typecheck  # Check TypeScript
npm run lint       # Run ESLint
npm run build      # Build the static site
npm start          # Serve the exported site
npm test           # Run Playwright tests
```

The production build is exported to `out/`. Run the build before running the browser test suite.

To deploy under a subpath, set `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL` for the build and tests.

## Project structure

- `src/app/` — pages and global styles
- `src/components/` — interactive application windows and UI
- `src/lib/profile.ts` — professional profile data
- `src/lib/introduction.ts` — personal introduction
- `src/lib/terminal.ts` — terminal commands and virtual filesystem
- `src/lib/agentConversations.ts` — Messages content
- `public/` — static assets
- `tests/` — browser regression tests

## License and attribution

This is a personal portfolio project. Third-party asset and dependency notices are documented in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
