import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Graphic & Motion Designer · Toby Johnson · TJCreate";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Edge-rendered OpenGraph image. Fires off whenever a link to the site
 * is shared — LinkedIn, Twitter/X, WhatsApp, Slack, iMessage, etc. —
 * and gives every crawler a proper 1200×630 preview instead of a 404.
 *
 * Uses the site's paper/ink palette + accent red so the social card
 * reads as part of the same brand the site does. Fully self-contained
 * (no external fonts or assets) so the edge renderer never has to
 * wait on a network fetch while Google is watching.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#fffdf8",
          color: "#0a0a0a",
          padding: 72,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(10,10,10,0.55)",
          }}
        >
          <span>Portfolio 2026</span>
          <span style={{ margin: "0 16px" }}>·</span>
          <span>TJCREATE.CO.UK</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 140,
              fontWeight: 700,
              lineHeight: 0.92,
              letterSpacing: -4,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <span>Toby Johnson</span>
            <span style={{ color: "#E6352A" }}>.</span>
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 400,
              color: "rgba(10,10,10,0.75)",
              lineHeight: 1.2,
              maxWidth: 980,
            }}
          >
            Graphic &amp; motion designer building visual systems for record
            labels, artists and ambitious brands.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "rgba(10,10,10,0.55)",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#80EF80",
                display: "block",
              }}
            />
            Available for select projects
          </span>
          <span>hello@tjcreate.co.uk</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
