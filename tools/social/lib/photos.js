// Photo library helper for Instagram posts: the site's free photos (img/photos, Wikimedia Commons).
// PH(stem, cap?) -> { src, cap, alt, credit, licence } from img/photos/meta.json + photos.json.
// Licences are CC BY / CC BY-SA: attribution is required, so every caption that uses a photo gets a
// "Photo: author, licence, via Wikimedia Commons" line (see creditLines). Captions describe only what the photo shows.
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const META = JSON.parse(fs.readFileSync(path.join(ROOT, 'img/photos/meta.json'), 'utf8'));
const RAW = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(ROOT, 'img/photos/photos.json'), 'utf8')).map((x) => [x.id, x]));

function PH(stem, cap) {
  const m = META.find((x) => x.file && x.file.endsWith(`/${stem}.webp`));
  if (!m) throw new Error(`photo not found: ${stem}`);
  const r = RAW[m.id] || {};
  const author = String(r.author || m.author || '').split('\n')[0].trim();
  if (!author || /^this photo was taken/i.test(author)) throw new Error(`photo ${stem}: author needs a clean credit line`);
  const licence = r.licence || m.licence;
  if (!/^CC BY/.test(licence) && !/public domain|CC0/i.test(licence)) throw new Error(`photo ${stem}: unexpected licence ${licence}`);
  return { stem, src: m.file, cap: cap || m.caption, alt: m.alt, author, licence, credit: `${author}, ${licence}, via Wikimedia Commons`, needsCredit: /^CC BY/.test(licence) };
}
module.exports = { PH };

// Sharper source for full-bleed use: the library photos are 1200 px wide, so for full-bleed tiles we pre-upscale
// them once with Lanczos + a light unsharp mask (much crisper than the browser's bilinear scaling). Cached outside
// the repo (os tmpdir); falls back to the original file if Python/PIL is unavailable.
const os = require('os');
const { execFileSync } = require('child_process');
const CACHE = path.join(os.tmpdir(), 'twg-social-hires');
function hires(src) {
  const out = path.join(CACHE, path.basename(src).replace(/\.webp$/, '.jpg'));
  if (!fs.existsSync(out)) {
    try {
      fs.mkdirSync(CACHE, { recursive: true });
      execFileSync('python3', ['-c', `import sys
from PIL import Image, ImageFilter
im = Image.open(sys.argv[1]).convert('RGB')
im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2.2, percent=70, threshold=2))
im.save(sys.argv[2], quality=95)`, path.join(ROOT, src), out]);
    } catch (e) { return src; }
  }
  return 'file://' + out;
}
module.exports.hires = hires;
