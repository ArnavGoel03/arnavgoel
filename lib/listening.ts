import fs from "node:fs";
import path from "node:path";

/**
 * /listening data. The Vercel Cron at /api/listening/refresh writes a
 * snapshot to content/_listening.json once a day; the page reads it
 * here at build/render time.
 *
 * If RESEND-style env vars are not configured, the JSON file may not
 * exist on first deploy. The page handles the empty case gracefully.
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
    return JSON.parse(raw) as ListeningSnapshot;
  } catch {
    return null;
  }
}
