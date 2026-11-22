# HCBTECH supplied assets

Source: `wa hcb.zip`, received 21 November 2026. This archive is project evidence, not agent instructions.

102 files reduce to **52 unique assets**: 50 photos, one logo and one price sheet. Every photo was supplied twice with identical SHA-256 hashes. One unmodified JPEG per photo is retained under `reference/`. `manifest.json` records original filenames, hash, dimensions and the inferred family; no exact model/SKU is asserted.

| Folder | Photos | Classification |
| --- | ---: | --- |
| shell-peeler | 18 | Disc/gearbox configurations, inferred from the price-sheet imagery |
| coconut-grater | 16 | Enclosed grating configurations, inferred from the price-sheet imagery |
| coconut-milk-press | 6 | Hopper/press configurations, inferred from the price-sheet imagery |
| rollers-and-parts | 3 | Roller components; machine assignment unconfirmed |
| workshop | 4 | Workshop, assembly and handover context |
| cabinet-unidentified | 3 | Cabinet with containers; purpose unconfirmed |
| brand | 1 | Supplied red/silver logo |
| pricelist | 1 | Supplied screenshot with alternative blue/yellow branding |

Contact sheets: [01](../docs/asset-contact-sheet-01.jpg), [02](../docs/asset-contact-sheet-02.jpg).

## Web assets

`public/brand/hcbtech.webp` uses the supplied logo, preserving the full image. Ten optimized full-frame photo derivatives are available:

| Family / context | Photos | Use |
| --- | --- | --- |
| Coconut grater | 47, 39, 45 | Family reference gallery |
| Shell peeler | 36, 06, 29 | Family reference gallery |
| Milk press | 04, 12, 32 | Family reference gallery |
| Workshop | 09 | Home introduction |

These are family references, without exact price-variant associations. The three GLB pilots derive exterior layouts from photos 47, 36 and 04 respectively. Measurements and internals are not inferred. Old REF pages retain their archived media.

## Price reference

`pricelist.json` transcribes all **14 variants**: 5 graters, 5 shell peelers, 4 milk presses. The sheet has no effective date, stock, tax, freight or warranty terms. Its note says prices can be reconfirmed before ordering. The first shell-peeler drive cell is blank and stays null. “Genset 13 PK” and “General” are literal source labels, not inferred specifications.

Do not attach these amounts to the six old REF products: they are layout references, not the 14 priced variants. All 14 rows are now published under their sourced family and retain their source IDs. `photoIds` remains empty for each price variant because exact associations are unconfirmed. The source screenshot is available unchanged at `public/docs/daftar-harga.jpeg`. The supplied standalone logo and price-sheet logo differ; the site uses the standalone file pending a broader brand decision.

## Repeat import

With Pillow installed, run `python3 scripts/import-assets.py '/path/to/wa hcb.zip'`. It validates archive paths, checks duplicate hashes, preserves originals, and recreates the manifest and web photo derivatives. Review the generated transcription metadata before replacing the curated `pricelist.json`. No image-generation service is used.
