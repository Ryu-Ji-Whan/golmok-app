import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useStore } from '../lib/store';
import { C } from '../lib/theme';

export default function Index() {
  const { s } = useStore();
  if (!s.hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.cream }}>
        <ActivityIndicator color={C.forest} />
      </View>
    );
  }
  return <Redirect href={s.user ? '/walk' : '/onboarding'} />;
}
