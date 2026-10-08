"""
Edusoft media pipeline.

Reads original photography from client/media-src/ (pulled from edusofthealth.com)
and writes responsive, web-optimised derivatives to client/public/media/.

  products  -> public/media/p/<slug>/<index>-<width>.(avif|webp)
  site      -> public/media/s/<name>-<width>.(avif|webp)

It also writes server/data/media-manifest.json, which the API merges into
product responses (image, gallery, images[]).

Product shots are trimmed to their content bounding box and re-padded by a
uniform margin so every product sits at a consistent scale inside cards.
Pixels of the equipment itself are never altered: no retouching, no
generative fill, no recolouring. Only crop, pad, resize and re-encode.

Usage:  python scripts/build_media.py            (from client/)
        python scripts/build_media.py --force    (rebuild everything)
"""
from __future__ import annotations

import base64
import io
import json
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageCms, ImageOps

from cutout import remove_white_backdrop

ROOT = Path(__file__).resolve().parents[1]           # client/
SRC = ROOT / "media-src"
OUT = ROOT / "public" / "media"
DATA = ROOT.parent / "server" / "data"
FORCE = "--force" in sys.argv

PRODUCT_WIDTHS = [320, 640, 960]
SITE_WIDTHS = [640, 1280, 1920]
PAD_RATIO = 0.07          # uniform breathing room around trimmed products
TRIM_KINDS = {"studio", "angle", "detail", "accessory", "packaging", "motion"}
AVIF_Q, WEBP_Q = 58, 80

# Non-product imagery used by the layout (heroes, story sections).
SITE_IMAGES = {
    "lab": "live/stats-bg.jpg",
    "team": "live/team.jpg",
    "clinicians": "live/about.jpeg",
    "workspace": "live/jobs.jpg",
    "hites-300": "live/HITES-Project.jpg",
    "install-odisha": "live/chennai1.jpeg",
    "install-up": "live/UP-Banner.jpeg",
    "install-meghalaya": "live/Meghalaya-Banner.jpeg",
    "install-telangana": "live/Telangana-banner.jpg",
    "radiologist": "gallery/fixed-xray-machines-banner.jpg",
    "handheld-field": "gallery/ultra-portable-handheld-x-ray-5hs-featured1.jpeg",
    "logo": "live/logo.png",
    "partner-iray": "live/iray-v1.jpg",
    "partner-lanmage": "live/lanmage.png",
    "partner-poskom": "live/poskom1.png",
    "partner-vuno": "live/vuno.jpeg",
    "partner-deeptek": "live/deeptek.jpeg",
    "partner-radisen": "live/redisen.png",
}


SRGB = ImageCms.createProfile("sRGB")


def load(path: Path) -> Image.Image:
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)
    icc = im.info.get("icc_profile")
    if icc:
        # Convert embedded colour profiles (Adobe RGB, CMYK press profiles…)
        # to sRGB so colours stay true once the profile is stripped.
        try:
            src_profile = ImageCms.ImageCmsProfile(io.BytesIO(icc))
            out_mode = "RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB"
            if im.mode == "P":
                im = im.convert("RGBA")
            im = ImageCms.profileToProfile(im, src_profile, SRGB, outputMode=out_mode)
        except Exception:
            pass
    # Never carry EXIF/XMP/ICC into web derivatives.
    im.info = {k: v for k, v in im.info.items() if k == "transparency"}
    if im.mode in ("CMYK", "P", "LA", "L", "I;16"):
        im = im.convert("RGBA" if "transparency" in im.info or im.mode in ("P", "LA") else "RGB")
    return im


