// One-off: re-encodes the site's found photographs into black-and-white AVIF and WebP at the sizes the
// page shows them, into site/assets/img/. Run by hand when a picture changes; Netlify never runs it.
//
//   node scripts/encode-site-images.mjs [source dir]
//
// The source dir defaults to site/src-images/, the originals kept in the repo (not published; credits in
// site/assets/credits.json).
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = path.resolve(process.argv[2] ?? path.join(root, "site/src-images"));
const out = path.join(root, "site/assets/img");
fs.mkdirSync(out, { recursive: true });

// name: [source file, widths, contrast, brightness, crop in source pixels (optional)]
const jobs = {
  // the hero: the paper piled on the hardware store's desk, cropped 3:4 from desk.jpg
  pile: ["desk.jpg", [480, 720, 960], 1.08, 1, { left: 560, top: 1250, width: 1320, height: 1748 }],
  till: ["till.jpg", [720, 1200], 1.05, 0.9],
  press: ["press-poster.jpg", [480, 854], 1.1, 1],
  jellico: ["jellico-barber-shop-tn1.jpg", [400, 640], 1.08, 1],
  forbus: ["forbus-general-store-tn1.jpg", [400, 640], 1.08, 1],
  alley: ["printers-alley-2013.jpg", [400, 640], 1.08, 1],
  hollow: ["hollow-rock-general-store-tn.jpg", [400, 640], 1.08, 1],
};

for (const [name, [file, widths, contrast, brightness, crop]] of Object.entries(jobs)) {
  for (const w of widths) {
    let base = sharp(path.join(src, file));
    if (crop) base = base.extract(crop);
    base = base
      .resize({ width: w, withoutEnlargement: true })
      .grayscale()
      // contrast around mid-grey, then brightness, as the prototype's CSS filters did
      .linear(contrast * brightness, (128 - 128 * contrast) * brightness);
    await base.clone().avif({ quality: 52, effort: 6 }).toFile(path.join(out, `${name}-${w}.avif`));
    await base.clone().webp({ quality: 74, effort: 6 }).toFile(path.join(out, `${name}-${w}.webp`));
  }
  const meta = await sharp(path.join(src, file)).metadata();
  console.log(name, `${meta.width}x${meta.height}`, crop ? `crop ${crop.width}x${crop.height}` : "", widths.join(","));
}
for (const f of fs.readdirSync(out).sort()) console.log(f, fs.statSync(path.join(out, f)).size);
