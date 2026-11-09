import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Icon } from '../components/Icon';
import { Button, Header, Screen, Segmented, StickerImg } from '../components/ui';
import { STORES } from '../lib/content';
import { DEFAULT_CENTER, distanceM, formatDistance, offset } from '../lib/geo';
import { Coupon, newId, useStore } from '../lib/store';
import { C, shadow } from '../lib/theme';

export default function Stores() {
  const { s, dispatch } = useStore();
  const [tab, setTab] = useState<'stores' | 'coupons'>('stores');
  const [scanning, setScanning] = useState<string | null>(null);
  const [showCoupon, setShowCoupon] = useState<Coupon | null>(null);
  const anchor = s.home ?? s.lastPos ?? DEFAULT_CENTER;
  const here = s.lastPos ?? anchor;
  const unused = s.coupons.filter((c) => !c.usedAt).length;

  const visit = (id: string) => {
    const st = STORES.find((x) => x.id === id)!;
    setScanning(id);
    setTimeout(() => {
      setScanning(null);
      dispatch({ type: 'visitStore', storeId: id, sticker: st.sticker, coupon: { id: newId('cp'), storeId: id, title: `${st.name} · ${st.benefit}`, issuedAt: Date.now() } });
      Alert.alert('방문 인증 완료', `${st.name} 스티커와 쿠폰을 받았어요!`);
    }, 1400);
  };

  return (
    <Screen>
      <Header title="⑦ 제휴 가게 이벤트" />
      <Segmented value={tab} onChange={setTab} options={[{ value: 'stores', label: '동네 가게' }, { value: 'coupons', label: `내 쿠폰${unused ? ` ${unused}` : ''}` }]} />
      <ScrollView contentContainerStyle={{ gap: 10, paddingVertical: 14 }} showsVerticalScrollIndicator={false}>
        {tab === 'stores' ? (
          <>
            <Text style={{ fontSize: 12, color: C.muted }}>가게 카운터의 QR을 찍으면 가게 한정 스티커와 쿠폰을 받아요. (데모: 버튼을 누르면 인증돼요)</Text>
            {STORES.map((st) => {
              const visited = s.visitedStores.includes(st.id);
              const d = distanceM(here, offset(anchor, st.north, st.east));
              return (
                <View key={st.id} style={[{ padding: 14, borderRadius: 18, backgroundColor: C.white, gap: 10 }, shadow]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ width: 60, height: 60, borderRadius: 16, backgroundColor: C.peach, alignItems: 'center', justifyContent: 'center' }}>
                      <StickerImg id={st.sticker} size={50} />
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink }}>{st.name}</Text>
                        {st.isNew ? <Text style={{ paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6, backgroundColor: C.orange, color: C.white, fontSize: 10, fontWeight: '700' }}>NEW</Text> : null}
                      </View>
                      <Text style={{ fontSize: 12, color: C.muted }}>{st.category} · {formatDistance(d)}</Text>
                      <Text style={{ fontSize: 12, color: C.orangeText }}>{st.benefit}</Text>
                    </View>
                  </View>
                  {visited ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Icon name="check" size={16} color={C.leaf} />
                      <Text style={{ fontSize: 13, color: C.leafText, fontWeight: '700' }}>방문 인증 완료 · 스티커 받음</Text>
                    </View>
                  ) : (
                    <Button title="방문 인증 (QR 데모)" icon="qr" small variant="soft" onPress={() => visit(st.id)} />
                  )}
                </View>
              );
            })}
          </>
        ) : s.coupons.length === 0 ? (
          <Text style={{ marginTop: 30, textAlign: 'center', color: C.muted }}>아직 쿠폰이 없어요. 가게 방문이나 스탬프 투어로 받을 수 있어요.</Text>
        ) : (
          s.coupons.map((c) => (
            <Pressable key={c.id} onPress={() => !c.usedAt && setShowCoupon(c)} style={{ padding: 14, borderRadius: 16, backgroundColor: c.usedAt ? C.sand : C.white, borderWidth: 1, borderColor: c.usedAt ? C.line : C.orange, borderStyle: 'dashed', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Icon name="ticket" size={22} color={c.usedAt ? C.muted : C.orangeText} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: c.usedAt ? C.muted : C.ink }}>{c.title}</Text>
                <Text style={{ fontSize: 12, color: C.muted }}>{c.usedAt ? `사용함 · ${new Date(c.usedAt).toLocaleDateString('ko-KR')}` : `받은 날 ${new Date(c.issuedAt).toLocaleDateString('ko-KR')} · 눌러서 사용`}</Text>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>

      <Modal transparent visible={!!scanning} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <View style={{ width: 200, height: 200, borderRadius: 24, borderWidth: 3, borderColor: C.white, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="qr" size={80} color={C.white} />
          </View>
          <Text style={{ color: C.white, fontSize: 15, fontWeight: '700' }}>QR 확인 중…</Text>
        </View>
      </Modal>

      <Modal transparent visible={!!showCoupon} animationType="slide" onRequestClose={() => setShowCoupon(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
          <View style={{ padding: 24, paddingBottom: 40, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: C.cream, gap: 14, alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: C.muted }}>직원에게 이 화면을 보여주세요</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: C.ink, textAlign: 'center' }}>{showCoupon?.title}</Text>
            <View style={{ padding: 18, borderRadius: 20, backgroundColor: C.white }}>
              <Icon name="qr" size={120} color={C.ink} strokeWidth={1.5} />
            </View>
            <Text style={{ fontSize: 22, fontWeight: '900', letterSpacing: 4, color: C.forest }}>{showCoupon?.id.slice(-6).toUpperCase()}</Text>
            <Button
              title="사용 완료 처리"
              onPress={() => {
                if (showCoupon) dispatch({ type: 'useCoupon', id: showCoupon.id, at: Date.now() });
                setShowCoupon(null);
              }}
              style={{ alignSelf: 'stretch' }}
            />
            <Button title="닫기" variant="ghost" onPress={() => setShowCoupon(null)} style={{ alignSelf: 'stretch' }} />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
