import { ImageResponse } from "next/og";
import { RoseMark } from "@/lib/og-rose";

export const runtime = "nodejs";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/**
 * 512x512 PWA icon, used for the maskable variant on Android adaptive
 * launchers. Glyph sits inside the 80% safe zone so a circular or
 * rounded-square mask never clips the mark.
 */
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
          background:
            "radial-gradient(ellipse at 70% 20%, #2a2624 0%, #1c1917 55%, #171412 100%)",
        }}
      >
        <RoseMark size={300} />
      </div>
    ),
    size,
  );
}
