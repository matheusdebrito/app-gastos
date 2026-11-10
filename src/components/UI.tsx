import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import { shiftMonth } from '@/domain/finance';
import { useApp } from '@/state/AppState';

export function useColors() {
  const system = useColorScheme();
  const { theme } = useApp();
  const dark = theme === 'dark' || (theme === 'auto' && system === 'dark');
  return {
    bg: dark ? '#0b1220' : '#f5f7fb',
    surface: dark ? '#182235' : '#ffffff',
    text: dark ? '#f8fafc' : '#0f172a',
    muted: dark ? '#a6b5ca' : '#64748b',
    border: dark ? '#314158' : '#e4e9f0',
    primary: dark ? '#60a5fa' : '#2563eb',
    green: '#16a34a', red: '#dc2626',
    dark
  };
}
export function Page({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  const c = useColors();
  if (!scroll) return <View style={{flex:1,backgroundColor:c.bg,padding:18}}>{children}</View>;
  return <ScrollView keyboardShouldPersistTaps="handled" style={{flex:1,backgroundColor:c.bg}}
    contentContainerStyle={{padding:18,paddingBottom:110}}>{children}</ScrollView>;
}
export function Heading({ children, sub }: { children: React.ReactNode; sub?: string }) {
  const c=useColors();
  return <View style={{marginBottom:18}}><Text accessibilityRole="header" style={{fontSize:27,fontWeight:'800',color:c.text}}>{children}</Text>
    {!!sub && <Text style={{color:c.muted,marginTop:5,fontSize:13}}>{sub}</Text>}</View>;
}
export function Panel({children, style}: {children:React.ReactNode;style?:object}) {
  const c=useColors();
  return <View style={[{backgroundColor:c.surface,borderColor:c.border,borderWidth:1,borderRadius:17,padding:16,marginBottom:13},style]}>{children}</View>;
}
export function Txt({children,muted=false,bold=false,size=15,color}: {children:React.ReactNode;muted?:boolean;bold?:boolean;size?:number;color?:string}) {
  const c=useColors();
  return <Text style={{color:color ?? (muted?c.muted:c.text),fontSize:size,fontWeight:bold?'700':'400'}}>{children}</Text>;
}
export function Action({title,onPress,secondary=false,danger=false,disabled=false}: {title:string;onPress:()=>void;secondary?:boolean;danger?:boolean;disabled?:boolean}) {
  const c=useColors();
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
    style={{backgroundColor:secondary?c.surface:danger?c.red:c.primary,borderWidth:secondary?1:0,borderColor:c.border,opacity:disabled?.45:1,
      borderRadius:12,paddingVertical:13,paddingHorizontal:14,alignItems:'center',justifyContent:'center',marginVertical:5}}>
    <Text style={{fontWeight:'700',color:secondary?c.text:'#fff'}}>{title}</Text>
  </Pressable>;
}
export function Chip({label,onPress,selected=false}: {label:string;onPress:()=>void;selected?:boolean}) {
  const c=useColors();
  return <Pressable accessibilityRole="button" onPress={onPress} style={{paddingHorizontal:12,paddingVertical:9,borderRadius:12,
    marginRight:7,marginBottom:6,backgroundColor:selected?c.primary:c.surface,borderWidth:1,borderColor:selected?c.primary:c.border}}>
    <Text style={{color:selected?'white':c.text,fontWeight:selected?'700':'500',fontSize:13}}>{label}</Text>
  </Pressable>;
}
export function ChoiceRow({children}: {children:React.ReactNode}) {
  return <View style={{flexDirection:'row',flexWrap:'wrap',marginVertical:6}}>{children}</View>;
}
export function Field({label,value,onChangeText,placeholder,keyboardType='default',autoFocus=false}: {
  label:string;value:string;onChangeText:(v:string)=>void;placeholder?:string;
  keyboardType?:'default'|'numeric'|'number-pad';autoFocus?:boolean
}) {
  const c=useColors();
  return <View style={{marginVertical:8}}><Txt bold size={13}>{label}</Txt>
    <TextInput accessibilityLabel={label} value={value} onChangeText={onChangeText} placeholder={placeholder}
      placeholderTextColor={c.muted} keyboardType={keyboardType} autoFocus={autoFocus}
      style={{color:c.text,backgroundColor:c.surface,borderColor:c.border,borderWidth:1,borderRadius:12,
        paddingHorizontal:13,paddingVertical:12,marginTop:7,fontSize:16}} /></View>;
}
export function MonthNav({month,onChange}: {month:string;onChange:(m:string)=>void}) {
  const c=useColors();
  const [manual,setManual]=useState(month);
  const [editing,setEditing]=useState(false);
  useEffect(()=>setManual(month),[month]);
  const [y,m]=month.split('-').map(Number);
  const name=new Date(y,m-1,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
  return <View style={{marginBottom:16}}><View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
    <Pressable onPress={()=>onChange(shiftMonth(month,-1))} accessibilityLabel="Mês anterior" style={styles.arrow}><Txt bold size={25}>‹</Txt></Pressable>
    <View style={{alignItems:'center'}}><Text style={{color:c.text,fontSize:18,fontWeight:'700',textTransform:'capitalize'}}>{name}</Text>
      {month > new Date().getFullYear()+'-'+String(new Date().getMonth()+1).padStart(2,'0') && <Txt size={11} color={c.primary}>Previsto</Txt>}
    </View>
    <Pressable onPress={()=>onChange(shiftMonth(month,1))} accessibilityLabel="Próximo mês" style={styles.arrow}><Txt bold size={25}>›</Txt></Pressable>
  </View><Pressable accessibilityRole="button" onPress={()=>setEditing(!editing)} style={{alignItems:'center',padding:4}}><Text style={{color:c.primary,fontSize:12}}>Selecionar mês/ano</Text></Pressable>
    {editing&&<View style={{flexDirection:'row',gap:8,alignItems:'center'}}><TextInput value={manual} onChangeText={setManual} placeholder="AAAA-MM" placeholderTextColor={c.muted} style={{flex:1,borderWidth:1,borderColor:c.border,color:c.text,padding:10,borderRadius:10}}/>
      <Pressable accessibilityRole="button" onPress={()=>{if(/^\\d{4}-(0[1-9]|1[0-2])$/.test(manual)){onChange(manual);setEditing(false)}}} style={{backgroundColor:c.primary,padding:10,borderRadius:10}}><Text style={{color:'#fff'}}>Ir</Text></Pressable></View>}
  </View>;
}
const styles=StyleSheet.create({arrow:{paddingHorizontal:15,paddingVertical:6}});
export function Loading() {const c=useColors();return <View style={{flex:1,backgroundColor:c.bg,alignItems:'center',justifyContent:'center'}}><ActivityIndicator color={c.primary} size="large" /><Text style={{marginTop:12,color:c.muted}}>Carregando seus dados...</Text></View>}
export function Divider() {const c=useColors();return <View style={{height:1,backgroundColor:c.border,marginVertical:10}} />}
