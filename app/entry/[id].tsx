import {router,useLocalSearchParams} from 'expo-router';
import React,{useEffect,useState} from 'react';
import {Alert} from 'react-native';
import {Action,Divider,Heading,Page,Panel,Txt,useColors} from '@/components/UI';
import {deleteEntry} from '@/data/database';
import {Entry,money,today} from '@/domain/finance';
import {useApp} from '@/state/AppState';
export default function EntryDetails(){
  const {id,month}=useLocalSearchParams<{id:string;month:string}>();
  const ctx=useApp(),c=useColors();
  const [entry,setEntry]=useState<Entry|null>(null);
  const [error,setError]=useState('');
  useEffect(()=>{let active=true;ctx.entries(month).then(rows=>{if(active)setEntry(rows.find(x=>x.id===id)??null)}).catch(e=>{if(active)setError(String(e))});
    return ()=>{active=false}},[id,month,ctx.revision,ctx.entries]);
  const category=ctx.categories.find(x=>x.id===entry?.categoryId)?.name??'Categoria';
  async function remove(){
    if(!entry)return;
    Alert.alert('Excluir lançamento',entry.virtual?'Somente esta ocorrência será excluída.':entry.seriesId?'Isso excluirá a série inteira, incluindo ocorrências passadas.':'Deseja realmente excluir este lançamento?',[
      {text:'Cancelar',style:'cancel'},
      {text:'Excluir',style:'destructive',onPress:async()=>{
        try{
          const snapshot=await deleteEntry(entry);
          if(snapshot && (snapshot.entries.length || snapshot.exception))ctx.registerUndo(snapshot);
          await ctx.refresh();
          router.back();
        }catch(e){setError(String(e))}
      }}
    ]);
  }
  return <Page><Heading sub="Informações da movimentação">Detalhes</Heading>
    {error&&<Txt color={c.red}>{error}</Txt>}
    {!entry?<Panel><Txt muted>Lançamento não encontrado ou carregando...</Txt></Panel>:<>
      <Panel>
        <Txt muted>{entry.type==='income'?'Receita':'Despesa'}{entry.date>today()?' · Previsto':''}</Txt>
        <Txt bold size={30} color={entry.type==='income'?c.green:c.red}>{money(entry.amountCents)}</Txt>
        <Divider/>
        <Txt bold>Categoria</Txt><Txt>{category}</Txt><Divider/>
        <Txt bold>Data</Txt><Txt>{entry.date.split('-').reverse().join('/')}</Txt><Divider/>
        <Txt bold>Descrição</Txt><Txt>{entry.description||'Sem descrição'}</Txt>
        {entry.kind!=='single'&&<><Divider/><Txt bold>Tipo</Txt><Txt>{entry.kind==='installment'?'Parcelamento':'Recorrência'} {entry.position?entry.position+'/'+(entry.totalPositions??'∞'):''}</Txt></>}
      </Panel>
      <Action title="Editar lançamento" onPress={()=>router.push({pathname:'/entry/edit/[id]',params:{id,month}})} />
      <Action title="Excluir" danger onPress={()=>{void remove()}}/>
    </>}
  </Page>;
}
