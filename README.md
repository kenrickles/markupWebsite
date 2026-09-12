# Kenrick Tan · Portfolio

Next.js App Router portfolio exported as static HTML for GitHub Pages. The redesign retains the four case-study routes and existing career / education content, updates the current role to Galaxy Digital, and adds GSAP + Lenis motion with an adapted React Bits spotlight.

## Development

```sh
npm ci
npm run dev
```

## Verify and build

```sh
npm run lint
npx tsc --noEmit
npm run build
```

The production export is in `out/`. The default production base path is `/kenrick-portfolio`. Serve the export under that path to test it; `next start` does not serve static exports. The existing GitHub Pages workflow deploys when changes reach `main`.

For a root-domain deployment, build with:

```sh
NEXT_PUBLIC_BASE_PATH='' NEXT_PUBLIC_SITE_URL=https://kenrickles.com npm run build
```

Configure that domain in the intended hosting service separately. Changing build variables alone does not change DNS or replace the current Hugo website.

## Content

- `src/lib/profile.ts`: career, education, credentials.
- `src/lib/caseStudies.ts`: existing case studies, including their pre-existing outcome claims. These metrics were retained from the repository and were not independently validated as part of the redesign.
- `src/lib/site.ts`: shared URL and asset-path configuration.
- `src/app/page.tsx`: homepage narrative and work cards.

## Motion and accessibility

GSAP coordinates the opening, section movement, and orbital motif. Lenis handles wheel scrolling and anchors on the homepage; native touch scrolling is retained. The shared effect cleans up tickers, listeners, and animations on navigation, and reacts to changes in reduced-motion preferences. Reduced motion skips both GSAP and Lenis. Content is server rendered and visible before enhancement; local Geist fonts remove external font-service requests. Links, mobile navigation, native experience disclosures, and architecture controls support keyboards. The operating-system cursor remains intact.

React Bits SpotlightCard is adapted locally with pointer and focus behavior. See `THIRD_PARTY_NOTICES.md`. Vanta is omitted: the SVG motif delivers the intended identity without a WebGL / Three.js background dependency. Existing Framer Motion remains declared to avoid unrelated dependency churn, but is no longer imported by the rendered pages.
