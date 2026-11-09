import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, Image, Text, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { Body, Button, Header, Screen, StickerImg } from '../../components/ui';
import { distanceM } from '../../lib/geo';
import { sticker } from '../../lib/stickers';
import { useStore } from '../../lib/store';
import { C, shadow } from '../../lib/theme';

export default function SpotDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { s, dispatch } = useStore();
  const spot = s.spots.find((x) => x.id === id);
  if (!spot) {
    return (
      <Screen>
        <Header title="기록" />
        <Body muted>삭제된 기록이에요.</Body>
      </Screen>
    );
  }
  const away = s.lastPos ? distanceM(s.lastPos, spot) : null;
  const remove = () =>
    Alert.alert('이 기록을 지울까요?', '지운 기록은 되돌릴 수 없어요.', [
      { text: '취소', style: 'cancel' },
      { text: '지우기', style: 'destructive', onPress: () => { dispatch({ type: 'deleteSpot', id: spot.id }); router.back(); } },
    ]);

  return (
    <Screen
      scroll
      footer={
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button title="공유하기" icon="share" onPress={() => router.push({ pathname: '/share', params: { spot: spot.id } })} style={{ flex: 1 }} />
          <Button title="지우기" icon="trash" variant="outline" onPress={remove} style={{ width: 120 }} />
        </View>
      }
    >
      <Header title="③ 저장된 기록" />
      {spot.photoUri ? (
        <View>
          <Image source={{ uri: spot.photoUri }} style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 22 }} />
          <View style={{ position: 'absolute', right: 10, bottom: -18 }}>
            <StickerImg id={spot.stickerId} size={76} />
          </View>
        </View>
      ) : (
        <View style={[{ height: 200, borderRadius: 22, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' }, shadow]}>
          <StickerImg id={spot.stickerId} size={140} />
        </View>
      )}
      <Text style={{ fontSize: 24, fontWeight: '900', color: C.ink, marginTop: 22 }}>{spot.title}</Text>
      <View style={{ marginTop: 12, padding: 14, borderRadius: 16, backgroundColor: C.white, gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="pin" size={16} color={C.leaf} />
          <Text style={{ fontSize: 13, color: C.ink }}>
            {spot.latitude.toFixed(5)}, {spot.longitude.toFixed(5)}
            {away !== null ? ` · 지금 위치에서 ${Math.round(away)}m` : ''}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="sparkle" size={16} color={C.orange} />
          <Text style={{ fontSize: 13, color: C.ink }}>{sticker(spot.stickerId).name} 스티커 · {new Date(spot.createdAt).toLocaleString('ko-KR')}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="lock" size={16} color={C.muted} />
          <Text style={{ fontSize: 13, color: C.ink }}>공개 범위: {spot.visibility === 'me' ? '나만' : spot.visibility === 'friends' ? '친구' : '동네 모두'}</Text>
        </View>
      </View>
      {spot.memo ? <Body style={{ marginTop: 14, fontSize: 15, lineHeight: 23 }}>{spot.memo}</Body> : null}
    </Screen>
  );
}
