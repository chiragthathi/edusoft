# Performance

## Measures in place

| Area | Measure |
|---|---|
| Code splitting | Every route is a lazy chunk (was one eager bundle). Largest page chunks: Home 27 KB, Product 22 KB (raw). |
| Locales | English bundled; FR/JA/ZH/KO are separate ~10 KB-gzip chunks loaded only when chosen → main chunk **200 KB → 105 KB** (72 → 38 KB gzip). |
| First paint | Removed the 600 ms+ blocking splash; theme applied pre-paint by an inline script (no dark-mode flash). |
| Images | AVIF → WebP `<picture>` with `srcset` / `sizes`; widths 320/640/960; intrinsic `width/height` (no CLS); `loading="lazy"` + `decoding="async"` except the hero (`fetchpriority="high"`). |
| Image weight | ICC/EXIF stripped (13 MB → 7.8 MB before cut-outs); ~11 MB total across 572 files, of which a page loads a few hundred KB. |
| Placeholders | 24px LQIP blur for primary product images. |
| 360° | Frames decode progressively only near the viewport. |
| Video | Facade pattern — zero YouTube bytes until play. |
| Data | Client request cache: catalogue fetched once per session, shared by mega menu, pages and footer. Search debounced (250 ms); stale responses ignored. |
| Fonts | Geist variable + Geist Mono from Google Fonts with `preconnect` + `display=swap`. |
| Animation | Only transform/opacity/clip-path/filter; no scroll listeners doing layout; `useScroll` / IntersectionObserver based. |
| Caching (prod) | `/assets` immutable 1 year, `/media` 30 days, HTML 1 hour. |
| API | Rate limit configurable (`RATE_LIMIT_MAX`, default 300 / 15 min). |

## Build output (production)
```
index        104.9 KB (38.0 KB gzip)   app shell + router + English
vendor       238.8 KB (77.6 KB gzip)   react, react-dom, router
animations   141.8 KB (46.6 KB gzip)   framer-motion
i18n          55.6 KB (18.0 KB gzip)
CSS           67.4 KB (13.0 KB gzip)
```

## Recommended next steps
1. **CDN** in front of `/media` and `/assets` (Cloudflare / CloudFront) with Brotli.
2. **Prerender** routes (e.g. `vite-plugin-prerender` or migrate to a meta-framework) for faster LCP and social-card meta.
3. Self-host Geist (removes two third-party connections).
4. Replace framer-motion with the lighter `motion/mini` build where only simple animations are used.
5. Replace Unsplash news images with optimised local images.
6. Real-user monitoring (Web Vitals → analytics).
