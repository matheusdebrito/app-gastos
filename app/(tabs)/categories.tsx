import React,{useState} from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Category, EntryType } from '@/domain/finance';
import { deleteCategory, saveCategory } from '@/data/database';
import { useApp } from '@/state/AppState';
import { Action, Chip, ChoiceRow, Field, Heading, Page, Panel, Txt, useColors } from '@/components/UI';

export default function Categories() {
  const ctx=useApp(),c=useColors();
  const [type,setType]=useState<EntryType>('expense');
  const [name,setName]=useState('');
  const [editing,setEditing]=useState<string|null>(null);
  const [destination,setDestination]=useState('');
  const [error,setError]=useState('');
  const selected=ctx.categories.filter(x=>x.type===type);
  async function save() {
    try { await saveCategory({id:editing??undefined,type,name});await ctx.refresh();setEditing(null);setName('');setError(''); }
    catch(e){setError(String(e instanceof Error?e.message:e))}
  }
  async function remove(x:Category) {
    Alert.alert('Excluir categoria','Todos os lançamentos associados serão transferidos à categoria de destino. A exclusão não poderá ser desfeita.',[
      {text:'Cancelar',style:'cancel'},
      {text:'Excluir',style:'destructive',onPress:async()=>{
        try {await deleteCategory(x.id,destination||undefined);await ctx.refresh();setDestination('');setError('')}
        catch(e){setError(String(e instanceof Error?e.message:e))}
      }}
    ]);
  }
  return <Page>
    <Heading sub="Organize receitas e despesas">Categorias</Heading>
    <ChoiceRow><Chip label="Despesas" selected={type==='expense'} onPress={()=>{setType('expense');setEditing(null);setName('');setDestination('')}}/>
      <Chip label="Receitas" selected={type==='income'} onPress={()=>{setType('income');setEditing(null);setName('');setDestination('')}}/></ChoiceRow>
    <Panel>
      <Txt bold>{editing?'Renomear categoria':'Nova categoria'}</Txt>
      <Field label="Nome" value={name} onChangeText={setName} placeholder="Nome da categoria"/>
      <Action title={editing?'Salvar alteração':'Criar categoria'} disabled={!name.trim()} onPress={save}/>
      {editing&&<Action title="Cancelar edição" secondary onPress={()=>{setEditing(null);setName('')}}/>}
      {!!error&&<Txt color={c.red}>{error}</Txt>}
    </Panel>
    <Txt bold>Suas categorias</Txt>
    <Txt muted size={12}>Antes de excluir uma categoria em uso, selecione o destino abaixo.</Txt>
    <ChoiceRow><Chip label="Destino não selecionado" selected={!destination} onPress={()=>setDestination('')}/>
      {selected.filter(x=>x.id!==editing).map(x=><Chip key={x.id} label={x.name} selected={destination===x.id} onPress={()=>setDestination(x.id)} />)}</ChoiceRow>
    {selected.map(x=><Panel key={x.id}>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <View style={{flex:1}}><Txt bold>{x.name}</Txt></View>
        <Pressable accessibilityRole="button" onPress={()=>{setEditing(x.id);setName(x.name)}} style={{padding:8}}><Txt color={c.primary}>Editar</Txt></Pressable>
        <Pressable accessibilityRole="button" onPress={()=>remove(x)} style={{padding:8}}><Txt color={c.red}>Excluir</Txt></Pressable>
      </View>
    </Panel>)}
  </Page>;
}
