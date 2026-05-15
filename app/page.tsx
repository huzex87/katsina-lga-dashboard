import { TopBar } from '@/components/layout/TopBar';
import { FilterSidebar } from '@/components/layout/FilterSidebar';
import { TimelineBar } from '@/components/layout/TimelineBar';
import { ProjectDetailPanel } from '@/components/panels/ProjectDetailPanel';
import { DashboardMapWrapper } from '@/components/map/DashboardMapWrapper';
import { createClient } from '@/lib/supabase/server';
import { AlertTriangle } from 'lucide-react';
import type { Project } from '@/types/project';

export const dynamic = 'force-dynamic';

async function getProjects(): Promise<{ projects: Project[]; error: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*, ward:wards(id, name, name_ha)')
      .eq('published', true)
      .order('completion_date', { ascending: false })
      .limit(500);

    if (error) return { projects: [], error: true };
    return { projects: (data ?? []) as unknown as Project[], error: false };
  } catch {
    return { projects: [], error: true };
  }
}

export default async function DashboardPage() {
  const { projects, error } = await getProjects();

  return (
    <main id="main-content" className="h-dvh w-screen overflow-hidden bg-navy relative">
      <TopBar />

      {error && (
        <div
          className="fixed top-14 left-0 right-0 z-30 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium"
          style={{ background: 'rgba(226,75,74,0.12)', borderBottom: '1px solid rgba(226,75,74,0.25)', color: '#E24B4A' }}
          role="alert"
        >
          <AlertTriangle size={13} aria-hidden="true" />
          Unable to connect to the database. Project data may be unavailable — please try refreshing.
        </div>
      )}

      <div className="flex h-full pt-14 pb-14">
        <FilterSidebar />

        {/* Map canvas — full width, sidebar floats over it */}
        <div className="absolute inset-0 pt-14 pb-14 w-full">
          <DashboardMapWrapper projects={projects} />
        </div>
      </div>

      <TimelineBar />
      <ProjectDetailPanel />
    </main>
  );
}
