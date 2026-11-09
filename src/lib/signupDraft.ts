import type { LatLng } from './geo';

/** 회원가입 4단계 사이에서 입력값을 들고 다니는 임시 보관함. 뒤로 가도 값이 남는다. */
export const signupDraft: {
  provider: string;
  agreements: { age: boolean; terms: boolean; privacy: boolean; location: boolean; marketing: boolean };
  nickname: string;
  characterId: string;
  areaName: string;
  areaFromGps: boolean;
  pos: LatLng | null;
} = {
  provider: '',
  agreements: { age: false, terms: false, privacy: false, location: false, marketing: false },
  nickname: '',
  characterId: 'a02',
  areaName: '수원시 팔달구 행궁동',
  areaFromGps: false,
  pos: null,
};
