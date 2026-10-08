# Current Site Analysis (pre-transformation audit)

Audit date: 2026-09-26. Scope: the React/Express project in this repository **and** the live production site `edusofthealth.com` (PHP), which turned out to be the real source of product truth.

## 1. Architecture

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 19, Vite 8, TypeScript 6 | README claimed React 18 |
| Styling | Tailwind CSS 3 | Hard-coded colours, no token layer |
| Routing | react-router-dom 6 | All pages eagerly imported (one bundle) |
| i18n | i18next + react-i18next | EN/FR/JA/ZH/KO, localStorage persistence |
| Animation | framer-motion 13 | Decorative loops, no reduced-motion handling |
| Forms | react-hook-form | Two forms: contact, support |
| Backend | Express 5 | JSON files as data store, helmet, CORS, rate-limit |
| Data | `server/data/*.json` | products (9), news (4), jobs (4), faqs (9), offices (3) |

### Page hierarchy
`/` · `/about` · `/portfolio` · `/portfolio/:slug` · `/support` · `/news` · `/news/:slug` · `/careers` · `/careers/:slug` · `/contact` · `*` (404). Footer linked to `/privacy`, `/terms`, `/cookies` — routes that did not exist.

### API
`GET /api/products[?category&search]`, `/api/products/categories`, `/api/products/:slug`, `/api/news[/:slug]?lang`, `/api/jobs[/departments|/:slug]`, `/api/faqs`, `/api/offices`, `POST /api/contact`, `GET /api/health`.

## 2. Defects found (and fixed)

| # | Severity | Defect | Fix |
|---|---|---|---|
| 1 | **Blocker** | `server/data/news.json` was invalid JSON (unescaped `"` in the Chinese article body) → `require()` threw → **the entire API crashed at startup** | Quotes converted to CJK quotation marks; JSON validated |
| 2 | **Blocker** | `HeroSection.tsx` declared `const { t }` twice → **TypeScript build failed** | Component replaced |
| 3 | High | All 9 product images (`/assets/images/products/*.jpg`) returned **404** on edusofthealth.com — every product rendered a text placeholder | Real photography pulled from the live site, processed locally |
| 4 | High | Company figures contradicted the live site (2,000+ installs / 10+ years / 15+ countries vs **4,200+ / 28+ / 13 branches**) | Live-site figures used everywhere |
| 5 | High | Unverifiable claims: "ISO 13485", "CE Mark", "CE-marked TB Screening AI" (live site lists BIS, NABL, AERB, CDSCO, ISO and **partner** AI platforms) | Removed; replaced with published certifications |
| 6 | High | Contact form: selected dial code was never sent with the phone number | Code + number concatenated on submit |
| 7 | Medium | Toll-free links used `tel:+1800…` (dials a **US** number) | `tel:1800120280280` |
| 8 | Medium | Footer links to `/privacy`, `/terms`, `/cookies` → 404 | Legal pages built from the live site's text |
| 9 | Medium | `offices.json` listed Dubai & Nairobi offices with placeholder phones (`+971 4 XXX XXXX`) not on the live site | Replaced with the two published offices (New Delhi HQ, Chicago USA) |
| 10 | Medium | Mojibake in `en.json` (`â€”`, `Ã—`, `Â©`) | Locale rewritten |
| 11 | Medium | Share buttons had literal `aria-label="{t('…')}"` strings | Fixed in rebuilt article page |
| 12 | Low | 600 ms+ splash screen blocked every page load (LCP) | Removed |
| 13 | Low | Hard-coded English in several pages (job detail, news categories, "Read More") | All UI copy in locale files |
| 14 | Low | Nodemailer example used non-existent `createTransporter` | Corrected to `createTransport` |
| 15 | Low | Vite boilerplate left in (`App.css`, `react.svg`, `vite.svg`, `hero.png`) | Removed |

## 3. Current UI/UX (before)

- Generic dark "SaaS" hero with particles, ECG line, floating stat badges, typewriter and stock Unsplash images — no actual product visible.
- Every section followed "centered heading + card grid" on white.
- Products (the business) were text-only cards with broken images.
- Tailwind default neutrals + a single brand blue; Plus Jakarta Sans / Inter.
- Mobile: desktop layouts stacked; drawer menu.
- No product comparison, no galleries, no spec structure (flat key/value), downloads pointed to `#`.

## 4. Assets inventory (live site → project)

- **85** product/site images and **71** gallery images downloaded from `edusofthealth.com/assets/…` into `client/media-src/` (see `ASSET_SYSTEM.md`).
- **28** product brochure PDFs verified (HTTP 200) and linked from product pages.
- 1 company video (YouTube `Jwscr6x4Yw0`).
- Detailed specification tables transcribed from **33** live product pages.

## 5. Technical constraints

- Data is file-based JSON; no CMS. Adding products still requires only JSON edits + running the media pipeline.
- The SPA serves one `index.html`; per-page meta is applied client-side (prerendering is listed as remaining work).
- Local Node is 20.18; Vite 8 recommends ≥ 20.19 (works, prints a warning).
- The Express API reads `products.json` / `media-manifest.json` at startup → restart after data changes.
