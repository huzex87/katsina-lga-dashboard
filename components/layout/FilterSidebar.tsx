'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { SlidersHorizontal, X, Check } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { ALL_CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS, type ProjectCategory } from '@/types/project';
import { MapControls } from '@/components/map/MapControls';

export function FilterSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { filters, setCategory, setAllCategories } = useDashboardStore();
  const prefersReduced = useReducedMotion();
  const allActive = filters.categories.size === ALL_CATEGORIES.length;

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* All toggle */}
      <div className="p-4 border-b border-white/10">
        <button
          onClick={() => setAllCategories(!allActive)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal ${
            allActive
              ? 'bg-teal/20 text-teal border border-teal/30'
              : 'bg-white/5 text-white/60 border border-white/10 hover:border-white/20'
          }`}
          aria-pressed={allActive}
          aria-label={allActive ? 'Deselect all sectors' : 'Select all sectors'}
        >
          <span>All Sectors</span>
          {allActive && <Check size={14} />}
        </button>
      </div>

      {/* Category pills */}
      <div className="p-4 space-y-2">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-3 font-medium">Sectors</p>
        {ALL_CATEGORIES.map((cat) => {
          const active = filters.categories.has(cat);
          const color = CATEGORY_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat, !active)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal ${
                active
                  ? 'text-white border'
                  : 'text-white/40 border border-transparent hover:text-white/70 hover:bg-white/5'
              }`}
              style={active ? {
                background: `${color}15`,
                borderColor: `${color}40`,
              } : {}}
              aria-pressed={active}
              aria-label={`${active ? 'Deselect' : 'Select'} ${CATEGORY_LABELS[cat]} sector`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform"
                style={{
                  backgroundColor: active ? color : 'rgba(255,255,255,0.2)',
                  transform: active ? 'scale(1)' : 'scale(0.8)',
                }}
                aria-hidden="true"
              />
              <span className="text-left flex-1 leading-tight">{CATEGORY_LABELS[cat]}</span>
              {active && (
                <span className="text-xs font-bold ml-auto" style={{ color }}>✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* View toggle section */}
      <div className="p-4 border-t border-white/10 mt-auto">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-3 font-medium">Map View</p>
        <MapControls />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex fixed left-0 top-14 bottom-0 w-56 flex-col z-10 border-r border-white/10"
        style={{ backdropFilter: 'blur(16px)', background: 'rgba(10,22,40,0.88)' }}
        aria-label="Filter sidebar"
      >
        <SidebarContent />
      </aside>

      {/* Mobile FAB */}
      <button
        className="md:hidden fixed bottom-24 left-4 z-20 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl border border-white/10 text-white text-sm font-semibold min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        style={{ backdropFilter: 'blur(16px)', background: 'rgba(29,155,138,0.85)' }}
        onClick={() => setMobileOpen(true)}
        aria-label="Open sector filters"
        aria-expanded={mobileOpen}
      >
        <SlidersHorizontal size={16} />
        Filters
        {filters.categories.size < ALL_CATEGORIES.length && (
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-gold text-navy text-xs font-bold">
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
              className="fixed bottom-0 left-0 right-0 h-[75vh] z-40 md:hidden rounded-t-2xl border-t border-white/10 overflow-hidden"
              style={{ backdropFilter: 'blur(20px)', background: 'rgba(10,22,40,0.96)' }}
              initial={prefersReduced ? {} : { y: '100%' }}
              animate={{ y: 0 }}
              exit={prefersReduced ? {} : { y: '100%' }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Sector filters"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="w-10 h-1 rounded-full bg-white/20 mx-auto" />
              </div>
              <div className="flex items-center justify-between px-4 py-2">
                <h2 className="text-sm font-bold text-white">Filter Sectors</h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-white/60 hover:text-white transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                  aria-label="Close filter panel"
                >
                  <X size={16} />
                </button>
              </div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
