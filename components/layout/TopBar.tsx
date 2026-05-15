'use client';

import { useEffect, useRef, useState } from 'react';
import { BarChart3, MapPin, Users, Landmark, TrendingUp } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { formatNaira, computeStats, animateCounter } from '@/lib/utils';
import { useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export function TopBar() {
  const projects = useDashboardStore((s) => s.projects);
  const filters = useDashboardStore((s) => s.filters);
  const prefersReduced = useReducedMotion();
  const { lang, toggle } = useLanguage();

  const visibleProjects = projects.filter(
    (p) =>
      filters.categories.has(p.category) &&
      (filters.year === 'all' || p.completion_date?.startsWith(filters.year))
  );
  const stats = computeStats(visibleProjects);

  const prevStats = useRef(stats);
  const [displayStats, setDisplayStats] = useState(stats);

  useEffect(() => {
    const prev = prevStats.current;
    prevStats.current = stats;

    if (prefersReduced) {
      setDisplayStats(stats);
      return;
    }
    const dur = 600;
    animateCounter(prev.total, stats.total, dur, (v) => setDisplayStats((s) => ({ ...s, total: v })));
    animateCounter(prev.communities, stats.communities, dur, (v) => setDisplayStats((s) => ({ ...s, communities: v })));
    animateCounter(prev.investment, stats.investment, dur, (v) => setDisplayStats((s) => ({ ...s, investment: v })));
    animateCounter(prev.wardsCovered, stats.wardsCovered, dur, (v) => setDisplayStats((s) => ({ ...s, wardsCovered: v })));
  }, [stats.total, stats.communities, stats.investment, stats.wardsCovered, prefersReduced]);

  const items = [
    { icon: BarChart3,  label: 'Projects',     fullLabel: 'Total Projects',      value: displayStats.total.toString(),              color: '#1D9B8A' },
    { icon: MapPin,     label: 'Communities',  fullLabel: 'Communities Served',  value: displayStats.communities.toString(),         color: '#25C4AE' },
    { icon: Landmark,   label: 'Investment',   fullLabel: 'Total Investment',    value: formatNaira(displayStats.investment),        color: '#F5A623' },
    { icon: Users,      label: 'Wards',        fullLabel: 'Wards Covered',       value: `${displayStats.wardsCovered}/12`,          color: '#FFFFFF' },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-20 border-b border-white/10"
      style={{ backdropFilter: 'blur(16px)', background: 'rgba(10,22,40,0.92)' }}
    >
      {/* Teal accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, #1D9B8A 0%, #25C4AE 40%, transparent 100%)' }}
        aria-hidden="true"
      />

      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      <div className="flex items-center justify-between px-3 sm:px-4 h-14 gap-2">
        {/* Branding */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-teal/30 flex-shrink-0"
            style={{
              background: 'rgba(29,155,138,0.15)',
              boxShadow: '0 0 12px rgba(29,155,138,0.25)',
            }}
            aria-hidden="true"
          >
            <TrendingUp size={15} className="text-teal" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-white tracking-wide leading-none">KATSINA LGA</p>
            <p className="text-[10px] text-white/40 leading-none mt-0.5 tracking-wide">Project Impact Dashboard</p>
          </div>
        </div>

        {/* Stats */}
        <div
          className="flex items-center gap-1 overflow-x-auto scrollbar-none flex-1 justify-center sm:justify-end"
          role="region"
          aria-label="Dashboard statistics"
        >
          {items.map(({ icon: Icon, label, fullLabel, value, color }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-white/[0.06] flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <Icon size={13} aria-hidden="true" style={{ color }} />
              <div>
                <p
                  className="text-sm font-bold tabular-nums leading-none"
                  style={{ color }}
                  aria-live="polite"
                  aria-label={`${fullLabel}: ${value}`}
                >
                  {value}
                </p>
                <p className="text-[10px] text-white/35 hidden sm:block leading-none mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Language toggle */}
        <div className="flex-shrink-0">
          <button
            onClick={toggle}
            className="text-xs px-3 py-2.5 rounded-lg border transition-all min-h-[44px] min-w-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal cursor-pointer font-semibold tabular-nums"
            style={lang === 'ha' ? {
              background: 'rgba(29,155,138,0.12)',
              border: '1px solid rgba(29,155,138,0.35)',
              color: '#25C4AE',
            } : {
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.10)',
              color: 'rgba(255,255,255,0.50)',
            }}
            aria-label={lang === 'en' ? 'Switch to Hausa language' : 'Switch to English language'}
            aria-pressed={lang === 'ha'}
          >
            {lang === 'en' ? 'EN' : 'HA'}
          </button>
        </div>
      </div>
    </header>
  );
}
