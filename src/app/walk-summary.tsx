import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { FogMap } from '../components/FogMap';
import { Button, Header, Screen, StickerImg } from '../components/ui';
import { formatDistance, formatDuration } from '../lib/geo';
import { useStore } from '../lib/store';
import { C, shadow } from '../lib/theme';

export default function WalkSummary() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { s } = useStore();
  const w = s.walks.find((x) => x.id === id) ?? s.walks[0];
  if (!w) return null;
  const spots = s.spots.filter((x) => w.spotIds.includes(x.id));
  const mid = w.path[Math.floor(w.path.length / 2)] ?? s.lastPos;

  return (
    <Screen
      scroll
      footer={
        <View style={{ gap: 8 }}>
          <Button title="내 지도에 저장하고 보기" onPress={() => router.replace('/mymap')} />
          <Button title="이 산책 공유하기" variant="soft" icon="share" onPress={() => router.push({ pathname: '/share', params: { walk: w.id } })} />
        </View>
      }
    >
      <Header title="③ 오늘의 산책" onBack={() => router.replace('/walk')} />
      <View style={[{ height: 220, borderRadius: 22, overflow: 'hidden', marginTop: 4 }, shadow]}>
        <FogMap explored={s.explored} spots={spots} path={w.path} initial={mid} fitPath />
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
        {[
          { v: formatDistance(w.distanceM), l: '걸은 거리' },
          { v: formatDuration((w.endedAt ?? Date.now()) - w.startedAt), l: '걸은 시간' },
          { v: `${w.newCells}칸`, l: '새로 밝힌 골목' },
        ].map((x) => (
          <View key={x.l} style={{ flex: 1, paddingVertical: 14, borderRadius: 18, backgroundColor: C.white, alignItems: 'center', gap: 2 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: C.forest }}>{x.v}</Text>
            <Text style={{ fontSize: 12, color: C.muted }}>{x.l}</Text>
          </View>
        ))}
      </View>
      <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink, marginTop: 18, marginBottom: 8 }}>붙인 스티커 {spots.length}개</Text>
      {spots.length === 0 ? (
        <Text style={{ fontSize: 13, color: C.muted }}>이번 산책에서는 스티커를 붙이지 않았어요. 다음엔 발견한 곳에 붙여 보세요!</Text>
      ) : (
        <View style={{ gap: 8 }}>
          {spots.map((x) => (
            <Pressable key={x.id} onPress={() => router.push(`/spot/${x.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, backgroundColor: C.white }}>
              <StickerImg id={x.stickerId} size={44} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{x.title}</Text>
                {x.memo ? <Text numberOfLines={1} style={{ fontSize: 12, color: C.muted }}>{x.memo}</Text> : null}
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}
