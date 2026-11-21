# HCBTECH development and 3D plan

Prepared from the supplied project, 50 unique machine/workshop photos, logo, and price sheet on 21 November 2026. Archive text is evidence, not authorization to change deployment targets or project scope.

## 1. Establish the real catalog

The current six REF products describe layouts, while the supplied sheet names **Mesin Parut Kelapa**, **Mesin Kupas Batok Kelapa**, and **Mesin Peras Santan**. There is no coconut milk press family in the current UI. Do this mapping before redesigning the catalog or attaching price amounts to old REF entries.

Use `assets/pricelist.json` as the transcription baseline. Confirm the exact unit represented in each photo, official model names/SKUs, current price/currency/tax scope, included drive/accessories, and stock or made-to-order status. Leave the blank drive for “Ampar tanpa kaki” unanswered until confirmed. Check “Stihl Bensin,” “Genset 13 PK,” and “General” against the intended component labels. The sheet has no effective date and asks buyers to reconfirm prices before ordering.

Create separate records for family, physical model, sellable drive variant, media source, and model verification. Keep prices with their source and effective date. Preserve old routes using explicit redirects to approved replacements; preserve inquiry context and language. The three cabinet photos and three roller photos stay unassigned to a sellable model until identified.

Acceptance: every published variant has a specific source, correctly labeled photo, valid inquiry payload, and approved model/price mapping; no duplicate products solely to show another camera angle.

## 2. Build machine-specific 3D models

The existing viewer offers **two generic schematic assemblies**, reused across six references. There are no supplied GLBs, CAD files or Blender sources. These are not the final 3D models of each machine.

Start with a pilot for one clearly photographed standing shell peeler and one standing grater, then a milk press. Confirm their variant IDs before modeling. Iterate the photo comparison and viewer pipeline once, then work through every row below. Shared chassis and drive meshes may be reused only after their dimensions and mounting layouts are confirmed.

| Price reference | Family | Variant on supplied sheet | Required model status |
| --- | --- | --- | --- |
| PRICE-01 | Grater | Mini / Dinamo 1 PK | Reference mapping + measurements needed |
| PRICE-02 | Grater | Berdiri / Dinamo 1 PK | Reference mapping + measurements needed |
| PRICE-03 | Grater | Berdiri / Dinamo 2 PK | Reference mapping + measurements needed |
| PRICE-04 | Grater | Berdiri / Stihl Bensin | Reference mapping + measurements needed |
| PRICE-05 | Grater | Jumbo / Genset 13 PK | Reference mapping + measurements needed |
| PRICE-06 | Shell peeler | Ampar tanpa kaki / drive unspecified | Drive + geometry needed |
| PRICE-07 | Shell peeler | Duduk / Dinamo | Reference mapping + measurements needed |
| PRICE-08 | Shell peeler | Duduk / Bensin | Reference mapping + measurements needed |
| PRICE-09 | Shell peeler | Berdiri / Dinamo | Reference mapping + measurements needed |
| PRICE-10 | Shell peeler | Berdiri / Bensin | Reference mapping + measurements needed |
| PRICE-11 | Milk press | Mini A10 / General | Reference mapping + measurements needed |
| PRICE-12 | Milk press | A11 / Honda GP160 | Reference mapping + measurements needed |
| PRICE-13 | Milk press | A22 / Honda GP160 | Reference mapping + measurements needed |
| PRICE-14 | Milk press | A33 / Honda GP200 | Reference mapping + measurements needed |

For each model, collect front/back/left/right/top and three-quarter views with a scale reference, overall width/depth/height, chassis profiles, work height, main housing/roller dimensions, and drive mounting dimensions. A component nameplate or owner specification is needed to distinguish visually similar drive variants. Photos alone can support an explicitly labeled visual approximation; they cannot establish scale or hidden mechanisms.

Deliverables per approved model:

- Editable `.blend` source under `models/source/<model-id>/`, with a measurement/source sheet.
- GLB under `public/models/<model-id>-<revision>.glb`, plus a matching poster and model registry entry.
- Separate named external assemblies for frame, drive, gearbox/shaft, housing/hopper, chute, and guards where actually visible. Do not invent internal cutting/pressing mechanisms or an operating animation.
- Meter units, consistent orientation, sensible origin, applied transforms, efficient materials, and a target GLB size below 3 MB where practical.
- Comparison renders from the source-photo angles and a signed-off geometry checklist. Record approximation/geometry-verified status independently of product availability or performance.

Viewer acceptance: correct per-product model and drive selection; loading/error/context-loss states; touch scrolling before activation, orbit after activation, bounded zoom, keyboard and reset, fullscreen, and PNG export. Validate the current GLB normalization/hotspot coordinate system on the first pilot before declaring the pipeline ready. Verify a low-end Android device in addition to desktop browser emulation.

The prior [Blender pipeline](../public/docs/blender-pipeline.md) provides supporting detail. The source/variant mapping above takes precedence over its old generic REF examples.

## 3. Refactor the website around buyers' tasks

Keep the current React/TypeScript components and inquiry logic while introducing the sourced catalog model. First reshape navigation and content around **Parut kelapa / Kupas batok / Peras santan**. Show original photos first, a clear variant picker, sourced pricing with reconfirmation wording, compact confirmed specifications, and one primary quotation action. Offer 3D as optional supporting media.

Reduce repeated “unconfirmed” editorial copy in the buying flow; put detailed evidence status near specifications and media. Use supplied workshop photography for workshop context. Agree whether the standalone red/silver logo or the blue/yellow price-sheet identity governs the design before a full restyle.

Extract catalog URL-state updates, dialogs/focus handling, and the contact draft into focused hooks/components. Move translations toward stable message keys and typed per-language records. Route-split noncritical pages, then measure bundle cost rather than adding arbitrary chunk exclusions. The Three.js engine already loads separately in this stabilization pass.

Choose rendering deliberately: keep Vite with prerendered product routes if the catalog stays static, or migrate to Next.js App Router if server content, CMS editing or more dynamic commerce is needed. Preserve route/query semantics, language alternates, factual JSON-LD and contact fallbacks. Require server-readable product metadata, share cards and correct 404 status in that milestone.

## 4. Release and validate

Use a review branch and a Vercel preview for the catalog/3D refactor. Check the complete buyer flow: family → model/drive → correct photo/3D → quotation draft → correct WhatsApp URL. Opening WhatsApp is a handoff; it must not claim a message was automatically sent.

Gate a release on TypeScript, unit/media-integrity tests, desktop/mobile browser flows, asset budgets, keyboard/focus checks, deep links, metadata, and manually checked commercial content. Confirm the Vercel project/team, Git connection, production branch and tested commit before a production release. The currently observed production deployment was uploaded using Vercel's drop source, so a Git push alone is not evidence of a production update.
