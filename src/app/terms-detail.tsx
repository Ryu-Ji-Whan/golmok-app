import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../components/Icon';
import { Button } from '../components/ui';
import { signupDraft } from '../lib/signupDraft';
import { C } from '../lib/theme';

const SECTIONS = ['제1조 (목적)', '제2조 (수집하는 정보와 이용 목적)', '제3조 (보유 기간)', '제4조 (이용자의 권리)'];

export default function TermsDetail() {
  const { kind, title } = useLocalSearchParams<{ kind: string; title: string }>();
  const agree = () => {
    const k = kind as keyof typeof signupDraft.agreements;
    if (k in signupDraft.agreements) signupDraft.agreements = { ...signupDraft.agreements, [k]: true };
    router.back();
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.white }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, height: 56 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: C.ink, flex: 1 }}>{title}</Text>
        <Pressable accessibilityLabel="닫기" hitSlop={10} onPress={() => router.back()}>
          <Icon name="close" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, gap: 16, paddingBottom: 24 }}>
        <Text style={{ alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: C.cream, fontSize: 12, color: C.muted }}>시행일 [YYYY.MM.DD] · 버전 [v1.0]</Text>
        {SECTIONS.map((s) => (
          <View key={s} style={{ gap: 6 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{s}</Text>
            <Text style={{ fontSize: 14, lineHeight: 22, color: C.muted }}>[약관 본문 — 법무 검토 후 넣을 자리]</Text>
          </View>
        ))}
      </ScrollView>
      <View style={{ padding: 24, paddingTop: 8 }}>
        <Button title="동의하고 닫기" onPress={agree} />
      </View>
    </SafeAreaView>
  );
}
