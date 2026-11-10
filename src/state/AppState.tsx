import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Category, Entry, monthKey, today } from '@/domain/finance';
import * as store from '@/data/database';
import prefStorage from 'expo-sqlite/kv-store';

type UndoItem = { id:string; snapshot:store.DeletedSnapshot; expires:number };
type AppContextType = {
  ready: boolean; error: string | null;
  undoItems: UndoItem[];
  registerUndo: (snapshot:store.DeletedSnapshot)=>void;
  restoreUndo: (id:string)=>Promise<void>;
  categories: Category[];
  refresh: () => Promise<void>;
  entries: (month: string) => Promise<Entry[]>;
  revision: number;
  dashboardMonth: string; setDashboardMonth: (month: string) => void;
  historyMonth: string; setHistoryMonth: (month: string) => void;
  historySearch: string; setHistorySearch: (s: string) => void;
  historyType: string; setHistoryType: (s: string) => void;
  historyCategory: string; setHistoryCategory: (s: string) => void;
  historySort: string; setHistorySort: (s: string) => void;
  theme: 'auto' | 'light' | 'dark'; setTheme: (v: 'auto' | 'light' | 'dark') => void;
};
const Context = createContext<AppContextType | null>(null);
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [ready,setReady] = useState(false);
  const [undoItems,setUndoItems] = useState<UndoItem[]>([]);
  const [error,setError] = useState<string|null>(null);
  const [cats,setCats] = useState<Category[]>([]);
  const [revision,setRevision] = useState(0);
  const [dashboardMonth,setDashboardMonth] = useState(monthKey(today()));
  const [historyMonth,setHistoryMonth] = useState(monthKey(today()));
  const [historySearch,setHistorySearch] = useState('');
  const [historyType,setHistoryType] = useState('');
  const [historyCategory,setHistoryCategory] = useState('');
  const [historySort,setHistorySort] = useState('date-desc');
  const [theme,setThemeValue] = useState<'auto'|'light'|'dark'>('auto');
  const setTheme = useCallback((value:'auto'|'light'|'dark')=>{
    setThemeValue(value);
    void prefStorage.setItem('theme',value).catch(()=>{});
  },[]);
  useEffect(()=>{
    let mounted=true;
    prefStorage.getItem('theme').then(value=>{
      if(mounted&&(value==='light'||value==='dark'||value==='auto')) setThemeValue(value);
    }).catch(()=>{});
    return ()=>{mounted=false};
  },[]);
  const refresh = useCallback(async () => {
    const next = await store.categories();
    setCats(next);
    setRevision(r=>r+1);
  },[]);
  const registerUndo = useCallback((snapshot:store.DeletedSnapshot)=>{
    const id=String(Date.now())+'-'+Math.random().toString(36).slice(2);
    setUndoItems(prev=>[...prev,{id,snapshot,expires:Date.now()+5000}]);
    setTimeout(()=>setUndoItems(prev=>prev.filter(x=>x.id!==id)),5000);
  },[]);
  const restoreUndo = useCallback(async (id:string)=>{
    const item=undoItems.find(x=>x.id===id);
    if(!item || Date.now()>item.expires) return;
    await store.undoDelete(item.snapshot);
    setUndoItems(prev=>prev.filter(x=>x.id!==id));
    await refresh();
  },[undoItems,refresh]);
  useEffect(()=> {
    store.database().then(refresh).then(()=>setReady(true)).catch(e=>setError(String(e)));
  },[refresh]);
  const entries = useCallback((month:string)=>store.entriesForMonth(month),[]);
  const value = useMemo(()=>({ready,error,undoItems,registerUndo,restoreUndo,categories:cats,refresh,entries,revision,dashboardMonth,setDashboardMonth,
    historyMonth,setHistoryMonth,historySearch,setHistorySearch,historyType,setHistoryType,
    historyCategory,setHistoryCategory,historySort,setHistorySort,theme,setTheme}),
    [ready,error,undoItems,registerUndo,restoreUndo,cats,refresh,entries,revision,dashboardMonth,historyMonth,historySearch,historyType,historyCategory,historySort,theme,setTheme]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useApp() {
  const ctx=useContext(Context);
  if (!ctx) throw new Error('AppStateProvider ausente.');
  return ctx;
}
