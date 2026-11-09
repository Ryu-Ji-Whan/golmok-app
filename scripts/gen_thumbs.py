# 지도 위 마커에 쓰는 작은 스티커 이미지(96px webp)를 base64 문자열로 만든다.
# 실행: python3 scripts/gen_thumbs.py  (assets/stickers 를 바꿨을 때만, Pillow 필요)
import base64, io, json, pathlib
from PIL import Image
root = pathlib.Path(__file__).resolve().parent.parent
src = root / 'assets' / 'stickers'
out = {}
for f in sorted(src.glob('*.webp')):
    im = Image.open(f).convert('RGBA')
    im.thumbnail((96, 96), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'WEBP', quality=82, method=6)
    out[f.stem] = 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()
body = '// 자동 생성 파일: scripts/gen_thumbs.py 로 다시 만든다. 직접 고치지 말 것.\n'
body += 'export const STICKER_THUMBS: Record<string, string> = ' + json.dumps(out, indent=0) + ';\n'
(root / 'src' / 'lib' / 'stickerThumbs.ts').write_text(body)
print('thumbs', len(out), sum(len(v) for v in out.values()))
