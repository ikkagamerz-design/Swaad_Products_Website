"""
Generates the illustrated, grainy background art for the site.

    .venv/Scripts/python scripts/backgrounds.py

public/art/hero-sky.webp      sunrise sky: gradient, sun, rays, puffy clouds
public/art/stage.webp         dreamy billowing cloudscape for the flavour stage
public/art/swirl-<id>.webp    psychedelic warped swirl, one per flavour
public/art/grain.png          small tileable grain overlay
"""

from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "art"
OUT.mkdir(parents=True, exist_ok=True)
W, H = 1920, 1080
rng = np.random.default_rng(7)


def hex2rgb(h):
    h = h.lstrip("#")
    return np.array([int(h[i : i + 2], 16) for i in (0, 2, 4)], np.float32)


def ramp(t, stops):
    """Map t in 0..1 through a list of (pos, hex) colour stops."""
    t = np.clip(t, 0, 1)
    out = np.zeros(t.shape + (3,), np.float32)
    for (p0, c0), (p1, c1) in zip(stops[:-1], stops[1:]):
        m = (t >= p0) & (t <= p1)
        k = ((t[m] - p0) / max(p1 - p0, 1e-6))[..., None]
        k = k * k * (3 - 2 * k)
        out[m] = hex2rgb(c0) * (1 - k) + hex2rgb(c1) * k
    return out


def grain(img, amount=11.0):
    n = rng.normal(0, amount, img.shape[:2]).astype(np.float32)[..., None]
    return np.clip(img + n, 0, 255)


def save(img, name, q=86):
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(OUT / name, quality=q, method=6)
    print("wrote", name)


def puff(canvas, cx, cy, r, light, shade, rim=None):
    """Paint one shaded sphere-like cloud puff (light from top-left)."""
    x0, x1 = int(max(cx - r - 2, 0)), int(min(cx + r + 2, canvas.shape[1]))
    y0, y1 = int(max(cy - r - 2, 0)), int(min(cy + r + 2, canvas.shape[0]))
    if x0 >= x1 or y0 >= y1:
        return
    yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    a = np.clip((r - d) / 2.5, 0, 1)[..., None]
    lx, ly = cx - 0.38 * r, cy - 0.45 * r
    dl = np.sqrt((xx - lx) ** 2 + (yy - ly) ** 2) / (1.45 * r)
    col = ramp(dl, [(0, light), (0.55, light if rim is None else rim), (1, shade)])
    region = canvas[y0:y1, x0:x1]
    region[:] = region * (1 - a) + col * a


