import { View } from 'react-native';
import { useApp } from '@/state/AppState';
import { ChoiceRow, Chip, Heading, Page, Panel, Txt } from '@/components/UI';

export default function Settings() {
  const {theme,setTheme}=useApp();
  return <Page>
    <Heading sub="Personalize a aparência do aplicativo">Ajustes</Heading>
    <Panel>
      <Txt bold size={17}>Aparência</Txt>
      <ChoiceRow>
        <Chip label="Automático" selected={theme==='auto'} onPress={()=>setTheme('auto')}/>
        <Chip label="Claro" selected={theme==='light'} onPress={()=>setTheme('light')}/>
        <Chip label="Escuro" selected={theme==='dark'} onPress={()=>setTheme('dark')}/>
      </ChoiceRow>
    </Panel>
    <Panel>
      <Txt bold size={17}>Seus dados ficam no celular</Txt>
      <Txt muted size={14}>O aplicativo funciona sem internet e não exige conta.</Txt>
      <View style={{height:12}}/>
      <Txt muted size={13}>Atenção: por enquanto não há backup. Não limpe os dados do Expo Go nem desinstale o aplicativo se quiser manter seus lançamentos.</Txt>
    </Panel>
  </Page>;
}
