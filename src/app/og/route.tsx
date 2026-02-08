import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const fontData = await fetch(
    "https://fonts.gstatic.com/s/ibmplexmono/v19/-F63fjptAgt5VM-kVkqdyU8n5iQ.woff2"
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0A0A0A",
          color: "white",
          fontFamily: "IBM Plex Mono",
          padding: "60px",
        }}
      >
        {/* Terminal prompt icon + name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
            <path
              d="M4 8L14 16L4 24"
              stroke="#91D982"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 24H28"
              stroke="#91D982"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <span
            style={{
              fontSize: "64px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            VIBESTARTER
          </span>
        </div>

        {/* Tagline */}
        <span
          style={{
            fontSize: "24px",
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          Time-released crowdfunding for vibecoded apps
        </span>

        {/* Accent bar */}
        <div
          style={{
            width: "120px",
            height: "4px",
            backgroundColor: "#91D982",
            borderRadius: "2px",
            marginTop: "32px",
          }}
        />

        {/* Built on Base */}
        <span
          style={{
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.3)",
            marginTop: "32px",
          }}
        >
          Built on Base — the on-chain home of AI agents
        </span>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "IBM Plex Mono",
          data: fontData,
          style: "normal",
          weight: 500,
        },
      ],
    }
  );
}
