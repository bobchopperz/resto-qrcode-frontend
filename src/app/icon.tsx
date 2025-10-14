import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

export const dynamic = 'force-static';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: "#0F172A", // A dark blue/slate color
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: 6,
        }}
      >
        RR
      </div>
    ),
    { ...size }
  );
}