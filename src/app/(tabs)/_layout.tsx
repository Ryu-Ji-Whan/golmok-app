import { Tabs } from 'expo-router';
import React from 'react';
import { Icon } from '../../components/Icon';
import { C } from '../../lib/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.forest,
        tabBarInactiveTintColor: C.muted,
        tabBarStyle: { backgroundColor: C.white, borderTopColor: C.lineSoft },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      }}
    >
      <Tabs.Screen name="walk" options={{ title: '산책', tabBarIcon: ({ color }) => <Icon name="paw" color={String(color)} /> }} />
      <Tabs.Screen name="mymap" options={{ title: '내 지도', tabBarIcon: ({ color }) => <Icon name="map" color={String(color)} /> }} />
      <Tabs.Screen name="town" options={{ title: '동네', tabBarIcon: ({ color }) => <Icon name="trophy" color={String(color)} /> }} />
      <Tabs.Screen name="shop" options={{ title: '상점', tabBarIcon: ({ color }) => <Icon name="store" color={String(color)} /> }} />
    </Tabs>
  );
}
