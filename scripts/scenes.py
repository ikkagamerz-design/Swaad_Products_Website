"""
Food-themed scene art (replaces the cloud backgrounds).

    .venv/Scripts/python scripts/scenes.py

public/art/hero-sky.webp  golden wheat-farm sunrise with hay bales (like the pack illustration)
public/art/stage.webp     warm chai-time table: wooden top, glowing bokeh, steam
public/art/chai.webp      chai-and-milk marbled swirl
"""

import sys
from pathlib import Path

import cv2
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from backgrounds import H, W, grain, ramp, save  # noqa: E402


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def ridge(xs, base, amps, seed):
    r = np.random.default_rng(seed)
    y = np.full_like(xs, base, dtype=np.float32)
    for amp, freq in amps:
        y += amp * np.sin(xs * freq + r.uniform(0, 6.28))
    return y


def hay_bale(img, cx, cy, r):
    """Round hay bale seen from the front: golden disc with a spiral."""
    x0, x1, y0, y1 = int(cx - r - 3), int(cx + r + 3), int(cy - r - 3), int(cy + r + 3)
    yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    a = np.clip((r - d) / 1.5, 0, 1)[..., None]
    ang = np.arctan2(yy - cy, xx - cx)
    spiral = 0.5 + 0.5 * np.sin(d / r * 34 - ang)
    shade = 1 - 0.35 * smoothstep(-0.2, 1.0, ((xx - cx) + (yy - cy)) / r)
    col = np.array([240, 198, 100], np.float32) * (0.8 + 0.2 * spiral)[..., None] * shade[..., None]
    col *= 1 - np.clip((d - (r - 6)) / 6, 0, 1)[..., None] * 0.35
    reg = img[y0:y1, x0:x1]
    reg[:] = reg * (1 - a) + col * a


def wheat_ear(img, x, y, length, angle, blur=0.0):
    col, dark = (228, 176, 66), (168, 112, 30)
    layer = np.zeros_like(img)
    mask = np.zeros(img.shape[:2], np.float32)
    dx, dy = np.sin(angle), -np.cos(angle)
    tip = (int(x + dx * length * 2.0), int(y + dy * length * 2.0))
    base = (int(x - dx * 500), int(y + 500))
    for tgt in (layer, mask):
        cv2.line(tgt, base, tip, dark if tgt is layer else 1.0, 4, cv2.LINE_AA)
    for k in range(9):
        t = 0.9 + k * 0.12
        px, py = x + dx * length * t, y + dy * length * t
        for side in (-1, 1):
            c = (int(px + side * 9 * np.cos(angle)), int(py + side * 9 * np.sin(angle)))
            axes = (max(int(length * 0.07), 2), max(int(length * 0.15), 3))
            deg = float(np.degrees(angle) + side * 25)
            cv2.ellipse(layer, c, axes, deg, 0, 360, col, -1, cv2.LINE_AA)
            cv2.ellipse(layer, c, axes, deg, 0, 360, dark, 2, cv2.LINE_AA)
            cv2.ellipse(mask, c, axes, deg, 0, 360, 1.0, -1, cv2.LINE_AA)
    if blur:
        layer = cv2.GaussianBlur(layer, (0, 0), blur)
        mask = cv2.GaussianBlur(mask, (0, 0), blur)
        layer = layer / np.maximum(mask[..., None], 1e-3) * (mask[..., None] > 1e-3)
    m = np.clip(mask, 0, 1)[..., None]
    img[:] = img * (1 - m) + layer * m


def farm_sunrise():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    img = ramp(yy / H, [(0, "#FFF1CF"), (0.3, "#FFDB93"), (0.5, "#FFC067"), (1, "#F5A443")])
    sx, sy = W * 0.5, H * 0.52
    dist = np.sqrt((xx - sx) ** 2 + (yy - sy) ** 2)
    ang = np.arctan2(yy - sy, xx - sx)
    rays = cv2.GaussianBlur((np.sin(ang * 16) > 0.35).astype(np.float32), (0, 0), 4)
    img += (np.array([255, 250, 225]) - img) * (rays * np.clip(1 - dist / 1100, 0, 1) * 0.22)[..., None]
    img += (np.array([255, 248, 210]) - img) * np.exp(-((dist / 380) ** 2))[..., None] * 0.7
    sun = np.clip((150 - dist) / 2, 0, 1)[..., None]
    img = img * (1 - sun) + np.array([255, 244, 196]) * sun

    xs = np.arange(W, dtype=np.float32)
    layers = [
        (0.56, "#E9B85C", "#DDA548", [(14, 0.004), (8, 0.011)], 1),
        (0.63, "#D9A640", "#C88F2E", [(20, 0.003), (10, 0.009)], 2),
        (0.72, "#C99631", "#B07A22", [(26, 0.0025), (12, 0.007)], 3),
        (0.84, "#B98724", "#93641A", [(30, 0.002), (14, 0.006)], 4),
    ]
    for i, (base, c0, c1, amps, seed) in enumerate(layers):
        top = ridge(xs, H * base, amps, seed)
        m = cv2.GaussianBlur((yy >= top[None, :]).astype(np.float32), (0, 0), 1.2)[..., None]
        fill = ramp((yy - top[None, :]) / (H * 0.3), [(0, c0), (1, c1)])
        if i >= 2:  # furrows converging to the horizon
            rows = 0.5 + 0.5 * np.sin((xx - W / 2) / np.maximum(yy - H * 0.45 + 40, 1.0) * 60)
            fill *= (0.9 + 0.1 * rows)[..., None]
        img = img * (1 - m) + fill * m
        if i == 0:  # cypress trees and a farmhouse, like the sketch on the pack
            for tx in (300, 336, 1500, 1536, 1572):
                cv2.ellipse(img, (tx, int(top[tx]) - 40), (14, 52), 0, 0, 360, (150, 120, 52), -1, cv2.LINE_AA)
            hx, hy = 1320, int(top[1320]) - 4
            cv2.rectangle(img, (hx, hy - 50), (hx + 110, hy), (236, 202, 136), -1)
            roof = np.array([[hx - 10, hy - 50], [hx + 55, hy - 92], [hx + 120, hy - 50]], np.int32)
            cv2.fillPoly(img, [roof], (178, 110, 60), cv2.LINE_AA)
            for wx in (hx + 18, hx + 72):
                cv2.rectangle(img, (wx, hy - 36), (wx + 18, hy - 18), (150, 108, 58), -1)
        if i == 1:
            hay_bale(img, 420, top[420] + 30, 46)
            hay_bale(img, 1560, top[1560] + 34, 40)
        if i == 2:
            hay_bale(img, 230, top[230] + 60, 78)
            hay_bale(img, 1700, top[1700] + 56, 70)

    r = np.random.default_rng(11)  # out-of-focus wheat framing both sides
    for _ in range(28):
        side = r.integers(0, 2)
        x = r.uniform(-40, 320) if side == 0 else r.uniform(W - 320, W + 40)
        wheat_ear(img, x, r.uniform(H * 0.62, H * 0.86), r.uniform(70, 115), r.uniform(-0.35, 0.35), blur=float(r.choice([0, 1.5, 3])))
    img = cv2.GaussianBlur(img, (0, 0), 0.8)
    save(grain(img, 9), "hero-sky.webp")