def background(im: Image.Image) -> str:
    """alpha | white | photo"""
    if im.mode == "RGBA":
        # Transparent only if the *border* is mostly clear — some PNGs carry an
        # alpha channel but still have an opaque white background.
        a = im.getchannel("A")
        w, h = a.size
        edge = [a.getpixel((x, y)) for x in range(0, w, max(1, w // 40)) for y in (0, h - 1)]
        edge += [a.getpixel((x, y)) for y in range(0, h, max(1, h // 40)) for x in (0, w - 1)]
        if sum(1 for v in edge if v < 40) / len(edge) > 0.6:
            return "alpha"
        im = im.convert("RGB")
    rgb = im.convert("RGB")
    w, h = rgb.size
    border = [rgb.getpixel((x, y)) for x in range(0, w, max(1, w // 40)) for y in (0, h - 1)]
    border += [rgb.getpixel((x, y)) for y in range(0, h, max(1, h // 40)) for x in (0, w - 1)]
    white = sum(1 for p in border if min(p) >= 238)
    return "white" if white / len(border) > 0.85 else "photo"


def trim(im: Image.Image, bg: str) -> Image.Image:
    if bg == "alpha":
        box = im.getchannel("A").point(lambda a: 255 if a > 10 else 0).getbbox()
    elif bg == "white":
        rgb = im.convert("RGB")
        diff = ImageChops.difference(rgb, Image.new("RGB", rgb.size, (255, 255, 255)))
        box = diff.convert("L").point(lambda v: 255 if v > 14 else 0).getbbox()
    else:
        return im
    if not box:
        return im
    im = im.crop(box)
    w, h = im.size
    pad = int(max(w, h) * PAD_RATIO)
    fill = (255, 255, 255, 0) if bg == "alpha" else (255, 255, 255)
    mode = "RGBA" if bg == "alpha" else "RGB"
    canvas = Image.new(mode, (w + 2 * pad, h + 2 * pad), fill)
    canvas.paste(im, (pad, pad), im if im.mode == "RGBA" else None)
    return canvas


def lqip(im: Image.Image, bg: str) -> str:
    t = im.copy()
    t.thumbnail((24, 24))
    buf = io.BytesIO()
    t.save(buf, "WEBP", quality=40)
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()


def encode(im: Image.Image, dest_base: Path, widths: list[int]) -> list[int]:
    dest_base.parent.mkdir(parents=True, exist_ok=True)
    made: list[int] = []
    src_w = im.width
    targets = sorted({w for w in widths if w < src_w} | {min(src_w, max(widths))})
    for w in targets:
        h = round(im.height * w / im.width)
        frame = im if w == im.width else im.resize((w, h), Image.LANCZOS)
        if frame.mode not in ("RGB", "RGBA"):
            frame = frame.convert("RGB")
        frame.info = {}
        for fmt, q in (("avif", AVIF_Q), ("webp", WEBP_Q)):
            out = dest_base.parent / f"{dest_base.name}-{w}.{fmt}"
            if FORCE or not out.exists():
                frame.save(out, fmt.upper(), quality=q, method=6) if fmt == "webp" else frame.save(out, "AVIF", quality=q, speed=5)
        made.append(w)
    return made


def build_products() -> dict:
    products = json.loads((DATA / "products.json").read_text(encoding="utf-8"))
    manifest: dict[str, list] = {}
    for p in products:
        entries = []
        for i, m in enumerate(p.get("media", [])):
            src = SRC / m["f"]
            if not src.exists():
                print(f"  ! missing {src.relative_to(ROOT)} for {p['slug']}")
                continue
            im = load(src)
            bg = background(im)
            if m["kind"] in TRIM_KINDS:
                im = trim(im, bg)
                # White studio backdrops become true transparency, unless the
                # product itself is white at the edge (flagged "cutout": false).
                if bg == "white" and m.get("cutout", True):
                    im = remove_white_backdrop(im)
                    bg = "alpha"
            base = OUT / "p" / p["slug"] / f"{i:02d}"
            widths = encode(im, base, PRODUCT_WIDTHS)
            entries.append({
                "src": f"/media/p/{p['slug']}/{i:02d}",
                "widths": widths,
                "w": im.width,
                "h": im.height,
                "bg": bg,
                "kind": m["kind"],
                "lqip": lqip(im, bg) if i == 0 else None,
            })
        manifest[p["slug"]] = entries
        print(f"  {p['slug']:<32} {len(entries)} image(s)")
    return manifest


def build_site() -> dict:
    site = {}
    for name, rel in SITE_IMAGES.items():
        src = SRC / rel
        if not src.exists():
            print(f"  ! missing {rel}")
            continue
        im = load(src)
        bg = background(im)
        widths = encode(im, OUT / "s" / name, SITE_WIDTHS if im.width > 700 else [im.width])
        site[name] = {"src": f"/media/s/{name}", "widths": widths, "w": im.width, "h": im.height, "bg": bg, "lqip": lqip(im, bg)}
        print(f"  site/{name:<26} {im.width}x{im.height} {bg}")
    return site


if __name__ == "__main__":
    print("Products")
    prod = build_products()
    print("Site")
    site = build_site()
    (DATA / "media-manifest.json").write_text(json.dumps({"products": prod, "site": site}, indent=1), encoding="utf-8")
    # Layout imagery is static, so the client imports it directly.
    (ROOT / "src" / "content").mkdir(exist_ok=True)
    (ROOT / "src" / "content" / "siteMedia.json").write_text(json.dumps(site, indent=1), encoding="utf-8")
    total = sum(f.stat().st_size for f in OUT.rglob("*") if f.is_file())
    print(f"\nWrote {sum(1 for _ in OUT.rglob('*.*'))} files, {total/1024/1024:.1f} MB -> public/media")
