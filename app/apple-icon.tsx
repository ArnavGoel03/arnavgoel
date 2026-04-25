import { ImageResponse } from "next/og";
import { RoseMark } from "@/lib/og-rose";

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * iOS home-screen icon. Dark plate with the rose mark and a small
 * italic 'Yash' wordmark near the bottom. iOS masks the corners into a
 * rounded square on its own, so we can bleed the plate edge-to-edge.
 */
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
            "radial-gradient(ellipse at 30% 20%, #2a2624 0%, #1c1917 55%, #131110 100%)",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            marginTop: -8,
          }}
        >
          <RoseMark size={110} />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 18,
            fontSize: 16,
            fontStyle: "italic",
            color: "#a8a29e",
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
