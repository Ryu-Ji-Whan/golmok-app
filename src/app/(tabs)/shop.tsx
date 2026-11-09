import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../../components/Icon';
import { Button, StickerImg } from '../../components/ui';
import { CAMPAIGN, PACKS } from '../../lib/content';
import { STICKERS } from '../../lib/stickers';
import { useStore } from '../../lib/store';
import { C, shadow } from '../../lib/theme';

export default function Shop() {
  const { s, dispatch } = useStore();
  const totalStickers = Object.keys(STICKERS).length;

  const buy = (packId: string) => {
    const pack = PACKS.find((p) => p.id === packId)!;
    Alert.alert(`${pack.name} 받기`, '데모 버전이라 실제 결제 없이 바로 보관함에 들어가요.', [
      { text: '취소', style: 'cancel' },
      { text: '받기', onPress: () => dispatch({ type: 'own', stickers: pack.stickers }) },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 12, fontWeight: '700', color: C.leafText }}>⑥ 스티커 상점</Text>
            <Text style={{ fontSize: 26, fontWeight: '900', color: C.forest }}>골목 스티커 가게</Text>
          </View>
          <Text style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, backgroundColor: C.white, borderWidth: 1, borderColor: C.line, fontSize: 12, color: C.ink }}>보관함 {s.owned.length}/{totalStickers}</Text>
        </View>

        <Pressable onPress={() => router.push('/campaign')} style={{ padding: 16, borderRadius: 20, backgroundColor: C.forest, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ fontSize: 11, color: '#D4EBDD' }}>⑦ 기관 이벤트 · {CAMPAIGN.organizer}</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: C.white }}>{CAMPAIGN.title}</Text>
            <Text style={{ fontSize: 12, color: '#D4EBDD' }}>도장 {s.stamps.length}/{CAMPAIGN.spots.length} · 완주하면 한정 스티커</Text>
          </View>
          <StickerImg id="c13" size={64} />
        </Pressable>
        <Pressable onPress={() => router.push('/stores')} style={{ padding: 14, borderRadius: 16, backgroundColor: C.peach, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <StickerImg id="b00" size={40} />
          <Text style={{ flex: 1, fontSize: 13, color: C.ink }}>
            <Text style={{ fontWeight: '700' }}>⑦ 제휴 가게 이벤트</Text> · 방문하면 가게 스티커와 쿠폰
          </Text>
          <Icon name="chevron" size={16} color={C.orangeText} />
        </Pressable>

        <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink, marginTop: 4 }}>스티커 팩</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {PACKS.filter((p) => p.kind !== 'welcome').map((p) => {
            const ownedAll = p.stickers.every((id) => s.owned.includes(id));
            const locked = p.kind === 'reward' && !ownedAll;
            return (
              <View key={p.id} style={[{ width: '48%', padding: 10, borderRadius: 18, backgroundColor: C.white, gap: 6 }, shadow]}>
                <View style={{ height: 84, borderRadius: 12, backgroundColor: locked ? C.sand : C.cream, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  {p.stickers.slice(0, 3).map((id) => (
                    <StickerImg key={id} id={id} size={40} dim={locked} />
                  ))}
                  {locked ? (
                    <View style={{ position: 'absolute', right: 8, top: 8, width: 24, height: 24, borderRadius: 12, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="lock" size={13} color={C.white} />
                    </View>
                  ) : null}
                </View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{p.name}</Text>
                <Text style={{ fontSize: 11, color: C.muted }}>{p.howToGet ?? p.desc}</Text>
                {ownedAll ? (
                  <Button title="보유 중" small variant="soft" disabled={false} onPress={() => {}} />
                ) : p.kind === 'paid' ? (
                  <Button title={`${p.priceLabel} 구매`} small onPress={() => buy(p.id)} />
                ) : (
                  <Button title="조건 보기" small variant="outline" onPress={() => router.push(p.id === 'leader' ? '/town' : '/campaign')} />
                )}
              </View>
            );
          })}
        </View>
        <Text style={{ fontSize: 12, color: C.muted }}>가격은 아직 정하지 않았어요. 데모에서는 결제 없이 받아져요.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
