// Builds the transparent logo from assets/source/logo.jpg.
// Run: npm run assets
import sharp from "sharp";
import { mkdirSync } from "node:fs";

mkdirSync("public/products", { recursive: true });

/** Remove the white studio background by flood-filling from the image edges. */
async function cutout(file, tol = 232, crop) {
  let img = sharp(file);
  if (crop) img = sharp(await img.extract(crop).toBuffer());
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const bg = (p) => {
    const i = p * 4;
    const mn = Math.min(data[i], data[i + 1], data[i + 2]);
    const mx = Math.max(data[i], data[i + 1], data[i + 2]);
    return mn > tol && mx - mn < 18;
  };
  const seen = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  while (stack.length) {
    const p = stack.pop();
    if (seen[p]) continue;
    seen[p] = 1;
    if (!bg(p)) continue;
    data[p * 4 + 3] = 0;
    const x = p % W;
    if (x > 0) stack.push(p - 1);
    if (x < W - 1) stack.push(p + 1);
    if (p >= W) stack.push(p - W);
    if (p < W * (H - 1)) stack.push(p + W);
  }
  // soften the cut edge by one pixel
  const a = new Uint8Array(W * H);
  for (let p = 0; p < W * H; p++) a[p] = data[p * 4 + 3];
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++) {
      const p = y * W + x;
      if (!a[p]) continue;
      const n = (a[p - 1] === 0) + (a[p + 1] === 0) + (a[p - W] === 0) + (a[p + W] === 0);
      if (n) data[p * 4 + 3] = 255 - n * 50;
    }
  return sharp(data, { raw: { width: W, height: H, channels: 4 } }).trim().png().toBuffer();
}

// Pack cutouts are made by scripts/cutout.py (npm run cutout).

// Logo: the original Swaad logo (assets/source/logo.jpg), only its white background removed.
{
  const png = await cutout("assets/source/logo.jpg", 236);
  await sharp(png).resize({ width: 640, kernel: "lanczos3" }).png({ compressionLevel: 9 }).toFile("public/logo.png");
  await sharp(png).resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile("app/icon.png");
}
console.log("assets built");
