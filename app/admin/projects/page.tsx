import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ProjectsTable } from '@/components/admin/ProjectsTable';

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title_en, category, status, ward:wards(name), community, budget_ngn, published')
    .order('created_at', { ascending: false })
    .limit(500);

  const rows = projects ?? [];

  const draftCount = rows.filter((r) => !r.published).length;

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">
            Projects{' '}
            <span className="text-white/30 font-normal text-base">({rows.length})</span>
          </h1>
          {draftCount > 0 && (
            <p className="text-xs text-amber-400/80 mt-0.5">
              {draftCount} draft{draftCount !== 1 ? 's' : ''} — select them below and click Publish to make them live
            </p>
          )}
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal hover:bg-teal-light text-white text-sm font-semibold transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          <Plus size={14} />
          Add Project
        </Link>
      </div>

      <ProjectsTable rows={rows as any} />
    </div>
  );
}
