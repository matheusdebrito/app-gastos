import { router } from 'expo-router';
import { Action, Heading, Page, Panel, Txt } from '@/components/UI';

export default function NewEntryChoice() {
  return <Page>
    <Heading sub="O que você quer registrar?">Novo lançamento</Heading>
    <Panel>
      <Action title="+ Registrar gasto" onPress={() => router.push('/new/expense')} />
      <Action title="+ Registrar renda" secondary onPress={() => router.push('/new/income')} />
    </Panel>
    <Txt muted size={13}>Parcelas e gastos que se repetem podem ser configurados no cadastro do gasto.</Txt>
  </Page>;
}
