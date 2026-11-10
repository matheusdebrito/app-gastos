import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { monthKey, money, today, totals } from '@/domain/finance';
import { useApp } from '@/state/AppState';
import { useEntries } from '@/hooks/useEntries';
import { Action, Heading, MonthNav, Page, Panel, Txt, useColors } from '@/components/UI';

export default function Dashboard() {
  const app=useApp(),c=useColors();
  const {data,error,loading}=useEntries(app.dashboardMonth);
  const {income,expense,result}=totals(data);
  const forecast=app.dashboardMonth>monthKey(today());
  const expensesByCategory=useMemo(()=>{
    const byCategory=new Map<string,number>();
    data.filter(e=>e.type==='expense').forEach(e=>
      byCategory.set(e.categoryId,(byCategory.get(e.categoryId)??0)+e.amountCents));
    return [...byCategory].map(([id,amount])=>({
      id,amount,name:app.categories.find(cat=>cat.id===id)?.name??'Categoria'
    })).sort((a,b)=>b.amount-a.amount);
  },[data,app.categories]);

  function showCategory(categoryId:string) {
    app.setHistoryMonth(app.dashboardMonth);
    app.setHistoryType('expense');
    app.setHistoryCategory(categoryId);
    app.setHistorySearch('');
    app.setHistorySort('date-desc');
    router.navigate('/(tabs)/history');
  }

  return <Page>
    <Heading sub="Controle seu dinheiro de forma simples">Meu dinheiro</Heading>
    <MonthNav month={app.dashboardMonth} onChange={app.setDashboardMonth}/>
    {!!error&&<Panel><Txt color={c.red}>{error}</Txt></Panel>}
    <Panel style={{paddingVertical:22}}>
      <Txt muted size={14}>{forecast?'Despesas previstas':'Gastos no mês'}</Txt>
      {loading?
        <View style={{paddingVertical:17,alignItems:'flex-start'}}><ActivityIndicator size="large" color={c.primary}/></View>:
        <View style={{marginTop:7,marginBottom:18}}>
          <Txt bold size={37}>{money(expense)}</Txt>
        </View>}
      <View style={{flexDirection:'row',gap:13}}>
        <View style={{flex:1}}>
          <Txt muted size={13}>{forecast?'Receitas previstas':'Renda'}</Txt>
          <Txt bold size={19} color={c.green}>{loading?'—':money(income)}</Txt>
        </View>
        <View style={{width:1,backgroundColor:c.border}}/>
        <View style={{flex:1}}>
          <Txt muted size={13}>{forecast?'Resultado previsto':'Resultado'}</Txt>
          <Txt bold size={19} color={result<0?c.red:c.text}>{loading?'—':money(result)}</Txt>
        </View>
      </View>
    </Panel>
    <View style={{flexDirection:'row',gap:11,marginBottom:19}}>
      <View style={{flex:1}}>
        <Action title="+ Gasto" onPress={()=>router.push('/new/expense')}/>
      </View>
      <View style={{flex:1}}>
        <Action title="+ Renda" secondary onPress={()=>router.push('/new/income')}/>
      </View>
    </View>
    <Panel>
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <Txt bold size={18}>Gastos por categoria</Txt>
        <Pressable accessibilityRole="button" onPress={()=>showCategory('')} style={{paddingVertical:8}}>
          <Txt color={c.primary} size={13}>Ver todos</Txt>
        </Pressable>
      </View>
      {loading ? <Txt muted>Carregando categorias...</Txt> :
        !expensesByCategory.length ? <Txt muted>Você ainda não registrou gastos neste mês.</Txt> :
        expensesByCategory.map((cat,index)=><Pressable key={cat.id} accessibilityRole="button"
          accessibilityLabel={cat.name+' — '+money(cat.amount)} onPress={()=>showCategory(cat.id)}
          style={{paddingVertical:12,borderBottomWidth:index<expensesByCategory.length-1?1:0,borderColor:c.border}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:8}}>
            <View style={{flex:1}}><Txt>{cat.name}</Txt></View>
            <Txt bold>{money(cat.amount)}</Txt>
          </View>
          <View style={{backgroundColor:c.border,height:5,borderRadius:4,marginTop:9,overflow:'hidden'}}>
            <View style={{backgroundColor:c.primary,height:'100%',borderRadius:4,
              width:(expense?Math.min(100,cat.amount/expense*100):0)+'%'}}/>
          </View>
        </Pressable>)}
    </Panel>
    {!loading && !data.length&&<Txt muted size={13}>Comece registrando um gasto ou uma renda acima.</Txt>}
  </Page>;
}
