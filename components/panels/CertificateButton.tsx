'use client';

import { useState } from 'react';
import { Award, Loader2, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Project } from '@/types/project';

interface Props {
  project: Project;
}

export function CertificateButton({ project }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleGenerate = async () => {
    if (state === 'loading') return;
    setState('loading');
    try {
      const { generateCertificate } = await import('@/lib/certificate/generator');
      const pdfBytes = await generateCertificate(project);
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `KTLGA_${project.ref_code}_${new Date().getFullYear()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setState('done');
      setTimeout(() => setState('idle'), 3000);
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  };

  return (
    <motion.button
      onClick={handleGenerate}
      disabled={state === 'loading'}
      whileHover={state === 'idle' ? { scale: 1.02 } : undefined}
      whileTap={state === 'idle' ? { scale: 0.98 } : undefined}
      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-navy-mid ${
        state === 'done'
          ? 'bg-green-600/80 text-white'
          : state === 'error'
          ? 'bg-red-600/80 text-white'
          : 'bg-teal hover:bg-teal-light text-white'
      }`}
      aria-live="polite"
      aria-label={
        state === 'loading'
          ? 'Generating certificate…'
          : state === 'done'
          ? 'Certificate downloaded'
          : state === 'error'
          ? 'Download failed. Try again.'
          : `Download completion certificate for ${project.title_en}`
      }
    >
      {state === 'loading' ? (
        <Loader2 size={14} className="animate-spin" />
      ) : state === 'done' ? (
        <Check size={14} />
      ) : state === 'error' ? (
        <AlertCircle size={14} />
      ) : (
        <Award size={14} />
      )}
      {state === 'loading'
        ? 'Generating…'
        : state === 'done'
        ? 'Downloaded!'
        : state === 'error'
        ? 'Try again'
        : 'Download Certificate'}
    </motion.button>
  );
}
