import { router } from 'expo-router';
import React, {useMemo} from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Entry, money, today } from '@/domain/finance';
import { useApp } from '@/state/AppState';
import { useEntries } from '@/hooks/useEntries';
import { Action, Chip, ChoiceRow, Field, Heading, MonthNav, Page, Panel, Txt, useColors } from '@/components/UI';

export default function History() {
  const ctx=useApp(),c=useColors();
  const {data,error}=useEntries(ctx.historyMonth);
  const filtered=useMemo(()=>{
    const query=ctx.historySearch.trim().toLocaleLowerCase('pt-BR');
    const list=data.filter(e=>(!ctx.historyType||e.type===ctx.historyType) &&
      (!ctx.historyCategory||e.categoryId===ctx.historyCategory) &&
      (!query|| (e.description+' '+(ctx.categories.find(cat=>cat.id===e.categoryId)?.name??'')).toLocaleLowerCase('pt-BR').includes(query)));
    const byValue=ctx.historySort.startsWith('amount');
    const descending=ctx.historySort.endsWith('desc');
    list.sort((a,b)=>{
      const d=byValue?a.amountCents-b.amountCents:a.date.localeCompare(b.date);
      return descending?-d:d;
    });
    return list;
  },[data,ctx.historySearch,ctx.historyType,ctx.historyCategory,ctx.historySort,ctx.categories]);
  const showDay=ctx.historySort.startsWith('date');
  const todayDate=today();
  let previous='';
  return <Page>
    <Heading sub="Consulte e organize suas movimentações">Histórico</Heading>
    <MonthNav month={ctx.historyMonth} onChange={ctx.setHistoryMonth}/>
    <Field label="Buscar descrição ou categoria" value={ctx.historySearch} onChangeText={ctx.setHistorySearch} placeholder="Buscar lançamentos"/>
    <ChoiceRow>{[['','Todos'],['income','Receitas'],['expense','Despesas']].map(([value,label])=><Chip key={value} label={label} selected={ctx.historyType===value}
      onPress={()=>{ctx.setHistoryType(value);ctx.setHistoryCategory('')}}/>)}</ChoiceRow>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{maxHeight:55}}>
      <ChoiceRow><Chip label="Todas categorias" selected={!ctx.historyCategory} onPress={()=>ctx.setHistoryCategory('')} />
        {ctx.categories.filter(x=>!ctx.historyType||x.type===ctx.historyType).map(x=>
          <Chip key={x.id} label={x.name} selected={ctx.historyCategory===x.id} onPress={()=>ctx.setHistoryCategory(x.id)} />)}
      </ChoiceRow>
    </ScrollView>
    <ChoiceRow>{[['date-desc','Mais recentes'],['date-asc','Mais antigos'],['amount-desc','Maior valor'],['amount-asc','Menor valor']].map(([value,label])=>
      <Chip key={value} label={label} selected={ctx.historySort===value} onPress={()=>ctx.setHistorySort(value)} />)}</ChoiceRow>
    {(ctx.historySearch||ctx.historyType||ctx.historyCategory) && <Action title="Limpar filtros" secondary onPress={()=>{ctx.setHistorySearch('');ctx.setHistoryType('');ctx.setHistoryCategory('')}}/>}
    {error && <Txt color={c.red}>{error}</Txt>}
    {filtered.length===0 && <Panel><Txt muted>{ctx.historySearch?'Nenhum lançamento encontrado':'Nenhum lançamento neste período.'}</Txt></Panel>}
    {filtered.map(e=>{
      const name=ctx.categories.find(x=>x.id===e.categoryId)?.name??'Categoria';
      const dayHeader=showDay&&previous!==e.date;
      previous=e.date;
      return <React.Fragment key={e.id}>
        {dayHeader && <Text style={{marginTop:13,marginBottom:5,fontWeight:'700',color:c.muted}}>{e.date.split('-').reverse().join('/')}</Text>}
        <Pressable onPress={()=>router.push({pathname:'/entry/[id]',params:{id:e.id,month:ctx.historyMonth}})}>
          <Panel style={{marginBottom:7}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <View style={{flex:1,paddingRight:8}}>
                <Txt bold>{e.description||name}{e.kind==='installment'?' — '+e.position+'/'+e.totalPositions:''}</Txt>
                <Txt muted size={12}>{name} · {e.date.split('-').reverse().join('/')}
                  {e.kind==='recurring'?' · ↻':''}</Txt>
                {e.date>todayDate && <Txt size={11} color={c.primary}>Previsto</Txt>}
              </View>
              <Txt bold color={e.type==='income'?c.green:c.red}>{e.type==='income'?'+':'−'}{money(e.amountCents)}</Txt>
            </View>
          </Panel>
        </Pressable>
      </React.Fragment>;
    })}
  </Page>;
}
