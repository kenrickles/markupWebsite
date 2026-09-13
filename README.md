# Kenrick Tan · Portfolio

A static Next.js portfolio for kenrickles.com, with GSAP/Lenis motion, dark and light themes, a command palette, an interactive simulated terminal, case studies, and a printable résumé.

## Run locally

Use Node 22 (`nvm use`), then:

```sh
npm ci
npm run dev
```

## Validate and preview the production export

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

Open http://127.0.0.1:3000. `npm start` serves the static `out/` export; this app does not require a Next.js server. On Netlify or another static host, use `npm run build` and publish `out/`.

The default URL is https://kenrickles.com with no base path. For GitHub Pages project hosting, use matching settings at build and preview time:

```sh
NEXT_PUBLIC_BASE_PATH=/markupWebsite NEXT_PUBLIC_SITE_URL=https://kenrickles.github.io/markupWebsite npm run build
NEXT_PUBLIC_BASE_PATH=/markupWebsite npm start
```

This configuration does not change DNS, configure a custom domain, or deploy automatically.

## Browser regression checks

```sh
npx playwright install chromium
npm test
```

Build first. Tests start their own preview on port 3100. To test a subpath build, use the same `NEXT_PUBLIC_BASE_PATH` value for `npm test` that was used for the build. The pull-request workflow builds both the root-domain and `/markupWebsite` variants on Node 22. It checks mobile and desktop navigation, asset loading, terminal behavior, theme persistence, blocked storage, reduced motion, keyboard focus, and HTML without JavaScript. Screenshots and traces are uploaded as workflow artifacts.

## Controls

- Command palette: the navigation search button, Ctrl/Cmd+K, or `/` outside a text field.
- Terminal: “Open terminal” or Ctrl/Cmd+backtick. It is a local simulation, with no backend, credentials, or real infrastructure access.
- Terminal commands: `help`, `whoami`, `kubectl get pods`, `theme light`, `theme dark`, `open resume`, `clear`, `exit`.
- Terminal history uses ↑/↓. Tab completes a nonempty command; Shift+Tab or Tab on an empty field moves focus normally.
- Résumé: `/resume/`, with Print / Save as PDF using the browser's print dialog.
- `?static=1` disables decorative animation for review. It does not disable terminal or palette functionality. Reduced-motion changes are also honored during a visit.
- `?theme=light` or `?theme=dark` previews an appearance. Explicit theme changes are saved if browser storage is available; storage failures do not block the app.

## Content and architecture

- `src/lib/profile.ts`: career, education, and credentials; shared by the homepage and résumé.
- `src/lib/caseStudies.ts`: existing case-study content and outcome claims, retained from the repository without independent validation.
- `src/lib/site.ts`: canonical URL and public asset paths.
- `ThemeProvider`: shared state used by navigation, palette, and terminal. Theme is applied before paint; only explicit user changes write preferences.
- `Modal`: native dialogs supply focus containment, Escape handling, and background inertness. Scroll locks also suspend Lenis while dialogs are open.
- `useStaticMode`: live reduced-motion/static-mode subscription. Content is server rendered and remains available without JavaScript.

The site retains the existing Ember & Ink / Daylight Ops design, with corrected shared surface colors, mobile controls, and animation cleanup. React Strict Mode is enabled. Unused boot-gate/cursor implementations and the unused Framer Motion dependency have been removed. React Bits attribution is in `THIRD_PARTY_NOTICES.md`.
