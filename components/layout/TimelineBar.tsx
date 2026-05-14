'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '@/store/dashboardStore';

const YEARS = ['all', '2022', '2023', '2024', '2025'] as const;

export function TimelineBar() {
  const { filters, setYear } = useDashboardStore();
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const yearOptions = YEARS.filter((y) => y !== 'all');
    let idx = yearOptions.indexOf(filters.year as (typeof yearOptions)[number]);
    if (idx < 0) idx = -1;

    intervalRef.current = setInterval(() => {
      idx++;
      if (idx >= yearOptions.length) {
        setPlaying(false);
        setYear('all');
        return;
      }
      setYear(yearOptions[idx]);
    }, 1500);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, filters.year, setYear]);

  const handlePlay = () => {
    if (playing) {
      setPlaying(false);
    } else {
      if (filters.year === '2025') setYear('all');
      setPlaying(true);
    }
  };

  const handleReset = () => {
    setPlaying(false);
    setYear('all');
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 md:left-56 z-10 border-t border-white/10"
      style={{ backdropFilter: 'blur(16px)', background: 'rgba(10,22,40,0.92)' }}
      aria-label="Year timeline filter"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Play/Pause */}
        <button
          onClick={handlePlay}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all flex-shrink-0 min-w-[44px] min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          aria-label={playing ? 'Pause timeline animation' : 'Play timeline animation through years'}
          aria-pressed={playing}
        >
          {playing ? <Pause size={15} /> : <Play size={15} />}
        </button>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all flex-shrink-0 min-w-[44px] min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          aria-label="Reset timeline to all years"
        >
          <RotateCcw size={13} />
        </button>

        <div className="w-px h-5 bg-white/10 flex-shrink-0" aria-hidden="true" />

        {/* Year pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none" role="group" aria-label="Filter by year">
          {YEARS.map((year) => {
            const active = filters.year === year;
            return (
              <button
                key={year}
                onClick={() => { setPlaying(false); setYear(year); }}
                className={`relative flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all min-h-[36px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal ${
                  active
                    ? 'text-navy'
                    : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                }`}
                aria-pressed={active}
                aria-label={year === 'all' ? 'Show all years' : `Filter to year ${year}`}
              >
                {active && (
                  <motion.span
                    layoutId="year-pill"
                    className="absolute inset-0 rounded-lg bg-teal"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{year === 'all' ? 'All Years' : year}</span>
              </button>
            );
          })}
        </div>

        {/* Playing indicator */}
        {playing && (
          <motion.div
            className="flex items-center gap-1.5 text-xs text-teal flex-shrink-0 ml-auto"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            aria-live="polite"
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-teal"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            Playing
          </motion.div>
        )}
      </div>
    </nav>
  );
}
