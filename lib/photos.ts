import photosData from "../content/photos.json";
import type { Photo } from "./types";

// photos.json is imported as a module so it's bundled into the build
// output. Works on both Node and Edge runtimes — required since
// /photos now runs on Edge for sub-50ms TTFB.

/**
 * All photos in manifest order, including hidden ones. For admin use.
 */
export function getAllPhotos(): Photo[] {
  return photosData as Photo[];
}

/**
 * Public photo feed: drops hidden entries and sorts newest first by
 * `date`. Used by `/photos` and anywhere else on the public site.
 */
export function getPhotos(): Photo[] {
  return (photosData as Photo[])
    .filter((p) => !p.hidden)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const photos: Photo[] = getPhotos();
