export type ProjectCategory =
  | 'roads' | 'water' | 'health' | 'education'
  | 'agric' | 'youth' | 'security';

export type ProjectStatus = 'planning' | 'ongoing' | 'completed';

export interface Ward {
  id: number;
  name: string;
  name_ha?: string;
  geojson?: GeoJSON.Feature<GeoJSON.Polygon>;
}

export interface Project {
  id: string;
  ref_code: string;
  title_en: string;
  title_ha?: string;
  description_en?: string;
  description_ha?: string;
  category: ProjectCategory;
  ward: Ward;
  community: string;
  latitude: number;
  longitude: number;
  beneficiaries: number;
  budget_ngn: number;
  expenditure_ngn: number;
  completion_date?: string;
  status: ProjectStatus;
  contractor?: string;
  images: string[];
  before_images: string[];
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardFilters {
  categories: Set<ProjectCategory>;
  year: string | 'all';
  view: 'pins' | 'heatmap';
  selectedProjectId: string | null;
}

export interface ProjectStats {
  total: number;
  communities: number;
  investment: number;
  wardsCovered: number;
}

export const ALL_CATEGORIES: ProjectCategory[] = ['roads', 'water', 'health', 'education', 'agric', 'youth', 'security'];

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  roads: 'Roads & Infrastructure',
  water: 'Water & Sanitation',
  health: 'Healthcare',
  education: 'Education',
  agric: 'Agriculture',
  youth: 'Youth & Sports',
  security: 'Security',
};

export const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  roads: '#F5A623',
  water: '#1D9B8A',
  health: '#E24B4A',
  education: '#4A90E2',
  agric: '#7ED321',
  youth: '#9B59B6',
  security: '#E67E22',
};
