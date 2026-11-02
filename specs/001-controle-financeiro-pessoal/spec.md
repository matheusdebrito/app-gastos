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

- **US-016 (P1) — Consultar histórico com filtros:** como usuário, quero encontrar lançamentos no histórico mensal por descrição, categoria e tipo (receita ou despesa).

- **US-017 (P1) — Ajustar parcelamento:** como usuário, quero corrigir a compra parcelada inteira, sem editar parcelas individuais, com confirmação; a política de exclusão ainda será revisada.

- **US-018 (P1) — Cadastro rápido:** como usuário, quero acessar rapidamente o registro de receitas e despesas de qualquer tela principal, já com a data atual preenchida.

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

- **REQ-016 [VALIDADO, REVISADO]** Apenas recorrências de despesas por tempo indefinido permitem escolher, ao editar, entre alterar somente a ocorrência selecionada ou ela e as próximas.
- **REQ-017 [VALIDADO, REVISADO]** Em recorrências indefinidas, a edição 'esta e próximas' preserva as ocorrências anteriores. Recorrências com duração fixa não permitem edição individual: a alteração deve abranger toda a série.

- **REQ-018 [VALIDADO, REVISADO]** Apenas recorrências de despesas indefinidas permitem escolher excluir somente a ocorrência selecionada ou ela e todas as próximas. Recorrências de prazo fixo só podem ser excluídas integralmente.
- **REQ-019 [VALIDADO, REVISADO]** A exclusão de recorrência indefinida a partir da ocorrência selecionada preserva as anteriores e exige confirmação; a exclusão integral de série fixa também exige confirmação.

- **REQ-020 [VALIDADO]** Toda receita poderá ser lançada uma única vez ou configurada como recorrente por X meses ou indefinidamente, com escolha feita ao cadastrá-la.
- **REQ-021 [VALIDADO, REVISADO]** Para receitas recorrentes, aplicar as mesmas regras de edição das despesas: duração fixa exige edição da série inteira; duração indefinida permite 'somente esta' ou 'esta e próximas'.
- **REQ-022 [VALIDADO, REVISADO]** Receitas seguem as mesmas regras de exclusão: duração fixa exige exclusão integral, duração indefinida permite excluir somente esta ocorrência ou esta e as próximas, com confirmação.
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

- **REQ-038 [VALIDADO]** Oferecer histórico organizado por mês, exibindo os lançamentos do período selecionado.
- **REQ-039 [VALIDADO]** Permitir buscar lançamentos por descrição no histórico mensal.
- **REQ-040 [VALIDADO]** Permitir filtrar o histórico por categoria e por tipo de lançamento (receita ou despesa), respeitando as categorias de cada tipo.
- **REQ-041 [ASSUMIDO]** Combinar busca e filtros sem alterar os dados persistidos e apresentar estado vazio quando nenhum lançamento corresponder.

- **REQ-042 [VALIDADO]** Contabilizar todo lançamento no mês da data informada, mesmo quando a data estiver no futuro, sem aguardar a chegada da data ou confirmação de realização.
- **REQ-043 [VALIDADO]** Aplicar a mesma regra a receitas, despesas únicas, ocorrências recorrentes e parcelas, respeitando as respectivas datas de referência e sem contabilização duplicada.

- **REQ-044 [VALIDADO]** Em uma recorrência configurada para X meses, contar o mês inicial como a primeira ocorrência, produzindo exatamente X ocorrências mensais, tanto para receitas quanto para despesas.

- **REQ-045 [VALIDADO]** Em recorrências mensais, quando o dia original não existir em determinado mês, usar o último dia desse mês exclusivamente naquela ocorrência e voltar ao dia original nos meses seguintes em que existir. Aplicar a receitas e despesas.

- **REQ-046 [VALIDADO, REVISADO]** Compras parceladas com número fixo de parcelas somente podem ser editadas como um todo, com confirmação antes de alterar todas as parcelas. Não oferecer edição de parcela individual.
- **REQ-047 [VALIDADO, REVISADO]** Compra parcelada com prazo fixo só pode ser excluída integralmente, com todas as parcelas, após confirmação explícita; não oferecer exclusão individual.
- **REQ-048 [VALIDADO, REVISADO]** Antes de editar um parcelamento de duração fixa, informar que todas as parcelas serão afetadas e solicitar confirmação; preservar consistência exata entre valor total e soma das parcelas.

