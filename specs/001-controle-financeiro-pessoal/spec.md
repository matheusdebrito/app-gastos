# Especificação funcional — Controle financeiro pessoal

**Feature:** 001-controle-financeiro-pessoal
**Status:** PROPOSTA — aguardando validação dos requisitos
**Data:** 2026-11-02
**Constitution:** v1.0.0, ratificada em 2026-11-02

## Contexto

Aplicativo Android de uso individual para acompanhar dinheiro recebido e gasto, entender a distribuição dos gastos e consultar resultados por mês. O aplicativo deve funcionar offline, sem login e com dados persistidos localmente. React Native e TypeScript são restrições já aprovadas; escolhas adicionais de implementação ficam para Plan.

## Objetivo

Permitir registrar e consultar movimentações financeiras pessoais de maneira rápida, identificar gastos por categoria e acompanhar o resultado de cada mês.

## Cenários de usuário

- **US-001 (P1) — Registrar despesa:** como usuário, quero lançar um gasto com valor, data, categoria e descrição opcional para saber para onde foi meu dinheiro.
- **US-002 (P1) — Registrar receita:** como usuário, quero registrar salário e demais entradas para acompanhar quanto recebi.
- **US-003 (P1) — Acompanhar mês:** como usuário, quero ver total recebido, total gasto e diferença entre eles no mês selecionado.
- **US-004 (P1) — Categorizar:** como usuário, quero classificar os gastos e visualizar quanto gastei em cada categoria.
- **US-005 (P1) — Revisar histórico:** como usuário, quero consultar lançamentos anteriores e corrigir registros inseridos incorretamente.
- **US-006 (P2) — Consultar períodos:** como usuário, quero selecionar outro mês e consultar seu resultado sem modificar lançamentos.

## Requisitos funcionais

- **REQ-001 [VALIDADO]** Permitir registrar despesas com valor positivo, data e categoria; descrição é opcional.
- **REQ-002 [VALIDADO]** Permitir registrar receitas, incluindo salário e outras entradas, com valor positivo e data; descrição é opcional.
- **REQ-003 [VALIDADO]** Consultar lançamentos registrados, distinguindo receita de despesa e apresentando valor, data e categoria quando aplicável.
- **REQ-004 [VALIDADO]** Apresentar para o mês selecionado o total de receitas, o total de despesas e o resultado do período (receitas menos despesas).
- **REQ-005 [VALIDADO]** Organizar despesas por categorias e apresentar total gasto por categoria para o mês selecionado.
- **REQ-006 [VALIDADO]** Permitir consultar meses anteriores e posteriores com lançamentos.
- **REQ-007 [ASSUMIDO]** Permitir editar e excluir lançamentos com confirmação antes de exclusão.
- **REQ-008 [ASSUMIDO]** Disponibilizar categorias iniciais úteis e permitir criar, editar ou desativar categorias pessoais sem perder vínculos históricos.
- **REQ-009 [VALIDADO]** Manter registros no dispositivo e permitir registrar e consultar informações sem internet ou login.
- **REQ-010 [ASSUMIDO]** Apresentar um resumo legível do mês e uma relação de despesas agrupadas por categoria, sem exigir um tipo específico de gráfico.
- **REQ-011 [ASSUMIDO]** Impedir lançamento com valor zero, negativo, inválido ou data inválida e mostrar mensagem que identifique o problema.
- **REQ-012 [ASSUMIDO]** Ao alterar ou excluir um lançamento, atualizar os totais correspondentes sem duplicá-lo.

## Critérios de aceitação

- **AC-001 → REQ-001:** dada uma despesa válida, quando for salva, ela aparece na consulta do mês referente à data informada.
- **AC-002 → REQ-002:** dada uma receita válida, quando for salva, ela contribui para as receitas do mês da data informada.
- **AC-003 → REQ-003:** a consulta identifica tipo, valor e data de cada lançamento e permite distinguir visualmente entradas de saídas.
- **AC-004 → REQ-004:** com receitas de R$ 3.000,00 e despesas de R$ 1.200,00 no mesmo mês, o resumo mostra R$ 3.000,00 recebidos, R$ 1.200,00 gastos e resultado de R$ 1.800,00.
- **AC-005 → REQ-005:** com duas despesas de R$ 20,00 e R$ 30,00 na mesma categoria, o total da categoria para o mês é R$ 50,00.
- **AC-006 → REQ-006:** selecionar outro mês altera o conjunto de lançamentos e os totais, sem modificar o mês anterior.
- **AC-007 → REQ-007:** editar um lançamento altera sua apresentação e os totais; excluir requer confirmação e remove o efeito financeiro do lançamento.
- **AC-008 → REQ-008:** uma categoria criada pode ser utilizada em novas despesas; alterações de categorias não apagam lançamentos antigos.
- **AC-009 → REQ-009:** criar lançamento offline, fechar e abrir o aplicativo preserva o registro e permite consultá-lo ainda offline.
- **AC-010 → REQ-010:** ao selecionar um mês sem dados, o aplicativo apresenta totais zerados e estado vazio compreensível.
- **AC-011 → REQ-011:** valores e datas inválidos bloqueiam o salvamento e exibem erro acionável.
- **AC-012 → REQ-012:** editar um lançamento de R$ 20,00 para R$ 35,00 aumenta o total de despesas do período em R$ 15,00, e não R$ 35,00.

## Casos de borda e regras a confirmar

- Lançamento no último dia do mês e mudança de mês/ano.
- Lançamento retroativo e edição da data que transfere o registro de um mês para outro.
- Exclusão/renomeação de categoria já utilizada.
- Valores altos, casas decimais e apresentação em moeda brasileira.
- Aplicativo fechado ou reiniciado durante uma gravação.
- Meses sem receitas, sem despesas ou com despesas superiores às receitas.
- Falha de armazenamento e eventual falta de espaço.
- Desinstalação, troca ou perda do telefone: estratégia de backup/restauração ainda não definida.

## Fora do escopo confirmado

- Contas e login; múltiplos usuários.
- Backend, nuvem e sincronização obrigatória.
- Publicação comercial em lojas e monetização.
- iOS na primeira versão.
- Conexões bancárias automáticas.
- Anúncios, rastreadores e serviços pagos obrigatórios.

## Questões abertas (não implementar como decisão aprovada)

- **OPEN-001:** resultado do mês é suficiente ou também deverá existir saldo acumulado entre meses? [ABERTO]
- **OPEN-002:** salário e despesas fixas serão lançados manualmente todo mês ou poderão ser recorrentes? [ABERTO]
- **OPEN-003:** despesas parceladas, faturas e cartões de crédito fazem parte da primeira versão? [ABERTO]
- **OPEN-004:** necessidade de orçamento/metas por categoria e alertas de limite? [ABERTO]
- **OPEN-005:** forma de backup, restauração e exportação local dos registros? [ABERTO]
- **OPEN-006:** categorias de receitas, categorias padrão e política de alteração/exclusão? [ABERTO]
- **OPEN-007:** data de referência dos registros e tratamento de períodos futuros? [ABERTO]
- **OPEN-008:** confirmação de requisitos ASSUMIDOS REQ-007, 008, 010, 011 e 012. [ABERTO]

## Próximo passo

Revisar os requisitos com o responsável e resolver as questões relevantes com Clarify antes do Plan. Nenhuma implementação autorizada por este documento.
