#!/usr/bin/env node
/**
 * Deploys the built static site in `out/` to Netlify using the Netlify API.
 *
 * Uses Netlify's digest-based deploy flow, so only changed files are uploaded
 * on repeat deploys (fast subsequent updates).
 *
 * Usage:
 *   NETLIFY_TOKEN=... node scripts/deploy-netlify.mjs --site <site-id-or-name>
 *   NETLIFY_TOKEN=... node scripts/deploy-netlify.mjs --create <subdomain>
 *
 * The token is read from the environment only — never from a committed file.
 */
import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "out");
const API = "https://api.netlify.com/api/v1";

const token = process.env.NETLIFY_TOKEN;
if (!token) {
  console.error("✖ NETLIFY_TOKEN is not set");
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? null : (args[index + 1] ?? true);
};
const siteArg = flag("--site");
const createArg = flag("--create");
const message = flag("--message") ?? "Bitty the Cat deploy";

async function api(pathname, init = {}) {
  const response = await fetch(`${API}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!response.ok) {
    const detail = typeof body === "object" ? JSON.stringify(body) : String(body);
    throw new Error(`${init.method ?? "GET"} ${pathname} → ${response.status} ${detail}`);
  }
  return body;
}

/** Walk `out/` and return [{ path: "/index.html", abs, sha }] */
async function collectFiles(dir, prefix = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    const rel = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(abs, rel)));
    } else if (entry.isFile()) {
      const buffer = await readFile(abs);
      files.push({
        path: rel,
        abs,
        sha: createHash("sha1").update(buffer).digest("hex"),
        size: buffer.byteLength,
      });
    }
  }
  return files;
}

async function resolveSite() {
  if (siteArg) {
    const sites = await api("/sites");
    const match = sites.find((s) => s.id === siteArg || s.name === siteArg || s.custom_domain === siteArg);
    if (!match) throw new Error(`no site matching "${siteArg}"`);
    return match;
  }
  if (createArg) {
    const candidates = [createArg, "bittythecat", "bitty-the-cat-btc", "bittycatbtc"];
    for (const name of candidates) {
      try {
        const site = await api("/sites", { method: "POST", body: JSON.stringify({ name }) });
        console.log(`› created site "${site.name}" (${site.id})`);
        return site;
      } catch (error) {
        console.log(`  · subdomain "${name}" unavailable (${String(error.message).slice(0, 90)})`);
      }
    }
    throw new Error("could not create a site with any candidate subdomain");
  }
  throw new Error("pass --site <id|name> or --create <subdomain>");
}

const site = await resolveSite();
const files = await collectFiles(outDir);
const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
console.log(`› site: ${site.name} (${site.id})`);
console.log(`› files: ${files.length} (${(totalBytes / 1024 / 1024).toFixed(2)} MB)`);

const deploy = await api(`/sites/${site.id}/deploys`, {
  method: "POST",
  body: JSON.stringify({
    files: Object.fromEntries(files.map((f) => [f.path, f.sha])),
    draft: false,
  }),
});

const required = new Set(deploy.required ?? []);
const toUpload = files.filter((f) => required.has(f.sha));
console.log(`› Netlify needs ${toUpload.length} of ${files.length} files uploaded`);

let uploaded = 0;
const CONCURRENCY = 8;
for (let i = 0; i < toUpload.length; i += CONCURRENCY) {
  const batch = toUpload.slice(i, i + CONCURRENCY);
  await Promise.all(
    batch.map(async (file) => {
      const buffer = await readFile(file.abs);
      const response = await fetch(`${API}/deploys/${deploy.id}/files${file.path}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/octet-stream",
        },
        body: buffer,
      });
      if (!response.ok) {
        throw new Error(`upload failed for ${file.path}: ${response.status} ${await response.text()}`);
      }
      uploaded += 1;
      if (uploaded % 25 === 0 || uploaded === toUpload.length) {
        process.stdout.write(`\r  uploaded ${uploaded}/${toUpload.length}`);
      }
    }),
  );
}
if (toUpload.length) process.stdout.write("\n");

// Poll until the deploy is live.
let current = deploy;
for (let attempt = 0; attempt < 60; attempt += 1) {
  if (["ready", "current"].includes(current.state)) break;
  if (["error", "failed", "rejected"].includes(current.state)) {
    throw new Error(`deploy failed: ${current.state} ${current.error_message ?? ""}`);
  }
  await new Promise((r) => setTimeout(r, 2000));
  current = await api(`/sites/${site.id}/deploys/${deploy.id}`);
  process.stdout.write(`\r  state: ${current.state}   `);
}
process.stdout.write("\n");

const info = await api(`/sites/${site.id}`);
const result = {
  site_id: info.id,
  site_name: info.name,
  url: info.ssl_url ?? info.url,
  admin_url: info.admin_url,
  deploy_id: current.id,
  deploy_url: current.ssl_url ?? current.url ?? null,
  state: current.state,
  published_at: current.published_at,
  files_uploaded: toUpload.length,
  files_total: files.length,
  bytes_total: totalBytes,
};
console.log("\n" + JSON.stringify(result, null, 2));

const { writeFile, mkdir } = await import("node:fs/promises");
await mkdir(path.join(root, ".tmp"), { recursive: true });
await writeFile(path.join(root, ".tmp", "deploy-result.json"), JSON.stringify(result, null, 2));