- **REQ-049 [SUBSTITUÍDO]** A regra anterior de atualizar o total após edição individual não se aplica, pois a edição individual de compra parcelada foi retirada do escopo. O valor total deve corresponder à soma das parcelas após qualquer edição integral.

- **REQ-050 [VALIDADO]** Ao editar uma série de prazo fixo, aplicar a correção a todas as ocorrências da série, incluindo meses anteriores, sem limitar a alteração pela data atual; exigir confirmação do alcance integral.

- **REQ-051 [VALIDADO]** Permitir escolher livremente a quantidade de meses consecutivos exibidos nos gráficos de evolução financeira, incluindo 1, 2, 3 e outras quantidades inteiras positivas, sem restringir a seleção às opções 3, 6 ou 12.

- **REQ-052 [VALIDADO]** Exibir todos os meses consecutivos dentro do período selecionado nos gráficos de evolução, incluindo meses sem lançamentos com receitas, despesas e resultado iguais a zero.

- **REQ-053 [VALIDADO]** Ao abrir o dashboard, exibir por padrão o mês calendário atual nos gráficos; permitir selecionar quantidades maiores de meses consecutivos para comparação, mantendo a navegação por período.

- **REQ-054 [VALIDADO]** Aplicar às compras parceladas a mesma regra mensal das recorrências: se o dia original de cobrança não existir em determinado mês, usar o último dia disponível daquele mês e retomar o dia original nos meses seguintes em que existir.

- **REQ-055 [VALIDADO]** Em compras parceladas, dividir o valor total em centavos inteiros, atribuindo às parcelas anteriores o mesmo valor base e concentrando toda a diferença de centavos na última parcela, de modo que a soma seja exatamente igual ao total.

- **REQ-056 [VALIDADO]** Impedir o cadastro ou a edição de parcelamento cuja quantidade de parcelas exceda o valor total da compra em centavos, assegurando que cada parcela tenha valor mínimo de R$ 0,01; exibir mensagem de validação clara.

- **REQ-057 [VALIDADO]** Disponibilizar uma ação de cadastro rápido de lançamentos, identificada por botão `+`, acessível nas telas principais do aplicativo.
- **REQ-058 [VALIDADO]** Ao iniciar um novo lançamento pela ação rápida, preencher automaticamente a data atual do dispositivo, permitindo que o usuário a altere antes de salvar.
- **REQ-059 [VALIDADO]** A ação rápida deve permitir ao usuário escolher entre cadastrar receita e cadastrar despesa, respeitando os campos e regras do tipo escolhido.

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

- **AC-016 → REQ-016:** ao editar março de uma despesa recorrente indefinida de R$ 120 para R$ 140, 'somente esta' preserva abril em R$ 120 e 'esta e próximas' altera abril para R$ 140, mantendo fevereiro em R$ 120.
- **AC-017 → REQ-017:** uma série fixa de 12 meses não oferece edição de ocorrência isolada; a edição exige o escopo 'toda a série'.

- **AC-018 → REQ-018:** para recorrência indefinida, excluir somente março preserva abril; excluir março e seguintes mantém fevereiro e remove março e os meses seguintes. Série fixa não apresenta exclusão isolada.
- **AC-019 → REQ-019:** antes de excluir, o aplicativo informa o alcance e solicita confirmação; cancelar preserva todos os registros, e excluir ocorrência futura de série indefinida não altera meses anteriores.

- **AC-020 → REQ-020:** receita sem recorrência gera lançamento único; receita configurada por X meses ou indefinidamente aparece nos meses abrangidos.
- **AC-021 → REQ-021:** uma receita indefinida admite edição isolada ou futura; uma receita com 12 ocorrências permite apenas edição integral das 12.
- **AC-022 → REQ-022:** receitas de duração fixa só podem ser excluídas como série completa; receitas indefinidas oferecem 'somente esta' e 'esta e próximas'.
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

- **AC-038 → REQ-038:** selecionar fevereiro exibe apenas lançamentos atribuídos a fevereiro e permite navegar para outro mês.
- **AC-039 → REQ-039:** buscar por 'mercado' exibe as despesas e receitas do mês cuja descrição corresponda ao termo, sem modificar lançamentos.
- **AC-040 → REQ-040:** selecionar tipo 'despesa' e categoria 'Alimentação' exibe apenas despesas da categoria no mês; categorias de receita não são apresentadas como categorias de despesa.
- **AC-041 → REQ-041:** busca e filtros aplicados juntos retornam somente registros correspondentes; sem resultados, uma mensagem clara é exibida.

