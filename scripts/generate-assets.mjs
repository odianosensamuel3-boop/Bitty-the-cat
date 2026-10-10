#!/usr/bin/env node
/**
 * Bitty the Cat — brand asset generator.
 * ---------------------------------------------------------------------------
 * Produces every raster asset the website needs:
 *
 *   1. Web copies of the supplied mascot artwork (public/brand/mascot-*.jpg)
 *   2. Favicons + PWA/app icons (public/icons/*, public/favicon.ico)
 *   3. Open Graph social preview (public/brand/og-image.jpg)
 *   4. Original Bitty "mood" art for the meme gallery (public/gallery/*.jpg)
 *      — composed from the official mascot image plus bespoke CSS/SVG themed
 *        props, so the character always stays on-model.
 *
 * The actual mascot artwork ALWAYS comes from `scripts/mascot-source.jpg`.
 * Composites are rasterised with headless Chrome (present on macOS) and
 * converted to optimised JPEG with `sips`.
 *
 * Usage:  npm run assets
 * Env:    CHROME_PATH=/path/to/chrome   (only if auto-detection fails)
 */
import { execFile, spawn } from "node:child_process";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const tmpDir = path.join(root, ".tmp", "render");
const outBrand = path.join(root, "public", "brand");
const outIcons = path.join(root, "public", "icons");
const outGallery = path.join(root, "public", "gallery");
const sourceImage = path.join(__dirname, "mascot-source.jpg");
const PORT = 4399;

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

async function findChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      /* try next */
    }
  }
  return null;
}

const C = {
  bitcoin: "#F7931A",
  orange: "#FF6B00",
  golden: "#FFC928",
  ink: "#101010",
  charcoal: "#1A1A1A",
};

/* -------------------------------------------------------------------------- */
/* Gallery "moods" — each reuses the official mascot artwork with themed props */
/* -------------------------------------------------------------------------- */
const MOODS = [
  {
    key: "bullish",
    caption: "BITTY IS BULLISH",
    sub: "SUNGLASSES ON. GREEN CANDLES ONLY.",
    from: "#FF7A1A",
    to: "#140700",
    filter: "saturate(1.25) contrast(1.08)",
    props: `<div class="chart"><svg viewBox="0 0 400 180" preserveAspectRatio="none">
        <polyline points="0,160 40,138 70,148 110,104 145,118 185,72 220,86 265,44 310,58 355,18 400,6" />
      </svg></div>`,
    confetti: true,
  },
  {
    key: "lasers",
    caption: "BITCOIN ENERGY",
    sub: "ORANGE FUR. LASER FOCUS.",
    from: "#F7931A",
    to: "#1A0C02",
    filter: "saturate(1.5) contrast(1.12) hue-rotate(-8deg)",
    props: `<div class="lasers" aria-hidden="true">
        <span class="beam left"></span><span class="beam right"></span>
      </div>`,
  },
  {
    key: "wink",
    caption: "JUST A CAT",
    sub: "NO DRAMA. ONLY MEMES.",
    from: "#FFC928",
    to: "#2A1400",
    filter: "saturate(1.1) brightness(1.06) contrast(1.02)",
    props: `<div class="price">₿ 1 = 1 ₿</div>`,
    confetti: true,
  },
  {
    key: "hodl",
    caption: "HODL THE PAW",
    sub: "DIAMOND PAWS. FLUFFY HEART.",
    from: "#4A4A55",
    to: "#0A0A0C",
    filter: "saturate(0.45) contrast(1.22) brightness(1.02)",
    props: `<div class="diamond" aria-hidden="true"><span></span><span></span><span></span></div>`,
  },
  {
    key: "gm",
    caption: "GM, BITTY",
    sub: "COFFEE FIRST. MEMES SECOND.",
    from: "#FFB066",
    to: "#3A1400",
    filter: "saturate(1.15) brightness(1.1)",
    props: `<div class="sun" aria-hidden="true"></div>`,
  },
  {
    key: "moon",
    caption: "TO THE MOON?",
    sub: "OR JUST A VERY GOOD NAP.",
    from: "#2A3A66",
    to: "#05060C",
    filter: "saturate(0.9) contrast(1.18) brightness(0.95)",
    props: `<div class="moon" aria-hidden="true"></div>
      <div class="stars" aria-hidden="true"></div>`,
  },
  {
    key: "chill",
    caption: "CHILL CAT ENERGY",
    sub: "UNBOTHERED. UNSHAKEN. UNSTOPPABLE.",
    from: "#2E6FA8",
    to: "#050A12",
    filter: "saturate(0.85) contrast(1.1) hue-rotate(8deg)",
    props: `<div class="waves" aria-hidden="true"></div>`,
  },
  {
    key: "community",
    caption: "COMMUNITY CAT",
    sub: "ONE CAT. ONE COMMUNITY. ENDLESS MEMES.",
    from: "#FF5A1F",
    to: "#101010",
    filter: "saturate(1.2) contrast(1.05)",
    props: `<div class="paws" aria-hidden="true">
        ${Array.from({ length: 7 }, (_, i) => `<i style="--i:${i}"></i>`).join("")}
      </div>`,
    confetti: true,
  },
];

