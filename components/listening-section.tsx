import { Container } from "@/components/container";
import { SpotifyEmbed } from "@/components/spotify-embed";
import { getListening, type ListeningTrack } from "@/lib/listening";

/**
 * Inline "What's on repeat" section. Lives on the homepage (and the
 * /now page can drop it in too). Reads content/_listening.json
 * written nightly by the Spotify cron.
 *
 * If the cron hasn't shipped a snapshot yet (env vars not set,
 * fresh deploy, etc.) the component falls back to the static
 * SpotifyEmbed of the user's go-to playlist, so the section never
 * shows an empty state on the public site.
 */
export function ListeningSection({
  fallbackPlaylistId,
  fallbackTitle,
}: {
  fallbackPlaylistId: string;
  fallbackTitle: string;
}) {
  const data = getListening();

  if (!data) {
    return (
      <Container className="border-t border-stone-200/70 py-20 dark:border-stone-900/40">
        <SectionHeader updatedAt={null} />
        <SpotifyEmbed playlistId={fallbackPlaylistId} title={fallbackTitle} />
      </Container>
    );
  }

  const recent = data.recent.slice(0, 5);
  const top = data.topThisMonth.slice(0, 5);

  return (
    <Container className="border-t border-stone-200/70 py-20 dark:border-stone-900/40">
      <SectionHeader updatedAt={data.updatedAt} />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
        {recent.length > 0 && (
          <TrackColumn label="Just played" tracks={recent} showTime />
        )}
        {top.length > 0 && (
          <TrackColumn label="Top of the month" tracks={top} numbered />
        )}
      </div>
    </Container>
  );
}

function SectionHeader({ updatedAt }: { updatedAt: string | null }) {
  return (
    <div className="mb-8 flex items-baseline justify-between gap-4">
      <div>
        <p className="mb-1 text-xs uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
          <span className="text-rose-400">♪</span> What is on repeat
        </p>
        <h2 className="font-serif text-3xl text-stone-900 dark:text-stone-100 sm:text-4xl">
          On repeat right now.
        </h2>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
          {updatedAt
            ? "Pulled from my actual Spotify, refreshed nightly."
            : "Press play, it opens right here."}
        </p>
      </div>
      {updatedAt && (
        <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500 sm:inline">
          Refreshed {timeAgo(updatedAt)}
        </span>
      )}
    </div>
  );
}

function TrackColumn({
  label,
  tracks,
  showTime,
  numbered,
}: {
  label: string;
  tracks: ListeningTrack[];
  showTime?: boolean;
  numbered?: boolean;
}) {
  return (
    <section>
      <h3 className="mb-4 border-b border-stone-200 pb-2 text-[10px] uppercase tracking-[0.2em] text-stone-500 dark:border-stone-800 dark:text-stone-400">
        {label}
      </h3>
      <ul className="space-y-3">
        {tracks.map((t, i) => (
          <TrackRow
            key={`${label}-${i}`}
            track={t}
            timeStamp={showTime ? timeAgo(t.playedAt) : undefined}
            index={numbered ? i + 1 : undefined}
          />
        ))}
      </ul>
    </section>
  );
}

function TrackRow({
  track,
  timeStamp,
  index,
}: {
  track: ListeningTrack;
  timeStamp?: string;
  index?: number;
}) {
  const inner = (
    <div className="flex items-center gap-3">
      {typeof index === "number" && (
        <span
          aria-hidden
          className="font-display text-lg font-light tabular-nums text-stone-300 dark:text-stone-700"
        >
          {String(index).padStart(2, "0")}
        </span>
      )}
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-800">
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
        <p className="truncate font-serif text-base text-stone-900 dark:text-stone-100">
          {track.title}
        </p>
        <p className="truncate text-[11px] uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">
          {track.artist}
        </p>
      </div>
      {timeStamp && (
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">
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
          className="block rounded-lg px-2 py-1.5 transition-colors hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 dark:hover:bg-stone-900"
        >
          {inner}
        </a>
      ) : (
        <div className="px-2 py-1.5">{inner}</div>
      )}
    </li>
  );
}

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
