import { ImageResponse } from "next/og";
import { RoseMark } from "@/lib/og-rose";

export const runtime = "nodejs";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * 32x32 favicon. Dark mark on a near-black plate, which reads equally
 * well against light and dark browser chrome (inverting the old light
 * plate fixes the 'red lines on a white square' look that jumped out
 * against the dark site body).
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1c1917",
        }}
      >
        <RoseMark size={22} />
      </div>
    ),
    size,
  );
}