/* -------------------------------------------------------------------------- */
/* Shared CSS                                                                  */
/* -------------------------------------------------------------------------- */
function baseCss() {
  return `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #101010; }
  body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
  .display { font-family: "Arial Black", "Helvetica Neue", Arial, sans-serif; font-weight: 900; letter-spacing: -0.02em; }
  .paw { position: absolute; opacity: 0.16; }
  .paw svg { display: block; }
  .confetti i {
    position: absolute; display: block; border-radius: 999px;
    background: #FFC928; opacity: 0.42;
  }
  .chart { position: absolute; inset: auto 8% 30% 8%; height: 26%; }
  .chart svg { width: 100%; height: 100%; }
  .chart polyline {
    fill: none; stroke: #7CFC8B; stroke-width: 6; stroke-linejoin: round; stroke-linecap: round;
    filter: drop-shadow(0 0 14px rgba(124, 252, 139, 0.65));
  }
  .lasers .beam {
    position: absolute; top: 44%; width: 62%; height: 26px; border-radius: 999px;
    background: linear-gradient(90deg, rgba(255, 59, 15, 0.95), rgba(255, 59, 15, 0));
    filter: blur(1px) drop-shadow(0 0 18px rgba(255, 80, 20, 0.8));
  }
  .lasers .left { left: -22%; transform: rotate(6deg); }
  .lasers .right { right: -22%; transform: rotate(-6deg) scaleX(-1); }
  .price {
    position: absolute; top: 15%; right: 8%;
    font-family: "Arial Black", Arial, sans-serif; font-weight: 900; font-size: 40px;
    color: #101010; background: #FFC928; border: 6px solid #101010;
    padding: 10px 22px; border-radius: 999px; transform: rotate(7deg);
    box-shadow: 0 12px 30px rgba(0,0,0,0.45);
  }
  .diamond { position: absolute; inset: 0; }
  .diamond span {
    position: absolute; width: 74px; height: 74px; background: #BFEFFF;
    border: 5px solid #FFFFFF; transform: rotate(45deg);
    box-shadow: 0 0 30px rgba(160, 235, 255, 0.85);
  }
  .diamond span:nth-child(1) { top: 12%; left: 10%; }
  .diamond span:nth-child(2) { top: 22%; right: 9%; width: 52px; height: 52px; }
  .diamond span:nth-child(3) { bottom: 26%; left: 7%; width: 44px; height: 44px; }
  .sun {
    position: absolute; top: -8%; right: -6%; width: 44%; aspect-ratio: 1; border-radius: 999px;
    background: radial-gradient(circle, rgba(255, 226, 150, 0.9), rgba(255, 183, 77, 0.25) 55%, transparent 72%);
  }
  .moon {
    position: absolute; top: 9%; left: 8%; width: 22%; aspect-ratio: 1; border-radius: 999px;
    background: radial-gradient(circle at 35% 32%, #FFFDF2, #D9D8D0 60%, #A9A79E);
    box-shadow: 0 0 60px rgba(255, 255, 255, 0.35);
  }
  .stars { position: absolute; inset: 0; }
  .stars::before, .stars::after {
    content: ""; position: absolute; width: 5px; height: 5px; border-radius: 999px; background: #fff;
    box-shadow: 120px 60px 0 #fff, 260px 20px 0 #fff, 420px 120px 0 #fff, 560px 40px 0 #fff,
      700px 160px 0 #fff, 180px 220px 0 #fff, 640px 300px 0 #fff, 340px 380px 0 #fff;
    opacity: 0.75;
  }
  .stars::after { transform: translate(60px, 240px) scale(0.7); opacity: 0.5; }
  .waves {
    position: absolute; inset: auto 0 0 0; height: 34%;
    background: repeating-linear-gradient(180deg, rgba(255,255,255,0.10) 0 3px, transparent 3px 26px);
    mask-image: linear-gradient(0deg, #000, transparent);
  }
  .paws i {
    position: absolute; width: 54px; height: 54px; opacity: 0.22; background: #FFC928;
    border-radius: 46% 46% 42% 42% / 52% 52% 40% 40%;
  }
  .paws i:nth-child(1) { top: 12%; left: 12%; transform: rotate(-14deg); }
  .paws i:nth-child(2) { top: 26%; right: 14%; transform: rotate(18deg) scale(0.8); }
  .paws i:nth-child(3) { bottom: 34%; left: 8%; transform: rotate(9deg) scale(0.7); }
  .paws i:nth-child(4) { bottom: 30%; right: 10%; transform: rotate(-8deg) scale(0.9); }
  .paws i:nth-child(5) { top: 46%; left: 18%; transform: rotate(24deg) scale(0.6); }
  .paws i:nth-child(6) { top: 8%; left: 46%; transform: rotate(-6deg) scale(0.65); }
  .paws i:nth-child(7) { bottom: 18%; right: 26%; transform: rotate(12deg) scale(0.55); }
  .confetti i:nth-child(1) { top: 6%; left: 14%; width: 16px; height: 16px; }
  .confetti i:nth-child(2) { top: 12%; left: 78%; width: 11px; height: 11px; background: #FF6B00; }
  .confetti i:nth-child(3) { top: 22%; left: 40%; width: 9px; height: 9px; background: #fff; }
  .confetti i:nth-child(4) { top: 30%; left: 88%; width: 14px; height: 14px; }
  .confetti i:nth-child(5) { top: 44%; left: 6%; width: 12px; height: 12px; background: #FF6B00; }
  .confetti i:nth-child(6) { top: 55%; left: 92%; width: 9px; height: 9px; }
  .confetti i:nth-child(7) { top: 68%; left: 12%; width: 13px; height: 13px; background: #fff; }
  .confetti i:nth-child(8) { top: 74%; left: 84%; width: 15px; height: 15px; }
  .confetti i:nth-child(9) { top: 86%; left: 30%; width: 10px; height: 10px; background: #FF6B00; }
  .confetti i:nth-child(10) { top: 4%; left: 56%; width: 12px; height: 12px; }
  `;
}

