'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export function FullscreenImageViewer({
  images,
  alt,
  open,
  index,
  onClose,
  onIndexChange
}: {
  images: string[];
  alt: string;
  open: boolean;
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const lastTapRef = useRef(0);

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousBodyOverflow = document.body.style.overflow;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      document.body.style.overflow = previousBodyOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') go(-1);
      if (event.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  useEffect(() => {
    if (open) setZoomed(false);
  }, [index, open]);

  if (!open || images.length === 0) return null;

  const current = Math.max(0, Math.min(index, images.length - 1));
  const hasMultiple = images.length > 1;

  function go(direction: -1 | 1) {
    if (!images.length) return;
    onIndexChange((current + direction + images.length) % images.length);
  }

  function toggleZoom() {
    setZoomed((value) => !value);
  }

  function handleTouchEnd() {
    const now = Date.now();
    if (now - lastTapRef.current < 280) {
      toggleZoom();
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/86 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" onClick={onClose}>
      <button
        type="button"
        onClick={onClose}
        className="focus-ring absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md"
        aria-label="Fermer l'image"
      >
        <X className="h-6 w-6" />
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              go(-1);
            }}
            className="focus-ring absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md"
            aria-label="Image precedente"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              go(1);
            }}
            className="focus-ring absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md"
            aria-label="Image suivante"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </>
      )}

      <div
        className="relative h-full max-h-[88vh] w-full max-w-6xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
        onDoubleClick={toggleZoom}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[current]}
          alt={alt}
          fill
          sizes="100vw"
          priority
          quality={90}
          className={`object-contain transition-transform duration-200 ${zoomed ? 'scale-200 cursor-zoom-out' : 'scale-100 cursor-zoom-in'}`}
        />
      </div>
    </div>
  );
}
