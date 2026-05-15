'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pencil, Eye, EyeOff, Loader2, CheckSquare, Square, Check } from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/project';
import { DeleteProjectButton } from './DeleteProjectButton';

const STATUS_BADGE = {
  completed: { bg: 'rgba(29,155,138,0.14)', color: '#25C4AE', label: 'Completed' },
  ongoing:   { bg: 'rgba(245,166,35,0.14)', color: '#F5A623', label: 'Ongoing' },
  planning:  { bg: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.50)', label: 'Planning' },
} as const;

export interface ProjectRow {
  id: string;
  title_en: string;
  category: string;
  status: string;
  ward: unknown;
  community: string;
  published: boolean;
}

interface Props {
  rows: ProjectRow[];
}

export function ProjectsTable({ rows }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [bulkResult, setBulkResult] = useState<{ ok: number; fail: number } | null>(null);

  const allIds = rows.map((r) => r.id);
  const allSelected = selected.size === allIds.length && allIds.length > 0;
  const someSelected = selected.size > 0;

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(allIds));

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const bulkSetPublished = (publish: boolean) => {
    const ids = [...selected];
    startTransition(async () => {
      setBulkResult(null);
      const results = await Promise.allSettled(
        ids.map((id) =>
          fetch(`/api/projects/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ published: publish }),
          }).then((r) => { if (!r.ok) throw new Error(); })
        )
      );
      const ok = results.filter((r) => r.status === 'fulfilled').length;
      const fail = results.filter((r) => r.status === 'rejected').length;
      setBulkResult({ ok, fail });
      setSelected(new Set());
      router.refresh();
      setTimeout(() => setBulkResult(null), 4000);
    });
  };

  return (
    <div className="relative">
      {/* Bulk action bar */}
      {someSelected && (
        <div
          className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 mb-3 rounded-xl border border-teal/30 text-sm"
          style={{ background: 'rgba(29,155,138,0.12)', backdropFilter: 'blur(12px)' }}
        >
          <span className="text-teal font-semibold tabular-nums">
            {selected.size} selected
          </span>
          <div className="flex-1" />
          <button
            onClick={() => bulkSetPublished(true)}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal hover:bg-teal-light text-white text-xs font-semibold transition-colors disabled:opacity-50 min-h-[32px]"
          >
            {isPending ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />}
            Publish
          </button>
          <button
            onClick={() => bulkSetPublished(false)}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-xs font-semibold transition-colors disabled:opacity-50 min-h-[32px]"
          >
            {isPending ? <Loader2 size={12} className="animate-spin" /> : <EyeOff size={12} />}
            Unpublish
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs text-white/40 hover:text-white transition-colors px-2 py-1"
          >
            Clear
          </button>
        </div>
      )}

      {/* Result toast */}
      {bulkResult && (
        <div className="flex items-center gap-2 px-4 py-2.5 mb-3 rounded-xl text-sm border border-teal/30 bg-teal/10">
          <Check size={14} className="text-teal flex-shrink-0" />
          <span className="text-white/80">
            {bulkResult.ok} project{bulkResult.ok !== 1 ? 's' : ''} updated
            {bulkResult.fail > 0 && <span className="text-red-400 ml-1">· {bulkResult.fail} failed</span>}
          </span>
        </div>
      )}

      <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: 'rgba(15,31,58,0.6)' }}>
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[36px_1fr_120px_140px_110px_80px] text-xs text-white/30 uppercase tracking-wide px-4 py-2.5 border-b border-white/10 font-medium gap-3 items-center">
          {/* Select-all checkbox */}
          <button
            onClick={toggleAll}
            className="flex items-center justify-center text-white/30 hover:text-teal transition-colors"
            aria-label={allSelected ? 'Deselect all' : 'Select all'}
          >
            {allSelected
              ? <CheckSquare size={15} className="text-teal" />
              : someSelected
              ? <CheckSquare size={15} className="text-white/40" />
              : <Square size={15} />}
          </button>
          <span>Project</span>
          <span>Ward</span>
          <span>Category</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/[0.05]">
          {rows.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-sm text-white/30">
              No projects yet.{' '}
              <Link href="/admin/projects/new" className="text-teal ml-1 hover:underline">
                Add your first project
              </Link>
            </div>
          ) : (
            rows.map((p) => {
              const isSelected = selected.has(p.id);
              const status = STATUS_BADGE[(p.status as keyof typeof STATUS_BADGE)] ?? STATUS_BADGE.completed;
              const catColor = CATEGORY_COLORS[p.category as keyof typeof CATEGORY_COLORS] ?? '#888';
              const catLabel = CATEGORY_LABELS[p.category as keyof typeof CATEGORY_LABELS] ?? p.category;
              const ward = p.ward as { name: string } | null;

              return (
                <div
                  key={p.id}
                  className={`transition-colors ${isSelected ? 'bg-teal/[0.06]' : 'hover:bg-white/[0.02]'}`}
                >
                  {/* Mobile card layout */}
                  <div className="md:hidden flex items-start gap-3 px-4 py-3">
                    <button
                      onClick={() => toggleOne(p.id)}
                      className="flex-shrink-0 mt-0.5 text-white/25 hover:text-teal transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                      aria-label={isSelected ? `Deselect ${p.title_en}` : `Select ${p.title_en}`}
                    >
                      {isSelected ? <CheckSquare size={15} className="text-teal" /> : <Square size={15} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white leading-tight">{p.title_en}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: `${catColor}18`, color: catColor }}
                        >{catLabel}</span>
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: status.bg, color: status.color }}
                        >{status.label}</span>
                        {!p.published && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/20">Draft</span>
                        )}
                      </div>
                      <p className="text-xs text-white/35 mt-0.5">{ward?.name ?? '—'} · {p.community}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Link
                        href={`/admin/projects/${p.id}/edit`}
                        className="p-2 rounded text-white/30 hover:text-teal hover:bg-teal/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal min-h-[36px] min-w-[36px] flex items-center justify-center"
                        aria-label={`Edit ${p.title_en}`}
                      >
                        <Pencil size={13} />
                      </Link>
                      <DeleteProjectButton id={p.id} title={p.title_en} />
                    </div>
                  </div>

                  {/* Desktop table row */}
                  <div className="hidden md:grid grid-cols-[36px_1fr_120px_140px_110px_80px] gap-3 px-4 py-3 items-center">
                    <button
                      onClick={() => toggleOne(p.id)}
                      className="flex items-center justify-center text-white/25 hover:text-teal transition-colors"
                      aria-label={isSelected ? `Deselect ${p.title_en}` : `Select ${p.title_en}`}
                    >
                      {isSelected ? <CheckSquare size={15} className="text-teal" /> : <Square size={15} />}
                    </button>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white leading-tight truncate">{p.title_en}</p>
                      <p className="text-xs text-white/35 mt-0.5 flex items-center gap-2 flex-wrap">
                        {p.community}
                        {!p.published && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/20">Draft</span>
                        )}
                      </p>
                    </div>
                    <span className="text-xs text-white/50 truncate">{ward?.name ?? '—'}</span>
                    <span className="text-[11px] font-semibold px-2 py-1 rounded-full w-fit" style={{ backgroundColor: `${catColor}18`, color: catColor }}>{catLabel}</span>
                    <span className="text-[11px] font-semibold px-2 py-1 rounded-full w-fit" style={{ backgroundColor: status.bg, color: status.color }}>{status.label}</span>
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/projects/${p.id}/edit`} className="p-1.5 rounded text-white/30 hover:text-teal hover:bg-teal/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal min-h-[32px] min-w-[32px] flex items-center justify-center" aria-label={`Edit ${p.title_en}`}>
                        <Pencil size={13} />
                      </Link>
                      <DeleteProjectButton id={p.id} title={p.title_en} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
