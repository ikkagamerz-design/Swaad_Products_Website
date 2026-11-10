"""
Clean transparent cutouts of the three Swaad packs.

    .venv/Scripts/python scripts/cutout.py

Input : assets/source/product-1.jpg, product-2.jpg, product-3.jpg
Output: public/products/pack-N.png  (full-res, transparent, trimmed)
        public/products/pack-N.webp (site version, 1400px tall)
        assets/preview/pack-N-check.png (cutout on a dark + checker background)

Method
1. rembg (ISNet AI matting model) predicts a soft alpha mask of the pack.
2. The mask is cleaned: keep only the largest object, fill holes inside it,
   so text/white areas on the pack never turn see-through.
3. The edge is refined: a thin band around the outline is re-matted with a
   guided blur so the crimped seals stay crisp but without jaggies or a halo.
4. White fringe left by the studio background is removed from edge pixels
   (colour decontamination), so the pack sits cleanly on any colour.
"""

from pathlib import Path
import sys

import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "source"
OUT = ROOT / "public" / "products"
PREVIEW = ROOT / "assets" / "preview"
OUT.mkdir(parents=True, exist_ok=True)
PREVIEW.mkdir(parents=True, exist_ok=True)

session = new_session("isnet-general-use")


def ai_mask(rgb: np.ndarray) -> np.ndarray:
    """Soft alpha 0..1 from the AI model."""
    cut = remove(Image.fromarray(rgb), session=session, only_mask=True, post_process_mask=False)
    return np.asarray(cut, dtype=np.float32) / 255.0


def colour_mask(rgb: np.ndarray) -> np.ndarray:
    """Soft mask of everything that is not the white studio background.

    Used together with the AI mask for packs whose printed label the model can
    mistake for background (the orange Jumbo pack)."""
    img = cv2.GaussianBlur(rgb, (5, 5), 0).astype(np.float32)
    dist = np.sqrt(((255.0 - img) ** 2).sum(axis=2))  # distance from pure white
    soft = np.clip((dist - 18.0) / 30.0, 0, 1)
    hard = (soft > 0.5).astype(np.uint8)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (25, 25))
    hard = cv2.morphologyEx(hard, cv2.MORPH_CLOSE, k)  # bridge pale plastic gaps
    return np.maximum(soft, hard.astype(np.float32) * (soft > 0.15))


