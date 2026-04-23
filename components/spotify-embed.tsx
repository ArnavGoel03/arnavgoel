export function SpotifyEmbed({
  playlistId,
  title = "Spotify playlist",
}: {
  playlistId: string;
  title?: string;
}) {
  return (
    <iframe
      title={title}
      src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`}
      width="100%"
      height="152"
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      className="block overflow-hidden rounded-2xl border border-stone-200"
      style={{ colorScheme: "normal" }}
    />
  );
}
