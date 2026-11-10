import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Action, Heading, Page, Panel } from '@/components/UI';
export default function NewEntryChoice(){
  return <Page>
    <Heading sub="Escolha o tipo da movimentação">Novo lançamento</Heading>
    <Panel>
      <Action title="Nova receita" onPress={()=>router.push('/new/income')}/>
      <Action title="Nova despesa" onPress={()=>router.push('/new/expense')}/>
      <Action title="Compra parcelada" secondary onPress={()=>router.push({pathname:'/new/[type]',params:{type:'expense',kind:'installment'}})}/>
    </Panel>
  </Page>;
}