function pawSvg(color = "#000000", size = 120) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="${color}">
    <ellipse cx="50" cy="64" rx="26" ry="22"/>
    <ellipse cx="20" cy="38" rx="12" ry="15"/>
    <ellipse cx="38" cy="24" rx="12" ry="16"/>
    <ellipse cx="62" cy="24" rx="12" ry="16"/>
    <ellipse cx="80" cy="38" rx="12" ry="15"/>
  </svg>`;
}

function confettiMarkup() {
  return `<div class="confetti">${Array.from({ length: 10 }, () => "<i></i>").join("")}</div>`;
}

/**
 * One 1080x1080 gallery tile.
 * Captions are intentionally NOT baked into the art — the website renders them
 * from src/data/content.ts so the wording stays editable.
 */
function moodTile(mood) {
  return `
  <section class="tile" style="--from:${mood.from};--to:${mood.to}">
    <div class="bg"></div>
    <div class="glow"></div>
    <span class="paw p1">${pawSvg("#000000", 130)}</span>
    <span class="paw p2">${pawSvg("#000000", 100)}</span>
    <span class="paw p3">${pawSvg("#FFFFFF", 80)}</span>
    ${mood.confetti ? confettiMarkup() : ""}
    ${mood.props ?? ""}
    <div class="portrait">
      <div class="ring"></div>
      <div class="photo" style="filter:${mood.filter}"></div>
    </div>
  </section>`;
}

function tilesHtml(mascotDataUri, { only } = {}) {
  const moods = only ? MOODS.filter((m) => m.key === only) : MOODS;
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
${baseCss()}
body { width: 1080px; }
.tile {
  position: relative; width: 1080px; height: 1080px; overflow: hidden;
  background: linear-gradient(150deg, var(--from), var(--to));
}
.bg {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='120' cy='80' r='2'/%3E%3Ccircle cx='60' cy='150' r='2'/%3E%3Ccircle cx='170' cy='170' r='2'/%3E%3C/g%3E%3C/svg%3E");
}
.glow {
  position: absolute; left: 50%; top: 44%; width: 900px; height: 900px; transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255,107,0,0.55), rgba(247,147,26,0.18) 48%, transparent 70%);
}
.p1 { left: 26px; bottom: 40px; }
.p2 { right: 34px; top: 44px; }
.p3 { right: 120px; bottom: 150px; }
.portrait { position: absolute; left: 50%; top: 50%; width: 760px; height: 760px; transform: translate(-50%, -50%); }
.portrait .ring {
  position: absolute; inset: -18px; border-radius: 999px;
  border: 10px solid rgba(255, 201, 40, 0.55);
  box-shadow: 0 0 60px rgba(255, 107, 0, 0.55), inset 0 0 40px rgba(0,0,0,0.4);
}
.portrait .photo {
  position: absolute; inset: 0; border-radius: 999px; overflow: hidden;
  background-image: url("${mascotDataUri}");
  background-size: 118%; background-position: 50% 32%;
  border: 8px solid rgba(0,0,0,0.55);
  box-shadow: 0 40px 90px -30px rgba(0,0,0,0.95);
}
.shadow {
  position: absolute; left: 50%; top: 84%; width: 560px; height: 90px; transform: translateX(-50%);
  background: radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%);
}
</style></head><body>
${moods.map(moodTile).join("\n")}
</body></html>`;
}

