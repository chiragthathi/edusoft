# Motion System

One library (**framer-motion**, already a dependency — no GSAP added), one vocabulary.

## Tokens (`client/src/lib/motion.ts` ↔ `tokens.css`)

| Token | Value | Use |
|---|---|---|
| `ease.out` | `cubic-bezier(.16,1,.3,1)` | arrivals, reveals |
| `ease.inOut` | `cubic-bezier(.65,0,.35,1)` | state changes, page transitions, exposure wipe |
| `ease.spring` | `cubic-bezier(.34,1.56,.64,1)` | micro-feedback only (play button) |
| `dur.fast` | 180 ms | hover, focus, chips |
| `dur.normal` | 360 ms | menus, accordions, tabs |
| `dur.slow` | 720 ms | section reveals, image fades |
| `dur.cinematic` | 1200 ms | exposure reveal, hero product change |

## Primitives (`components/motion/Reveal.tsx`)

| Primitive | Behaviour |
|---|---|
| `Reveal` | 24px rise + fade on first entry (`viewport once, -12% bottom margin`) |
| `RevealGroup` / `RevealItem` | staggered children (80 ms) |
| `MaskLines` | headline lines slide up from behind a clip — the typographic entrance |
| `ExposureReveal` | clip wipe top→bottom with a leading luminous scan line (signature) |
| `Parallax` | scroll-linked drift (±amount px) — used on 2 images only |
| `Counter` | count-up for figures ("4,200+", "3.5", "~150"), `aria-label` holds the real value |
| `useSectionProgress` | smoothed scroll progress helper |

## Interaction primitives (`components/motion/Interactive.tsx`)

| Primitive | Behaviour |
|---|---|
| `Magnetic` | CTA leans toward the cursor on a spring (fine pointers only) — hero, service CTAs (`<Button magnetic>`) |
| `TiltStage` | Surface tilts up to 3–5° toward the pointer with a cursor-following soft light; tracks the nearest `[data-tilt-root]` so stretched-link cards still respond. Hero stage adds depth layers (`translateZ`) |
| `ScrollProgress` | Brand hairline under the solid header |
| `BackToTop` | Floating button after the first screen, with a circular scroll-progress ring (replaces the footer button) |
| `Marquee` | Infinite certification band, pauses on hover |

## Opening sequence (`components/layout/IntroLoader.tsx`)
5 s, once per browser session: crop marks draw → scan line exposes the logo (latent → glowing) → tagline tracks in → readout 000→100 with system status lines → panel lifts (clip wipe) to reveal the hero, whose headline/product wait for it (`useIntro().done`). No skip button; Esc dismisses it. Reduced motion: 1 s fade. A pre-React ink screen (`html.intro`) prevents a white flash.

## Route curtain
Ink panel with the logo sweeps up over the outgoing page (0.45 s) and lifts off the incoming one (0.65 s). Not played on first load or with reduced motion.

## Timed carousels
- **Clinical settings** — 6 s per care setting, timer line under the active row (pill fill on mobile).
- **Customer voices** — 7 s per statement, story-style progress bars, word-by-word blur reveal.
Both run only while on screen and pause on hover/focus.

## Headline reveal
`MaskLines` now reveals word by word: each word rises from its own mask while de-blurring (45 ms stagger).

## Catalogue of motion

| Where | Motion |
|---|---|
| Route change | fade + 12px rise in, 8px up out (`AnimatePresence mode="wait"`) |
| Header | background/blur transition on scroll; nav active indicator shares a `layoutId` |
| Mega menu | clip-path drop (380 ms), preview crossfade per category, page dim |
| Mobile menu | full-screen clip wipe, staggered items, accordion |
| Home hero | word-by-word headline; product changes every 6.5 s with exposure wipe + scan line (all four products stay mounted and preloaded — only the active one is shown); autoplay pauses when the tab is hidden or the hero is off-screen; DICOM readouts crossfade; progress bars; stage dims to 50% at most on scroll (no scroll-jacking) |
| Technology story | pinned column (CSS sticky) crossfades copy as each panel crosses the viewport centre; progress rail fills |
| Featured rail | native scroll-snap; pointer drag on desktop with click-suppression |
| Service timeline | rail draws with scroll (`scaleX` bound to progress) |
| Deployments | exposure reveal on field reports, count-ups |
| Product card hover | product lifts 1.5% + scales 3.5%, metric fades in, arrow chip rises |
| Product hero | exposure reveal, masked title, staggered CTAs |
| Gallery | directional slide + fade |
| Spec / FAQ accordions | height + opacity |
| Buttons | colour/shadow 180 ms, arrow nudges 3px, press 1px |

## Reduced motion

`prefers-reduced-motion: reduce` →
- CSS: all animations/transitions collapse to ~0 ms, smooth scroll off.
- JS: `useReducedMotion()` disables hero autoplay, exposure wipes, parallax, page transitions, inertia and the viewer's rotation hint; reveals render static; counters show final values.

## Rules
1. Motion explains structure (arrival, hierarchy, state) — never decoration loops.
2. Only `transform`, `opacity`, `clip-path`, `filter` are animated (GPU-friendly). No layout-property animation except accordions.
3. Nothing hijacks native scroll.
4. The exposure reveal is rationed: hero, product hero, key images — not every image.
