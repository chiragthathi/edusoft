# Edusoft Healthcare — Website

Corporate website and product catalogue for **Edusoft Healthcare Limited** — handheld, mobile and fixed X-ray, surgical C-Arms, DR detectors, CR systems, medical printers, films, software and accessories.

> Design system "Luminance" · 40 real products · 5 languages · React 19 + Vite 8 + Express 5

## Quick start
```bash
npm install
npm --prefix client install
npm --prefix server install
npm run dev            # API http://localhost:5000 + web http://localhost:5173
```
Production:
```bash
npm run build
NODE_ENV=production npm start      # serves client/dist + API on :5000
```

## Stack
| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, TypeScript, Tailwind CSS 3 (token-driven) |
| Motion | framer-motion (single animation library) |
| i18n | i18next — EN (bundled), FR / JA / ZH / KO (lazy-loaded) |
| Forms | react-hook-form |
| Backend | Express 5, helmet (CSP in production), rate limiting |
| Data | JSON in `server/data/` + generated `media-manifest.json` |

## Content workflows
| Task | How |
|---|---|
| Add / edit a product | Edit `server/data/products.json` (specs grouped in `specGroups`, images in `media`), add photos to `client/media-src/`, run `python client/scripts/build_media.py`, restart the API |
| Add a category | `server/data/categories.json` |
| Edit copy | `client/src/i18n/locales/en.json`, mirror in fr/ja/zh/ko, run `node client/scripts/check-locales.mjs` |
| News / jobs / FAQs / offices | `server/data/*.json` |

## Key URLs
`/` · `/portfolio` · `/portfolio?category=<id>` · `/portfolio/<slug>` · `/portfolio/compare?items=a,b,c` · `/services` · `/about` · `/support` · `/news` · `/careers` · `/contact` · `/privacy` · `/terms` · `/cookies` · `/sitemap.xml` · `/robots.txt`.
Legacy `edusofthealth.com/*.php` URLs 301 to their new routes.

## API
| Method | Endpoint |
|---|---|
| GET | `/api/products?category=&search=&featured=1` |
| GET | `/api/products/categories` |
| GET | `/api/products/:slug` (legacy slugs resolve; `canonicalSlug` returned) |
| GET | `/api/news[?lang]`, `/api/news/:slug` |
| GET | `/api/jobs`, `/api/jobs/departments`, `/api/jobs/:slug` |
| GET | `/api/faqs`, `/api/offices`, `/api/health` |
| POST | `/api/contact` — types: contact, general, sales, quote, support, service, partnerships, media, newsletter |

Environment: `PORT`, `CLIENT_ORIGIN`, `SITE_ORIGIN`, `RATE_LIMIT_MAX`, `NODE_ENV`.

## Documentation
`docs/UI_TRANSFORMATION.md` (start here) · `current-site-analysis.md` · `DESIGN_SYSTEM.md` · `MOTION_SYSTEM.md` · `ASSET_SYSTEM.md` · `360_SYSTEM.md` · `VIDEO_SYSTEM.md` · `PERFORMANCE.md`

## Before launch
See **Remaining work** in `docs/UI_TRANSFORMATION.md`: confirm product data-review items, supply high-resolution photography, review legal text, connect `/api/contact` to email/CRM.
