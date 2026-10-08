# Design System — "Luminance"

Radiography is the reading of light through matter. The Edusoft identity is built from that idea rather than from generic healthcare tropes (no stethoscopes, ECG lines, blue gradients or floating icons).

## Signature motifs

| Motif | What it is | Where |
|---|---|---|
| **Lightbox** | Luminous porcelain panel — a film viewer — on which every product sits. Radial light from the top, soft floor shadow, hairline edge. White-background and transparent product photos read as one studio (`mix-blend-mode: multiply`). | `.lightbox`, `components/ui/Lightbox.tsx` — product cards, heroes, mega menu, spec column |
| **DICOM overlay** | Monospace technical annotations in the corners of imagery, as on a radiograph (kV, mA, SID, model). Units keep their correct case (kV, mA, μm). | `.dicom`, `Lightbox annotations`, hero readouts |
| **Exposure** | A clip-path wipe led by a single bright scan line — an X-ray exposure sweep. Used on hero/key imagery only. | `ExposureReveal`, hero product change |
| **Registration marks** | Detector-corner crop marks on frames. | `.reg-marks`, hero stage |
| **Index numbering** | `01 — Section` eyebrows give the page an engineered, catalogued rhythm. | `Eyebrow` |

## Tokens (`client/src/styles/tokens.css`)

All colours are RGB channel triplets so Tailwind can apply alpha (`bg-brand/20`). Three tone contexts share the same token names:

| Token | Light (porcelain) | Dark theme | `data-tone="ink"` |
|---|---|---|---|
| `--bg` | `244 245 243` | `7 11 17` | `7 11 17` |
| `--surface` | `251 251 250` | `12 17 25` | `13 19 28` |
| `--fg` | `11 18 32` | `233 237 242` | `236 240 245` |
| `--muted` | `83 94 110` | `150 160 175` | `152 163 178` |
| `--brand` | `0 94 166` (Edusoft #005EA6) | `74 150 232` | `82 158 238` |
| `--on-brand` | white | `5 8 13` | `5 8 13` (text on brand buttons — keeps ≥ 6.5:1) |
| `--subtle` | `102 112 126` (4.6:1) | `122 133 149` (5.3:1) | `122 134 150` |
| `--signal` | `46 196 150` (status dots only) | | |
| `--line` / `--line-a` | ink @ 9% | white @ 9% | white @ 10% |

`data-tone="ink"` makes any section cinematic-dark in **both** themes (hero, technology story, service band, footer). The header adopts ink tone over ink heroes via `useHeaderTone('ink')`.

### Typography
- **Geist** (display + body, variable 300–700) — tight tracking at display sizes, weight 500 (premium, not promotional).
- **Geist Mono** — eyebrows, DICOM labels, spec indices, counters.
- CJK falls back to Noto Sans JP/SC/KR / system fonts.
- Fluid scale (`tailwind.config.js`): `display-2xl` 48→116px, `display-xl` 40→88, `display-lg` 34→64, `display-md` 28→44, `display-sm` 22→30, `lede` 17→21, `eyebrow` 11px / 0.14em.
- Heading utility classes: `.type-display .type-h1 .type-h2 .type-h3` (namespaced — `h-1` would collide with Tailwind's height utility).

### Space, grid, containers
`--space-3xs…2xl` (4 → 104px), `--space-section` clamp(80px → 160px), `--gutter` clamp(16 → 40px), `--container` 88rem. 12-column grid; editorial layouts offset content (e.g. eyebrow in cols 1–3, statement in 4–12).

### Radius · depth · motion
Radius `xs 4 · sm 8 · md 14 · lg 20 · xl 28` (technical, restrained). Shadows `--shadow-lift`, `--shadow-float`, `--shadow-glow` (primary button hover only). Motion tokens: see `MOTION_SYSTEM.md`.

### Breakpoints
`xs 400 · sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`. Verified at 360 / 390 / 412 / 768 / 1024 / 1440 / 1920.

## Components

| Component | File | Notes |
|---|---|---|
| Button | `ui/Button.tsx` | `primary · solid · secondary · ghost`, `sm · md · lg`, arrow / external arrow; renders `Link`, `<a>` or `<button>` |
| Eyebrow | `ui/Eyebrow.tsx` | index + label, optional live dot |
| SectionHeader | `ui/SectionHeader.tsx` | eyebrow · masked headline · lede · action; `split / stack / center` |
| PageHeader | `ui/PageHeader.tsx` | light page opener |
| Picture | `ui/Picture.tsx` | AVIF→WebP `<picture>`, srcset, intrinsic size, LQIP |
| Lightbox | `ui/Lightbox.tsx` | product stage + DICOM corners |
| LocalNav | `ui/LocalNav.tsx` | sticky in-page nav with scroll-spy |
| ProductCard | `product/ProductCard.tsx` | stretched link, compare toggle, hover metric reveal |
| ProductGallery | `product/ProductGallery.tsx` | stage + thumbs, swipe, keyboard |
| MultiAngleViewer | `product/MultiAngleViewer.tsx` | see `360_SYSTEM.md` |
| SpecTable | `product/SpecTable.tsx` | grouped semantic tables, accordion |
| CompareTray / ComparePage | `product/…`, `pages/ComparePage.tsx` | up to 3 products, "differences only" |
| Field / SelectControl | `form/Field.tsx` | label, hint, error, aria wiring |
| RequestForm | `form/RequestForm.tsx` | support / service requests |
| VideoFacade | `media/VideoFacade.tsx` | click-to-load privacy-enhanced YouTube |
| SiteHeader / MegaMenu / MobileMenu / SiteFooter | `layout/…` | see below |

### Navigation
- **Header**: transparent over ink heroes → blurred porcelain on scroll. Products (mega menu) · Services · Company · News · Careers · Support · language · theme · Contact · Request a quote.
- **Mega menu**: categories grouped by imaging stage (X-ray imaging / Digital & software / Output & accessories / Specialty) with counts; hovering a category swaps a live lightbox preview, tagline and product list.
- **Mobile**: full-screen sheet, product categories as thumbnail tiles, language chips, sticky quote CTA, focus-trapped, Esc closes.

### Forms
Top-aligned labels, 50px controls, 1.5px brand focus ring + 4px halo, inline errors with icons (`role="alert"`), `aria-invalid` + `aria-describedby`, character counter, honeypot, native selects (mobile pickers), success/error states.
