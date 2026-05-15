'use client';

import { useState } from 'react';
import { Trash2, Loader2, X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [state, setState] = useState<'idle' | 'confirm' | 'deleting'>('idle');

  const handleDelete = async () => {
    setState('deleting');
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  if (state === 'confirm') {
    return (
      <span className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-white bg-red-600/80 hover:bg-red-600 transition-colors min-h-[32px]"
          aria-label={`Confirm delete ${title}`}
        >
          <Check size={11} /> Yes
        </button>
        <button
          onClick={() => setState('idle')}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-white/50 hover:text-white transition-colors min-h-[32px]"
          aria-label="Cancel delete"
        >
          <X size={11} />
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setState('confirm')}
      disabled={state === 'deleting'}
      className="p-1.5 rounded text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 min-h-[32px] min-w-[32px] flex items-center justify-center"
      aria-label={`Delete ${title}`}
      title="Delete project"
    >
      {state === 'deleting'
        ? <Loader2 size={13} className="animate-spin" />
        : <Trash2 size={13} />}
    </button>
  );
}
