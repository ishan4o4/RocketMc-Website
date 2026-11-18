import { ImageResponse } from "next/og";

export const alt = "RocketMC — The high-performance Minecraft server, written in Rust";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#140a05",
          padding: "72px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: "rgba(249,115,22,0.22)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -120,
            width: 480,
            height: 480,
            borderRadius: 9999,
            background: "rgba(220,38,38,0.18)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 22,
              background: "linear-gradient(135deg, #fb923c, #dc2626)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid rgba(255,255,255,0.4)",
            }}
          >
            <div style={{ fontSize: 44, color: "#ffffff", fontWeight: 700 }}>R</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#ffffff" }}>
              <span>Rocket</span>
              <span style={{ color: "#fb923c" }}>MC</span>
            </div>
            <div style={{ fontSize: 20, color: "#a8a29e", fontFamily: "monospace" }}>
              rocketmc.dev
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 700, color: "#ffffff", lineHeight: 1.05 }}>
            The Minecraft server engine,
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              background: "linear-gradient(90deg, #fb923c, #ef4444)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            written in Rust.
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {[
            "Vanilla 26.3 parity",
            "Java + Bedrock built-in",
            "Exploit protections",
            "No JVM required",
          ].map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 9999,
                border: "1px solid rgba(249,115,22,0.45)",
                background: "rgba(249,115,22,0.12)",
                color: "#fdba74",
                fontSize: 22,
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
