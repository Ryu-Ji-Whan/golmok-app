import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../components/Icon';
import { Button, Segmented, StickerImg } from '../components/ui';
import { DEFAULT_CENTER } from '../lib/geo';
import { CATEGORY_LABEL, StickerCategory, sticker } from '../lib/stickers';
import { newId, Spot, useStore } from '../lib/store';
import { C } from '../lib/theme';

type Cat = 'all' | StickerCategory;

export default function Record() {
  const { s, dispatch } = useStore();
  const [stickerId, setStickerId] = useState(s.owned[0] ?? 'a00');
  const [cat, setCat] = useState<Cat>('all');
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [photo, setPhoto] = useState<string | undefined>();
  const [visibility, setVisibility] = useState<Spot['visibility']>('me');

  const owned = s.owned.filter((id) => cat === 'all' || sticker(id).category === cat);

  const pick = async (camera: boolean) => {
    if (camera) {
      const p = await ImagePicker.requestCameraPermissionsAsync();
      if (!p.granted) return Alert.alert('카메라 권한이 필요해요');
    }
    const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.6, allowsEditing: true, aspect: [4, 3] };
    const r = camera ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts);
    if (!r.canceled) setPhoto(r.assets[0].uri);
  };

  const save = () => {
    const pos = s.lastPos ?? s.home ?? DEFAULT_CENTER;
    dispatch({
      type: 'addSpot',
      spot: {
        id: newId('spot'),
        latitude: pos.latitude,
        longitude: pos.longitude,
        stickerId,
        title: title.trim() || sticker(stickerId).name,
        memo: memo.trim(),
        photoUri: photo,
        createdAt: Date.now(),
        walkId: s.activeWalk?.id,
        visibility,
      },
    });
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }} edges={['top', 'bottom']}>
      <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <Pressable accessibilityLabel="닫기" hitSlop={10} onPress={() => router.back()}>
          <Icon name="close" />
        </Pressable>
        <Text style={{ fontSize: 17, fontWeight: '700', color: C.ink }}>여기에 스티커 붙이기</Text>
        <Pressable hitSlop={10} onPress={save}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: C.leafText }}>저장</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 14 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 18, backgroundColor: C.white }}>
          <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: C.peach, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: C.orange }}>
            <StickerImg id={stickerId} size={60} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: C.muted }}>지금 서 있는 곳에 붙어요</Text>
            <Text style={{ fontSize: 17, fontWeight: '800', color: C.ink }}>{sticker(stickerId).name}</Text>
            {!s.lastPos ? <Text style={{ fontSize: 11, color: C.danger }}>아직 위치를 못 찾아 기본 위치에 붙어요</Text> : null}
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {(['all', 'cat', 'sparrow', 'thing', 'place'] as Cat[]).map((c) => (
            <Pressable key={c} onPress={() => setCat(c)} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16, backgroundColor: cat === c ? C.forest : C.white, borderWidth: cat === c ? 0 : 1, borderColor: C.line }}>
              <Text style={{ fontSize: 13, fontWeight: '500', color: cat === c ? C.white : C.ink }}>{c === 'all' ? '전체' : CATEGORY_LABEL[c]}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {owned.map((id) => {
            const on = id === stickerId;
            return (
              <Pressable key={id} accessibilityLabel={sticker(id).name} onPress={() => setStickerId(id)} style={{ width: '23%', aspectRatio: 1, borderRadius: 16, backgroundColor: on ? C.peach : C.white, borderWidth: on ? 2 : 0, borderColor: C.orange, alignItems: 'center', justifyContent: 'center' }}>
                <StickerImg id={id} size={52} />
              </Pressable>
            );
          })}
          {owned.length === 0 ? <Text style={{ color: C.muted }}>이 종류의 스티커가 아직 없어요. 상점에서 모아 보세요.</Text> : null}
        </View>

        <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>제목</Text>
        <TextInput value={title} onChangeText={setTitle} maxLength={30} placeholder="예: 저녁마다 고양이가 모이는 벤치" placeholderTextColor={C.muted} style={{ height: 48, borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: C.white, paddingHorizontal: 14, fontSize: 15, color: C.ink }} />
        <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>메모</Text>
        <TextInput value={memo} onChangeText={setMemo} maxLength={200} multiline placeholder="이곳에서 발견한 것을 적어요" placeholderTextColor={C.muted} style={{ minHeight: 90, borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: C.white, padding: 14, fontSize: 15, color: C.ink, textAlignVertical: 'top' }} />
        <Text style={{ alignSelf: 'flex-end', fontSize: 12, color: C.muted, marginTop: -8 }}>{memo.length}/200</Text>

        <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>사진</Text>
        {photo ? (
          <Pressable onPress={() => setPhoto(undefined)}>
            <Image source={{ uri: photo }} style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 18 }} />
            <Text style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>사진을 누르면 지워요</Text>
          </Pressable>
        ) : (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button title="사진 찍기" icon="camera" variant="outline" onPress={() => pick(true)} style={{ flex: 1 }} />
            <Button title="앨범에서" icon="image" variant="outline" onPress={() => pick(false)} style={{ flex: 1 }} />
          </View>
        )}

        <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>누가 볼 수 있나요</Text>
        <Segmented
          value={visibility}
          onChange={setVisibility}
          options={[
            { value: 'me', label: '나만' },
            { value: 'friends', label: '친구' },
            { value: 'all', label: '동네 모두' },
          ]}
        />
        <Button title="기록 저장" onPress={save} style={{ marginTop: 8 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