def grabcut_mask(rgb: np.ndarray, ai: np.ndarray) -> np.ndarray:
    """Whole-pack mask via GrabCut, seeded with what we know for sure:
    the AI's confident pixels and the saturated printed label are pack,
    the photo border is background."""
    s = 0.5  # run at half size for speed, upscale the result
    small = cv2.resize(rgb, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
    ai_s = cv2.resize(ai, (small.shape[1], small.shape[0]), interpolation=cv2.INTER_AREA)
    h, w = small.shape[:2]
    hsv = cv2.cvtColor(small, cv2.COLOR_RGB2HSV)
    mask = np.full((h, w), cv2.GC_PR_BGD, np.uint8)
    b = max(4, int(0.012 * min(h, w)))
    mask[b:-b, b:-b] = cv2.GC_PR_FGD
    sure_fg = (ai_s > 0.8) | ((hsv[..., 1] > 90) & (hsv[..., 2] > 60))
    sure_fg = cv2.erode(sure_fg.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    mask[sure_fg] = cv2.GC_FGD
    mask[:b, :] = mask[-b:, :] = cv2.GC_BGD
    mask[:, :b] = mask[:, -b:] = cv2.GC_BGD
    bgd = np.zeros((1, 65), np.float64)
    fgd = np.zeros((1, 65), np.float64)
    cv2.grabCut(cv2.cvtColor(small, cv2.COLOR_RGB2BGR), mask, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
    fg = np.isin(mask, (cv2.GC_FGD, cv2.GC_PR_FGD)).astype(np.float32)
    fg = cv2.resize(fg, (rgb.shape[1], rgb.shape[0]), interpolation=cv2.INTER_LINEAR)
    return np.maximum(fg, ai)


def trim_white_edges(rgb: np.ndarray, a: np.ndarray, limit: float = 0.55) -> np.ndarray:
    """Cut away outer rows/columns that are mostly pale plastic or background,
    working inward from each side until a row with real pack content appears."""
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    pale = (hsv[..., 2] > 200) & (hsv[..., 1] < 40)
    inside = a > 0.5
    a = a.copy()

    def frac(sel_pale, sel_in):
        n = sel_in.sum()
        return 1.0 if n == 0 else (sel_pale & sel_in).sum() / n

    h, w = a.shape
    y0, y1, x0, x1 = 0, h - 1, 0, w - 1
    while y0 < h // 3 and frac(pale[y0], inside[y0]) > limit:
        y0 += 1
    while y1 > 2 * h // 3 and frac(pale[y1], inside[y1]) > limit:
        y1 -= 1
    while x0 < w // 3 and frac(pale[:, x0], inside[:, x0]) > limit:
        x0 += 1
    while x1 > 2 * w // 3 and frac(pale[:, x1], inside[:, x1]) > limit:
        x1 -= 1
    keep = np.zeros_like(a)
    keep[y0 : y1 + 1, x0 : x1 + 1] = 1
    keep = cv2.GaussianBlur(keep, (5, 5), 1.0)  # soft cut, no hard jaggy line
    return a * keep


def solid_core(alpha: np.ndarray) -> np.ndarray:
    """Binary mask of the pack: largest component with every hole filled."""
    hard = (alpha > 0.5).astype(np.uint8)
    n, labels, stats, _ = cv2.connectedComponentsWithStats(hard, 8)
    if n > 1:
        biggest = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        hard = (labels == biggest).astype(np.uint8)
    # fill holes: flood the background from the border, everything not reached is inside
    h, w = hard.shape
    flood = hard.copy() * 255
    ff = np.zeros((h + 2, w + 2), np.uint8)
    cv2.floodFill(flood, ff, (0, 0), 128)
    inside = (flood != 128).astype(np.uint8)
    return inside


def refine(rgb: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    core = solid_core(alpha)
    # smooth the outline slightly (removes stair-steps) then feather 1px
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    core = cv2.morphologyEx(core, cv2.MORPH_OPEN, k)
    core = cv2.morphologyEx(core, cv2.MORPH_CLOSE, k)
    hard = core.astype(np.float32)

    # edge band where the soft AI alpha is trusted (keeps crimp detail)
    band = cv2.dilate(core, k, iterations=2) - cv2.erode(core, k, iterations=2)
    soft = np.clip(alpha, 0, 1)
    a = np.where(band > 0, soft, hard)
    a = np.where(cv2.erode(core, k, iterations=2) > 0, 1.0, a)  # interior always solid
    a = cv2.GaussianBlur(a, (3, 3), 0.6)
    a[a < 0.04] = 0
    a[a > 0.97] = 1
    return a


def decontaminate(rgb: np.ndarray, a: np.ndarray, bg=(255, 255, 255)) -> np.ndarray:
    """Remove the white studio background mixed into semi-transparent edge pixels."""
    img = rgb.astype(np.float32)
    bgv = np.array(bg, np.float32)
    edge = (a > 0) & (a < 1)
    aa = np.clip(a[..., None], 0.05, 1)
    fg = (img - (1 - aa) * bgv) / aa
    out = img.copy()
    out[edge] = np.clip(fg[edge], 0, 255)
    # the outermost ring also gets pulled toward its inner neighbours' colour
    inner = cv2.erode((a >= 1).astype(np.uint8), np.ones((3, 3), np.uint8))
    blur = cv2.GaussianBlur(img * inner[..., None], (9, 9), 0)
    wsum = cv2.GaussianBlur(inner.astype(np.float32), (9, 9), 0)[..., None]
    fill = np.where(wsum > 1e-3, blur / np.maximum(wsum, 1e-3), img)
    ring = (a > 0) & (a < 0.6)
    out[ring] = fill[ring] * 0.6 + out[ring] * 0.4
    return out.astype(np.uint8)


def checker_preview(rgba: Image.Image) -> Image.Image:
    w, h = rgba.size
    tile = 24
    yy, xx = np.mgrid[0:h, 0:w]
    chk = (((xx // tile) + (yy // tile)) % 2).astype(np.uint8)
    base = np.where(chk[..., None] == 1, [70, 70, 80], [40, 40, 48]).astype(np.uint8)
    left = Image.fromarray(base)
    left.paste(rgba, (0, 0), rgba)
    right = Image.new("RGB", (w, h), (232, 60, 40))
    right.paste(rgba, (0, 0), rgba)
    sheet = Image.new("RGB", (w * 2 + 20, h), (255, 255, 255))
    sheet.paste(left, (0, 0))
    sheet.paste(right, (w + 20, 0))
    return sheet


def rounded_rect(mask: np.ndarray, x0, y0, x1, y1, r) -> None:
    """Draw a filled anti-aliased rounded rectangle (value 255) into mask."""
    r = int(r)
    cv2.rectangle(mask, (x0 + r, y0), (x1 - r, y1), 255, -1, cv2.LINE_AA)
    cv2.rectangle(mask, (x0, y0 + r), (x1, y1 - r), 255, -1, cv2.LINE_AA)
    for cx, cy in ((x0 + r, y0 + r), (x1 - r, y0 + r), (x0 + r, y1 - r), (x1 - r, y1 - r)):
        cv2.circle(mask, (cx, cy), r, 255, -1, cv2.LINE_AA)


def rebuild_pack3() -> Image.Image:
    """The Jumbo pack is a rectangular block wrapped in clear film, which AI
    matting cannot separate from the white studio background. Instead of
    cutting it out, rebuild it from clean geometric crops of the photo:
    the rusk block as a rounded rectangle, the orange SWAAD label running
    up over its top edge, plus a soft film sheen and edge shading for volume.
    Every pixel of the pack itself comes straight from the photo."""
    S = 3  # upscale factor
    src = np.asarray(Image.open(SRC / "product-3.jpg").convert("RGB"))
    src = cv2.resize(src, None, fx=S, fy=S, interpolation=cv2.INTER_LANCZOS4)

    # source-photo coordinates (measured on the 750x995 original)
    X0, X1 = 10, 726        # rusk block left/right
    LY0, BY0, Y1 = 47, 76, 874  # label top, block top, bottom
    LX0, LX1 = 100, 634     # label left/right (inside its slightly tilted edges)

    crop = src[LY0 * S : Y1 * S, X0 * S : X1 * S].copy()
    h, w = crop.shape[:2]
    m = np.zeros((h, w), np.uint8)
    rounded_rect(m, 0, (BY0 - LY0) * S, w - 1, h - 1, 20 * S)                    # rusk block
    rounded_rect(m, (LX0 - X0) * S, 0, (LX1 - X0) * S, (BY0 - LY0 + 40) * S, 5 * S)  # label top
    alpha = m.astype(np.float32) / 255.0

    img = crop.astype(np.float32)
    # volume: darken the outer edges of the block a little, like a curved wrap
    xs = np.linspace(-1, 1, w)[None, :]
    edge = 1 - 0.16 * np.clip((np.abs(xs) - 0.78) / 0.22, 0, 1) ** 1.5
    img *= edge[..., None]
    # film sheen: a soft diagonal highlight band across the pack
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = (xx / w * 0.9 + yy / h * 0.55) - 0.42
    sheen = np.exp(-(d / 0.07) ** 2) * 0.22 + np.exp(-((d - 0.5) / 0.04) ** 2) * 0.1
    img = img + (255 - img) * sheen[..., None]
    out = np.dstack([np.clip(img, 0, 255).astype(np.uint8), (alpha * 255).astype(np.uint8)])
    return Image.fromarray(out, "RGBA")


def save_pack(n: int, img: Image.Image) -> None:
    img = img.crop(img.getbbox())
    img.save(OUT / f"pack-{n}.png", optimize=True)
    web = img.resize((round(img.width * 1400 / img.height), 1400), Image.LANCZOS)
    web.save(OUT / f"pack-{n}.webp", quality=92, method=6)
    prev = img.resize((round(img.width * 700 / img.height), 700), Image.LANCZOS)
    checker_preview(prev).save(PREVIEW / f"pack-{n}-check.png")
    print(f"pack-{n}: {img.width}x{img.height}")


def process(n: int) -> None:
    if n == 3:
        save_pack(3, rebuild_pack3())
        return
    src = SRC / f"product-{n}.jpg"
    rgb = np.asarray(Image.open(src).convert("RGB"))
    # work at 2x so edges stay smooth when the site scales the pack up
    rgb = cv2.resize(rgb, None, fx=2, fy=2, interpolation=cv2.INTER_LANCZOS4)
    alpha = ai_mask(rgb)
    if n == 3:  # AI drops the orange label on this pack; rebuild the mask with GrabCut
        alpha = grabcut_mask(rgb, alpha)
    a = refine(rgb, alpha)
    if n == 3:
        a = trim_white_edges(rgb, a)
    colour = decontaminate(rgb, a)
    rgba = np.dstack([colour, (a * 255).round().astype(np.uint8)])
    img = Image.fromarray(rgba, "RGBA")
    img = img.crop(img.getbbox())
    img.save(OUT / f"pack-{n}.png", optimize=True)
    web = img.resize((round(img.width * 1400 / img.height), 1400), Image.LANCZOS)
    web.save(OUT / f"pack-{n}.webp", quality=92, method=6)
    prev = img.resize((round(img.width * 700 / img.height), 700), Image.LANCZOS)
    checker_preview(prev).save(PREVIEW / f"pack-{n}-check.png")
    print(f"pack-{n}: {img.width}x{img.height}")


if __name__ == "__main__":
    for n in (int(x) for x in sys.argv[1:]) if len(sys.argv) > 1 else (1, 2, 3):
        process(n)
