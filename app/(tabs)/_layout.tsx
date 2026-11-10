import { Tabs, router, usePathname } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { BackHandler, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/components/UI';

const TABS = [
  { name: 'dashboard', label: 'Início', href: '/(tabs)/dashboard', ios: 'house.fill', android: 'home' },
  { name: 'history', label: 'Histórico', href: '/(tabs)/history', ios: 'list.bullet.rectangle', android: 'receipt_long' },
  { name: 'categories', label: 'Categorias', href: '/(tabs)/categories', ios: 'square.grid.2x2', android: 'category' },
  { name: 'settings', label: 'Ajustes', href: '/(tabs)/settings', ios: 'gearshape', android: 'settings' },
] as const;

export default function MainTabs() {
  const pathname=usePathname();
  const insets=useSafeAreaInsets();
  const c=useColors();
  const [quickOpen,setQuickOpen]=useState(false);
  useEffect(()=>{
    const sub=BackHandler.addEventListener('hardwareBackPress',()=>{
      if(!['/dashboard','/history','/categories','/settings'].includes(pathname)) return false;
      if(pathname!=='/dashboard'){
        router.replace('/(tabs)/dashboard');
        return true;
      }
      return false;
    });
    return ()=>sub.remove();
  },[pathname]);

  function option(label:string,href:'/new/income'|'/new/expense',icon:'arrow_downward'|'arrow_upward',tint:string){
    return <Pressable accessibilityRole="button" accessibilityLabel={label} key={href}
      onPress={()=>{setQuickOpen(false);router.push(href)}}
      style={({pressed})=>[{flexDirection:'row',alignItems:'center',gap:14,padding:17,
        borderRadius:15,backgroundColor:c.bg,opacity:pressed?0.72:1,marginTop:9}]}>
      <SymbolView name={{ios:href==='/new/income'?'arrow.down.circle.fill':'arrow.up.circle.fill',android:icon,web:icon}}
        size={25} tintColor={tint}/>
      <Text style={{fontWeight:'700',fontSize:17,color:c.text}}>{label}</Text>
    </Pressable>;
  }
  return <Tabs initialRouteName="dashboard" backBehavior="none" screenOptions={{headerShown:false}}
    tabBar={({state})=><View style={[styles.bar,{backgroundColor:c.surface,borderTopColor:c.border,
      paddingBottom:Math.max(8,insets.bottom),height:66+Math.max(8,insets.bottom)}]}>
      {TABS.slice(0,2).map(item=>tab(item,state.routes[state.index]?.name===item.name))}
      <View style={{flex:0.98,alignItems:'center',justifyContent:'center'}}>
        <Pressable accessibilityRole="button" accessibilityLabel="Adicionar gasto ou renda"
          onPress={()=>setQuickOpen(true)} style={({pressed})=>[styles.fab,{backgroundColor:c.primary,opacity:pressed?0.8:1}]}>
          <SymbolView name={{ios:'plus',android:'add',web:'add'}} size={29} tintColor="#fff"/>
        </Pressable>
      </View>
      {TABS.slice(2).map(item=>tab(item,state.routes[state.index]?.name===item.name))}
      <Modal transparent visible={quickOpen} animationType="fade" onRequestClose={()=>setQuickOpen(false)}>
        <View style={{flex:1,justifyContent:'flex-end'}}>
          <Pressable accessibilityRole="button" accessibilityLabel="Fechar menu"
            style={[StyleSheet.absoluteFill,{backgroundColor:'rgba(0,0,0,0.38)'}]} onPress={()=>setQuickOpen(false)}/>
          <View style={{backgroundColor:c.surface,borderTopLeftRadius:26,borderTopRightRadius:26,
            paddingHorizontal:20,paddingTop:22,paddingBottom:Math.max(insets.bottom+20,32)}}>
            <Text style={{color:c.text,fontSize:21,fontWeight:'800',marginBottom:12}}>Adicionar lançamento</Text>
            {option('Novo gasto','/new/expense','arrow_upward',c.red)}
            {option('Nova renda','/new/income','arrow_downward',c.green)}
            <Pressable accessibilityRole="button" onPress={()=>setQuickOpen(false)} style={{alignItems:'center',padding:15}}>
              <Text style={{fontWeight:'600',color:c.muted}}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>}>
      <Tabs.Screen name="dashboard" options={{title:'Início'}}/>
      <Tabs.Screen name="history" options={{title:'Histórico'}}/>
      <Tabs.Screen name="categories" options={{title:'Categorias'}}/>
      <Tabs.Screen name="settings" options={{title:'Ajustes'}}/>
    </Tabs>;

  function tab(item:typeof TABS[number],selected:boolean) {
    return <Pressable key={item.name} accessibilityRole="tab" accessibilityState={{selected}}
      accessibilityLabel={item.label} onPress={()=>router.navigate(item.href)}
      style={({pressed})=>[styles.tab,{opacity:pressed?0.65:1}]}>
      <SymbolView name={{ios:item.ios,android:item.android,web:item.android}} size={23}
        tintColor={selected?c.primary:c.muted}/>
      <Text style={{color:selected?c.primary:c.muted,fontSize:10.5,fontWeight:selected?'700':'500',marginTop:3}}>{item.label}</Text>
    </Pressable>;
  }
}
const styles=StyleSheet.create({
  bar:{flexDirection:'row',alignItems:'center',borderTopWidth:1,paddingHorizontal:5},
  tab:{flex:1,alignItems:'center',justifyContent:'center',minHeight:53},
  fab:{width:55,height:55,borderRadius:18,alignItems:'center',justifyContent:'center',
    marginTop:-24,elevation:5}
});
