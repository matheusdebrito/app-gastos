import * as SQLite from 'expo-sqlite';
import { assertCents, Category, dateAtPosition, Entry, EntryType, installmentAmounts, monthKey, newId, positionInMonth, Series, SeriesKind, validDate, sameTransaction, incomeNames, expenseNames } from '@/domain/finance';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;
export const database = () => {
  if (!databasePromise) databasePromise = SQLite.openDatabaseAsync('app-gastos.db').then(async db => {
    await db.execAsync('PRAGMA foreign_keys = ON');
    await migrate(db);
    return db;
  }).catch(err => { databasePromise = null; throw err; });
  return databasePromise;
};

async function migrate(db: SQLite.SQLiteDatabase) {
  const v = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  if ((v?.user_version ?? 0) >= 1) return;
  await db.withExclusiveTransactionAsync(async tx => {
    await tx.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL CHECK (type IN ('income','expense')),
        name TEXT NOT NULL CHECK (length(trim(name)) > 0),
        UNIQUE(type, name COLLATE NOCASE)
      );
      CREATE TABLE IF NOT EXISTS series (
        id TEXT PRIMARY KEY,
        kind TEXT NOT NULL CHECK(kind IN ('recurring','installment')),
        type TEXT NOT NULL CHECK(type IN ('income','expense')),
        category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
        amount_cents INTEGER NOT NULL CHECK(amount_cents > 0),
        total_cents INTEGER,
        start_date TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        months INTEGER CHECK(months IS NULL OR months > 0)
      );
      CREATE TABLE IF NOT EXISTS entries (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL CHECK(type IN ('income','expense')),
        category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
        amount_cents INTEGER NOT NULL CHECK(amount_cents > 0),
        due_date TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        series_id TEXT REFERENCES series(id) ON DELETE RESTRICT,
        position INTEGER,
        UNIQUE(series_id, position)
      );
      CREATE TABLE IF NOT EXISTS series_exceptions (
        id TEXT PRIMARY KEY,
        series_id TEXT NOT NULL REFERENCES series(id) ON DELETE CASCADE,
        position INTEGER NOT NULL CHECK(position > 0),
        is_skipped INTEGER NOT NULL DEFAULT 0 CHECK(is_skipped IN (0,1)),
        amount_cents INTEGER CHECK(amount_cents > 0),
        category_id TEXT REFERENCES categories(id) ON DELETE RESTRICT,
        description TEXT,
        UNIQUE(series_id, position)
      );
      CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(due_date);
      CREATE INDEX IF NOT EXISTS idx_entries_cat ON entries(category_id);
      CREATE INDEX IF NOT EXISTS idx_series_start ON series(start_date);
    `);
    const incomes = incomeNames;
    const expenses = expenseNames;
    for (const [type, names] of [['income', incomes], ['expense', expenses]] as const) {
      for (const name of names) {
        await tx.runAsync('INSERT OR IGNORE INTO categories (id,type,name) VALUES (?,?,?)', newId(), type, name);
      }
    }
    await tx.execAsync('PRAGMA user_version = 1');
  });
}
type CatRow = { id: string; type: EntryType; name: string };
export async function categories(): Promise<Category[]> {
  const db = await database();
  const list = await db.getAllAsync<CatRow>('SELECT * FROM categories');
  return list.sort((a,b)=>a.name.localeCompare(b.name,'pt-BR',{sensitivity:'base'}));
}
export async function saveCategory(input: { id?: string; name: string; type: EntryType }) {
  const db = await database();
  const name = input.name.trim().normalize('NFC');
  if (!name) throw new Error('Informe o nome da categoria.');
  await db.withExclusiveTransactionAsync(async tx => {
    const current = input.id
      ? await tx.getFirstAsync<CatRow>('SELECT * FROM categories WHERE id=?',input.id)
      : null;
    if(input.id && (!current || current.type !== input.type)) throw new Error('Categoria inválida.');
    const names = await tx.getAllAsync<CatRow>('SELECT * FROM categories WHERE type=?',input.type);
    const normalized = name.toLocaleLowerCase('pt-BR');
    if(names.some(cat=>cat.id!==input.id && cat.name.trim().normalize('NFC').toLocaleLowerCase('pt-BR')===normalized)) {
      throw new Error('Já existe uma categoria com esse nome.');
    }
    if(input.id) await tx.runAsync('UPDATE categories SET name=? WHERE id=?',name,input.id);
    else await tx.runAsync('INSERT INTO categories(id,type,name) VALUES (?,?,?)',newId(),input.type,name);
  });
}
export async function deleteCategory(categoryId: string, destinationId?: string) {
  const db = await database();
  await db.withExclusiveTransactionAsync(async tx => {
    const source = await tx.getFirstAsync<CatRow>('SELECT * FROM categories WHERE id=?',categoryId);
    if (!source) throw new Error('Categoria inexistente.');
    const count = await tx.getFirstAsync<{ n: number }>('SELECT count(*) AS n FROM categories WHERE type=?',source.type);
    if (!count || count.n <= 1) throw new Error('Não é possível excluir a última categoria deste tipo.');
    const usage = await tx.getFirstAsync<{ n: number }>(`SELECT
      (SELECT count(*) FROM entries WHERE category_id=?)
      + (SELECT count(*) FROM series WHERE category_id=?)
      + (SELECT count(*) FROM series_exceptions WHERE category_id=?) AS n`,categoryId,categoryId,categoryId);
    if ((usage?.n ?? 0) > 0) {
      const dest = await tx.getFirstAsync<CatRow>('SELECT * FROM categories WHERE id=?',destinationId ?? '');
      if (!dest || dest.type !== source.type || dest.id === source.id) throw new Error('Escolha uma categoria de destino do mesmo tipo.');
      await tx.runAsync('UPDATE entries SET category_id=? WHERE category_id=?',dest.id,categoryId);
      await tx.runAsync('UPDATE series SET category_id=? WHERE category_id=?',dest.id,categoryId);
      await tx.runAsync('UPDATE series_exceptions SET category_id=? WHERE category_id=?',dest.id,categoryId);
    }
    await tx.runAsync('DELETE FROM categories WHERE id=?',categoryId);
  });
}
type EntryRow = { id: string; type: EntryType; category_id: string; amount_cents: number; due_date: string; description: string; series_id: string | null; position: number | null; kind: SeriesKind | null; months: number | null };
const rowToEntry = (r: EntryRow): Entry => ({
  id: r.id, type: r.type, categoryId: r.category_id, amountCents: r.amount_cents,
  date: r.due_date, description: r.description, seriesId: r.series_id, position: r.position,
  kind: r.kind ?? 'single', totalPositions: r.months
});
type SeriesRow = { id: string; kind: SeriesKind; type: EntryType; category_id: string; amount_cents: number; total_cents: number | null; start_date: string; description: string; months: number | null };
export async function entriesForMonth(month: string): Promise<Entry[]> {
  const db = await database();
  const saved = await db.getAllAsync<EntryRow>(`SELECT e.*,s.kind,s.months FROM entries e
    LEFT JOIN series s ON s.id=e.series_id WHERE e.due_date>=? AND e.due_date<? ORDER BY e.due_date DESC`,
    month+'-01', monthKeyNext(month)+'-01');
  const entries = saved.map(rowToEntry);
  const series = await db.getAllAsync<SeriesRow>('SELECT * FROM series WHERE months IS NULL AND start_date<?',monthKeyNext(month)+'-01');
  for (const s of series) {
    const pos = positionInMonth(s.start_date,month);
    if (pos < 1) continue;
    const exception = await db.getFirstAsync<{ is_skipped: number; amount_cents: number | null; category_id: string | null; description: string | null }>(
      'SELECT * FROM series_exceptions WHERE series_id=? AND position=?',s.id,pos);
    if (exception?.is_skipped) continue;
    const amount = exception?.amount_cents ?? s.amount_cents;
    assertCents(amount);
    entries.push({
      id: 'virtual:'+s.id+':'+pos, type: s.type, categoryId:exception?.category_id ?? s.category_id,
      amountCents: amount, date:dateAtPosition(s.start_date,pos),
      description: exception?.description ?? s.description, seriesId:s.id, position:pos,
      kind:'recurring', virtual:true
    });
  }
  return entries.sort((a,b)=>b.date.localeCompare(a.date));
}
const monthKeyNext = (month: string) => {
  const [y,m] = month.split('-').map(Number);
  const d = new Date(y,m,1);
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
};
export type EntryInput = { id?: string; type: EntryType; categoryId: string; amountCents: number; date: string; description: string; seriesId?: string; kind?: SeriesKind | 'single'; months?: number | null };
export async function saveEntry(input: EntryInput) {
  assertCents(input.amountCents);
  if (!validDate(input.date)) throw new Error('Informe uma data válida (AAAA-MM-DD).');
  const db = await database();
  await db.withExclusiveTransactionAsync(async tx => {
    const cat = await tx.getFirstAsync<CatRow>('SELECT * FROM categories WHERE id=?',input.categoryId);
    if (!cat || cat.type !== input.type) throw new Error('Selecione uma categoria compatível.');
    const kind = input.kind ?? 'single';
    if (input.id && input.id.startsWith('virtual:')) {
      const match=/^virtual:([^:]+):(\d+)$/.exec(input.id);
      if(!match || kind!=='recurring') throw new Error('Ocorrência inválida para edição pontual.');
      const series=await tx.getFirstAsync<SeriesRow>('SELECT * FROM series WHERE id=?',match[1]);
      if(!series || series.months!==null || series.type!==input.type) throw new Error('Série indefinida inválida.');
      if(input.date!==dateAtPosition(series.start_date,Number(match[2]))) throw new Error('Alterar a data desta ocorrência ainda não está disponível.');
      await tx.runAsync(`INSERT INTO series_exceptions(id,series_id,position,is_skipped,amount_cents,category_id,description)
        VALUES (?,?,?,0,?,?,?) ON CONFLICT(series_id,position) DO UPDATE SET
        is_skipped=0,amount_cents=excluded.amount_cents,category_id=excluded.category_id,description=excluded.description`,
        newId(),series.id,Number(match[2]),input.amountCents,input.categoryId,input.description.trim());
      return;
    }
    if (input.id) {
      const old = await tx.getFirstAsync<EntryRow>('SELECT * FROM entries WHERE id=?',input.id);
      if (!old) throw new Error('Lançamento não encontrado.');
      if (old.series_id) {
        const s = await tx.getFirstAsync<SeriesRow>('SELECT * FROM series WHERE id=?',old.series_id);
        if (!s) throw new Error('Série não encontrada.');
        if (s.months === null) throw new Error('Edição de série indefinida pendente de definição.');
        await tx.runAsync('DELETE FROM entries WHERE series_id=?',s.id);
        await tx.runAsync('DELETE FROM series WHERE id=?',s.id);
      } else await tx.runAsync('DELETE FROM entries WHERE id=?',old.id);
    }
    if (kind === 'single') {
      await tx.runAsync('INSERT INTO entries(id,type,category_id,amount_cents,due_date,description) VALUES (?,?,?,?,?,?)',
        input.id && !input.seriesId ? input.id : newId(),input.type,input.categoryId,input.amountCents,input.date,input.description.trim());
      return;
    }
    if (kind === 'installment' && input.type !== 'expense') throw new Error('Parcelamento é exclusivo de despesas.');
    const months = input.months ?? null;
    if (months !== null && (!Number.isInteger(months) || months < 1 || months > 12000)) throw new Error('Quantidade de meses inválida.');
    if (kind === 'installment' && months === null) throw new Error('Informe o número de parcelas.');
    const id = newId();
    await tx.runAsync('INSERT INTO series(id,kind,type,category_id,amount_cents,total_cents,start_date,description,months) VALUES (?,?,?,?,?,?,?,?,?)',
      id,kind,input.type,input.categoryId,input.amountCents,kind==='installment'?input.amountCents:null,input.date,input.description.trim(),months);
    if (months !== null) {
      const amounts = kind === 'installment'
        ? installmentAmounts(input.amountCents,months)
        : Array.from({length:months},()=>input.amountCents);
      for (let i=0;i<amounts.length;i++) {
        await tx.runAsync('INSERT INTO entries(id,type,category_id,amount_cents,due_date,description,series_id,position) VALUES (?,?,?,?,?,?,?,?)',
          newId(),input.type,input.categoryId,amounts[i],dateAtPosition(input.date,i+1),input.description.trim(),id,i+1);
      }
    }
  });
}
export async function hasDuplicate(input: EntryInput) {
  // Inclui ocorrências recorrentes calculadas; o aviso não altera os dados.
  const existing = await entriesForMonth(monthKey(input.date));
  return existing.some(entry=>entry.id!==input.id && sameTransaction(entry,input));
}
export async function categoryUsage(id: string): Promise<number> {
  const db=await database();
  const count=await db.getFirstAsync<{n:number}>(`SELECT
    (SELECT count(*) FROM entries WHERE category_id=?)
    +(SELECT count(*) FROM series WHERE category_id=?)
    +(SELECT count(*) FROM series_exceptions WHERE category_id=?) AS n`,id,id,id);
  return count?.n??0;
}
type ExceptionRow = {id:string;series_id:string;position:number;is_skipped:number;amount_cents:number|null;category_id:string|null;description:string|null};
export type DeletedSnapshot = { series: SeriesRow | null; entries: EntryRow[]; exception?:{seriesId:string;position:number;previous:ExceptionRow|null} };
export async function deleteEntry(entry: Entry): Promise<DeletedSnapshot | null> {
  const db = await database();
  if (entry.virtual) {
    let previous: ExceptionRow | null = null;
    await db.withExclusiveTransactionAsync(async tx=>{
      previous=await tx.getFirstAsync<ExceptionRow>('SELECT * FROM series_exceptions WHERE series_id=? AND position=?',entry.seriesId!,entry.position!);
      await tx.runAsync(`INSERT INTO series_exceptions(id,series_id,position,is_skipped) VALUES (?,?,?,1)
        ON CONFLICT(series_id,position) DO UPDATE SET is_skipped=1`,newId(),entry.seriesId!,entry.position!);
    });
    return {series:null,entries:[],exception:{seriesId:entry.seriesId!,position:entry.position!,previous}};
  }
  let snapshot: DeletedSnapshot = {series:null,entries:[]};
  await db.withExclusiveTransactionAsync(async tx => {
    const series = entry.seriesId
      ? await tx.getFirstAsync<SeriesRow>('SELECT * FROM series WHERE id=?',entry.seriesId)
      : null;
    if (series) {
      snapshot.series = series;
      snapshot.entries = await tx.getAllAsync<EntryRow>('SELECT * FROM entries WHERE series_id=?',series.id);
      await tx.runAsync('DELETE FROM entries WHERE series_id=?',series.id);
      await tx.runAsync('DELETE FROM series WHERE id=?',series.id);
    } else {
      snapshot.entries = await tx.getAllAsync<EntryRow>('SELECT * FROM entries WHERE id=?',entry.id);
      await tx.runAsync('DELETE FROM entries WHERE id=?',entry.id);
    }
  });
  return snapshot;
}
export async function undoDelete(snapshot: DeletedSnapshot) {
  const db = await database();
  await db.withExclusiveTransactionAsync(async tx => {
    if(snapshot.exception){
      const {seriesId,position,previous}=snapshot.exception;
      await tx.runAsync('DELETE FROM series_exceptions WHERE series_id=? AND position=?',seriesId,position);
      if(previous) await tx.runAsync('INSERT INTO series_exceptions(id,series_id,position,is_skipped,amount_cents,category_id,description) VALUES (?,?,?,?,?,?,?)',
        previous.id,previous.series_id,previous.position,previous.is_skipped,previous.amount_cents,previous.category_id,previous.description);
    }
    const s = snapshot.series;
    if (s) await tx.runAsync('INSERT INTO series(id,kind,type,category_id,amount_cents,total_cents,start_date,description,months) VALUES (?,?,?,?,?,?,?,?,?)',
      s.id,s.kind,s.type,s.category_id,s.amount_cents,s.total_cents,s.start_date,s.description,s.months);
    for (const r of snapshot.entries) await tx.runAsync('INSERT INTO entries(id,type,category_id,amount_cents,due_date,description,series_id,position) VALUES (?,?,?,?,?,?,?,?)',
      r.id,r.type,r.category_id,r.amount_cents,r.due_date,r.description,r.series_id,r.position);
  });
}

export async function findEntryForEdit(id: string, month: string): Promise<EntryInput | null> {
  const item = (await entriesForMonth(month)).find(x => x.id === id);
  if (!item) return null;
  const db=await database();
  let amountCents=item.amountCents;
  let months=item.totalPositions;
  let date=item.date;
  let description=item.description;
  let categoryId=item.categoryId;
  if (item.seriesId && !item.virtual) {
    const series=await db.getFirstAsync<SeriesRow>('SELECT * FROM series WHERE id=?',item.seriesId);
    if(series) {
      months=series.months;
      date=series.start_date;
      description=series.description;
      categoryId=series.category_id;
      amountCents=series.kind==='installment'?(series.total_cents ?? item.amountCents):series.amount_cents;
    }
  }
  return {id:item.id,type:item.type,categoryId,amountCents,date,
    description,kind:item.kind,seriesId:item.seriesId??undefined,months};
}
