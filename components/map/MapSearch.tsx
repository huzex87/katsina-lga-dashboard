'use client';

import { useState, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '@/store/dashboardStore';
import { CATEGORY_COLORS } from '@/types/project';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Project } from '@/types/project';

export function MapSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { projects, selectProject } = useDashboardStore();
  const { lang } = useLanguage();

  const results: Project[] = query.trim().length < 2 ? [] : projects.filter((p) => {
    const q = query.toLowerCase();
    const title = (lang === 'ha' && p.title_ha ? p.title_ha : p.title_en).toLowerCase();
    return (
      title.includes(q) ||
      p.community.toLowerCase().includes(q) ||
      p.ward.name.toLowerCase().includes(q) ||
      p.ref_code.toLowerCase().includes(q)
    );
  }).slice(0, 8);

  const handleSelect = useCallback((project: Project) => {
    selectProject(project.id);
    setQuery('');
    setOpen(false);
  }, [selectProject]);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-full max-w-xs sm:max-w-sm px-3 sm:px-0">
      <div className="relative">
        {/* Input */}
        <div
          data-glass=""
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{
            backdropFilter: 'blur(20px)',
            background: 'var(--surface)',
            border: open || query
              ? '1px solid rgba(29,155,138,0.45)'
              : '1px solid var(--border)',
            boxShadow: open || query
              ? '0 4px 24px var(--shadow), 0 0 0 1px rgba(29,155,138,0.15)'
              : `0 4px 16px var(--shadow)`,
            transition: 'border-color 0.2s, box-shadow 0.2s, background 0.25s',
          }}
        >
          <Search size={14} className="text-white/35 flex-shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 180)}
            placeholder="Search projects, wards, communities…"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
            aria-label="Search projects"
            aria-autocomplete="list"
            aria-expanded={open && results.length > 0}
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={handleClear}
                className="flex-shrink-0 text-white/30 hover:text-white/60 transition-colors focus:outline-none"
                aria-label="Clear search"
              >
                <X size={13} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {open && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              data-glass=""
              className="absolute top-full mt-1.5 left-0 right-0 rounded-xl overflow-hidden"
              style={{
                backdropFilter: 'blur(20px)',
                background: 'var(--surface-mid)',
                border: '1px solid rgba(29,155,138,0.25)',
                boxShadow: '0 8px 32px var(--shadow)',
              }}
              role="listbox"
              aria-label="Search results"
            >
              {results.map((project) => {
                const color = CATEGORY_COLORS[project.category];
                const title = lang === 'ha' && project.title_ha ? project.title_ha : project.title_en;
                return (
                  <button
                    key={project.id}
                    onMouseDown={() => handleSelect(project)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/5 transition-colors focus:outline-none focus-visible:bg-white/5"
                    role="option"
                    aria-selected={false}
                    style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}80` }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white/90 truncate">{title}</p>
                      <p className="text-[10px] text-white/35 truncate">{project.ward.name} · {project.community}</p>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}
          {open && query.trim().length >= 2 && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              data-glass=""
              className="absolute top-full mt-1.5 left-0 right-0 rounded-xl px-4 py-3 text-center"
              style={{
                backdropFilter: 'blur(20px)',
                background: 'var(--surface-mid)',
                border: '1px solid var(--border)',
              }}
            >
              <p className="text-xs text-white/35">No projects found for "{query}"</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
