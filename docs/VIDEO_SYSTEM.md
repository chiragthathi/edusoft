# Video System

## What exists
- **No per-product videos** exist on edusofthealth.com ("Watch our video" links are commented out in the live HTML).
- One company film: YouTube `Jwscr6x4Yw0` — shown on the About page.

## Components
### `VideoFacade` (`components/media/VideoFacade.tsx`) — shipped
Click-to-load, privacy-enhanced YouTube (`youtube-nocookie.com`). Until the visitor presses play **nothing** from YouTube loads — no iframe, script or cookie; only the thumbnail image. CSP allows `i.ytimg.com` (images) and `youtube-nocookie.com` (frames).

### Ambient video slots — specified, ready to add
For future loop-friendly clips (hero background, technology section, service):
```
<video muted playsinline loop preload="none" poster="/media/v/<name>-poster.webp">
  <source src="/media/v/<name>-1080.av1.mp4" type='video/mp4; codecs="av01.0.05M.08"'>
  <source src="/media/v/<name>-1080.h264.mp4" type="video/mp4">
</video>
```
Rules:
- Play only while ≥ 40% visible (IntersectionObserver), pause otherwise.
- **Never** on `prefers-reduced-motion`, `Save-Data`, or viewports < 768px (poster only).
- 6–12 s, no audio, ≤ 2.5 MB at 1080p, poster always present.

## Strategy (brief §12)
| Placement | Content | Source |
|---|---|---|
| Home hero (desktop) | Slow light sweep over a real product on dark stage | **Filmed** product (or turntable footage) |
| Product intro (flagships) | 8–10 s rotation / deployment (C-Arm orbital motion, mobile driving) | Filmed |
| Technology | Detector exposure → image appearing on console | Screen capture + product footage |
| Clinical use | ICU bedside, OR, outreach camp | Filmed on site (with consent) |
| Service | Engineer installation / calibration | Filmed |

## AI generation (Seedance / Veo)
The key supplied in chat (`veo3_pat_…`) did not match an identifiable provider and no endpoint was given, so **no generation was performed**. Recommendation:
1. Rotate that key — it has been shared in a chat transcript.
2. Store any key in a server-side environment variable, never in client code.
3. Use generation only for **abstract/ambient** footage (light, particles of dust in a beam, detector grid) — never to depict Edusoft equipment, which must remain physically accurate.
