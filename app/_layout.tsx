import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Text, View } from 'react-native';
import { AppStateProvider, useApp } from '@/state/AppState';

function Routes() {
  const {ready,error,theme} = useApp();
  if(error) return <View style={{flex:1,justifyContent:'center',padding:24}}><Text>Erro ao abrir banco local: {error}</Text></View>;
  if (!ready) return <View style={{flex:1,justifyContent:'center'}}><ActivityIndicator /></View>;
  return <>
    <Stack screenOptions={{headerStyle:{backgroundColor:'#f8fafc'},headerTintColor:'#0f172a'}}>
      <Stack.Screen name="(tabs)" options={{headerShown:false}} />
      <Stack.Screen name="new/index" options={{title:'Novo lançamento'}} />
      <Stack.Screen name="new/[type]" options={{title:'Cadastrar lançamento'}} />
      <Stack.Screen name="entry/[id]" options={{title:'Editar lançamento'}} />
    </Stack>
    <StatusBar style={theme==='dark'?'light':'auto'} />
  </>;
}
export default function RootLayout() {
  return <AppStateProvider><Routes /></AppStateProvider>;
}
