# Floating navigation and footer validation

Scope: the two owner-selected Framer components, their shared layout integration, hero clearance and footer signature. Catalog facts, prices and models are outside this change.

- TypeScript and client/server production builds pass. All 58 localized HTML pages are prerendered successfully.
- 32 unit tests pass.
- 46 browser regression tests pass; four desktop cases intentionally skip mobile-only behavior. Coverage includes inquiry drafts, comparison, keyboard controls, mobile focus containment/restoration, localization, media and the existing 3D workflow.
- 24 built-production checks pass on desktop Chromium and emulated Pixel 5. These include scroll-reveal/reset, deferred Dotmark initialization, reduced-motion static output, recovery from a blocked optional chunk, no-JavaScript navigation/wordmark, localized metadata and selected variants, real HTTP 404 responses, lightbox focus and initial-network exclusions.
- Inspected layout at 320, 390, 768, 1024, 1308 and 1920 px. No horizontal overflow or page runtime errors were observed. The wordmark reserves its height and the fixed WhatsApp shortcut yields to footer content.
- Scoped axe scans of the desktop and mobile footer/navigation states report zero WCAG A/AA violations. This is a scoped automated check, not a complete accessibility certification.

The initial application chunk is 461.79 KB (149.92 KB gzip). The 30.17 KB Dotmark chunk (12.22 KB gzip) is loaded near the footer and excluded entirely in reduced-motion mode. The existing optional Three.js viewer remains separate. No Framer editor runtime or new package dependency was added.

The first simultaneous browser runs exhausted available VM memory and timed out. They were stopped and rerun sequentially; the completed passing runs are the results above. Physical phone hardware, Safari touch behavior, manual screen-reader operation and field performance remain unverified on this cloud VM.
