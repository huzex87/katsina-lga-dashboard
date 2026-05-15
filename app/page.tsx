import { TopBar } from '@/components/layout/TopBar';
import { FilterSidebar } from '@/components/layout/FilterSidebar';
import { TimelineBar } from '@/components/layout/TimelineBar';
import { ProjectDetailPanel } from '@/components/panels/ProjectDetailPanel';
import { DashboardMapWrapper } from '@/components/map/DashboardMapWrapper';
import type { Project } from '@/types/project';

async function getProjects(): Promise<Project[]> {
  try {
    const url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${url}/api/projects`, {
      cache: 'no-store',
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
    <main id="main-content" className="h-dvh w-screen overflow-hidden bg-navy relative">
      <TopBar />

      <div className="flex h-full pt-14 pb-14">
        <FilterSidebar />

        {/* Map canvas — fills remaining space */}
        <div className="flex-1 md:ml-56 relative min-h-0 h-full">
          <DashboardMapWrapper projects={projects} />
        </div>
      </div>

      <TimelineBar />
      <ProjectDetailPanel />
    </main>
  );
}

// Demo data — real Katsina LGA wards (Arewa A/B · Gabas I/II · Kudu I/II/III · Yamma I/II · Shinkafi A/B)
const DEMO_PROJECTS: Project[] = [
  {
    id: '1', ref_code: 'KTLGA-RDS-2025-001',
    title_en: 'Nagogo Road Rehabilitation & Drainage Upgrade',
    title_ha: 'Gyaran Hanyar Nagogo da Tsabtace Rafin Ruwa',
    category: 'roads',
    ward: { id: 11, name: 'Shinkafi A' }, community: 'Katsina City Centre',
    latitude: 12.9954, longitude: 7.6014, beneficiaries: 18000,
    budget_ngn: 32000000000, expenditure_ngn: 30400000000,
    completion_date: '2025-03-15', status: 'completed', images: [], before_images: [],
    featured: true, published: true, created_at: '', updated_at: '',
    description_en: 'Full rehabilitation of 6.5km Nagogo Road including road widening, drainage channels, streetlighting, and pedestrian walkways along the LGA Secretariat corridor.',
  },
  {
    id: '2', ref_code: 'KTLGA-WTR-2025-002',
    title_en: 'Solar-Powered Borehole & Water Distribution Network',
    title_ha: 'Rijiyar Burtsatse da Samar da Ruwa ta Hasken Rana',
    category: 'water',
    ward: { id: 1, name: 'Arewa A' }, community: 'Unguwar Rimi',
    latitude: 13.0320, longitude: 7.5980, beneficiaries: 5200,
    budget_ngn: 9500000000, expenditure_ngn: 9200000000,
    completion_date: '2025-01-20', status: 'completed', images: [], before_images: [],
    featured: false, published: true, created_at: '', updated_at: '',
    description_en: 'Solar-powered borehole with 50,000-litre overhead tank serving 5 communities in Arewa A ward through a reticulated pipe network.',
  },
  {
    id: '3', ref_code: 'KTLGA-HLT-2024-003',
    title_en: 'Gabas Primary Health Centre Renovation & Equipment',
    title_ha: 'Sabunta Cibiyar Lafiya ta Gabas da Kayan Aiki',
    category: 'health',
    ward: { id: 3, name: 'Gabas I' }, community: 'Unguwar Gabas',
    latitude: 12.9900, longitude: 7.6450, beneficiaries: 9500,
    budget_ngn: 14000000000, expenditure_ngn: 13800000000,
    completion_date: '2024-11-30', status: 'completed', images: [], before_images: [],
    featured: true, published: true, created_at: '', updated_at: '',
    description_en: 'Complete renovation of the Gabas PHC with new maternity ward, laboratory equipment, solar power system, and medical waste disposal facility.',
  },
  {
    id: '4', ref_code: 'KTLGA-EDU-2024-004',
    title_en: 'Government Secondary School — 8 New Classroom Blocks',
    category: 'education',
    ward: { id: 6, name: 'Kudu I' }, community: 'Unguwar Kudu',
    latitude: 12.9680, longitude: 7.6120, beneficiaries: 2400,
    budget_ngn: 18000000000, expenditure_ngn: 17200000000,
    completion_date: '2024-09-01', status: 'completed', images: [], before_images: [],
    featured: false, published: true, created_at: '', updated_at: '',
    description_en: '8 new classroom blocks with ICT laboratory, library, sanitation facilities, and perimeter fence at Government Secondary School, Kudu ward.',
  },
  {
    id: '5', ref_code: 'KTLGA-AGR-2025-005',
    title_en: 'Farmers Input & Irrigation Support Programme',
    title_ha: 'Shirin Tallafin Manoma da Ban Ruwa',
    category: 'agric',
    ward: { id: 9, name: 'Yamma I' }, community: 'Unguwar Yamma',
    latitude: 13.0020, longitude: 7.5720, beneficiaries: 3800,
    budget_ngn: 7500000000, expenditure_ngn: 7100000000,
    completion_date: '2025-02-15', status: 'completed', images: [], before_images: [],
    featured: false, published: true, created_at: '', updated_at: '',
    description_en: 'Distribution of high-yield seeds, fertilisers, herbicides, and drip irrigation kits to 3,800 registered smallholder farmers across Yamma ward.',
  },
  {
    id: '6', ref_code: 'KTLGA-YTH-2025-006',
    title_en: 'Shinkafi Youth Multi-Purpose Sports & Skills Complex',
    title_ha: 'Cibiyar Wasanni da Sana\'a ta Samari ta Shinkafi',
    category: 'youth',
    ward: { id: 12, name: 'Shinkafi B' }, community: 'Shinkafi',
    latitude: 13.0060, longitude: 7.6180, beneficiaries: 6500,
    budget_ngn: 22000000000, expenditure_ngn: 21500000000,
    completion_date: '2025-04-10', status: 'completed', images: [], before_images: [],
    featured: true, published: true, created_at: '', updated_at: '',
    description_en: 'Modern sports complex with football pitch, basketball court, gymnasium, digital skills hub, and vocational training centre serving youth across Shinkafi ward.',
  },
  {
    id: '7', ref_code: 'KTLGA-RDS-2025-007',
    title_en: 'Arewa Intra-Ward Road Network Paving',
    category: 'roads',
    ward: { id: 2, name: 'Arewa B' }, community: 'Unguwar Arewa',
    latitude: 13.0420, longitude: 7.6130, beneficiaries: 7200,
    budget_ngn: 11000000000, expenditure_ngn: 10500000000,
    completion_date: '2025-03-28', status: 'completed', images: [], before_images: [],
    featured: false, published: true, created_at: '', updated_at: '',
    description_en: 'Interlocking paving of 12 streets within Arewa B ward improving all-season access and reducing flood damage to properties.',
  },
  {
    id: '8', ref_code: 'KTLGA-WTR-2024-008',
    title_en: 'Kudu Ward Sanitation & Public Toilet Facilities',
    category: 'water',
    ward: { id: 7, name: 'Kudu II' }, community: 'Kudu Market Area',
    latitude: 12.9720, longitude: 7.6250, beneficiaries: 4100,
    budget_ngn: 5500000000, expenditure_ngn: 5300000000,
    completion_date: '2024-12-15', status: 'completed', images: [], before_images: [],
    featured: false, published: true, created_at: '', updated_at: '',
    description_en: 'Construction of 6 modern public toilet and handwashing stations across Kudu II ward markets and public spaces, serving over 4,000 daily users.',
  },
];
