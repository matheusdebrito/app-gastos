import React, {useEffect,useMemo,useState} from 'react';
import { Alert, Keyboard, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { assertCents, EntryType, money, parseDigits, SeriesKind, today } from '@/domain/finance';
import { deleteEntry, findEntryForEdit, hasDuplicate, saveCategory, saveEntry } from '@/data/database';
import { useApp } from '@/state/AppState';
import { Action, Chip, ChoiceRow, Field, Heading, Page, Panel, Txt, useColors } from '@/components/UI';

type Kind = 'single' | 'recurring' | 'installment';
type Props = { id?:string; month?:string; defaultType?:EntryType; initialKind?:Kind };
export function EntryForm({id,month,defaultType='expense',initialKind='single'}:Props) {
  const ctx=useApp(),c=useColors();
  const [type,setType]=useState<EntryType>(defaultType);
  const [digits,setDigits]=useState('');
  const [date,setDate]=useState(today());
  const [description,setDescription]=useState('');
  const [categoryId,setCategoryId]=useState('');
  const [kind,setKind]=useState<Kind>(initialKind);
  const [months,setMonths]=useState('12');
  const [indefinite,setIndefinite]=useState(false);
  const [newCategory,setNewCategory]=useState('');
  const [showCreateCategory,setShowCreateCategory]=useState(false);
  const [saving,setSaving]=useState(false);
  const [loaded,setLoaded]=useState(!id);
  const [error,setError]=useState('');
  const [originalSeries,setOriginalSeries]=useState(false);
  const choices=useMemo(()=>ctx.categories.filter(cat=>cat.type===type),[ctx.categories,type]);
  useEffect(()=>{
    if(!id || !month) return;
    let active=true;
    findEntryForEdit(id,month).then(e=>{
      if(!active) return;
      if(!e){setError('Lançamento não encontrado.');setLoaded(true);return;}
      setType(e.type);setCategoryId(e.categoryId);setDigits(String(e.amountCents));setDate(e.date);
      setDescription(e.description);setKind(e.kind??'single');
      setOriginalSeries(!!e.seriesId);
      if(e.months===null) setIndefinite(true); else if(e.months) setMonths(String(e.months));
      setLoaded(true);
    }).catch(e=>{if(active){setError(String(e));setLoaded(true)}});
    return ()=>{active=false};
  },[id,month]);
  useEffect(()=>{
    if (!categoryId && choices.length) setCategoryId(choices[0].id);
  },[choices,categoryId]);
  const amount = (()=>{try {return parseDigits(digits)} catch{return 0}})();
  async function addCategory() {
    try {
      const n=newCategory.trim();
      if(!n) throw new Error('Informe o nome da categoria.');
      await saveCategory({type,name:n});
      await ctx.refresh();
      setNewCategory('');setShowCreateCategory(false);setError('');
    } catch(e){setError(String(e instanceof Error?e.message:e))}
  }
  async function persist() {
    try {
      setSaving(true);setError('');
      const amountCents=parseDigits(digits);
      assertCents(amountCents);
      const input={id,type,categoryId,amountCents,date,description,kind,months:kind==='single'?undefined:indefinite?null:Number(months)};
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Use uma data no formato AAAA-MM-DD.');
      if(!id && kind==='single' && await hasDuplicate(input)) {
        Alert.alert('Possível lançamento duplicado','Já existe um lançamento com o mesmo valor, data, tipo e categoria. Salvar mesmo assim?',[
          {text:'Cancelar',style:'cancel'}, {text:'Salvar mesmo assim',onPress:()=>persistConfirmed(input)}
        ]);
        return;
      }
      if (id && originalSeries && !id.startsWith('virtual:')) {
        Alert.alert('Alterar série inteira','A edição atualizará todas as ocorrências da série, incluindo meses anteriores. Deseja continuar?',[
          {text:'Cancelar',style:'cancel'}, {text:'Continuar',onPress:()=>persistConfirmed(input)}
        ]);
        return;
      }
      await persistConfirmed(input);
    } catch(e) {setError(String(e instanceof Error?e.message:e))}
    finally {setSaving(false)}
  }
  async function persistConfirmed(input:Parameters<typeof saveEntry>[0]) {
    try {setSaving(true);await saveEntry(input);await ctx.refresh();Keyboard.dismiss();router.back();}
    catch(e) {setError(String(e instanceof Error?e.message:e))}
    finally {setSaving(false)}
  }
  async function remove() {
    if(!id||!month) return;
    const current=await findEntryForEdit(id,month);
    if(!current) return;
    const entry= (await ctx.entries(month)).find(x=>x.id===id);
    if(!entry) return;
    Alert.alert('Confirmar exclusão',id.startsWith('virtual:')?'Somente esta ocorrência será excluída.':originalSeries?'Todas as ocorrências desta série, inclusive anteriores, serão excluídas.':'Excluir este lançamento?',[
      {text:'Cancelar',style:'cancel'},
      {text:'Excluir',style:'destructive',onPress:async()=>{
        try {const snapshot=await deleteEntry(entry);if(snapshot && (snapshot.entries.length || snapshot.exception))ctx.registerUndo(snapshot);await ctx.refresh();router.back()}
        catch(e){setError(String(e instanceof Error?e.message:e))}
      }}
    ]);
  }
  if(!loaded) return <Page><Txt>Carregando lançamento...</Txt></Page>;
  return <Page>
    <Heading sub={id?'Atualize as informações do lançamento':'Registre uma movimentação em seu dispositivo'}>
      {id?'Editar lançamento':'Novo lançamento'}
    </Heading>
    {id?.startsWith('virtual:') && <Panel><Txt muted>Esta edição altera somente a ocorrência selecionada. A edição desta e das próximas ainda depende da decisão sobre precedência de exceções. A data permanece fixa nesta etapa.</Txt></Panel>}
    <ChoiceRow><Chip label="Despesa" selected={type==='expense'} onPress={()=>{setType('expense');setCategoryId('')}}/>
      <Chip label="Receita" selected={type==='income'} onPress={()=>{setType('income');setCategoryId('')}}/></ChoiceRow>
    <Field label="Valor em centavos (digite apenas números)" value={digits?money(amount):''}
      onChangeText={t=>setDigits(t.replace(/\D/g,''))} placeholder="R$ 0,00" keyboardType="numeric" autoFocus={!id}/>
    <Field label="Data (AAAA-MM-DD)" value={date} onChangeText={setDate} placeholder="2026-11-09"/>
    <Field label="Descrição (opcional)" value={description} onChangeText={setDescription} placeholder="Ex.: Supermercado"/>
    <Panel><Txt bold>Categoria</Txt>
      <ChoiceRow>{choices.map(cat=><Chip key={cat.id} label={cat.name} selected={cat.id===categoryId} onPress={()=>setCategoryId(cat.id)}/>)}</ChoiceRow>
      <Action title="+ Nova categoria" secondary onPress={()=>setShowCreateCategory(v=>!v)}/>
      {showCreateCategory && <><Field label="Nome da nova categoria" value={newCategory} onChangeText={setNewCategory}/><Action title="Criar categoria" onPress={addCategory}/></>}
    </Panel>
    <Panel><Txt bold>Tipo de lançamento</Txt>
      <ChoiceRow><Chip label="Único" selected={kind==='single'} onPress={()=>setKind('single')}/>
        <Chip label="Recorrente" selected={kind==='recurring'} onPress={()=>setKind('recurring')}/>
        {type==='expense' && <Chip label="Compra parcelada" selected={kind==='installment'} onPress={()=>{setKind('installment');setIndefinite(false)}}/>}
      </ChoiceRow>
      {kind!=='single'&&<>
        {kind==='recurring'&&<ChoiceRow><Chip label="Por X meses" selected={!indefinite} onPress={()=>setIndefinite(false)}/>
          <Chip label="Indefinida" selected={indefinite} onPress={()=>setIndefinite(true)}/></ChoiceRow>}
        {(!indefinite||kind==='installment') && <Field label={kind==='installment'?'Número de parcelas':'Quantidade de meses'}
          value={months} onChangeText={setMonths} keyboardType="number-pad"/>}
        <Txt muted size={12}>{kind==='installment'
          ? 'Digite o valor total da compra. O ajuste dos centavos será aplicado na última parcela.'
          :indefinite?'A ocorrência será calculada no mês correspondente, sem criar infinitos registros.':
          'O mês inicial conta como a primeira ocorrência.'}</Txt>
      </>}
    </Panel>
    {!!error && <Panel><Txt color={c.red}>{error}</Txt></Panel>}
    <Action title={saving?'Salvando...':id?'Salvar alterações':'Salvar lançamento'} disabled={saving||!digits||amount<=0||!categoryId}
      onPress={persist}/>
    {!!id && <Action title="Excluir lançamento" danger onPress={remove}/>}
    <Action title="Voltar sem salvar" secondary onPress={()=>{
      Alert.alert('Descartar alterações?','Deseja sair sem salvar este formulário?',[
        {text:'Continuar editando',style:'cancel'},{text:'Descartar',style:'destructive',onPress:()=>router.back()}
      ]);
    }}/>
  </Page>;
}
