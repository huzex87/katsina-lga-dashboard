import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/project';
import { DeleteProjectButton } from '@/components/admin/DeleteProjectButton';

const STATUS_BADGE = {
  completed: { bg: 'rgba(29,155,138,0.14)', color: '#25C4AE', label: 'Completed' },
  ongoing:   { bg: 'rgba(245,166,35,0.14)', color: '#F5A623', label: 'Ongoing' },
  planning:  { bg: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.50)', label: 'Planning' },
} as const;

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title_en, category, status, ward:wards(name), community, budget_ngn, published')
    .order('created_at', { ascending: false })
    .limit(500);

  const rows = projects ?? [];

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">
          Projects{' '}
          <span className="text-white/30 font-normal text-base">({rows.length})</span>
        </h1>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal hover:bg-teal-light text-white text-sm font-semibold transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          <Plus size={14} />
          Add Project
        </Link>
      </div>

      <div
        className="rounded-xl border border-white/10 overflow-hidden"
        style={{ background: 'rgba(15,31,58,0.6)' }}
      >
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[1fr_120px_140px_110px_80px] text-xs text-white/30 uppercase tracking-wide px-4 py-2.5 border-b border-white/10 font-medium gap-3">
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
              const status = STATUS_BADGE[(p.status as keyof typeof STATUS_BADGE) ?? 'completed'] ?? STATUS_BADGE.completed;
              const catColor = CATEGORY_COLORS[p.category as keyof typeof CATEGORY_COLORS] ?? '#888';
              const catLabel = CATEGORY_LABELS[p.category as keyof typeof CATEGORY_LABELS] ?? p.category;
              const ward = p.ward as unknown as { name: string } | null;

              return (
                <div
                  key={p.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_120px_140px_110px_80px] gap-2 md:gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors items-center"
                >
                  {/* Title */}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white leading-tight truncate">{p.title_en}</p>
                    <p className="text-xs text-white/35 mt-0.5 flex items-center gap-2 flex-wrap">
                      {p.community}
                      {!p.published && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/20">
                          Draft
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Ward */}
                  <span className="text-xs text-white/50 whitespace-nowrap hidden md:block truncate">
                    {ward?.name ?? '—'}
                  </span>

                  {/* Category */}
                  <span
                    className="text-[11px] font-semibold px-2 py-1 rounded-full whitespace-nowrap hidden md:inline-block w-fit"
                    style={{ backgroundColor: `${catColor}18`, color: catColor }}
                  >
                    {catLabel}
                  </span>

                  {/* Status */}
                  <span
                    className="text-[11px] font-semibold px-2 py-1 rounded-full whitespace-nowrap hidden md:inline-block w-fit"
                    style={{ backgroundColor: status.bg, color: status.color }}
                  >
                    {status.label}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/projects/${p.id}/edit`}
                      className="p-1.5 rounded text-white/30 hover:text-teal hover:bg-teal/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal min-h-[32px] min-w-[32px] flex items-center justify-center"
                      title="Edit project"
                      aria-label={`Edit ${p.title_en}`}
                    >
                      <Pencil size={13} />
                    </Link>
                    <DeleteProjectButton id={p.id} title={p.title_en} />
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