- **AC-042 → REQ-042:** em 02/11, uma despesa com data de cobrança em 25/11 já integra o total de novembro; uma receita com data futura em dezembro integra dezembro, não novembro.
- **AC-043 → REQ-043:** consultar mês futuro com recorrências e parcelas apresenta seus valores no resultado do respectivo mês sem necessitar confirmação e sem duplicar ocorrências.

- **AC-044 → REQ-044:** recorrência de 3 meses iniciada em janeiro produz exatamente janeiro, fevereiro e março, sem ocorrência em abril; recorrência de 1 mês produz somente a ocorrência inicial.

- **AC-045 → REQ-045:** recorrência iniciada em 31/01/2027 gera ocorrência em 28/02/2027, 31/03/2027 e 30/04/2027; iniciada em 31/01/2028 gera ocorrência em 29/02/2028 e 31/03/2028. Nenhuma ocorrência muda de mês.

- **AC-046 → REQ-046:** ao selecionar a terceira parcela de uma compra em 12 vezes, a opção 'editar somente esta' não existe; a edição apresenta o alcance integral e exige confirmação.
- **AC-047 → REQ-047:** ao tentar excluir a terceira parcela de uma compra em 12 vezes, não há opção de excluir apenas a terceira; confirmar exclui todas as 12 e cancelar não altera a compra.
- **AC-048 → REQ-048:** a edição do parcelamento completo recalcula suas parcelas de modo que a soma corresponda exatamente ao valor total e não aplica alteração sem confirmação.

- **AC-049 → REQ-049:** o cenário de editar somente a terceira parcela está obsoleto; após edição integral de uma compra de R$ 1.200 para R$ 1.320 em 12 parcelas, a soma das 12 parcelas é exatamente R$ 1.320.

- **AC-050 → REQ-050:** em abril, corrigir o total de uma compra de janeiro com 12 parcelas de R$ 1.200,00 para R$ 1.320,00 recalcula as 12 parcelas, inclusive janeiro a março, e atualiza os resumos mensais correspondentes; cancelar a confirmação mantém os valores anteriores.

- **AC-051 → REQ-051:** o usuário consegue selecionar 1, 2, 3, 4 e 12 meses; o gráfico usa exatamente a quantidade selecionada de meses consecutivos, com os dados correspondentes, inclusive meses sem lançamentos.

- **AC-052 → REQ-052:** ao selecionar janeiro a março com lançamentos apenas em janeiro e março, fevereiro aparece entre eles com R$ 0,00 de receitas, R$ 0,00 de despesas e R$ 0,00 de resultado; nenhum mês é omitido.

- **AC-053 → REQ-053:** em novembro de 2026, ao abrir o dashboard, os gráficos exibem novembro inicialmente; ao selecionar 3 meses, exibem setembro, outubro e novembro, incluindo os meses sem lançamentos com valor zero.

- **AC-054 → REQ-054:** compra parcelada iniciada em 31/01/2027 gera parcelas em 31/01, 28/02, 31/03 e 30/04; em 2028, fevereiro usa 29/02. O cálculo não desloca nenhuma parcela para outro mês.

- **AC-055 → REQ-055:** uma compra de R$ 100,00 em três parcelas gera R$ 33,33, R$ 33,33 e R$ 33,34, cuja soma é R$ 100,00; uma compra de R$ 0,05 em três parcelas gera R$ 0,01, R$ 0,01 e R$ 0,03, sem perda de centavos.

- **AC-056 → REQ-056:** dividir R$ 1,00 em 100 parcelas é permitido e produz 100 parcelas de R$ 0,01; dividir R$ 1,00 em 101 ou 200 parcelas é bloqueado com explicação; dividir R$ 0,05 em 3 parcelas continua permitido e não produz parcelas zeradas.

