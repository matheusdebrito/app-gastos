# Especificação funcional — Controle financeiro pessoal

**Feature:** 001-controle-financeiro-pessoal
**Status:** PROPOSTA — aguardando validação dos requisitos
**Data:** 2026-11-02
**Última atualização:** 2026-11-02
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

- **US-007 (P1) — Configurar repetição de despesa:** como usuário, quero ativar a recorrência ao cadastrar uma despesa e escolher entre um número definido de meses e repetição indefinida.

- **US-008 (P1) — Editar recorrência:** como usuário, quero decidir se a alteração afeta somente a ocorrência escolhida ou essa ocorrência e as futuras.

- **US-009 (P1) — Excluir ocorrência recorrente:** como usuário, quero escolher entre remover apenas uma despesa recorrente selecionada ou cancelar aquela e todas as ocorrências seguintes.

- **US-010 (P1) — Receitas recorrentes:** como usuário, quero ativar opcionalmente a repetição mensal de qualquer receita, por X meses ou indefinidamente, e controlar suas alterações e exclusões.

- **US-011 (P1) — Compra parcelada:** como usuário, quero registrar uma compra com valor total, quantidade de parcelas e data inicial para acompanhar seu impacto em cada mês.

- **US-012 (P1) — Gerenciar categorias:** como usuário, quero começar com categorias úteis e poder cadastrar, renomear e excluir categorias personalizadas.

- **US-013 (P1) — Excluir categoria em uso:** como usuário, quero escolher uma categoria de destino para todos os lançamentos vinculados antes de excluir a categoria original.

- **US-014 (P1) — Categorizar receitas:** como usuário, quero classificar minhas receitas em categorias próprias, separadas das despesas, para identificar suas origens.

- **US-015 (P1) — Analisar evolução financeira:** como usuário, quero visualizar o resumo de cada mês, a distribuição por categoria e comparar a evolução de receitas e despesas entre meses.

## Requisitos funcionais

- **REQ-001 [VALIDADO]** Permitir registrar despesas com valor positivo, data e categoria; descrição é opcional.
- **REQ-002 [VALIDADO]** Permitir registrar receitas, incluindo salário e outras entradas, com valor positivo e data; descrição é opcional.
- **REQ-003 [VALIDADO]** Consultar lançamentos registrados, distinguindo receita de despesa e apresentando valor, data e categoria quando aplicável.
- **REQ-004 [VALIDADO]** Apresentar **somente para o mês selecionado** o total de receitas, o total de despesas e o resultado do período (receitas menos despesas). Não calcular nem exibir saldo acumulado entre meses.
- **REQ-005 [VALIDADO]** Organizar despesas por categorias e apresentar total gasto por categoria para o mês selecionado.
- **REQ-006 [VALIDADO]** Permitir consultar meses anteriores e posteriores com lançamentos.
- **REQ-007 [ASSUMIDO]** Permitir editar e excluir lançamentos com confirmação antes de exclusão.
- **REQ-008 [VALIDADO]** Disponibilizar categorias iniciais úteis e permitir criar, editar e excluir categorias personalizadas. O comportamento de exclusão de categorias utilizadas em lançamentos deve ser definido antes da implementação.
- **REQ-009 [VALIDADO]** Manter registros no dispositivo e permitir registrar e consultar informações sem internet ou login.
- **REQ-010 [ASSUMIDO]** Apresentar um resumo legível do mês e uma relação de despesas agrupadas por categoria, sem exigir um tipo específico de gráfico.
- **REQ-011 [ASSUMIDO]** Impedir lançamento com valor zero, negativo, inválido ou data inválida e mostrar mensagem que identifique o problema.
- **REQ-012 [ASSUMIDO]** Ao alterar ou excluir um lançamento, atualizar os totais correspondentes sem duplicá-lo.

- **REQ-013 [VALIDADO]** Ao cadastrar uma despesa, oferecer opção de ativar/desativar recorrência; desativada, a despesa é um lançamento único.
- **REQ-014 [VALIDADO]** Quando a recorrência estiver ativada, permitir escolher entre repetir por uma quantidade definida de meses e repetir por tempo indefinido.
- **REQ-015 [ASSUMIDO]** As ocorrências mensais devem ser contabilizadas uma única vez no resultado do respectivo mês, inclusive após reiniciar o aplicativo ou navegar entre meses.

- **REQ-016 [VALIDADO]** Na edição de uma ocorrência de despesa recorrente, permitir escolher entre alterar somente a ocorrência selecionada ou ela e todas as próximas ocorrências da mesma série.
- **REQ-017 [VALIDADO]** Alterações com alcance da ocorrência selecionada em diante não devem modificar ocorrências anteriores.

