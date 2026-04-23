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

export function getPhotos(): Photo[] {
  return readPhotosFromDisk().sort((a, b) => b.date.localeCompare(a.date));
}

export const photos: Photo[] = getPhotos();
