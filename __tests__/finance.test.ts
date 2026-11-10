import {assertCents,dateAtPosition,installmentAmounts,money,parseDigits,positionInMonth,shiftMonth,today,totals,validDate} from '../src/domain/finance';

describe('valores financeiros exatos',()=>{
  test('entrada por dígitos e apresentação BRL',()=>{
    expect(parseDigits('15050')).toBe(15050);
    expect(money(15050)).toBe('R$ 150,50');
    expect(money(100000)).toBe('R$ 1.000,00');
    expect(money(-1234)).toBe('-R$ 12,34');
  });
  test('impede valores inválidos e imprecisos',()=>{
    expect(()=>assertCents(0)).toThrow();
    expect(()=>assertCents(0.2)).toThrow();
    expect(()=>assertCents(Number.MAX_SAFE_INTEGER+1)).toThrow();
    expect(()=>parseDigits('999999999999999999999')).toThrow();
  });
  test('última parcela recebe centavos residuais',()=>{
    expect(installmentAmounts(10000,3)).toEqual([3333,3333,3334]);
    expect(installmentAmounts(3,3)).toEqual([1,1,1]);
    expect(()=>installmentAmounts(2,3)).toThrow();
    expect(()=>installmentAmounts(100,0)).toThrow();
  });
  test('totais são calculados uma vez em centavos',()=>{
    const e={id:'1',type:'income' as const,categoryId:'x',amountCents:15050,date:'2026-11-09',description:''};
    expect(totals([e,{...e,id:'2',type:'expense',amountCents:5050}])).toEqual({income:15050,expense:5050,result:10000});
  });
  test('transbordamento de total é rejeitado',()=>{
    const e={id:'1',type:'income' as const,categoryId:'x',amountCents:Number.MAX_SAFE_INTEGER,date:'2026-11-09',description:''};
    expect(()=>totals([e,e])).toThrow();
  });
});
describe('calendário mensal',()=>{
  test('ajuste temporário ao último dia e retorno ao dia 31',()=>{
    expect(dateAtPosition('2026-01-31',2)).toBe('2026-02-28');
    expect(dateAtPosition('2026-01-31',3)).toBe('2026-03-31');
    expect(dateAtPosition('2024-01-31',2)).toBe('2024-02-29');
  });
  test('mês inicial conta como posição 1',()=>{
    expect(positionInMonth('2026-01-31','2026-01')).toBe(1);
    expect(positionInMonth('2026-01-31','2026-04')).toBe(4);
  });
  test('datas inválidas rejeitadas',()=>{
    expect(validDate('2026-02-29')).toBe(false);
    expect(validDate('2024-02-29')).toBe(true);
    expect(validDate('2026-13-01')).toBe(false);
  });
  test('navegação entre anos',()=>{
    expect(shiftMonth('2026-12',1)).toBe('2027-01');
    expect(shiftMonth('2026-01',-1)).toBe('2025-12');
  });
});
