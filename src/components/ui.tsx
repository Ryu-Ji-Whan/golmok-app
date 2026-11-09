import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sticker } from '../lib/stickers';
import { C, R } from '../lib/theme';
import { Icon, IconName } from './Icon';

export function Screen({ children, scroll = false, bg = C.cream, footer }: { children: React.ReactNode; scroll?: boolean; bg?: string; footer?: React.ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={['top', 'bottom']}>
      {scroll ? (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: 24 }}>{children}</View>
      )}
      {footer ? <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 8 }}>{footer}</View> : null}
    </SafeAreaView>
  );
}

export function Header({ title, back = true, right, onBack }: { title?: string; back?: boolean; right?: React.ReactNode; onBack?: () => void }) {
  return (
    <View style={styles.header}>
      {back ? (
        <Pressable accessibilityRole="button" accessibilityLabel="뒤로" hitSlop={10} onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))} style={styles.headerBtn}>
          <Icon name="back" />
        </Pressable>
      ) : (
        <View style={styles.headerBtn} />
      )}
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title ?? ''}
      </Text>
      <View style={[styles.headerBtn, { alignItems: 'flex-end' }]}>{right}</View>
    </View>
  );
}

export function Progress({ step, total = 4 }: { step: number; total?: number }) {
  return (
    <View style={{ gap: 8, marginBottom: 8 }}>
      <Text style={{ alignSelf: 'flex-end', fontSize: 13, fontWeight: '700', color: C.muted }}>
        {step} / {total}
      </Text>
      <View style={{ height: 4, borderRadius: 2, backgroundColor: C.lineSoft }}>
        <View style={{ width: `${(step / total) * 100}%`, height: 4, borderRadius: 2, backgroundColor: C.forest }} />
      </View>
    </View>
  );
}

type BtnVariant = 'primary' | 'soft' | 'outline' | 'ghost';

export function Button({
  title, onPress, variant = 'primary', disabled = false, icon, style, loading = false, small = false,
}: { title: string; onPress?: () => void; variant?: BtnVariant; disabled?: boolean; icon?: IconName; style?: StyleProp<ViewStyle>; loading?: boolean; small?: boolean }) {
  const bg = disabled ? C.line : variant === 'primary' ? C.forest : variant === 'soft' ? C.mint : variant === 'outline' ? C.white : 'transparent';
  const fg = disabled ? C.muted : variant === 'primary' ? C.white : variant === 'ghost' ? C.muted : C.forest;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        {
          height: small ? 38 : 56,
          paddingHorizontal: small ? 14 : 20,
          borderRadius: R.pill,
          backgroundColor: bg,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: C.line,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 6,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={fg} /> : icon ? <Icon name={icon} size={small ? 16 : 20} color={fg} /> : null}
      <Text style={{ color: fg, fontSize: small ? 13 : 17, fontWeight: '700' }}>{title}</Text>
    </Pressable>
  );
}

export function Title({ children, size = 26 }: { children: React.ReactNode; size?: number }) {
  return <Text style={{ fontSize: size, fontWeight: '800', color: C.forest, lineHeight: size * 1.35 }}>{children}</Text>;
}

export function Body({ children, muted = false, style }: { children: React.ReactNode; muted?: boolean; style?: object }) {
  return <Text style={[{ fontSize: 14, lineHeight: 21, color: muted ? C.muted : C.ink }, style]}>{children}</Text>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ backgroundColor: C.white, borderRadius: R.card, padding: 16 }, style]}>{children}</View>;
}

export function StickerImg({ id, size = 48, dim = false }: { id: string; size?: number; dim?: boolean }) {
  return <Image source={sticker(id).image} style={{ width: size, height: size, opacity: dim ? 0.35 : 1 }} resizeMode="contain" />;
}

export function Avatar({ id, size = 36, bg = C.peach }: { id: string; size?: number; bg?: string }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <StickerImg id={id} size={size * 0.86} />
    </View>
  );
}

export function Segmented<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={styles.seg} accessibilityRole="tablist">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable key={o.value} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => onChange(o.value)} style={[styles.segItem, on && { backgroundColor: C.forest }]}>
            <Text style={{ fontSize: 13, fontWeight: on ? '700' : '500', color: on ? C.white : C.muted }}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const styles = StyleSheet.create({
  header: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerBtn: { width: 64, height: 44, justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: C.ink },
  seg: { flexDirection: 'row', backgroundColor: C.white, borderRadius: 21, borderWidth: 1, borderColor: C.line, padding: 4, gap: 2 },
  segItem: { flex: 1, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
});
