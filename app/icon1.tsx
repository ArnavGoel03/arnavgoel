import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon192() {
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
          fontSize: 130,
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
