# Rendering, performance and interface release — 23 November 2026

The owner deferred phase 1. Prices, specifications, availability, exact photo-to-variant associations and the three approximate GLBs retain their existing data and verification status.

## Rendering and routing

Vite builds the browser application and a build-only server renderer. React renders the existing page components to 58 static HTML documents: fourteen routes plus a not-found page in Indonesian and English, and all fourteen selected variants in both languages. No server renderer or translation service runs at request time. `scripts/prerender.mjs` uses the same data, schemas and page components as the browser; the browser prepares its route and language before mounting interactive controls.

`vercel.json` serves exact English and variant-query documents, keeps canonical URLs at family level, and returns localized HTTP 404 responses for unknown paths. Old REF routes remain archived and noindex. Hashed assets retain immutable caching; stable media URLs revalidate. `scripts/preview.mjs` mirrors the production path/query behavior for local verification.

Pages include visible product content, source-price variants, canonical/hreflang metadata, social previews and JSON-LD before JavaScript loads. Variant links, quotation links, FAQ disclosures, English navigation and mobile fallback navigation remain usable without JavaScript. Search/filter controls, 3D and form drafting require JavaScript. Prerendered buttons and form controls stay disabled until React mounts their handlers, preventing an early tap from being lost; native links and FAQ disclosures remain available immediately. Browser-stored preferences apply after the interactive application starts; server HTML reflects the URL rather than private localStorage.

## Performance

English strings load on demand. Below-fold imagery loads lazily. The viewer and photo lightbox remain separate optional chunks. Space Grotesk and IBM Plex Mono are self-hosted Latin WOFF2 subsets with OFL licenses, removing the Google Fonts stylesheet request.

The previous release's initial JavaScript was 532.18 kB (170.75 kB gzip). This release is approximately 459 kB (149 kB gzip), about 14% smaller before compression and 13% smaller compressed. The 1,114 kB viewer remains deferred. Bundle sizes are not Core Web Vitals. See the [validation record](PHASE-3-VALIDATION.md) for emulated performance and the limits of that measurement.

Eight 1200 × 630 PNG cards cover home and three families in both languages. Original photographs remain labeled family references; the home illustration remains labeled as artwork. Regenerate cards with `scripts/build-social-cards.mjs` after a build and with the preview server running.

## Component sources and skills

Image Project Index by **felix strobel** is a free Framer Marketplace component: https://www.framer.com/marketplace/components/image-project-index/ . Its published import version is `https://framer.com/m/ImageProjectIndex-T4z66R.js@Fb4KdJe0VuhUdc5BuO8S`. The local adapter removes editor controls and stock demonstration content, uses owner imagery, localizes labels, keeps navigation in the same tab, provides stable keyboard focus targets and adds intrinsic image dimensions. The original listing's Limited license applies; this is an integration in HCBTECH, not a standalone component offering. Framer's React import workflow is documented at https://www.framer.com/help/articles/sharing-components/ .

Alloy Accordion and Switching Tabs Card were also evaluated. Repeating the family selector, adding pointer-following artwork or importing additional editor/runtime dependencies did not improve this buyer flow. A native photo lightbox provides fullscreen inspection, arrow keys, Escape, focus containment and focus restoration. FAQs use native disclosures; interactive feedback uses restrained, interruptible transitions.

Two skills were installed in the local Codex skill directory and read for this change:

- `emil-design-eng`, from `emilkowalski/skills`, commit `64eb3deb9a5fbfa041faf783e0bc3fd635872e9c`.
- `make-interfaces-feel-better`, from `jakubkrehel/make-interfaces-feel-better`, commit `6d9f2f1df10e8ce2ae1708598a73b0506fb98794`.

The existing Vercel Web Interface Guidelines were refreshed for review. No additional skills from the supplied list were installed.
