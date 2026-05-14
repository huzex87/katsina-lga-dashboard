'use client';

import { useEffect, useRef, useState } from 'react';
import { Marker } from 'react-map-gl/mapbox';
import type { MarkerEvent } from 'react-map-gl/mapbox';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { getPinColor } from '@/lib/mapbox/config';
import { useDashboardStore } from '@/store/dashboardStore';
import type { Project } from '@/types/project';

interface Props {
  project: Project;
  entranceDelay?: number;
  onClick: (e: MarkerEvent<MouseEvent>) => void;
}

export function ProjectPin({ project, entranceDelay = 0, onClick }: Props) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const prefersReduced = useReducedMotion();
  const { filters } = useDashboardStore();
  const isSelected = filters.selectedProjectId === project.id;

  const pinColor = getPinColor(1); // per-location logic; single project = teal
  const size = isSelected ? 36 : hovered ? 32 : 28;

  useEffect(() => {
    if (prefersReduced) { setVisible(true); return; }
    const t = setTimeout(() => setVisible(true), entranceDelay);
    return () => clearTimeout(t);
  }, [entranceDelay, prefersReduced]);

  return (
    <Marker
      latitude={project.latitude}
      longitude={project.longitude}
      anchor="center"
      onClick={onClick}
    >
      <AnimatePresence>
        {visible && (
          <motion.button
            initial={prefersReduced ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="relative flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            style={{ width: size + 16, height: size + 16 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label={`${project.title_en} — ${project.ward.name}. Click to view details.`}
            aria-pressed={isSelected}
          >
            {/* Pulse ring - not shown with reduced motion */}
            {!prefersReduced && (
              <motion.span
                className="absolute rounded-full"
                style={{ backgroundColor: pinColor }}
                animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
              />
            )}

            {/* Pin body */}
            <motion.span
              className="relative flex items-center justify-center rounded-full font-bold text-white shadow-lg border-2 border-white/30 text-xs z-10"
              style={{
                backgroundColor: pinColor,
                width: size,
                height: size,
                fontSize: size > 30 ? '12px' : '10px',
                boxShadow: isSelected
                  ? `0 0 0 3px white, 0 0 20px ${pinColor}80`
                  : hovered
                  ? `0 4px 20px ${pinColor}60`
                  : `0 2px 8px ${pinColor}40`,
              }}
              animate={{ scale: hovered ? 1.15 : 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              1
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </Marker>
  );
}
