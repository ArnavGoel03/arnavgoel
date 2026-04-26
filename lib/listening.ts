import fs from "node:fs";
import path from "node:path";

/**
 * Spotify "what's on repeat" data. The Vercel cron at
 * /api/listening/refresh writes a fresh snapshot to
 * content/_listening.json once a day; the homepage section reads it
 * here at build/render time.
 *
 * Lives inline on the homepage (and /now), never as a standalone
 * /listening route. If Spotify env vars are not configured the cron
 * is a no-op and the homepage gracefully falls back to the static
 * SpotifyEmbed of a public playlist.
 */

export type ListeningTrack = {
  title: string;
  artist: string;
  album?: string;
  imageUrl?: string;
  spotifyUrl?: string;
  playedAt?: string;
};

export type ListeningSnapshot = {
  updatedAt: string;
  recent: ListeningTrack[];
  topThisMonth: ListeningTrack[];
  obsession?: ListeningTrack & { note?: string };
};

const DATA_PATH = path.join(process.cwd(), "content", "_listening.json");

export function getListening(): ListeningSnapshot | null {
  try {
    if (!fs.existsSync(DATA_PATH)) return null;
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw) as ListeningSnapshot;
    if (!parsed?.recent?.length && !parsed?.topThisMonth?.length) return null;
    return parsed;
  } catch {
    return null;
  }
}
