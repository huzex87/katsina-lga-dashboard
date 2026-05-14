'use client';

import { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/mapbox';
import { heatmapLayer } from '@/lib/mapbox/layers';
import type { Project } from '@/types/project';
import type { FeatureCollection, Point } from 'geojson';

interface Props {
  projects: Project[];
}

export function WardHeatmap({ projects }: Props) {
  const geojsonData = useMemo<FeatureCollection<Point>>(() => ({
    type: 'FeatureCollection',
    features: projects.map((p) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.longitude, p.latitude] },
      properties: { count: 1, id: p.id, ward: p.ward.name },
    })),
  }), [projects]);

  return (
    <Source id="heatmap-source" type="geojson" data={geojsonData}>
      <Layer {...heatmapLayer} />
    </Source>
  );
}
