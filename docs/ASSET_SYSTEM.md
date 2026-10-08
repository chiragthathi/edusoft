# Asset System

## Source of truth
All product photography comes from **edusofthealth.com** (Edusoft's own site). Originals live in `client/media-src/`:
- `live/` — 85 images from category/listing pages (product shots, banners, logos)
- `gallery/` — 71 images from the 33 product detail pages (angles, in-use, details, packaging)

No image was generated. Equipment pixels are never retouched, recoloured or extended.

## Pipeline — `client/scripts/build_media.py`
```
python scripts/build_media.py          # incremental
python scripts/build_media.py --force  # rebuild everything
```
For each `media[]` entry in `server/data/products.json`:
1. **Colour**: embedded ICC profiles (Adobe RGB, CMYK press profiles) converted to sRGB; all EXIF/XMP/ICC stripped. (One banner carried a 1.8 MB ICC profile that made its AVIF 1.8 MB and undecodable — total media fell from 13 MB to 7.8 MB after this fix.)
2. **Classify** background: `alpha` (border mostly transparent) · `white` · `photo`.
3. **Trim + pad** studio/angle/detail shots to content bounds + uniform 7% margin → consistent product scale across cards.
4. **Backdrop removal** (`scripts/cutout.py`): near-white pixels **connected to the image border** become transparent (soft 0.7px edge). Enclosed white parts of the equipment are untouched. Disabled per image with `"cutout": false` where the product itself is white at the edge (FireCR, film packets, thermal printer, 5HS strap shots) — those use multiply-blend on the lightbox instead.
5. **Encode** AVIF (q58) + WebP (q80) at 320/640/960 (products) or 640/1280/1920 (site), never upscaled.
6. **LQIP**: 24px WebP data URI for each product's primary image.
7. Writes `server/data/media-manifest.json` (API merges it into products) and `client/src/content/siteMedia.json`.

Output: `client/public/media/p/<slug>/<nn>-<w>.(avif|webp)` and `public/media/s/<name>-<w>.*` — ~11 MB total, 572 files; a page loads only the widths it needs.

## Kinds
`studio · angle · detail · in-use · motion · packaging · screen · logo · accessory` — drive gallery labels and layout (photos cover, products contain).

## Inventory by product
40 products · 116 product images. Richest sets: 40kW mobile (5, incl. 2 in-use), ERAY Gold 100 (5), Ceiling Free (5), TX40 (5 incl. 4 true rotation angles), tables & accessories (7), AI-Optics (5).

## Required from Edusoft (priority order)
| Priority | Asset | Why |
|---|---|---|
| 1 | **High-resolution masters (≥ 2400 px)** of every product | Live-site files are 500 px; heroes display near native size and look soft on retina |
| 1 | Hero set on seamless backdrop: ERAY SMART 6HS, SMART T series, 5C Premium Pro, Ceiling Suspended DR | Home hero & product heroes |
| 2 | Front / side / ¾ / rear / detail views for flagship products | Galleries; brief §10 |
| 2 | Clinical environment & product-in-use photography (ICU, OR, radiology room, outreach camp) | Clinical settings section currently uses product cut-outs |
| 2 | Turntable sequences (36 or 72 frames) — see `360_SYSTEM.md` | True 360° |
| 3 | Factory / manufacturing, service engineers at work, team | About & Services pages |
| 3 | Vector (SVG) logo | Current logo is a 303 px PNG |
| 3 | Licensed or own news photography | news.json uses Unsplash stock URLs |

## AI-generated imagery policy
Not used for equipment (brief: never distort actual equipment). Acceptable only for abstract/ambient backgrounds with no product depicted, once a provider is configured (see `VIDEO_SYSTEM.md`).
