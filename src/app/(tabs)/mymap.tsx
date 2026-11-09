import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FogMap } from '../../components/FogMap';
import { Icon } from '../../components/Icon';
import { Button, Segmented, StickerImg } from '../../components/ui';
import { formatDistance } from '../../lib/geo';
import { useStore } from '../../lib/store';
import { C, shadow } from '../../lib/theme';

export default function MyMap() {
  const { s } = useStore();
  const [view, setView] = useState<'map' | 'list'>('map');
  const totalDist = s.walks.reduce((n, w) => n + w.distanceM, 0);
  const days = new Set(s.walks.map((w) => new Date(w.startedAt).toDateString())).size;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }} edges={['top']}>
      <View style={{ paddingHorizontal: 20, gap: 12, flex: 1, paddingBottom: 12 }}>
        <View style={{ height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 26, fontWeight: '900', color: C.forest }}>내 지도</Text>
          <Pressable accessibilityLabel="설정" hitSlop={10} onPress={() => router.push('/settings')}>
            <Icon name="gear" />
          </Pressable>
        </View>
        <Segmented value={view} onChange={setView} options={[{ value: 'map', label: '지도로 보기' }, { value: 'list', label: `기록 ${s.spots.length}개` }]} />

        {view === 'map' ? (
          <View style={[{ flex: 1, borderRadius: 24, overflow: 'hidden' }, shadow]}>
            <FogMap explored={s.explored} spots={s.spots} initial={s.spots[0] ?? s.lastPos ?? s.home} />
          </View>
        ) : (
          <FlatList
            style={{ flex: 1 }}
            data={s.spots}
            keyExtractor={(x) => x.id}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            ListEmptyComponent={<Text style={{ color: C.muted, marginTop: 20, textAlign: 'center' }}>아직 기록이 없어요. 산책하면서 스티커를 붙여 보세요!</Text>}
            renderItem={({ item }) => (
              <Pressable onPress={() => router.push(`/spot/${item.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, backgroundColor: C.white }}>
                <StickerImg id={item.stickerId} size={48} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{item.title}</Text>
                  <Text style={{ fontSize: 12, color: C.muted }}>{new Date(item.createdAt).toLocaleDateString('ko-KR')} · {item.visibility === 'me' ? '나만' : item.visibility === 'friends' ? '친구' : '동네 모두'}{item.shared ? ' · 피드 공유됨' : ''}</Text>
                </View>
                <Icon name="chevron" size={18} color={C.muted} />
              </Pressable>
            )}
          />
        )}

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[
            { v: `${s.spots.length}`, l: '기록한 장소' },
            { v: formatDistance(totalDist), l: '걸은 거리' },
            { v: `${days}일`, l: '탐험한 날' },
          ].map((x) => (
            <View key={x.l} style={{ flex: 1, paddingVertical: 12, borderRadius: 18, backgroundColor: C.white, alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: C.forest }}>{x.v}</Text>
              <Text style={{ fontSize: 12, color: C.muted }}>{x.l}</Text>
            </View>
          ))}
        </View>
        <Button title="④ 내 지도 공유하기" icon="share" onPress={() => router.push('/share')} />
      </View>
    </SafeAreaView>
  );
}
