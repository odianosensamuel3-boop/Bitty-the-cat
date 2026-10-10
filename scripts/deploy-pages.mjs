#!/usr/bin/env node
/**
 * Publishes the built site in `out/` to the GitHub Pages `gh-pages` branch.
 *
 * Usage:
 *   GITHUB_TOKEN=... node scripts/deploy-pages.mjs [--base-path /Repo-Name] [--repo owner/name]
 *
 * What it does:
 *   1. builds with the right base path + public site URL,
 *   2. commits `out/` to an orphan-style `gh-pages` branch in a temp worktree,
 *   3. force-pushes it (the branch is build output, never edited by hand).
 *
 * GitHub Pages then serves that branch at https://<owner>.github.io/<repo>/.
 */
import { execFile } from "node:child_process";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const exec = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error("✖ GITHUB_TOKEN is not set");
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : (args[i + 1] ?? fallback);
};

const repo = flag("--repo", process.env.GITHUB_REPO ?? "odianosensamuel3-boop/Bitty-the-cat");
const [owner, name] = repo.split("/");
const basePath = flag("--base-path", process.env.BASE_PATH ?? `/${name}`);
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${owner}.github.io${basePath}`;

const run = async (cmd, cmdArgs, options = {}) => {
  const { stdout, stderr } = await exec(cmd, cmdArgs, {
    cwd: options.cwd ?? root,
    env: { ...process.env, ...(options.env ?? {}) },
    maxBuffer: 64 * 1024 * 1024,
  });
  return { stdout, stderr };
};

const sanitize = (text) => String(text).replace(/(ghp_|github_pat_)[A-Za-z0-9_]+/g, "[REDACTED]");

console.log(`› repo:      ${repo}`);
console.log(`› base path: ${basePath || "(root)"}`);
console.log(`› site url:  ${siteUrl}`);

console.log("› building…");
await run("npx", ["next", "build"], {
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
});

const worktree = path.join(root, ".tmp", "ghp");
await rm(worktree, { recursive: true, force: true });
await run("git", ["worktree", "prune"]);
await run("git", ["worktree", "add", "--detach", worktree]);
await run("git", ["checkout", "--orphan", "gh-pages"], { cwd: worktree });
await run("git", ["rm", "-rq", "--cached", "."], { cwd: worktree }).catch(() => {});

// Clear the worktree (except .git) and drop in the fresh build.
const { stdout: listing } = await run("ls", ["-A"], { cwd: worktree });
for (const entry of listing.split("\n").map((l) => l.trim()).filter(Boolean)) {
  if (entry !== ".git") await rm(path.join(worktree, entry), { recursive: true, force: true });
}
await cp(path.join(root, "out"), worktree, { recursive: true });
await writeFile(path.join(worktree, ".nojekyll"), "");

await run("git", ["add", "-A"], { cwd: worktree });
await run(
  "git",
  ["-c", "user.name=Bitty the Cat", "-c", "user.email=deploy@bittythecat.local", "commit", "-q", "-m", `deploy: static build ${new Date().toISOString()}`],
  { cwd: worktree },
);

console.log("› pushing gh-pages…");
const remote = `https://${owner}:${token}@github.com/${repo}.git`;
try {
  await run(
    "git",
    [
      "-c", "credential.helper=",
      "-c", "http.version=HTTP/1.1",
      "-c", "http.postBuffer=524288000",
      "-c", "http.lowSpeedLimit=1000",
      "-c", "http.lowSpeedTime=300",
      "push", remote, "gh-pages:gh-pages", "--force",
    ],
    { cwd: worktree },
  );
} catch (error) {
  console.error(sanitize(error.stderr || error.message));
  process.exit(1);
}

await run("git", ["worktree", "remove", "--force", worktree]).catch(() => {});
await rm(worktree, { recursive: true, force: true });

console.log(`\n✔ deployed → ${siteUrl}/`);
console.log("  GitHub Pages usually publishes within ~30–60 seconds.");
