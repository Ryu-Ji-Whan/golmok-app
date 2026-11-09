export type LatLng = { latitude: number; longitude: number };

/** 안개를 계산하는 격자 한 칸의 크기(미터). */
export const CELL_M = 50;
/** 걸은 지점에서 이 반경 안의 칸을 밝힌다(미터). */
export const REVEAL_M = 100;

const M_PER_DEG_LAT = 111320;
// 한국 중부 위도(약 37.5도) 기준으로 경도 간격을 고정해, 격자가 어디서나 같은 칸 번호를 갖게 한다.
const COS_REF = Math.cos((37.5 * Math.PI) / 180);
export const D_LAT = CELL_M / M_PER_DEG_LAT;
export const D_LNG = CELL_M / (M_PER_DEG_LAT * COS_REF);

export const DEFAULT_CENTER: LatLng = { latitude: 37.2836, longitude: 127.0152 }; // 수원 행궁동 부근

export function cellOf(p: LatLng): [number, number] {
  return [Math.floor(p.latitude / D_LAT), Math.floor(p.longitude / D_LNG)];
}

export function cellKey(i: number, j: number) {
  return `${i}:${j}`;
}

export function distanceM(a: LatLng, b: LatLng) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** p 주변 REVEAL_M 안에 있는 칸들의 키 목록. */
export function cellsAround(p: LatLng, radiusM = REVEAL_M): string[] {
  const [ci, cj] = cellOf(p);
  const n = Math.ceil(radiusM / CELL_M) + 1;
  const keys: string[] = [];
  for (let di = -n; di <= n; di++) {
    for (let dj = -n; dj <= n; dj++) {
      const center = {
        latitude: (ci + di + 0.5) * D_LAT,
        longitude: (cj + dj + 0.5) * D_LNG,
      };
      if (distanceM(p, center) <= radiusM + CELL_M / 2) keys.push(cellKey(ci + di, cj + dj));
    }
  }
  return keys;
}

/**
 * 화면 중심 주변 (2n+1)x(2n+1) 칸 중 아직 밝히지 않은 칸을 덮는 사각형 목록.
 * 같은 줄에서 연달아 있는 칸은 하나의 사각형으로 합쳐 지도에 올리는 도형 수를 줄인다.
 */
export function fogRects(center: LatLng, explored: Set<string>, n = 30): LatLng[][] {
  const [ci, cj] = cellOf(center);
  const rects: LatLng[][] = [];
  for (let i = ci - n; i <= ci + n; i++) {
    let runStart: number | null = null;
    for (let j = cj - n; j <= cj + n + 1; j++) {
      const fogged = j <= cj + n && !explored.has(cellKey(i, j));
      if (fogged && runStart === null) runStart = j;
      if (!fogged && runStart !== null) {
        const lat0 = i * D_LAT;
        const lat1 = (i + 1) * D_LAT;
        const lng0 = runStart * D_LNG;
        const lng1 = j * D_LNG;
        rects.push([
          { latitude: lat0, longitude: lng0 },
          { latitude: lat0, longitude: lng1 },
          { latitude: lat1, longitude: lng1 },
          { latitude: lat1, longitude: lng0 },
        ]);
        runStart = null;
      }
    }
  }
  return rects;
}

/** p에서 북쪽으로 north 미터, 동쪽으로 east 미터 떨어진 지점. */
export function offset(p: LatLng, northM: number, eastM: number): LatLng {
  return {
    latitude: p.latitude + northM / M_PER_DEG_LAT,
    longitude: p.longitude + eastM / (M_PER_DEG_LAT * Math.cos((p.latitude * Math.PI) / 180)),
  };
}

export function formatDistance(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${Math.round(m)}m`;
}

export function formatDuration(ms: number) {
  const min = Math.floor(ms / 60000);
  if (min < 60) return `${min}분`;
  return `${Math.floor(min / 60)}시간 ${min % 60}분`;
}
