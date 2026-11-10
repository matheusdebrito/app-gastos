import {assertCents,dateAtPosition,installmentAmounts,money,parseDigits,positionInMonth,shiftMonth,today,totals,validDate,formatBRDate,parseBRDate,maskBRDate,sameTransaction} from '../src/domain/finance';

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

describe('entrada brasileira de datas',()=>{
  test('exibe dia, mês e ano sem mudar o instante',()=>{
    expect(formatBRDate('2026-11-09')).toBe('09/11/2026');
    expect(parseBRDate('09/11/2026')).toBe('2026-11-09');
    expect(formatBRDate('2026-02-30')).toBe('');
  });
  test('rejeita data inválida e aceita bissexto',()=>{
    expect(parseBRDate('29/02/2026')).toBeNull();
    expect(parseBRDate('29/02/2024')).toBe('2024-02-29');
    expect(parseBRDate('1/02/2024')).toBeNull();
    expect(parseBRDate('31/11/2026')).toBeNull();
  });
  test('adiciona separadores durante a digitação',()=>{
    expect(maskBRDate('09112026')).toBe('09/11/2026');
    expect(maskBRDate('0911')).toBe('09/11');
    expect(maskBRDate('09/11/2026')).toBe('09/11/2026');
    expect(maskBRDate('0911202622')).toBe('09/11/2026');
  });
});

describe('aviso de duplicidade',()=>{
  const first={type:'expense' as const,categoryId:'mercado',amountCents:1250,date:'2026-11-09'};
  test('valores e dados iguais são possível duplicidade',()=>{
    expect(sameTransaction(first,{...first})).toBe(true);
  });
  test('valor, data, tipo ou categoria diferente não é duplicidade',()=>{
    expect(sameTransaction(first,{...first,amountCents:1200})).toBe(false);
    expect(sameTransaction(first,{...first,date:'2026-11-10'})).toBe(false);
    expect(sameTransaction(first,{...first,categoryId:'lazer'})).toBe(false);
    expect(sameTransaction(first,{...first,type:'income'})).toBe(false);
  });
});

test('série não deve gerar ocorrência fora da faixa de datas',()=>{
  expect(validDate(dateAtPosition('9999-12-31',1))).toBe(true);
  expect(validDate(dateAtPosition('9999-12-31',2))).toBe(false);
});
