#!/usr/bin/env node
/**
 * Best-effort scraper that fills in `photo:` for any review missing
 * one. For each MDX file without a photo field, walk its retailer URLs
 * (boughtFromUrl, then westernLinks, indiaLinks, ukLinks in that
 * order), fetch the page with a Chrome-ish User-Agent, parse the
 * `og:image` (or `twitter:image` as fallback) meta tag, download the
 * referenced image, save it under `public/products/<slug>.<ext>`, and
 * insert `photo: /products/<slug>.<ext>` into the frontmatter.
 *
 * Sites that block scrapers (Amazon especially) just fail silently and
 * the next URL is tried. Not every product will end up with a photo;
 * the script prints a per-product summary at the end.
 *
 * Run from the repo root:
 *
 *   node scripts/scrape-product-photos.mjs
 */

import { readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import { writeFileSync } from "node:fs";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));
const PUBLIC_PRODUCTS_DIR = join(REPO_ROOT, "public", "products");
const KINDS = ["skincare", "supplements", "oral-care"];

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15";
const FETCH_HEADERS = {
  "User-Agent": UA,
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};
const FETCH_TIMEOUT_MS = 15000;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithTimeout(url, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

if (!existsSync(PUBLIC_PRODUCTS_DIR))
  mkdirSync(PUBLIC_PRODUCTS_DIR, { recursive: true });

/**
 * Parse the YAML-ish frontmatter block at the top of an MDX file. We
 * only care about a few fields and don't need a full parser.
 */
function readFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return { fm: "", body: src, hasFm: false };
  return { fm: m[1], body: src.slice(m[0].length), hasFm: true, raw: m[0] };
}

function frontmatterHas(fm, key) {
  return new RegExp(`^${key}\\s*:`, "m").test(fm);
}

function getString(fm, key) {
  const m = fm.match(new RegExp(`^${key}\\s*:\\s*"?([^"\\n]+)"?\\s*$`, "m"));
  return m ? m[1].trim() : null;
}

/**
 * Pull every URL out of a `kind: [{ url: "...", ... }]` style block.
 * Naive but works for the well-formed frontmatter we control.
 */
function getLinkUrls(fm, key) {
  const re = new RegExp(
    `^${key}\\s*:\\s*\\n((?:\\s+-\\s.*\\n?)+)`,
    "m",
  );
  const blockMatch = fm.match(re);
  if (!blockMatch) return [];
  const block = blockMatch[1];
  const urls = [];
  for (const line of block.split("\n")) {
    const u = line.match(/url\s*:\s*"?([^"\s]+)"?/);
    if (u) urls.push(u[1]);
  }
  return urls;
}

function pickContentTypeExt(contentType) {
  if (!contentType) return null;
  const t = contentType.split(";")[0].trim().toLowerCase();
  switch (t) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/avif":
      return ".avif";
    case "image/gif":
      return ".gif";
    default:
      return null;
  }
}

function extractMeta(html, prop) {
  // <meta property="og:image" content="...">
  // (also handles single-quoted, attribute-order swapped variants)
  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${prop}["']`,
      "i",
    ),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return m[1];
  }
  return null;
}

async function scrapeOgImage(pageUrl) {
  let res;
  try {
    res = await fetchWithTimeout(pageUrl, { headers: FETCH_HEADERS });
  } catch (e) {
    return { ok: false, error: `fetch failed: ${e.message}` };
  }
  if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
  const html = await res.text();
  const og =
    extractMeta(html, "og:image") ||
    extractMeta(html, "twitter:image") ||
    extractMeta(html, "twitter:image:src");
  if (!og) return { ok: false, error: "no og:image" };
  // Resolve relative URL.
  let absolute;
  try {
    absolute = new URL(og, pageUrl).toString();
  } catch {
    return { ok: false, error: "bad og:image URL" };
  }
  return { ok: true, imageUrl: absolute };
}

