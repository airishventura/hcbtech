# HCBTECH machinery catalog

React 19 + TypeScript + Vite 7, with Indonesian/English content, catalog filtering and comparison, quotation drafts, WhatsApp handoff, and an on-demand Three.js viewer.

## Run and verify

```sh
npm ci
cp .env.example .env.local
npm run dev
npm run check
npx playwright install chromium
npm run test:browser
npm run test:production
```

Use a Node version supported by Vite 7 (the existing Vercel project uses Node 26). `npm run check` runs TypeScript, unit tests, and a production build. Browser tests cover desktop Chrome and Android-sized Chrome. For an installed system browser, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`. Tests intentionally clear WhatsApp configuration to exercise the contact fallback; production uses the configured business number.

## Supplied assets and price sheet

See [asset inventory](assets/README.md), [manifest](assets/manifest.json), and [transcribed price sheet](assets/pricelist.json). The WhatsApp archive contains 50 unique photos (each supplied twice), one logo, and one price sheet. Original JPEGs are preserved outside `public/`; only web derivatives are deployed. A repeatable Pillow importer lives in `scripts/import-assets.py`.

The supplied logo is displayed in the header and footer. Ten full-frame WebP photo derivatives cover the current family galleries and workshop introduction. The six old REF pages remain accessible for existing links, are marked archived and noindex, and retain their reference content.

The current catalog publishes three machine families and all 14 variants from the owner’s sheet. Prices retain their PRICE IDs and are labeled references requiring reconfirmation. Missing drive details, stock, exact photo-to-variant matches and measurements remain unconfirmed. See the [release record](docs/RELEASE-2026-11-22.md) and [development and 3D roadmap](docs/DEVELOPMENT-PLAN.md).

## Latest visual update

The original hero headline and immersive machinery composition are restored with improved illustrative artwork. Header/footer use the transparent logo; a full-resolution PNG is downloadable from `/brand/hcbtech-transparent.png`. [Artwork sources and prompts](docs/HERO-ARTWORK.md) and [next phases](docs/NEXT-PHASES.md) document the update and remaining work.

## Content and media

- `src/data/products.ts`: current family catalog, sourced variants, galleries and verification fields. Legacy entries live separately in `src/data/legacy-products.ts`.
- `src/data/site.ts`: services, FAQ and process copy.
- `src/i18n/en-*.ts`: English translations; preserve IDs, slugs and enum values.
- `src/components/MachineViewer.tsx`: lazy 3D engine with schematic components, keyboard controls, PNG export, fullscreen and WebGL fallback.
- `public/models/`: three exterior GLB pilots; `models/pilots.json`: provenance and size registry; `scripts/build-pilot-models.mjs`: editable procedural sources. `models/source/` reserves future measured Blender sources.

`gallery.kind` distinguishes original photos from illustrations. Current family GLBs are photo-based exterior approximations without measured scale or exact variant mapping. Rebuild them with `node scripts/build-pilot-models.mjs`. Do not mark geometry verified until measured references and approval are recorded. Availability, dimensions, capacity, material grades, and policy details remain unconfirmed where absent from the supplied evidence.

## Environment and Vercel

- `VITE_WHATSAPP_NUMBER`: business number in international or Indonesian local format. Empty/invalid values use the contact/draft fallback. Production and preview are configured with the supplied business number `6285315527000`.
- `VITE_SITE_URL`: canonical origin. Empty values use the browser origin. Static robots and sitemap files currently use the observed deployment alias `https://hcbtech.vercel.app`; update these together if the domain changes.

Vercel framework: **Vite**; build: `npm run build`; output: `dist`. `vercel.json` selects prerendered routes and variant/language queries. Hashed build assets are immutable; stable image/model URLs are revalidated so replacing a product photo does not leave year-long stale copies. The 3D engine is a separate chunk loaded when a user opens its tab. English translations and the photo lightbox also load on demand.

The catalog is prerendered at build time into 58 Indonesian/English route and selected-variant pages. Product HTML, social metadata and JSON-LD are server-readable; the browser then mounts the interactive app. Vercel returns real HTTP 404 responses for unknown paths. `npm run preview` serves the generated route manifest locally, including English and variant query selection. See [phase 3](docs/PHASE-3.md).

## Review

[Debug and review report](docs/REVIEW.md) records the baseline findings, fixes, verification and remaining limitations. The supplied source zip is the project baseline; the GitHub repository was empty when inspected. Local environment files, dependencies, test artifacts and build output are excluded from version control.
