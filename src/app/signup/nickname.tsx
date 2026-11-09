import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { Body, Button, Header, Progress, Screen, Title } from '../../components/ui';
import { TAKEN_NICKNAMES } from '../../lib/content';
import { signupDraft } from '../../lib/signupDraft';
import { C } from '../../lib/theme';

const RULE = /^[가-힣a-zA-Z0-9_]{2,12}$/;
type Status = 'empty' | 'invalid' | 'checking' | 'taken' | 'ok';

export default function Nickname() {
  const [nick, setNick] = useState(signupDraft.nickname);
  const [status, setStatus] = useState<Status>(signupDraft.nickname ? 'ok' : 'empty');

  // 입력을 멈추고 0.5초 뒤에 중복 확인(데모는 고정 목록으로 판정).
  useEffect(() => {
    if (!nick) return setStatus('empty');
    if (!RULE.test(nick)) return setStatus('invalid');
    setStatus('checking');
    const t = setTimeout(() => {
      setStatus(TAKEN_NICKNAMES.includes(nick) || TAKEN_NICKNAMES.includes(nick.toLowerCase()) ? 'taken' : 'ok');
    }, 500);
    return () => clearTimeout(t);
  }, [nick]);

  const base = nick.slice(0, 9);
  const suggestions = status === 'taken' ? [`${base}2`, `${base}_산책`, `골목${base}`.slice(0, 12)] : [];
  const border = status === 'ok' ? C.leaf : status === 'invalid' || status === 'taken' ? C.dangerLine : C.line;
  const msg =
    status === 'invalid' ? { t: '2~12자의 한글, 영문, 숫자, _만 쓸 수 있어요', c: C.danger }
    : status === 'taken' ? { t: '이미 사용 중인 닉네임이에요', c: C.danger }
    : status === 'ok' ? { t: '사용할 수 있는 닉네임이에요', c: C.leafText }
    : status === 'checking' ? { t: '확인 중…', c: C.muted }
    : { t: '2~12자, 한글·영문·숫자·밑줄(_)', c: C.muted };

  return (
    <Screen
      scroll
      footer={
        <Button
          title="다음"
          disabled={status !== 'ok'}
          onPress={() => {
            signupDraft.nickname = nick;
            router.push('/signup/character');
          }}
        />
      }
    >
      <Header />
      <Progress step={2} />
      <View style={{ marginVertical: 12 }}>
        <Title>{'동네에서 불릴\n닉네임을 정해 주세요'}</Title>
      </View>
      <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, marginBottom: 8 }}>닉네임</Text>
      <View>
        <TextInput
          value={nick}
          onChangeText={setNick}
          maxLength={12}
          autoFocus
          autoCorrect={false}
          placeholder="예: 골목냥이"
          placeholderTextColor={C.muted}
          accessibilityLabel="닉네임"
          style={{ height: 52, borderWidth: 1.5, borderColor: border, borderRadius: 14, backgroundColor: C.white, paddingHorizontal: 16, fontSize: 16, color: C.ink }}
        />
        {status === 'checking' ? <ActivityIndicator style={{ position: 'absolute', right: 14, top: 16 }} color={C.muted} /> : null}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        <Text style={{ fontSize: 13, fontWeight: '500', color: msg.c, flex: 1 }} accessibilityLiveRegion="polite">
          {msg.t}
        </Text>
        <Text style={{ fontSize: 12, color: C.muted }}>{nick.length}/12</Text>
      </View>

      {suggestions.length ? (
        <View style={{ marginTop: 18, gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink }}>이런 닉네임은 어때요?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {suggestions.map((sg) => (
              <Pressable key={sg} onPress={() => setNick(sg)} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: C.leaf, backgroundColor: C.mint }}>
                <Text style={{ color: C.forest, fontSize: 14, fontWeight: '500' }}>{sg}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <View style={{ marginTop: 20, padding: 14, borderRadius: 14, backgroundColor: C.white }}>
        <Body muted style={{ fontSize: 12 }}>
          닉네임은 피드와 리더보드에 보여요. 데모에서는 '골목대장', '관리자', '행궁산책러'가 이미 쓰는 닉네임으로 처리돼요.
        </Body>
      </View>
    </Screen>
  );
}
