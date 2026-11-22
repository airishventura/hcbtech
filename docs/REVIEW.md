# HCBTECH debug and review

Current status: this report records the initial baseline. The [22 November release](RELEASE-2026-11-22.md) supersedes its open catalog, contact, route-splitting and comparison-focus findings. Rendering/SEO, actual-device performance and measured variant models remain open.


Reviewed 21 November 2026 against the supplied source zip and the existing Vercel deployment. The review follows the buyer story: browse a configuration → choose a drive → inspect photos/3D → create a quotation request → hand off to WhatsApp or save a draft.

## Existing production

- Project: `hcbtech` / `prj_hvVw450X4o1U2hx0QvMglqh4GKXe`.
- Team: `team_rZgbsCD4lHIpfo1ieWAAksXw`.
- Alias: [hcbtech.vercel.app](https://hcbtech.vercel.app).
- Deployment: `dpl_FS8NY3YJMXwtbieow4ahLCrqLTHY`; Vercel reports **READY**, production, framework Vite, source **drop**. The current deployment is not evidence of a Git-connected release pipeline.
- Six routes (`/`, `/mesin`, one product deep link, `/bengkel`, `/tentang`, `/kontak`) returned HTTP 200 and rendered the expected headings. No page JavaScript exceptions were observed and no loaded product images were broken.
- A deep product visit requested `/mesin/favicon.svg`, returning 404.
- No `wa.me` links were present on the inspected routes. The site uses its contact/draft fallback; configure `VITE_WHATSAPP_NUMBER=6285315527000` in the intended Vercel environment and rebuild for direct WhatsApp handoff.
- Vercel returned no error/fatal runtime records in the inspected 30-minute window. This is a static SPA, so an empty function-log window does not establish client health; the browser checks above are the client evidence.

No production release or protection-setting change was performed in this work. The reviewed source and assets are delivered to the requested GitHub repository. The existing production build continues to serve until a release is made.

## Fixed in the delivered source

| Finding | Result |
| --- | --- |
| Single-file packaging inlined the 3D engine into every first page load | Removed the single-file plugin. Production browser requests confirm the viewer chunk is requested only after opening 3D. Default absolute asset URLs also fix the deep-route favicon path. |
| Language toggle could revert from Indonesian back to the stale English URL | Prevented URL synchronization from overwriting a pending language selection. The existing browser language round-trip now passes on desktop and mobile. |
| Rapid search after filter reset could retain stale URL filters | Catalog updates use the latest pending URL parameters. Reset → search passes in the mobile flow. |
| OrbitControls overwrote touch behavior and blocked scrolling before activation | Connected controls to the canvas explicitly and synchronized its touch mode. A Chromium touch swipe scrolls the page while locked and rotates without page scrolling when activated. |
| Three baseline unit tests failed | Filled missing English data translations and corrected a test variable scoped inside the wrong describe block. |
| Dependency audit flagged Vite and esbuild | Patched Vite within major 7 and refreshed the lockfile; final `npm audit` reports zero known vulnerabilities. |
| Generic logo and illustration-only reference media | Added the supplied logo and five full-frame optimized original photos. Corrected Workshop labels so original photos are not called illustrations. |
| PNG illustrations totaled about 10.6 MB | Converted the six existing illustrations to WebP; public image assets now total about 1.5 MB including the five original-photo derivatives. Original owner JPEGs remain unchanged outside the deployment directory. |
| Stable image paths cached as immutable for a year | Reserved immutable caching for hashed `/assets/` files; stable image/brand/model URLs revalidate. |
| Robots and sitemaps used a placeholder domain | Updated them to the observed Vercel production alias. Domain changes still require matching updates. |
| Unknown routes were marked indexable | Client-rendered not-found pages now emit `noindex,follow`. True HTTP 404 responses require the planned rendering change. |
| Mobile menu focus could escape behind the overlay | Added dialog semantics, focus wrapping, focus restoration, and contained scrolling. Added browser checks. Contact fields now also have stable form names. |

Original photos, generated illustrations and schematic 3D retain distinct labels. The six reference entries still have unconfirmed model names and prices: the supplied price sheet's 14 variants cannot safely be assigned to those generic entries without mapping.

## Verification

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `npm test` | 27 passed in 5 files |
| `npm run build` | Pass, Vite 7.3.8 |
| Desktop + Android browser suite | 34 passed; 4 desktop cases intentionally skipped because they test mobile-only behavior |
| `npm audit` | 0 known vulnerabilities |
| Original-file integrity | All 52 unique originals match their recorded SHA-256 hashes; manifest accounts for all 102 source files |
| Product media paths | Every poster/gallery file resolves locally |
| Production-build browser flow | Original photos/logo, deferred 3D chunk, correct business WhatsApp number and selected machine/drive, no JavaScript errors or HTTP error responses observed |
| Mobile touch gesture on built viewer | Inactive viewer: page scrolled 90 px; active rotation: page scroll delta 0 px |
| Existing conversion/resilience checks | Filters/search/sort, comparison, ID/EN round-trip, keyboard tabs/menu, no-WebGL fallback, blocked localStorage, quotation drafts, and PNG export pass |

Baseline built HTML was about **1,762 kB** (507 kB gzip) with all code inline. The updated shell is about **1.84 kB**, with about **602 kB** initial JavaScript (189 kB gzip), **44 kB** CSS (9 kB gzip), and a separate **1,114 kB** viewer chunk (308 kB gzip). These are file sizes, not measured Core Web Vitals. Vite still warns about large chunks; route splitting and measurement remain in the plan.

## Remaining review findings and next work

1. **Catalog model — high priority:** the price sheet has three families and 14 variants, while the UI has six generic configurations and lacks a milk-press family. Map source photos, actual models, drive variants, prices and inquiry IDs before publishing prices. See [asset inventory](../assets/README.md) and [roadmap](DEVELOPMENT-PLAN.md).
2. **3D content — high priority:** there are two reused schematic assemblies and no supplied GLBs. Machine-specific reconstruction needs exact photo/variant associations and dimensions. The roadmap tracks every price-sheet variant; current schematics are not those final models.
3. **Production contact setup — high priority:** set the business WhatsApp build variable in Vercel and validate a rebuilt deployment. The local production-build handoff is verified; the existing live build remains on its fallback.
4. **Rendering/SEO — medium priority:** metadata and Product/FAQ schemas are still generated in JavaScript; social crawlers may receive only the generic HTML shell. Unknown routes still return SPA HTTP 200. Use prerendered routes or server rendering during the planned refactor.
5. **Accessibility — medium priority:** extend focus containment/restoration to the comparison dialog; its current close/Escape behavior passes, but keyboard focus wrapping is not implemented there. Complete a manual contrast, screen-reader, reduced-motion and real-device pass before claiming a full accessibility audit.
6. **Performance — medium priority:** split noncritical route code, review the viewer chunk and large translation dictionaries, and measure on an actual low-end Android device. The current automated mobile checks use Chromium emulation.
7. **Brand/content — planned:** the supplied standalone logo differs from the blue/yellow logo in the price sheet. Confirm the governing identity before a full restyle. Reduce repetitive provisional-content messaging once the actual catalog is mapped.

UI review reference: [Vercel Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). This review is scoped to the inspected source and flows; it is not a claim of complete security, accessibility, or engineering certification.