- **AC-057 → REQ-057:** partindo do dashboard ou histórico, o usuário consegue iniciar o cadastro pelo botão `+` sem precisar localizar uma página exclusiva de lançamentos.
- **AC-058 → REQ-058:** ao abrir um cadastro em 02/11/2026, a data inicial é 02/11/2026; selecionar outra data antes de salvar é permitido e determina o mês contabilizado.
- **AC-059 → REQ-059:** o botão rápido oferece receita e despesa; escolher uma delas abre o formulário correspondente, sem misturar categorias de tipos diferentes.

## Casos de borda e regras a confirmar

- **Risco aceito:** sem backup, a perda ou limpeza dos dados locais pode ser irreversível. Persistência após fechamento/reinício normal continua obrigatória (REQ-009).

- Lançamento no último dia do mês e mudança de mês/ano.
- Lançamento retroativo e edição da data que transfere o registro de um mês para outro.
- Exclusão/renomeação de categoria já utilizada.
- Valores altos, casas decimais e apresentação em moeda brasileira.
- Aplicativo fechado ou reiniciado durante uma gravação.
- Meses sem receitas, sem despesas ou com despesas superiores às receitas.
- Falha de armazenamento e eventual falta de espaço.
- Desinstalação, troca ou perda do telefone: estratégia de backup/restauração ainda não definida.

## Fora do escopo confirmado

- Backup, restauração, exportação de dados e sincronização de registros.

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
- **OPEN-005 [VALIDADO em 2026-11-02]:** não implementar backup, restauração nem exportação de dados nesta versão. Justificativa: manter o aplicativo pessoal simples. Alternativas rejeitadas: backup manual ou backup automático local. Impacto: dados permanecem somente no armazenamento do aplicativo e podem ser perdidos com desinstalação, limpeza de dados, falha ou perda do celular.
- **OPEN-006 [PARCIALMENTE VALIDADO]:** categorias iniciais e criação, edição e exclusão de categorias personalizadas [VALIDADO]. A lista definitiva de categorias iniciais permanece [ABERTO]; categorias de receitas e despesas separadas, ambas com categorias iniciais e personalização [VALIDADO]; exclusão de categoria em uso exige transferir os lançamentos a outra categoria do mesmo tipo [VALIDADO].
- **OPEN-007 [VALIDADO em 2026-11-02]:** contabilizar todas as receitas e despesas no mês da data cadastrada, inclusive datas futuras, sem exigir confirmação. Para despesas, informar a data em que serão cobradas. Justificativa: acompanhar compromissos mensais previstos de forma direta. Alternativas rejeitadas: contabilizar apenas após chegar a data ou após confirmação manual. Impacto: resumos e gráficos incluem valores futuros no mês correspondente; não representam necessariamente pagamentos já efetivados.
- **OPEN-008:** confirmação de requisitos ASSUMIDOS REQ-007, 008, 010, 011 e 012. [ABERTO]

- **OPEN-009 [VALIDADO, REVISADO]:** séries de duração fixa exigem edição e exclusão integrais; séries indefinidas oferecem 'somente esta' ou 'esta e próximas', preservando meses anteriores. Mês inicial conta entre X ocorrências; datas inexistentes são ajustadas ao último dia do mês.

- **OPEN-010 [VALIDADO em 2026-11-02]:** exclusão de despesa recorrente oferece 'somente esta' e 'esta e próximas'; preserva os meses anteriores. Justificativa: evitar apagar histórico e permitir interromper a recorrência no ponto desejado. Alternativa rejeitada: apagar sempre toda a série. Impacto: operações devem identificar o escopo e exigir confirmação.

- **OPEN-011 [VALIDADO em 2026-11-02]:** recorrência opcional para todas as receitas, por X meses ou indefinidamente, com edição e exclusão limitadas à ocorrência selecionada ou àquela e às próximas. Justificativa: evitar recadastro mensal de salário e outras entradas. Alternativa rejeitada: receitas sempre manuais ou apenas salário recorrente. Impacto: os mesmos comportamentos e testes de recorrência se aplicam a ambos os tipos de lançamento.

- **OPEN-012 [PARCIALMENTE VALIDADO, REVISADO]:** compras parceladas de prazo fixo só admitem edição e exclusão integrais, com confirmação [VALIDADO]. Edição de todas as ocorrências, inclusive em meses anteriores [VALIDADO].
- **OPEN-013:** parcelas calculadas são contabilizadas por mês previsto ou apenas após confirmação de pagamento? [ABERTO]

