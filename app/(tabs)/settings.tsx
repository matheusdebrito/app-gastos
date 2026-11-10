import { useApp } from '@/state/AppState';
import { ChoiceRow, Chip, Heading, Page, Panel, Txt } from '@/components/UI';

export default function Settings() {
  const {theme,setTheme}=useApp();
  return <Page>
    <Heading sub="Preferências do aplicativo">Configurações</Heading>
    <Panel><Txt bold size={18}>Aparência</Txt>
      <ChoiceRow>
        <Chip label="Automático" selected={theme==='auto'} onPress={()=>setTheme('auto')}/>
        <Chip label="Claro" selected={theme==='light'} onPress={()=>setTheme('light')}/>
        <Chip label="Escuro" selected={theme==='dark'} onPress={()=>setTheme('dark')}/>
      </ChoiceRow>
    </Panel>
    <Panel><Txt bold>Privacidade</Txt>
      <Txt muted>O App Gastos mantém suas movimentações no dispositivo, sem login e sem enviar dados financeiros para servidores.</Txt>
      <Txt muted>Ao desinstalar o aplicativo, os dados locais podem ser perdidos. Backup e exportação ainda não fazem parte desta versão.</Txt>
    </Panel>
    <Panel><Txt bold>Versão em desenvolvimento</Txt><Txt muted>Android · Expo · SQLite local</Txt></Panel>
  </Page>;
}
