'use client';

import { Compass, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '@/store/dashboardStore';

export function MapControls() {
  const { filters, setView } = useDashboardStore();

  return (
    <div
      className="relative flex rounded-xl p-1 gap-1"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
      role="group"
      aria-label="Map view mode"
    >
      {(['pins', 'heatmap'] as const).map((view) => {
        const active = filters.view === view;
        const Icon = view === 'pins' ? Compass : Layers;
        const label = view === 'pins' ? 'Pins' : 'Heatmap';
        return (
          <button
            key={view}
            onClick={() => setView(view)}
            className={`relative flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-200 min-h-[40px] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal z-10 ${
              active ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}
            aria-pressed={active}
            aria-label={`Switch to ${label} view`}
          >
            {active && (
              <motion.span
                layoutId="map-view-indicator"
                className="absolute inset-0 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #1D9B8A, #145F55)',
                  boxShadow: '0 0 12px rgba(29,155,138,0.35)',
                }}
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                aria-hidden="true"
              />
            )}
            <Icon size={13} className="relative z-10 flex-shrink-0" aria-hidden="true" />
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