def chai_table():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    cx, cy = W * 0.5, H * 0.42
    d = np.sqrt(((xx - cx) / W) ** 2 + ((yy - cy) / H) ** 2)
    img = ramp(d * 1.6, [(0, "#FFE7B8"), (0.45, "#F2B868"), (1, "#9C5A26")])
    r = np.random.default_rng(5)
    bok = np.zeros((H, W), np.float32)
    for _ in range(46):
        cv2.circle(bok, (int(r.uniform(0, W)), int(r.uniform(0, H * 0.62))), int(r.uniform(18, 70)), float(r.uniform(0.25, 0.7)), -1, cv2.LINE_AA)
    bok = cv2.GaussianBlur(bok, (0, 0), 6)
    img += (np.array([255, 236, 190]) - img) * (bok * 0.5)[..., None]

    ty = H * 0.68  # wooden table top in perspective
    tm = (yy >= ty).astype(np.float32)[..., None]
    v = np.clip((yy - ty) / (H - ty), 0, 1)
    u = (xx - W / 2) / (0.35 + v * 0.65) / W
    planks = np.floor(u * 9)
    grainw = 0.5 + 0.5 * np.sin(u * 260 + 1.2 * np.sin(v * 5 + planks * 1.7) + planks * 3)
    grainw = 0.65 * grainw + 0.35 * (0.5 + 0.5 * np.sin(u * 47 + planks * 5))
    wood = ramp(v, [(0, "#B9733C"), (1, "#7A4320")]) * (0.86 + 0.14 * grainw)[..., None]
    seam = (np.abs(u * 9 - np.round(u * 9)) < 0.02).astype(np.float32)
    wood *= (1 - seam * 0.35)[..., None]
    wood += (np.array([255, 214, 160]) - wood) * np.exp(-(((yy - ty) / 5) ** 2))[..., None] * 0.6
    img = img * (1 - tm) + wood * tm

    steam = np.zeros((H, W), np.float32)
    for k, sx in enumerate((W * 0.2, W * 0.8)):
        pts = [(int(sx + 40 * np.sin(t / 30 + k)), int(H * 0.66 - t)) for t in range(0, 520, 8)]
        for p0, p1 in zip(pts[:-1], pts[1:]):
            cv2.line(steam, p0, p1, 1.0, 16, cv2.LINE_AA)
    steam = cv2.GaussianBlur(steam, (0, 0), 14) * np.clip(1 - (H * 0.66 - yy) / 600, 0, 1)
    img += (255 - img) * (steam * 0.35)[..., None]
    img *= 1 - np.clip(d * 1.4 - 0.4, 0, 1)[..., None] * 0.35
    save(grain(img, 10), "stage.webp")


def chai_swirl():
    stops = [(0, "#5E3016"), (0.22, "#A8642E"), (0.45, "#E8C08C"), (0.6, "#FFF6E6"), (0.78, "#D59A5E"), (1, "#5E3016")]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    x, y = xx / H, yy / H
    warp = 0.25 * np.sin(x * 3.1 + np.sin(y * 4.3) * 1.6) + 0.18 * np.sin(y * 5.2 + np.sin(x * 2.7) * 2.0)
    v = (x * 0.55 + y * 0.35 + warp + 0.12 * np.sin((x + y) * 9 + warp * 4)) % 1.0
    save(grain(cv2.GaussianBlur(ramp(v, stops), (0, 0), 5), 10), "chai.webp")


if __name__ == "__main__":
    farm_sunrise()
    chai_table()
    chai_swirl()
