import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "ConnectPi Support Help Center";
export const size = {
  width: 1200,
  height: 630,
};
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
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#2A1668",
          padding: "60px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 20,
            backgroundColor: "#5B2FC9",
            color: "#FFFFFF",
            fontSize: 48,
            fontWeight: "bold",
            marginBottom: 32,
          }}
        >
          π
        </div>

        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: 1.15,
            marginBottom: 16,
          }}
        >
          ConnectPi Support
        </div>

        <div
          style={{
            fontSize: 26,
            color: "#C9C2E3",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Troubleshooting, guides, and help for ConnectPi Web, App & Blade Rush
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
