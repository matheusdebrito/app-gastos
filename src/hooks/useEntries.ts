import {useEffect,useState} from 'react';
import {Entry} from '@/domain/finance';
import {useApp} from '@/state/AppState';
export function useEntries(month:string) {
  const { entries, revision,ready } = useApp();
  const [data,setData] = useState<Entry[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<string|null>(null);
  useEffect(()=>{
    if (!ready) return;
    let active=true;
    setLoading(true);
    entries(month).then(rows=>{if(active){setData(rows);setError(null)}})
      .catch(e=>{if(active)setError(String(e))})
      .finally(()=>{if(active)setLoading(false)});
    return ()=>{active=false};
  },[month,revision,entries,ready]);
  return { data,loading,error };
}
