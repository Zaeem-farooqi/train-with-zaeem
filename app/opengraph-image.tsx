import { ImageResponse } from "next/og";

export const alt = "Train with Zaeem — Personal trainer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#070807",
          color: "#f3f1ea",
          padding: "72px",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 8,
            color: "#ccff00",
            textTransform: "uppercase",
          }}
        >
          Online anywhere · Lahore & Islamabad
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 84,
            lineHeight: 0.92,
            fontWeight: 600,
            letterSpacing: -2,
          }}
        >
          I train and teach.
        </div>
        <div style={{ marginTop: 28, fontSize: 28, color: "#9a9a94" }}>
          Train with Zaeem
        </div>
      </div>
    ),
    { ...size },
  );
}
