'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, SplitSquareHorizontal, ImageOff } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface Props {
  images: string[];
  beforeImages: string[];
  title: string;
}

export function ImageCarousel({ images, beforeImages, title }: Props) {
  const [current, setCurrent] = useState(0);
  const [showBefore, setShowBefore] = useState(false);
  const prefersReduced = useReducedMotion();

  const hasAfter = images.length > 0;
  const hasBefore = beforeImages.length > 0;
  const activeImages = showBefore ? beforeImages : images;

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? activeImages.length - 1 : c - 1));
  }, [activeImages.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c === activeImages.length - 1 ? 0 : c + 1));
  }, [activeImages.length]);

  if (!hasAfter && !hasBefore) {
    return (
      <div className="flex items-center justify-center h-40 bg-white/5">
        <div className="flex flex-col items-center gap-2 text-white/30">
          <ImageOff size={24} />
          <span className="text-xs">No photos available</span>
        </div>
      </div>
    );
  }

  const currentSrc = activeImages[Math.min(current, activeImages.length - 1)];

  return (
    <div className="relative h-48 bg-navy overflow-hidden">
      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${showBefore ? 'before' : 'after'}-${current}`}
          initial={prefersReduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReduced ? {} : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0"
        >
          {currentSrc ? (
            <Image
              src={currentSrc}
              alt={`${showBefore ? 'Before' : 'After'}: ${title} — photo ${current + 1}`}
              fill
              className="object-cover"
              sizes="340px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20 text-xs">
              No image
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-navy-mid/80 to-transparent pointer-events-none" />

      {/* Before/After toggle */}
      {hasAfter && hasBefore && (
        <button
          onClick={() => { setShowBefore((s) => !s); setCurrent(0); }}
          className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white min-h-[44px]"
          style={{ backdropFilter: 'blur(8px)', background: showBefore ? 'rgba(29,155,138,0.8)' : 'rgba(0,0,0,0.5)' }}
          aria-pressed={showBefore}
          aria-label={`Show ${showBefore ? 'after' : 'before'} photos`}
        >
          <SplitSquareHorizontal size={12} />
          {showBefore ? 'Before' : 'After'}
        </button>
      )}

      {/* Navigation arrows */}
      {activeImages.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white min-w-[44px] min-h-[44px]"
            aria-label="Previous photo"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white min-w-[44px] min-h-[44px]"
            aria-label="Next photo"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {activeImages.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5" aria-hidden="true">
          {activeImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all rounded-full focus:outline-none ${i === current ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'}`}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Label */}
      {(hasAfter && hasBefore) && (
        <span className="absolute bottom-2 left-3 text-xs text-white/50 font-medium">
          {showBefore ? 'Before' : 'After'}
        </span>
      )}
    </div>
  );
}
