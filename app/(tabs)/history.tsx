import { router } from 'expo-router';
import React, {useMemo, useState} from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Entry, money, today } from '@/domain/finance';
import { useApp } from '@/state/AppState';
import { useEntries } from '@/hooks/useEntries';
import { Action, Chip, ChoiceRow, Field, Heading, MonthNav, Page, Panel, Txt, useColors } from '@/components/UI';

export default function History() {
  const ctx=useApp(),c=useColors();
  const [showFilters,setShowFilters]=useState(false);
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
    <Heading sub="Tudo o que entrou e saiu no mês">Lançamentos</Heading>
    <MonthNav month={ctx.historyMonth} onChange={ctx.setHistoryMonth}/>
    <ChoiceRow>
      {[['','Todos'],['expense','Gastos'],['income','Renda']].map(([value,label])=>
        <Chip key={value} label={label} selected={ctx.historyType===value}
          onPress={()=>{ctx.setHistoryType(value);ctx.setHistoryCategory('')}} />)}
      <Chip label={showFilters?'Fechar filtros':'Buscar e filtrar'}
        selected={showFilters} onPress={()=>setShowFilters(value=>!value)} />
    </ChoiceRow>
    {showFilters && <Panel>
      <Field label="Buscar" value={ctx.historySearch} onChangeText={ctx.setHistorySearch}
        placeholder="Descrição ou categoria" />
      <Txt bold size={13}>Categoria</Txt>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ChoiceRow>
          <Chip label="Todas" selected={!ctx.historyCategory} onPress={()=>ctx.setHistoryCategory('')} />
          {ctx.categories.filter(cat=>!ctx.historyType || cat.type===ctx.historyType).map(cat=>
            <Chip key={cat.id} label={cat.name} selected={ctx.historyCategory===cat.id}
              onPress={()=>ctx.setHistoryCategory(cat.id)} />)}
        </ChoiceRow>
      </ScrollView>
      <Txt bold size={13}>Ordenar por</Txt>
      <ChoiceRow>{[['date-desc','Recentes'],['date-asc','Antigos'],['amount-desc','Maior valor'],['amount-asc','Menor valor']].map(([value,label])=>
        <Chip key={value} label={label} selected={ctx.historySort===value}
          onPress={()=>ctx.setHistorySort(value)} />)}
      </ChoiceRow>
      <Action title="Limpar filtros" secondary
        onPress={()=>{ctx.setHistorySearch('');ctx.setHistoryType('');ctx.setHistoryCategory('');ctx.setHistorySort('date-desc')}} />
    </Panel>}
    <View style={{marginBottom:12}}>
      <Txt muted size={13}>{filtered.length} {filtered.length===1?'lançamento':'lançamentos'} neste mês</Txt>
    </View>
    {error && <Txt color={c.red}>{error}</Txt>}
    {filtered.length===0 && <Panel><Txt muted>Nenhum lançamento encontrado para este mês.</Txt></Panel>}
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
