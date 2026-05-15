import type { LayerProps } from 'react-map-gl/mapbox';

/* ─── Ward fill (inner areas) ───────────────────────────────────────────── */
export const wardFillLayer: LayerProps = {
  id: 'ward-fill',
  type: 'fill',
  paint: {
    'fill-color': [
      'case',
      ['boolean', ['feature-state', 'hovered'], false],
      'rgba(37,196,174,0.15)',
      ['boolean', ['feature-state', 'hasProjects'], false],
      [
        'interpolate', ['linear'], ['feature-state', 'count'],
        0, 'rgba(29,155,138,0.05)',
        1, 'rgba(29,155,138,0.10)',
        3, 'rgba(29,155,138,0.18)',
        6, 'rgba(29,155,138,0.25)',
      ],
      'rgba(29,155,138,0.03)',
    ],
    'fill-opacity': 1,
  },
};

/* ─── Ward outline (dashed internal borders) ────────────────────────────── */
export const wardOutlineLayer: LayerProps = {
  id: 'ward-outline',
  type: 'line',
  paint: {
    'line-color': [
      'case',
      ['boolean', ['feature-state', 'hovered'], false],
      '#25C4AE',
      '#1D9B8A',
    ],
    'line-opacity': [
      'case',
      ['boolean', ['feature-state', 'hovered'], false],
      0.90,
      0.30,
    ],
    'line-width': [
      'interpolate', ['linear'], ['zoom'],
      8, ['case', ['boolean', ['feature-state', 'hovered'], false], 1.5, 0.5],
      13, ['case', ['boolean', ['feature-state', 'hovered'], false], 2.5, 1.0],
    ],
    'line-dasharray': [5, 3],
  },
};

/* ─── Ward name labels (appear at zoom ≥ 11) ───────────────────────────── */
export const wardLabelLayer: LayerProps = {
  id: 'ward-labels',
  type: 'symbol',
  minzoom: 11,
  layout: {
    'text-field': ['get', 'name'],
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': ['interpolate', ['linear'], ['zoom'], 11, 9, 14, 13],
    'text-anchor': 'center',
    'text-max-width': 8,
    'text-letter-spacing': 0.04,
  },
  paint: {
    'text-color': [
      'case',
      ['boolean', ['feature-state', 'hovered'], false],
      'rgba(255,255,255,0.90)',
      'rgba(255,255,255,0.45)',
    ],
    'text-halo-color': 'rgba(10,22,40,0.85)',
    'text-halo-width': 1.5,
    'text-halo-blur': 0.5,
  },
};

/* ─── LGA outer boundary fill ───────────────────────────────────────────── */
export const lgaBoundaryFillLayer: LayerProps = {
  id: 'lga-boundary-fill',
  type: 'fill',
  paint: {
    'fill-color': '#1D9B8A',
    'fill-opacity': ['interpolate', ['linear'], ['zoom'], 8, 0.07, 13, 0.02],
  },
};

/* ─── LGA outer boundary line (prominent glow edge) ────────────────────── */
export const lgaBoundaryLineLayer: LayerProps = {
  id: 'lga-boundary-line',
  type: 'line',
  paint: {
    'line-color': '#25C4AE',
    'line-opacity': ['interpolate', ['linear'], ['zoom'], 8, 1.0, 13, 0.75],
    'line-width': ['interpolate', ['linear'], ['zoom'], 8, 2.5, 12, 4.0],
    'line-blur': 0.8,
  },
};

/* ─── LGA boundary glow (second wider translucent line behind the main) ── */
export const lgaBoundaryGlowLayer: LayerProps = {
  id: 'lga-boundary-glow',
  type: 'line',
  paint: {
    'line-color': '#1D9B8A',
    'line-opacity': ['interpolate', ['linear'], ['zoom'], 8, 0.35, 13, 0.20],
    'line-width': ['interpolate', ['linear'], ['zoom'], 8, 8, 12, 14],
    'line-blur': 6,
  },
};

/* ─── Ward count badge — circle background ──────────────────────────────── */
export const wardBadgeBgLayer: LayerProps = {
  id: 'ward-badge-bg',
  type: 'circle',
  filter: ['>', ['get', 'count'], 0],
  paint: {
    'circle-radius': ['interpolate', ['linear'], ['get', 'count'], 1, 11, 5, 15, 10, 18],
    'circle-color': '#1D9B8A',
    'circle-stroke-color': 'rgba(255,255,255,0.85)',
    'circle-stroke-width': 1.5,
    'circle-opacity': 0.92,
    'circle-blur': 0,
  },
};

/* ─── Ward count badge — number label ───────────────────────────────────── */
export const wardBadgeTextLayer: LayerProps = {
  id: 'ward-badge-text',
  type: 'symbol',
  filter: ['>', ['get', 'count'], 0],
  layout: {
    'text-field': ['to-string', ['get', 'count']],
    'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
    'text-size': 11,
    'text-anchor': 'center',
    'text-allow-overlap': true,
    'text-ignore-placement': true,
  },
  paint: {
    'text-color': '#ffffff',
  },
};

/* ─── Heatmap (ward-level project density) ──────────────────────────────── */
export const heatmapLayer: LayerProps = {
  id: 'ward-heatmap',
  type: 'heatmap',
  paint: {
    'heatmap-weight': ['interpolate', ['linear'], ['get', 'count'], 0, 0, 6, 1],
    'heatmap-intensity': 1.5,
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,   'rgba(29,155,138,0)',
      0.3, 'rgba(29,155,138,0.5)',
      0.6, 'rgba(245,166,35,0.7)',
      1.0, 'rgba(226,75,74,0.9)',
    ],
    'heatmap-radius': 40,
    'heatmap-opacity': 0.8,
  },
};
