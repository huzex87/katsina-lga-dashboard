'use client';

import { useEffect, useState } from 'react';
import { Marker } from 'react-map-gl/mapbox';
import type { MarkerEvent } from 'react-map-gl/mapbox';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '@/store/dashboardStore';
import { CATEGORY_COLORS } from '@/types/project';
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

  const pinColor = CATEGORY_COLORS[project.category];
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
            initial={prefersReduced ? {} : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="relative flex items-center justify-center cursor-pointer focus:outline-none"
            style={{ width: size + 20, height: size + 20 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label={`${project.title_en} — ${project.ward.name}. Click to view details.`}
            aria-pressed={isSelected}
          >
            {/* Pulse ring */}
            {!prefersReduced && !isSelected && (
              <motion.span
                className="absolute rounded-full"
                style={{ backgroundColor: pinColor, width: size, height: size }}
                animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
              />
            )}

            {/* Selected glow ring */}
            {isSelected && (
              <motion.span
                className="absolute rounded-full"
                style={{
                  width: size + 10,
                  height: size + 10,
                  border: `2px solid ${pinColor}`,
                  boxShadow: `0 0 16px ${pinColor}80`,
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              />
            )}

            {/* Pin body */}
            <motion.span
              className="relative flex items-center justify-center rounded-full border-2 border-white/25 z-10"
              style={{
                backgroundColor: pinColor,
                width: size,
                height: size,
                boxShadow: isSelected
                  ? `0 0 0 2px white, 0 0 24px ${pinColor}90`
                  : hovered
                  ? `0 4px 20px ${pinColor}70`
                  : `0 2px 10px ${pinColor}50`,
              }}
              animate={{ scale: hovered && !isSelected ? 1.12 : 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {/* Inner dot */}
              <span
                className="rounded-full bg-white/40"
                style={{ width: Math.round(size * 0.28), height: Math.round(size * 0.28) }}
              />
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </Marker>
  );
}
