#!/usr/bin/env node
/**
 * One-time: move every product photo currently in `public/products/`
 * onto Vercel Blob, rewrite the corresponding MDX `photo:` field to
 * the Blob URL, and delete the local file. Idempotent: photos already
 * pointing at Blob (or non-existent locally) are skipped.
 *
 * Run from the repo root after pulling env vars locally:
 *
 *   vercel env pull
 *   node scripts/migrate-photos-to-blob.mjs
 *
 * Then commit the MDX edits + the public/products deletions in one go.
 */

import { readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { put } from "@vercel/blob";

const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));
const PUBLIC_PRODUCTS_DIR = join(REPO_ROOT, "public", "products");
const SKINCARE_DIR = join(REPO_ROOT, "content", "skincare");
const SUPPLEMENTS_DIR = join(REPO_ROOT, "content", "supplements");
const ORAL_CARE_DIR = join(REPO_ROOT, "content", "oral-care");

const CONTENT_TYPE_BY_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error(
    "BLOB_READ_WRITE_TOKEN is missing. Run `vercel env pull` first.",
  );
  process.exit(1);
}

const localFiles = existsSync(PUBLIC_PRODUCTS_DIR)
  ? await readdir(PUBLIC_PRODUCTS_DIR)
  : [];

if (localFiles.length === 0) {
  console.log("Nothing in public/products/ to migrate. Done.");
  process.exit(0);
}

const mdxFiles = [];
for (const dir of [SKINCARE_DIR, SUPPLEMENTS_DIR, ORAL_CARE_DIR]) {
  if (!existsSync(dir)) continue;
  const entries = await readdir(dir);
  for (const f of entries) {
    if (f.endsWith(".mdx")) mdxFiles.push(join(dir, f));
  }
}

let migrated = 0;
let skipped = 0;
let referencesRewritten = 0;

for (const file of localFiles) {
  const localPath = join(PUBLIC_PRODUCTS_DIR, file);
  const publicPath = `/products/${file}`;
  const ext = file.includes(".")
    ? "." + file.split(".").pop().toLowerCase()
    : "";
  const contentType = CONTENT_TYPE_BY_EXT[ext];
  if (!contentType) {
    console.warn(`Skipping ${file} (unknown extension).`);
    skipped++;
    continue;
  }

  const buf = await readFile(localPath);
  const blobKey = `products/${basename(file)}`;
  const blob = await put(blobKey, buf, {
    access: "public",
    addRandomSuffix: false,
    contentType,
  });
  console.log(`Uploaded ${publicPath} → ${blob.url}`);

  for (const mdxPath of mdxFiles) {
    const original = await readFile(mdxPath, "utf8");
    if (!original.includes(publicPath)) continue;
    const rewritten = original.replaceAll(publicPath, blob.url);
    if (rewritten !== original) {
      await writeFile(mdxPath, rewritten, "utf8");
      console.log(`  rewrote ${basename(mdxPath)}`);
      referencesRewritten++;
    }
  }

  await rm(localPath);
  migrated++;
}

console.log(
  `\nDone. Migrated ${migrated} file(s), rewrote ${referencesRewritten} MDX reference(s), skipped ${skipped}.`,
);
console.log(
  "Review the diff (`git status`, `git diff`) and commit when satisfied.",
);
