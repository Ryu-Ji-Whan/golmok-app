import { router } from 'expo-router';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { DEFAULT_CENTER, LatLng } from '../lib/geo';
import { buildMapHtml } from '../lib/mapHtml';
import { STICKER_THUMBS } from '../lib/stickerThumbs';
import type { Spot } from '../lib/store';
import { C } from '../lib/theme';

/**
 * 안개 지도. 지도는 WebView 안의 Leaflet + OpenStreetMap(CARTO) 타일로 그린다.
 * Google·Apple 지도 키가 필요 없어서 Expo Go, Android APK, iPhone 설치본에서 똑같이 동작한다.
 */
export type FogMapHandle = {
  /** 지도를 pos로 옮긴다. zoom을 안 주면 지금 확대 수준을 유지한다. (16 ≈ 동네, 17 ≈ 골목) */
  flyTo: (pos: LatLng, zoom?: number) => void;
};

type Props = {
  explored: string[];
  spots: Spot[];
  path?: LatLng[];
  /** 처음 열릴 때 지도 중심 (이후 바뀌어도 지도를 옮기지 않는다 → flyTo 사용) */
  initial?: LatLng | null;
  /** 파란 점으로 보이는 현재 위치 */
  user?: LatLng | null;
  /** 내 캐릭터 마커 (데모 걷기 중) */
  me?: { pos: LatLng; characterId: string } | null;
  extraMarkers?: { id: string; pos: LatLng; stickerId: string; done?: boolean; onPress?: () => void }[];
  /** path 전체가 보이게 맞춘다 (산책 요약) */
  fitPath?: boolean;
  style?: StyleProp<ViewStyle>;
  fog?: boolean;
};

const ll = (p: LatLng) => ({ lat: p.latitude, lng: p.longitude });

export const FogMap = forwardRef<FogMapHandle, Props>(function FogMap(
  { explored, spots, path, initial, user, me, extraMarkers = [], fitPath = false, style, fog = true },
  ref,
) {
  const web = useRef<WebView>(null);
  const [ready, setReady] = useState(false);
  const sentIcons = useRef(new Set<string>());
  const extrasRef = useRef(extraMarkers);
  extrasRef.current = extraMarkers;

  // HTML은 처음 한 번만 만든다 (다시 만들면 지도가 새로 로딩된다).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const html = useMemo(() => buildMapHtml(initial ?? DEFAULT_CENTER), []);

  const run = useCallback((js: string) => web.current?.injectJavaScript(`${js};true;`), []);

  useImperativeHandle(ref, () => ({ flyTo: (pos, zoom) => run(`window.__fly(${pos.latitude},${pos.longitude},${zoom ?? 'null'})`) }), [run]);

  const exploredJson = useMemo(() => JSON.stringify(explored), [explored]);
  const state = {
    spots: spots.map((x) => ({ id: x.id, ...ll(x), icon: x.stickerId })),
    extras: extraMarkers.map((m) => ({ id: m.id, ...ll(m.pos), icon: m.stickerId, done: !!m.done })),
    me: me ? { ...ll(me.pos), icon: me.characterId } : null,
    user: user ? ll(user) : null,
    path: (path ?? []).map((p) => [p.latitude, p.longitude]),
  };
  const stateJson = JSON.stringify(state);

  useEffect(() => {
    if (ready) run(`window.__explored(${exploredJson}, ${fog})`);
  }, [ready, exploredJson, fog, run]);

  useEffect(() => {
    if (!ready) return;
    const ids = new Set<string>([...state.spots.map((x) => x.icon), ...state.extras.map((x) => x.icon), ...(state.me ? [state.me.icon] : [])]);
    const missing: Record<string, string> = {};
    ids.forEach((id) => {
      if (!sentIcons.current.has(id)) {
        missing[id] = STICKER_THUMBS[id] ?? STICKER_THUMBS.a00;
        sentIcons.current.add(id);
      }
    });
    if (Object.keys(missing).length) run(`window.__icons(${JSON.stringify(missing)})`);
    run(`window.__set(${stateJson})`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, stateJson, run]);

  useEffect(() => {
    if (ready && fitPath && path && path.length > 1) run(`window.__fit(${JSON.stringify(path.map((p) => [p.latitude, p.longitude]))})`);
  }, [ready, fitPath, path, run]);

  const onMessage = (e: WebViewMessageEvent) => {
    let msg: { type: string; id?: string; msg?: string };
    try {
      msg = JSON.parse(e.nativeEvent.data);
    } catch {
      return;
    }
    if (msg.type === 'ready') {
      sentIcons.current.clear();
      setReady(false); // 새로 로딩된 경우에도 아래에서 다시 전부 보내도록
      setTimeout(() => setReady(true), 0);
    } else if (msg.type === 'spot' && msg.id) {
      router.push(`/spot/${msg.id}`);
    } else if (msg.type === 'extra' && msg.id) {
      extrasRef.current.find((m) => m.id === msg.id)?.onPress?.();
    } else if (msg.type === 'log' && __DEV__) {
      console.warn('[map]', msg.msg);
    }
  };

  return (
    <View style={[{ flex: 1, backgroundColor: C.cream }, style]}>
      <WebView
        ref={web}
        source={{ html, baseUrl: 'https://golmok.app/' }}
        originWhitelist={['*']}
        onMessage={onMessage}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        nestedScrollEnabled
        setBuiltInZoomControls={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: C.cream }}
        webviewDebuggingEnabled={__DEV__}
      />
    </View>
  );
});
