import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { STARTER } from './content';
import type { LatLng } from './geo';

export type User = {
  nickname: string;
  characterId: string;
  areaName: string;
  marketing: boolean;
  joinedAt: number;
};

export type Spot = {
  id: string;
  latitude: number;
  longitude: number;
  stickerId: string;
  title: string;
  memo: string;
  photoUri?: string;
  createdAt: number;
  walkId?: string;
  visibility: 'all' | 'friends' | 'me';
  shared?: boolean;
};

export type Walk = {
  id: string;
  startedAt: number;
  endedAt?: number;
  distanceM: number;
  newCells: number;
  path: LatLng[];
  spotIds: string[];
};

export type Coupon = { id: string; storeId: string; title: string; issuedAt: number; usedAt?: number };

export type State = {
  hydrated: boolean;
  user: User | null;
  explored: string[];
  walks: Walk[];
  activeWalk: Walk | null;
  lastPos: LatLng | null;
  home: LatLng | null;
  spots: Spot[];
  owned: string[];
  stamps: string[];
  coupons: Coupon[];
  visitedStores: string[];
  claimedRewards: string[];
};

const initial: State = {
  hydrated: false,
  user: null,
  explored: [],
  walks: [],
  activeWalk: null,
  lastPos: null,
  home: null,
  spots: [],
  owned: STARTER,
  stamps: [],
  coupons: [],
  visitedStores: [],
  claimedRewards: [],
};

type Action =
  | { type: 'hydrate'; state: Partial<State> }
  | { type: 'signup'; user: User; gift: string[] }
  | { type: 'startWalk'; id: string; at: number }
  | { type: 'move'; pos: LatLng; addDistance: number; newCells: string[]; record: boolean }
  | { type: 'endWalk'; at: number }
  | { type: 'addSpot'; spot: Spot }
  | { type: 'updateSpot'; id: string; patch: Partial<Spot> }
  | { type: 'deleteSpot'; id: string }
  | { type: 'own'; stickers: string[] }
  | { type: 'stamp'; spotId: string }
  | { type: 'reward'; rewardId: string; stickers: string[]; coupon?: Coupon }
  | { type: 'visitStore'; storeId: string; sticker: string; coupon: Coupon }
  | { type: 'useCoupon'; id: string; at: number }
  | { type: 'reset' };

function uniq(a: string[]) {
  return Array.from(new Set(a));
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'hydrate':
      return { ...s, ...a.state, hydrated: true };
    case 'signup':
      return { ...s, user: a.user, owned: uniq([...s.owned, ...a.gift]) };
    case 'startWalk':
      return { ...s, activeWalk: { id: a.id, startedAt: a.at, distanceM: 0, newCells: 0, path: [], spotIds: [] } };
    case 'move': {
      const explored = a.newCells.length ? [...s.explored, ...a.newCells] : s.explored;
      const home = s.home ?? a.pos;
      if (!s.activeWalk || !a.record) return { ...s, lastPos: a.pos, home, explored };
      const w = s.activeWalk;
      return {
        ...s,
        lastPos: a.pos,
        home,
        explored,
        activeWalk: { ...w, distanceM: w.distanceM + a.addDistance, newCells: w.newCells + a.newCells.length, path: [...w.path, a.pos] },
      };
    }
    case 'endWalk':
      if (!s.activeWalk) return s;
      return { ...s, walks: [{ ...s.activeWalk, endedAt: a.at }, ...s.walks], activeWalk: null };
    case 'addSpot': {
      const activeWalk = s.activeWalk ? { ...s.activeWalk, spotIds: [...s.activeWalk.spotIds, a.spot.id] } : null;
      return { ...s, spots: [a.spot, ...s.spots], activeWalk };
    }
    case 'updateSpot':
      return { ...s, spots: s.spots.map((x) => (x.id === a.id ? { ...x, ...a.patch } : x)) };
    case 'deleteSpot':
      return { ...s, spots: s.spots.filter((x) => x.id !== a.id) };
    case 'own':
      return { ...s, owned: uniq([...s.owned, ...a.stickers]) };
    case 'stamp':
      return { ...s, stamps: uniq([...s.stamps, a.spotId]) };
    case 'reward':
      return {
        ...s,
        claimedRewards: uniq([...s.claimedRewards, a.rewardId]),
        owned: uniq([...s.owned, ...a.stickers]),
        coupons: a.coupon ? [a.coupon, ...s.coupons] : s.coupons,
      };
    case 'visitStore':
      return {
        ...s,
        visitedStores: uniq([...s.visitedStores, a.storeId]),
        owned: uniq([...s.owned, a.sticker]),
        coupons: [a.coupon, ...s.coupons],
      };
    case 'useCoupon':
      return { ...s, coupons: s.coupons.map((c) => (c.id === a.id ? { ...c, usedAt: a.at } : c)) };
    case 'reset':
      return { ...initial, hydrated: true };
  }
}

const KEY = 'golmok:v1';
const Ctx = createContext<{ s: State; dispatch: React.Dispatch<Action> } | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [s, dispatch] = useReducer(reducer, initial);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => dispatch({ type: 'hydrate', state: raw ? (JSON.parse(raw) as Partial<State>) : {} }))
      .catch(() => dispatch({ type: 'hydrate', state: {} }));
  }, []);

  useEffect(() => {
    if (!s.hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const { hydrated, ...rest } = s;
      AsyncStorage.setItem(KEY, JSON.stringify(rest)).catch(() => {});
    }, 400);
  }, [s]);

  const value = useMemo(() => ({ s, dispatch }), [s]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('StoreProvider missing');
  return v;
}

export function newId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

/** 시안·명세에 맞춘 순위 계산용: 이번 주 내가 밝힌 칸 수. */
export function myWeeklyCells(s: State) {
  const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
  const fromWalks = s.walks.filter((w) => w.startedAt >= weekAgo).reduce((n, w) => n + w.newCells, 0);
  return fromWalks + (s.activeWalk?.newCells ?? 0);
}
