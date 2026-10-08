# Edusoft Healthcare — UI/UX Transformation

## 1. Old UI problems
- The site did not show the products. The hero was particles, an ECG line, floating badges and stock photos; all 9 product images were 404s.
- The catalogue was fictional relative to the business: 9 generic products vs Edusoft's real 40-product lineup (ERAY / TRIMAX), unverifiable specs and certifications, outdated company figures.
- Template structure: every section was "centred heading + 3–4 cards on white".
- Broken fundamentals: API crashed on startup (invalid `news.json`), TypeScript build failed, footer legal links 404'd, toll-free `tel:` dialled the US, phone dial code dropped from submissions, mojibake in copy.
- No product depth: flat spec lists, `#` downloads, no galleries, no comparison, no quote context.
- Performance: blocking splash, single eager bundle, 1.8 MB ICC profiles in imagery.
Full audit: `current-site-analysis.md`.

## 2. New direction — "Luminance"
Radiography is light through matter; the identity uses that literally: products on a luminous **lightbox**, **DICOM overlay** annotations, an **exposure** scan-line reveal, detector-grid texture, index-numbered editorial sections. Porcelain light surfaces alternate with cinematic **ink** sections. Geist + Geist Mono. See `DESIGN_SYSTEM.md`, `MOTION_SYSTEM.md`.

Goal met: *Edusoft = medical imaging technology* is legible in the first viewport — a real ERAY product under a spotlight with its published kV/mA readouts, cycling handheld → mobile → C-Arm → DR room.

## 3. Information architecture
```
/                       Hero · Intro (figures) · Ecosystem · Technology story · Flagships ·
                        Clinical settings · Service · Why Edusoft · Deployments · Voices · News · CTA
/portfolio              Catalogue: family rail, search (name/kV/detector/application), grouped by family
/portfolio?category=…   11 families (URLs from the live PHP site 301 here)
/portfolio/:slug        Product: cinematic hero, highlights, local nav, overview, viewer/gallery,
                        features, grouped specs, brochures, service promise, related, quote CTA
/portfolio/compare      Up to 3 products side by side (union of published spec rows)
/services   (new)       Offer, lifecycle timeline, service request form
/about                  Facts, story, six commitments, vision/mission, manufacturing & partners,
                        compliance (#compliance), people + film, voices, offices, future
/support                FAQ search, brochure library (from product downloads), support form
/news · /news/:slug · /careers · /careers/:slug · /contact
/privacy · /terms · /cookies (new — live-site text)
```
Legacy slugs (`fpd-c-arm`, `rvg-sensor`, `xray-printer`, `xray-film`, `tb-screening-ai`, `radiation-protection`, `xray-accessories`) resolve to their canonical products. 60 live `.php` URLs 301 to new routes (`server/lib/legacyRedirects.js`). `sitemap.xml` and `robots.txt` are generated from data.

## 4. Component architecture
```
client/src/
  styles/tokens.css          design tokens (light · dark · ink)
  lib/                       api (cached), types, motion tokens, useAsync, utils
  context/                   Theme, HeaderTone, Compare
  content/                   heroProducts, storyMedia, siteMedia.json, testimonials, legal
  components/
    layout/                  SiteHeader, MegaMenu, MobileMenu, LanguageSwitcher, SiteFooter
    ui/                      Button, Eyebrow, SectionHeader, PageHeader, Picture, Lightbox,
                             LocalNav, Logo, Seo, PhoneCodeSelect
    motion/Reveal.tsx        Reveal, RevealGroup/Item, MaskLines, ExposureReveal, Parallax, Counter
    product/                 ProductCard, ProductGallery, MultiAngleViewer, SpecTable, CompareTray
    home/                    HomeHero, HomeIntro, Ecosystem, TechStory, FeaturedRail,
                             ClinicalSettings, ServiceBand, WhyEdusoft, Deployments, Voices, ClosingCTA
    form/                    Field, SelectControl, RequestForm
    media/VideoFacade.tsx
    news/NewsCard.tsx
  pages/                     16 lazy routes
server/
  lib/catalog.js             products + categories + media manifest → API shapes (backward compatible)
  lib/legacyRedirects.js     301 map from the PHP site
  routes/seo.js              sitemap.xml, robots.txt
```

