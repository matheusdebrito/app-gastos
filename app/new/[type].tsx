import { useLocalSearchParams } from 'expo-router';
import { EntryForm } from '@/components/EntryForm';
import { EntryType } from '@/domain/finance';
export default function NewEntry() {
  const {type,kind}=useLocalSearchParams<{type:string;kind?:string}>();
  if(type!=='income'&&type!=='expense') return null;
  return <EntryForm defaultType={type as EntryType} initialKind={kind==='installment'?'installment':'single'}/>;
}
