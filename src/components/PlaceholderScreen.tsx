import { StyleSheet, Text, View } from 'react-native';

type Props = { title: string; description: string };

export function PlaceholderScreen({ title, description }: Props) {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.notice}>Estrutura inicial (I0). Nenhum dado financeiro foi registrado.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#0f172a', textAlign: 'center' },
  description: { fontSize: 16, marginTop: 12, color: '#475569', textAlign: 'center' },
  notice: { marginTop: 24, fontSize: 12, color: '#64748b', textAlign: 'center' },
});
