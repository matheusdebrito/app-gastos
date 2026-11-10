import { Tabs, router, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/components/UI';

const VISIBLE_TABS = [
  { name: 'dashboard', label: 'Início', path: '/(tabs)/dashboard' },
  { name: 'history', label: 'Histórico', path: '/(tabs)/history' },
] as const;

export default function MainTabs() {
  const pathname = usePathname();
  const c = useColors();

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!['/dashboard', '/history', '/categories', '/settings'].includes(pathname)) return false;
      if (pathname !== '/dashboard') {
        router.replace('/(tabs)/dashboard');
        return true;
      }
      return false;
    });
    return () => listener.remove();
  }, [pathname]);

  return <Tabs
    screenOptions={{ headerShown: false }}
    tabBar={({ state }) => <View style={[styles.bar, { backgroundColor: c.surface, borderTopColor: c.border }]}>
      {VISIBLE_TABS.map(tab => {
        const selected = state.routes[state.index]?.name === tab.name;
        return <Pressable
          key={tab.name}
          accessibilityRole="tab"
          accessibilityState={{ selected }}
          accessibilityLabel={tab.label}
          onPress={() => router.navigate(tab.path)}
          style={styles.item}
        >
          <Text style={{ color: selected ? c.primary : c.muted, fontWeight: selected ? '700' : '500', fontSize: 14 }}>{tab.label}</Text>
        </Pressable>;
      })}
      <Pressable accessibilityRole="button" accessibilityLabel="Adicionar gasto ou renda"
        style={[styles.add, { backgroundColor: c.primary }]} onPress={() => router.push('/new')}>
        <Text style={{ color: '#fff', fontSize: 27, fontWeight: '500' }}>+</Text>
      </Pressable>
    </View>}
  >
    <Tabs.Screen name="dashboard" options={{ title: 'Início' }} />
    <Tabs.Screen name="history" options={{ title: 'Histórico' }} />
    <Tabs.Screen name="categories" options={{ title: 'Categorias' }} />
    <Tabs.Screen name="settings" options={{ title: 'Configurações' }} />
  </Tabs>;
}

const styles = StyleSheet.create({
  bar: { height: 72, flexDirection: 'row', borderTopWidth: 1, alignItems: 'center', paddingHorizontal: 12 },
  item: { flex: 1, minHeight: 52, alignItems: 'center', justifyContent: 'center' },
  add: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginHorizontal: 15, marginBottom: 13, elevation: 3 },
});
