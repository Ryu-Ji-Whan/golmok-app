import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../../components/Icon';
import { Avatar, Button, Segmented, StickerImg } from '../../components/ui';
import { FEED, NEIGHBORS, PACKS } from '../../lib/content';
import { myWeeklyCells, useStore } from '../../lib/store';
import { C, shadow } from '../../lib/theme';

export default function Town() {
  const { s, dispatch } = useStore();
  const [tab, setTab] = useState<'rank' | 'feed'>('rank');
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const area = s.user?.areaName.split(' ').slice(-1)[0] ?? '우리 동네';
  const me = { name: `${s.user?.nickname ?? '나'} (나)`, character: s.user?.characterId ?? 'a00', cells: myWeeklyCells(s), isMe: true };
  const ranking = [...NEIGHBORS.map((n) => ({ ...n, isMe: false })), me].sort((a, b) => b.cells - a.cells);
  const myRank = ranking.findIndex((r) => r.isMe) + 1;
  const total = ranking.reduce((n, r) => n + r.cells, 0);
  const fill = Math.min(100, Math.round((total / 700) * 100));
  const third = ranking[2];
  const leaderPack = PACKS.find((p) => p.id === 'leader')!;
  const claimed = s.claimedRewards.includes('leader');

  const myPosts = s.spots.filter((x) => x.shared);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
        <View>
          <Text style={{ fontSize: 12, fontWeight: '700', color: C.leafText }}>⑤ 동네 채우기</Text>
          <Text style={{ fontSize: 26, fontWeight: '900', color: C.forest }}>{area} 리더보드</Text>
        </View>
        <Segmented value={tab} onChange={setTab} options={[{ value: 'rank', label: '이번 주 순위' }, { value: 'feed', label: `골목 피드${myPosts.length ? ` · 내 글 ${myPosts.length}` : ''}` }]} />

        {tab === 'rank' ? (
          <>
            <View style={{ padding: 16, borderRadius: 20, backgroundColor: C.forest, gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Text style={{ fontSize: 13, color: '#D4EBDD' }}>우리 동네가 함께 밝힌 골목</Text>
                <Text style={{ fontSize: 22, fontWeight: '800', color: C.white }}>{fill}%</Text>
              </View>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.22)' }}>
                <View style={{ width: `${fill}%`, height: 8, borderRadius: 4, backgroundColor: C.orange }} />
              </View>
              <Text style={{ fontSize: 12, color: '#D4EBDD' }}>점수 = 이번 주 새로 밝힌 골목 칸 수 (이웃은 예시 데이터)</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 190 }}>
              {[1, 0, 2].map((idx) => {
                const r = ranking[idx];
                const h = idx === 0 ? 92 : idx === 1 ? 68 : 52;
                return (
                  <View key={idx} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                    <Avatar id={r.character} size={idx === 0 ? 60 : 52} bg={r.isMe ? C.peach : C.mint} />
                    <Text numberOfLines={1} style={{ fontSize: 12, fontWeight: '700', color: C.ink }}>{r.name}</Text>
                    <View style={{ width: '100%', height: h, borderTopLeftRadius: 12, borderTopRightRadius: 12, backgroundColor: idx === 0 ? C.orange : C.line, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 18, fontWeight: '800', color: idx === 0 ? C.white : C.ink }}>{idx + 1}</Text>
                      <Text style={{ fontSize: 11, color: idx === 0 ? C.white : C.muted }}>{r.cells}칸</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={{ gap: 6 }}>
              {ranking.slice(3).map((r, i) => (
                <View key={r.name} style={{ height: 48, paddingHorizontal: 14, borderRadius: 14, backgroundColor: r.isMe ? C.peach : C.white, borderWidth: r.isMe ? 1.5 : 0, borderColor: C.orange, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ width: 20, fontWeight: '700', color: C.muted }}>{i + 4}</Text>
                  <Avatar id={r.character} size={30} bg={C.white} />
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: r.isMe ? '700' : '400', color: C.ink }}>{r.name}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: r.isMe ? C.orangeText : C.muted }}>{r.cells}칸</Text>
                </View>
              ))}
            </View>

            <View style={[{ padding: 14, borderRadius: 18, backgroundColor: C.white, borderWidth: 1, borderColor: C.orange, borderStyle: 'dashed', gap: 10 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <StickerImg id={leaderPack.stickers[0]} size={44} />
                <Text style={{ flex: 1, fontSize: 13, color: C.ink, lineHeight: 19 }}>
                  {claimed
                    ? '동네 대장 한정 스티커를 받았어요!'
                    : myRank <= 3
                      ? `지금 ${myRank}위! 동네 대장 한정 스티커를 받을 수 있어요`
                      : `${Math.max(1, third.cells - me.cells + 1)}칸 더 밝히면 3위 · 동네 대장 한정 스티커`}
                </Text>
              </View>
              {!claimed && myRank <= 3 ? (
                <Button title="보상 받기" small icon="gift" onPress={() => dispatch({ type: 'reward', rewardId: 'leader', stickers: leaderPack.stickers })} />
              ) : (
                <Button title="⑥ 스티커 상점 가기" small variant="soft" onPress={() => router.push('/shop')} />
              )}
            </View>
          </>
        ) : (
          <View style={{ gap: 12 }}>
            {myPosts.map((p) => (
              <Pressable key={p.id} onPress={() => router.push(`/spot/${p.id}`)} style={[{ padding: 14, borderRadius: 20, backgroundColor: C.white, gap: 10 }, shadow]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Avatar id={s.user?.characterId ?? 'a00'} />
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{s.user?.nickname ?? '나'}</Text>
                    <Text style={{ fontSize: 12, color: C.muted }}>{area} · 내 기록</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, backgroundColor: C.mint }}>
                  <StickerImg id={p.stickerId} size={64} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink }}>{p.title}</Text>
                    {p.memo ? <Text numberOfLines={2} style={{ fontSize: 13, color: C.ink }}>{p.memo}</Text> : null}
                  </View>
                </View>
              </Pressable>
            ))}
            {FEED.map((f) => (
              <View key={f.id} style={[{ padding: 14, borderRadius: 20, backgroundColor: C.white, gap: 10 }, shadow]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Avatar id={f.character} bg={C.mint} />
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{f.author}</Text>
                    <Text style={{ fontSize: 12, color: C.muted }}>{f.area} · {f.ago} · 예시</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, backgroundColor: C.peach }}>
                  <StickerImg id={f.sticker} size={64} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink }}>{f.title}</Text>
                    <Text style={{ fontSize: 13, color: C.ink }}>{f.body}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <Pressable onPress={() => setLiked({ ...liked, [f.id]: !liked[f.id] })} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="heart" size={20} color={liked[f.id] ? C.pink : C.line} />
                    <Text style={{ fontSize: 13, color: C.ink }}>{f.likes + (liked[f.id] ? 1 : 0)}</Text>
                  </Pressable>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="chat" size={20} />
                    <Text style={{ fontSize: 13, color: C.ink }}>{f.comments}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
