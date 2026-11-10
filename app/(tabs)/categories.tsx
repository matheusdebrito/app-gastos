import React, { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Category, EntryType } from '@/domain/finance';
import { categoryUsage, deleteCategory, saveCategory } from '@/data/database';
import { useApp } from '@/state/AppState';
import { Action, Chip, ChoiceRow, Field, Heading, Page, Panel, Txt, useColors } from '@/components/UI';

export default function Categories() {
  const app=useApp(),c=useColors();
  const [type,setType]=useState<EntryType>('expense');
  const [formOpen,setFormOpen]=useState(false);
  const [editing,setEditing]=useState<string|null>(null);
  const [name,setName]=useState('');
  const [deleting,setDeleting]=useState<Category|null>(null);
  const [destination,setDestination]=useState('');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const list=app.categories.filter(cat=>cat.type===type)
    .sort((a,b)=>a.name.localeCompare(b.name,'pt-BR',{sensitivity:'base'}));

  function switchType(next:EntryType) {
    setType(next);setEditing(null);setFormOpen(false);setName('');
    setDeleting(null);setDestination('');setError('');
  }
  function edit(cat:Category) {
    setEditing(cat.id);setName(cat.name);setFormOpen(true);setDeleting(null);setError('');
  }
  async function save() {
    if(busy)return;
    setBusy(true);setError('');
    try {
      await saveCategory({id:editing??undefined,type,name});
      await app.refresh();
      setEditing(null);setName('');setFormOpen(false);
      app.notify('Categoria salva');
    }catch(e){setError(e instanceof Error?e.message:String(e))}
    finally{setBusy(false)}
  }
  async function requestDelete(cat:Category) {
    setError('');setDeleting(null);
    if(list.length<=1){setError('É necessário manter pelo menos uma categoria deste tipo.');return;}
    try {
      const linked=await categoryUsage(cat.id);
      if(linked>0){setDeleting(cat);setDestination('');return;}
      confirmDelete(cat);
    }catch(e){setError(e instanceof Error?e.message:String(e))}
  }
  function confirmDelete(cat:Category,to?:string) {
    Alert.alert('Excluir categoria',to
      ?'Os lançamentos de '+cat.name+' serão transferidos para a categoria escolhida. Essa ação não pode ser desfeita.'
      :'Deseja excluir '+cat.name+'? Essa ação não pode ser desfeita.',[
      {text:'Cancelar',style:'cancel'},
      {text:'Excluir',style:'destructive',onPress:async()=>{
        if(busy)return;
        setBusy(true);
        try {
          await deleteCategory(cat.id,to);
          await app.refresh();
          setDeleting(null);setDestination('');
          setError('');app.notify('Categoria excluída');
        }catch(e){setError(e instanceof Error?e.message:String(e))}
        finally{setBusy(false)}
      }}
    ]);
  }

  return <Page>
    <Heading sub="Separe seus lançamentos por assunto">Categorias</Heading>
    <ChoiceRow>
      <Chip label="Gastos" selected={type==='expense'} onPress={()=>switchType('expense')}/>
      <Chip label="Renda" selected={type==='income'} onPress={()=>switchType('income')}/>
    </ChoiceRow>
    <View style={{marginTop:5,marginBottom:15}}>
      <Action title={formOpen?'Fechar cadastro':'+ Nova categoria'} secondary onPress={()=>{
        setFormOpen(value=>!value);setEditing(null);setName('');setError('');
      }}/>
    </View>
    {formOpen&&<Panel>
      <Txt bold size={16}>{editing?'Renomear categoria':'Nova categoria'}</Txt>
      <Field label="Nome" value={name} onChangeText={setName} placeholder="Ex.: Mercado"/>
      <Action title={busy?'Salvando...':'Salvar categoria'} disabled={busy||!name.trim()}
        onPress={()=>{void save()}}/>
      {editing&&<Action title="Cancelar edição" secondary onPress={()=>{setFormOpen(false);setEditing(null);setName('')}}/>}
    </Panel>}
    {!!error && <Panel><Txt color={c.red}>{error}</Txt></Panel>}
    <Panel style={{paddingVertical:6}}>
      {list.map((cat,index)=><View key={cat.id} style={{
        borderBottomWidth:index<list.length-1?1:0,borderColor:c.border,paddingVertical:14
      }}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <View style={{flex:1}}><Txt bold>{cat.name}</Txt></View>
          <Pressable accessibilityRole="button" accessibilityLabel={'Editar '+cat.name}
            onPress={()=>edit(cat)} style={{padding:10,marginLeft:5}}>
            <SymbolView name={{ios:'pencil',android:'edit',web:'edit'}} size={21} tintColor={c.primary}/>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={'Excluir '+cat.name}
            onPress={()=>{void requestDelete(cat)}} style={{padding:10}}>
            <SymbolView name={{ios:'trash',android:'delete',web:'delete'}} size={21} tintColor={c.red}/>
          </Pressable>
        </View>
        {deleting?.id===cat.id&&<View style={{marginTop:13,padding:12,borderRadius:13,backgroundColor:c.bg}}>
          <Txt bold>Para excluir, transfira os lançamentos para:</Txt>
          <ChoiceRow>{list.filter(other=>other.id!==cat.id).map(other=>
            <Chip key={other.id} label={other.name} selected={destination===other.id}
              onPress={()=>setDestination(other.id)}/>)}</ChoiceRow>
          <Action title="Transferir e excluir" danger disabled={!destination||busy}
            onPress={()=>confirmDelete(cat,destination)}/>
          <Action title="Cancelar" secondary onPress={()=>{setDeleting(null);setDestination('')}}/>
        </View>}
      </View>)}
    </Panel>
    <Txt muted size={12}>Ao excluir uma categoria com lançamentos, os valores e as datas são preservados.</Txt>
  </Page>;
}