## 5. Responsive strategy
Designed per breakpoint, not stacked: mobile gets a full-screen menu with category tiles, horizontal chip rails (categories, care settings, news filters), panel-by-panel technology story with copy under each image, accordion specs (first group open), corner-diagonal DICOM labels only, swipeable galleries and rails, sticky local nav, full-width CTAs. Verified overflow-free with no console errors at 360 / 390 / 412 / 768 / 1024 / 1440 / 1920 (automated Playwright sweep of 13 routes).

## 6. Accessibility
Skip link; semantic landmarks; one `h1` per page; focus-visible rings; ARIA on menus (`aria-expanded`, `aria-controls`, `role=menu/menuitemradio/dialog/tablist/tab/slider`); focus trap + Esc in mobile menu; roving tabs in clinical settings; form fields wired with `aria-invalid` / `aria-describedby`; `role="alert"` errors; live regions for results; `lang` attribute follows language; alt text from product names; reduced-motion honoured in CSS and JS; colour contrast from tokens (muted text ≥ 4.5:1 on its surfaces).

## 7. SEO
Per-route `<title>`, description, canonical, OG tags (React 19 head hoisting); JSON-LD: Organization (index.html), Product (product pages, with published specs as `additionalProperty`), NewsArticle, JobPosting; 301s from every live URL; generated sitemap; `noindex` on compare and 404.

## 8. Data integrity
Every specification is transcribed from the live product pages; each product records `sourceUrl`. Contradictions on the live site were resolved conservatively and logged in `dataNotes` (not shown publicly) — **review list below**. The previous catalogue is preserved at `server/data/products.legacy.json`.

---

## FILES CHANGED
**Server**: `index.js`, `routes/products.js`, `routes/contact.js`, `data/products.json` (rebuilt), `data/offices.json`, `data/news.json` (JSON repair).
**Client**: `index.html`, `tailwind.config.js`, `src/index.css`, `src/main.tsx`, `src/App.tsx`, `src/lib/api.ts`, `src/i18n/index.ts`, `src/context/ThemeContext.tsx`, `src/components/ui/PhoneCodeSelect.tsx`, all 5 locale files, all 10 original pages.
**Removed**: `src/App.css`, `src/assets/*`, `public/favicon.svg`, `public/icons.svg`, old `components/home/*` (9), `components/layout/Navbar.tsx`, `Footer.tsx`, `components/ui/ScrollToTopButton.tsx`, `components/portfolio/ProductCard.tsx`.

## COMPONENTS CREATED
SiteHeader · MegaMenu · MobileMenu · LanguageSwitcher · SiteFooter · Button · Eyebrow · SectionHeader · PageHeader · Picture · Lightbox · LocalNav · Logo · Seo · Reveal / RevealGroup / RevealItem / MaskLines / ExposureReveal / Parallax / Counter · ProductCard · ProductGallery · MultiAngleViewer · SpecTable · CompareTray · Field / SelectControl · RequestForm · VideoFacade · NewsCard · HomeHero · HomeIntro · Ecosystem · TechStory · FeaturedRail · ClinicalSettings · ServiceBand · WhyEdusoft · Deployments · Voices · ClosingCTA · HeaderTone & Compare contexts · catalog service · legacy redirects · SEO routes.

## COMPONENTS REDESIGNED
Navigation (→ header + mega menu + mobile sheet) · Footer · Product card · Contact form · Support form · Phone code picker (→ native select) · Theme toggle · Language switcher · 404.

## PAGES REDESIGNED
Home · Products · Product detail · About · Support · News · News article · Careers · Job detail · Contact · 404. **New**: Services · Compare · Privacy · Terms · Cookies.

## ASSETS ADDED
156 source images (`client/media-src/`) → 572 optimised AVIF/WebP derivatives (`client/public/media/`), 40 products · 116 product images (38 converted to true transparent cut-outs), 18 site images, 28 linked brochures, real favicon, 5 real customer testimonials, legal texts. Scripts: `build_media.py`, `cutout.py`, `check-locales.mjs`.

## VIDEOS REQUIRED
Hero light-sweep over a real product · flagship product intros (C-Arm orbital motion, 50kW mobile driving, handheld in field) · detector exposure → console image · clinical settings (ICU, OR, outreach camp) · service engineer installation. Specs in `VIDEO_SYSTEM.md`.

## 360° PRODUCTS
Live: **TRIMAX TX40** (4 real angles). To shoot (36–72 frames): ERAY SMART 6HS, ERAY Smart 5C Premium Pro, 50kW Motorized Mobile, ERAY Gold 100, Ceiling Suspended DR.

