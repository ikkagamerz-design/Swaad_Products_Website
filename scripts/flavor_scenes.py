"""
Warm, illustrated flavour scenes in the same style as the hero farm sunrise.

    .venv/Scripts/python scripts/flavor_scenes.py

public/art/scene-elaichi.webp  green-gold sunburst over cardamom-green fields
public/art/scene-milk.webp     soft sky-blue sunburst with a creamy milk wave
public/art/scene-jumbo.webp    orange-caramel sunburst over a golden wheat field
"""

import sys
from pathlib import Path

import cv2
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from backgrounds import H, W, grain, ramp, save  # noqa: E402
from scenes import ridge, wheat_ear  # noqa: E402


def sunburst(stops, ray_col, cx=0.5, cy=0.44, rays=18, ray_amt=0.2):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    sx, sy = W * cx, H * cy
    dist = np.sqrt((xx - sx) ** 2 + (yy - sy) ** 2)
    img = ramp(dist / (W * 0.62), stops)
    ang = np.arctan2(yy - sy, xx - sx)
    r = cv2.GaussianBlur((np.sin(ang * rays) > 0.3).astype(np.float32), (0, 0), 5)
    img += (np.array(ray_col, np.float32) - img) * (r * ray_amt * np.clip(1 - dist / 1500, 0, 1))[..., None]
    return img, yy, xx


def fields(img, yy, layers, furrows=True):
    xs = np.arange(W, dtype=np.float32)
    xx = np.mgrid[0:H, 0:W][1].astype(np.float32)
    for i, (base, c0, c1, amps, seed) in enumerate(layers):
        top = ridge(xs, H * base, amps, seed)
        m = cv2.GaussianBlur((yy >= top[None, :]).astype(np.float32), (0, 0), 1.2)[..., None]
        fill = ramp((yy - top[None, :]) / (H * 0.25), [(0, c0), (1, c1)])
        if furrows and i == len(layers) - 1:
            rows = 0.5 + 0.5 * np.sin((xx - W / 2) / np.maximum(yy - H * 0.55, 1.0) * 70)
            fill *= (0.92 + 0.08 * rows)[..., None]
        img[:] = img * (1 - m) + fill * m


def elaichi():
    img, yy, xx = sunburst([(0, "#FBF6D2"), (0.35, "#E4E58A"), (0.75, "#B4C43C"), (1, "#7C9220")], (255, 255, 230))
    fields(img, yy, [
        (0.80, "#A9BB3C", "#93A62E", [(16, 0.004), (8, 0.012)], 21),
        (0.88, "#8AA02A", "#6B8219", [(20, 0.003), (10, 0.01)], 22),
    ])
    save(grain(cv2.GaussianBlur(img, (0, 0), 0.8), 9), "scene-elaichi.webp")


def milk():
    img, yy, xx = sunburst([(0, "#F7FCFF"), (0.35, "#CFE9FA"), (0.75, "#7FC0EE"), (1, "#3A8FD6")], (255, 255, 255), ray_amt=0.25)
    xs = np.arange(W, dtype=np.float32)
    for k, (base, amp, c0, c1) in enumerate([(0.78, 26, "#E9F3FA", "#CFE2F0"), (0.85, 30, "#FFFFFF", "#E4EEF6")]):
        top = H * base + amp * np.sin(xs * 0.0055 + k * 2) + amp * 0.5 * np.sin(xs * 0.017 + k)
        m = cv2.GaussianBlur((yy >= top[None, :]).astype(np.float32), (0, 0), 1.5)[..., None]
        fill = ramp((yy - top[None, :]) / (H * 0.2), [(0, c0), (1, c1)])
        hl = np.exp(-(((yy - top[None, :] - 8) / 5) ** 2))[..., None]
        fill += (255 - fill) * hl * 0.8
        img[:] = img * (1 - m) + fill * m
        # creamy droplets flicked up from the wave crest
        r = np.random.default_rng(31 + k)
        for _ in range(14):
            x = r.uniform(0, W)
            y = top[int(x)] - r.uniform(20, 120)
            cv2.circle(img, (int(x), int(y)), int(r.uniform(4, 11)), (255, 255, 255), -1, cv2.LINE_AA)
    save(grain(cv2.GaussianBlur(img, (0, 0), 0.8), 8), "scene-milk.webp")


def jumbo():
    img, yy, xx = sunburst([(0, "#FFF0CF"), (0.35, "#FFCC7A"), (0.75, "#F28C2E"), (1, "#C4541A")], (255, 240, 200))
    fields(img, yy, [
        (0.80, "#E7AE48", "#D39834", [(16, 0.004), (8, 0.012)], 41),
        (0.88, "#C98E2C", "#A6701C", [(20, 0.003), (10, 0.01)], 42),
    ])
    r = np.random.default_rng(43)
    for _ in range(22):
        side = r.integers(0, 2)
        x = r.uniform(-40, 280) if side == 0 else r.uniform(W - 280, W + 40)
        wheat_ear(img, x, r.uniform(H * 0.66, H * 0.88), r.uniform(70, 110), r.uniform(-0.35, 0.35), blur=float(r.choice([0, 1.5, 3])))
    save(grain(cv2.GaussianBlur(img, (0, 0), 0.8), 9), "scene-jumbo.webp")


if __name__ == "__main__":
    elaichi()
    milk()
    jumbo()