- **OPEN-014 [VALIDADO em 2026-11-02]:** nenhuma distinção entre cartão de crédito e outros meios de pagamento; o usuário informa a data em que a despesa será cobrada, que define seu mês de apuração. Justificativa: simplicidade e foco no controle mensal de cobranças. Alternativas rejeitadas: mês da compra e gestão de faturas com fechamento/vencimento. Impacto: não criar entidades de cartão ou lógica de fatura.

- **OPEN-015 [VALIDADO em 2026-11-02]:** iniciar com categorias predefinidas e permitir criar, editar e excluir categorias personalizadas. Justificativa: facilitar uso imediato e manter flexibilidade. Alternativas rejeitadas: apenas categorias fixas ou começar sem categorias. Impacto: implementar gerenciamento local de categorias e definir política de exclusão para preservar registros históricos.

- **OPEN-016 [VALIDADO em 2026-11-02]:** antes de excluir categoria em uso, escolher outra categoria como destino para os lançamentos. Justificativa: preservar histórico e organização. Alternativas rejeitadas: manter sem categoria ou bloquear exclusão. Impacto: reclassificação integral e exclusão somente após confirmação, sem alteração de totais mensais.

- **OPEN-017 [VALIDADO em 2026-11-02]:** categorias separadas para receitas e despesas, ambas com categorias iniciais e personalização. Justificativa: distinguir origem do dinheiro de destino dos gastos. Alternativa rejeitada: lista compartilhada ou receitas sem categoria. Impacto: filtros de categoria por tipo e transferência de vínculos apenas para categoria do mesmo tipo.

- **OPEN-018 [VALIDADO em 2026-11-02]:** dashboard com resumo mensal, gráficos por categoria, evolução financeira e comparação entre meses. Justificativa: observar padrões de receitas e despesas sem introduzir orçamento ou metas. Alternativas: somente resumo básico, ou relatórios com filtros avançados. Impacto: consultas e visualizações históricas consistentes com os registros mensais.
- **OPEN-019 [PARCIALMENTE VALIDADO]:** quantidade de meses selecionável livremente em números inteiros positivos (1, 2, 3 etc.) [VALIDADO]; período padrão de 1 mês com referência no mês atual [VALIDADO]; eventual limite prático da seleção [ABERTO]; meses sem lançamentos aparecem com valores zerados [VALIDADO].

- **OPEN-020 [VALIDADO em 2026-11-02]:** histórico mensal com busca por descrição e filtros por categoria e tipo de lançamento. Justificativa: localizar e revisar lançamentos sem filtros avançados desnecessários. Alternativas rejeitadas: histórico apenas cronológico ou filtros complexos por valores e intervalos. Impacto: consultas por mês e composição de filtros na lista histórica.

- **OPEN-021 [VALIDADO em 2026-11-02]:** lançamentos futuros entram imediatamente na apuração do mês cadastrado, incluindo recorrências e parcelas. Justificativa: visualizar o resultado previsto de cada mês. Impacto: não manter estado de pagamento ou confirmação para fins do resultado.

- **OPEN-022 [VALIDADO em 2026-11-02]:** recorrências de X meses têm exatamente X ocorrências, incluindo o mês inicial. Justificativa: quantidade de meses equivale à quantidade de lançamentos. Alternativa rejeitada: X repetições adicionais após o mês inicial. Impacto: regra uniforme para receitas e despesas, inclusive quando X=1.

- **OPEN-023 [VALIDADO em 2026-11-02]:** quando o dia da recorrência não existe no mês, usar o último dia daquele mês e preservar o dia original para os meses seguintes. Justificativa: manter cada ocorrência no mês esperado e evitar deslocamentos indevidos. Alternativa rejeitada: mover para o primeiro dia do mês seguinte. Impacto: cálculo de recorrência deve considerar tamanhos dos meses e anos bissextos.

- **OPEN-024 [REVISADO em 2026-11-02]:** edição e exclusão de compras parceladas fixas só podem afetar toda a série. Decisões anteriores de alteração ou exclusão individual foram substituídas. Justificativa: manter consistência entre parcelas e evitar operações parciais.

- **OPEN-025 [SUBSTITUÍDO em 2026-11-02]:** regra de recálculo após edição individual tornou-se inaplicável; em edição integral, o valor total continua igual à soma exata das parcelas.

