import { Tabs, router, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';

const TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  history: 'Histórico',
  categories: 'Categorias',
  settings: 'Configurações',
};

export default function MainTabs() {
  const segments=useSegments();
  useEffect(()=>{
    const sub=BackHandler.addEventListener('hardwareBackPress',()=>{
      if(segments[0] !== '(tabs)') return false;
      if(segments[1] !== 'dashboard') {
        router.replace('/(tabs)/dashboard');
        return true;
      }
      return false;
    });
    return ()=>sub.remove();
  },[segments]);
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state }) => (
        <View style={styles.bar}>
          {state.routes.map((route, index) => {
            const selected = state.index === index;
            return (
              <Pressable
                key={route.key}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={TITLES[route.name] ?? route.name}
                onPress={() => {
                  switch (route.name) {
                    case 'dashboard':
                      router.navigate('/(tabs)/dashboard');
                      break;
                    case 'history':
                      router.navigate('/(tabs)/history');
                      break;
                    case 'categories':
                      router.navigate('/(tabs)/categories');
                      break;
                    case 'settings':
                      router.navigate('/(tabs)/settings');
                      break;
                  }
                }}
                style={styles.item}
              >
                <Text style={[styles.tabLabel, selected && styles.selected]}>
                  {TITLES[route.name] ?? route.name}
                </Text>
              </Pressable>
            );
          })}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Adicionar lançamento"
            style={styles.add}
            onPress={() => router.push('/new')}
          >
            <Text style={styles.addText}>+</Text>
          </Pressable>
        </View>
      )}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="history" options={{ title: 'Histórico' }} />
      <Tabs.Screen name="categories" options={{ title: 'Categorias' }} />
      <Tabs.Screen name="settings" options={{ title: 'Configurações' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: { height: 76, flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingHorizontal: 5, alignItems: 'center' },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 52 },
  tabLabel: { color: '#64748b', fontSize: 10, textAlign: 'center' },
  selected: { color: '#0f172a', fontWeight: '700' },
  add: { position: 'absolute', left: '50%', top: -18, transform: [{ translateX: -25 }], width: 50, height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 25, backgroundColor: '#0f172a', elevation: 4 },
  addText: { color: '#fff', fontSize: 32, lineHeight: 40 },
});
