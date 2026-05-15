'use client';

import dynamic from 'next/dynamic';
import type { Project } from '@/types/project';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

function MapSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(10,22,40,0.9)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-teal/20" />
          <div className="absolute inset-0 rounded-full border-2 border-teal border-t-transparent animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-white/60">Loading map…</p>
          <p className="text-xs text-white/25 mt-1">Fetching Katsina ward boundaries</p>
        </div>
      </div>
    </div>
  );
}

const DashboardMap = dynamic(
  () => import('./DashboardMap').then((m) => ({ default: m.DashboardMap })),
  { ssr: false, loading: () => <MapSkeleton /> }
);

export function DashboardMapWrapper({ projects }: { projects: Project[] }) {
  return (
    <ErrorBoundary label="Map failed to load">
      <DashboardMap projects={projects} />
    </ErrorBoundary>
  );
}
