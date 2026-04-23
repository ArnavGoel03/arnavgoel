import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at 30% 20%, #fff5f6 0%, #fafaf8 55%, #f5f5f4 100%)",
          color: "#fb7185",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 120,
            lineHeight: 1,
            marginTop: -8,
          }}
        >
          ❋
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 18,
            fontSize: 16,
            fontStyle: "italic",
            color: "#78716c",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          Yash
        </div>
      </div>
    ),
    size,
  );
}
