export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export const MAP_STYLE = 'mapbox://styles/mapbox/dark-v11';

export const INITIAL_VIEWPORT = {
  latitude: 12.9954,
  longitude: 7.6014,
  zoom: 11.5,
  pitch: 0,
  bearing: 0,
};

export const KATSINA_BOUNDS: [[number, number], [number, number]] = [
  [7.4, 12.8],
  [7.9, 13.2],
];

export const PIN_COLORS = {
  low: '#1D9B8A',
  mid: '#F5A623',
  high: '#E24B4A',
} as const;

export function getPinColor(count: number): string {
  if (count <= 2) return PIN_COLORS.low;
  if (count <= 5) return PIN_COLORS.mid;
  return PIN_COLORS.high;
}
