import type { ImageSourcePropType } from 'react-native';

export type StickerCategory = 'cat' | 'sparrow' | 'thing' | 'place';
export type Sticker = { id: string; name: string; category: StickerCategory; image: ImageSourcePropType };

export const STICKERS: Record<string, Sticker> = {
  a00: { id: 'a00', name: '산책 고양이', category: 'cat', image: require('../../assets/stickers/a00.webp') },
  a01: { id: 'a01', name: '앉은 고양이', category: 'cat', image: require('../../assets/stickers/a01.webp') },
  a02: { id: 'a02', name: '빼꼼 고양이', category: 'cat', image: require('../../assets/stickers/a02.webp') },
  a03: { id: 'a03', name: '지도 보는 고양이', category: 'cat', image: require('../../assets/stickers/a03.webp') },
  a04: { id: 'a04', name: '응원 고양이', category: 'cat', image: require('../../assets/stickers/a04.webp') },
  a05: { id: 'a05', name: '참새 1', category: 'sparrow', image: require('../../assets/stickers/a05.webp') },
  a06: { id: 'a06', name: '참새 2', category: 'sparrow', image: require('../../assets/stickers/a06.webp') },
  a07: { id: 'a07', name: '참새 3', category: 'sparrow', image: require('../../assets/stickers/a07.webp') },
  a08: { id: 'a08', name: '참새 4', category: 'sparrow', image: require('../../assets/stickers/a08.webp') },
  a09: { id: 'a09', name: '참새 5', category: 'sparrow', image: require('../../assets/stickers/a09.webp') },
  a10: { id: 'a10', name: '참새 6', category: 'sparrow', image: require('../../assets/stickers/a10.webp') },
  a11: { id: 'a11', name: '꽃', category: 'thing', image: require('../../assets/stickers/a11.webp') },
  a12: { id: 'a12', name: '노을', category: 'thing', image: require('../../assets/stickers/a12.webp') },
  a13: { id: 'a13', name: '커피', category: 'thing', image: require('../../assets/stickers/a13.webp') },
  a14: { id: 'a14', name: '나무', category: 'thing', image: require('../../assets/stickers/a14.webp') },
  a15: { id: 'a15', name: '발자국', category: 'thing', image: require('../../assets/stickers/a15.webp') },
  a16: { id: 'a16', name: '골목 소품 6', category: 'thing', image: require('../../assets/stickers/a16.webp') },
  a17: { id: 'a17', name: '카메라', category: 'thing', image: require('../../assets/stickers/a17.webp') },
  a18: { id: 'a18', name: '벤치', category: 'thing', image: require('../../assets/stickers/a18.webp') },
  a19: { id: 'a19', name: '핀', category: 'thing', image: require('../../assets/stickers/a19.webp') },
  a20: { id: 'a20', name: '도토리', category: 'thing', image: require('../../assets/stickers/a20.webp') },
  a21: { id: 'a21', name: '낮잠 고양이', category: 'cat', image: require('../../assets/stickers/a21.webp') },
  b00: { id: 'b00', name: '카페', category: 'place', image: require('../../assets/stickers/b00.webp') },
  b01: { id: 'b01', name: '빵집', category: 'place', image: require('../../assets/stickers/b01.webp') },
  b02: { id: 'b02', name: '책방', category: 'place', image: require('../../assets/stickers/b02.webp') },
  b03: { id: 'b03', name: '꽃집', category: 'place', image: require('../../assets/stickers/b03.webp') },
  b04: { id: 'b04', name: '정자', category: 'place', image: require('../../assets/stickers/b04.webp') },
  b05: { id: 'b05', name: '골목 풍경 6', category: 'place', image: require('../../assets/stickers/b05.webp') },
  b06: { id: 'b06', name: '골목 풍경 7', category: 'place', image: require('../../assets/stickers/b06.webp') },
  b07: { id: 'b07', name: '골목 풍경 8', category: 'place', image: require('../../assets/stickers/b07.webp') },
  b08: { id: 'b08', name: '골목 풍경 9', category: 'place', image: require('../../assets/stickers/b08.webp') },
  b09: { id: 'b09', name: '골목 풍경 10', category: 'place', image: require('../../assets/stickers/b09.webp') },
  b10: { id: 'b10', name: '골목 풍경 11', category: 'place', image: require('../../assets/stickers/b10.webp') },
  b11: { id: 'b11', name: '골목 풍경 12', category: 'place', image: require('../../assets/stickers/b11.webp') },
  b12: { id: 'b12', name: '골목 풍경 13', category: 'place', image: require('../../assets/stickers/b12.webp') },
  b13: { id: 'b13', name: '골목 풍경 14', category: 'place', image: require('../../assets/stickers/b13.webp') },
  b14: { id: 'b14', name: '골목 풍경 15', category: 'place', image: require('../../assets/stickers/b14.webp') },
  b15: { id: 'b15', name: '골목 풍경 16', category: 'place', image: require('../../assets/stickers/b15.webp') },
  b16: { id: 'b16', name: '골목 풍경 17', category: 'place', image: require('../../assets/stickers/b16.webp') },
  b17: { id: 'b17', name: '골목 풍경 18', category: 'place', image: require('../../assets/stickers/b17.webp') },
  b18: { id: 'b18', name: '골목 풍경 19', category: 'place', image: require('../../assets/stickers/b18.webp') },
  b19: { id: 'b19', name: '골목 풍경 20', category: 'place', image: require('../../assets/stickers/b19.webp') },
  c01: { id: 'c01', name: '골목 참새', category: 'sparrow', image: require('../../assets/stickers/c01.webp') },
  c02: { id: 'c02', name: '참새 8', category: 'sparrow', image: require('../../assets/stickers/c02.webp') },
  c03: { id: 'c03', name: '참새 9', category: 'sparrow', image: require('../../assets/stickers/c03.webp') },
  c04: { id: 'c04', name: '지도 참새', category: 'sparrow', image: require('../../assets/stickers/c04.webp') },
  c05: { id: 'c05', name: '참새 11', category: 'sparrow', image: require('../../assets/stickers/c05.webp') },
  c07: { id: 'c07', name: '참새 12', category: 'sparrow', image: require('../../assets/stickers/c07.webp') },
  c08: { id: 'c08', name: '참새 13', category: 'sparrow', image: require('../../assets/stickers/c08.webp') },
  c09: { id: 'c09', name: '참새 14', category: 'sparrow', image: require('../../assets/stickers/c09.webp') },
  c10: { id: 'c10', name: '참새 15', category: 'sparrow', image: require('../../assets/stickers/c10.webp') },
  c11: { id: 'c11', name: '참새 16', category: 'sparrow', image: require('../../assets/stickers/c11.webp') },
  c12: { id: 'c12', name: '참새 17', category: 'sparrow', image: require('../../assets/stickers/c12.webp') },
  c13: { id: 'c13', name: '깃발 참새', category: 'sparrow', image: require('../../assets/stickers/c13.webp') },
  c14: { id: 'c14', name: '참새와 고양이', category: 'sparrow', image: require('../../assets/stickers/c14.webp') },
};

export const CATEGORY_LABEL: Record<StickerCategory, string> = { cat: '고양이', sparrow: '참새', thing: '소품', place: '장소' };

export function sticker(id: string): Sticker {
  return STICKERS[id] ?? STICKERS.a00;
}
