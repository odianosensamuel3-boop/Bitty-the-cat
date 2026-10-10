#!/usr/bin/env node
/**
 * Dependency-free static file server used only while rasterising brand art.
 * Usage: node scripts/serve-static.mjs <port> <rootDir>
 * Prints "READY <port>" on stdout once it is listening.
 */
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const port = Number(process.argv[2] ?? 4399);
const rootDir = path.resolve(process.argv[3] ?? process.cwd());

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".json": "application/json",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const requested = decodeURIComponent(url.pathname);
    const relative = path.normalize(requested).replace(/^([/\\]|\.\.[/\\])+/, "");
    const candidate = relative.length === 0 ? rootDir : path.join(rootDir, relative);
    const filePath = candidate.endsWith(path.sep) ? path.join(candidate, "index.html") : candidate;
    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403).end("forbidden");
      return;
    }
    let target = filePath;
    const info = await stat(target).catch(() => null);
    if (info?.isDirectory()) target = path.join(target, "index.html");
    const fileInfo = info?.isFile() ? info : await stat(target).catch(() => null);
    if (!fileInfo?.isFile()) {
      res.writeHead(404).end("not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(target).toLowerCase()] ?? "application/octet-stream",
      "Content-Length": fileInfo.size,
      "Cache-Control": "no-store",
    });
    createReadStream(target).pipe(res);
  } catch {
    res.writeHead(404).end("not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`READY ${port}\n`);
});
