import { del, head, list, put } from "@vercel/blob";

/**
 * Soft-delete plumbing for Vercel Blob assets.
 *
 * Idea: instead of calling `del()` directly, we *move* the asset to a
 * `__trash/<deletedAt-iso>-<originalKey>` key. The image still lives in
 * storage at a new URL, but the public site stops referencing it
 * because the corresponding MDX `photo:` field gets cleared at the same
 * time. A daily cron then scans `__trash/*` and physically deletes
 * anything older than 30 days.
 *
 * Why move instead of mark-with-metadata: Vercel Blob has no
 * mutable metadata or tags layer; the pathname is the only handle we
 * can attach state to.
 *
 * Restore: undo the move, copy the bytes back to the original key,
 * delete the trash entry.
 */

const TRASH_PREFIX = "__trash/";
export const TRASH_GRACE_DAYS = 30;

function nowIsoSafe(): string {
  // 2026-04-25T05-30-12-345Z, safe inside Blob pathnames (no colons).
  return new Date().toISOString().replace(/[:.]/g, "-");
}

/**
 * Encode the original key into the trash key so restore can find it
 * again. Format:
 *
 *   __trash/<deletedAtIso>__<originalKey>
 *
 * `__` (double underscore) is the separator; original keys can contain
 * single underscores but never double.
 */
function trashKeyFor(originalPathname: string): string {
  return `${TRASH_PREFIX}${nowIsoSafe()}__${originalPathname}`;
}

function parseTrashKey(
  pathname: string,
): { deletedAt: Date; originalPathname: string } | null {
  if (!pathname.startsWith(TRASH_PREFIX)) return null;
  const rest = pathname.slice(TRASH_PREFIX.length);
  const sep = rest.indexOf("__");
  if (sep === -1) return null;
  const isoSafe = rest.slice(0, sep);
  const originalPathname = rest.slice(sep + 2);
  // Restore the colons / dots from the safe form for Date parsing.
  const iso = isoSafe.replace(/-/g, (m, idx) => {
    // Keep the dashes inside the date portion (YYYY-MM-DD) intact.
    if (idx <= 10) return m;
    // After "T" position, restore : in HH:MM:SS and . in .sss.
    return idx === 13 || idx === 16 ? ":" : idx === 19 ? "." : m;
  });
  const deletedAt = new Date(iso);
  if (Number.isNaN(deletedAt.getTime())) return null;
  return { deletedAt, originalPathname };
}

/**
 * Move an asset from its current key to a timestamped trash key.
 * Returns the new (trash) URL the admin can save for later restore.
 */
export async function softDeleteBlob(
  publicUrl: string,
): Promise<{ trashUrl: string; trashKey: string }> {
  const info = await head(publicUrl);
  const originalPathname = info.pathname;
  const trashKey = trashKeyFor(originalPathname);

  // Copy bytes into the trash key.
  const res = await fetch(publicUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${publicUrl} for soft-delete`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const moved = await put(trashKey, buf, {
    access: "public",
    addRandomSuffix: false,
    contentType: info.contentType ?? undefined,
  });

  // Drop the original.
  await del(publicUrl);

  return { trashUrl: moved.url, trashKey };
}

/**
 * Move an asset back from trash to its original pathname. Returns the
 * restored public URL.
 */
export async function restoreBlob(
  trashUrl: string,
): Promise<{ publicUrl: string }> {
  const info = await head(trashUrl);
  const parsed = parseTrashKey(info.pathname);
  if (!parsed) {
    throw new Error(`URL is not a trash entry: ${trashUrl}`);
  }
  const res = await fetch(trashUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${trashUrl} for restore`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const restored = await put(parsed.originalPathname, buf, {
    access: "public",
    addRandomSuffix: false,
    contentType: info.contentType ?? undefined,
  });
  await del(trashUrl);
  return { publicUrl: restored.url };
}

export type TrashEntry = {
  url: string;
  pathname: string;
  originalPathname: string;
  deletedAt: string;
  expiresAt: string;
  size: number;
};

export async function listTrashed(): Promise<TrashEntry[]> {
  const out: TrashEntry[] = [];
  let cursor: string | undefined = undefined;
  do {
    const page: Awaited<ReturnType<typeof list>> = await list({
      prefix: TRASH_PREFIX,
      cursor,
    });
    for (const blob of page.blobs) {
      const parsed = parseTrashKey(blob.pathname);
      if (!parsed) continue;
      const expiresAt = new Date(parsed.deletedAt);
      expiresAt.setUTCDate(expiresAt.getUTCDate() + TRASH_GRACE_DAYS);
      out.push({
        url: blob.url,
        pathname: blob.pathname,
        originalPathname: parsed.originalPathname,
        deletedAt: parsed.deletedAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        size: blob.size,
      });
    }
    cursor = page.cursor;
  } while (cursor);
  // Soonest-to-expire first.
  out.sort((a, b) => a.expiresAt.localeCompare(b.expiresAt));
  return out;
}

/**
 * Physically delete every trash entry whose deletedAt is more than
 * `TRASH_GRACE_DAYS` ago. Returns the URLs that were purged.
 */
export async function purgeExpiredTrash(): Promise<{
  purged: string[];
  scanned: number;
}> {
  const cutoff = Date.now() - TRASH_GRACE_DAYS * 24 * 60 * 60 * 1000;
  const purged: string[] = [];
  let scanned = 0;
  let cursor: string | undefined = undefined;
  do {
    const page: Awaited<ReturnType<typeof list>> = await list({
      prefix: TRASH_PREFIX,
      cursor,
    });
    for (const blob of page.blobs) {
      scanned++;
      const parsed = parseTrashKey(blob.pathname);
      if (!parsed) continue;
      if (parsed.deletedAt.getTime() > cutoff) continue;
      await del(blob.url);
      purged.push(blob.url);
    }
    cursor = page.cursor;
  } while (cursor);
  return { purged, scanned };
}
