# Interface review — phase 3

## Floating navigation and footer follow-up

| Location | Before | After | Why |
| --- | --- | --- | --- |
| Shared header | Opaque edge-to-edge rectangular bar | Transparent top state, inset glass capsule revealed on scroll, active spring pill | Implements the supplied Floating Pill Navigation while keeping links available immediately |
| Navigation interaction | Framer source uses clickable divs | Localized anchors, native modified clicks, route-driven `aria-current`, reduced-motion support | Preserves browser and keyboard behavior |
| Footer | Ends after the copyright row | Huge responsive HCBTECH Dotmark signature | Implements the owner's supplied footer component |
| Wordmark loading | Published renderer starts on mount | SVG in server HTML, reserved size, optional renderer near footer, static reduced-motion mode | Keeps the initial page lean and preserves a no-JavaScript signature |
| Footer contact | Fixed WhatsApp shortcut overlays bottom right | Shortcut yields while footer is visible | Keeps the large wordmark and footer controls unobstructed |

Manual browser inspection covers 320, 390, 768, 1024, 1308 and 1920 px widths with no horizontal overflow or runtime errors. Desktop and mobile scoped axe scans found no WCAG A/AA violations in the inspected footer/navigation states. Physical devices and manual screen-reader operation remain unverified. Component provenance and integration details are in [Framer components](FRAMER-COMPONENTS.md). Final regression results are recorded in [navigation validation](NAVIGATION-FOOTER-VALIDATION.md).

Mode: full review of the changed home family selector, product media, navigation, FAQ and shared controls. React 19 / Vite 7 with the established Tailwind and plain CSS system. This is a scoped interface review, not a claim of complete accessibility certification.

| Category | Evidence inspected | Result |
| --- | --- | --- |
| Typography | Home, catalog and product screenshots at desktop/mobile widths; price updates | Self-hosted fonts, balanced headings, tabular prices |
| Surfaces | Family preview and product-photo lightbox, selected variants | Owner images remain uncropped; structural borders retained |
| Animation | Image selection, photo arrows, dialog open/close, reduced motion | Routine entry reveals removed; keyboard changes are immediate |
| Icons | Lucide controls, touch targets, disclosure state | Existing icon family retained; 48 px shared controls |
| Performance | Build output, initial-network checks, English switch | English and optional viewers are deferred |

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| HIGH | `src/pages/Catalog.tsx`, `src/components/Reveal.tsx`, `src/components/PageElements.tsx` | Initial content hidden by entrance styles | Content visible in prerendered HTML | Pages must remain readable before scripts execute |
| HIGH | `src/components/ProductMedia.tsx` | Photo strip not keyboard-focusable | Labeled focusable gallery region | Keyboard users can reach scrollable photographs |
| HIGH | `src/components/Layout.tsx`, `src/index.css` | Low-opacity footer/navigation labels; red text below AA contrast on gray/dark surfaces | Higher label contrast and surface-appropriate accent text | Small labels remain readable |
| MEDIUM | `src/components/FramerProjectIndex.tsx` | Original component swaps focused row buttons for anchors and opens links in a new tab | Stable selection buttons and same-tab image link | Keyboard focus remains predictable |
| MEDIUM | `src/components/ProductMedia.tsx`, `src/components/PhotoLightbox.tsx` | Gallery inspection limited to inline images | Optional fullscreen lightbox, arrows and focus restoration | Inspect machine details without losing context |
| MEDIUM | `src/components/Faq.tsx` | JS-managed height animation | Native disclosure with restrained icon state | FAQ answers remain available without JS |
| LOW | `src/index.css` | Press feedback and numeric width inconsistent | Subtle press feedback; tabular changing prices | Controls acknowledge interaction without shifting text |

| Location | Candidate | Rejected because |
| --- | --- | --- |
| Home family index | Pointer-following images and autoplay | Distracts from comparing machines and adds repeated motion |
| Product gallery | Decorative fluid/distortion effect | Obscures the owner's machine photographs |
| Shared cards | New glass surfaces or large shadows | Conflicts with the existing industrial palette and structural borders |

Verification commands: `npm run check`, `npm run test:browser`, `npm run test:production`; scoped axe scans cover home, catalog, English milk press and contact. Browser checks include keyboard focus, native JavaScript-disabled content, narrow-screen layout, English navigation, correct inquiry payloads and deferred 3D. Exact results and any remaining findings are recorded in the phase-3 validation record.

Manual screen-reader use, physical Android hardware and Safari touch gestures are not verified on this cloud VM. The FAQ icon transition was inspected at 10% playback using the browser Animations API; the disclosure itself remains immediate. No new staged motion sequence was added. Hardware and screen-reader checks remain part of physical-device acceptance.

Final scoped automated results: 32 unit tests, 46 existing browser tests and 14 built-production cases passed. Axe found zero violations on the four scanned pages after correcting contrast and gallery focus. No actionable interface-polish findings remain in the inspected states. **Approve for the inspected web scope**, with physical hardware and screen-reader operation explicitly unverified. See [validation details](PHASE-3-VALIDATION.md).
