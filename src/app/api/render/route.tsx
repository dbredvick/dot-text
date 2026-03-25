import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const fontPath = join(process.cwd(), "src/fonts/GeistPixel-Circle.otf");

let fontData: ArrayBuffer | null = null;

async function getFont() {
  if (!fontData) {
    const buffer = await readFile(fontPath);
    fontData = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );
  }
  return fontData;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text") || "Hello World";
  const color = searchParams.get("color") || "#ffffff";
  const size = Math.min(Number(searchParams.get("size") || "120"), 400);
  const width = Math.min(Number(searchParams.get("width") || "1200"), 3840);
  const height = Math.min(Number(searchParams.get("height") || "630"), 2160);

  const font = await getFont();

  const svg = await satori(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          fontFamily: "GeistPixel-Circle",
          fontSize: size,
          color: color,
          textAlign: "center",
          lineHeight: 1.2,
          wordBreak: "break-word",
        }}
      >
        {text}
      </div>
    </div>,
    {
      width,
      height,
      fonts: [
        {
          name: "GeistPixel-Circle",
          data: font,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    background: "rgba(0, 0, 0, 0)",
    fitTo: { mode: "width", value: width },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(new Uint8Array(pngBuffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
