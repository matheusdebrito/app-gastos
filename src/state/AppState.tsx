import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Category, Entry, monthKey, today } from '@/domain/finance';
import * as store from '@/data/database';

type AppContextType = {
  ready: boolean; error: string | null;
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
  const [error,setError] = useState<string|null>(null);
  const [cats,setCats] = useState<Category[]>([]);
  const [revision,setRevision] = useState(0);
  const [dashboardMonth,setDashboardMonth] = useState(monthKey(today()));
  const [historyMonth,setHistoryMonth] = useState(monthKey(today()));
  const [historySearch,setHistorySearch] = useState('');
  const [historyType,setHistoryType] = useState('');
  const [historyCategory,setHistoryCategory] = useState('');
  const [historySort,setHistorySort] = useState('date-desc');
  const [theme,setTheme] = useState<'auto'|'light'|'dark'>('auto');
  const refresh = useCallback(async () => {
    const next = await store.categories();
    setCats(next);
    setRevision(r=>r+1);
  },[]);
  useEffect(()=> {
    store.database().then(refresh).then(()=>setReady(true)).catch(e=>setError(String(e)));
  },[refresh]);
  const entries = useCallback((month:string)=>store.entriesForMonth(month),[]);
  const value = useMemo(()=>({ready,error,categories:cats,refresh,entries,revision,dashboardMonth,setDashboardMonth,
    historyMonth,setHistoryMonth,historySearch,setHistorySearch,historyType,setHistoryType,
    historyCategory,setHistoryCategory,historySort,setHistorySort,theme,setTheme}),
    [ready,error,cats,refresh,entries,revision,dashboardMonth,historyMonth,historySearch,historyType,historyCategory,historySort,theme]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useApp() {
  const ctx=useContext(Context);
  if (!ctx) throw new Error('AppStateProvider ausente.');
  return ctx;
}
