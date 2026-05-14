import type { LayerProps } from 'react-map-gl/mapbox';

export const wardFillLayer: LayerProps = {
  id: 'ward-fill',
  type: 'fill',
  paint: {
    'fill-color': '#1D9B8A',
    'fill-opacity': 0.06,
  },
};

export const wardOutlineLayer: LayerProps = {
  id: 'ward-outline',
  type: 'line',
  paint: {
    'line-color': '#1D9B8A',
    'line-opacity': 0.35,
    'line-width': 1,
    'line-dasharray': [4, 2],
  },
};

export const lgaBoundaryFillLayer: LayerProps = {
  id: 'lga-boundary-fill',
  type: 'fill',
  paint: {
    'fill-color': '#1D9B8A',
    'fill-opacity': ['interpolate', ['linear'], ['zoom'], 8, 0.08, 12, 0.03],
  },
};

export const lgaBoundaryLineLayer: LayerProps = {
  id: 'lga-boundary-line',
  type: 'line',
  paint: {
    'line-color': '#25C4AE',
    'line-opacity': ['interpolate', ['linear'], ['zoom'], 8, 0.8, 12, 0.4],
    'line-width': 2,
  },
};

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
      0, 'rgba(29,155,138,0)',
      0.3, 'rgba(29,155,138,0.5)',
      0.6, 'rgba(245,166,35,0.7)',
      1.0, 'rgba(226,75,74,0.9)',
    ],
    'heatmap-radius': 40,
    'heatmap-opacity': 0.8,
  },
};
