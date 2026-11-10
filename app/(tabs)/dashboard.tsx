import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { monthKey, money, today, totals } from '@/domain/finance';
import { useApp } from '@/state/AppState';
import { useEntries } from '@/hooks/useEntries';
import { Action, Heading, MonthNav, Page, Panel, Txt, useColors } from '@/components/UI';

export default function Dashboard() {
  const ctx = useApp();
  const c = useColors();
  const { data, error, loading } = useEntries(ctx.dashboardMonth);
  const { income, expense, result } = totals(data);
  const forecast = ctx.dashboardMonth > monthKey(today());

  const expensesByCategory = useMemo(() => {
    const sums = new Map<string, number>();
    data.filter(item => item.type === 'expense').forEach(item => {
      sums.set(item.categoryId, (sums.get(item.categoryId) ?? 0) + item.amountCents);
    });
    return [...sums.entries()].map(([id, amount]) => ({
      id,
      amount,
      name: ctx.categories.find(category => category.id === id)?.name ?? 'Categoria',
    })).sort((a, b) => b.amount - a.amount);
  }, [data, ctx.categories]);

  return <Page>
    <Heading sub="Seus gastos e sua renda, sem complicação">Meu dinheiro</Heading>
    <MonthNav month={ctx.dashboardMonth} onChange={ctx.setDashboardMonth} />

    {error && <Panel><Txt color={c.red}>{error}</Txt></Panel>}
    <Panel style={{ paddingVertical: 23 }}>
      <Txt muted size={14}>{forecast ? 'Resultado previsto do mês' : 'Sobrou no mês'}</Txt>
      <View style={{ marginTop: 8, marginBottom: 15 }}>
        <Txt size={35} bold color={result < 0 ? c.red : c.text}>{money(result)}</Txt>
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Txt muted size={13}>{forecast ? 'Renda prevista' : 'Renda'}</Txt>
          <Txt size={19} bold color={c.green}>{money(income)}</Txt>
        </View>
        <View style={{ width: 1, backgroundColor: c.border }} />
        <View style={{ flex: 1 }}>
          <Txt muted size={13}>{forecast ? 'Gastos previstos' : 'Gastos'}</Txt>
          <Txt size={19} bold color={c.red}>{money(expense)}</Txt>
        </View>
      </View>
    </Panel>

    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
      <View style={{ flex: 1 }}>
        <Action title="+ Gasto" onPress={() => router.push('/new/expense')} />
      </View>
      <View style={{ flex: 1 }}>
        <Action title="+ Renda" secondary onPress={() => router.push('/new/income')} />
      </View>
    </View>

    <Panel>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <Txt bold size={18}>Onde gastei</Txt>
        <Pressable accessibilityRole="button" onPress={() => {
          ctx.setHistoryMonth(ctx.dashboardMonth);
          ctx.setHistoryType('expense');
          ctx.setHistoryCategory('');
          router.navigate('/(tabs)/history');
        }}>
          <Txt color={c.primary} size={13}>Ver lançamentos</Txt>
        </Pressable>
      </View>
      {loading ? <Txt muted>Carregando gastos...</Txt> :
        expensesByCategory.length === 0 ? <Txt muted>Sem gastos neste mês.</Txt> :
        expensesByCategory.map((item, index) => <Pressable
          key={item.id}
          accessibilityRole="button"
          accessibilityLabel={item.name + ', ' + money(item.amount)}
          onPress={() => {
            ctx.setHistoryMonth(ctx.dashboardMonth);
            ctx.setHistoryType('expense');
            ctx.setHistoryCategory(item.id);
            router.navigate('/(tabs)/history');
          }}
          style={{ paddingVertical: 10, borderBottomWidth: index === expensesByCategory.length - 1 ? 0 : 1, borderBottomColor: c.border }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Txt>{item.name}</Txt>
            <Txt bold>{money(item.amount)}</Txt>
          </View>
          <View style={{ height: 5, borderRadius: 5, backgroundColor: c.border, marginTop: 9, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: (expense > 0 ? Math.min(100, item.amount / expense * 100) : 0) + '%', backgroundColor: c.primary, borderRadius: 5 }} />
          </View>
        </Pressable>)}
    </Panel>

    {data.length === 0 && !loading && <Txt muted size={13}>Comece cadastrando um gasto ou uma renda.</Txt>}
    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-around' }}>
      <Pressable accessibilityRole="button" onPress={() => router.navigate('/(tabs)/categories')} style={{ padding: 10 }}>
        <Txt color={c.muted} size={13}>Categorias</Txt>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => router.navigate('/(tabs)/settings')} style={{ padding: 10 }}>
        <Txt color={c.muted} size={13}>Configurações</Txt>
      </Pressable>
    </View>
  </Page>;
}
