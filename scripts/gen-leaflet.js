// Leaflet(지도 라이브러리)을 앱 안에 문자열로 넣어 둔다. 인터넷이 느려도 지도 코드는 바로 뜨게.
// 실행: node scripts/gen-leaflet.js  (leaflet 버전을 바꿨을 때만)
const fs = require('fs');
const path = require('path');
const dist = path.join(__dirname, '..', 'node_modules', 'leaflet', 'dist');
const js = fs.readFileSync(path.join(dist, 'leaflet.js'), 'utf8');
const css = fs.readFileSync(path.join(dist, 'leaflet.css'), 'utf8');
const out = `// 자동 생성 파일: scripts/gen-leaflet.js 로 다시 만든다. 직접 고치지 말 것.
// Leaflet 1.9.4 (BSD-2-Clause) https://leafletjs.com
export const LEAFLET_JS = ${JSON.stringify(js)};
export const LEAFLET_CSS = ${JSON.stringify(css)};
`;
fs.writeFileSync(path.join(__dirname, '..', 'src', 'lib', 'leafletAssets.ts'), out);
console.log('wrote src/lib/leafletAssets.ts', out.length);
