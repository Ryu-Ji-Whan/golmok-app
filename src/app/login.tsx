import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';
import { Header, Screen, StickerImg } from '../components/ui';
import { signupDraft } from '../lib/signupDraft';
import { useStore } from '../lib/store';
import { C, R } from '../lib/theme';

const PROVIDERS = [
  { id: 'kakao', label: '카카오로 계속하기', bg: '#FEE500', fg: '#191600', border: undefined },
  { id: 'apple', label: 'Apple로 계속하기', bg: '#000000', fg: '#FFFFFF', border: undefined },
  { id: 'google', label: 'Google로 계속하기', bg: '#FFFFFF', fg: C.ink, border: C.line },
];

export default function Login() {
  const { s, dispatch } = useStore();
  const [loading, setLoading] = useState<string | null>(null);
  // 로그아웃한 소셜 계정 (둘러보기 손님이나 로그인 방법이 기록되지 않은 예전 계정은 제외)
  const returning = PROVIDERS.some((p) => p.id === s.savedUser?.provider) ? s.savedUser : null;

  const go = (provider: string) => {
    setLoading(provider);
    signupDraft.provider = provider;
    // 데모: 실제 소셜 로그인 대신 1.2초 뒤 처리한다.
    // 로그아웃했던 계정과 같은 방법으로 들어오면 가입 없이 그 계정으로 돌아가고, 아니면 신규 가입.
    setTimeout(() => {
      setLoading(null);
      if (returning && returning.provider === provider) {
        dispatch({ type: 'restoreLogin' });
        router.replace('/walk');
      } else {
        router.push('/signup/terms');
      }
    }, 1200);
  };

  const browse = () => {
    dispatch({ type: 'signup', user: { nickname: '손님', characterId: 'a00', areaName: '수원시 팔달구 행궁동', marketing: false, joinedAt: Date.now(), provider: 'guest' }, gift: [] });
    router.replace('/walk');
  };

  return (
    <Screen>
      <Header />
      <View style={{ alignItems: 'center', marginTop: 12, gap: 8 }}>
        <Text style={{ fontSize: 42, fontWeight: '900', color: C.forest }}>골목대장</Text>
        <Text style={{ fontSize: 15, color: C.muted, textAlign: 'center', lineHeight: 22 }}>내가 걸은 골목이 지도로 남아요{'\n'}3초 만에 시작해요</Text>
        <View style={{ marginTop: 24 }}>
          <StickerImg id="a04" size={170} />
        </View>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ gap: 10, paddingBottom: 12 }}>
        {PROVIDERS.map((p) => (
          <Pressable
            key={p.id}
            accessibilityRole="button"
            disabled={!!loading}
            onPress={() => go(p.id)}
            style={{ height: 54, borderRadius: R.pill, backgroundColor: p.bg, borderWidth: p.border ? 1 : 0, borderColor: p.border, alignItems: 'center', justifyContent: 'center', opacity: loading && loading !== p.id ? 0.5 : 1 }}
          >
            <Text style={{ color: p.fg, fontSize: 16, fontWeight: '700' }}>{p.label}</Text>
          </Pressable>
        ))}
        <Pressable onPress={browse} style={{ alignSelf: 'center', padding: 10 }}>
          <Text style={{ fontSize: 13, color: C.muted }}>로그인 없이 둘러보기</Text>
        </Pressable>
        {returning ? (
          <Text style={{ fontSize: 12, color: C.forest, textAlign: 'center' }}>
            {PROVIDERS.find((p) => p.id === returning.provider)?.label.replace(' 계속하기', '')} 들어오면 {returning.nickname}님 계정으로 돌아가요
          </Text>
        ) : null}
        <Text style={{ fontSize: 11, color: C.muted, textAlign: 'center' }}>데모 버전: 실제 소셜 로그인 없이 회원가입 화면으로 넘어가요</Text>
      </View>

      <Modal transparent visible={!!loading} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(36,50,44,0.45)', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 240, padding: 28, borderRadius: 24, backgroundColor: C.white, alignItems: 'center', gap: 14 }}>
            <ActivityIndicator size="large" color={C.forest} />
            <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink }}>계정 확인 중이에요</Text>
            <Text style={{ fontSize: 12, color: C.muted }}>잠시만 기다려 주세요</Text>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
