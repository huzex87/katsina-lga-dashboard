'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '@/store/dashboardStore';

const YEARS = ['all', '2022', '2023', '2024', '2025'] as const;
const YEAR_OPTIONS = YEARS.filter((y) => y !== 'all');

export function TimelineBar() {
  const { filters, setYear } = useDashboardStore();
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    let idx = YEAR_OPTIONS.indexOf(filters.year as (typeof YEAR_OPTIONS)[number]);
    if (idx < 0) idx = -1;

    intervalRef.current = setInterval(() => {
      idx++;
      if (idx >= YEAR_OPTIONS.length) {
        setPlaying(false);
        setYear('all');
        return;
      }
      setYear(YEAR_OPTIONS[idx]);
    }, 1500);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, filters.year, setYear]);

  const handlePlay = () => {
    if (playing) { setPlaying(false); return; }
    if (filters.year === YEAR_OPTIONS[YEAR_OPTIONS.length - 1]) setYear('all');
    setPlaying(true);
  };

  const currentIdx = YEAR_OPTIONS.indexOf(filters.year as (typeof YEAR_OPTIONS)[number]);
  const progress = currentIdx >= 0 ? ((currentIdx + 1) / YEAR_OPTIONS.length) * 100 : 0;

  return (
    <nav
      data-glass=""
      className="fixed bottom-0 left-0 right-0 md:left-56 z-10"
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        background: 'var(--surface-deep)',
        borderTop: '1px solid var(--border)',
        boxShadow: '0 -4px 32px var(--shadow)',
        transition: 'background 0.25s ease',
      }}
      aria-label="Year timeline filter"
    >
      {/* Progress line */}
      <div className="relative h-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{ background: 'linear-gradient(90deg, #1D9B8A, #25C4AE)' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="flex items-center gap-2 px-4 py-2.5">
        {/* Play / Pause */}
        <button
          onClick={handlePlay}
          className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 flex-shrink-0 min-w-[44px] min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          style={playing ? {
            background: 'linear-gradient(135deg, #1D9B8A, #145F55)',
            boxShadow: '0 0 16px rgba(29,155,138,0.45)',
            border: '1px solid rgba(29,155,138,0.4)',
          } : {
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          aria-label={playing ? 'Pause timeline' : 'Play timeline through years'}
          aria-pressed={playing}
        >
          {playing
            ? <Pause size={14} className="text-white" />
            : <Play size={14} className="text-white/50" />
          }
        </button>

        {/* Reset */}
        <button
          onClick={() => { setPlaying(false); setYear('all'); }}
          className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 flex-shrink-0 min-w-[44px] min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          aria-label="Reset to all years"
        >
          <RotateCcw size={12} className="text-white/30" />
        </button>

        {/* Divider */}
        <div className="h-4 w-px flex-shrink-0 mx-0.5" style={{ background: 'rgba(255,255,255,0.08)' }} aria-hidden="true" />

        {/* Year label */}
        <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.18em] flex-shrink-0 hidden sm:block">
          Year
        </span>

        {/* Year pills */}
        <div
          className="flex items-center gap-1 overflow-x-auto scrollbar-none flex-1"
          role="group"
          aria-label="Filter by year"
        >
          {YEARS.map((year) => {
            const active = filters.year === year;
            return (
              <button
                key={year}
                onClick={() => { setPlaying(false); setYear(year); }}
                className={`relative flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[36px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal tabular-nums ${
                  active ? 'text-navy' : 'text-white/35 hover:text-white/70 hover:bg-white/5'
                }`}
                aria-pressed={active}
                aria-label={year === 'all' ? 'Show all years' : `Filter to ${year}`}
              >
                {active && (
                  <motion.span
                    layoutId="year-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: 'linear-gradient(135deg, #1D9B8A, #25C4AE)',
                      boxShadow: '0 0 14px rgba(29,155,138,0.5)',
                    }}
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{year === 'all' ? 'All' : year}</span>
              </button>
            );
          })}
        </div>

        {/* Live badge */}
        <AnimatePresence>
          {playing && (
            <motion.div
              className="flex items-center gap-1.5 flex-shrink-0"
              initial={{ opacity: 0, scale: 0.85, x: 8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: 8 }}
              transition={{ duration: 0.2 }}
              aria-live="polite"
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: '#25C4AE' }}
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: '#25C4AE' }}>
                Live
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
