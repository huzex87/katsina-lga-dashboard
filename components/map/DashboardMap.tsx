'use client';

import { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import Map, { Source, Layer, NavigationControl, Popup, type MapRef, type MapMouseEvent } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '@/store/dashboardStore';
import { ProjectPin } from './ProjectPin';
import { WardHeatmap } from './WardHeatmap';
import { WardProjectsList } from './WardProjectsList';
import { MapLegend } from './MapLegend';
import { MapSearch } from './MapSearch';
import { INITIAL_VIEWPORT, MAPBOX_TOKEN } from '@/lib/mapbox/config';
import { useTheme } from '@/contexts/ThemeContext';
import {
  wardFillLayer, wardOutlineLayer, wardLabelLayer,
  wardBadgeBgLayer, wardBadgeTextLayer,
  lgaBoundaryFillLayer, lgaBoundaryLineLayer, lgaBoundaryGlowLayer,
} from '@/lib/mapbox/layers';
import { formatNaira } from '@/lib/utils';
import type { Project } from '@/types/project';
import type { GeoJSON } from 'geojson';

// Precomputed bbox-center centroids for each of the 12 official wards
const WARD_CENTROIDS: Record<number, [number, number]> = {
  1:  [7.595808, 12.995179], // Arewa A
  2:  [7.577317, 13.019988], // Arewa B
  3:  [7.622748, 13.002097], // Gabas I
  4:  [7.622131, 12.985931], // Gabas II
  5:  [7.609004, 13.026834], // Gabas III
  6:  [7.594475, 12.983802], // Kudu I
  7:  [7.620425, 12.974603], // Kudu II
  8:  [7.601964, 12.967942], // Kudu III
  9:  [7.574846, 13.003435], // Yamma I
  10: [7.573727, 12.976507], // Yamma II
  11: [7.654104, 13.048843], // Shinkafi A
  12: [7.660907, 13.002876], // Shinkafi B
};

interface Props { projects: Project[] }

interface WardPopupState {
  longitude: number;
  latitude: number;
  wardName: string;
  count: number;
  investment: number;
}

interface SelectedWard {
  id: number;
  name: string;
  projects: Project[];
}

function buildBadgeGeoJSON(
  visibleProjects: Project[]
): GeoJSON.FeatureCollection {
  const counts: Record<number, { count: number; investment: number }> = {};
  for (const p of visibleProjects) {
    const wid = p.ward.id;
    if (!counts[wid]) counts[wid] = { count: 0, investment: 0 };
    counts[wid].count += 1;
    counts[wid].investment += p.budget_ngn;
  }

  return {
    type: 'FeatureCollection',
    features: Object.entries(WARD_CENTROIDS).map(([wardId, [lng, lat]]) => {
      const id = parseInt(wardId);
      const { count = 0, investment = 0 } = counts[id] ?? {};
      return {
        type: 'Feature',
        properties: { wardId: id, count, investment },
        geometry: { type: 'Point', coordinates: [lng, lat] },
      };
    }),
  };
}

export function DashboardMap({ projects }: Props) {
  const mapRef = useRef<MapRef>(null);
  const { filters, selectProject, setProjects, projects: storeProjects } = useDashboardStore();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [wardPopup, setWardPopup] = useState<WardPopupState | null>(null);
  const [selectedWard, setSelectedWard] = useState<SelectedWard | null>(null);
  const hoveredWardIdRef = useRef<number | null>(null);
  const { theme } = useTheme();
  const mapStyle = theme === 'light'
    ? 'mapbox://styles/mapbox/light-v11'
    : 'mapbox://styles/mapbox/dark-v11';

  useEffect(() => { setProjects(projects); }, [projects, setProjects]);

  const visibleProjects = useMemo(() =>
    storeProjects.filter(
      (p) =>
        filters.categories.has(p.category) &&
        (filters.year === 'all' || p.completion_date?.startsWith(filters.year))
    ),
    [storeProjects, filters.categories, filters.year]
  );

  const onMapLoad = useCallback(() => setMapLoaded(true), []);

  /* ── Feature states: ward fill density based on visible project counts ── */
  useEffect(() => {
    if (!mapLoaded) return;
    const map = mapRef.current?.getMap();
    if (!map) return;

    // Build counts from VISIBLE (filtered) projects
    const counts: Record<number, { count: number; investment: number }> = {};
    for (const p of visibleProjects) {
      const wid = p.ward.id;
      if (!counts[wid]) counts[wid] = { count: 0, investment: 0 };
      counts[wid].count += 1;
      counts[wid].investment += p.budget_ngn;
    }

    // Reset all 12 wards, then apply actual counts
    for (let id = 1; id <= 12; id++) {
      map.setFeatureState({ source: 'wards', id }, { count: 0, hasProjects: false, investment: 0 });
    }
    Object.entries(counts).forEach(([wardId, { count, investment }]) => {
      map.setFeatureState(
        { source: 'wards', id: parseInt(wardId) },
        { count, investment, hasProjects: count > 0 }
      );
    });

    // Update badge source with same counts
    const badgeSource = map.getSource('ward-badges') as mapboxgl.GeoJSONSource | undefined;
    badgeSource?.setData(buildBadgeGeoJSON(visibleProjects));
  }, [mapLoaded, visibleProjects]);

  /* ── Ward hover popup ─────────────────────────────────────────────────── */
  const handleWardMouseMove = useCallback((e: MapMouseEvent) => {
    const map = mapRef.current?.getMap();
    if (!map || !e.features?.length) return;
    const feature = e.features[0];
    if (feature.layer?.id !== 'ward-fill') return;

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

  /* ── Map click: ward → show project list | empty → clear ─────────────── */
  const handleMapClick = useCallback((e: MapMouseEvent) => {
    const wardFeature = e.features?.find(f => f.layer?.id === 'ward-fill');
    if (wardFeature) {
      const wardId = wardFeature.id as number;
      const wardName = wardFeature.properties?.name as string ?? `Ward ${wardId}`;
      const wardProjects = visibleProjects.filter((p) => p.ward.id === wardId);
      setSelectedWard({ id: wardId, name: wardName, projects: wardProjects });
      selectProject(null);
    } else {
      selectProject(null);
      setSelectedWard(null);
    }
  }, [selectProject, visibleProjects]);

  // Update selectedWard projects list when filters change
  useEffect(() => {
    if (!selectedWard) return;
    setSelectedWard(sw => sw ? {
      ...sw,
      projects: visibleProjects.filter(p => p.ward.id === sw.id),
    } : null);
  }, [visibleProjects]);

  return (
    <div className="relative w-full h-full">
      {/* Floating search bar */}
      <MapSearch />

      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={INITIAL_VIEWPORT}
        mapStyle={mapStyle}
        style={{ width: '100%', height: '100%' }}
        onClick={handleMapClick}
        onLoad={onMapLoad}
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

        {/* Ward boundaries */}
        <Source id="wards" type="geojson" data="/geojson/katsina-wards.geojson" promoteId="id">
          <Layer {...wardFillLayer} />
          <Layer {...wardOutlineLayer} />
          <Layer {...wardLabelLayer} />
        </Source>

        {/* Ward project count badges */}
        <Source
          id="ward-badges"
          type="geojson"
          data={buildBadgeGeoJSON(visibleProjects)}
        >
          <Layer {...wardBadgeBgLayer} />
          <Layer {...wardBadgeTextLayer} />
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
          >
            <div
              data-glass=""
              style={{
                background: 'var(--surface)',
                border: '1px solid rgba(29,155,138,0.35)',
                borderRadius: 10,
                padding: '10px 14px',
                minWidth: 160,
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 24px var(--shadow)',
              }}
            >
              <p style={{ color: '#25C4AE', fontWeight: 700, fontSize: 12, marginBottom: 6, letterSpacing: '0.05em' }}>
                {wardPopup.wardName}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <p style={{ color: 'var(--fg-2)', fontSize: 11 }}>
                  Projects:{' '}
                  <span style={{ color: 'var(--fg-1)', fontWeight: 600 }}>{wardPopup.count}</span>
                  {wardPopup.count > 0 && (
                    <span style={{ color: 'var(--fg-4)', fontSize: 10, marginLeft: 4 }}>— click to view</span>
                  )}
                </p>
                {wardPopup.investment > 0 && (
                  <p style={{ color: 'var(--fg-2)', fontSize: 11 }}>
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
                setSelectedWard(null);
                selectProject(project.id);
              }}
            />
          ))}

        {filters.view === 'heatmap' && <WardHeatmap projects={visibleProjects} />}
      </Map>

      {/* Ward project list panel (outside Map, in the relative container) */}
      <AnimatePresence>
        {selectedWard && (
          <WardProjectsList
            wardName={selectedWard.name}
            projects={selectedWard.projects}
            onClose={() => setSelectedWard(null)}
          />
        )}
      </AnimatePresence>

      {/* Map legend */}
      <MapLegend />
    </div>
  );
}
