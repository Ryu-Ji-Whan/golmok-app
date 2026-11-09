import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '../components/Icon';
import { Button, Screen, StickerImg } from '../components/ui';
import { C } from '../lib/theme';

const PAGES = [
  { sticker: 'a00', title: '걸으며 발견하고,\n나만의 지도로 남기다', body: '평범한 오늘의 걸음이\n특별한 지도가 돼요.' },
  { sticker: 'a03', title: '걸은 골목만\n지도에 색이 칠해져요', body: '안 가본 골목은 안개 속에 있어요.\n걸어서 하나씩 밝혀 보세요.' },
  { sticker: 'a02', title: '발견한 곳에\n스티커를 붙여요', body: '고양이가 모이는 벤치,\n노을이 예쁜 계단까지.' },
  { sticker: 'c13', title: '동네 사람들과\n함께 채워요', body: '동네 순위, 한정 스티커,\n가게와 구청 이벤트까지.' },
];

export default function Onboarding() {
  const [page, setPage] = useState(0);
  const p = PAGES[page];
  const last = page === PAGES.length - 1;
  return (
    <Screen
      footer={
        <View style={{ gap: 8 }}>
          <Button title={last ? '시작하기' : '다음'} onPress={() => (last ? router.push('/login') : setPage(page + 1))} />
          <Pressable onPress={() => router.push('/login')} style={{ alignItems: 'center', padding: 10 }}>
            <Text style={{ fontSize: 13, color: C.muted }}>
              이미 계정이 있어요 · <Text style={{ color: C.forest, fontWeight: '700' }}>로그인</Text>
            </Text>
          </Pressable>
        </View>
      }
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 40 }}>
        <Text style={{ fontSize: 44, fontWeight: '900', color: C.forest }}>골목대장</Text>
        <Icon name="paw" size={28} color={C.orange} />
      </View>
      <Pressable style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 }} onPress={() => setPage((page + 1) % PAGES.length)}>
        <View style={{ width: 240, height: 240, borderRadius: 120, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center', borderWidth: 8, borderColor: C.white }}>
          <StickerImg id={p.sticker} size={180} />
        </View>
        <Text style={{ fontSize: 22, fontWeight: '800', color: C.ink, textAlign: 'center', lineHeight: 31 }}>{p.title}</Text>
        <Text style={{ fontSize: 15, color: C.muted, textAlign: 'center', lineHeight: 22 }}>{p.body}</Text>
      </Pressable>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
        {PAGES.map((_, i) => (
          <View key={i} style={{ width: i === page ? 20 : 7, height: 7, borderRadius: 4, backgroundColor: i === page ? C.forest : C.line }} />
        ))}
      </View>
    </Screen>
  );
}
