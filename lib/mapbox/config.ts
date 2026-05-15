export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export const MAP_STYLE = 'mapbox://styles/mapbox/dark-v11';

export const INITIAL_VIEWPORT = {
  latitude: 12.998,
  longitude: 7.615,
  zoom: 11.2,
  pitch: 0,
  bearing: 0,
};

export const KATSINA_BOUNDS: [[number, number], [number, number]] = [
  [7.4, 12.8],
  [7.9, 13.2],
];

// Precomputed bbox-center centroids for each of the 12 official wards
export const WARD_CENTROIDS: Record<number, [number, number]> = {
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
