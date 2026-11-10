import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shiftMonth } from '@/domain/finance';
import { useApp } from '@/state/AppState';

export function useColors() {
  const system = useColorScheme();
  const { theme } = useApp();
  const dark = theme === 'dark' || (theme === 'auto' && system === 'dark');
  return {
    bg: dark ? '#0D1524' : '#F6F8FB',
    surface: dark ? '#192538' : '#FFFFFF',
    text: dark ? '#F8FAFC' : '#182338',
    muted: dark ? '#A8B7CC' : '#667489',
    border: dark ? '#354258' : '#E5EAF1',
    primary: dark ? '#81A9FF' : '#315FD5',
    primaryFill: '#315FD5',
    dangerFill: '#B93340',
    green: dark ? '#57D7A3' : '#147D58',
    red: dark ? '#FF8D91' : '#C43D49',
    dark
  };
}

export function Page({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  const c = useColors();
  const pathname=usePathname();
  const insets=useSafeAreaInsets();
  const tabScreen=['/dashboard','/history','/categories','/settings'].includes(pathname);
  const top=tabScreen?Math.max(22,insets.top+12):22;
  if (!scroll) return <View style={{flex:1,backgroundColor:c.bg,paddingHorizontal:18,paddingTop:top}}>{children}</View>;
  return <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
    style={{flex:1,backgroundColor:c.bg}} contentContainerStyle={{paddingHorizontal:18,paddingTop:top,paddingBottom:105}}>
    {children}
  </ScrollView>;
}
export function Heading({ children, sub }: { children: React.ReactNode; sub?: string }) {
  const c = useColors();
  return <View style={{marginBottom:20}}>
    <Text accessibilityRole="header" style={{fontSize:27,fontWeight:'800',letterSpacing:-0.6,color:c.text}}>{children}</Text>
    {sub && <Text style={{color:c.muted,fontSize:14,marginTop:5}}>{sub}</Text>}
  </View>;
}
export function Panel({children,style}: {children:React.ReactNode;style?:object}) {
  const c=useColors();
  return <View style={[{backgroundColor:c.surface,borderRadius:20,padding:18,marginBottom:14,borderWidth:1,borderColor:c.border},style]}>{children}</View>;
}
export function Txt({children,muted=false,bold=false,size=15,color}: {children:React.ReactNode;muted?:boolean;bold?:boolean;size?:number;color?:string}) {
  const c=useColors();
  return <Text style={{color:color ?? (muted?c.muted:c.text),fontSize:size,fontWeight:bold?'700':'400'}}>{children}</Text>;
}
export function Action({title,onPress,secondary=false,danger=false,disabled=false}: {title:string;onPress:()=>void;secondary?:boolean;danger?:boolean;disabled?:boolean}) {
  const c=useColors();
  return <Pressable accessibilityRole="button" accessibilityState={{disabled}} disabled={disabled} onPress={onPress}
    style={({pressed})=>({backgroundColor:secondary?c.surface:danger?c.dangerFill:c.primaryFill,
      borderWidth:secondary?1:0,borderColor:c.border,opacity:disabled?0.45:pressed?0.78:1,
      minHeight:51,borderRadius:14,paddingVertical:13,paddingHorizontal:15,
      alignItems:'center',justifyContent:'center',marginVertical:4})}>
    <Text style={{fontWeight:'700',fontSize:15,color:secondary?c.text:'#fff'}}>{title}</Text>
  </Pressable>;
}
export function Chip({label,onPress,selected=false}: {label:string;onPress:()=>void;selected?:boolean}) {
  const c=useColors();
  return <Pressable accessibilityRole="button" accessibilityState={{selected}} onPress={onPress}
    style={({pressed})=>({paddingHorizontal:14,paddingVertical:10,borderRadius:12,marginRight:7,marginBottom:7,
      backgroundColor:selected?c.primaryFill:c.surface,borderWidth:1,borderColor:selected?c.primaryFill:c.border,
      opacity:pressed?0.75:1})}>
    <Text style={{color:selected?'#fff':c.text,fontSize:13,fontWeight:selected?'700':'500'}}>{label}</Text>
  </Pressable>;
}
export function ChoiceRow({children}: {children:React.ReactNode}) {
  return <View style={{flexDirection:'row',flexWrap:'wrap',marginTop:9,marginBottom:5}}>{children}</View>;
}
export function Field({label,value,onChangeText,placeholder,keyboardType='default',autoFocus=false,editable=true}:{
  label:string;value:string;onChangeText:(v:string)=>void;placeholder?:string;
  keyboardType?:'default'|'numeric'|'number-pad';autoFocus?:boolean;editable?:boolean;
}) {
  const c=useColors();
  return <View style={{marginVertical:9}}>
    <Text style={{fontSize:13,fontWeight:'600',color:c.text}}>{label}</Text>
    <TextInput accessibilityLabel={label} value={value} onChangeText={onChangeText}
      placeholder={placeholder} placeholderTextColor={c.muted} keyboardType={keyboardType}
      autoFocus={autoFocus} editable={editable}
      style={{color:c.text,backgroundColor:c.surface,borderColor:c.border,borderWidth:1,
        borderRadius:13,paddingHorizontal:14,paddingVertical:12,marginTop:7,fontSize:16,
        opacity:editable?1:0.7}}/>
  </View>;
}

const MONTHS=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
export function MonthNav({month,onChange}:{month:string;onChange:(m:string)=>void}) {
  const c=useColors();
  const [expanded,setExpanded]=useState(false);
  const [year,setYear]=useState(Number(month.slice(0,4)));
  useEffect(()=>setYear(Number(month.slice(0,4))),[month]);
  const [y,m]=month.split('-').map(Number);
  const canPrevious=y>1900 || (y===1900&&m>1);
  const canNext=y<9999 || (y===9999&&m<12);
  const name=new Date(y,m-1,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
  const future=month>new Date().getFullYear()+'-'+String(new Date().getMonth()+1).padStart(2,'0');
  return <View style={{marginBottom:19}}>
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
      <Pressable accessibilityRole="button" accessibilityLabel="Mês anterior" disabled={!canPrevious} onPress={()=>onChange(shiftMonth(month,-1))}
        hitSlop={8} style={styles.monthArrow}>
        <SymbolView name={{ios:'chevron.left',android:'chevron_left',web:'chevron_left'}} size={24} tintColor={c.text}/>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Selecionar mês e ano" onPress={()=>setExpanded(v=>!v)}
        style={{alignItems:'center',padding:10,flexDirection:'row',gap:8}}>
        <Text style={{fontSize:18,fontWeight:'700',color:c.text,textTransform:'capitalize'}}>{name}</Text>
        <SymbolView name={{ios:'chevron.down',android:'expand_more',web:'expand_more'}} size={20} tintColor={c.muted}/>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Mês seguinte" disabled={!canNext} onPress={()=>onChange(shiftMonth(month,1))}
        hitSlop={8} style={styles.monthArrow}>
        <SymbolView name={{ios:'chevron.right',android:'chevron_right',web:'chevron_right'}} size={24} tintColor={c.text}/>
      </Pressable>
    </View>
    {future && <Text style={{textAlign:'center',color:c.primary,fontSize:12,fontWeight:'600'}}>Previsto</Text>}
    {expanded && <View style={{backgroundColor:c.surface,borderRadius:18,borderWidth:1,borderColor:c.border,padding:14,marginTop:10}}>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <Pressable accessibilityLabel="Ano anterior" disabled={year<=1900} onPress={()=>setYear(v=>v-1)} style={styles.monthArrow}>
          <Txt bold size={21}>‹</Txt>
        </Pressable>
        <Txt bold size={17}>{year}</Txt>
        <Pressable accessibilityLabel="Ano seguinte" disabled={year>=9999} onPress={()=>setYear(v=>v+1)} style={styles.monthArrow}>
          <Txt bold size={21}>›</Txt>
        </Pressable>
      </View>
      <View style={{flexDirection:'row',flexWrap:'wrap'}}>
        {MONTHS.map((label,i)=>{
          const selected=year===y&&i+1===m;
          return <Pressable key={label} accessibilityRole="button" accessibilityLabel={label+' '+year}
            onPress={()=>{onChange(year+'-'+String(i+1).padStart(2,'0'));setExpanded(false)}}
            style={{width:'25%',padding:3}}>
            <View style={{backgroundColor:selected?c.primaryFill:c.bg,borderRadius:10,paddingVertical:12,alignItems:'center'}}>
              <Text style={{color:selected?'#fff':c.text,fontWeight:selected?'700':'500',fontSize:13}}>{label}</Text>
            </View>
          </Pressable>;
        })}
      </View>
    </View>}
  </View>;
}
const styles=StyleSheet.create({monthArrow:{minHeight:44,minWidth:44,alignItems:'center',justifyContent:'center'}});
export function Loading() {
  const c=useColors();
  return <View style={{flex:1,backgroundColor:c.bg,alignItems:'center',justifyContent:'center'}}>
    <ActivityIndicator color={c.primary} size="large"/>
    <Text style={{marginTop:12,color:c.muted}}>Carregando seus dados...</Text>
  </View>;
}
export function Divider() {const c=useColors();return <View style={{height:1,backgroundColor:c.border,marginVertical:12}}/>}
