import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const alt = `${site.name}, ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          background:
            "linear-gradient(180deg, #fafaf8 0%, #f5f5f4 60%, #ffffff 100%)",
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: "#1c1917",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(251, 207, 211, 0.45)",
            filter: "blur(120px)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#78716c",
            fontFamily: "ui-sans-serif, -apple-system, system-ui, sans-serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ color: "#fb7185", fontSize: 22 }}>❋</span>
            <span>{site.location}</span>
          </div>
          <div style={{ fontFamily: "ui-monospace, monospace", color: "#a8a29e" }}>
            {site.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontStyle: "italic",
              fontSize: 36,
              color: "#78716c",
              marginBottom: 12,
            }}
          >
            An honest catalog of
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontSize: 220,
              lineHeight: 0.92,
              letterSpacing: -8,
            }}
          >
            <span>{site.name}</span>
            <span style={{ color: "#fb7185" }}>.</span>
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.25,
              color: "#57534e",
              maxWidth: 920,
            }}
          >
            {site.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 36,
            paddingTop: 22,
            borderTop: "1px solid #e7e5e4",
            fontSize: 18,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#78716c",
            fontFamily: "ui-sans-serif, -apple-system, system-ui, sans-serif",
          }}
        >
          <span>Skincare</span>
          <span style={{ color: "#d6d3d1" }}>·</span>
          <span>Supplements</span>
          <span style={{ color: "#d6d3d1" }}>·</span>
          <span>Oral care</span>
          <span style={{ color: "#d6d3d1" }}>·</span>
          <span style={{ color: "#a8a29e" }}>0 sponsored</span>
        </div>
      </div>
    ),
    size,
  );
}
