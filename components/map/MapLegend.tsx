'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/types/project';

export function MapLegend() {
  const [open, setOpen] = useState(true);

  return (
    <div
      className="absolute bottom-4 right-4 z-20 rounded-xl overflow-hidden"
      style={{
        backdropFilter: 'blur(16px)',
        background: 'rgba(10,22,40,0.92)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
        minWidth: 156,
      }}
    >
      {/* Header / toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal"
        aria-expanded={open}
        aria-label={open ? 'Collapse legend' : 'Expand legend'}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Legend</span>
        {open
          ? <ChevronDown size={12} className="text-white/30" />
          : <ChevronUp size={12} className="text-white/30" />
        }
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-1 border-t border-white/10">
          {/* Category pins */}
          <p className="text-[9px] font-semibold uppercase tracking-widest text-white/30 pt-2 pb-1">Sectors</p>
          {(Object.entries(CATEGORY_LABELS) as [keyof typeof CATEGORY_LABELS, string][]).map(([cat, label]) => (
            <div key={cat} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: CATEGORY_COLORS[cat],
                  boxShadow: `0 0 5px ${CATEGORY_COLORS[cat]}80`,
                }}
              />
              <span className="text-[10px] text-white/55 leading-none">{label}</span>
            </div>
          ))}

          {/* Status */}
          <p className="text-[9px] font-semibold uppercase tracking-widest text-white/30 pt-2 pb-1">Status</p>
          {([
            { label: 'Completed', color: 'rgba(255,255,255,0.9)', ring: '' },
            { label: 'Ongoing', color: '#F5A623', ring: '0 0 0 2px rgba(245,166,35,0.5)' },
            { label: 'Planning', color: 'rgba(255,255,255,0.25)', ring: '' },
          ] as const).map(({ label, color, ring }) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-white/20"
                style={{ backgroundColor: color, boxShadow: ring || undefined }}
              />
              <span className="text-[10px] text-white/55 leading-none">{label}</span>
            </div>
          ))}

          {/* Ward fill */}
          <p className="text-[9px] font-semibold uppercase tracking-widest text-white/30 pt-2 pb-1">Ward Density</p>
          <div className="flex items-center gap-1.5">
            <div
              className="h-2 w-20 rounded-full flex-shrink-0"
              style={{
                background: 'linear-gradient(90deg, rgba(29,155,138,0.05), rgba(29,155,138,0.25))',
                border: '1px solid rgba(29,155,138,0.20)',
              }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-white/30 mt-0.5">
            <span>Few</span>
            <span>Many</span>
          </div>
        </div>
      )}
    </div>
  );
}