- **REQ-018 [VALIDADO]** Ao excluir uma ocorrência de despesa recorrente, permitir escolher entre excluir somente a ocorrência selecionada ou excluir a ocorrência selecionada e todas as próximas da mesma série.
- **REQ-019 [VALIDADO]** Excluir a ocorrência selecionada e futuras não deve excluir nem alterar ocorrências anteriores. Solicitar confirmação explícita antes de efetivar a exclusão.

- **REQ-020 [VALIDADO]** Toda receita poderá ser lançada uma única vez ou configurada como recorrente por X meses ou indefinidamente, com escolha feita ao cadastrá-la.
- **REQ-021 [VALIDADO]** Ao editar uma ocorrência de receita recorrente, permitir alterar apenas a selecionada ou a selecionada e as próximas, preservando as anteriores.
- **REQ-022 [VALIDADO]** Ao excluir uma ocorrência de receita recorrente, permitir excluir apenas a selecionada ou a selecionada e as próximas, com confirmação e preservação das anteriores.
- **REQ-023 [ASSUMIDO]** Cada receita recorrente deverá ser contabilizada uma única vez no respectivo mês, mesmo ao reabrir o aplicativo ou consultar novamente o período.

- **REQ-024 [VALIDADO]** Oferecer cadastro específico de compra parcelada, distinto de despesa recorrente, com valor total positivo, quantidade de parcelas e data inicial.
- **REQ-025 [VALIDADO]** Calcular automaticamente os valores das parcelas mensais a partir do valor total e da quantidade de parcelas, preservando a igualdade exata entre a soma das parcelas e o valor total.
- **REQ-026 [ASSUMIDO]** Exibir no resultado de cada mês apenas o valor da parcela atribuída ao mês, sem incluir simultaneamente o valor integral da compra.

- **REQ-027 [VALIDADO]** Não distinguir forma de pagamento nem oferecer tratamento específico para cartão de crédito, faturas, fechamento ou vencimento.
- **REQ-028 [VALIDADO]** Utilizar a data de cobrança informada pelo usuário como referência para definir em qual mês cada despesa é contabilizada.

- **REQ-029 [VALIDADO]** Iniciar o aplicativo com categorias predefinidas de despesas, incluindo exemplos como Alimentação, Transporte, Moradia, Saúde, Lazer e Compras; conjunto final sujeito a revisão.
- **REQ-030 [VALIDADO]** Permitir criar, editar e solicitar a exclusão de categorias personalizadas; a exclusão de uma categoria em uso exigirá regra explícita para os lançamentos vinculados.

- **REQ-031 [VALIDADO]** Ao excluir uma categoria com lançamentos vinculados, exigir que o usuário selecione outra categoria existente e distinta como destino, antes de confirmar a exclusão.
- **REQ-032 [VALIDADO]** Transferir todos os lançamentos vinculados para a categoria de destino sem alterar seus valores, datas ou tipos; somente depois excluir a categoria original. A operação deve ser integral: se falhar, nem a transferência nem a exclusão poderão ficar parcialmente aplicadas.

- **REQ-033 [VALIDADO]** Manter categorias de receitas separadas das categorias de despesas, sem permitir que uma categoria de um tipo seja atribuída a lançamento do outro tipo.
- **REQ-034 [VALIDADO]** Disponibilizar categorias iniciais para receitas e permitir criar, editar e excluir categorias personalizadas de receitas, seguindo a política aprovada de transferência dos lançamentos vinculados antes de excluir uma categoria em uso.

- **REQ-035 [VALIDADO]** Exibir dashboard do mês selecionado com total de receitas, total de despesas e resultado do mês, sem saldo acumulado.
- **REQ-036 [VALIDADO]** Exibir gráficos de distribuição por categorias do período selecionado, preservando a separação entre receitas e despesas.
- **REQ-037 [VALIDADO]** Exibir evolução financeira mensal e permitir comparar receitas, despesas e resultado entre meses, sem transportar saldos de um período para outro.

## Critérios de aceitação

