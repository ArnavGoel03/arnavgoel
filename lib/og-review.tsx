import { ImageResponse } from "next/og";
import type { Review } from "@/lib/types";
import { site } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const VERDICT_LABEL: Record<NonNullable<Review["verdict"]>, string> = {
  recommend: "Would recommend",
  okay: "Okayish",
  bad: "Bad",
};

const VERDICT_DOT: Record<NonNullable<Review["verdict"]>, string> = {
  recommend: "#10b981",
  okay: "#f59e0b",
  bad: "#f43f5e",
};

const VERDICT_TEXT: Record<NonNullable<Review["verdict"]>, string> = {
  recommend: "#047857",
  okay: "#b45309",
  bad: "#be123c",
};

export function reviewOgImage(review: Review) {
  const verdict = review.verdict;
  const verdictLabel = verdict ? VERDICT_LABEL[verdict] : "Still testing";
  const verdictDot = verdict ? VERDICT_DOT[verdict] : "#fbbf24";
  const verdictText = verdict ? VERDICT_TEXT[verdict] : "#78716c";

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
        {/* soft rose glow in the top-right */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -180,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "rgba(251, 207, 211, 0.45)",
            filter: "blur(120px)",
          }}
        />

        {/* Top rule: brand · category · issue mark */}
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
            <span>{review.brand}</span>
            <span style={{ color: "#d6d3d1" }}>·</span>
            <span>{review.category}</span>
          </div>
          <div style={{ fontFamily: "ui-monospace, monospace", color: "#a8a29e" }}>
            {site.name}
          </div>
        </div>

        {/* Middle: product name + verdict pill */}
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontSize: review.name.length > 38 ? 104 : 140,
              lineHeight: 0.98,
              letterSpacing: -6,
              maxWidth: 1040,
            }}
          >
            <span>{review.name}</span>
            <span style={{ color: "#fb7185" }}>.</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 34,
              fontStyle: "italic",
              color: verdictText,
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: verdictDot,
                display: "inline-block",
              }}
            />
            <span>{verdictLabel}</span>
            {review.price && (
              <>
                <span style={{ color: "#d6d3d1", fontStyle: "normal" }}>·</span>
                <span
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontStyle: "normal",
                    color: "#57534e",
                    fontSize: 28,
                  }}
                >
                  {review.price}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Bottom rule: site meta */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 28,
            paddingTop: 22,
            borderTop: "1px solid #e7e5e4",
            fontSize: 18,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#78716c",
            fontFamily: "ui-sans-serif, -apple-system, system-ui, sans-serif",
          }}
        >
          <span style={{ color: "#fb7185" }}>❋</span>
          <span>An honest catalog</span>
          <span style={{ color: "#d6d3d1" }}>·</span>
          <span>{site.location}</span>
          <span style={{ color: "#d6d3d1" }}>·</span>
          <span style={{ color: "#a8a29e" }}>0 sponsored</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
