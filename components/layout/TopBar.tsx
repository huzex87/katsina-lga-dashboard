'use client';

import { useEffect, useRef, useState } from 'react';
import { BarChart3, MapPin, Users, Landmark, TrendingUp } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { formatNaira, computeStats, animateCounter } from '@/lib/utils';
import { useReducedMotion } from 'framer-motion';

export function TopBar() {
  const { getVisibleProjects, filters } = useDashboardStore();
  const visible = getVisibleProjects();
  const stats = computeStats(visible);
  const prefersReduced = useReducedMotion();

  const [displayStats, setDisplayStats] = useState({ total: 0, communities: 0, investment: 0, wardsCovered: 0 });

  useEffect(() => {
    if (prefersReduced) {
      setDisplayStats(stats);
      return;
    }
    const dur = 800;
    animateCounter(0, stats.total, dur, (v) => setDisplayStats((s) => ({ ...s, total: v })));
    animateCounter(0, stats.communities, dur, (v) => setDisplayStats((s) => ({ ...s, communities: v })));
    animateCounter(0, stats.investment, dur, (v) => setDisplayStats((s) => ({ ...s, investment: v })));
    animateCounter(0, stats.wardsCovered, dur, (v) => setDisplayStats((s) => ({ ...s, wardsCovered: v })));
  }, [stats.total, stats.communities, stats.investment, stats.wardsCovered]);

  const items = [
    { icon: BarChart3, label: 'Total Projects', value: displayStats.total.toString(), color: 'text-teal' },
    { icon: MapPin, label: 'Communities Served', value: displayStats.communities.toString(), color: 'text-teal-light' },
    { icon: Landmark, label: 'Investment', value: formatNaira(displayStats.investment), color: 'text-gold' },
    { icon: Users, label: 'Wards Covered', value: `${displayStats.wardsCovered}/12`, color: 'text-white' },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-20 border-b border-white/10"
      style={{ backdropFilter: 'blur(16px)', background: 'rgba(10,22,40,0.92)' }}
    >
      <div className="flex items-center justify-between px-4 h-14">
        {/* Branding */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal/20 border border-teal/30">
            <TrendingUp size={16} className="text-teal" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-white leading-none">KATSINA LGA</p>
            <p className="text-[10px] text-white/40 leading-none mt-0.5">Project Impact Dashboard</p>
          </div>
        </div>

        {/* Stats — scrollable on mobile */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none ml-4" role="region" aria-label="Dashboard statistics">
          {items.map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/8 flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <Icon size={13} className={color} aria-hidden="true" />
              <div>
                <p
                  className={`text-sm font-bold tabular-nums ${color}`}
                  aria-live="polite"
                  aria-label={`${label}: ${value}`}
                >
                  {value}
                </p>
                <p className="text-[10px] text-white/40 hidden md:block leading-none">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Language toggle placeholder */}
        <div className="flex-shrink-0 ml-3">
          <button
            className="text-xs px-2.5 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors min-h-[36px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            aria-label="Toggle language between English and Hausa"
          >
            EN / HA
          </button>
        </div>
      </div>
    </header>
  );
}
