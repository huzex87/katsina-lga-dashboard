'use client';

import dynamic from 'next/dynamic';
import type { Project } from '@/types/project';

function MapSkeleton() {
  return (
    <div className="w-full h-full bg-navy-mid flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-teal border-t-transparent animate-spin" />
        <p className="text-sm text-white/40">Loading map…</p>
      </div>
    </div>
  );
}

const DashboardMap = dynamic(
  () => import('./DashboardMap').then((m) => ({ default: m.DashboardMap })),
  { ssr: false, loading: () => <MapSkeleton /> }
);

export function DashboardMapWrapper({ projects }: { projects: Project[] }) {
  return <DashboardMap projects={projects} />;
}
