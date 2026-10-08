# 360° / Multi-angle System

## Component
`client/src/components/product/MultiAngleViewer.tsx`

- Frame-sequence viewer: all frames stacked, only the current one visible → no reflow while rotating.
- **Input**: pointer drag (mouse, pen), touch swipe (`touch-action: pan-y` keeps vertical page scroll), **inertia** with friction after release, keyboard ←/→/Home/End.
- **Accessibility**: `role="slider"` with `aria-valuenow/min/max` and `aria-valuetext` ("Image 2 of 4").
- **Progressive loading**: frame 0 eager; remaining frames decode in the background only once the viewer is within 200px of the viewport; a % readout shows until all frames are ready.
- **Hint**: one gentle rotation when first ready (skipped with reduced motion).
- Drag sensitivity adapts: 90 px/frame for ≤ 8 frames, 12 px/frame for turntable sets.
- Gantry-style angle scale + DICOM frame counter.

## Data
```json
"spin": { "frames": [0, 1, 2, 3], "label": "4 angles" }
```
`frames` are indices into the product's `media` array. Frames used by the viewer are excluded from the gallery below it.

## Live today
**TRIMAX TX40** — 4 genuine rotation photographs from edusofthealth.com, labelled honestly as "4 angles". No product is presented as 360° from a single image.

## Producing true 360° sets
1. Turntable, fixed camera, fixed lighting; seamless white or neutral backdrop.
2. **36 frames** (10° steps) for web; **72** (5°) for flagship products.
3. Shoot ≥ 2400 px; name `NN.jpg` in rotation order.
4. Drop into `client/media-src/spin/<slug>/`, add the files to the product's `media` with `"kind": "angle"`, set `spin.frames` to their indices, run `python scripts/build_media.py`.
5. Each frame is encoded at 320/640/960 AVIF+WebP; the viewer requests 960 px WebP. Budget: 36 frames ≈ 1–1.5 MB, fetched only after the viewer nears the viewport.

### Recommended first products
ERAY SMART 6HS · ERAY Smart 5C Premium Pro · 50kW Motorized Mobile · ERAY Gold 100 · Ceiling Suspended DR (partial arc).
