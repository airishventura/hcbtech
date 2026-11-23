# Phase 3 validation — 23 November 2026

| Check | Observed result |
| --- | --- |
| TypeScript, unit tests and production build | Pass; 32 unit tests |
| Existing desktop/Android browser suite | 46 passed, 4 intentional desktop skips for mobile-only cases |
| Built-production suite | 14 passed; raw HTML metadata, all 14 selected variants in both languages, true local 404s, JavaScript-disabled browsing, keyboard selection/focus and deferred network loads |
| Scoped axe WCAG A/AA checks | 0 violations on home, catalog, English selected milk press and English contact |
| Dependency audit | 0 known vulnerabilities |
| Initial JavaScript | 459.37 kB / 148.91 kB gzip, versus 532.18 / 170.75 kB previously |
| Optional viewers | English strings, 3D engine and lightbox absent from initial Indonesian network load |
| Static outputs | 58 localized HTML documents; 8 social PNGs at 1200 × 630 |
| Catalog/3D source data | No changes to product facts, source prices, variant mappings or model registry |

## Mobile lab measurement

Chromium emulation at 390 × 844, 4× CPU slowdown, 1.6 Mbps download and 150 ms latency. Three cold browser contexts against the local static server, with uncompressed responses. Largest-contentful paint: 2,580 / 2,576 / 2,568 ms; median **2,576 ms**. Cumulative layout shift was **0** in all three runs. DOMContentLoaded was approximately 5.1 seconds, showing that visible prerendered content arrives before the app finishes loading.

These are local lab observations, not real-user Core Web Vitals or measurements on physical hardware. The response compression, CDN, device and network of production differ. No field-data improvement is claimed from these numbers.

## Scope limits

Physical Android hardware, Safari touch gestures and manual screen-reader operation remain unverified. The optional viewer still produces a large-chunk warning and needs a physical-device performance pass. Prices and exact photo/variant confirmations remain deferred at the owner's request. The build now preserves selected source variants without JavaScript; interactive filtering, form drafting and 3D still require JavaScript.
