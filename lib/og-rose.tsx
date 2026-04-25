/**
 * Inline SVG of the site's rose ❋ glyph, for use inside @vercel/og
 * ImageResponse payloads. The literal U+274B character is not in any
 * standard system font, which makes Satori try to fetch a dynamic font
 * from Google for every OG render and log "Failed to load dynamic font"
 * 400 errors. Drawing it as eight rotated teardrops avoids the network
 * dependency entirely.
 */
export function RoseMark({
  size = 22,
  color = "#fb7185",
}: {
  size?: number;
  color?: string;
}) {
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill={color}>
        {angles.map((angle) => (
          <ellipse
            key={angle}
            cx="12"
            cy="5"
            rx="1.7"
            ry="4.6"
            transform={`rotate(${angle} 12 12)`}
          />
        ))}
        <circle cx="12" cy="12" r="2" />
      </g>
    </svg>
  );
}
