import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { Body, Button, Header, Progress, Screen, Title } from '../../components/ui';
import { signupDraft } from '../../lib/signupDraft';
import { C } from '../../lib/theme';

type Key = keyof typeof signupDraft.agreements;
const ITEMS: { key: Key; label: string; required: boolean; detail?: string }[] = [
  { key: 'age', label: '만 14세 이상입니다', required: true },
  { key: 'terms', label: '서비스 이용약관', required: true, detail: 'terms' },
  { key: 'privacy', label: '개인정보 수집·이용 동의', required: true, detail: 'privacy' },
  { key: 'location', label: '위치기반서비스 이용약관', required: true, detail: 'location' },
  { key: 'marketing', label: '이벤트·캠페인 알림 받기', required: false, detail: 'marketing' },
];

function Check({ on, size = 22 }: { on: boolean; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: on ? C.forest : C.white, borderWidth: on ? 0 : 1.5, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }}>
      {on ? <Icon name="check" size={size * 0.6} color={C.white} strokeWidth={3} /> : null}
    </View>
  );
}

export default function Terms() {
  const [a, setA] = useState({ ...signupDraft.agreements });
  // 약관 상세에서 '동의하고 닫기'로 돌아오면 체크 상태를 다시 읽는다.
  useFocusEffect(useCallback(() => setA({ ...signupDraft.agreements }), []));
  const all = ITEMS.every((i) => a[i.key]);
  const required = ITEMS.filter((i) => i.required).every((i) => a[i.key]);
  const set = (next: typeof a) => {
    setA(next);
    signupDraft.agreements = next;
  };

  return (
    <Screen
      scroll
      footer={<Button title={required ? '다음' : '필수 항목에 동의해 주세요'} disabled={!required} onPress={() => router.push('/signup/nickname')} />}
    >
      <Header />
      <Progress step={1} />
      <View style={{ marginVertical: 12 }}>
        <Title>{'골목대장 이용을 위해\n약관에 동의해 주세요'}</Title>
      </View>

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: all }}
        onPress={() => set({ age: !all, terms: !all, privacy: !all, location: !all, marketing: !all })}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, backgroundColor: C.white, borderWidth: 1.5, borderColor: C.forest }}
      >
        <Check on={all} />
        <Text style={{ fontSize: 16, fontWeight: '700', color: C.ink, flex: 1 }}>모두 동의하기</Text>
        <Text style={{ fontSize: 11, color: C.muted }}>선택 항목 포함</Text>
      </Pressable>

      <View style={{ marginTop: 8 }}>
        {ITEMS.map((i, idx) => (
          <View key={i.key} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 52, borderBottomWidth: idx < ITEMS.length - 1 ? 1 : 0, borderColor: C.lineSoft }}>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: a[i.key] }}
              onPress={() => set({ ...a, [i.key]: !a[i.key] })}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}
            >
              <Check on={a[i.key]} size={20} />
              <Text style={{ fontSize: 14, color: C.ink }}>
                <Text style={{ fontWeight: '700', color: i.required ? C.forest : C.muted }}>{i.required ? '[필수] ' : '[선택] '}</Text>
                {i.label}
              </Text>
            </Pressable>
            {i.detail ? (
              <Pressable hitSlop={8} onPress={() => router.push({ pathname: '/terms-detail', params: { kind: i.detail, title: i.label } })} style={{ padding: 8 }}>
                <Text style={{ fontSize: 12, color: C.muted, textDecorationLine: 'underline' }}>보기</Text>
              </Pressable>
            ) : null}
          </View>
        ))}
      </View>
      <Body muted style={{ marginTop: 12, fontSize: 12 }}>
        만 14세 미만은 가입할 수 없어요. 선택 항목은 동의하지 않아도 가입할 수 있고, 나중에 설정에서 바꿀 수 있어요.
      </Body>
    </Screen>
  );
}
