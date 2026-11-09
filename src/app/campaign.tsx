import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { FogMap, FogMapHandle } from '../components/FogMap';
import { Icon } from '../components/Icon';
import { Button, Header, Screen, StickerImg } from '../components/ui';
import { CAMPAIGN, PACKS } from '../lib/content';
import { DEFAULT_CENTER, LatLng, distanceM, formatDistance, offset } from '../lib/geo';
import { newId, useStore } from '../lib/store';
import { C, shadow } from '../lib/theme';

export default function Campaign() {
  const { s, dispatch } = useStore();
  const map = useRef<FogMapHandle>(null);
  const [pos, setPos] = useState<LatLng | null>(s.lastPos);
  const [ignoreDistance, setIgnoreDistance] = useState(false);
  const anchor = s.home ?? s.lastPos ?? DEFAULT_CENTER;
  const reward = PACKS.find((p) => p.id === 'campaign')!;
  const claimed = s.claimedRewards.includes(CAMPAIGN.id);

  const spots = useMemo(
    () => CAMPAIGN.spots.map((x) => ({ ...x, pos: offset(anchor, x.north, x.east) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [anchor.latitude, anchor.longitude],
  );

  useFocusEffect(
    useCallback(() => {
      let sub: Location.LocationSubscription | null = null;
      let alive = true;
      (async () => {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted' || !alive) return;
        sub = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, distanceInterval: 5, timeInterval: 3000 }, (l) =>
          setPos({ latitude: l.coords.latitude, longitude: l.coords.longitude }),
        );
      })().catch(() => {});
      return () => {
        alive = false;
        sub?.remove();
      };
    }, []),
  );

  const done = s.stamps.filter((id) => CAMPAIGN.spots.some((x) => x.id === id)).length;
  const total = CAMPAIGN.spots.length;

  const stamp = (id: string, name: string) => {
    dispatch({ type: 'stamp', spotId: id });
    const after = new Set([...s.stamps, id]);
    const finished = CAMPAIGN.spots.every((x) => after.has(x.id));
    Alert.alert('도장 꾹!', finished ? `${name} 도장까지 모두 모았어요! 아래에서 완주 보상을 받으세요.` : `${name} 도장을 찍었어요.`);
  };

  const claim = () => {
    dispatch({
      type: 'reward',
      rewardId: CAMPAIGN.id,
      stickers: reward.stickers,
      coupon: { id: newId('cp'), storeId: 'campaign', title: '스탬프 투어 완주 · 동네 가게 할인 쿠폰 (데모)', issuedAt: Date.now() },
    });
    Alert.alert('완주 보상', '한정 스티커 2종과 쿠폰을 받았어요. 상점 · 내 쿠폰에서 확인할 수 있어요.');
  };

  return (
    <Screen
      footer={
        done === total && !claimed ? (
          <Button title="완주 보상 받기" icon="gift" onPress={claim} />
        ) : claimed ? (
          <Button title="제휴 가게 이벤트도 보기" variant="soft" onPress={() => router.replace('/stores')} />
        ) : undefined
      }
    >
      <Header title="⑦ 기관 이벤트" />
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 12 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 16, borderRadius: 20, backgroundColor: C.forest, gap: 4 }}>
          <Text style={{ fontSize: 11, color: '#D4EBDD' }}>{CAMPAIGN.organizer}</Text>
          <Text style={{ fontSize: 20, fontWeight: '900', color: C.white }}>{CAMPAIGN.title}</Text>
          <Text style={{ fontSize: 12, color: '#D4EBDD' }}>스팟 {CAMPAIGN.radiusM}m 안에 들어가면 도장을 찍을 수 있어요 · 보상: {CAMPAIGN.reward}</Text>
          <View style={{ marginTop: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.22)' }}>
            <View style={{ width: `${(done / total) * 100}%`, height: 8, borderRadius: 4, backgroundColor: C.orange }} />
          </View>
          <Text style={{ fontSize: 13, fontWeight: '700', color: C.white }}>도장 {done}/{total}</Text>
        </View>

        <View style={[{ height: 220, borderRadius: 20, overflow: 'hidden' }, shadow]}>
          <FogMap
            ref={map}
            explored={s.explored}
            spots={[]}
            fog={false}
            initial={offset(anchor, 80, 20)}
            style={{ flex: 1 }}
            extraMarkers={spots.map((x) => ({ id: x.id, pos: x.pos, stickerId: s.stamps.includes(x.id) ? 'c14' : 'c13', done: s.stamps.includes(x.id) }))}
            user={pos}
          />
        </View>

        {spots.map((x) => {
          const d = pos ? distanceM(pos, x.pos) : null;
          const got = s.stamps.includes(x.id);
          const near = d !== null && d <= CAMPAIGN.radiusM;
          const can = !got && (near || ignoreDistance);
          return (
            <Pressable
              key={x.id}
              onPress={() => map.current?.flyTo(x.pos, 17)}
              style={{ padding: 12, borderRadius: 16, backgroundColor: got ? C.mint : C.white, flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: got ? C.forest : C.sand, alignItems: 'center', justifyContent: 'center' }}>
                {got ? <Icon name="check" size={20} color={C.white} /> : <Icon name="flag" size={18} color={C.muted} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{x.name}</Text>
                <Text style={{ fontSize: 12, color: C.muted }}>
                  {got ? '도장 완료' : d === null ? '위치 확인 중… (위치 권한 필요)' : near ? '도장 찍을 수 있어요!' : `${formatDistance(d)} 남음`}
                </Text>
              </View>
              {!got ? <Button title="도장" small disabled={!can} onPress={() => stamp(x.id, x.name)} style={{ width: 76 }} /> : null}
            </Pressable>
          );
        })}

        <View style={{ padding: 12, borderRadius: 16, backgroundColor: C.peach, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Icon name="sparkle" size={18} color={C.orangeText} />
          <Text style={{ flex: 1, fontSize: 12, color: C.ink }}>시연용: 거리 무시하고 도장 찍기</Text>
          <Switch value={ignoreDistance} onValueChange={setIgnoreDistance} trackColor={{ true: C.orange, false: C.line }} />
        </View>

        <View style={{ padding: 14, borderRadius: 16, backgroundColor: C.white, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {reward.stickers.map((id) => (
            <StickerImg key={id} id={id} size={52} dim={!claimed} />
          ))}
          <Text style={{ flex: 1, fontSize: 13, color: C.ink }}>{claimed ? '완주 보상을 받았어요!' : '5곳을 모두 돌면 받는 한정 스티커'}</Text>
        </View>
        <Text style={{ fontSize: 11, color: C.muted }}>데모에서는 스팟을 처음 산책을 시작한 위치 주변에 자동으로 놓아요. 실제 서비스에서는 기관이 정한 장소가 들어가요.</Text>
      </ScrollView>
    </Screen>
  );
}