async function downloadImage(url, slug) {
  let res;
  try {
    res = await fetchWithTimeout(url, { headers: FETCH_HEADERS });
  } catch (e) {
    return { ok: false, error: `image fetch failed: ${e.message}` };
  }
  if (!res.ok) return { ok: false, error: `image HTTP ${res.status}` };
  const ct = res.headers.get("content-type");
  const ext = pickContentTypeExt(ct) || ".jpg";
  const filename = `${slug}${ext}`;
  const filepath = join(PUBLIC_PRODUCTS_DIR, filename);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1024) {
    return { ok: false, error: `image too small (${buf.length} bytes)` };
  }
  writeFileSync(filepath, buf);
  return { ok: true, publicPath: `/products/${filename}`, bytes: buf.length };
}

function insertPhotoField(raw, photoPath) {
  // Insert `photo: <path>` after the first `category:` line, which
  // every review has. Works for both quoted and bare values.
  const lines = raw.split("\n");
  const idx = lines.findIndex((l) => /^category\s*:/.test(l));
  if (idx === -1) {
    // Fall back: insert just before the closing ---.
    const closingIdx = lines.findIndex(
      (l, i) => i > 0 && l.trim() === "---",
    );
    if (closingIdx === -1) return raw;
    lines.splice(closingIdx, 0, `photo: ${photoPath}`);
  } else {
    lines.splice(idx + 1, 0, `photo: ${photoPath}`);
  }
  return lines.join("\n");
}

async function processFile(kind, file) {
  const fullPath = join(REPO_ROOT, "content", kind, file);
  const slug = file.replace(/\.mdx$/, "");
  const src = await readFile(fullPath, "utf8");
  const fm = readFrontmatter(src);
  if (!fm.hasFm) return { slug, status: "skip", reason: "no frontmatter" };
  if (frontmatterHas(fm.fm, "photo")) {
    return { slug, status: "skip", reason: "already has photo" };
  }

  const candidates = [
    getString(fm.fm, "boughtFromUrl"),
    ...getLinkUrls(fm.fm, "westernLinks"),
    ...getLinkUrls(fm.fm, "indiaLinks"),
    ...getLinkUrls(fm.fm, "ukLinks"),
  ].filter(Boolean);

  if (candidates.length === 0) {
    return { slug, status: "fail", reason: "no candidate URLs" };
  }

  const errors = [];
  for (const pageUrl of candidates) {
    const og = await scrapeOgImage(pageUrl);
    if (!og.ok) {
      errors.push(`${pageUrl}: ${og.error}`);
      continue;
    }
    const dl = await downloadImage(og.imageUrl, slug);
    if (!dl.ok) {
      errors.push(`${pageUrl}: ${dl.error}`);
      continue;
    }
    // Patch the MDX.
    const patched = src.replace(
      fm.raw,
      `---\n${insertPhotoField(fm.fm, dl.publicPath)}\n---`,
    );
    await writeFile(fullPath, patched, "utf8");
    return {
      slug,
      status: "ok",
      photoPath: dl.publicPath,
      via: pageUrl,
      bytes: dl.bytes,
    };
  }

  return { slug, status: "fail", reason: errors.join(" | ") };
}

const summary = { ok: [], skip: [], fail: [] };
for (const kind of KINDS) {
  const dir = join(REPO_ROOT, "content", kind);
  if (!existsSync(dir)) continue;
  const files = (await readdir(dir)).filter((f) => f.endsWith(".mdx"));
  for (const file of files) {
    process.stdout.write(`${kind}/${file} ... `);
    const result = await processFile(kind, file);
    summary[result.status].push(result);
    if (result.status === "ok") {
      console.log(`✓ ${result.photoPath} (${(result.bytes / 1024).toFixed(0)} KiB)`);
    } else if (result.status === "skip") {
      console.log(`- skip (${result.reason})`);
    } else {
      console.log(`✗ ${result.reason}`);
    }
    // Be polite: brief delay between requests.
    await sleep(250);
  }
}

console.log("\n=== Summary ===");
console.log(`✓ ${summary.ok.length} fetched`);
console.log(`- ${summary.skip.length} skipped (already had photo)`);
console.log(`✗ ${summary.fail.length} failed`);
if (summary.fail.length) {
  console.log("\nFailed:");
  for (const f of summary.fail) {
    console.log(`  ${f.slug}: ${f.reason}`);
  }
}
