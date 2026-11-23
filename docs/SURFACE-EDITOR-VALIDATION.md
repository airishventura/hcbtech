# Surface and catalog-editor validation

23 November 2026, Jakarta. Scope: gradients, spacing/alignment, shared CTA/readability fixes, buyer continuity, and phase 4A owner catalog preparation. Further 3D development is paused until measurements arrive. Existing viewers were regression-tested, with no model or geometry edits.

- `npm run check`: TypeScript passes, 46 unit tests pass, and both production builds complete. All 60 localized route/variant HTML documents are prerendered.
- `npm run test:browser -- --workers=1`: 46 tests pass, with four desktop skips for mobile-only cases. Includes catalog filtering, comparison, inquiry drafts, localization, keyboard/focus behavior, media and existing viewer flows.
- `npm run test:production -- --workers=1`: 30 tests pass across desktop Chromium and emulated Pixel 5. New cases cover local draft recovery, unchanged buyer data, reviewed export and reimport, invalid revision rejection, noindex editor metadata, CTA foregrounds and mobile contact-page width. Existing checks cover selected variants, metadata, real 404s, no-JavaScript content, deferred chunks, photo focus, navigation and wordmark fallbacks.
- Manual visual checks cover catalog, workshop/social cards, contact and the English owner workbench at 320, 390 and 1308 px. No horizontal overflow or page runtime errors remain in the inspected states. The contact form's implicit grid track was corrected after the first visual pass found overflow; its final three-width rescan is clean.
- Scoped axe WCAG A/AA scans of those twelve page/viewport states report zero violations. This is scoped automated coverage, not a complete accessibility certification.
- CTA background/position transitions were inspected at 10% playback (250 ms source timing); the editor's keyboard focus indicator appears immediately as a solid 2 px outline. No new staged motion sequence was added.
- A final dark-section link check added an explicit light variant to the documentation CTA so its hover state retains contrast. The production CTA cases were rerun for this final change.
- Import integration tests check a real temporary project: check-only changes no files, valid apply writes both catalog/provenance files, and invalid input leaves the accepted data intact. A mocked reviewed revision also reaches buyer data, English copy, price source and inquiry text while preserving IDs, photos, dimensions and model scope.

The initial browser chunk is approximately 466 KB (152 KB gzip), with the 11 KB owner editor loaded separately. English, Dotmark, photo lightbox and Three.js remain optional. No new package dependency, server-side data store, authentication service, tracking or direct publishing endpoint is introduced.

The starter catalog revision is empty, so this release does not change source prices, stock, exact photo associations, technical specifications or model accuracy. Physical devices, Safari and manual screen-reader operation remain unverified. See [owner workflow](CATALOG-EDITING.md), [design direction](SURFACE-DESIGN.md) and [scoped interface review](SURFACE-EDITOR-REVIEW.md).

Verdict: approve for the inspected browser scope, with the physical-device and manual assistive-technology checks above outstanding. Direct authenticated publishing and media editing remain future phase-4 work.
