'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { SlidersHorizontal, X, Check } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { ALL_CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS, type ProjectCategory } from '@/types/project';
import { MapControls } from '@/components/map/MapControls';

export function FilterSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { filters, setCategory, setAllCategories, projects } = useDashboardStore();
  const prefersReduced = useReducedMotion();
  const allActive = filters.categories.size === ALL_CATEGORIES.length;

  const countsByCategory = useMemo(() => {
    const counts: Partial<Record<ProjectCategory, number>> = {};
    for (const p of projects) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, [projects]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-none">
      {/* All toggle */}
      <div className="p-4 border-b border-white/10">
        <button
          onClick={() => setAllCategories(!allActive)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal ${
            allActive
              ? 'bg-teal/15 text-teal border border-teal/30'
              : 'bg-white/5 text-white/60 border border-white/10 hover:border-white/20 hover:text-white'
          }`}
          aria-pressed={allActive}
          aria-label={allActive ? 'Deselect all sectors' : 'Select all sectors'}
        >
          <span>All Sectors</span>
          {allActive && <Check size={14} aria-hidden="true" />}
        </button>
      </div>

      {/* Category pills */}
      <div className="p-4 space-y-1">
        <p className="text-[11px] text-white/30 uppercase tracking-widest mb-3 font-semibold">Sectors</p>
        {ALL_CATEGORIES.map((cat) => {
          const active = filters.categories.has(cat);
          const color = CATEGORY_COLORS[cat];
          const count = countsByCategory[cat] ?? 0;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat, !active)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal relative overflow-hidden ${
                active ? 'text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/5'
              }`}
              style={
                active
                  ? { background: `${color}12`, border: `1px solid ${color}35` }
                  : { border: '1px solid transparent' }
              }
              aria-pressed={active}
              aria-label={`${active ? 'Deselect' : 'Select'} ${CATEGORY_LABELS[cat]} sector`}
            >
              {/* Left accent bar */}
              <span
                className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full transition-all duration-200"
                style={{
                  backgroundColor: active ? color : 'transparent',
                  opacity: active ? 1 : 0,
                }}
                aria-hidden="true"
              />

              <span
                className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-200"
                style={{
                  backgroundColor: active ? color : 'rgba(255,255,255,0.18)',
                  boxShadow: active ? `0 0 6px ${color}80` : 'none',
                }}
                aria-hidden="true"
              />
              <span className="text-left flex-1 leading-tight font-medium text-xs">{CATEGORY_LABELS[cat]}</span>

              {/* Count badge */}
              {count > 0 && (
                <span
                  className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: active ? `${color}25` : 'rgba(255,255,255,0.07)',
                    color: active ? color : 'rgba(255,255,255,0.35)',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Map view toggle */}
      <div className="p-4 border-t border-white/10 mt-auto">
        <p className="text-[11px] text-white/30 uppercase tracking-widest mb-3 font-semibold">Map View</p>
        <MapControls />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex fixed left-0 top-14 bottom-14 w-56 flex-col z-10 border-r border-white/10"
        style={{ backdropFilter: 'blur(16px)', background: 'rgba(10,22,40,0.88)' }}
        aria-label="Sector filter sidebar"
      >
        <SidebarContent />
      </aside>

      {/* Mobile FAB */}
      <button
        className="md:hidden fixed bottom-20 left-4 z-20 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl border border-white/10 text-white text-sm font-semibold min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal cursor-pointer"
        style={{ backdropFilter: 'blur(16px)', background: 'rgba(29,155,138,0.85)', boxShadow: '0 4px 20px rgba(29,155,138,0.35)' }}
        onClick={() => setMobileOpen(true)}
        aria-label="Open sector filters"
        aria-expanded={mobileOpen}
        aria-haspopup="dialog"
      >
        <SlidersHorizontal size={16} aria-hidden="true" />
        Filters
        {filters.categories.size < ALL_CATEGORIES.length && (
          <span
            className="ml-1 px-1.5 py-0.5 rounded-full bg-gold text-navy text-xs font-bold tabular-nums"
            aria-label={`${filters.categories.size} sectors selected`}
          >
            {filters.categories.size}
          </span>
        )}
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 h-[78vh] z-40 md:hidden rounded-t-2xl border-t border-white/10 overflow-hidden flex flex-col"
              style={{ backdropFilter: 'blur(20px)', background: 'rgba(10,22,40,0.97)' }}
              initial={prefersReduced ? {} : { y: '100%' }}
              animate={{ y: 0 }}
              exit={prefersReduced ? {} : { y: '100%' }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              role="dialog"
              aria-modal="true"
              aria-label="Sector filters"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-2 flex-shrink-0" aria-hidden="true">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Drawer header */}
              <div className="flex items-center justify-between px-4 pb-3 border-b border-white/10 flex-shrink-0">
                <div>
                  <h2 className="text-sm font-bold text-white">Filter Sectors</h2>
                  <p className="text-[11px] text-white/40 mt-0.5">
                    {filters.categories.size} of {ALL_CATEGORIES.length} active
                  </p>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                  aria-label="Close filter panel"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto">
                <SidebarContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
