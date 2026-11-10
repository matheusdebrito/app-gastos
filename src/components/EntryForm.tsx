import React, {useEffect,useMemo,useState} from 'react';
import { Alert, Keyboard, Pressable, Text, View } from 'react-native';
import { router, usePreventRemove } from 'expo-router';
import { assertCents, EntryType, money, parseDigits, SeriesKind, today } from '@/domain/finance';
import { categories as loadCategories, deleteEntry, findEntryForEdit, hasDuplicate, saveCategory, saveEntry } from '@/data/database';
import { useApp } from '@/state/AppState';
import { Action, Chip, ChoiceRow, Field, Heading, Page, Panel, Txt, useColors } from '@/components/UI';

type Kind = 'single' | 'recurring' | 'installment';
type Props = { id?:string; month?:string; defaultType?:EntryType; initialKind?:Kind };
export function EntryForm({id,month,defaultType='expense',initialKind='single'}:Props) {
  const ctx=useApp(),c=useColors();
  const [dirty,setDirty]=useState(false);
  const [type,setType]=useState<EntryType>(defaultType);
  const [digits,setDigits]=useState('');
  const [date,setDate]=useState(today());
  const [description,setDescription]=useState('');
  const [categoryId,setCategoryId]=useState('');
  const [kind,setKind]=useState<Kind>(initialKind);
  const [months,setMonths]=useState('12');
  const [indefinite,setIndefinite]=useState(false);
  const [newCategory,setNewCategory]=useState('');
  const [categorySearch,setCategorySearch]=useState('');
  const [showCreateCategory,setShowCreateCategory]=useState(false);
  const [advanced,setAdvanced]=useState(initialKind !== 'single');
  const [selectCategoryExpanded,setSelectCategoryExpanded]=useState(false);
  const [saving,setSaving]=useState(false);
  const [loaded,setLoaded]=useState(!id);
  const [error,setError]=useState('');
  const [originalSeries,setOriginalSeries]=useState(false);
  const disablePrevention=usePreventRemove(dirty,({repeat})=>{
    Alert.alert('Descartar alterações?','Você tem informações não salvas. Deseja sair?',[
      {text:'Continuar editando',style:'cancel'},
      {text:'Descartar',style:'destructive',onPress:()=>{
        setDirty(false);
        repeat();
      }}
    ]);
  });
  const choices=useMemo(()=>ctx.categories.filter(cat=>cat.type===type),[ctx.categories,type]);
  useEffect(()=>{
    if(!id || !month) return;
    let active=true;
    findEntryForEdit(id,month).then(e=>{
      if(!active) return;
      if(!e){setError('Lançamento não encontrado.');setLoaded(true);return;}
      setType(e.type);setCategoryId(e.categoryId);setDigits(String(e.amountCents));setDate(e.date);
      setDescription(e.description);setKind(e.kind??'single');
      setAdvanced(e.kind !== 'single');
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
      const created=(await loadCategories()).find(cat=>cat.type===type&&cat.name.toLocaleLowerCase('pt-BR')===n.toLocaleLowerCase('pt-BR'));
      if(created){setCategoryId(created.id);setDirty(true)}
      setNewCategory('');setCategorySearch('');setShowCreateCategory(false);setError('');
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
    try {setSaving(true);await saveEntry(input);await ctx.refresh();Keyboard.dismiss();setDirty(false);disablePrevention();router.dismissAll();}
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
        try {const snapshot=await deleteEntry(entry);if(snapshot && (snapshot.entries.length || snapshot.exception))ctx.registerUndo(snapshot);await ctx.refresh();setDirty(false);disablePrevention();router.dismissAll()}
        catch(e){setError(String(e instanceof Error?e.message:e))}
      }}
    ]);
  }
  if(!loaded) return <Page><Txt>Carregando lançamento...</Txt></Page>;
  return <Page>
    <Heading sub={id?'Altere os dados do lançamento':'Valor, categoria e data'}>
      {id?'Editar lançamento':type==='expense'?'Registrar gasto':'Registrar renda'}
    </Heading>
    {id?.startsWith('virtual:') && <Panel><Txt muted>Esta edição altera somente a ocorrência selecionada. A edição desta e das próximas ainda depende da decisão sobre precedência de exceções. A data permanece fixa nesta etapa.</Txt></Panel>}
    {!!id && <ChoiceRow><Chip label="Gasto" selected={type==='expense'} onPress={()=>{setDirty(true);setType('expense');setCategoryId('')}}/>
      <Chip label="Renda" selected={type==='income'} onPress={()=>{setDirty(true);setType('income');setCategoryId('')}}/></ChoiceRow>}
    <Field label={kind==='installment'?'Valor total da compra':'Valor'} value={digits?money(amount):''}
      onChangeText={t=>{setDirty(true);setDigits(t.replace(/\D/g,''))}} placeholder="R$ 0,00" keyboardType="numeric" autoFocus={!id}/>
    <Txt muted size={12}>Digite somente os números. Exemplo: 1590 = R$ 15,90.</Txt>
    <Field label="Data (AAAA-MM-DD)" value={date} onChangeText={v=>{setDirty(true);setDate(v)}} placeholder="2026-11-09"/>
    <Field label="Descrição (opcional)" value={description} onChangeText={v=>{setDirty(true);setDescription(v)}} placeholder="Ex.: Supermercado"/>
    <Panel>
      <Txt bold size={16}>Categoria</Txt>
      <ChoiceRow>{choices.slice(0,selectCategoryExpanded?undefined:8).map(cat=>
        <Chip key={cat.id} label={cat.name} selected={cat.id===categoryId}
          onPress={()=>{setDirty(true);setCategoryId(cat.id)}} />)}
      </ChoiceRow>
      {(choices.length>8 || !choices.some(cat=>cat.id===categoryId)) &&
        <Action title={selectCategoryExpanded?'Mostrar menos categorias':'Mostrar todas as categorias'} secondary
          onPress={()=>setSelectCategoryExpanded(value=>!value)} />}
      <Action title={showCreateCategory?'Cancelar nova categoria':'+ Criar categoria'} secondary
        onPress={()=>setShowCreateCategory(value=>!value)} />
      {showCreateCategory && <>
        <Field label="Nome da categoria" value={newCategory} onChangeText={setNewCategory} />
        <Action title="Salvar categoria" onPress={addCategory} />
      </>}
    </Panel>
    <Pressable accessibilityRole="button" onPress={()=>setAdvanced(value=>!value)}
      style={{paddingVertical:15,paddingHorizontal:4,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
      <Txt bold>{advanced?'Opções de repetição':'Repetir ou parcelar este lançamento'}</Txt>
      <Txt color={c.primary}>{advanced?'−':'+'}</Txt>
    </Pressable>
    {advanced && <Panel>
      <ChoiceRow>
        <Chip label="Uma vez" selected={kind==='single'} onPress={()=>{setDirty(true);setKind('single')}} />
        <Chip label="Todo mês" selected={kind==='recurring'} onPress={()=>{setDirty(true);setKind('recurring')}} />
        {type==='expense' && <Chip label="Parcelado" selected={kind==='installment'}
          onPress={()=>{setDirty(true);setKind('installment');setIndefinite(false)}} />}
      </ChoiceRow>
      {kind!=='single' && <>
        {kind==='recurring'&&<ChoiceRow>
          <Chip label="Por alguns meses" selected={!indefinite} onPress={()=>{setDirty(true);setIndefinite(false)}} />
          <Chip label="Sem data para terminar" selected={indefinite} onPress={()=>{setDirty(true);setIndefinite(true)}} />
        </ChoiceRow>}
        {(!indefinite || kind==='installment') && <Field
          label={kind==='installment'?'Número de parcelas':'Quantidade de meses'}
          value={months} onChangeText={value=>{setDirty(true);setMonths(value)}} keyboardType="number-pad" />}
        <Txt muted size={12}>{kind==='installment'
          ? 'O valor total será dividido entre as parcelas.'
          : 'O primeiro lançamento será neste mês.'}</Txt>
      </>}
    </Panel>}
    {!!error && <Panel><Txt color={c.red}>{error}</Txt></Panel>}
    <Action title={saving?'Salvando...':id?'Salvar alterações':type==='expense'?'Salvar gasto':'Salvar renda'} disabled={saving||!digits||amount<=0||!categoryId}
      onPress={persist}/>
    {!!id && <Action title="Excluir lançamento" danger onPress={remove}/>}
    <Action title="Cancelar" secondary onPress={()=>{
      Alert.alert('Descartar alterações?','Deseja sair sem salvar este formulário?',[
        {text:'Continuar editando',style:'cancel'},{text:'Descartar',style:'destructive',onPress:()=>{setDirty(false);disablePrevention();router.back()}}
      ]);
    }}/>
  </Page>;
}
