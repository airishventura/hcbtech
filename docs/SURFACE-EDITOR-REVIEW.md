# Surface and owner-workbench review

Mode: full. Scope: shared inner-page headers, catalog cards, social/contact actions, buyer inquiry continuity, and the new owner draft workflow. Stack: React 19, Vite 7, Tailwind 4 plus established plain CSS. The original home artwork, machine geometry and unconfirmed commercial facts are outside this change.

| Category | Evidence inspected | Result |
| --- | --- | --- |
| Typography | Catalog, contact, workshop, owner form and bilingual preview | Smaller inner-page title scale, common left edge and bounded copy; no font dependency added |
| Surfaces | Header, product, evidence, service and social cards; selected comparison state | Industrial silver/red gradients, consistent card insets and readable dark-surface foregrounds |
| Animations | Hover, focus, press, reduced-motion and native details states | Existing restrained feedback retained; no animated gradient or staged entrance added |
| Icons | Search padding, CTA glyphs, comparison state, file import/export | Current-color icons, nonshrinking button glyphs, native keyboard file input |
| Performance | Built chunks, optional owner page, translation loading | Workbench remains route-split; English and optional rendering engines remain deferred on the Indonesian home page |

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| HIGH | `src/index.css`, shared anchors in `Layout.tsx`, `Contact.tsx`, `Workshop.tsx` | Unlayered link reset overrode Tailwind foreground utilities | Reset is in the base layer; dark and red social surfaces use explicit paired colors | WhatsApp/Facebook labels and hovered links must remain readable |
| MEDIUM | `src/index.css`, shared buttons and fields | Component rules overrode responsive display and field padding utilities | Shared primitives use the components layer, below utilities | Hides mobile-only controls on desktop and restores search/icon spacing |
| MEDIUM | `src/components/PageElements.tsx` | Large clearance and description offset left a disconnected header | Compact gradient header, aligned title/description, contextual action at right | Whitespace should establish hierarchy and make the next action easy to find |
| MEDIUM | `src/components/ProductCard.tsx` | Flat border-only cards, inconsistent text height and wrapping actions | Consistent metal surface, photo inset, title/description rhythm and action grid | Buyers can scan families and compare prices/actions along shared baselines |
| MEDIUM | `src/pages/Contact.tsx` | Quick-prompt row widened the mobile grid | Main form column can shrink; prompt strip owns its horizontal scroll | The page must fit the viewport while keeping all prompts available |
| LOW | `src/pages/About.tsx`, `Workshop.tsx`, `ProductDetail.tsx`, `src/index.css` | Flat repeated sections and oversized section gaps | Restrained service/evidence surfaces, product introduction wash and smaller spacing scale | Matches the requested gradients without competing with machine photography |
| MEDIUM | `src/pages/About.tsx`, `src/data/site.ts`, `src/data/products.ts` | About copy described old reference families; price FAQs embedded a fixed source date | Current three-family structure and product-linked source wording | Information architecture and source references must follow the current catalog |
| MEDIUM | `src/pages/CatalogEditor.tsx`, `src/lib/catalog-editing.ts` | Owner updates required editing TypeScript | Bilingual draft workbench, local recovery, preview, reviewed JSON export/import | Gives the owner a usable content preparation workflow without server credentials |
| HIGH | `scripts/import-catalog.mjs`, `scripts/prerender.mjs`, `src/data/products.ts` | No owner-revision validation or linked provenance copy | Shared strict validation; review attribution/date/source; fixed output paths; build rejects mismatched public provenance | Invalid or incomplete changes must not silently corrupt the catalog or its source link |
| MEDIUM | `src/i18n/localize.ts`, `src/lib/inquiry.ts`, `ProductDetail.tsx` | Edited English copy and confirmed-price context had no update path | Reviewed bilingual content, stable IDs and confirmed prices survive buyer pages and inquiry drafts | A revision must remain consistent from catalog to quotation handoff |

| Location | Candidate | Rejected because |
| --- | --- | --- |
| Headers and cards | Animated gradient and repeated reveal effects | Distracts from machine inspection and adds motion without communicating a state change |
| Owner workbench | Direct public publishing button | This deployment has no configured authenticated owner backend; an export must not imply a live update |
| Catalog content | Add guessed specifications and exact variant photo assignments | The owner deferred factual confirmation and measurements are unavailable |

Verification and final results are recorded in [validation](SURFACE-EDITOR-VALIDATION.md). Physical hardware, Safari and manual screen-reader operation are not verified on this cloud VM. The workbench is a local draft preparation tool, not a private CMS, customer database or completed direct-publishing system.
