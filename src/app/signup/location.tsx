import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Icon, IconName } from '../../components/Icon';
import { Button, Header, Progress, Screen, StickerImg, Title } from '../../components/ui';
import { signupDraft } from '../../lib/signupDraft';
import { C } from '../../lib/theme';

const POINTS: { icon: IconName; title: string; body: string }[] = [
  { icon: 'walk', title: '산책 중에만 위치를 써요', body: '산책을 끝내면 위치 수집도 멈춰요' },
  { icon: 'lock', title: '정확한 경로는 나만 봐요', body: '공유할 때도 경로 대신 스티커 장소만 보여요' },
  { icon: 'gear', title: '언제든 끌 수 있어요', body: '휴대폰 설정에서 바꿀 수 있어요' },
];

export default function LocationIntro() {
  const [busy, setBusy] = useState(false);

  const allow = async () => {
    setBusy(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        signupDraft.pos = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        try {
          const [addr] = await Location.reverseGeocodeAsync(signupDraft.pos);
          const name = [addr?.city ?? addr?.region, addr?.district, addr?.street ?? addr?.name].filter(Boolean).join(' ');
          if (name) {
            signupDraft.areaName = name;
            signupDraft.areaFromGps = true;
          }
        } catch {
          // 주소 변환 실패 시 다음 화면에서 직접 고른다.
        }
      }
    } finally {
      setBusy(false);
      router.push('/signup/area');
    }
  };

  return (
    <Screen
      scroll
      footer={
        <View style={{ gap: 4 }}>
          <Button title="위치 허용하기" onPress={allow} loading={busy} />
          <Button title="나중에 할게요 (동네 직접 검색)" variant="ghost" onPress={() => router.push('/signup/area')} />
        </View>
      }
    >
      <Header />
      <Progress step={4} />
      <View style={{ height: 180, borderRadius: 24, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center', marginVertical: 8 }}>
        <StickerImg id="a03" size={130} />
      </View>
      <View style={{ marginVertical: 12 }}>
        <Title size={24}>{'걸은 골목을 지도에 칠하려면\n위치 권한이 필요해요'}</Title>
      </View>
      <View style={{ gap: 14 }}>
        {POINTS.map((p) => (
          <View key={p.title} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={p.icon} size={18} color={C.forest} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{p.title}</Text>
              <Text style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{p.body}</Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}
