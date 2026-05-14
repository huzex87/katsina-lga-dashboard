'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { getPinColor } from '@/lib/mapbox/config';

interface Props {
  count: number;
  onClick?: () => void;
}

export function ClusterPin({ count, onClick }: Props) {
  const prefersReduced = useReducedMotion();
  const color = getPinColor(count);
  const size = count >= 20 ? 56 : count >= 10 ? 48 : 40;

  return (
    <motion.button
      initial={prefersReduced ? false : { scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className="relative flex items-center justify-center rounded-full font-bold text-white cursor-pointer border-2 border-white/30 shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      style={{ backgroundColor: color, width: size, height: size, fontSize: `${Math.max(11, 14 - Math.floor(count / 10))}px` }}
      aria-label={`${count} projects clustered here. Click to zoom in.`}
    >
      {!prefersReduced && (
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      <span className="relative z-10">{count}</span>
    </motion.button>
  );
}
