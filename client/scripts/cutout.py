"""Border-connected backdrop removal for white-background product photos.

Only near-white pixels that are *connected to the image border* become
transparent, so white panels inside the equipment (enclosed by edges or
shading) are preserved. Equipment pixels are never recoloured.
"""
from PIL import Image, ImageDraw, ImageFilter

THRESH = 236   # min(R,G,B) at or above this counts as backdrop-white


def remove_white_backdrop(im: Image.Image) -> Image.Image:
    rgba = im.convert("RGBA")
    rgb = rgba.convert("RGB")
    w, h = rgb.size
    r, g, b = rgb.split()
    near_white = ImageChopsMin(r, g, b).point(lambda v: 255 if v >= THRESH else 0)
    # Flood from every border pixel that is near-white; mark reachable region 128.
    mask = near_white.copy()
    for x in range(0, w, 3):
        for y in (0, h - 1):
            if mask.getpixel((x, y)) == 255:
                ImageDraw.floodfill(mask, (x, y), 128)
    for y in range(0, h, 3):
        for x in (0, w - 1):
            if mask.getpixel((x, y)) == 255:
                ImageDraw.floodfill(mask, (x, y), 128)
    backdrop = mask.point(lambda v: 255 if v == 128 else 0)
    # Soft 1px edge so anti-aliased outlines don't fringe.
    alpha = backdrop.point(lambda v: 255 - v).filter(ImageFilter.GaussianBlur(0.7))
    orig_a = rgba.getchannel("A")
    rgba.putalpha(ImageChopsDarker(alpha, orig_a))
    return rgba


def ImageChopsMin(r, g, b):
    from PIL import ImageChops
    return ImageChops.darker(ImageChops.darker(r, g), b)


def ImageChopsDarker(a, b):
    from PIL import ImageChops
    return ImageChops.darker(a, b)
