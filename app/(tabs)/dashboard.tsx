import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { monthKey, money, shiftMonth, today, totals } from '@/domain/finance';
import { useApp } from '@/state/AppState';
import { useEntries } from '@/hooks/useEntries';
import { Action, ChoiceRow, Heading, MonthNav, Page, Panel, Txt, useColors, Chip } from '@/components/UI';

function Bars({value,max,color}: {value:number;max:number;color:string}) {
  return <View style={{height:9,borderRadius:8,backgroundColor:'#e2e8f0',overflow:'hidden',marginTop:7}}>
    <View style={{height:'100%',width:String(Math.min(100,max?value/max*100:0))+'%',backgroundColor:color,borderRadius:8}} />
  </View>;
}
export default function Dashboard() {
  const ctx=useApp(),c=useColors();
  const {data,error}=useEntries(ctx.dashboardMonth);
  const [months,setMonths]=useState(3);
  const {income,expense,result}=totals(data);
  const categories=useMemo(()=>{
    const map=new Map<string,number>();
    data.filter(e=>e.type==='expense').forEach(e=>map.set(e.categoryId,(map.get(e.categoryId)??0)+e.amountCents));
    return [...map].map(([id,amount])=>({id,amount,name:ctx.categories.find(c=>c.id===id)?.name??'Categoria'})).sort((a,b)=>b.amount-a.amount);
  },[data,ctx.categories]);
  const total = categories.reduce((s,x)=>s+x.amount,0);
  const max=Math.max(0,...categories.map(x=>x.amount));
  const forecast=ctx.dashboardMonth > monthKey(today());
  const safeMonths=Math.min(Math.max(months,1),24);
  const [evolution,setEvolution]=useState<{month:string;income:number;expense:number;result:number}[]>([]);
  React.useEffect(()=>{
    let active=true;
    const range=Array.from({length:safeMonths},(_,i)=>shiftMonth(ctx.dashboardMonth,i-safeMonths+1));
    Promise.all(range.map(async month=>({month,...totals(await ctx.entries(month))})))
      .then(values=>{if(active)setEvolution(values)}).catch(()=>{if(active)setEvolution([])});
    return ()=>{active=false};
  },[ctx.dashboardMonth,ctx.revision,ctx.entries,safeMonths]);
  const evolutionMax=Math.max(1,...evolution.flatMap(x=>[x.income,x.expense]));
  return <Page>
    <Heading sub="Acompanhe suas finanças mês a mês">Visão geral</Heading>
    <MonthNav month={ctx.dashboardMonth} onChange={ctx.setDashboardMonth} />
    {error && <Txt color={c.red}>{error}</Txt>}
    <Panel><Txt muted>{forecast?'Receitas previstas':'Receitas'}</Txt><Txt size={25} bold color={c.green}>{money(income)}</Txt></Panel>
    <Panel><Txt muted>{forecast?'Despesas previstas':'Despesas'}</Txt><Txt size={25} bold color={c.red}>{money(expense)}</Txt></Panel>
    <Panel><Txt muted>{forecast?'Resultado previsto':'Resultado do mês'}</Txt><Txt size={29} bold color={result<0?c.red:result>0?c.green:c.text}>{money(result)}</Txt></Panel>
    {!data.length && <Panel><Txt muted>Nenhum lançamento neste mês. Toque em + para registrar sua primeira movimentação.</Txt></Panel>}
    <Panel>
      <Txt bold size={18}>Gastos por categoria</Txt>
      {!categories.length ? <Txt muted>Nenhuma despesa neste mês.</Txt> : categories.map(x=><Pressable key={x.id} style={{marginTop:16}}
        onPress={()=>{ctx.setHistoryMonth(ctx.dashboardMonth);ctx.setHistoryType('expense');ctx.setHistoryCategory(x.id);router.navigate('/(tabs)/history')}}>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}><Txt>{x.name}</Txt><Txt bold>{money(x.amount)} · {Math.round(x.amount/total*100)}%</Txt></View>
        <Bars value={x.amount} max={max} color={c.red}/>
      </Pressable>)}
    </Panel>
    <Panel><Txt bold size={18}>Evolução financeira</Txt>
      <ChoiceRow>{[1,2,3,6,12].map(n=><Chip key={n} label={n+'m'} selected={months===n} onPress={()=>setMonths(n)} />)}</ChoiceRow>
      {evolution.map(x=><View key={x.month} style={{marginTop:12}}>
        <Txt size={12} muted>{x.month}</Txt>
        <Bars value={x.income} max={evolutionMax} color={c.green}/>
        <Bars value={x.expense} max={evolutionMax} color={c.red}/>
        <Txt muted size={11}>Receitas {money(x.income)} · Despesas {money(x.expense)} · Resultado {money(x.result)}</Txt>
      </View>)}
    </Panel>
    <Action title="Adicionar lançamento" onPress={()=>router.push('/new')} />
  </Page>;
}
