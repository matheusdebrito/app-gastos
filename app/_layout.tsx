import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { AppStateProvider, useApp } from '@/state/AppState';

function Routes() {
  const {ready,error,retryInit,theme,undoItems,restoreUndo,notice,notify} = useApp();
  if(error) return <View style={{flex:1,justifyContent:'center',padding:24,gap:14}}>
    <Text style={{fontSize:22,fontWeight:'700',color:'#0f172a'}}>Não foi possível abrir seus dados</Text>
    <Text style={{fontSize:14,color:'#475569'}}>Seus lançamentos não foram apagados. Tente abrir novamente.</Text>
    <Text style={{fontSize:12,color:'#64748b'}}>{error}</Text>
    <Pressable accessibilityRole="button" onPress={retryInit}
      style={{backgroundColor:'#315FD5',padding:15,borderRadius:14,alignItems:'center'}}>
      <Text style={{color:'#fff',fontWeight:'700'}}>Tentar novamente</Text>
    </Pressable>
  </View>;
  if (!ready) return <View style={{flex:1,justifyContent:'center'}}><ActivityIndicator /></View>;
  return <>
    <Stack screenOptions={{headerStyle:{backgroundColor:'#f8fafc'},headerTintColor:'#0f172a'}}>
      <Stack.Screen name="(tabs)" options={{headerShown:false}} />
      <Stack.Screen name="new/index" options={{title:'Novo lançamento'}} />
      <Stack.Screen name="new/[type]" options={{title:'Cadastrar lançamento'}} />
      <Stack.Screen name="entry/[id]" options={{title:'Detalhes'}} />
      <Stack.Screen name="entry/edit/[id]" options={{title:'Editar lançamento'}} />
    </Stack>
    <StatusBar style={theme==='dark'?'light':'auto'} />
    {!!notice && <View pointerEvents="none" style={{position:'absolute',bottom:170,left:22,right:22,backgroundColor:'#1E293B',
      borderRadius:12,padding:13,alignItems:'center'}}>
      <Text style={{color:'#fff',fontWeight:'600'}}>{notice}</Text>
    </View>}
    {!!undoItems.length && <View pointerEvents="box-none" style={{position:'absolute',bottom:90,left:12,right:12,gap:5}}>
      {undoItems.map(item=><View key={item.id} style={{backgroundColor:'#1e293b',borderRadius:12,padding:12,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <Text style={{color:'#fff',flex:1}}>Lançamento excluído</Text>
        <Pressable accessibilityRole="button" onPress={()=>{void restoreUndo(item.id).catch(()=>notify('Não foi possível desfazer a exclusão.'))}} style={{padding:6}}><Text style={{color:'#93c5fd',fontWeight:'700'}}>Desfazer</Text></Pressable>
      </View>)}
    </View>}
  </>;
}
export default function RootLayout() {
  return <AppStateProvider><Routes /></AppStateProvider>;
}
