import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CardNewsSlide {
  id: number;
  type: 'cover' | 'problem' | 'solution' | 'data' | 'proof' | 'cta';
  bgGradient: string;
  headline: string;
  body: string;
  accentColor: string;
  dataPoints?: { label: string; value: string }[];
  ctaText?: string;
}

interface CardNewsViewerProps {
  slides: CardNewsSlide[];
  productName?: string;
}

export default function CardNewsViewer({ slides, productName }: CardNewsViewerProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const prev = () => current > 0 && goTo(current - 1);
  const next = () => current < slides.length - 1 && goTo(current + 1);

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* Slide Container — 4:5 aspect ratio */}
      <div className="relative w-full" style={{ paddingBottom: '125%' }}>
        <div className="absolute inset-0 rounded-xl overflow-hidden border border-slate-600 shadow-lg">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 60 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
              style={{ background: slide.bgGradient }}
            >
              {/* Type badge */}
              <div className="absolute top-3 left-3">
                <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/30 text-white/70">
                  {slide.type}
                </span>
              </div>

              {/* Slide number */}
              <div className="absolute top-3 right-3">
                <span className="text-[9px] font-mono text-white/50">
                  {current + 1}/{slides.length}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col items-center justify-center gap-3 max-w-[90%]">
                {slide.type === 'cover' && productName && (
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-1">
                    {productName}
                  </div>
                )}

                <h3
                  className="text-lg font-bold leading-tight"
                  style={{ color: slide.accentColor }}
                >
                  {slide.headline}
                </h3>

                <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
                  {slide.body}
                </p>

                {/* Data points */}
                {slide.dataPoints && slide.dataPoints.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2 w-full">
                    {slide.dataPoints.map((dp, i) => (
                      <div key={i} className="bg-black/20 rounded-lg p-2 text-center">
                        <div className="text-lg font-bold" style={{ color: slide.accentColor }}>
                          {dp.value}
                        </div>
                        <div className="text-[10px] text-white/60">{dp.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA button */}
                {slide.ctaText && (
                  <div
                    className="mt-3 px-5 py-2 rounded-full text-sm font-bold text-white shadow-lg"
                    style={{ backgroundColor: slide.accentColor }}
                  >
                    {slide.ctaText}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          {current > 0 && (
            <button
              onClick={prev}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white/80 flex items-center justify-center hover:bg-black/60 transition-colors z-10 text-sm"
            >
              ‹
            </button>
          )}
          {current < slides.length - 1 && (
            <button
              onClick={next}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white/80 flex items-center justify-center hover:bg-black/60 transition-colors z-10 text-sm"
            >
              ›
            </button>
          )}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
