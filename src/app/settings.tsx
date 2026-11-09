import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Icon } from '../components/Icon';
import { Avatar, Button, Header, Screen, StickerImg } from '../components/ui';
import { formatDistance } from '../lib/geo';
import { STICKERS } from '../lib/stickers';
import { useStore } from '../lib/store';
import { C } from '../lib/theme';

export default function Settings() {
  const { s, dispatch } = useStore();
  const u = s.user;
  const total = s.walks.reduce((n, w) => n + w.distanceM, 0);

  const reset = () =>
    Alert.alert('데모 데이터를 모두 지울까요?', '기록, 지도, 스티커가 처음 상태로 돌아가고 회원가입부터 다시 시작해요.', [
      { text: '취소', style: 'cancel' },
      {
        text: '초기화',
        style: 'destructive',
        onPress: () => {
          dispatch({ type: 'reset' });
          router.dismissAll();
          router.replace('/onboarding');
        },
      },
    ]);

  const row = (icon: React.ComponentProps<typeof Icon>['name'], label: string, value?: string, onPress?: () => void) => (
    <Pressable onPress={onPress} disabled={!onPress} style={{ height: 52, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderColor: C.lineSoft }}>
      <Icon name={icon} size={20} color={C.leaf} />
      <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{label}</Text>
      {value ? <Text style={{ fontSize: 13, color: C.muted }}>{value}</Text> : null}
      {onPress ? <Icon name="chevron" size={16} color={C.muted} /> : null}
    </Pressable>
  );

  return (
    <Screen scroll>
      <Header title="설정" />
      <View style={{ padding: 16, borderRadius: 20, backgroundColor: C.white, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Avatar id={u?.characterId ?? 'a00'} size={64} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: C.ink }}>{u?.nickname ?? '손님'}</Text>
          <Text style={{ fontSize: 13, color: C.muted }}>{u?.areaName ?? '동네 미설정'}</Text>
          <Text style={{ fontSize: 12, color: C.muted }}>가입 {u ? new Date(u.joinedAt).toLocaleDateString('ko-KR') : '-'}</Text>
        </View>
      </View>

      <View style={{ marginTop: 14, borderRadius: 20, backgroundColor: C.white, overflow: 'hidden' }}>
        {row('walk', '총 걸은 거리', formatDistance(total))}
        {row('map', '밝힌 골목', `${s.explored.length}칸`)}
        {row('sparkle', '보유 스티커', `${s.owned.length}/${Object.keys(STICKERS).length}`)}
        {row('flag', '스탬프 투어', '보기', () => router.push('/campaign'))}
        {row('ticket', '내 쿠폰', `${s.coupons.filter((c) => !c.usedAt).length}장`, () => router.push('/stores'))}
      </View>

      <Text style={{ marginTop: 18, marginBottom: 8, fontSize: 15, fontWeight: '700', color: C.ink }}>내 스티커 보관함</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, padding: 10, borderRadius: 20, backgroundColor: C.white }}>
        {s.owned.map((id) => (
          <StickerImg key={id} id={id} size={48} />
        ))}
      </View>

      <View style={{ marginTop: 18, padding: 14, borderRadius: 16, backgroundColor: C.sand, gap: 4 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink }}>데모 버전 안내</Text>
        <Text style={{ fontSize: 12, color: C.muted, lineHeight: 18 }}>
          로그인·결제·리더보드 이웃·피드 글은 예시예요. 산책 경로, 안개 걷기, 스티커 기록, 사진은 실제로 동작하고 이 폰 안에만 저장돼요.
        </Text>
      </View>
      <Button title="데모 데이터 초기화" variant="outline" icon="trash" onPress={reset} style={{ marginTop: 14 }} />
      <Text style={{ marginTop: 10, textAlign: 'center', fontSize: 11, color: C.muted }}>골목대장 데모 v0.1.0</Text>
    </Screen>
  );
}
