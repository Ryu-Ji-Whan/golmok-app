import { CELL_M } from './geo';
import { LEAFLET_CSS, LEAFLET_JS } from './leafletAssets';
import { C } from './theme';

/**
 * 지도 화면(WebView 안에서 도는 HTML).
 * - 지도 타일: OpenStreetMap 공식 타일 (API 키 불필요, 데모·소량 사용만 허용).
 *   CARTO 타일은 이제 API 키가 없으면 "API KEY REQUIRED" 그림을 보내서 바꿨다.
 * - 안개: 캔버스 한 장을 지도 위에 덮고, 밝힌 칸만 지운다.
 * - 앱(React Native) ↔ 지도 통신
 *     앱 → 지도: window.__explored(keys, fogOn) / window.__icons(map) / window.__set(state) / window.__fly(lat, lng, zoom)
 *     지도 → 앱: {type:'ready'} / {type:'spot', id} / {type:'extra', id} / {type:'log', msg}
 */
export function buildMapHtml(center: { latitude: number; longitude: number }, zoom = 16) {
  const config = {
    center: [center.latitude, center.longitude],
    zoom,
    cellM: CELL_M,
    fog: C.fog,
    route: C.route,
    orange: C.orange,
    cream: C.cream,
  };
  return `<!doctype html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<style>${LEAFLET_CSS}</style>
<style>
  html, body, #map { margin:0; padding:0; width:100%; height:100%; background:${C.cream}; }
  * { -webkit-tap-highlight-color: transparent; -webkit-user-select:none; user-select:none; -webkit-touch-callout:none; }
  .leaflet-container { background:#efe9db; font-family:-apple-system, system-ui, sans-serif; }
  .leaflet-tile-pane { filter: saturate(0.8) sepia(0.12) brightness(1.02); }
  .leaflet-control-attribution { font-size:9px; background:rgba(255,255,255,0.7) !important; }
  .fog-pane { pointer-events:none; }
  .stk { width:44px; height:44px; border-radius:22px; background:#fff; box-shadow:0 2px 6px rgba(0,0,0,0.25);
         display:flex; align-items:center; justify-content:center; border:2px solid #fff; box-sizing:border-box; }
  .stk img { width:36px; height:36px; object-fit:contain; pointer-events:none; }
  .stk.me { width:54px; height:54px; border-radius:27px; border:3px solid ${C.orange}; }
  .stk.me img { width:44px; height:44px; }
  .stk.done { background:${C.mint}; }
</style>
</head><body><div id="map"></div>
<script>${LEAFLET_JS}</script>
<script>
(function () {
  var CFG = ${JSON.stringify(config)};
  function post(o) { if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(o)); }
  window.onerror = function (m, s, l) { post({ type: 'log', msg: String(m) + ' @' + l }); };

  // 앱(geo.ts)과 똑같은 격자 계산
  var M_PER_DEG_LAT = 111320;
  var COS_REF = Math.cos(37.5 * Math.PI / 180);
  var D_LAT = CFG.cellM / M_PER_DEG_LAT;
  var D_LNG = CFG.cellM / (M_PER_DEG_LAT * COS_REF);

  var map = L.map('map', { zoomControl: false, minZoom: 13, maxZoom: 19, attributionControl: true, tap: false })
    .setView(CFG.center, CFG.zoom);
  map.attributionControl.setPrefix(false);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, detectRetina: false,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // ---------- 안개 ----------
  map.createPane('fog');
  var fogPane = map.getPane('fog');
  fogPane.style.zIndex = 450; // 타일(200)·경로(400) 위, 마커(600) 아래
  fogPane.classList.add('fog-pane');
  var canvas = document.createElement('canvas');
  fogPane.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var cells = [];      // [[i, j], ...]
  var fogOn = true;

  function drawFog() {
    var size = map.getSize();
    var dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(size.x * dpr) || canvas.height !== Math.round(size.y * dpr)) {
      canvas.width = Math.round(size.x * dpr); canvas.height = Math.round(size.y * dpr);
      canvas.style.width = size.x + 'px'; canvas.style.height = size.y + 'px';
    }
    L.DomUtil.setPosition(canvas, map.containerPointToLayerPoint([0, 0]));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size.x, size.y);
    if (!fogOn) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = CFG.fog;
    ctx.fillRect(0, 0, size.x, size.y);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = '#000';
    var b = map.getBounds().pad(0.1);
    var s = b.getSouth(), n = b.getNorth(), w = b.getWest(), e = b.getEast();
    for (var k = 0; k < cells.length; k++) {
      var i = cells[k][0], j = cells[k][1];
      var lat0 = i * D_LAT, lng0 = j * D_LNG;
      if (lat0 > n || lat0 + D_LAT < s || lng0 > e || lng0 + D_LNG < w) continue;
      var p0 = map.latLngToContainerPoint([lat0 + D_LAT, lng0]);
      var p1 = map.latLngToContainerPoint([lat0, lng0 + D_LNG]);
      ctx.fillRect(p0.x - 0.5, p0.y - 0.5, p1.x - p0.x + 1, p1.y - p0.y + 1);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  map.on('move zoom resize viewreset', drawFog);
  map.on('zoomanim', function () { canvas.style.opacity = 0; });
  map.on('zoomend moveend', function () { drawFog(); canvas.style.opacity = 1; });

  // ---------- 마커·경로 ----------
  var icons = {};
  var markers = L.layerGroup().addTo(map);
  var pathLine = null;
  var userDot = null;

  function stickerIcon(id, cls) {
    var src = icons[id] || '';
    var big = cls && cls.indexOf('me') >= 0;
    var s = big ? 54 : 44;
    return L.divIcon({ className: '', html: '<div class="stk ' + (cls || '') + '"><img src="' + src + '"></div>', iconSize: [s, s], iconAnchor: [s / 2, s / 2] });
  }

  window.__icons = function (m) { for (var k in m) icons[k] = m[k]; };
  window.__explored = function (keys, on) {
    fogOn = on !== false;
    cells = keys.map(function (k) { var p = k.split(':'); return [parseInt(p[0], 10), parseInt(p[1], 10)]; });
    drawFog();
  };
  window.__set = function (st) {
    markers.clearLayers();
    (st.spots || []).forEach(function (m) {
      L.marker([m.lat, m.lng], { icon: stickerIcon(m.icon) }).on('click', function () { post({ type: 'spot', id: m.id }); }).addTo(markers);
    });
    (st.extras || []).forEach(function (m) {
      L.marker([m.lat, m.lng], { icon: stickerIcon(m.icon, m.done ? 'done' : '') }).on('click', function () { post({ type: 'extra', id: m.id }); }).addTo(markers);
    });
    if (st.me) L.marker([st.me.lat, st.me.lng], { icon: stickerIcon(st.me.icon, 'me'), zIndexOffset: 1000 }).addTo(markers);

    if (pathLine) { map.removeLayer(pathLine); pathLine = null; }
    if (st.path && st.path.length > 1) {
      pathLine = L.polyline(st.path, { color: CFG.route, weight: 5, dashArray: '2 10', lineCap: 'round', interactive: false }).addTo(map);
    }
    if (userDot) { map.removeLayer(userDot); userDot = null; }
    if (st.user) {
      userDot = L.circleMarker([st.user.lat, st.user.lng], { radius: 8, color: '#fff', weight: 3, fillColor: '#2F7BF6', fillOpacity: 1, interactive: false }).addTo(map);
    }
  };
  window.__fly = function (lat, lng, zoom) {
    var z = zoom == null ? map.getZoom() : zoom;
    map.setView([lat, lng], z, { animate: true, duration: 0.5 });
  };
  window.__fit = function (pts) {
    if (pts && pts.length > 1) map.fitBounds(pts, { padding: [30, 30], maxZoom: 17 });
  };

  drawFog();
  post({ type: 'ready' });
})();
</script>
</body></html>`;
}