- **AC-001 → REQ-001:** dada uma despesa válida, quando for salva, ela aparece na consulta do mês referente à data informada.
- **AC-002 → REQ-002:** dada uma receita válida, quando for salva, ela contribui para as receitas do mês da data informada.
- **AC-003 → REQ-003:** a consulta identifica tipo, valor e data de cada lançamento e permite distinguir visualmente entradas de saídas.
- **AC-004 → REQ-004:** com receitas de R$ 3.000,00 e despesas de R$ 1.200,00 no mesmo mês, o resumo mostra R$ 3.000,00 recebidos, R$ 1.200,00 gastos e resultado de R$ 1.800,00.
- **AC-005 → REQ-005:** com duas despesas de R$ 20,00 e R$ 30,00 na mesma categoria, o total da categoria para o mês é R$ 50,00.
- **AC-006 → REQ-006:** selecionar outro mês altera o conjunto de lançamentos e os totais, sem modificar o mês anterior.
- **AC-007 → REQ-007:** editar um lançamento altera sua apresentação e os totais; excluir requer confirmação e remove o efeito financeiro do lançamento.
- **AC-008 → REQ-008:** categorias iniciais estão disponíveis no primeiro uso; categorias criadas e editadas são utilizadas nos lançamentos. A exclusão preserva a integridade dos dados conforme regra a validar.
- **AC-009 → REQ-009:** criar lançamento offline, fechar e abrir o aplicativo preserva o registro e permite consultá-lo ainda offline.
- **AC-010 → REQ-010:** ao selecionar um mês sem dados, o aplicativo apresenta totais zerados e estado vazio compreensível.
- **AC-011 → REQ-011:** valores e datas inválidos bloqueiam o salvamento e exibem erro acionável.
- **AC-012 → REQ-012:** editar um lançamento de R$ 20,00 para R$ 35,00 aumenta o total de despesas do período em R$ 15,00, e não R$ 35,00.

- **AC-013 → REQ-013:** cadastrar despesa sem habilitar recorrência produz somente um lançamento.
- **AC-014 → REQ-014:** ao habilitar recorrência, ficam disponíveis as opções de prazo definido em meses e prazo indefinido; no prazo definido a quantidade de meses deve ser informada.
- **AC-015 → REQ-015:** abrir repetidamente um mês não duplica o valor de uma ocorrência recorrente no total do mês.

- **AC-016 → REQ-016:** ao editar o valor de uma ocorrência de março de R$ 120,00 para R$ 140,00 com opção 'somente esta', fevereiro e abril permanecem com R$ 120,00; com opção 'esta e próximas', fevereiro permanece em R$ 120,00 e março e abril passam a R$ 140,00.
- **AC-017 → REQ-017:** editar uma ocorrência futura não altera valores ou totais de meses anteriores à ocorrência selecionada.

- **AC-018 → REQ-018:** ao excluir somente março de uma série mensal, fevereiro e abril continuam contabilizados, mas março não; ao excluir março e próximos, fevereiro permanece e março, abril e próximos deixam de ser contabilizados.
- **AC-019 → REQ-019:** antes da exclusão, o aplicativo informa claramente o alcance escolhido e pede confirmação; após confirmar, não há alteração de totais dos meses anteriores ao selecionado.

- **AC-020 → REQ-020:** receita sem recorrência gera lançamento único; receita configurada por X meses ou indefinidamente aparece nos meses abrangidos.
- **AC-021 → REQ-021:** reajustar salário recorrente a partir de março preserva fevereiro; na opção 'somente esta', abril não se altera, enquanto na opção 'esta e próximas', abril acompanha a alteração.
- **AC-022 → REQ-022:** excluir uma receita recorrente em março somente daquela ocorrência preserva abril; excluir março e seguintes mantém fevereiro e remove a contribuição dos meses posteriores.
- **AC-023 → REQ-023:** abrir o mesmo mês repetidas vezes não duplica o total de receita recorrente.

- **AC-024 → REQ-024:** uma compra de R$ 1.200,00 em 12 parcelas iniciadas em janeiro é cadastrada como parcelamento, com 12 parcelas calculadas automaticamente.
- **AC-025 → REQ-025:** para R$ 100,00 em 3 parcelas, os valores somados são exatamente R$ 100,00, inclusive com ajuste de centavos.
- **AC-026 → REQ-026:** uma compra de R$ 1.200,00 em 12 parcelas de R$ 100,00 contribui com R$ 100,00 em cada mês correspondente, sem duplicar o valor total no resumo.

- **AC-027 → REQ-027:** registrar uma despesa não exige informar cartão, conta ou forma de pagamento e não altera o mês por regras de fatura.
- **AC-028 → REQ-028:** uma despesa informada com data de cobrança em 05/02 é contabilizada em fevereiro mesmo que a compra tenha ocorrido em janeiro.

