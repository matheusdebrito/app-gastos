import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerStyle: { backgroundColor: '#f8fafc' }, headerTintColor: '#0f172a' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="new/index" options={{ title: 'Novo lançamento' }} />
        <Stack.Screen name="new/[type]" options={{ title: 'Cadastrar lançamento' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
