// One-off: re-encodes the site's photographs, in colour, into AVIF and WebP at the sizes the page shows
// them, into site/assets/img/. Run by hand when a picture changes; Netlify never runs it.
//
//   node scripts/encode-site-images.mjs [source dir]
//
// The source dir defaults to site/src-images/, the originals kept in the repo (not published). Every
// photo is from Unsplash under the Unsplash License (free for commercial use, no credit required); the
// source pages are listed in site/assets/credits.json for our own records.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = path.resolve(process.argv[2] ?? path.join(root, "site/src-images"));
const out = path.join(root, "site/assets/img");
fs.mkdirSync(out, { recursive: true });

// name: [source file, widths, crop in source pixels (optional)]
const jobs = {
  hero: ["owner-desk.jpg", [480, 720, 960], { left: 0, top: 150, width: 2200, height: 2933 }],
  showcase: ["cafe-counter.jpg", [720, 1200, 1800]],
  intro: ["tablet-till.jpg", [480, 854]],
  alley: ["printers-alley.jpg", [400, 640]],
  boutique: ["boutique.jpg", [400, 640]],
  salon: ["salon.jpg", [400, 640]],
  bakery: ["bakery.jpg", [400, 640]],
};

for (const [name, [file, widths, crop]] of Object.entries(jobs)) {
  for (const w of widths) {
    let base = sharp(path.join(src, file));
    if (crop) base = base.extract(crop);
    base = base.resize({ width: w, withoutEnlargement: true });
    await base.clone().avif({ quality: 52, effort: 6 }).toFile(path.join(out, `${name}-${w}.avif`));
    await base.clone().webp({ quality: 74, effort: 6 }).toFile(path.join(out, `${name}-${w}.webp`));
  }
  const meta = await sharp(path.join(src, file)).metadata();
  console.log(name, `${meta.width}x${meta.height}`, crop ? `crop ${crop.width}x${crop.height}` : "", widths.join(","));
}
for (const f of fs.readdirSync(out).sort()) console.log(f, fs.statSync(path.join(out, f)).size);
