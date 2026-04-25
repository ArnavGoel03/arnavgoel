#!/usr/bin/env node
/**
 * Walk every MDX file. For each `photo:` field that points at a third-
 * party CDN (Kiwla / iHerb / Tira / DistaUSA / Nutricost / etc.), fetch
 * the bytes, upload them to Vercel Blob under
 * `products/<slug>.<ext>`, then rewrite the MDX field to the Blob URL.
 *
 * Idempotent: photos already hosted on Vercel Blob (URL contains
 * `.public.blob.vercel-storage.com`) or referencing local
 * `/products/...` paths are skipped on the next run.
 *
 * Why this exists: hot-linking to retailer CDNs is fragile — Kiwla can
 * change a product slug, Nutricost can re-version a Shopify image,
 * iHerb can rotate paths. We want the photos to live on infrastructure
 * we control. Run after pulling env vars locally:
 *
 *   vercel env pull
 *   node scripts/mirror-remote-photos-to-blob.mjs
 *
 * Then commit the MDX edits.
 */

import { readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { put } from "@vercel/blob";

const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));
const CONTENT_DIRS = [
  join(REPO_ROOT, "content", "skincare"),
  join(REPO_ROOT, "content", "supplements"),
  join(REPO_ROOT, "content", "oral-care"),
];

const EXT_BY_MIME = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
};

function isAlreadyOnOurInfra(url) {
  if (!url) return true;
  if (url.startsWith("/")) return true;
  if (url.includes(".public.blob.vercel-storage.com")) return true;
  return false;
}

function inferExt(url, contentType) {
  if (contentType && EXT_BY_MIME[contentType.toLowerCase()]) {
    return EXT_BY_MIME[contentType.toLowerCase()];
  }
  // Fall back to the URL pathname extension.
  try {
    const u = new URL(url);
    const ext = extname(u.pathname).toLowerCase();
    if (ext && /^\.[a-z]+$/.test(ext)) return ext;
  } catch {
    // ignore
  }
  return ".jpg";
}

function readPhotoField(content) {
  const match = content.match(/^photo:\s*(.+)$/m);
  if (!match) return null;
  const raw = match[1].trim();
  // Strip surrounding quotes if any.
  return raw.replace(/^['"]/, "").replace(/['"]$/, "");
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error(
    "BLOB_READ_WRITE_TOKEN is missing. Run `vercel env pull` first, then re-run this script.",
  );
  process.exit(1);
}

const mdxFiles = [];
for (const dir of CONTENT_DIRS) {
  if (!existsSync(dir)) continue;
  const entries = await readdir(dir);
  for (const f of entries) {
    if (f.endsWith(".mdx")) mdxFiles.push(join(dir, f));
  }
}

let mirrored = 0;
let skipped = 0;
let failed = 0;

for (const mdxPath of mdxFiles) {
  const slug = basename(mdxPath, ".mdx");
  const original = await readFile(mdxPath, "utf8");
  const photoUrl = readPhotoField(original);

  if (!photoUrl) {
    skipped++;
    continue;
  }
  if (isAlreadyOnOurInfra(photoUrl)) {
    skipped++;
    continue;
  }

  console.log(`Mirroring ${slug}: ${photoUrl}`);
  let res;
  try {
    res = await fetch(photoUrl, {
      // A few retailer CDNs (Nutricost shopify, Kiwla bigcommerce) 403
      // bots without a sane UA. Pretend to be a browser.
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
    });
  } catch (err) {
    console.error(`  FETCH ERROR: ${err.message}`);
    failed++;
    continue;
  }
  if (!res.ok) {
    console.error(`  HTTP ${res.status} ${res.statusText}`);
    failed++;
    continue;
  }

  const buf = Buffer.from(await res.arrayBuffer());
  const ext = inferExt(photoUrl, res.headers.get("content-type"));
  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const blobKey = `products/${slug}${ext}`;

  let blob;
  try {
    blob = await put(blobKey, buf, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType,
    });
  } catch (err) {
    console.error(`  BLOB UPLOAD ERROR: ${err.message}`);
    failed++;
    continue;
  }

  const rewritten = original.replace(
    /^photo:\s*.+$/m,
    `photo: ${blob.url}`,
  );
  if (rewritten !== original) {
    await writeFile(mdxPath, rewritten, "utf8");
    console.log(`  → ${blob.url}`);
    mirrored++;
  } else {
    console.warn(`  WARN: regex did not rewrite ${slug}.mdx`);
    failed++;
  }
}

console.log(
  `\nDone. Mirrored ${mirrored}, skipped ${skipped} (already on our infra or no photo), failed ${failed}.`,
);
console.log(
  "Review the diff (`git diff`) and commit when satisfied.",
);