- **OPEN-026 [VALIDADO em 2026-11-02]:** séries com prazo fixo são editadas somente por inteiro; recorrências indefinidas admitem edição 'somente esta' ou 'esta e futuras'. Justificativa: evitar alterações pontuais em compromissos com número fechado de meses. Alternativa anterior substituída: edição individual de compra parcelada. Impacto: telas e critérios devem distinguir duração fixa e indefinida.

- **OPEN-027 [VALIDADO em 2026-11-02]:** lançamentos de prazo fixo (compras parceladas e receitas/despesas recorrentes por X meses) só podem ser excluídos integralmente, com confirmação. Recorrências indefinidas mantêm exclusão individual ou a partir da ocorrência selecionada. Justificativa: coerência com a regra de edição integral. Alternativa rejeitada: exclusão individual de parcelas fixas.

- **OPEN-028 [VALIDADO em 2026-11-02]:** editar uma série com prazo fixo corrige todas as ocorrências, mesmo as de meses passados, com atualização dos resumos históricos. Justificativa: permitir correção de dados lançados incorretamente. Alternativa rejeitada: bloquear edições quando a série já tiver ocorrências anteriores. Impacto: recálculo dos meses afetados e confirmação explícita da edição integral.

- **OPEN-029 [VALIDADO em 2026-11-02]:** gráficos de evolução permitem selecionar uma quantidade variável de meses (1, 2, 3 etc.), não apenas opções predefinidas de 3, 6 ou 12. Justificativa: consultar qualquer intervalo mensal relevante. Alternativa rejeitada: seletor limitado a intervalos fixos. Impacto: consultas e visualizações devem aceitar diferentes janelas de meses consecutivos.

- **OPEN-030 [VALIDADO em 2026-11-02]:** meses sem lançamentos permanecem visíveis na sequência cronológica dos gráficos e apresentam valores zerados. Justificativa: preservar a continuidade temporal e evitar comparações enganosas. Alternativa rejeitada: ocultar meses vazios. Impacto: preencher lacunas mensais nos dados exibidos sem inventar lançamentos.

- **OPEN-031 [VALIDADO em 2026-11-02]:** gráficos abrem no mês atual (janela de um mês) e permitem ampliar a quantidade de meses para comparação. Justificativa: priorizar o acompanhamento diário, sem restringir análises históricas. Alternativas rejeitadas: seis meses fixos ou memorizar o último período escolhido. Impacto: inicialização do dashboard usa o mês calendário atual.

- **OPEN-032 [VALIDADO em 2026-11-02]:** compras parceladas seguem a mesma regra de ajuste ao último dia do mês já definida para recorrências, sempre retomando o dia original quando possível. Justificativa: comportamento uniforme e apuração correta por mês. Alternativa rejeitada: edição manual da data de cada parcela no cadastro. Impacto: os critérios de geração das datas mensais são compartilhados.

- **OPEN-033 [VALIDADO em 2026-11-02]:** o ajuste dos centavos de compras parceladas é aplicado exclusivamente à última parcela. Justificativa: manter as parcelas anteriores iguais e simplificar a conferência. Alternativas rejeitadas: ajuste na primeira ou distribuição entre as primeiras. Impacto: cálculo inteiro e soma exata obrigatórios; parcelamentos que gerem parcela de valor zero serão bloqueados.

- **OPEN-034 [VALIDADO em 2026-11-02]:** parcelamentos não podem gerar parcelas de R$ 0,00; a quantidade máxima de parcelas é limitada pela quantidade de centavos do valor total. Justificativa: evitar lançamentos artificiais e preservar integridade financeira. Alternativa rejeitada: permitir parcelas zeradas. Impacto: validar antes de salvar e ao editar compras parceladas.

- **OPEN-035 [VALIDADO em 2026-11-02]:** botão `+` de cadastro rápido disponível nas telas principais, com data atual preenchida e editável; permite escolher receita ou despesa. Justificativa: agilizar o registro cotidiano. Alternativas rejeitadas: acesso somente pelo histórico e sugestões automáticas baseadas em lançamentos antigos. Impacto: ação de entrada consistente entre telas e preenchimento inicial de data conforme o dispositivo.

## Próximo passo

Revisar os requisitos com o responsável e resolver as questões relevantes com Clarify antes do Plan. Nenhuma implementação autorizada por este documento.