- **AC-029 → REQ-029:** ao abrir o aplicativo pela primeira vez, há categorias iniciais disponíveis para classificar despesas.
- **AC-030 → REQ-030:** uma categoria personalizada pode ser criada, renomeada e ter sua exclusão solicitada; caso esteja vinculada a lançamentos, o sistema não deve apagar lançamentos silenciosamente.

- **AC-031 → REQ-031:** ao tentar excluir 'Academia' com lançamentos, o aplicativo exige selecionar uma categoria diferente e confirmar a ação; cancelar não modifica dados.
- **AC-032 → REQ-032:** após transferir três lançamentos de 'Academia' para 'Saúde', os três continuam consultáveis com mesmos valores e datas; totais gerais mensais permanecem iguais e os agrupamentos por categoria são atualizados. Em caso de falha, a categoria e os vínculos originais são preservados.

- **AC-033 → REQ-033:** ao cadastrar uma receita, a seleção de categorias mostra apenas categorias de receitas; ao cadastrar uma despesa, mostra apenas as de despesas.
- **AC-034 → REQ-034:** no primeiro uso, existem categorias de receita; criar e editar uma categoria reflete na seleção de receitas; ao excluir uma categoria com receitas vinculadas, é necessário escolher outra categoria de receitas e a transferência preserva valores e datas.

- **AC-035 → REQ-035:** para receitas de R$ 3.500,00 e despesas de R$ 2.400,00 em novembro, o dashboard exibe resultado de R$ 1.100,00 referente somente a novembro.
- **AC-036 → REQ-036:** despesas de R$ 100,00 em Alimentação e R$ 300,00 em Moradia aparecem em categorias distintas, somando R$ 400,00 no gráfico de despesas; receitas não entram nesse gráfico.
- **AC-037 → REQ-037:** ao comparar outubro e novembro, o aplicativo apresenta receitas, despesas e resultados próprios de cada mês e mantém consistência com os resumos mensais.

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

- Limites de gastos, metas financeiras, orçamento mensal e alertas associados.

- Contas e login; múltiplos usuários.
- Backend, nuvem e sincronização obrigatória.
- Publicação comercial em lojas e monetização.
- iOS na primeira versão.
- Conexões bancárias automáticas.
- Anúncios, rastreadores e serviços pagos obrigatórios.

## Questões abertas (não implementar como decisão aprovada)

- **OPEN-001 [VALIDADO em 2026-11-02]:** apresentar somente o resultado de cada mês. Não haverá saldo acumulado entre meses. Justificativa: o objetivo é acompanhar os resultados mensais com simplicidade. Alternativas consideradas: saldo acumulado, ou saldo acumulado com contas separadas. Impacto: dashboard e relatórios não devem transportar resultados entre meses.
- **OPEN-002 [PARCIALMENTE VALIDADO]:** despesas podem ser recorrentes, configuradas individualmente durante o cadastro, por X meses ou indefinidamente. [VALIDADO] Receitas, incluindo salário, também podem ser recorrentes pelas mesmas regras. [VALIDADO] Justificativa: facilitar o controle de despesas fixas sem obrigar recorrência em todos os gastos. Alternativas: somente manual ou recorrência obrigatória. Impacto: regras de geração/consulta mensal e tratamento de alterações.
- **OPEN-003 [PARCIALMENTE VALIDADO]:** compras parceladas terão funcionalidade própria com valor total, quantidade de parcelas e cálculo mensal [VALIDADO]. Não haverá tratamento específico para cartões de crédito e faturas [VALIDADO]. Justificativa: acompanhar compras divididas em meses separadamente de despesas recorrentes. Alternativas rejeitadas: reutilizar recorrência ou cadastrar cada parcela manualmente. Impacto: especificar distribuição exata dos centavos e regras de alterações.
- **OPEN-004 [VALIDADO em 2026-11-02]:** não incluir orçamentos, metas, limites gerais ou por categoria nem alertas de limite. O aplicativo terá foco somente em registrar e analisar receitas e despesas. Justificativa: simplicidade e foco no acompanhamento de fatos financeiros. Alternativas rejeitadas: orçamento geral, por categoria ou ambos. Impacto: nenhuma tela ou regra de acompanhamento de metas será implementada.
- **OPEN-005:** forma de backup, restauração e exportação local dos registros? [ABERTO]
- **OPEN-006 [PARCIALMENTE VALIDADO]:** categorias iniciais e criação, edição e exclusão de categorias personalizadas [VALIDADO]. A lista definitiva de categorias iniciais permanece [ABERTO]; categorias de receitas e despesas separadas, ambas com categorias iniciais e personalização [VALIDADO]; exclusão de categoria em uso exige transferir os lançamentos a outra categoria do mesmo tipo [VALIDADO].
- **OPEN-007 [PARCIALMENTE VALIDADO]:** para despesas, a data de referência é a data de cobrança informada pelo usuário [VALIDADO]. Tratamento de datas futuras e data de referência para receitas ainda [ABERTO].
- **OPEN-008:** confirmação de requisitos ASSUMIDOS REQ-007, 008, 010, 011 e 012. [ABERTO]

