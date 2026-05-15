'use client';

import { motion } from 'framer-motion';
import { X, ChevronRight, MapPin } from 'lucide-react';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/types/project';
import { formatNaira } from '@/lib/utils';
import { useDashboardStore } from '@/store/dashboardStore';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Project } from '@/types/project';

interface Props {
  wardName: string;
  projects: Project[];
  onClose: () => void;
}

export function WardProjectsList({ wardName, projects, onClose }: Props) {
  const { selectProject } = useDashboardStore();
  const { t } = useLanguage();

  const handleProjectClick = (project: Project) => {
    selectProject(project.id);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute bottom-36 md:bottom-20 left-4 z-20 w-72 rounded-xl overflow-hidden shadow-2xl"
      style={{
        backdropFilter: 'blur(20px)',
        background: 'rgba(10,22,40,0.96)',
        border: '1px solid rgba(29,155,138,0.30)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(29,155,138,0.10)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-white/10"
        style={{ background: 'rgba(29,155,138,0.08)' }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <MapPin size={13} className="text-teal flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{wardName}</p>
            <p className="text-[10px] text-white/40">
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          aria-label="Close ward projects list"
        >
          <X size={13} />
        </button>
      </div>

      {/* Project list */}
      <div className="max-h-64 overflow-y-auto scrollbar-none">
        {projects.length === 0 ? (
          <p className="text-xs text-white/35 text-center py-6">No projects in this ward match the current filters.</p>
        ) : (
          projects.map((project, i) => {
            const color = CATEGORY_COLORS[project.category];
            return (
              <button
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-inset focus-visible:ring-1 focus-visible:ring-teal group"
                style={i > 0 ? { borderTop: '1px solid rgba(255,255,255,0.06)' } : {}}
              >
                {/* Category dot */}
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: color, boxShadow: `0 0 5px ${color}80` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/90 group-hover:text-white leading-tight line-clamp-2 transition-colors">
                    {t(project.title_en, project.title_ha)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${color}18`, color }}
                    >
                      {CATEGORY_LABELS[project.category]}
                    </span>
                    <span className="text-[10px] text-white/35">{formatNaira(project.budget_ngn)}</span>
                  </div>
                </div>
                <ChevronRight size={13} className="text-white/25 group-hover:text-teal flex-shrink-0 mt-1 transition-colors" />
              </button>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