## ANIMATIONS ADDED
Route transitions · masked headline reveals · section fade-ups & staggers · exposure scan-line reveals · hero product cycle with readout crossfade & progress · scroll-away hero stage · pinned technology story with progress rail · draggable snap rail · scroll-drawn service timeline · count-ups · parallax (2 uses) · mega-menu clip drop & live preview · mobile menu wipe & stagger · product card hover lift/metric reveal · gallery directional slides · 360° inertia · accordions · shared-layout nav indicators · compare tray slide-in. All reduced-motion aware.

## PERFORMANCE IMPROVEMENTS
Route code-splitting · lazy locales (main chunk −48%) · splash removed · AVIF/WebP responsive images with intrinsic sizes · ICC/metadata stripping · LQIP · progressive 360° frames · video facade · client API cache · long-lived static caching in production. See `PERFORMANCE.md`.

## REMAINING WORK
**Needs Edusoft input**
1. Confirm the data-review items below.
2. High-resolution product masters, in-use photography, turntable sets, videos (`ASSET_SYSTEM.md`).
3. Legal: Terms list contact emails at `@a2zok.com` — confirm or replace; privacy/cookie text mentions advertising cookies the new site does not use.
4. Replace Unsplash stock images in `news.json`; add real news.
5. Rotate the AI-provider key shared in chat; provide the provider's API docs if ambient AI footage is wanted.

**Engineering**
6. Prerender routes for social-card meta and faster LCP; CDN for `/media` and `/assets`.
7. Wire `/api/contact` to email/CRM (Nodemailer stub present) — submissions are currently logged only.
8. Upgrade local Node to ≥ 20.19 (Vite 8 recommendation).
9. Legacy one-off scripts in `client/` (`fix2.py`, `fix_t.py`, `patch_tsx.py`, `update_locales.py`, `extract_text.py`, `missing_strings.json`) are no longer needed — `fix2.py` style regex edits likely caused the duplicate-`t` build break; remove them.
10. Native-speaker review of FR / JA / ZH / KO copy.

### Data-review list (from `products.json` → `dataNotes`)
| Product | Note |
|---|---|
| ERAY SMART 5HS | Live intro says up to 100 images per charge; spec table says about 150 (70 kV, 5 mAs). Spec table used. |
| ERAY SMART 3HS | Intro "just less than 3.5 kg" vs spec "up to 3 kg". Spec used. 3HS+ "under process" not presented. |
| 50kW Motorized Mobile | Live feature list is copied from the 40kW page; only the 50kW spec table used. |
| ERAY SMART 4T/5T/6T | Heat capacity garbled ("40-14-Khu"); omitted. |
| Integrated Digital Mobile | Model names conflict (4T/6i vs 4T/6T vs 6/7 kW); names not asserted. |
| 2kW Portable | Live page shows 40kW specs; no 2kW specs shown. |
| Ceiling Free X-Ray | Two power values for three models; per-model power not asserted. |
| ERAY RAD Series | Time range cell contains kV values; omitted. |
| ERAY Smart 5C Premium Pro | Features "30 fps" vs spec "cine loop 15 fps"; spec shown. |
| ERAY Smart 5C ERAY Gold | Optional resolution 1356² vs 1536² on sibling pages; shown as published. |
| ERAY Gold Breakfree | "140 mm" pixel → 140 μm; weight 2.5 kg (table) vs 2.7/3.2 kg (prose). |
| ERAY IGZO | Live page shows TRIMAX 35C specs; none shown. |
| ERAY FireCR Spark | Live page carries TRIMAX CR copy; generic benefits only. |
| ERAY Thermal Printer | First-print time blank; omitted. |
| PACS & RIS / Intraoral sensor | Previous site's unpublished specs removed (kept in `products.legacy.json`). |
| AI Radiology | "CE-marked Edusoft TB AI" claim removed; partner platforms listed. |
| AI-Optics | Comparative claims ("200% more accurate", "90% less") not reproduced. |

## How to run
```bash
npm install && npm --prefix client install && npm --prefix server install
npm run dev                                   # API :5000 + Vite :5173
python client/scripts/build_media.py          # after adding/changing product images
node client/scripts/check-locales.mjs         # after editing copy
npm run build && NODE_ENV=production npm start
```
