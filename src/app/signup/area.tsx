import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { Body, Button, Header, Progress, Screen, Title } from '../../components/ui';
import { AREAS } from '../../lib/content';
import { signupDraft } from '../../lib/signupDraft';
import { C } from '../../lib/theme';

export default function Area() {
  const [sel, setSel] = useState(signupDraft.areaName);
  const [fromGps, setFromGps] = useState(signupDraft.areaFromGps);
  const [q, setQ] = useState('');
  const list = Array.from(new Set([...(signupDraft.areaFromGps ? [signupDraft.areaName] : []), ...AREAS]));
  const hits = q.trim() ? list.filter((a) => a.includes(q.trim())) : list.slice(0, 5);

  return (
    <Screen
      scroll
      footer={
        <Button
          title="이 동네로 시작하기"
          onPress={() => {
            signupDraft.areaName = sel;
            router.push('/signup/done');
          }}
        />
      }
    >
      <Header />
      <Progress step={4} />
      <View style={{ marginVertical: 12, gap: 6 }}>
        <Title>내 동네를 정해요</Title>
        <Body muted>리더보드와 동네 피드가 이 동네 기준으로 보여요</Body>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16, borderRadius: 18, backgroundColor: C.mint }}>
        <Icon name="pin" size={20} color={C.forest} />
        <Text style={{ flex: 1, fontSize: 15, fontWeight: '700', color: C.ink }}>{sel}</Text>
        <Text style={{ fontSize: 11, color: C.leafText }}>{fromGps ? '현재 위치로 찾음' : '직접 선택'}</Text>
      </View>

      <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, marginTop: 18, marginBottom: 6 }}>다른 동네로 바꾸기</Text>
      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="동 이름으로 검색 (예: 매향동)"
        placeholderTextColor={C.muted}
        accessibilityLabel="동네 검색"
        style={{ height: 48, borderWidth: 1, borderColor: C.line, borderRadius: 14, backgroundColor: C.white, paddingHorizontal: 16, fontSize: 15, color: C.ink }}
      />
      <View style={{ gap: 6, marginTop: 10 }}>
        {hits.slice(0, 5).map((a) => {
          const on = a === sel;
          return (
            <Pressable
              key={a}
              onPress={() => {
                setSel(a);
                setFromGps(false);
              }}
              style={{ height: 46, paddingHorizontal: 14, borderRadius: 12, borderWidth: on ? 1.5 : 1, borderColor: on ? C.leaf : C.line, backgroundColor: on ? C.mint : C.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Text style={{ fontSize: 14, color: C.ink }}>{a}</Text>
              {on ? <Text style={{ fontSize: 12, color: C.muted }}>선택됨</Text> : null}
            </Pressable>
          );
        })}
        {q.trim() && hits.length === 0 ? <Body muted>검색 결과가 없어요. 동 이름을 다시 확인해 주세요.</Body> : null}
      </View>
    </Screen>
  );
}
