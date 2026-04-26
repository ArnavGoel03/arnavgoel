import { NextResponse } from "next/server";
import { commitRepoFile } from "@/lib/github";

/**
 * Vercel Cron handler. Hit by `7 4 * * *` (daily, 04:07 UTC) to
 * refresh content/_listening.json from the Spotify Web API. The
 * snapshot powers the inline "On repeat" section on the homepage.
 *
 * Required env vars:
 *   - SPOTIFY_CLIENT_ID
 *   - SPOTIFY_CLIENT_SECRET
 *   - SPOTIFY_REFRESH_TOKEN
 *   - CRON_SECRET (Vercel passes Authorization: Bearer <CRON_SECRET>)
 *
 * Without those the route 503s and the homepage falls back to the
 * static SpotifyEmbed.
 *
 * Snapshot shape: see lib/listening.ts.
 *   - 6 most-recent plays
 *   - 8 short-term top tracks (the "this month" list)
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SpotifyTrack = {
  name: string;
  album?: { name: string; images?: { url: string }[] };
  artists?: { name: string }[];
  external_urls?: { spotify?: string };
};

async function getAccessToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refresh) return null;
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh,
    }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const j = (await res.json()) as { access_token?: string };
  return j.access_token ?? null;
}

function shapeTrack(t: SpotifyTrack, playedAt?: string) {
  return {
    title: t.name,
    artist: (t.artists ?? []).map((a) => a.name).join(", "),
    album: t.album?.name,
    imageUrl: t.album?.images?.[0]?.url,
    spotifyUrl: t.external_urls?.spotify,
    playedAt,
  };
}

export async function GET(req: Request): Promise<NextResponse> {
  const auth = req.headers.get("authorization") ?? "";
  if (
    process.env.CRON_SECRET &&
    auth !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json(
      { error: "Spotify env not configured" },
      { status: 503 },
    );
  }
  const headers = { Authorization: `Bearer ${token}` };

  const [recentRes, topRes] = await Promise.all([
    fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=6",
      { headers, cache: "no-store" },
    ),
    fetch(
      "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=8",
      { headers, cache: "no-store" },
    ),
  ]);

  if (!recentRes.ok || !topRes.ok) {
    return NextResponse.json(
      { error: "Spotify API error" },
      { status: 502 },
    );
  }

  const recentJson = (await recentRes.json()) as {
    items: { track: SpotifyTrack; played_at: string }[];
  };
  const topJson = (await topRes.json()) as { items: SpotifyTrack[] };

  const snapshot = {
    updatedAt: new Date().toISOString(),
    recent: recentJson.items.map((i) => shapeTrack(i.track, i.played_at)),
    topThisMonth: topJson.items.map((t) => shapeTrack(t)),
  };

  try {
    await commitRepoFile({
      path: "content/_listening.json",
      content: JSON.stringify(snapshot, null, 2) + "\n",
      message: "listening: nightly Spotify refresh",
    });
  } catch (err) {
    return NextResponse.json(
      { error: `commit failed: ${(err as Error).message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, ...snapshot });
}
