// 데모용 고정 데이터. 서버가 생기면 API 응답으로 바뀌는 부분이다.

export const CHARACTERS = [
  { id: 'a02', name: '빼꼼 고양이' },
  { id: 'a00', name: '산책 고양이' },
  { id: 'a04', name: '응원 고양이' },
  { id: 'a21', name: '낮잠 고양이' },
  { id: 'c01', name: '골목 참새' },
  { id: 'c13', name: '깃발 참새' },
];

export type Pack = {
  id: string;
  name: string;
  desc: string;
  stickers: string[];
  kind: 'starter' | 'welcome' | 'paid' | 'reward';
  priceLabel?: string;
  howToGet?: string;
};

export const PACKS: Pack[] = [
  { id: 'starter', name: '기본 팩', desc: '처음부터 가진 스티커', kind: 'starter', stickers: ['a00', 'a01', 'a02', 'a04', 'a21', 'c01', 'a11', 'a13', 'a14', 'a15', 'a18', 'a19'] },
  { id: 'welcome', name: '환영 팩', desc: '가입 선물', kind: 'welcome', stickers: ['c13', 'a20', 'a17'] },
  { id: 'autumn', name: '가을 골목 팩', desc: '스티커 8종', kind: 'paid', priceLabel: '[가격]', stickers: ['a12', 'b04', 'b05', 'b06', 'b07', 'b08', 'b09', 'b10'] },
  { id: 'sparrow', name: '참새 친구 팩', desc: '스티커 6종', kind: 'paid', priceLabel: '[가격]', stickers: ['a05', 'a06', 'a07', 'a08', 'a09', 'a10'] },
  { id: 'cats', name: '골목 고양이 팩', desc: '스티커 4종', kind: 'paid', priceLabel: '[가격]', stickers: ['a03', 'c02', 'c03', 'c05'] },
  { id: 'leader', name: '동네 대장 한정', desc: '리더보드 3위 안 보상', kind: 'reward', howToGet: '동네 리더보드 3위 안에 들기', stickers: ['b11', 'b12'] },
  { id: 'campaign', name: '스탬프 투어 한정', desc: '캠페인 완주 보상', kind: 'reward', howToGet: '동네 스탬프 투어 5곳 완주', stickers: ['c14', 'c04'] },
];

export const STARTER = PACKS[0].stickers;
export const WELCOME = PACKS[1].stickers;

export const AREAS = [
  '수원시 팔달구 행궁동', '수원시 팔달구 매향동', '수원시 팔달구 신풍동', '수원시 팔달구 남창동', '수원시 장안구 장안동',
  '서울특별시 종로구 익선동', '서울특별시 종로구 서촌', '서울특별시 마포구 연남동', '서울특별시 성동구 성수동', '서울특별시 용산구 해방촌',
];

export const TAKEN_NICKNAMES = ['골목대장', '관리자', '운영자', '행궁산책러', 'admin'];

/** 리더보드 예시 이웃(점수 = 이번 주 밝힌 칸 수). */
export const NEIGHBORS = [
  { name: '행궁산책러', character: 'a04', cells: 96 },
  { name: '참새방앗간', character: 'c01', cells: 74 },
  { name: '수원천냥', character: 'a00', cells: 52 },
  { name: '깃발참새', character: 'c13', cells: 31 },
  { name: '낮잠고양이', character: 'a21', cells: 18 },
];

export const FEED = [
  { id: 'f1', author: '참새방앗간', character: 'c01', area: '행궁동', ago: '1시간 전', sticker: 'a18', title: '해 질 녘 벤치', body: '여기 앉아 있으면 노란 고양이가 와요.', likes: 128, comments: 12 },
  { id: 'f2', author: '책방참새', character: 'c13', area: '매향동', ago: '어제', sticker: 'b02', title: '골목 끝 작은 책방', body: '창가 자리는 고양이 차지.', likes: 64, comments: 5 },
  { id: 'f3', author: '수원천냥', character: 'a00', area: '행궁동', ago: '2일 전', sticker: 'a11', title: '담장 위 능소화', body: '이번 주까지가 제일 예뻐요.', likes: 41, comments: 3 },
];

/** 집(처음 위치) 기준으로 놓는 데모 캠페인 스팟. 북쪽·동쪽 미터. */
export const CAMPAIGN = {
  id: 'autumn-tour',
  title: '가을 골목 스탬프 투어',
  organizer: 'OO구청 × 골목대장 (데모)',
  period: '데모 기간',
  radiusM: 40,
  reward: '스탬프 투어 한정 스티커 + 동네 가게 쿠폰',
  spots: [
    { id: 's1', name: '느티나무 쉼터', north: 120, east: 80 },
    { id: 's2', name: '벽화 골목 계단', north: -150, east: 200 },
    { id: 's3', name: '고양이 벤치', north: 250, east: -100 },
    { id: 's4', name: '징검다리', north: -80, east: -220 },
    { id: 's5', name: '노을 언덕', north: 320, east: 260 },
  ],
};

export const STORES = [
  { id: 'cafe', name: '골목 끝 카페', category: '카페', sticker: 'b00', north: 60, east: 140, benefit: '방문 인증 시 음료 할인 쿠폰 (데모)', isNew: false },
  { id: 'books', name: '작은 골목 책방', category: '책방', sticker: 'b02', north: -110, east: 60, benefit: '책 구매 시 한정 책갈피 (데모)', isNew: true },
  { id: 'flower', name: '들꽃 한 다발', category: '꽃집', sticker: 'b03', north: 180, east: -150, benefit: '꽃 한 송이 덤 (데모)', isNew: false },
  { id: 'bakery', name: '아침 빵집', category: '빵집', sticker: 'b01', north: -200, east: -60, benefit: '오전 방문 시 빵 1개 덤 (데모)', isNew: true },
];
