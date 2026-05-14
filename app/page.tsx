import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { FilterSidebar } from '@/components/layout/FilterSidebar';
import { TimelineBar } from '@/components/layout/TimelineBar';
import { ProjectDetailPanel } from '@/components/panels/ProjectDetailPanel';
import type { Project } from '@/types/project';

// Mapbox requires browser APIs — load client-only
const DashboardMap = dynamic(
  () => import('@/components/map/DashboardMap').then((m) => ({ default: m.DashboardMap })),
  { ssr: false, loading: () => <MapSkeleton /> }
);

async function getProjects(): Promise<Project[]> {
  try {
    const url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${url}/api/projects`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return DEMO_PROJECTS;
    return res.json();
  } catch {
    return DEMO_PROJECTS;
  }
}

export default async function DashboardPage() {
  const projects = await getProjects();

  return (
    <main className="h-screen w-screen overflow-hidden bg-navy relative">
      <TopBar />

      <div className="flex h-full pt-14 pb-14">
        <FilterSidebar />

        {/* Map canvas — fills remaining space */}
        <div className="flex-1 md:ml-56 relative">
          <Suspense fallback={<MapSkeleton />}>
            <DashboardMap projects={projects} />
          </Suspense>
        </div>
      </div>

      <TimelineBar />
      <ProjectDetailPanel />
    </main>
  );
}

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

// Demo data used when API/DB is not yet connected
const DEMO_PROJECTS: Project[] = [
  {
    id: '1', ref_code: 'KTLGA-RDS-2024-001', title_en: 'Katsina Central Road Rehabilitation',
    title_ha: 'Gyaran Hanya ta Tsakiyar Katsina', category: 'roads',
    ward: { id: 1, name: 'Ward 1' }, community: 'Katsina City Centre',
    latitude: 12.9954, longitude: 7.6014, beneficiaries: 15000,
    budget_ngn: 25000000000, expenditure_ngn: 23500000000,
    completion_date: '2024-06-15', status: 'completed', images: [], before_images: [],
    featured: true, published: true, created_at: '', updated_at: '',
    description_en: 'Complete rehabilitation of 5km central road with drainage improvements.',
  },
  {
    id: '2', ref_code: 'KTLGA-WTR-2024-002', title_en: 'Community Borehole & Water Supply',
    title_ha: 'Rijiyar Burtsatse da Samar da Ruwa', category: 'water',
    ward: { id: 2, name: 'Ward 2' }, community: 'Dutsin-Ma',
    latitude: 13.0154, longitude: 7.6214, beneficiaries: 3500,
    budget_ngn: 8000000000, expenditure_ngn: 7800000000,
    completion_date: '2024-03-20', status: 'completed', images: [], before_images: [],
    featured: false, published: true, created_at: '', updated_at: '',
    description_en: 'New borehole installation with solar-powered pump and distribution network.',
  },
  {
    id: '3', ref_code: 'KTLGA-HLT-2023-003', title_en: 'Primary Health Centre Renovation',
    title_ha: 'Sabunta Cibiyar Lafiya', category: 'health',
    ward: { id: 3, name: 'Ward 3' }, community: 'Mashi',
    latitude: 12.9754, longitude: 7.5814, beneficiaries: 8200,
    budget_ngn: 12000000000, expenditure_ngn: 11900000000,
    completion_date: '2023-11-30', status: 'completed', images: [], before_images: [],
    featured: true, published: true, created_at: '', updated_at: '',
    description_en: 'Full renovation and equipment upgrade of the primary health care facility.',
  },
  {
    id: '4', ref_code: 'KTLGA-EDU-2023-004', title_en: 'New Classroom Blocks — Government Secondary School',
    category: 'education', ward: { id: 4, name: 'Ward 4' }, community: 'Kaita',
    latitude: 13.0354, longitude: 7.6414, beneficiaries: 1200,
    budget_ngn: 15000000000, expenditure_ngn: 14500000000,
    completion_date: '2023-09-01', status: 'completed', images: [], before_images: [],
    featured: false, published: true, created_at: '', updated_at: '',
    description_en: '6 new classroom blocks with modern facilities and furniture.',
  },
  {
    id: '5', ref_code: 'KTLGA-AGR-2024-005', title_en: 'Farmers Support & Input Distribution Program',
    category: 'agric', ward: { id: 5, name: 'Ward 5' }, community: 'Rimi',
    latitude: 12.9554, longitude: 7.5614, beneficiaries: 2500,
    budget_ngn: 6000000000, expenditure_ngn: 5900000000,
    completion_date: '2024-01-15', status: 'completed', images: [], before_images: [],
    featured: false, published: true, created_at: '', updated_at: '',
    description_en: 'Distribution of seeds, fertilizers, and farm tools to registered farmers.',
  },
  {
    id: '6', ref_code: 'KTLGA-YTH-2024-006', title_en: 'Multi-Purpose Youth Sports Complex',
    category: 'youth', ward: { id: 6, name: 'Ward 6' }, community: 'Kusada',
    latitude: 13.0554, longitude: 7.6614, beneficiaries: 5000,
    budget_ngn: 20000000000, expenditure_ngn: 19500000000,
    completion_date: '2024-08-20', status: 'completed', images: [], before_images: [],
    featured: true, published: true, created_at: '', updated_at: '',
    description_en: 'Modern sports complex with football pitch, basketball court, and gym.',
  },
];