- **OPEN-009 [PARCIALMENTE VALIDADO]:** edição de uma recorrência permite selecionar 'somente esta' ou 'esta e próximas'; o histórico anterior é preservado. [VALIDADO] Significado de X meses (inclui o inicial?), dia em meses curtos continuam [ABERTO]; exclusão da ocorrência ou dela e das futuras [VALIDADO]. Justificativa: permitir reajustes sem reescrever meses passados; alternativa rejeitada: alterar todas as ocorrências automaticamente. Impacto: edições exigem controle do alcance da alteração.

- **OPEN-010 [VALIDADO em 2026-11-02]:** exclusão de despesa recorrente oferece 'somente esta' e 'esta e próximas'; preserva os meses anteriores. Justificativa: evitar apagar histórico e permitir interromper a recorrência no ponto desejado. Alternativa rejeitada: apagar sempre toda a série. Impacto: operações devem identificar o escopo e exigir confirmação.

- **OPEN-011 [VALIDADO em 2026-11-02]:** recorrência opcional para todas as receitas, por X meses ou indefinidamente, com edição e exclusão limitadas à ocorrência selecionada ou àquela e às próximas. Justificativa: evitar recadastro mensal de salário e outras entradas. Alternativa rejeitada: receitas sempre manuais ou apenas salário recorrente. Impacto: os mesmos comportamentos e testes de recorrência se aplicam a ambos os tipos de lançamento.

- **OPEN-012:** ao editar ou excluir uma compra parcelada, qual escopo de alteração se aplica? Como tratar compras já parcialmente pagas? [ABERTO]
- **OPEN-013:** parcelas calculadas são contabilizadas por mês previsto ou apenas após confirmação de pagamento? [ABERTO]

- **OPEN-014 [VALIDADO em 2026-11-02]:** nenhuma distinção entre cartão de crédito e outros meios de pagamento; o usuário informa a data em que a despesa será cobrada, que define seu mês de apuração. Justificativa: simplicidade e foco no controle mensal de cobranças. Alternativas rejeitadas: mês da compra e gestão de faturas com fechamento/vencimento. Impacto: não criar entidades de cartão ou lógica de fatura.

- **OPEN-015 [VALIDADO em 2026-11-02]:** iniciar com categorias predefinidas e permitir criar, editar e excluir categorias personalizadas. Justificativa: facilitar uso imediato e manter flexibilidade. Alternativas rejeitadas: apenas categorias fixas ou começar sem categorias. Impacto: implementar gerenciamento local de categorias e definir política de exclusão para preservar registros históricos.

- **OPEN-016 [VALIDADO em 2026-11-02]:** antes de excluir categoria em uso, escolher outra categoria como destino para os lançamentos. Justificativa: preservar histórico e organização. Alternativas rejeitadas: manter sem categoria ou bloquear exclusão. Impacto: reclassificação integral e exclusão somente após confirmação, sem alteração de totais mensais.

- **OPEN-017 [VALIDADO em 2026-11-02]:** categorias separadas para receitas e despesas, ambas com categorias iniciais e personalização. Justificativa: distinguir origem do dinheiro de destino dos gastos. Alternativa rejeitada: lista compartilhada ou receitas sem categoria. Impacto: filtros de categoria por tipo e transferência de vínculos apenas para categoria do mesmo tipo.

- **OPEN-018 [VALIDADO em 2026-11-02]:** dashboard com resumo mensal, gráficos por categoria, evolução financeira e comparação entre meses. Justificativa: observar padrões de receitas e despesas sem introduzir orçamento ou metas. Alternativas: somente resumo básico, ou relatórios com filtros avançados. Impacto: consultas e visualizações históricas consistentes com os registros mensais.
- **OPEN-019 [ABERTO]:** período padrão e extensão da comparação (ex.: últimos seis ou doze meses) e apresentação de meses sem lançamentos.

## Próximo passo

Revisar os requisitos com o responsável e resolver as questões relevantes com Clarify antes do Plan. Nenhuma implementação autorizada por este documento.
