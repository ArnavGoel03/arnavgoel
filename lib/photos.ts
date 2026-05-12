import fs from "node:fs";
import path from "node:path";
import type { Photo } from "./types";

const PHOTOS_FILE = path.join(process.cwd(), "content", "photos.json");

function readPhotosFromDisk(): Photo[] {
  if (!fs.existsSync(PHOTOS_FILE)) return [];
  const raw = fs.readFileSync(PHOTOS_FILE, "utf8");
  const data = JSON.parse(raw) as Photo[];
  return data;
}

/**
 * All photos in manifest order, including hidden ones. For admin use.
 */
export function getAllPhotos(): Photo[] {
  return readPhotosFromDisk();
}

/**
 * Public photo feed: drops hidden entries and sorts newest first by
 * `date`. Used by `/photos` and anywhere else on the public site.
 */
export function getPhotos(): Photo[] {
  return readPhotosFromDisk()
    .filter((p) => !p.hidden)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const photos: Photo[] = getPhotos();
