#!/usr/bin/env node
/**
 * Dev-only visual QA helper (not part of the build).
 *
 * Drives headless Chrome over the DevTools Protocol to capture the site at
 * several viewports — including full-page shots — with real timing, so CSS
 * transitions and IntersectionObserver reveals settle before capture.
 *
 * Usage:
 *   node scripts/visual-check.mjs [baseUrl] [outDir] [--full] [--interact]
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4400/";
const outDir = path.resolve(process.argv[3] ?? ".tmp/shots");
const flags = process.argv.slice(4);
const wantFull = flags.includes("--full");
const wantInteract = flags.includes("--interact");

const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9334;

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "tablet", width: 834, height: 1112, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];

await mkdir(outDir, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--no-first-run",
    "--disable-extensions",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${path.join(outDir, "cdp-profile")}`,
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "ignore"] },
);

async function attach() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
      if (page) return page;
    } catch {
      /* not up yet */
    }
    await sleep(400);
  }
  throw new Error("could not attach to headless Chrome");
}

const page = await attach();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve, { once: true });
  ws.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
const consoleErrors = [];
ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);
  if (msg.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(msg.params.type)) {
    consoleErrors.push(
      `${msg.params.type}: ${msg.params.args.map((a) => a.value ?? a.description ?? a.type).join(" ")}`,
    );
  }
  if (msg.method === "Runtime.exceptionThrown") {
    consoleErrors.push(`exception: ${msg.params.exceptionDetails?.text}`);
  }
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
  }
});

function send(method, params = {}) {
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text ?? "evaluation failed");
  return result.result.value;
}

async function navigate(url) {
  await send("Page.navigate", { url });
  // Wait for the document to finish loading, then let animations settle.
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const state = await evaluate("document.readyState").catch(() => "loading");
    if (state === "complete") break;
    await sleep(200);
  }
  await sleep(1500);
}

async function setViewport({ width, height, mobile }) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: Boolean(mobile),
  });
}

/** Scroll through the page so every `.reveal` element has been observed. */
async function warmReveals() {
  await evaluate(`(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  })()`);
}

async function shot(name, { full = false } = {}) {
  const { data } = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: full,
  });
  const file = path.join(outDir, `${name}.png`);
  await writeFile(file, Buffer.from(data, "base64"));
  console.log(`✓ ${path.relative(process.cwd(), file)}`);
}

/**
 * Captures each page section in the viewport (plus a lower slice for tall
 * sections). More reliable than one giant full-page capture, and it makes the
 * review pass readable. Returns the measured scroll positions.
 */
async function captureSections(prefix) {
  const sections = await evaluate(`[...document.querySelectorAll('main section[id], footer')].map((el) => ({
    id: el.id || 'footer',
    top: Math.round(el.getBoundingClientRect().top + window.scrollY),
    height: Math.round(el.getBoundingClientRect().height),
  }))`);

  const positions = [];
  for (const section of sections) {
    positions.push({ name: `${prefix}-${section.id}`, y: Math.max(section.top - 72, 0) });
    if (section.height > 1400) {
      positions.push({ name: `${prefix}-${section.id}-b`, y: section.top + section.height - 900 });
    }
  }

  for (const position of positions) {
    await evaluate(`window.scrollTo(0, ${position.y})`);
    await sleep(700); // let reveals finish animating
    await shot(position.name);
  }
  return positions.map((p) => `${p.name}@${p.y}`);
}

await send("Page.enable");
await send("Runtime.enable");

const report = { viewports: {}, interactions: {}, consoleErrors };

for (const viewport of VIEWPORTS) {
  await setViewport(viewport);
  await navigate(baseUrl);
  await shot(viewport.name);
  if (wantFull && ["desktop", "mobile"].includes(viewport.name)) {
    await warmReveals();
    report.sections ??= {};
    report.sections[viewport.name] = await captureSections(`${viewport.name}-section`);
  }
  report.viewports[viewport.name] = await evaluate(`({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    scrollHeight: document.documentElement.scrollHeight,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    hiddenReveals: document.querySelectorAll('.reveal:not(.is-visible)').length,
    totalReveals: document.querySelectorAll('.reveal').length,
    brokenImages: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
  })`);
}

if (wantInteract) {
  await setViewport({ width: 390, height: 844, mobile: true });
  await navigate(baseUrl);

  // mobile menu
  await evaluate(`document.querySelector('[aria-controls="mobile-menu"]').click()`);
  await sleep(700);
  report.interactions.menuOpen = await evaluate(
    `document.querySelector('[aria-controls="mobile-menu"]').getAttribute('aria-expanded')`,
  );
  await shot("mobile-menu");
  await evaluate(`document.querySelector('[aria-controls="mobile-menu"]').click()`);
  await sleep(500);
  report.interactions.menuClosed = await evaluate(
    `document.querySelector('[aria-controls="mobile-menu"]').getAttribute('aria-expanded')`,
  );

  // copy contract (unconfigured -> disabled)
  report.interactions.contractButtonsDisabled = await evaluate(
    `[...document.querySelectorAll('button')].filter((b) => /contract/i.test(b.textContent || '')).map((b) => b.disabled).join(',')`,
  );

  // FAQ accordion
  await evaluate(`document.getElementById('faq').scrollIntoView()`);
  await sleep(800);
  await evaluate(`document.querySelectorAll('#faq button[aria-expanded]')[2].click()`);
  await sleep(500);
  report.interactions.faqExpanded = await evaluate(
    `[...document.querySelectorAll('#faq button[aria-expanded]')].map((b) => b.getAttribute('aria-expanded')).join(',')`,
  );
  await shot("mobile-faq");

  // gallery lightbox
  await evaluate(`document.getElementById('memes').scrollIntoView()`);
  await sleep(700);
  await warmReveals();
  await evaluate(`document.querySelector('#memes button[aria-label^="Open"]').click()`);
  await sleep(700);
  report.interactions.lightboxOpen = await evaluate(`Boolean(document.querySelector('[role="dialog"][aria-modal="true"]'))`);
  await shot("mobile-lightbox");
  await evaluate(`document.querySelector('[role="dialog"] button[aria-label="Close image"]').click()`);
  await sleep(400);
  report.interactions.lightboxClosed = await evaluate(`Boolean(document.querySelector('[role="dialog"]'))`);

  // primary CTA destination while no exchange link is configured
  report.interactions.primaryCtaHref = await evaluate(
    `document.querySelector('#home a[href^="#how-to-buy"]')?.getAttribute('href')`,
  );
}

await writeFile(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
console.log("\n" + JSON.stringify(report, null, 2));

ws.close();
chrome.kill("SIGKILL");
process.exit(0);
