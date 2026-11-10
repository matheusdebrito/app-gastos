import {useLocalSearchParams} from 'expo-router';
import {EntryForm} from '@/components/EntryForm';
export default function EditEntry(){
  const {id,month}=useLocalSearchParams<{id:string;month:string}>();
  return <EntryForm id={id} month={month}/>;
}
