import { ImageResponse } from "next/og";
import { RoseMark } from "@/lib/og-rose";

export const runtime = "nodejs";
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

/**
 * 192x192 PWA icon. Dark plate, rose glyph, a subtle radial glow from
 * the upper-right so the mark feels dimensional instead of pasted on.
 * Glyph kept well inside the 80% maskable safe zone.
 */
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
          background:
            "radial-gradient(ellipse at 70% 20%, #2a2624 0%, #1c1917 55%, #171412 100%)",
        }}
      >
        <RoseMark size={120} />
      </div>
    ),
    size,
  );
}
