export type EntryType = 'income' | 'expense';
export type SeriesKind = 'recurring' | 'installment';
export type Entry = {
  id: string;
  type: EntryType;
  categoryId: string;
  amountCents: number;
  date: string;
  description: string;
  seriesId?: string | null;
  position?: number | null;
  kind?: SeriesKind | 'single';
  totalPositions?: number | null;
  virtual?: boolean;
};
export type Category = { id: string; type: EntryType; name: string };
export type Series = {
  id: string;
  kind: SeriesKind;
  type: EntryType;
  categoryId: string;
  amountCents: number;
  totalCents: number | null;
  startDate: string;
  description: string;
  months: number | null;
};
export const incomeNames = ['Salário', 'Renda extra', 'Reembolso', 'Presentes', 'Outros'];
export const expenseNames = ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Lazer', 'Compras', 'Educação', 'Assinaturas', 'Outros'];
export const assertCents = (n: number): number => {
  if (!Number.isSafeInteger(n) || n <= 0) throw new Error('Informe um valor positivo dentro do limite numérico seguro.');
  return n;
};
export const money = (n: number) => {
  if (!Number.isSafeInteger(n)) return 'Valor inválido';
  const negative = n < 0 ? '-' : '';
  const a = Math.abs(n);
  const units = Math.floor(a / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return negative + 'R$ ' + units + ',' + String(a % 100).padStart(2, '0');
};
export const parseDigits = (text: string) => {
  const digits = text.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  if (!digits) return 0;
  const value = Number(digits);
  if (!Number.isSafeInteger(value)) throw new Error('Valor acima do limite suportado.');
  return value;
};
export const today = () => {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
};
export const monthKey = (day: string) => day.slice(0, 7);
export const shiftMonth = (month: string, shift: number): string => {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, m - 1 + shift, 1);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
};
export const dateAtPosition = (start: string, position: number): string => {
  if (!Number.isSafeInteger(position) || position < 1) throw new Error('Ocorrência inválida.');
  const [year, month, day] = start.split('-').map(Number);
  const d = new Date(year, month - 1 + position - 1, 1);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(Math.min(day, last)).padStart(2, '0');
};
export const validDate = (date: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [y,m,d] = date.split('-').map(Number);
  return y >= 1900 && y <= 9999 && m >= 1 && m <= 12 && d >= 1 &&
    d <= new Date(y, m, 0).getDate();
};
export const positionInMonth = (start: string, month: string) => {
  const [y,m] = start.split('-').map(Number);
  const [ty,tm] = month.split('-').map(Number);
  return (ty - y) * 12 + tm - m + 1;
};
export function installmentAmounts(totalCents: number, months: number): number[] {
  assertCents(totalCents);
  if (!Number.isSafeInteger(months) || months < 1 || months > totalCents || months > 12000) {
    throw new Error('Número de parcelas inválido ou maior que o valor total em centavos.');
  }
  const base = Math.floor(totalCents / months);
  const remainder = totalCents % months;
  const amounts = Array.from({ length: months }, (_, i) => base + (i === months - 1 ? remainder : 0));
  return amounts;
}
export function totals(entries: Entry[]) {
  let income = 0;
  let expense = 0;
  for (const e of entries) {
    assertCents(e.amountCents);
    const next = (e.type === 'income' ? income : expense) + e.amountCents;
    if (!Number.isSafeInteger(next)) throw new Error('Total fora do limite seguro.');
    if (e.type === 'income') income = next; else expense = next;
  }
  const result = income - expense;
  if (!Number.isSafeInteger(result)) throw new Error('Resultado fora do limite seguro.');
  return { income, expense, result };
}
export function newId(): string {
  return String(Date.now()) + '-' + Math.random().toString(36).slice(2, 12);
}

/** Converte datas internas ISO para o formato apresentado no Android. */
export function formatBRDate(iso: string): string {
  if (!validDate(iso)) return '';
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}
/** Valida DD/MM/AAAA antes de converter para ISO; nunca usa Date.parse com fuso. */
export function parseBRDate(text: string): string | null {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(text)) return null;
  const [day, month, year] = text.split('/');
  const iso = `${year}-${month}-${day}`;
  return validDate(iso) ? iso : null;
}
/** Máscara progressiva para entrada de data brasileira. */
export function maskBRDate(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
}