def cloud(canvas, cx, cy, size, light, shade, rim=None, n=14, flat=0.42):
    """A cumulus cloud made of puffs, flatter at the bottom."""
    pts = []
    for _ in range(n):
        ang = rng.uniform(np.pi * 1.05, np.pi * 1.95)  # mostly upper half
        dist = rng.uniform(0.15, 0.85) * size
        pts.append((cx + np.cos(ang) * dist * 1.5, cy + np.sin(ang) * dist * flat * 1.6, rng.uniform(0.35, 0.62) * size))
    for _ in range(n // 2):  # base row
        pts.append((cx + rng.uniform(-1.2, 1.2) * size, cy + rng.uniform(-0.05, 0.12) * size, rng.uniform(0.3, 0.45) * size))
    pts.sort(key=lambda p: p[1])  # paint back (higher) puffs first
    for x, y, r in pts:
        puff(canvas, x, y, r, light, shade, rim)


# ---------------------------------------------------------------- hero sky
def hero_sky():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    t = yy / H
    img = ramp(t, [(0, "#7A2BB8"), (0.28, "#E8358C"), (0.52, "#FF7A2E"), (0.66, "#FFC53D"), (0.7, "#FFE37A"), (1, "#FF9A2E")])
    sx, sy, sr = W * 0.5, H * 0.62, 190
    ang = np.arctan2(yy - sy, xx - sx)
    dist = np.sqrt((xx - sx) ** 2 + (yy - sy) ** 2)
    rays = (np.sin(ang * 18) > 0.25).astype(np.float32)
    rays = cv2.GaussianBlur(rays, (0, 0), 3)
    rays *= np.clip(1 - dist / 1300, 0, 1) * (dist > sr)
    img = img + (np.array([255, 236, 170]) - img) * (rays * 0.28)[..., None]
    glow = np.exp(-((dist / 520) ** 2))[..., None]
    img = img + (np.array([255, 240, 170]) - img) * glow * 0.55
    sun = np.clip((sr - dist) / 2, 0, 1)[..., None]
    sun_col = ramp((yy - (sy - sr)) / (2 * sr), [(0, "#FFF6B8"), (1, "#FFC23A")])
    img = img * (1 - sun) + sun_col * sun
    # horizon band (sea of light) below the sun
    hz = (yy > H * 0.66).astype(np.float32)[..., None]
    band = ramp((yy - H * 0.66) / (H * 0.34), [(0, "#FFD75E"), (0.4, "#FF8A2A"), (1, "#E2366F")])
    img = img * (1 - hz) + band * hz
    # streaks on the horizon
    for k in range(9):
        y = int(H * 0.68 + k * k * 4.5)
        cv2.line(img, (0, y), (W, y), (255, 230, 150), 2 + k // 3, cv2.LINE_AA)
    img = cv2.GaussianBlur(img, (0, 0), 1.2)
    # clouds: big pink/orange puffy masses
    clouds = [
        (230, 260, 230), (640, 150, 170), (1480, 200, 240), (1820, 340, 190),
        (60, 560, 170), (1900, 640, 170), (1030, 90, 130),
    ]
    layer = img.copy()
    for cx, cy, s in clouds:
        cloud(layer, cx, cy, s, "#FFE6CC", "#C2367A", rim="#FF9FB0", n=30)
    img = cv2.GaussianBlur(layer, (0, 0), 1.6)
    save(grain(img, 10), "hero-sky.webp")


# ---------------------------------------------------------------- flavour stage
def stage():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    img = ramp(yy / H, [(0, "#B85BD6"), (0.35, "#F25C9A"), (0.62, "#FF9F45"), (1, "#FFC85A")])
    sx, sy = W * 0.5, H * 0.74
    dist = np.sqrt((xx - sx) ** 2 + (yy - sy) ** 2)
    img = img + (np.array([255, 236, 150]) - img) * np.exp(-((dist / 420) ** 2))[..., None] * 0.8
    sun = np.clip((150 - dist) / 2, 0, 1)[..., None]
    img = img * (1 - sun) + np.array([255, 226, 90]) * sun
    # billowing walls of clouds on both sides and a carpet below
    for _ in range(70):
        side = rng.choice([-1, 1])
        x = W / 2 + side * rng.uniform(380, 1050)
        y = rng.uniform(80, H)
        s = rng.uniform(60, 150)
        cloud(img, x, y, s, "#FFD39A", "#D2357E", rim="#FF8A6A", n=8)
    for _ in range(55):
        cloud(img, rng.uniform(-100, W + 100), rng.uniform(H * 0.8, H + 60), rng.uniform(70, 140), "#FFE1A6", "#E2487A", rim="#FFA36A", n=8)
    img = cv2.GaussianBlur(img, (0, 0), 1.0)
    save(grain(img, 11), "stage.webp")


# ---------------------------------------------------------------- swirls
SWIRLS = {
    "elaichi": [(0, "#3F7D0A"), (0.25, "#9BC52B"), (0.5, "#F4E14A"), (0.75, "#C9DA2B"), (1, "#3F7D0A")],
    "milk": [(0, "#0B4FA8"), (0.25, "#1A8FE3"), (0.5, "#F4FBFF"), (0.75, "#7CC8FF"), (1, "#0B4FA8")],
    "jumbo": [(0, "#C2210F"), (0.25, "#F26A12"), (0.5, "#FFD34A"), (0.75, "#FF8C1A"), (1, "#C2210F")],
}


def swirl(name, stops):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    cx, cy = W * 0.5, H * 0.5
    x, y = (xx - cx) / H, (yy - cy) / H
    r = np.sqrt(x * x + y * y)
    a = np.arctan2(y, x)
    warp = (
        0.09 * np.sin(a * 7 + r * 9)
        + 0.06 * np.sin(a * 11 - r * 14 + 1.3)
        + 0.05 * np.sin(x * 9 + y * 6) * np.cos(y * 7 - x * 4)
    )
    v = (r * 5.2 + warp * 6 + np.sin(a * 5) * 0.12) % 1.0
    img = ramp(v, stops)
    img = cv2.GaussianBlur(img, (0, 0), 6)
    # vignette toward the deep colour
    deep = hex2rgb(stops[0][1])
    img = img + (deep - img) * np.clip((r - 0.55) / 0.6, 0, 1)[..., None] * 0.5
    save(grain(img, 13), f"swirl-{name}.webp")


def grain_tile():
    n = rng.normal(128, 40, (256, 256)).clip(0, 255).astype(np.uint8)
    a = np.full((256, 256), 34, np.uint8)
    Image.fromarray(np.dstack([n, n, n, a]), "RGBA").save(OUT / "grain.png", optimize=True)
    print("wrote grain.png")


if __name__ == "__main__":
    hero_sky()
    stage()
    for k, s in SWIRLS.items():
        swirl(k, s)
    grain_tile()
