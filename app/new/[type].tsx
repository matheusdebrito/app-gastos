import { useLocalSearchParams } from 'expo-router';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function NewEntry() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const title = type === 'income' ? 'Nova receita' : type === 'expense' ? 'Nova despesa' : 'Tipo inválido';
  return <PlaceholderScreen title={title} description="Cadastro ainda não disponível: será desenvolvido e validado no incremento I2." />;
}
