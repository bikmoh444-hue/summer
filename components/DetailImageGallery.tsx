'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FullscreenImageViewer } from '@/components/FullscreenImageViewer';

export function DetailImageGallery({
  images,
  alt,
  hero = false
}: {
  images: string[];
  alt: string;
  hero?: boolean;
}) {
  const safeImages = images.length ? images : ['/beach-summer.png'];
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  function openViewer(index: number) {
    setViewerIndex(index);
    setViewerOpen(true);
  }

  if (hero) {
    return (
      <>
        <button type="button" className="relative block h-64 w-full overflow-hidden" onClick={() => openViewer(0)} aria-label="Agrandir l'image">
          <Image src={safeImages[0]} alt={alt} fill sizes="100vw" priority quality={74} className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ocean via-ocean/40 to-transparent" />
        </button>
        <FullscreenImageViewer images={safeImages} alt={alt} open={viewerOpen} index={viewerIndex} onClose={() => setViewerOpen(false)} onIndexChange={setViewerIndex} />
      </>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div className="card-glass max-w-full p-3">
          <button type="button" className="relative block aspect-[4/5] w-full overflow-hidden rounded-2xl md:aspect-square" onClick={() => openViewer(0)} aria-label="Agrandir l'image">
            <Image src={safeImages[0]} alt={alt} fill sizes="(min-width: 1024px) 50vw, 100vw" priority quality={74} className="object-cover" />
          </button>
        </div>
        {safeImages.length > 1 && (
          <div className="grid max-w-full grid-cols-4 gap-3 overflow-hidden">
            {safeImages.slice(0, 4).map((url, index) => (
              <button
                type="button"
                key={`${url}-${index}`}
                className="relative aspect-square overflow-hidden rounded-xl border border-white/20 bg-white/10"
                onClick={() => openViewer(index)}
                aria-label={`Agrandir l'image ${index + 1}`}
              >
                <Image src={url} alt={alt} fill sizes="120px" loading="lazy" quality={60} className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <FullscreenImageViewer images={safeImages} alt={alt} open={viewerOpen} index={viewerIndex} onClose={() => setViewerOpen(false)} onIndexChange={setViewerIndex} />
    </>
  );
}
