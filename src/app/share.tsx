import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, Share, Text, View } from 'react-native';
import { Icon } from '../components/Icon';
import { Button, Header, Screen, Segmented, StickerImg } from '../components/ui';
import { formatDistance } from '../lib/geo';
import { useStore } from '../lib/store';
import { C, shadow } from '../lib/theme';

export default function ShareScreen() {
  const { spot: spotId, walk: walkId } = useLocalSearchParams<{ spot?: string; walk?: string }>();
  const { s, dispatch } = useStore();
  const spot = spotId ? s.spots.find((x) => x.id === spotId) : undefined;
  const walk = walkId ? s.walks.find((x) => x.id === walkId) : undefined;
  const [vis, setVis] = useState<'all' | 'friends'>('all');
  const [done, setDone] = useState(false);

  const area = s.user?.areaName.split(' ').slice(-1)[0] ?? '우리 동네';
  const headline = spot ? spot.title : walk ? `오늘의 ${area} 산책` : `${s.user?.nickname ?? '나'}의 ${area} 지도`;
  const sub = spot
    ? spot.memo || '골목에서 발견한 장소'
    : walk
      ? `${formatDistance(walk.distanceM)} · 새 골목 ${walk.newCells}칸 · 스티커 ${walk.spotIds.length}개`
      : `기록 ${s.spots.length}곳 · 밝힌 골목 ${s.explored.length}칸`;
  const stickers = spot ? [spot.stickerId] : (walk ? s.spots.filter((x) => walk.spotIds.includes(x.id)) : s.spots).slice(0, 4).map((x) => x.stickerId);

  const toFeed = () => {
    const ids = spot ? [spot.id] : walk ? walk.spotIds : s.spots.slice(0, 3).map((x) => x.id);
    ids.forEach((id) => dispatch({ type: 'updateSpot', id, patch: { shared: true, visibility: vis } }));
    setDone(true);
  };
  const toApps = async () => {
    await Share.share({ message: `[골목대장] ${headline}\n${sub}\n\n걸은 만큼 지도가 채워지는 산책 앱, 골목대장` });
  };

  return (
    <Screen
      scroll
      footer={
        done ? (
          <Button title="⑤ 이번 주 동네 순위 보기" icon="trophy" onPress={() => router.replace('/town')} />
        ) : (
          <View style={{ gap: 8 }}>
            <Button title="골목 피드에 올리기" onPress={toFeed} />
            <Button title="카톡·인스타 등으로 보내기" variant="soft" icon="share" onPress={toApps} />
          </View>
        )
      }
    >
      <Header title="④ 기록 공유하기" />
      <View style={[{ borderRadius: 24, backgroundColor: C.white, overflow: 'hidden' }, shadow]}>
        <View style={{ height: 220, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' }}>
          {spot?.photoUri ? <Image source={{ uri: spot.photoUri }} style={{ position: 'absolute', width: '100%', height: '100%' }} /> : null}
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {(stickers.length ? stickers : [s.user?.characterId ?? 'a00']).map((id, i) => (
              <StickerImg key={`${id}-${i}`} id={id} size={stickers.length > 1 ? 72 : 120} />
            ))}
          </View>
        </View>
        <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: C.forest }}>{headline}</Text>
            <Text numberOfLines={2} style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{sub}</Text>
          </View>
          <Text style={{ fontSize: 13, fontWeight: '900', color: C.orange }}>골목대장</Text>
        </View>
      </View>

      {done ? (
        <View style={{ marginTop: 18, padding: 16, borderRadius: 18, backgroundColor: C.mint, gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="check" size={18} color={C.forest} />
            <Text style={{ fontSize: 15, fontWeight: '700', color: C.forest }}>골목 피드에 올렸어요</Text>
          </View>
          <Text style={{ fontSize: 13, color: C.ink }}>동네 사람들이 동네 탭 피드에서 볼 수 있어요.</Text>
          <Pressable onPress={() => router.replace('/town')}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: C.forest, textDecorationLine: 'underline' }}>피드에서 확인하기</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ marginTop: 18, gap: 8 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink }}>누구에게 보여줄까요?</Text>
          <Segmented value={vis} onChange={setVis} options={[{ value: 'all', label: '동네 사람 모두' }, { value: 'friends', label: '친구만' }]} />
          <Text style={{ fontSize: 12, color: C.muted }}>걸은 경로는 공유되지 않고, 스티커 장소만 보여요.</Text>
        </View>
      )}
    </Screen>
  );
}
