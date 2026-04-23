import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

// 512x512 "maskable-safe": keeps the glyph inside a 410px center square
// (≈20% total padding) so Android adaptive-icon masks don't clip the mark.
export default function Icon512() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafaf8",
          color: "#fb7185",
          fontSize: 300,
          lineHeight: 1,
          fontFamily: "Georgia, serif",
        }}
      >
        ❋
      </div>
    ),
    size,
  );
}
