import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FogMap, FogMapHandle } from '../../components/FogMap';
import { Icon } from '../../components/Icon';
import { Button, StickerImg } from '../../components/ui';
import { cellsAround, distanceM, formatDistance, formatDuration, LatLng, offset } from '../../lib/geo';
import { newId, useStore } from '../../lib/store';
import { C, shadow } from '../../lib/theme';

/** 동네 채움률 계산용 가정: 동네 하나 ≈ 50m 칸 600개. */
const AREA_CELLS = 600;

export default function Walk() {
  const { s, dispatch } = useStore();
  const mapRef = useRef<FogMapHandle>(null);
  const centered = useRef(!!s.lastPos);
  const [demo, setDemo] = useState(false);
  const [perm, setPerm] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [, setTick] = useState(0);
  const walking = !!s.activeWalk;

  // 콜백 안에서 최신 상태를 보기 위한 참조
  const live = useRef({ explored: new Set(s.explored), lastPos: s.lastPos, walking, demo });
  useEffect(() => {
    live.current = { explored: new Set(s.explored), lastPos: s.lastPos, walking, demo };
  }, [s.explored, s.lastPos, walking, demo]);

  const handlePos = useCallback(
    (pos: LatLng, accuracy: number | null) => {
      if (accuracy !== null && accuracy > 50) return; // 정확도가 낮은 점은 버린다
      const { explored, lastPos, walking: w } = live.current;
      const d = lastPos ? distanceM(lastPos, pos) : 0;
      const newCells = w ? cellsAround(pos).filter((k) => !explored.has(k)) : [];
      newCells.forEach((k) => explored.add(k));
      dispatch({ type: 'move', pos, addDistance: d < 150 ? d : 0, newCells, record: w });
      if (w) mapRef.current?.flyTo(pos);
      else if (!centered.current) {
        centered.current = true;
        mapRef.current?.flyTo(pos, 16);
      }
    },
    [dispatch],
  );

  // 화면이 보일 때만 GPS를 듣는다(Expo Go는 앱이 켜져 있을 때만 위치를 받는다).
  useFocusEffect(
    useCallback(() => {
      let sub: Location.LocationSubscription | null = null;
      let cancelled = false;
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (cancelled) return;
        setPerm(status === 'granted' ? 'granted' : 'denied');
        if (status !== 'granted') return;
        sub = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 5, timeInterval: 3000 },
          (loc) => {
            if (live.current.demo) return;
            handlePos({ latitude: loc.coords.latitude, longitude: loc.coords.longitude }, loc.coords.accuracy ?? null);
          },
        );
        if (cancelled) sub.remove();
      })();
      return () => {
        cancelled = true;
        sub?.remove();
      };
    }, [handlePos]),
  );

  // 데모 걷기: 실제로 걷지 않아도 1초마다 12m씩 골목을 돌아다닌다.
  const heading = useRef(Math.random() * 360);
  useEffect(() => {
    if (!demo || !walking) return;
    const t = setInterval(() => {
      const from = live.current.lastPos ?? s.home ?? { latitude: 37.2836, longitude: 127.0152 };
      heading.current += (Math.random() - 0.5) * 70;
      const rad = (heading.current * Math.PI) / 180;
      handlePos(offset(from, Math.cos(rad) * 12, Math.sin(rad) * 12), 5);
    }, 1000);
    return () => clearInterval(t);
  }, [demo, walking, handlePos, s.home]);

  // 산책 중에는 시간 표시를 1초마다 갱신
  useEffect(() => {
    if (!walking) return;
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, [walking]);

  const start = () => {
    if (perm === 'denied' && !demo) {
      Alert.alert('위치 권한이 필요해요', '설정에서 위치 권한을 허용하거나, 데모 걷기로 체험해 보세요.', [
        { text: '데모 걷기로 시작', onPress: () => { setDemo(true); dispatch({ type: 'startWalk', id: newId('walk'), at: Date.now() }); } },
        { text: '닫기', style: 'cancel' },
      ]);
      return;
    }
    dispatch({ type: 'startWalk', id: newId('walk'), at: Date.now() });
    if (s.lastPos) handlePos(s.lastPos, null);
  };

  const end = () => {
    const id = s.activeWalk?.id;
    dispatch({ type: 'endWalk', at: Date.now() });
    setDemo(false);
    if (id) router.push({ pathname: '/walk-summary', params: { id } });
  };

  const recenter = () => {
    if (s.lastPos) mapRef.current?.flyTo(s.lastPos, 16);
  };

  const fill = Math.min(100, Math.round((s.explored.length / AREA_CELLS) * 100));
  const w = s.activeWalk;
  const walkSpots = w ? s.spots.filter((x) => w.spotIds.includes(x.id)).length : 0;

  return (
    <View style={{ flex: 1, backgroundColor: C.cream }}>
      <FogMap
        ref={mapRef}
        explored={s.explored}
        spots={s.spots}
        path={w?.path}
        initial={s.lastPos ?? s.home}
        user={!demo ? s.lastPos : null}
        me={demo && s.lastPos ? { pos: s.lastPos, characterId: s.user?.characterId ?? 'a00' } : null}
      />

      <SafeAreaView edges={['top']} style={{ position: 'absolute', left: 0, right: 0, top: 0, paddingHorizontal: 16, gap: 10 }} pointerEvents="box-none">
        <View style={[{ height: 52, borderRadius: 18, backgroundColor: C.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }, shadow]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 21, fontWeight: '900', color: C.forest }}>골목대장</Text>
            <Icon name="paw" size={16} color={C.orange} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, maxWidth: '55%' }}>
            <Icon name="pin" size={16} color={C.forest} />
            <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '500', color: C.ink }}>{s.user?.areaName.split(' ').slice(-1)[0] ?? '내 동네'}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }} pointerEvents="box-none">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16, backgroundColor: C.forest }}>
            <Icon name="walk" size={14} color={C.white} />
            <Text style={{ fontSize: 12, fontWeight: '500', color: C.white }}>{walking ? (demo ? '데모 걷기 중' : '걸을수록 지도가 채워져요') : '산책을 시작하면 기록돼요'}</Text>
          </View>
          <View style={{ gap: 8 }}>
            <Pressable accessibilityLabel="현재 위치로" onPress={recenter} style={[{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' }, shadow]}>
              <Icon name="locate" size={20} />
            </Pressable>
            {walking ? (
              <Pressable
                accessibilityLabel="데모 걷기 켜고 끄기"
                onPress={() => setDemo(!demo)}
                style={[{ width: 44, height: 44, borderRadius: 22, backgroundColor: demo ? C.orange : C.white, alignItems: 'center', justifyContent: 'center' }, shadow]}
              >
                <Icon name="sparkle" size={20} color={demo ? C.white : C.ink} />
              </Pressable>
            ) : null}
          </View>
        </View>
      </SafeAreaView>

      <View style={[{ position: 'absolute', left: 16, right: 16, bottom: 16, borderRadius: 22, backgroundColor: C.white, padding: 18, gap: 12 }, shadow]}>
        {!walking ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <StickerImg id={s.user?.characterId ?? 'a00'} size={52} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: C.leafText, fontWeight: '700' }}>① 산책 시작</Text>
                <Text style={{ fontSize: 17, fontWeight: '800', color: C.ink }}>{s.user?.nickname ?? '골목냥이'}님, 오늘은 어느 골목으로 갈까요?</Text>
              </View>
            </View>
            <View style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink }}>내가 밝힌 동네</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.forest }}>{fill}%</Text>
              </View>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: C.lineSoft }}>
                <View style={{ width: `${Math.max(fill, 2)}%`, height: 8, borderRadius: 4, backgroundColor: C.leaf }} />
              </View>
              <Text style={{ fontSize: 12, color: C.muted }}>오늘의 미션: 새 골목 밝히고 스티커 1개 붙이기</Text>
            </View>
            <Button title="산책 시작" icon="walk" onPress={start} />
            {perm === 'denied' ? <Text style={{ fontSize: 12, color: C.danger }}>위치 권한이 꺼져 있어요. 데모 걷기로도 체험할 수 있어요.</Text> : null}
          </>
        ) : (
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontSize: 12, color: C.leafText, fontWeight: '700' }}>② 산책 중 · {formatDuration(Date.now() - (w?.startedAt ?? Date.now()))}</Text>
                <Text style={{ fontSize: 26, fontWeight: '800', color: C.forest }}>{formatDistance(w?.distanceM ?? 0)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12, color: C.muted }}>새로 밝힌 칸 · 스티커</Text>
                <Text style={{ fontSize: 18, fontWeight: '800', color: C.ink }}>{w?.newCells ?? 0}칸 · {walkSpots}개</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button title="여기에 스티커" icon="plus" onPress={() => router.push('/record')} style={{ flex: 1.4 }} />
              <Button title="종료" icon="stop" variant="outline" onPress={end} style={{ flex: 1 }} />
            </View>
            {!s.lastPos && !demo ? <Text style={{ fontSize: 12, color: C.muted }}>위치를 찾는 중이에요… 실내라면 오른쪽 위 반짝이 버튼으로 데모 걷기를 켜 보세요.</Text> : null}
          </>
        )}
      </View>
    </View>
  );
}
