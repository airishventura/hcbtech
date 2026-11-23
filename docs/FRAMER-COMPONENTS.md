# Supplied Framer components

These components were explicitly selected by the site owner for the navigation and footer. Their public published modules were inspected and adapted to this React/Vite application. No Framer editor runtime or remote executable imports are shipped to visitors.

| Component | Source | Integration |
| --- | --- | --- |
| Floating Pill Navigation | [Owner-supplied import](https://framer.com/m/FloatingPillNavigation-s92k8M.js@qwsogf78G8HhJg4I53jE), [published module](https://framerusercontent.com/modules/rl7d7Vf87QGDeF4IBjBw/qwsogf78G8HhJg4I53jE/FloatingPillNavigation.js) | `src/components/FloatingPillNavigation.tsx` retains its spring-driven shared active pill. Native localized router links replace clickable divs; CSS provides rounded geometry without a resize observer. Active state follows the route, with a unique layout ID per navigation instance. |
| Dotmark v1.0.2 by KOJA Studios | [Owner-supplied import](https://framer.com/m/Dotmark-KeHZq0.js@tJucaP7QZZsW6WjTP5iO), [published module](https://framerusercontent.com/modules/PKLhlF60i62Wo7plljF3/tJucaP7QZZsW6WjTP5iO/Dotmark.js) | `src/components/FramerDotmark.tsx` preserves the published renderer, WebGL/2D/SVG fallbacks, visibility observer and teardown. Framer property controls and editor detection are removed. The vendor module is marked `@ts-nocheck`; the application wrapper is typed. |

The header is transparent at the top. After 48 px of scrolling its inset glass surface reveals over 220 ms. Links and the mobile menu remain available before scrolling. The home hero artwork extends behind the transparent header. Internal pages retain dark controls on their light background. The floating WhatsApp shortcut yields when the footer enters view, keeping its contact controls and wordmark unobstructed.

`FooterWordmark.tsx` reserves the wordmark's dimensions and initially serves a dotted SVG in prerendered HTML. Dotmark is imported within 400 px of the footer; it runs only while visible and settles at rest. Ambient swirl is off. Reduced-motion visitors retain the static SVG and do not initialize a canvas. The artwork is decorative with a single accessible HCBTECH text label. Rendering it does not depend on third-party requests.

The existing owner logo, catalog data and product models are unchanged by this integration.
