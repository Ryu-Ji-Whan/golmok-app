import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Body, Button, Header, Progress, Screen, StickerImg, Title } from '../../components/ui';
import { CHARACTERS } from '../../lib/content';
import { signupDraft } from '../../lib/signupDraft';
import { C, shadow } from '../../lib/theme';

export default function Character() {
  const [sel, setSel] = useState(signupDraft.characterId);
  const current = CHARACTERS.find((c) => c.id === sel) ?? CHARACTERS[0];
  return (
    <Screen
      scroll
      footer={
        <Button
          title="다음"
          onPress={() => {
            signupDraft.characterId = sel;
            router.push('/signup/location');
          }}
        />
      }
    >
      <Header />
      <Progress step={3} />
      <View style={{ marginVertical: 12 }}>
        <Title>{'함께 걸을\n대표 캐릭터를 골라요'}</Title>
      </View>
      <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20, borderRadius: 22, backgroundColor: C.white }, shadow]}>
        <View style={{ width: 108, height: 108, borderRadius: 54, backgroundColor: C.peach, borderWidth: 3, borderColor: C.orange, alignItems: 'center', justifyContent: 'center' }}>
          <StickerImg id={current.id} size={92} />
        </View>
        <View style={{ gap: 4, flex: 1 }}>
          <Text style={{ fontSize: 12, color: C.muted }}>미리보기</Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: C.forest }}>{current.name}</Text>
          <Body muted style={{ fontSize: 12 }}>프로필·리더보드·피드에 이 캐릭터가 보여요</Body>
        </View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 }} accessibilityRole="radiogroup">
        {CHARACTERS.map((c) => {
          const on = c.id === sel;
          return (
            <Pressable
              key={c.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              onPress={() => setSel(c.id)}
              style={{ width: '31.5%', height: 112, borderRadius: 18, borderWidth: on ? 2 : 1, borderColor: on ? C.orange : C.line, backgroundColor: on ? C.peach : C.white, alignItems: 'center', justifyContent: 'center', gap: 4 }}
            >
              <StickerImg id={c.id} size={64} />
              <Text style={{ fontSize: 12, color: C.ink }}>{c.name}</Text>
            </Pressable>
          );
        })}
      </View>
      <Body muted style={{ marginTop: 12, fontSize: 12 }}>나중에 설정에서 언제든 바꿀 수 있어요.</Body>
    </Screen>
  );
}
