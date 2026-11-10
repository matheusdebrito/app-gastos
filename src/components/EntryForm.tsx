import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Keyboard, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { router, usePreventRemove } from 'expo-router';
import { assertCents, EntryType, formatBRDate, maskBRDate, money, parseBRDate, parseDigits, today } from '@/domain/finance';
import { categories as loadCategories, findEntryForEdit, hasDuplicate, saveCategory, saveEntry } from '@/data/database';
import { useApp } from '@/state/AppState';
import { Action, Chip, ChoiceRow, Field, Heading, Page, Panel, Txt, useColors } from '@/components/UI';

type Kind = 'single' | 'recurring' | 'installment';
type Props = { id?: string; month?: string; defaultType?: EntryType; initialKind?: Kind };

export function EntryForm({id,month,defaultType='expense',initialKind='single'}:Props) {
  const app=useApp(), c=useColors();
  const isVirtual=!!id?.startsWith('virtual:');
  const [dirty,setDirty]=useState(false);
  const [type,setType]=useState<EntryType>(defaultType);
  const [digits,setDigits]=useState('');
  const [dateText,setDateText]=useState(formatBRDate(today()));
  const [dateOpen,setDateOpen]=useState(false);
  const [description,setDescription]=useState('');
  const [categoryId,setCategoryId]=useState('');
  const [pickerOpen,setPickerOpen]=useState(false);
  const [categorySearch,setCategorySearch]=useState('');
  const [showCreateCategory,setShowCreateCategory]=useState(false);
  const [newCategory,setNewCategory]=useState('');
  const [kind,setKind]=useState<Kind>(initialKind);
  const [advanced,setAdvanced]=useState(initialKind!=='single');
  const [months,setMonths]=useState('12');
  const [indefinite,setIndefinite]=useState(false);
  const [loading,setLoading]=useState(!!id);
  const [saving,setSaving]=useState(false);
  const savingRef=useRef(false);
  const [error,setError]=useState('');
  const [originalSeries,setOriginalSeries]=useState(false);
  const editSeries=!!id&&originalSeries&&!isVirtual;

  const disablePrevention=usePreventRemove(dirty,({repeat})=>{
    Alert.alert('Descartar alterações?','Você tem informações não salvas.',[
      {text:'Continuar editando',style:'cancel'},
      {text:'Descartar',style:'destructive',onPress:()=>{setDirty(false);repeat()}}
    ]);
  });

  const choices=useMemo(()=>app.categories.filter(cat=>cat.type===type)
    .sort((a,b)=>a.name.localeCompare(b.name,'pt-BR',{sensitivity:'base'})),[app.categories,type]);
  const selected=choices.find(cat=>cat.id===categoryId);
  const visible=choices.filter(cat=>cat.name.toLocaleLowerCase('pt-BR')
    .includes(categorySearch.trim().toLocaleLowerCase('pt-BR')));

  useEffect(()=>{
    if(!id || !month) return;
    let active=true;
    findEntryForEdit(id,month).then(entry=>{
      if(!active) return;
      if(!entry){setError('Lançamento não encontrado.');return;}
      setType(entry.type);
      setCategoryId(entry.categoryId);
      setDigits(String(entry.amountCents));
      setDateText(formatBRDate(entry.date));
      setDescription(entry.description);
      const nextKind=entry.kind??'single';
      setKind(nextKind);
      setAdvanced(nextKind!=='single');
      setOriginalSeries(!!entry.seriesId);
      if(entry.months===null) setIndefinite(true);
      else if(entry.months) setMonths(String(entry.months));
    }).catch(e=>{if(active)setError(e instanceof Error?e.message:String(e))})
      .finally(()=>{if(active)setLoading(false)});
    return ()=>{active=false};
  },[id,month]);

  useEffect(()=>{
    if(!choices.some(cat=>cat.id===categoryId)) setCategoryId(choices[0]?.id??'');
  },[choices,categoryId]);

  const amount=(()=>{try{return parseDigits(digits)}catch{return 0}})();
  const excessive=digits.length>0 && !Number.isSafeInteger(Number(digits));
  function changeType(next:EntryType) {
    if(isVirtual || next===type) return;
    setType(next);
    setCategoryId('');
    setCategorySearch('');
    if(next==='income'&&kind==='installment'){setKind('single');setAdvanced(false)}
    setDirty(true);
  }

  async function addCategory() {
    try {
      const name=newCategory.trim();
      if(!name) throw new Error('Informe o nome da categoria.');
      await saveCategory({type,name});
      await app.refresh();
      const created=(await loadCategories()).find(cat=>cat.type===type &&
        cat.name.toLocaleLowerCase('pt-BR')===name.toLocaleLowerCase('pt-BR'));
      if(created) setCategoryId(created.id);
      setCategorySearch('');
      setNewCategory('');
      setShowCreateCategory(false);
      setPickerOpen(false);
      setDirty(true);
      setError('');
    } catch(e){setError(e instanceof Error?e.message:String(e))}
  }

  async function commit(input:Parameters<typeof saveEntry>[0]) {
    if(savingRef.current)return;
    savingRef.current=true;
    setSaving(true);
    try {
      await saveEntry(input);
      await app.refresh();
      app.notify(input.type==='expense'?'Gasto salvo':'Renda salva');
      Keyboard.dismiss();
      setDirty(false);
      disablePrevention();
      router.dismissAll();
    }catch(e){setError(e instanceof Error?e.message:String(e))}
    finally{savingRef.current=false;setSaving(false)}
  }

  async function persist() {
    if(savingRef.current) return;
    try {
      setError('');
      const amountCents=parseDigits(digits);
      assertCents(amountCents);
      const date=parseBRDate(dateText);
      if(!date)throw new Error('Informe uma data válida em DD/MM/AAAA.');
      if(!categoryId)throw new Error('Escolha uma categoria.');
      let count:number|null=null;
      if(kind!=='single'){
        if(kind==='installment' && type!=='expense')throw new Error('Parcelamento é exclusivo de gastos.');
        if(kind==='recurring'&&indefinite) count=null;
        else {
          if(!/^\d+$/.test(months))throw new Error('Informe uma quantidade válida de meses.');
          count=Number(months);
          if(!Number.isSafeInteger(count)||count<=0)throw new Error('Informe uma quantidade de meses maior que zero.');
          if(kind==='installment' && count>amountCents)throw new Error('O número de parcelas não pode exceder o valor em centavos.');
        }
      }
      const input:Parameters<typeof saveEntry>[0]={
        id,type,categoryId,amountCents,date,description,kind,
        months:kind==='single'?undefined:count,
      };
      if(!id && kind==='single' && await hasDuplicate(input)){
        Alert.alert('Possível duplicidade','Já existe um lançamento com este valor, data e categoria. Salvar mesmo assim?',[
          {text:'Cancelar',style:'cancel'},
          {text:'Salvar',onPress:()=>{void commit(input)}}
        ]);
        return;
      }
      if(id && originalSeries && !isVirtual){
        Alert.alert('Alterar série inteira','Essa edição altera todas as ocorrências desta série, inclusive as anteriores.',[
          {text:'Cancelar',style:'cancel'},
          {text:'Alterar todas',onPress:()=>{void commit(input)}}
        ]);
        return;
      }
      await commit(input);
    }catch(e){setError(e instanceof Error?e.message:String(e))}
  }

  if(loading)return <Page><Txt muted>Carregando lançamento...</Txt></Page>;
  if(id && error==='Lançamento não encontrado.')return <Page><Panel><Txt color={c.red}>{error}</Txt></Panel></Page>;

  return <Page>
    <Heading sub={isVirtual?'Esta alteração vale somente para o mês selecionado.':'Preencha o valor e escolha uma categoria.'}>
      {id?'Editar lançamento':type==='expense'?'Novo gasto':'Nova renda'}
    </Heading>
    {id&&!isVirtual && <ChoiceRow>
      <Chip label="Gasto" selected={type==='expense'} onPress={()=>changeType('expense')}/>
      <Chip label="Renda" selected={type==='income'} onPress={()=>changeType('income')}/>
    </ChoiceRow>}

    <Panel>
      <Txt muted size={13}>{kind==='installment'?'Valor total da compra':'Valor'}</Txt>
      <TextInput accessibilityLabel="Valor em reais" keyboardType="number-pad" autoFocus={!id}
        placeholder="R$ 0,00" placeholderTextColor={c.muted} value={digits?money(amount):''}
        onChangeText={value=>{setDirty(true);setDigits(value.replace(/\D/g,''))}}
        style={{fontSize:34,fontWeight:'800',letterSpacing:-1,color:c.text,paddingVertical:12}}/>
      {excessive && <Txt color={c.red} size={12}>O valor ultrapassa o limite permitido.</Txt>}
      <Txt muted size={12}>Digite os números: 1590 = R$ 15,90</Txt>
    </Panel>

    <Panel>
      <Txt muted size={13}>Categoria</Txt>
      <Pressable accessibilityRole="button" accessibilityLabel="Escolher categoria"
        onPress={()=>setPickerOpen(value=>!value)} style={{flexDirection:'row',alignItems:'center',
          justifyContent:'space-between',minHeight:48,marginTop:7}}>
        <Txt bold size={17}>{selected?.name??'Selecione uma categoria'}</Txt>
        <SymbolView name={{ios:'chevron.down',android:'expand_more',web:'expand_more'}} size={23} tintColor={c.primary}/>
      </Pressable>
      {pickerOpen && <>
        <Field label="Buscar categoria" value={categorySearch} onChangeText={setCategorySearch} placeholder="Pesquisar"/>
        <ScrollView nestedScrollEnabled style={{maxHeight:225}}>
          {visible.map(cat=><Pressable key={cat.id} accessibilityRole="button" accessibilityLabel={cat.name}
            onPress={()=>{setCategoryId(cat.id);setPickerOpen(false);setDirty(true)}}
            style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',
              borderBottomWidth:1,borderBottomColor:c.border,paddingVertical:12}}>
            <Txt color={cat.id===categoryId?c.primary:c.text}>{cat.name}</Txt>
            {cat.id===categoryId && <SymbolView name={{ios:'checkmark',android:'check',web:'check'}} tintColor={c.primary} size={20}/>}
          </Pressable>)}
        </ScrollView>
        {!visible.length&&<Txt muted>Nenhuma categoria encontrada.</Txt>}
        <Pressable accessibilityRole="button" onPress={()=>setShowCreateCategory(v=>!v)} style={{paddingVertical:15}}>
          <Txt color={c.primary} bold>+ Nova categoria</Txt>
        </Pressable>
        {showCreateCategory&&<>
          <Field label="Nome da nova categoria" value={newCategory} onChangeText={setNewCategory}/>
          <Action title="Criar categoria" onPress={()=>{void addCategory()}} disabled={!newCategory.trim()}/>
        </>}
      </>}
    </Panel>

    <Panel>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <View style={{flex:1}}><Txt muted size={13}>Data</Txt>
          <View style={{marginTop:5}}><Txt bold>{dateText||'Informe a data'}</Txt></View>
        </View>
        {!isVirtual&&<Pressable accessibilityRole="button" onPress={()=>setDateOpen(v=>!v)} style={{padding:10}}>
          <Txt color={c.primary} bold size={13}>{dateOpen?'Fechar':'Alterar'}</Txt>
        </Pressable>}
      </View>
      {dateOpen&&!isVirtual&&<Field label="Data (DD/MM/AAAA)" value={dateText} keyboardType="number-pad"
        onChangeText={value=>{setDateText(maskBRDate(value));setDirty(true)}} placeholder="DD/MM/AAAA"/>}
      {isVirtual&&<Txt muted size={12}>A data desta ocorrência não pode ser alterada individualmente.</Txt>}
      <View style={{height:1,backgroundColor:c.border,marginVertical:15}}/>
      <Field label="Descrição (opcional)" value={description}
        onChangeText={value=>{setDescription(value);setDirty(true)}} placeholder="Ex.: Mercado, salário"/>
    </Panel>

    {!isVirtual&&<Pressable accessibilityRole="button" onPress={()=>setAdvanced(v=>!v)}
      style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',
        paddingVertical:17,paddingHorizontal:4,marginBottom:6}}>
      <Txt bold>Repetir ou parcelar</Txt>
      <SymbolView name={{ios:advanced?'chevron.up':'chevron.down',
        android:advanced?'expand_less':'expand_more',web:advanced?'expand_less':'expand_more'}}
        size={22} tintColor={c.primary}/>
    </Pressable>}
    {advanced&&!isVirtual&&<Panel>
      {editSeries?
        <Txt bold>{kind==='installment'?'Compra parcelada':'Recorrência mensal'}</Txt>:
        <ChoiceRow>
          <Chip label="Uma vez" selected={kind==='single'} onPress={()=>{setKind('single');setDirty(true)}}/>
          <Chip label="Todo mês" selected={kind==='recurring'} onPress={()=>{setKind('recurring');setDirty(true)}}/>
          {type==='expense'&&<Chip label="Parcelado" selected={kind==='installment'}
            onPress={()=>{setKind('installment');setIndefinite(false);setDirty(true)}}/>}
        </ChoiceRow>}
      {kind==='recurring'&&!editSeries&&<ChoiceRow>
        <Chip label="Por alguns meses" selected={!indefinite}
          onPress={()=>{setIndefinite(false);setDirty(true)}}/>
        <Chip label="Sem data final" selected={indefinite}
          onPress={()=>{setIndefinite(true);setDirty(true)}}/>
      </ChoiceRow>}
      {kind!=='single' && (!indefinite || kind==='installment') &&
        <Field label={kind==='installment'?'Número de parcelas':'Quantidade de meses'}
          value={months} keyboardType="number-pad" onChangeText={v=>{setMonths(v);setDirty(true)}}/>}
      {kind==='installment'&&<Txt muted size={12}>O valor informado é o total da compra; as parcelas serão divididas automaticamente.</Txt>}
    </Panel>}

    {!!error&&<View style={{marginBottom:10}}><Txt color={c.red} size={13}>{error}</Txt></View>}
    <Action title={saving?'Salvando...':id?'Salvar alterações':type==='expense'?'Salvar gasto':'Salvar renda'}
      disabled={saving||!digits||amount<=0||!categoryId||excessive}
      onPress={()=>{void persist()}}/>
    <Action title="Cancelar" secondary onPress={()=>router.back()}/>
  </Page>;
}
