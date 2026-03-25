"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [text, setText] = useState("Agents in the wild");
  const [color, setColor] = useState("#ffffff");
  const [size, setSize] = useState(120);
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(630);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  function generateUrl() {
    const params = new URLSearchParams({
      text,
      color,
      size: String(size),
      width: String(width),
      height: String(height),
    });
    return `/api/render?${params.toString()}`;
  }

  function handleGenerate() {
    setLoading(true);
    const url = generateUrl();
    setImageUrl(url);
  }

  async function handleDownload() {
    const url = generateUrl();
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `dot-text-${text.slice(0, 30).replace(/\s+/g, "-")}.png`;
    a.click();
    URL.revokeObjectURL(blobUrl);
  }

  return (
    <div className="flex flex-col flex-1 bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-lg font-semibold tracking-tight font-mono">
          Dot Text — Geist Pixel Renderer
        </h1>
      </header>

      <main className="flex flex-1 flex-col lg:flex-row">
        {/* Controls */}
        <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-zinc-800 p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="text" className="text-sm text-zinc-400">
              Text
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500 resize-none"
              placeholder="Enter text to render..."
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label htmlFor="color" className="text-sm text-zinc-400">
                Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-8 w-8 rounded border border-zinc-700 bg-zinc-900 cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="size" className="text-sm text-zinc-400">
              Font Size: {size}px
            </label>
            <input
              type="range"
              id="size"
              min={24}
              max={400}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="accent-zinc-400"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label htmlFor="width" className="text-sm text-zinc-400">
                Width
              </label>
              <input
                type="number"
                id="width"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                min={200}
                max={3840}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label htmlFor="height" className="text-sm text-zinc-400">
                Height
              </label>
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                min={200}
                max={2160}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={handleGenerate}
              className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              Generate
            </button>
            {imageUrl && (
              <button
                onClick={handleDownload}
                className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
              >
                Download PNG
              </button>
            )}
          </div>
        </aside>

        {/* Preview */}
        <section className="flex-1 flex items-center justify-center p-6 overflow-auto">
          {imageUrl ? (
            <div className="relative">
              {/* Checkerboard background to show transparency */}
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #1a1a1a 25%, transparent 25%),
                    linear-gradient(-45deg, #1a1a1a 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #1a1a1a 75%),
                    linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)
                  `,
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Generated dot text"
                className="relative max-w-full h-auto rounded-lg"
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
              />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/50 rounded-lg">
                  <div className="text-sm text-zinc-400">Rendering...</div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-zinc-600 text-sm">
              Enter text and click Generate to preview
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
