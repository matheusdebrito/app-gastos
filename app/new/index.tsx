import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function NewEntryChoice() {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>O que deseja cadastrar?</Text>
      <Pressable style={styles.button} onPress={() => router.push('/new/income')}>
        <Text style={styles.label}>Nova receita</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => router.push('/new/expense')}>
        <Text style={styles.label}>Nova despesa</Text>
      </Pressable>
      <Text style={styles.note}>Formulários serão desenvolvidos no incremento I2.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f8fafc' },
  title: { color: '#0f172a', fontSize: 22, fontWeight: '700', marginBottom: 24 },
  button: { backgroundColor: '#0f172a', borderRadius: 12, padding: 16, marginBottom: 12 },
  label: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  note: { color: '#64748b', textAlign: 'center', marginTop: 14 },
});
