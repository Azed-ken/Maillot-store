"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

export default function ProductGallery({
  photos,
  alt,
}: {
  photos: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const images = photos.length ? photos : [];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-xl2 bg-ink-800/5">
        {images.length ? (
          <Image
            src={images[active]}
            alt={alt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-6xl">👕</div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((photo, i) => (
            <button
              key={photo + i}
              onClick={() => setActive(i)}
              className={clsx(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                active === i ? "border-ink-950" : "border-transparent opacity-60"
              )}
            >
              <Image src={photo} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
