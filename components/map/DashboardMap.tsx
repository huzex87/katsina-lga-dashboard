'use client';

import { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import Map, { Source, Layer, NavigationControl, Popup, type MapRef, type MapMouseEvent } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useDashboardStore } from '@/store/dashboardStore';
import { ProjectPin } from './ProjectPin';
import { WardHeatmap } from './WardHeatmap';
import { INITIAL_VIEWPORT, MAP_STYLE, MAPBOX_TOKEN } from '@/lib/mapbox/config';
import {
  wardFillLayer, wardOutlineLayer, wardLabelLayer,
  lgaBoundaryFillLayer, lgaBoundaryLineLayer, lgaBoundaryGlowLayer,
} from '@/lib/mapbox/layers';
import { formatNaira } from '@/lib/utils';
import type { Project } from '@/types/project';

interface Props {
  projects: Project[];
}

interface WardPopupState {
  longitude: number;
  latitude: number;
  wardName: string;
  count: number;
  investment: number;
}

export function DashboardMap({ projects }: Props) {
  const mapRef = useRef<MapRef>(null);
  const { filters, selectProject, setProjects, projects: storeProjects } = useDashboardStore();
  const [wardPopup, setWardPopup] = useState<WardPopupState | null>(null);
  const hoveredWardIdRef = useRef<number | null>(null);

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

  /* Set feature states (project count per ward) whenever projects change */
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const apply = () => {
      const counts: Record<number, { count: number; investment: number }> = {};
      for (const p of storeProjects) {
        const wid = p.ward.id;
        if (!counts[wid]) counts[wid] = { count: 0, investment: 0 };
        counts[wid].count += 1;
        counts[wid].investment += p.budget_ngn;
      }
      // Clear all first
      for (let id = 1; id <= 30; id++) {
        try { map.removeFeatureState({ source: 'wards', id }); } catch { /* noop */ }
      }
      Object.entries(counts).forEach(([wardId, { count, investment }]) => {
        map.setFeatureState(
          { source: 'wards', id: parseInt(wardId) },
          { count, investment, hasProjects: count > 0 }
        );
      });
    };
    if (map.isStyleLoaded()) {
      apply();
    } else {
      map.once('load', apply);
    }
  }, [storeProjects]);

  const handleWardMouseMove = useCallback((e: MapMouseEvent) => {
    const map = mapRef.current?.getMap();
    if (!map || !e.features?.length) return;
    const feature = e.features[0];
    const wardId = feature.id as number;
    const wardName = feature.properties?.name as string;

    if (wardId !== hoveredWardIdRef.current) {
      if (hoveredWardIdRef.current !== null) {
        map.setFeatureState({ source: 'wards', id: hoveredWardIdRef.current }, { hovered: false });
      }
      map.setFeatureState({ source: 'wards', id: wardId }, { hovered: true });
      hoveredWardIdRef.current = wardId;
    }

    const wardProjects = visibleProjects.filter((p) => p.ward.id === wardId);
    setWardPopup({
      longitude: e.lngLat.lng,
      latitude: e.lngLat.lat,
      wardName: wardName ?? `Ward ${wardId}`,
      count: wardProjects.length,
      investment: wardProjects.reduce((s, p) => s + p.budget_ngn, 0),
    });
  }, [visibleProjects]);

  const handleWardMouseLeave = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    if (hoveredWardIdRef.current !== null) {
      map.setFeatureState({ source: 'wards', id: hoveredWardIdRef.current }, { hovered: false });
      hoveredWardIdRef.current = null;
    }
    setWardPopup(null);
  }, []);

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
      interactiveLayerIds={['ward-fill']}
      onMouseMove={handleWardMouseMove}
      onMouseLeave={handleWardMouseLeave}
      cursor={wardPopup ? 'crosshair' : 'grab'}
    >
      <NavigationControl position="bottom-left" />

      {/* LGA outer boundary */}
      <Source id="lga-boundary" type="geojson" data="/geojson/katsina-lga.geojson">
        <Layer {...lgaBoundaryGlowLayer} />
        <Layer {...lgaBoundaryFillLayer} />
        <Layer {...lgaBoundaryLineLayer} />
      </Source>

      {/* Ward boundaries (promoteId maps properties.id → feature ID for setFeatureState) */}
      <Source id="wards" type="geojson" data="/geojson/katsina-wards.geojson" promoteId="id">
        <Layer {...wardFillLayer} />
        <Layer {...wardOutlineLayer} />
        <Layer {...wardLabelLayer} />
      </Source>

      {/* Ward hover popup */}
      {wardPopup && (
        <Popup
          longitude={wardPopup.longitude}
          latitude={wardPopup.latitude}
          closeButton={false}
          closeOnClick={false}
          anchor="bottom"
          offset={12}
          className="ward-popup"
        >
          <div
            style={{
              background: 'rgba(10,22,40,0.95)',
              border: '1px solid rgba(29,155,138,0.35)',
              borderRadius: 10,
              padding: '10px 14px',
              minWidth: 160,
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
            }}
          >
            <p style={{ color: '#25C4AE', fontWeight: 700, fontSize: 12, marginBottom: 6, letterSpacing: '0.05em' }}>
              {wardPopup.wardName}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>
                Projects:{' '}
                <span style={{ color: 'white', fontWeight: 600 }}>{wardPopup.count}</span>
              </p>
              {wardPopup.investment > 0 && (
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>
                  Investment:{' '}
                  <span style={{ color: '#F5A623', fontWeight: 600 }}>{formatNaira(wardPopup.investment)}</span>
                </p>
              )}
            </div>
          </div>
        </Popup>
      )}

      {/* Project pins */}
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
