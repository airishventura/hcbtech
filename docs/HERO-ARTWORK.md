# Transparent logo and restored hero — 23 November 2026

The owner requested a transparent logo and the earlier hero with improved artwork. Built-in image generation was used for both assets. Originals are preserved.

## Files and integration

- `public/brand/hcbtech-transparent.png`: full-resolution RGBA cutout (1813 × 868); downloadable asset.
- `public/brand/hcbtech-transparent.webp`: optimized RGBA website logo (1000 × 479), around 147 kB. Alpha ranges from 0 to 255, with 46% fully transparent pixels.
- `public/images/hero-shell-peeler.webp`: new 1536 × 1024 conceptual illustration, around 97 kB. It is explicitly labeled as an illustration on the home page.
- `src/components/HomeHero.tsx`: original headline, full-screen desktop composition, gentle scroll movement and reduced-motion support; mobile separates copy and artwork.

The earlier artwork and owner photo 36 guided the hero. The source JPEG logo and owner photo remain unchanged under `assets/reference/`. WebP conversion preserves alpha and optimizes delivery. Original product photos, fourteen price variants, inquiries and GLB pilots retain their existing behavior.

## Final prompts — built-in image tool

### Logo — background extraction; transparent output enabled

Edit target: the supplied HCBTECH logo. Background-extraction only. Remove the rectangular black brushed-metal background completely and produce genuine transparent alpha around and through the mark, preserving the exact existing HCBTECH lettering, red and silver metallic gear, welder silhouette, orange welding spark, and the exact tagline 'JASA TEKNIK, PERMESINAN & FABRIKASI'. Preserve the existing composition, typography, proportions, colors, black details within the lettering and tagline, and metal highlights. Do not redesign, retype, invent, recolor, add shadows, borders or a backplate. Remove only the exterior black textured background including empty spaces enclosed by the gear/welder. Keep fine edges clean without black rectangular residue. Wide landscape cutout of the full existing logo, nothing cropped.

Input: `public/brand/hcbtech.webp`.

### Hero — conceptual product artwork; opaque output

Create improved cinematic industrial machinery artwork for the HCBTECH website hero. First supplied image is the earlier hero's visual direction and composition reference, second is the owner's actual shell-peeler machine shape reference. This is a labeled conceptual illustration, not a sales photo or engineering diagram. Preserve the earlier hero's wide charcoal studio scene and single machine staged on the RIGHT, with LEFT 45 percent remaining very dark spacious negative space for large white HTML text. Landscape 2400x1600 or similar 3:2 canvas so portrait mobile crops still show a complete machine. Upgrade the design to a premium, carefully lit product visualization: crisp brushed stainless and painted steel, believable welded rectangular table frame, electric motor at rear-left connected directly to a small olive-green gearbox, a plain vertical circular working disc and central hub on a horizontal shaft, compact red guide below disc, broad sloping stainless discharge chute at front. Follow photo 36 for assembly relationships, motor location and compact proportions. Do NOT copy the old image's giant saw-tooth blade, exposed long diagonal red rail, floating machinery, duplicated drive motors, or implausible belt mechanism. Render one coherent table-height machine with a complete four-leg base, grounded contact shadows, small machining scuffs and clean material reflections. Full machine visible, not cropped. Warm restrained rim light from upper right, broad cool softbox lighting to reveal silver surfaces. Background matte charcoal fades to deep black at left. Camera three-quarter front view, product on right 55 percent, machine occupies most of right height with breathing room above/below. No people, no text, no lettering, no watermark, no logo, no infographic lines or sparks. High detail, confident industrial photography art direction, quiet background. This should improve the original hero artwork while staying much closer to the owner photo.

Inputs: `public/images/visual-disc-hero.webp` and `assets/reference/shell-peeler/photo-36.jpg`.
