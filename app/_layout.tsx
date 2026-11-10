import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { AppStateProvider, useApp } from '@/state/AppState';

function Routes() {
  const {ready,error,theme,undoItems,restoreUndo} = useApp();
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
    {!!undoItems.length && <View pointerEvents="box-none" style={{position:'absolute',bottom:90,left:12,right:12,gap:5}}>
      {undoItems.map(item=><View key={item.id} style={{backgroundColor:'#1e293b',borderRadius:12,padding:12,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <Text style={{color:'#fff',flex:1}}>Lançamento excluído</Text>
        <Pressable accessibilityRole="button" onPress={()=>{void restoreUndo(item.id)}} style={{padding:6}}><Text style={{color:'#93c5fd',fontWeight:'700'}}>Desfazer</Text></Pressable>
      </View>)}
    </View>}
  </>;
}
export default function RootLayout() {
  return <AppStateProvider><Routes /></AppStateProvider>;
}
