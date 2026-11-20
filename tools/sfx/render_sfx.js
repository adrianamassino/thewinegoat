/* Renders every sound of app/sfx.js to a WAV with OfflineAudioContext (same synthesis graph as the live app).
   Server: cd <repo> && python3 -m http.server 8871
   Run:    NODE_PATH=$(npm root -g) node tools/sfx/render_sfx.js <out dir> [http://localhost:8871/app/]
   Then:   python3 tools/sfx/analyze_sfx.py <out dir>     (levels, duration, tremolo check, waveform + spectrogram PNGs) */
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const OUT = process.argv[2] || "sfx-out", BASE = process.argv[3] || "http://localhost:8871/app/";
function wav(pcm, sr) { const b = Buffer.alloc(44 + pcm.length * 2); b.write("RIFF", 0); b.writeUInt32LE(36 + pcm.length * 2, 4); b.write("WAVEfmt ", 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(sr, 24); b.writeUInt32LE(sr * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write("data", 36); b.writeUInt32LE(pcm.length * 2, 40);
  pcm.forEach((v, i) => b.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(v * 32767))), 44 + i * 2)); return b; }
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(), p = await b.newPage();
  await p.goto(BASE + "sfx.js"); await p.addScriptTag({ url: BASE + "sfx.js" });
  const info = await p.evaluate(() => ({ names: TWG_SFX.names, variants: TWG_SFX.variants }));
  const peaks = {};
  for (const n of info.names) for (let i = 0; i < (/bleat|correct|streak|complete/.test(n) ? info.variants : 1); i++) {
    const r = await p.evaluate(([n, i]) => TWG_SFX.render(n, i), [n, i]);
    const name = n + (/bleat|correct|streak|complete/.test(n) ? "-" + (i + 1) : "");
    peaks[name] = Math.max(...r.pcm.map(Math.abs));   /* float peak before 16-bit conversion: > 1 would clip */
    fs.writeFileSync(path.join(OUT, name + ".wav"), wav(r.pcm, r.sr));
  }
  fs.writeFileSync(path.join(OUT, "peaks.json"), JSON.stringify(peaks, null, 1));
  console.log("rendered", Object.keys(peaks).length, "sounds to", OUT);
  await b.close();
})();
