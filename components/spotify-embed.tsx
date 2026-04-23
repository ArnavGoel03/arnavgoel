export function SpotifyEmbed({
  playlistId,
  title = "Spotify playlist",
}: {
  playlistId: string;
  title?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-sm md:max-w-2xl lg:max-w-4xl">
      <iframe
        title={title}
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        className="block h-[420px] w-full overflow-hidden rounded-2xl border border-stone-200 md:h-[380px] lg:h-[460px]"
        style={{ colorScheme: "normal" }}
      />
    </div>
  );
}
