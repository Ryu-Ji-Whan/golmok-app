import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { Button, Screen, StickerImg } from '../../components/ui';
import { WELCOME } from '../../lib/content';
import { signupDraft } from '../../lib/signupDraft';
import { useStore } from '../../lib/store';
import { C, shadow } from '../../lib/theme';

export default function Done() {
  const { dispatch } = useStore();
  const start = () => {
    dispatch({
      type: 'signup',
      gift: WELCOME,
      user: {
        nickname: signupDraft.nickname || '골목냥이',
        characterId: signupDraft.characterId,
        areaName: signupDraft.areaName,
        marketing: signupDraft.agreements.marketing,
        joinedAt: Date.now(),
        provider: signupDraft.provider || undefined,
      },
    });
    // 가입 화면으로 뒤로 가지 않도록 첫 화면으로 교체한다.
    router.dismissAll();
    router.replace('/walk');
  };
  return (
    <Screen footer={<Button title="첫 산책 시작하기" onPress={start} />}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <View style={[{ width: 132, height: 132, borderRadius: 66, backgroundColor: C.peach, borderWidth: 4, borderColor: C.white, alignItems: 'center', justifyContent: 'center' }, shadow]}>
          <StickerImg id={signupDraft.characterId} size={112} />
        </View>
        <Text style={{ fontSize: 28, fontWeight: '900', color: C.forest, textAlign: 'center' }}>{signupDraft.nickname || '골목냥이'}님, 환영해요!</Text>
        <Text style={{ fontSize: 15, color: C.muted, textAlign: 'center', lineHeight: 22 }}>골목대장이 될 준비 끝!{'\n'}첫 산책에서 골목을 밝혀 보세요</Text>
        <View style={[{ width: '100%', marginTop: 8, padding: 16, borderRadius: 20, backgroundColor: C.white, gap: 10 }, shadow]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>환영 스티커 팩이 도착했어요</Text>
            <Text style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: C.mint, fontSize: 11, fontWeight: '700', color: C.forest }}>보관함 +{WELCOME.length}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {WELCOME.map((id) => (
              <View key={id} style={{ flex: 1, height: 72, borderRadius: 14, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
                <StickerImg id={id} size={52} />
              </View>
            ))}
          </View>
        </View>
        <Text style={{ fontSize: 13, color: C.muted }}>내 동네 · {signupDraft.areaName}</Text>
      </View>
    </Screen>
  );
}
