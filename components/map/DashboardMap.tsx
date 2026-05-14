'use client';

import { useEffect, useRef, useMemo, useCallback } from 'react';
import Map, { Source, Layer, Marker, NavigationControl, type MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useDashboardStore } from '@/store/dashboardStore';
import { ProjectPin } from './ProjectPin';
import { WardHeatmap } from './WardHeatmap';
import { INITIAL_VIEWPORT, MAP_STYLE, MAPBOX_TOKEN } from '@/lib/mapbox/config';
import { wardFillLayer, wardOutlineLayer, lgaBoundaryFillLayer, lgaBoundaryLineLayer } from '@/lib/mapbox/layers';
import type { Project } from '@/types/project';

interface Props {
  projects: Project[];
}

export function DashboardMap({ projects }: Props) {
  const mapRef = useRef<MapRef>(null);
  const { filters, selectProject, setProjects, projects: storeProjects } = useDashboardStore();

  useEffect(() => {
    setProjects(projects);
  }, [projects, setProjects]);

  const visibleProjects = useMemo(() =>
    storeProjects.filter(
      (p) =>
        filters.categories.has(p.category) &&
        (filters.year === 'all' || p.completion_date?.startsWith(filters.year))
    ),
    [storeProjects, filters.categories, filters.year]
  );

  const handleMapClick = useCallback(() => {
    selectProject(null);
  }, [selectProject]);

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={INITIAL_VIEWPORT}
      mapStyle={MAP_STYLE}
      style={{ width: '100%', height: '100%' }}
      onClick={handleMapClick}
      interactiveLayerIds={filters.view === 'heatmap' ? ['ward-heatmap'] : []}
    >
      <NavigationControl position="bottom-left" />

      {/* LGA boundary */}
      <Source id="lga-boundary" type="geojson" data="/geojson/katsina-lga.geojson">
        <Layer {...lgaBoundaryFillLayer} />
        <Layer {...lgaBoundaryLineLayer} />
      </Source>

      {/* Ward boundaries */}
      <Source id="wards" type="geojson" data="/geojson/katsina-wards.geojson">
        <Layer {...wardFillLayer} />
        <Layer {...wardOutlineLayer} />
      </Source>

      {filters.view === 'pins' &&
        visibleProjects.map((project, i) => (
          <ProjectPin
            key={project.id}
            project={project}
            entranceDelay={i * 60}
            onClick={(e) => {
              e.originalEvent?.stopPropagation();
              selectProject(project.id);
            }}
          />
        ))}

      {filters.view === 'heatmap' && <WardHeatmap projects={visibleProjects} />}
    </Map>
  );
}
