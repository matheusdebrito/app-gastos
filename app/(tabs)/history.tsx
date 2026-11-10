import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { formatBRDate, money, today } from '@/domain/finance';
import { useApp } from '@/state/AppState';
import { useEntries } from '@/hooks/useEntries';
import { Action, Chip, ChoiceRow, Field, Heading, MonthNav, Page, Panel, Txt, useColors } from '@/components/UI';

export default function History() {
  const app=useApp(),c=useColors();
  const {data,error,loading}=useEntries(app.historyMonth);
  const [showFilters,setShowFilters]=useState(false);
  const filtered=useMemo(()=>{
    const query=app.historySearch.trim().toLocaleLowerCase('pt-BR');
    const list=data.filter(e=>
      (!app.historyType||e.type===app.historyType)&&
      (!app.historyCategory||e.categoryId===app.historyCategory)&&
      (!query||(e.description+' '+(app.categories.find(cat=>cat.id===e.categoryId)?.name??''))
        .toLocaleLowerCase('pt-BR').includes(query)));
    const byValue=app.historySort.startsWith('amount');
    const desc=app.historySort.endsWith('desc');
    return list.sort((a,b)=>{
      const d=byValue?a.amountCents-b.amountCents:a.date.localeCompare(b.date);
      return desc?-d:d;
    });
  },[data,app.categories,app.historySearch,app.historyType,app.historyCategory,app.historySort]);
  const filters=!!(app.historyType||app.historyCategory||app.historySearch);
  const showDay=app.historySort.startsWith('date');
  const now=today();
  let prevDate='';
  const clear=()=>{
    app.setHistorySearch('');app.setHistoryType('');app.setHistoryCategory('');
  };

  return <Page>
    <Heading sub="Consulte os lançamentos de cada mês">Histórico</Heading>
    <MonthNav month={app.historyMonth} onChange={app.setHistoryMonth}/>
    <ChoiceRow>
      {[['','Todos'],['expense','Gastos'],['income','Renda']].map(([value,label])=>
        <Chip key={value} label={label} selected={app.historyType===value}
          onPress={()=>{app.setHistoryType(value);app.setHistoryCategory('')}}/>)}
      <Chip label={showFilters?'Fechar filtros':'Filtros'}
        selected={showFilters} onPress={()=>setShowFilters(v=>!v)}/>
    </ChoiceRow>
    {filters && <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:4,marginBottom:11}}>
      <Txt muted size={13}>{app.historyCategory
        ? 'Categoria: '+(app.categories.find(cat=>cat.id===app.historyCategory)?.name??'Selecionada')
        : app.historySearch?'Busca ativa':'Filtro de tipo ativo'}</Txt>
      <Pressable accessibilityRole="button" onPress={clear} style={{padding:7}}>
        <Txt color={c.primary} bold size={13}>Limpar filtros</Txt>
      </Pressable>
    </View>}
    {showFilters&&<Panel>
      <Field label="Buscar lançamento" placeholder="Descrição ou categoria"
        value={app.historySearch} onChangeText={app.setHistorySearch}/>
      <Txt bold size={13}>Categoria</Txt>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled>
        <ChoiceRow>
          <Chip label="Todas" selected={!app.historyCategory} onPress={()=>app.setHistoryCategory('')}/>
          {app.categories.filter(cat=>!app.historyType||cat.type===app.historyType).map(cat=>
            <Chip key={cat.id} label={cat.name} selected={app.historyCategory===cat.id}
              onPress={()=>app.setHistoryCategory(cat.id)}/>)}
        </ChoiceRow>
      </ScrollView>
      <Txt bold size={13}>Ordenar por</Txt>
      <ChoiceRow>{[['date-desc','Mais recentes'],['date-asc','Mais antigos'],['amount-desc','Maior valor'],['amount-asc','Menor valor']].map(([value,label])=>
        <Chip key={value} label={label} selected={app.historySort===value}
          onPress={()=>app.setHistorySort(value)}/>)}
      </ChoiceRow>
    </Panel>}
    {!!error&&<Panel><Txt color={c.red}>{error}</Txt></Panel>}
    <View style={{marginTop:9,marginBottom:12}}>
      <Txt muted size={13}>{!loading&&filtered.length+' '+(filtered.length===1?'lançamento':'lançamentos')}</Txt>
    </View>
    {loading?<View style={{padding:30,alignItems:'center'}}><ActivityIndicator color={c.primary}/></View>:
      !filtered.length?<Panel>
        <Txt muted>Não há lançamentos para esta seleção.</Txt>
        {!filters&&<View style={{marginTop:12}}><Action title="+ Adicionar" onPress={()=>router.push('/new')}/></View>}
      </Panel>:
      <Panel style={{paddingVertical:3}}>
        {filtered.map((e,index)=>{
          const category=app.categories.find(cat=>cat.id===e.categoryId)?.name??'Categoria';
          const dayHeader=showDay&&prevDate!==e.date;
          prevDate=e.date;
          const title=e.description||category;
          return <React.Fragment key={e.id}>
            {dayHeader&&<Text style={{fontSize:12,fontWeight:'700',color:c.muted,
              paddingTop:15,paddingBottom:9}}>{formatBRDate(e.date)}</Text>}
            <Pressable accessibilityRole="button" accessibilityLabel={title+' '+money(e.amountCents)}
              onPress={()=>router.push({pathname:'/entry/[id]',params:{id:e.id,month:app.historyMonth}})}
              style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',
                paddingVertical:14,borderBottomWidth:index<filtered.length-1?1:0,borderColor:c.border,gap:9}}>
              <View style={{flex:1}}>
                <Txt bold>{title}{e.kind==='installment'?' · '+e.position+'/'+e.totalPositions:''}</Txt>
                <Txt muted size={12}>{category}{!showDay?' · '+formatBRDate(e.date):''}
                  {e.kind==='recurring'?' · Repetição':''}</Txt>
                {e.date>now&&<Txt size={11} color={c.primary}>Previsto</Txt>}
              </View>
              <Txt bold color={e.type==='expense'?c.red:c.green} size={15}>
                {e.type==='expense'?'−':'+'}{money(e.amountCents)}
              </Txt>
            </Pressable>
          </React.Fragment>;
        })}
      </Panel>}
  </Page>;
}
