'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, MapPin, Users, Calendar, Banknote, TrendingUp, Copy, ExternalLink, Share2 } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { ImageCarousel } from './ImageCarousel';
import { CertificateButton } from './CertificateButton';
import { formatNaira, formatCoords, formatDate } from '@/lib/utils';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/project';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Project } from '@/types/project';

export function ProjectDetailPanel() {
  const { selectedProject, selectProject } = useDashboardStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReduced = useReducedMotion();
  const open = selectedProject !== null;

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement;
    setTimeout(() => closeButtonRef.current?.focus(), 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') selectProject(null);
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      prev?.focus();
    };
  }, [open, selectProject]);

  const copyCoords = useCallback(() => {
    if (!selectedProject) return;
    navigator.clipboard.writeText(formatCoords(selectedProject.latitude, selectedProject.longitude));
  }, [selectedProject]);

  const copyShareUrl = useCallback(() => {
    if (!selectedProject) return;
    navigator.clipboard.writeText(`${window.location.origin}/projects/${selectedProject.ref_code}`);
  }, [selectedProject]);

  const budgetPercent = selectedProject
    ? Math.min(100, Math.round((selectedProject.expenditure_ngn / selectedProject.budget_ngn) * 100)) || 0
    : 0;

  const panelVariants = {
    hiddenDesktop:  { x: '100%', opacity: 0 },
    visibleDesktop: { x: 0, opacity: 1, transition: { duration: prefersReduced ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
    exitDesktop:    { x: '100%', opacity: 0, transition: { duration: prefersReduced ? 0 : 0.22, ease: [0.36, 0, 0.66, 0] as [number,number,number,number] } },
    hiddenMobile:   { y: '100%', opacity: 0 },
    visibleMobile:  { y: 0, opacity: 1, transition: { duration: prefersReduced ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
    exitMobile:     { y: '100%', opacity: 0, transition: { duration: prefersReduced ? 0 : 0.22, ease: [0.36, 0, 0.66, 0] as [number,number,number,number] } },
  };

  return (
    <AnimatePresence>
      {open && selectedProject && (
        <>
          {/* Backdrop — mobile */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => selectProject(null)}
            aria-hidden="true"
          />

          {/* Panel — desktop */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Project details: ${selectedProject.title_en}`}
            className="hidden md:flex fixed right-0 top-0 h-full w-[340px] flex-col z-40 overflow-hidden border-l border-white/10 shadow-2xl"
            style={{ backdropFilter: 'blur(20px)', background: 'rgba(15,31,58,0.94)' }}
            variants={panelVariants}
            initial="hiddenDesktop"
            animate="visibleDesktop"
            exit="exitDesktop"
          >
            <PanelContent
              project={selectedProject}
              closeButtonRef={closeButtonRef}
              onClose={() => selectProject(null)}
              onCopyCoords={copyCoords}
              onShare={copyShareUrl}
              budgetPercent={budgetPercent}
            />
          </motion.div>

          {/* Panel — mobile bottom sheet */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Project details: ${selectedProject.title_en}`}
            className="md:hidden fixed bottom-0 left-0 right-0 h-[65vh] flex flex-col z-40 rounded-t-2xl overflow-hidden border-t border-white/10 shadow-2xl"
            style={{ backdropFilter: 'blur(20px)', background: 'rgba(15,31,58,0.97)' }}
            variants={panelVariants}
            initial="hiddenMobile"
            animate="visibleMobile"
            exit="exitMobile"
          >
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0" aria-hidden="true">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            <PanelContent
              project={selectedProject}
              closeButtonRef={closeButtonRef}
              onClose={() => selectProject(null)}
              onCopyCoords={copyCoords}
              onShare={copyShareUrl}
              budgetPercent={budgetPercent}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function PanelContent({
  project, closeButtonRef, onClose, onCopyCoords, onShare, budgetPercent
}: {
  project: Project;
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onCopyCoords: () => void;
  onShare: () => void;
  budgetPercent: number;
}) {
  const catColor = CATEGORY_COLORS[project.category];
  const catLabel = CATEGORY_LABELS[project.category];
  const { t } = useLanguage();
  const title = t(project.title_en, project.title_ha);
  const description = t(project.description_en, project.description_ha);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Category colour stripe */}
      <div
        className="h-1 w-full flex-shrink-0"
        style={{ background: `linear-gradient(90deg, ${catColor}, ${catColor}60, transparent)` }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
        <div className="flex-1 min-w-0 pr-3">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full mb-2"
            style={{ backgroundColor: `${catColor}18`, color: catColor, border: `1px solid ${catColor}35` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catColor }} />
            {catLabel}
          </span>
          <h2 className="text-sm font-bold text-white leading-snug line-clamp-2">{title}</h2>
        </div>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          aria-label="Close project detail panel"
        >
          <X size={15} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Image carousel */}
        <ImageCarousel images={project.images} beforeImages={project.before_images} title={project.title_en} />

        <div className="px-4 py-3 space-y-3">
          {/* Location */}
          <div className="flex items-start gap-2.5 rounded-lg px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <MapPin size={14} className="text-teal mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-white/45 uppercase tracking-wide mb-0.5">Location</p>
              <p className="text-sm text-white font-semibold leading-tight">{project.ward.name}</p>
              <p className="text-xs text-white/55">{project.community}</p>
            </div>
          </div>

          {/* 2×2 stats grid */}
          <div className="grid grid-cols-2 gap-2">
            <StatCard
              icon={<Users size={12} style={{ color: '#1D9B8A' }} />}
              label="Beneficiaries"
              value={project.beneficiaries.toLocaleString()}
              accent="#1D9B8A"
            />
            <StatCard
              icon={<Calendar size={12} style={{ color: '#F5A623' }} />}
              label="Completed"
              value={formatDate(project.completion_date)}
              accent="#F5A623"
            />
            <StatCard
              icon={<Banknote size={12} style={{ color: catColor }} />}
              label="Total Budget"
              value={formatNaira(project.budget_ngn)}
              accent={catColor}
            />
            <StatCard
              icon={<TrendingUp size={12} style={{ color: budgetPercent >= 90 ? '#1D9B8A' : '#F5A623' }} />}
              label="Utilised"
              value={`${budgetPercent}%`}
              accent={budgetPercent >= 90 ? '#1D9B8A' : '#F5A623'}
            />
          </div>

          {/* Budget bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-white/45">Budget utilisation</span>
              <span className="text-white font-semibold tabular-nums">{budgetPercent}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${catColor}, ${catColor}cc)` }}
                initial={{ width: 0 }}
                animate={{ width: `${budgetPercent}%` }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/40">
              <span>Spent: <span className="text-white/75">{formatNaira(project.expenditure_ngn)}</span></span>
              <span>Budget: <span className="text-white/75">{formatNaira(project.budget_ngn)}</span></span>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-xs text-white/65 leading-relaxed">{description}</p>
            </div>
          )}

          {/* GPS coordinates */}
          <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs text-white/40 mb-1.5 uppercase tracking-wide">GPS Coordinates</p>
            <div className="flex items-center justify-between gap-2">
              <code className="text-xs text-teal-light font-mono">
                {formatCoords(project.latitude, project.longitude)}
              </code>
              <div className="flex gap-1.5">
                <button
                  onClick={onCopyCoords}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                  aria-label="Copy GPS coordinates"
                >
                  <Copy size={13} />
                </button>
                <a
                  href={`https://maps.google.com/?q=${project.latitude},${project.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                  aria-label="Open in Google Maps"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>

          {project.contractor && (
            <p className="text-xs text-white/40 px-1">
              Contractor: <span className="text-white/70">{project.contractor}</span>
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10 flex-shrink-0 space-y-2">
        <CertificateButton project={project} />
        <button
          onClick={onShare}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          aria-label="Copy share link for this project"
        >
          <Share2 size={14} />
          Share Project
        </button>
      </div>
    </div>
  );
}

function StatCard({
  icon, label, value, accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-lg p-2.5"
      style={{ background: `${accent}0d`, border: `1px solid ${accent}25` }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-[10px] text-white/45 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-sm font-bold text-white leading-tight">{value}</p>
    </div>
  );
}
