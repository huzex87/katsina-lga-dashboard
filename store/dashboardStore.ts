import { create } from 'zustand';
import type { Project, ProjectCategory, DashboardFilters } from '@/types/project';
import { ALL_CATEGORIES } from '@/types/project';

interface DashboardState {
  filters: DashboardFilters;
  selectedProject: Project | null;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  setCategory: (cat: ProjectCategory, active: boolean) => void;
  setAllCategories: (active: boolean) => void;
  setYear: (year: string | 'all') => void;
  setView: (view: 'pins' | 'heatmap') => void;
  selectProject: (id: string | null) => void;
  getVisibleProjects: () => Project[];
}

export const useDashboardStore = create<DashboardState>()((set, get) => ({
  filters: {
    categories: new Set<ProjectCategory>(ALL_CATEGORIES),
    year: 'all',
    view: 'pins',
    selectedProjectId: null,
  },
  selectedProject: null,
  projects: [],

  setProjects: (projects) => set({ projects }),

  setCategory: (cat, active) =>
    set((s) => {
      const cats = new Set(s.filters.categories);
      active ? cats.add(cat) : cats.delete(cat);
      return { filters: { ...s.filters, categories: cats } };
    }),

  setAllCategories: (active) =>
    set((s) => ({
      filters: {
        ...s.filters,
        categories: active ? new Set<ProjectCategory>(ALL_CATEGORIES) : new Set<ProjectCategory>(),
      },
    })),

  setYear: (year) => set((s) => ({ filters: { ...s.filters, year } })),

  setView: (view) => set((s) => ({ filters: { ...s.filters, view } })),

  selectProject: (id) =>
    set((s) => ({
      selectedProject: id ? s.projects.find((p) => p.id === id) ?? null : null,
      filters: { ...s.filters, selectedProjectId: id },
    })),

  getVisibleProjects: () => {
    const { projects, filters } = get();
    return projects.filter(
      (p) =>
        filters.categories.has(p.category) &&
        (filters.year === 'all' || p.completion_date?.startsWith(filters.year)),
    );
  },
}));
