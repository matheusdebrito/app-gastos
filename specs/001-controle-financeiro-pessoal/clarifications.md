# Clarificações — Controle financeiro pessoal

**Data:** 2026-11-05  
**Origem:** revisão da especificação funcional com base nas decisões já aprovadas e registradas em `spec.md`.  
**Status:** consolidação documental; nenhuma nova decisão funcional foi presumida.

## Decisões anteriores reconciliadas

| Ponto | Resolução documentada | Referências |
|---|---|---|
| REQ-007 | Edição e exclusão de lançamentos já foram detalhadas e validadas | REQ-046 a REQ-050, REQ-097, REQ-105 a REQ-107 |
| REQ-008 e OPEN-006 | Categorias iniciais e exclusão em uso já têm regras definitivas | REQ-031 a REQ-034, REQ-061, REQ-064, REQ-099, REQ-119 a REQ-122 |
| REQ-010 | Dashboard mensal e gráficos já estão aprovados | REQ-035 a REQ-037 e decisões de visualização |
| REQ-011 | Entradas monetárias válidas e datas são obrigatórias | REQ-060, REQ-124 a REQ-126 |
| REQ-012 | Editar ou excluir exige atualização de totais sem duplicação | REQ-042, REQ-043, REQ-103, REQ-112, REQ-113 |
| REQ-015 e REQ-023 | Recorrências só entram uma vez por mês, inclusive após reiniciar | REQ-042 a REQ-045 |
| REQ-026 e OPEN-013 | Parcelas entram no mês de sua cobrança, inclusive futura, sem confirmação de pagamento | REQ-025, REQ-042, REQ-043, REQ-055 |
| REQ-041 | Busca/filtros combináveis, estado vazio e preservação de estado já foram definidos | REQ-038 a REQ-041, REQ-108 a REQ-110 |
| OPEN-019 | Quantidade positiva de meses é livre; cuidado com renderização extrema fica para análise técnica | REQ-051 a REQ-053 |
| OPEN-011 | Para receitas, séries fixas só podem ser editadas/excluídas integralmente; indefinidas admitem ocorrência única ou futuras | REQ-020 a REQ-022 |

## Restrições já aprovadas

- Android com React Native e TypeScript, offline, sem conta nem backend.
- Dados financeiros persistidos localmente com cálculos exatos em centavos.
- Backup, restauração, exportação e sincronização ficam fora desta primeira versão.
- Padrões de navegação, formulários, histórico, recorrências, parcelamentos, categorias e dashboard documentados nos requisitos.
- Sem aprovação de implementação nesta revisão.

## Pontos reservados ao Plan

1. Escolher e justificar Expo versus configuração React Native nativa.
2. Definir persistência local e política de migração/transações.
3. Definir limite técnico seguro de valores e comportamento de períodos muito extensos, preservando requisitos de negócio.
4. Definir estratégia e ambiente de testes Android, dados financeiros e integração com persistência.
5. Alinhar a Constitution, que ainda menciona decisão futura de backup, ao escopo funcional já decidido de não incluir backup nesta versão, sem alterar os princípios ratificados sem revisão explícita.

## Ponto funcional não bloqueante

A sinalização **"Previsto" no cabeçalho do Histórico em meses futuros** ainda não foi aprovada pelo usuário. A identificação de lançamentos futuros no Histórico (REQ-129) e de meses futuros no Dashboard (REQ-130) **já está aprovada**. Não presumir que a sinalização do cabeçalho do Histórico foi aprovada; pode ser tratada posteriormente como refinamento de interface, sem bloquear o planejamento do núcleo.

## Próximo marco

Executar análise de consistência entre Constitution, especificação e estas clarificações; em seguida elaborar o Plan para aprovação, gerar Tasks, analisar dependências e só então implementar.
