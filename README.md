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
```

Use a Node version supported by Vite 7 (the existing Vercel project uses Node 26). `npm run check` runs TypeScript, unit tests, and a production build. Browser tests cover desktop Chrome and Android-sized Chrome. For an installed system browser, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`. Tests intentionally clear WhatsApp configuration to exercise the contact fallback; production uses the configured business number.

## Supplied assets and price sheet

See [asset inventory](assets/README.md), [manifest](assets/manifest.json), and [transcribed price sheet](assets/pricelist.json). The WhatsApp archive contains 50 unique photos (each supplied twice), one logo, and one price sheet. Original JPEGs are preserved outside `public/`; only web derivatives are deployed. A repeatable Pillow importer lives in `scripts/import-assets.py`.

The supplied logo is displayed in the header and footer. Five reference galleries include original photos alongside labeled illustrations. REF-D03 retains its illustration because the exact layout is not established in the supplied photos.

The price sheet names three machine families and 14 variants. The old six REF entries describe generic configurations and do not yet map to those variants. Their prices remain null and no stock is asserted. The next development milestone is to replace these generic entries with the sourced family/variant structure; see [development and 3D roadmap](docs/DEVELOPMENT-PLAN.md).

## Content and media

- `src/data/products.ts`: existing reference catalog, galleries, variant preferences and status fields.
- `src/data/site.ts`: services, FAQ and process copy.
- `src/i18n/en-*.ts`: English translations; preserve IDs, slugs and enum values.
- `src/components/MachineViewer.tsx`: lazy 3D engine with schematic components, keyboard controls, PNG export, fullscreen and WebGL fallback.
- `public/models/`: future GLBs; `models/source/`: Blender sources.

`gallery.kind` distinguishes original photos from illustrations. `modelGLB` remains null: existing interactive models are schematic approximations, not machine-specific reconstructions. Do not mark geometry verified until measured references and approval are recorded. Availability, dimensions, capacity, material grades, and policy details remain unconfirmed where absent from the supplied evidence.

## Environment and Vercel

- `VITE_WHATSAPP_NUMBER`: business number in international or Indonesian local format. Empty/invalid values use the contact/draft fallback. The supplied local configuration uses `6285315527000`; set it in Vercel before rebuilding, since the inspected live build had no WhatsApp links.
- `VITE_SITE_URL`: canonical origin. Empty values use the browser origin. Static robots and sitemap files currently use the observed deployment alias `https://hcbtech.vercel.app`; update these together if the domain changes.

Vercel framework: **Vite**; build: `npm run build`; output: `dist`. `vercel.json` rewrites extensionless routes for the SPA. Hashed build assets are immutable; stable image/model URLs are revalidated so replacing a product photo does not leave year-long stale copies. The 3D engine is a separate chunk loaded when a user opens its tab.

This is a client-rendered SPA. Per-route metadata and structured data are updated in the browser. Server-rendered product HTML, social previews, and true HTTP 404 responses belong to the planned rendering refactor.

## Review

[Debug and review report](docs/REVIEW.md) records the baseline findings, fixes, verification and remaining limitations. The supplied source zip is the project baseline; the GitHub repository was empty when inspected. Local environment files, dependencies, test artifacts and build output are excluded from version control.