/* -------------------------------------------------------------------------- */
/* Open Graph image (1200x630)                                                 */
/* -------------------------------------------------------------------------- */
function ogHtml(mascotDataUri) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
${baseCss()}
body { width: 1200px; height: 630px; }
.og {
  position: relative; width: 1200px; height: 630px; overflow: hidden;
  background: radial-gradient(120% 130% at 82% 48%, #3A1400 0%, #1A1A1A 46%, #101010 100%);
}
.grid { position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
  background-size: 60px 60px; }
.halo { position: absolute; right: -90px; top: 50%; width: 760px; height: 760px; transform: translateY(-50%);
  background: radial-gradient(circle, rgba(255,107,0,0.62), rgba(247,147,26,0.18) 52%, transparent 72%); }
.og .p1 { left: 40px; bottom: -20px; opacity: 0.12; }
.og .p2 { right: 60px; top: -10px; opacity: 0.14; }
.left { position: absolute; left: 72px; top: 96px; width: 640px; }
.badge {
  display: inline-flex; align-items: center; gap: 10px;
  border: 2px solid rgba(247,147,26,0.7); background: rgba(247,147,26,0.16);
  color: ${C.golden}; font-weight: 900; font-size: 22px; letter-spacing: 0.22em;
  padding: 10px 22px; border-radius: 999px;
}
h1 { font-size: 84px; line-height: 0.98; margin-top: 26px;
  background: linear-gradient(100deg, #FFC928, #F7931A 45%, #FF6B00);
  -webkit-background-clip: text; background-clip: text; color: transparent; }
.tagline { margin-top: 20px; font-size: 31px; font-weight: 800; letter-spacing: 0.06em; color: #fff; }
.blurb { margin-top: 14px; font-size: 23px; color: rgba(255,255,255,0.64); }
.ctas { margin-top: 34px; display: flex; gap: 16px; }
.cta { font-size: 25px; padding: 18px 34px; border-radius: 999px; }
.cta-primary { background: linear-gradient(120deg, #FFC928, #FF6B00); color: #101010; }
.cta-ghost { border: 2.5px solid rgba(247,147,26,0.85); color: ${C.golden}; }
.stats { margin-top: 30px; display: flex; gap: 34px; font-size: 21px; color: rgba(255,255,255,0.72); }
.stats b { color: ${C.golden}; }
.portrait { position: absolute; right: 54px; top: 50%; width: 520px; height: 520px; transform: translateY(-50%); }
.portrait .ring { position: absolute; inset: -16px; border-radius: 999px;
  border: 9px solid rgba(255,201,40,0.6);
  box-shadow: 0 0 70px rgba(255,107,0,0.6), inset 0 0 50px rgba(0,0,0,0.5); }
.portrait .photo { position: absolute; inset: 0; border-radius: 999px;
  background-image: url("${mascotDataUri}"); background-size: 122%; background-position: 50% 30%;
  border: 7px solid rgba(0,0,0,0.55); box-shadow: 0 40px 90px -30px rgba(0,0,0,0.95); }
.ticker {
  position: absolute; right: 150px; bottom: 32px; font-size: 26px; letter-spacing: 0.3em;
  color: rgba(255,255,255,0.55); font-weight: 800;
}
</style></head><body>
<div class="og">
  <div class="grid"></div>
  <div class="halo"></div>
  <span class="paw p1">${pawSvg("#F7931A", 200)}</span>
  <span class="paw p2">${pawSvg("#FFC928", 150)}</span>
  <div class="left">
    <span class="badge display">MEME COIN · $BTC</span>
    <h1 class="display">BITTY<br/>THE CAT</h1>
    <div class="tagline">THE CAT WITH BITCOIN ENERGY.</div>
    <div class="blurb">Orange fur. Big dreams. Unlimited memes.</div>
    <div class="ctas">
      <span class="cta cta-primary display">BUY $BTC</span>
      <span class="cta cta-ghost display">JOIN THE COMMUNITY</span>
    </div>
    <div class="stats"><span><b>1</b> iconic cat</span><span><b>∞</b> memes</span><span><b>1</b> community</span></div>
  </div>
  <div class="portrait">
    <div class="ring"></div>
    <div class="photo"></div>
  </div>
  <div class="ticker display">BITTYTHECAT</div>
</div>
</body></html>`;
}

/* -------------------------------------------------------------------------- */
/* Rendering helpers                                                           */
/* -------------------------------------------------------------------------- */

/** Serve the project root so relative asset URLs resolve during rendering. */
async function startServer(port) {
  const server = spawn(
    process.execPath,
    [path.join(__dirname, "serve-static.mjs"), String(port), root],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("static server did not start")), 8000);
    server.stdout.on("data", (chunk) => {
      if (String(chunk).includes("READY")) {
        clearTimeout(timer);
        resolve();
      }
    });
    server.on("error", reject);
  });
  return server;
}

async function screenshot(chrome, url, outPath, width, height) {
  const profile = path.join(tmpDir, `profile-${path.basename(outPath, path.extname(outPath))}`);
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--disable-sync",
    "--disable-dev-shm-usage",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    `--user-data-dir=${profile}`,
    `--window-size=${width},${height}`,
    "--virtual-time-budget=2500",
    `--screenshot=${outPath}`,
    url,
  ];
  const child = execFileAsync(chrome, args, { timeout: 90_000, killSignal: "SIGKILL" });
  child.catch(() => {});
  const started = Date.now();
  while (Date.now() - started < 60_000) {
    try {
      await access(outPath);
      await new Promise((r) => setTimeout(r, 350));
      try {
        child.child?.kill("SIGKILL");
      } catch {
        /* ignore */
      }
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  throw new Error(`Chrome did not produce a screenshot for ${url}`);
}

/** Read pixel dimensions so a mis-sized capture fails loudly instead of cropping wrong. */
async function pngSize(file) {
  const { stdout } = await execFileAsync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], { timeout: 30_000 });
  const width = Number(/pixelWidth:\s*(\d+)/.exec(stdout)?.[1]);
  const height = Number(/pixelHeight:\s*(\d+)/.exec(stdout)?.[1]);
  if (!Number.isFinite(width) || !Number.isFinite(height)) throw new Error(`cannot read size of ${file}`);
  return { width, height };
}

async function sips(args) {
  await execFileAsync("sips", args, { timeout: 60_000 });
}

/** JPEG conversion with quality (keeps files small for the web). */
async function toJpeg(src, dest, quality = 80) {
  await sips(["-s", "format", "jpeg", "-s", "formatOptions", String(quality), src, "--out", dest]);
}

async function resizeJpeg(src, dest, size, quality = 82) {
  await sips([
    "-s", "format", "jpeg",
    "-s", "formatOptions", String(quality),
    "-z", String(size), String(size),
    src, "--out", dest,
  ]);
}

/* -------------------------------------------------------------------------- */
/* main                                                                        */
/* -------------------------------------------------------------------------- */
async function main() {
  const chrome = await findChrome();
  if (!chrome) {
    console.error("✖ No Chrome/Chromium found. Set CHROME_PATH and re-run `npm run assets`.");
    process.exit(1);
  }
  console.log(`› chrome: ${chrome}`);
  await rm(tmpDir, { recursive: true, force: true });
  await mkdir(tmpDir, { recursive: true });
  for (const dir of [outBrand, outIcons, outGallery]) await mkdir(dir, { recursive: true });

  // Remove previously generated gallery art so removed moods don't linger.
  await rm(outGallery, { recursive: true, force: true });
  await mkdir(outGallery, { recursive: true });

  const source = await readFile(sourceImage);
  const mascotDataUri = `data:image/jpeg;base64,${source.toString("base64")}`;

  /* ---- 1. mascot derivatives (pure image work, no browser) ---- */
  for (const size of [1024, 768, 512, 384, 256, 128]) {
    await resizeJpeg(sourceImage, path.join(outBrand, `mascot-${size}.jpg`), size, 84);
    console.log(`  ✓ brand/mascot-${size}.jpg`);
  }

  /* ---- 1b. circular transparent mascot + favicons/app icons ---- */
  // make-circular-mascot.py writes mascot-circle*.png and every icon in
  // public/icons (16/32/48/96/180/512) with the badge cut out cleanly.
  await execFileAsync(process.env.PYTHON ?? "python3", [path.join(__dirname, "make-circular-mascot.py")], {
    cwd: root,
    timeout: 180_000,
  });
  console.log("  ✓ brand/mascot-circle*.png + icons/*.png");

  const ico = [];
  for (const size of [16, 32, 48]) {
    ico.push({ size, data: await readFile(path.join(outIcons, `favicon-${size}.png`)) });
  }
  await writeFile(path.join(root, "public", "favicon.ico"), buildIco(ico));
  console.log("  ✓ favicon.ico");

  /* ---- 2. browser-rendered brand art ---- */
  const server = await startServer(PORT);
  try {
    // Open Graph
    await writeFile(path.join(root, "og.html"), ogHtml(mascotDataUri));
    const ogPng = path.join(tmpDir, "og.png");
    await screenshot(chrome, `http://127.0.0.1:${PORT}/og.html`, ogPng, 1200, 630);
    const ogSize = await pngSize(ogPng);
    if (ogSize.width < 1200 || ogSize.height < 630) {
      throw new Error(`unexpected OG capture size ${ogSize.width}x${ogSize.height}`);
    }
    await toJpeg(ogPng, path.join(outBrand, "og-image.jpg"), 86);
    await rm(path.join(root, "og.html"), { force: true });
    console.log("  ✓ brand/og-image.jpg");

    // Gallery: one capturing page per mood so every tile is exactly 1080x1080.
    // (Chrome's screenshot only captures the viewport, so a tall sheet would be
    // silently truncated — one page per tile keeps the output predictable.)
    for (const mood of MOODS) {
      const page = path.join(root, `gallery-${mood.key}.html`);
      await writeFile(page, tilesHtml(mascotDataUri, { only: mood.key }));
      const png = path.join(tmpDir, `tile-${mood.key}.png`);
      await screenshot(chrome, `http://127.0.0.1:${PORT}/gallery-${mood.key}.html`, png, 1080, 1080);
      const size = await pngSize(png);
      if (size.width < 1080 || size.height < 1080) {
        throw new Error(`unexpected capture size ${size.width}x${size.height} for mood "${mood.key}"`);
      }
      for (const width of [400, 640, 900]) {
        const dest = path.join(outGallery, width === 900 ? `${mood.key}.jpg` : `${mood.key}-${width}.jpg`);
        await resizeJpeg(png, dest, width, width === 400 ? 76 : 80);
      }
      await rm(page, { force: true });
      console.log(`  ✓ gallery/${mood.key}.jpg (+400, +640)`);
    }
  } finally {
    server.kill("SIGTERM");
  }

  await rm(tmpDir, { recursive: true, force: true });
  console.log("\n✔ Brand assets ready. Next: `npm run build`.");
}

/** Minimal multi-resolution .ico writer (PNG-compressed entries). */
function buildIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  const entries = [];
  let offset = 6 + count * 16;
  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
