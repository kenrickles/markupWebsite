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

## Desktop applications

Safari opens on Overview and contains the professional profile, experience, projects and résumé. Notes is reserved for published writing. Reminders displays a read-only public roadmap, while Finder holds personally curated recommendations. Terminal can open each application with `projects`, `writing`, `roadmap`, `tools`, and `open resume`.

- Write Markdown in `content/writing/`. See its README for metadata and publishing instructions. Only `status: published` reaches the website; drafts remain visible in this public repository.
- Maintain aspirations in `src/lib/roadmap.ts` and recommendations in `src/lib/recommendations.ts`. No recommendations have been invented for the initial release.
- Published writing gets a standalone `/writing/<slug>/` page, a Notes reader view, and a sitemap entry. The desktop automatically highlights the newest published piece.
- `/resume/` and Safari share `ResumeContent.tsx`. A committed PDF lives at `public/kenrick-tan-resume.pdf`. Refresh it when profile data changes:

```bash
node scripts/export-resume-data.mjs > /tmp/kenrick-resume.json
python3 scripts/generate-resume-pdf.py /tmp/kenrick-resume.json public/kenrick-tan-resume.pdf
```

PDF generation requires Python `reportlab` and DejaVu Sans fonts (paths are specified in the generator). Normal site builds do not require Python. Review the PDF after refreshing it.

Deep links such as `/#safari/experience`, `/#notes`, `/#reminders` and `/#finder` open the corresponding application. Existing `#about`, `#experience`, `#education`, `#projects` and `#contact` links remain accepted.
