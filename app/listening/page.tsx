import type { Metadata } from "next";
import { Container } from "@/components/container";
import { getListening } from "@/lib/listening";

export const metadata: Metadata = {
  title: "Listening",
  description:
    "What's been on repeat. Recent plays and the month's most-played tracks, refreshed nightly from Spotify.",
  alternates: { canonical: "/listening" },
};

export const dynamic = "force-static";
export const revalidate = 3600;

function timeAgo(iso?: string): string {
  if (!iso) return "";
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.round(ms / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export default function ListeningPage() {
  const data = getListening();

  return (
    <Container className="max-w-3xl py-16 sm:py-20">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>What is on repeat</span>
        </span>
        {data?.updatedAt && (
          <span className="font-mono text-stone-400 dark:text-stone-500">
            Refreshed {timeAgo(data.updatedAt)}
          </span>
        )}
      </div>

      <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-stone-900 sm:text-6xl dark:text-stone-100">
        Listening<span className="text-rose-400">.</span>
      </h1>
      <p className="mt-6 max-w-2xl font-serif text-lg italic leading-snug text-stone-600 sm:text-xl dark:text-stone-300">
        Pulled from my actual Spotify, refreshed nightly. Not a curated
        playlist trying to look good, just whatever is genuinely on
        rotation right now.
      </p>

      {!data ? (
        <div className="mt-16 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-12 text-center dark:border-stone-700 dark:bg-stone-900">
          <p className="font-serif text-xl italic text-stone-500 dark:text-stone-400">
            Spotify connection not yet wired.
          </p>
          <p className="mt-3 max-w-md mx-auto text-sm text-stone-500 dark:text-stone-400">
            Set <code>SPOTIFY_CLIENT_ID</code>,{" "}
            <code>SPOTIFY_CLIENT_SECRET</code>,{" "}
            <code>SPOTIFY_REFRESH_TOKEN</code>, and <code>CRON_SECRET</code>{" "}
            in Vercel, then the nightly cron will write
            <code> content/_listening.json</code> and this page will
            light up.
          </p>
        </div>
      ) : (
        <>
          {data.obsession && (
            <section className="mt-16 rounded-3xl border border-stone-200 bg-gradient-to-br from-rose-50/40 via-white to-white p-8 sm:p-12 dark:border-stone-800 dark:from-rose-950/20 dark:via-stone-900 dark:to-stone-900">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-rose-500 dark:text-rose-400">
                ❋ Currently obsessed with
              </p>
              <h2 className="font-serif text-3xl text-stone-900 dark:text-stone-100 sm:text-4xl">
                {data.obsession.title}
              </h2>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                {data.obsession.artist}
                {data.obsession.album && (
                  <span className="text-stone-300 dark:text-stone-700">
                    {" "}
                    · {data.obsession.album}
                  </span>
                )}
              </p>
              {data.obsession.note && (
                <p className="mt-5 max-w-prose font-serif text-base italic leading-relaxed text-stone-700 dark:text-stone-300">
                  {data.obsession.note}
                </p>
              )}
            </section>
          )}

          {data.recent?.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-6 border-b border-stone-200 pb-3 font-display text-3xl font-light tracking-tight text-stone-900 dark:border-stone-800 dark:text-stone-100">
                Just played
              </h2>
              <ul className="space-y-4">
                {data.recent.map((t, i) => (
                  <TrackRow key={`r-${i}`} track={t} timeStamp={timeAgo(t.playedAt)} />
                ))}
              </ul>
            </section>
          )}

          {data.topThisMonth?.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-6 border-b border-stone-200 pb-3 font-display text-3xl font-light tracking-tight text-stone-900 dark:border-stone-800 dark:text-stone-100">
                Top of the month
              </h2>
              <ul className="space-y-4">
                {data.topThisMonth.map((t, i) => (
                  <TrackRow key={`t-${i}`} track={t} index={i + 1} />
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </Container>
  );
}

function TrackRow({
  track,
  timeStamp,
  index,
}: {
  track: import("@/lib/listening").ListeningTrack;
  timeStamp?: string;
  index?: number;
}) {
  const inner = (
    <div className="flex items-center gap-4">
      {typeof index === "number" && (
        <span
          aria-hidden
          className="font-display text-2xl font-light tabular-nums text-stone-300 dark:text-stone-700"
        >
          {String(index).padStart(2, "0")}
        </span>
      )}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-800">
        {track.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={track.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-serif text-stone-300 dark:text-stone-600">
            ♪
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-serif text-lg text-stone-900 dark:text-stone-100">
          {track.title}
        </p>
        <p className="truncate text-xs uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
          {track.artist}
        </p>
      </div>
      {timeStamp && (
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
          {timeStamp}
        </span>
      )}
    </div>
  );
  return (
    <li>
      {track.spotifyUrl ? (
        <a
          href={track.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl px-2 py-2 transition-colors hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 dark:hover:bg-stone-900"
        >
          {inner}
        </a>
      ) : (
        <div className="px-2 py-2">{inner}</div>
      )}
    </li>
  );
}
