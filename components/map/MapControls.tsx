'use client';

import { Compass, Layers } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';

export function MapControls() {
  const { filters, setView } = useDashboardStore();

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden border border-white/10 shadow-xl"
      style={{ backdropFilter: 'blur(12px)', background: 'rgba(10,22,40,0.85)' }}
      role="group"
      aria-label="Map view mode"
    >
      <button
        onClick={() => setView('pins')}
        className={`flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal ${
          filters.view === 'pins'
            ? 'bg-teal text-white'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        }`}
        aria-pressed={filters.view === 'pins'}
        aria-label="Switch to pin view"
      >
        <Compass size={14} aria-hidden="true" />
        <span>Pins</span>
      </button>
      <div className="h-px bg-white/10" aria-hidden="true" />
      <button
        onClick={() => setView('heatmap')}
        className={`flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal ${
          filters.view === 'heatmap'
            ? 'bg-teal text-white'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        }`}
        aria-pressed={filters.view === 'heatmap'}
        aria-label="Switch to heatmap view"
      >
        <Layers size={14} aria-hidden="true" />
        <span>Heat</span>
      </button>
    </div>
  );
}
