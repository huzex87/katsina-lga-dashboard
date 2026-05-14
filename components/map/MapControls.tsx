'use client';

import { useRef } from 'react';
import { Plus, Minus, Compass, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '@/store/dashboardStore';

export function MapControls() {
  const { filters, setView } = useDashboardStore();

  return (
    <div className="absolute bottom-24 right-4 flex flex-col gap-2 z-10">
      {/* View toggle */}
      <motion.div
        className="flex flex-col rounded-xl overflow-hidden border border-white/10 shadow-xl"
        style={{ backdropFilter: 'blur(12px)', background: 'rgba(10,22,40,0.85)' }}
      >
        <button
          onClick={() => setView('pins')}
          className={`flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors min-h-[44px] ${
            filters.view === 'pins'
              ? 'bg-teal text-white'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          aria-pressed={filters.view === 'pins'}
          aria-label="Switch to pin view"
        >
          <Compass size={14} />
          <span>Pins</span>
        </button>
        <div className="h-px bg-white/10" />
        <button
          onClick={() => setView('heatmap')}
          className={`flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors min-h-[44px] ${
            filters.view === 'heatmap'
              ? 'bg-teal text-white'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          aria-pressed={filters.view === 'heatmap'}
          aria-label="Switch to heatmap view"
        >
          <Layers size={14} />
          <span>Heat</span>
        </button>
      </motion.div>
    </div>
  );
}
