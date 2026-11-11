import React from "react";
import Image from "next/image";

interface ScreenshotProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export function Screenshot({
  src,
  alt,
  caption,
  width = 1200,
  height = 675,
}: ScreenshotProps) {
  return (
    <figure className="my-6 block">
      <div className="relative overflow-hidden rounded-r-lg border border-border bg-surface shadow-sm">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto object-cover max-h-[500px]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 720px, 800px"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs sm:text-sm text-ink-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
