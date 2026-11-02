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
- **REQ-002 [VALIDADO, REVISADO]** Permitir registrar receitas, incluindo salário e outras entradas, com valor positivo, data e categoria obrigatórios; descrição opcional.
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

- **REQ-060 [VALIDADO]** Exigir valor monetário positivo, data válida e categoria correspondente ao tipo do lançamento para cadastrar ou editar receitas e despesas; descrição permanece opcional.

- **REQ-061 [VALIDADO]** Permitir editar e excluir todas as categorias, sejam elas iniciais ou criadas pelo usuário, aplicando a mesma política de transferência dos lançamentos vinculados para outra categoria do mesmo tipo antes da exclusão.

- **REQ-062 [VALIDADO]** Impedir a criação ou renomeação de categorias para um nome já existente no mesmo tipo de lançamento (receita ou despesa), desconsiderando diferenças entre letras maiúsculas e minúsculas. Permitir nomes iguais em tipos diferentes.

- **REQ-063 [VALIDADO]** Utilizar exclusivamente real brasileiro (BRL) em receitas, despesas, compras parceladas, resumos e gráficos, exibindo valores com símbolo R$, separador decimal por vírgula, separador de milhares por ponto e exatamente duas casas decimais; não oferecer seleção ou conversão de moedas.

- **REQ-064 [VALIDADO]** Na primeira utilização, disponibilizar as categorias iniciais de receitas: Salário, Renda extra, Reembolso, Presentes e Outros; e de despesas: Alimentação, Moradia, Transporte, Saúde, Lazer, Compras, Educação, Assinaturas e Outros. Todas seguem as mesmas regras de edição, exclusão, associação e unicidade já definidas para categorias personalizadas.

- **REQ-065 [VALIDADO, CORRIGIDO]** Permitir ordenar os lançamentos do histórico por data ou valor, tanto em ordem crescente quanto decrescente. A ordenação é aplicada aos lançamentos exibidos após os filtros de tipo e categoria e a pesquisa por descrição já previstos.

- **REQ-066 [VALIDADO]** Ao abrir o histórico, apresentar por padrão os lançamentos ordenados pela data do lançamento em ordem decrescente (mais recentes primeiro), mantendo disponíveis as demais opções de ordenação por data e valor previstas no REQ-065.

- **REQ-067 [VALIDADO]** Quando a descrição de um lançamento estiver vazia, apresentar o nome da sua categoria como título no histórico, sem preencher ou alterar automaticamente a descrição armazenada. Quando houver descrição informada, apresentá-la normalmente.

- **REQ-068 [VALIDADO]** Permitir navegar pelos meses do dashboard e do histórico por setas de mês anterior e próximo mês, além de disponibilizar seleção direta de mês e ano. A mudança de período deve atualizar os dados exibidos de acordo com o mês selecionado.

- **REQ-069 [VALIDADO]** Permitir navegar livremente para qualquer mês futuro pelo dashboard e histórico, por setas ou seleção direta de mês e ano, apresentando receitas e despesas previstas para o período, incluindo recorrências e parcelas, segundo as regras de contabilização já aprovadas; não impor limite fixo de 12 meses nem restringir ao mês atual.

- **REQ-070 [VALIDADO]** Ao consultar um mês posterior ao mês calendário atual, identificar visualmente os totais como 'Receitas previstas', 'Despesas previstas' e 'Resultado previsto', sem modificar a inclusão dos lançamentos, os cálculos, os valores ou exigir confirmação de pagamento. Os meses atuais e passados mantêm os rótulos convencionais.

- **REQ-071 [VALIDADO]** Ao cadastrar um lançamento de receita ou despesa, verificar se já existe outro lançamento com o mesmo tipo, valor, data e categoria. Em caso de possível duplicidade, exibir aviso e solicitar confirmação para salvar mesmo assim, oferecendo também opção de cancelar o cadastro duplicado sem descartar os campos preenchidos. Não bloquear o salvamento após a confirmação explícita.

- **REQ-072 [VALIDADO]** Antes de excluir definitivamente um lançamento avulso de receita ou despesa, apresentar confirmação com seus dados identificadores e as ações 'Cancelar' e 'Excluir'. Somente executar a exclusão após confirmação explícita; cancelar preserva o lançamento e os totais.

- **REQ-073 [VALIDADO]** Permitir editar todos os campos de lançamentos avulsos, incluindo valor, data, categoria, descrição e tipo (receita ou despesa). Ao alterar o tipo, exigir a seleção de categoria compatível com o novo tipo antes de salvar; validar os campos obrigatórios e recalcular os totais, indicadores e gráficos dos meses afetados.

- **REQ-074 [VALIDADO]** Quando não houver nenhum lançamento cadastrado, apresentar o dashboard com indicadores de receitas, despesas e resultado em R$ 0,00, acompanhado de mensagem orientando a cadastrar a primeira receita ou despesa e uma ação que inicia esse cadastro. Não exigir tela de boas-vindas adicional.

- **REQ-075 [VALIDADO]** Quando o histórico estiver ordenado por data (crescente ou decrescente), agrupar visualmente os lançamentos sob cabeçalhos por dia, respeitando a ordem escolhida. Quando estiver ordenado por valor (crescente ou decrescente), apresentar uma lista contínua, sem agrupamentos por dia, mantendo visível a data de cada lançamento.

- **REQ-076 [VALIDADO]** Nos grupos diários do histórico apresentados quando a ordenação é por data, mostrar somente o cabeçalho com a data e os lançamentos correspondentes, sem somatórios diários de receitas, despesas ou resultado.

- **REQ-077 [VALIDADO]** No histórico, identificar cada parcela de compra parcelada pelo título da compra acompanhado do número da parcela e do total de parcelas, no formato 'Celular — 3/10'. Exibir o valor da parcela como valor do lançamento, sem adicionar o valor total da compra ao título. Quando a descrição não for informada, utilizar o nome da categoria conforme REQ-067.

- **REQ-078 [VALIDADO]** Identificar lançamentos de receitas ou despesas recorrentes no histórico por meio de um pequeno ícone de repetição junto ao lançamento. A identificação deve valer para recorrências finitas e indefinidas, sem substituir a descrição ou o nome da categoria e sem alterar os valores apresentados.

- **REQ-079 [VALIDADO]** Ao tocar em um lançamento no histórico, abrir uma visualização de detalhes com tipo, valor, data, categoria e descrição (quando informada), além de ações para editar ou excluir. Para lançamentos recorrentes e compras parceladas, incluir as informações pertinentes à série e respeitar as regras já aprovadas para edição e exclusão de séries, sem permitir alterações isoladas onde foram proibidas.

- **REQ-080 [VALIDADO]** A pesquisa textual do histórico deve localizar lançamentos tanto pelo conteúdo da descrição quanto pelo nome da categoria associada, inclusive quando a descrição estiver vazia. O resultado deve continuar respeitando o mês, os filtros e a ordenação selecionados.

- **REQ-081 [VALIDADO]** Atualizar automaticamente os resultados da pesquisa textual do histórico conforme o usuário digita, edita ou apaga o termo, sem exigir botão 'Buscar' ou confirmação. A atualização mantém os filtros, mês de referência e ordenação selecionados, conforme REQ-080.

- **REQ-082 [VALIDADO]** Quando a pesquisa textual do histórico não encontrar lançamentos, exibir apenas a mensagem 'Nenhum lançamento encontrado', sem botão específico para limpar a pesquisa. O usuário pode alterar ou apagar o texto no campo de pesquisa, e os resultados são atualizados automaticamente conforme REQ-081.

- **REQ-083 [VALIDADO]** Identificar visualmente como 'Previsto' cada lançamento individual cuja data seja posterior à data atual do dispositivo, tanto no histórico quanto nos detalhes, inclusive lançamentos avulsos, parcelas e recorrências. A sinalização é apenas de apresentação: não altera valores, cálculos, filtros nem cria confirmação de pagamento.

- **REQ-084 [VALIDADO]** No gráfico de despesas por categoria, apresentar apenas categorias cujo total de despesas no período selecionado seja maior que R$ 0,00. Não exibir categorias sem gastos na legenda nem como fatias. Manter disponíveis todas as categorias nos formulários e filtros, independentemente de aparecerem no gráfico.

- **REQ-085 [VALIDADO]** Apresentar no gráfico de despesas por categoria, para cada categoria com gastos no período selecionado, tanto seu valor total em reais (BRL, duas casas decimais) quanto sua participação percentual no total de despesas desse período. Calcular o percentual pela razão entre as despesas da categoria e o total de despesas do período, sem alterar os valores financeiros.

- **REQ-086 [VALIDADO]** Ao tocar em uma categoria do gráfico de despesas, abrir o histórico já filtrado pelo tipo despesa, pela categoria selecionada e pelo período exibido no gráfico, mostrando apenas os lançamentos que compõem o total daquela categoria. Preservar a possibilidade de alterar ou remover os filtros no histórico.

- **REQ-087 [VALIDADO]** Ordenar as categorias exibidas no gráfico de despesas por valor total de despesas em ordem decrescente no período selecionado, colocando primeiro as categorias com maiores gastos. Recalcular a ordenação ao mudar o período; manter apenas categorias com gastos conforme REQ-084.

- **REQ-088 [VALIDADO]** Nos indicadores de receitas, despesas e resultado do dashboard, apresentar a comparação do mês selecionado com o mês imediatamente anterior, mostrando a diferença em reais (BRL, duas casas decimais) e a variação percentual quando calculável. A comparação usa os mesmos lançamentos e regras de contabilização dos totais mensais, inclusive em meses futuros.

- **REQ-089 [VALIDADO]** Na comparação dos indicadores mensais com o mês anterior, quando o valor do indicador no mês anterior for R$ 0,00, continuar mostrando a diferença monetária em reais e apresentar a mensagem 'Sem base de comparação' no lugar da variação percentual, inclusive quando ambos os meses forem zero. Não calcular nem exibir percentual por divisão por zero.

- **REQ-090 [VALIDADO]** Na comparação percentual do resultado mensal, quando o resultado do mês anterior for negativo, usar o valor absoluto desse resultado como denominador: ((resultado atual - resultado anterior) / |resultado anterior|) × 100. Manter o sinal da diferença, com valor positivo indicando aumento do resultado e negativo indicando redução. Quando a base anterior for zero, aplicar REQ-089.

- **REQ-091 [VALIDADO]** Usar cores financeiras semânticas nos indicadores: receitas em verde, despesas em vermelho, resultado positivo em verde, negativo em vermelho e zero em cor neutra. Nas comparações mensais, sinalizar melhora ou piora financeira conforme o indicador: aumento de receitas ou resultado é favorável, aumento de despesas é desfavorável; quedas têm interpretação inversa. Variações iguais a zero são neutras. Não depender apenas de cor: apresentar sinais, texto e/ou setas que transmitam o mesmo significado.

- **REQ-092 [VALIDADO]** Oferecer temas claro e escuro no aplicativo, com modo 'Automático' selecionado por padrão para acompanhar a aparência do Android. Permitir que o usuário escolha manualmente 'Claro', 'Escuro' ou 'Automático' nas configurações, preservando a opção entre aberturas e mantendo legíveis as cores financeiras semânticas definidas no REQ-091.

- **REQ-093 [VALIDADO]** Disponibilizar uma barra de navegação inferior com quatro abas de acesso direto: Dashboard, Histórico, Categorias e Configurações. Manter o botão `+` de cadastro rápido acessível nas telas principais, conforme REQ-057, sem substituir nenhuma das quatro abas.

- **REQ-094 [VALIDADO]** Posicionar o botão `+` de cadastro rápido centralizado na barra de navegação inferior, com destaque visual e acesso direto ao fluxo de escolha entre receita e despesa, preservando as quatro abas Dashboard, Histórico, Categorias e Configurações ao seu redor. O botão não substitui uma aba de navegação.

- **REQ-095 [VALIDADO]** Ao tocar no botão `+` central da barra inferior, abrir um menu rápido com exatamente as ações 'Nova receita' e 'Nova despesa'. Ao selecionar uma ação, abrir diretamente o formulário correspondente com o tipo escolhido, mantendo a data atual preenchida conforme REQ-058. Fechar o menu sem escolher não cria lançamento nem altera dados.

- **REQ-096 [VALIDADO]** Ao tentar sair de um formulário de cadastro de receita ou despesa com alterações não salvas, apresentar confirmação para permanecer no formulário ou descartar as alterações. Se o formulário estiver no estado inicial, permitir fechar sem confirmação. A regra vale para ações de voltar e cancelar, sem salvar lançamentos incompletos automaticamente.

- **REQ-097 [VALIDADO]** Aplicar a confirmação de saída com alterações não salvas também à edição de lançamentos avulsos, séries recorrentes (finitas ou indefinidas) e compras parceladas. Ao tentar voltar ou cancelar após modificar campos, permitir continuar editando com os dados preservados ou descartar as mudanças sem alterar os registros existentes. Sem modificações em relação ao estado inicial da edição, sair sem confirmação. Preservar as regras específicas de edição de cada série.

- **REQ-098 [VALIDADO]** Permitir criar uma categoria diretamente no formulário de cadastro ou edição de lançamento, por meio da opção '+ Nova categoria', sem perder os dados já preenchidos. A nova categoria deve pertencer ao tipo de lançamento atual, seguir a regra de nomes únicos do REQ-062 e ser selecionada automaticamente após sua criação bem-sucedida.

- **REQ-099 [VALIDADO]** Manter pelo menos uma categoria cadastrada para cada tipo de lançamento (receita e despesa), impedindo a exclusão da última categoria de qualquer tipo, independentemente de ser inicial ou personalizada. Informar que é necessário criar outra categoria do mesmo tipo antes de excluí-la. Preservar as regras de transferência de lançamentos ao excluir categorias em uso.

- **REQ-100 [VALIDADO]** Apresentar as categorias nos seletores de receitas e despesas em ordem alfabética crescente (A a Z), considerando nomes em português e sem diferenciar maiúsculas e minúsculas na ordenação. A ordenação deve ser atualizada quando categorias forem criadas ou renomeadas, sem alterar sua associação aos lançamentos.

- **REQ-101 [VALIDADO]** Os seletores de categorias para receitas e despesas devem permitir pesquisar pelo nome, atualizando as opções visíveis conforme o usuário digita, sem exigir confirmação de busca. A pesquisa deve considerar apenas categorias do tipo do lançamento e preservar a ordenação alfabética crescente definida no REQ-100, inclusive após limpar o texto.

- **REQ-102 [VALIDADO]** Ao iniciar o aplicativo, definir o período inicial do Histórico como o mês calendário atual do dispositivo, independentemente do último mês consultado em sessões anteriores. Permitir navegar para outros meses por setas e seleção direta de mês e ano conforme REQ-068. Essa regra não deve impedir que a navegação iniciada por um gráfico abra o histórico no período explicitamente selecionado conforme REQ-086.

- **REQ-103 [VALIDADO]** Após salvar com sucesso um novo lançamento de receita ou despesa, fechar o formulário e retornar à tela de origem, exibindo os dados financeiros atualizados conforme o lançamento registrado. Não manter o formulário aberto para cadastro consecutivo nem oferecer ação adicional 'Salvar e adicionar outro'. Se o salvamento falhar, permanecer no formulário com os campos preservados e informar o erro, sem simular sucesso.

- **REQ-104 [VALIDADO]** Após salvar com sucesso um lançamento de receita ou despesa e retornar à tela de origem (REQ-103), apresentar uma mensagem discreta, temporária e não bloqueante confirmando o salvamento. A mensagem deve identificar o tipo salvo, desaparecer automaticamente e não exigir interação. Nenhuma mensagem de sucesso deve ser exibida se o salvamento falhar.

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

- **AC-060 → REQ-060:** o aplicativo impede salvar receita ou despesa sem valor, data ou categoria; aceita lançamento com descrição vazia; informa o campo faltante ou inválido sem apagar o que já foi preenchido.

- **AC-061 → REQ-061:** uma categoria inicial como Alimentação pode ser renomeada; ao excluí-la com lançamentos, o aplicativo exige uma categoria de destino do tipo despesa e preserva os dados e totais dos registros transferidos. Sem categoria de destino válida, não conclui a exclusão.

- **AC-062 → REQ-062:** se existir a categoria de despesa 'Alimentação', criar ou renomear outra categoria de despesa como 'alimentação' é rejeitado com mensagem clara; criar uma categoria de receita 'Alimentação' é permitido.

- **AC-063 → REQ-063:** um registro de 1234 reais e 50 centavos aparece como R$ 1.234,50 em formulários, histórico e resumos; não existe opção de selecionar outra moeda; somas e parcelas preservam centavos exatos.

- **AC-064 → REQ-064:** na primeira utilização, o seletor de categorias para receitas oferece exatamente as cinco categorias iniciais de receita e o de despesas oferece exatamente as nove categorias iniciais de despesa; a categoria Outros existe separadamente em cada tipo; as categorias permanecem personalizáveis e não são recriadas a cada abertura.

- **AC-065 → REQ-065:** com lançamentos de R$ 30,00 em 02/11/2026, R$ 80,00 em 01/11/2026 e R$ 50,00 em 03/11/2026, ordenar por data crescente resulta em 01, 02 e 03/11; ordenar por data decrescente resulta em 03, 02 e 01/11; ordenar por valor crescente resulta em R$ 30,00, R$ 50,00 e R$ 80,00; a ordem decrescente inverte os valores. A ordenação respeita os filtros existentes.

- **AC-066 → REQ-066:** ao abrir o histórico com lançamentos em 01/11, 03/11 e 02/11/2026, a ordem padrão é 03/11, 02/11 e 01/11; o usuário pode selecionar outras ordenações sem alterar as datas ou os valores registrados.

- **AC-067 → REQ-067:** uma despesa de R$ 50,00 da categoria Alimentação, sem descrição, aparece no histórico com título 'Alimentação'; quando a descrição for 'Almoço', o título é 'Almoço'. Em ambos os casos, o campo de descrição preserva o valor realmente informado pelo usuário.

- **AC-068 → REQ-068:** partindo de novembro de 2026, a seta anterior seleciona outubro de 2026 e a próxima retorna a novembro; selecionar diretamente março de 2025 exibe os dados daquele mês; navegar de janeiro para o mês anterior resulta em dezembro do ano anterior.

- **AC-069 → REQ-069:** a partir de novembro de 2026, selecionar março de 2030 exibe normalmente os lançamentos previstos para março de 2030 e seus totais; se não existirem lançamentos, mostra valores zerados sem impedir a navegação. Recorrências indefinidas e parcelas futuras são refletidas conforme as regras existentes, sem exigir confirmação de pagamento.

- **AC-070 → REQ-070:** estando em novembro de 2026, o dashboard de dezembro de 2026 mostra 'Receitas previstas', 'Despesas previstas' e 'Resultado previsto', com os mesmos valores que as regras financeiras calculam; novembro de 2026 mantém 'Receitas', 'Despesas' e 'Resultado'. A indicação não cria um estado de pagamento nem altera os lançamentos.

- **AC-071 → REQ-071:** com despesa existente de R$ 50,00 em Alimentação no dia 02/11/2026, cadastrar outra despesa com o mesmo tipo, valor, data e categoria dispara aviso; confirmar salva o segundo lançamento, cancelar mantém o formulário sem criar o segundo. Alterar qualquer um dos quatro atributos não dispara o aviso por esse lançamento.

- **AC-072 → REQ-072:** ao solicitar exclusão de uma despesa avulsa de R$ 50,00 de Alimentação, o aplicativo apresenta valor, categoria e data; escolher 'Cancelar' mantém o lançamento e os indicadores intactos; escolher 'Excluir' remove apenas esse lançamento e atualiza os totais do mês afetado.

- **AC-073 → REQ-073:** uma despesa avulsa de R$ 50,00 em Alimentação pode ser editada para receita de R$ 80,00 em Salário, com data alterada; o sistema rejeita manter a categoria Alimentação de despesa para o tipo receita, exige categoria de receita válida e, após salvar, retira o valor dos totais de despesas do mês original e adiciona aos de receitas do mês escolhido. Cancelar a edição não altera os dados nem os totais.

- **AC-074 → REQ-074:** na primeira abertura, sem receitas nem despesas cadastradas, os indicadores exibem R$ 0,00; a orientação de ausência de lançamentos fica visível e oferece acesso ao cadastro de receita ou despesa. Após salvar o primeiro lançamento, os totais são atualizados e a orientação inicial deixa de ser exibida. Consultar um mês vazio após já ter lançamentos em outro mês não faz o aplicativo tratar essa situação como primeira utilização.

- **AC-075 → REQ-075:** com dois lançamentos em 02/11/2026 e um em 03/11/2026, a ordenação por data decrescente exibe primeiro o grupo 03/11 e depois o grupo 02/11 com seus dois lançamentos; ao selecionar valor decrescente, os três lançamentos aparecem numa lista contínua ordenada por valor, cada um com sua data, sem cabeçalhos diários. Alternar a ordenação não altera os registros.

- **AC-076 → REQ-076:** com duas despesas e uma receita em 02/11/2026, o cabeçalho do grupo mostra apenas a data '02/11/2026'; abaixo, os três lançamentos são listados individualmente sem total de receita, despesa ou resultado do dia. Os resumos mensais no dashboard permanecem disponíveis.

- **AC-077 → REQ-077:** uma compra 'Celular' em dez parcelas aparece no terceiro mês como 'Celular — 3/10', com o valor correspondente à terceira parcela; a décima aparece como 'Celular — 10/10'. Sem descrição, uma compra na categoria Compras aparece como 'Compras — 3/10'. O valor total da compra não é acrescentado ao título.

- **AC-078 → REQ-078:** uma receita de salário com recorrência mensal e uma despesa de assinatura recorrente exibem um ícone de repetição ao lado de seus títulos no histórico; um lançamento avulso não exibe esse ícone. Se a descrição estiver vazia, o nome da categoria continua sendo o título, acompanhado do ícone.

- **AC-079 → REQ-079:** tocar em uma despesa avulsa abre os detalhes sem iniciar edição, exibindo seus dados e as ações 'Editar' e 'Excluir'; tocar em 'Editar' abre a edição e tocar em 'Excluir' segue a confirmação REQ-072. Para uma parcela 'Celular — 3/10' são mostradas a posição e a série, e as ações obedecem à política de edição/exclusão do parcelamento. Fechar detalhes sem agir preserva os dados.

- **AC-080 → REQ-080:** ao pesquisar 'Alimentação', aparecem lançamentos associados à categoria Alimentação com descrição vazia ou com descrição 'Almoço'; um lançamento de outra categoria com descrição 'Alimentação da equipe' também aparece. A pesquisa não altera os dados e continua combinável com os filtros existentes.

- **AC-081 → REQ-081:** digitar progressivamente 'Ali' e 'Alimentação' modifica os resultados visíveis sem tocar em 'Buscar'; apagar caracteres atualiza a lista, e limpar o campo restaura os lançamentos correspondentes ao mês e aos filtros ativos. A pesquisa não altera nem exclui lançamentos.

- **AC-082 → REQ-082:** ao pesquisar um termo inexistente no histórico, aparece a mensagem 'Nenhum lançamento encontrado' e nenhum botão de limpeza dedicado; apagar ou modificar o texto da pesquisa atualiza os resultados automaticamente, preservando mês, filtros e ordenação.

- **AC-083 → REQ-083:** em 02/11/2026, uma despesa datada de 03/11/2026 recebe a indicação 'Previsto' no histórico e nos detalhes; outra despesa de 02/11/2026 não recebe. As duas continuam contabilizadas em seus meses correspondentes. A indicação deixa de aparecer quando a data do lançamento chega, sem exigir qualquer ação do usuário.

- **AC-084 → REQ-084:** se no mês selecionado Alimentação totalizar R$ 200,00 e Transporte R$ 50,00, mas Educação não tiver despesas, o gráfico e sua legenda apresentam somente Alimentação e Transporte; no mês sem despesas, nenhuma categoria é apresentada como gasto, e o dashboard preserva indicadores zerados.

- **AC-085 → REQ-085:** se as despesas do período totalizarem R$ 1.000,00 e Alimentação somar R$ 300,00, mostrar 'Alimentação — R$ 300,00 (30%)'; ao mudar o período, recalcular valores e percentuais. Quando o total de despesas for zero, não calcular divisão por zero e manter o estado vazio do gráfico conforme REQ-084.

- **AC-086 → REQ-086:** ao visualizar despesas de Alimentação de novembro de 2026 e tocar na respectiva categoria do gráfico, o histórico abre mostrando somente despesas de Alimentação de novembro de 2026; não inclui receitas, outras categorias nem meses diferentes. O usuário consegue modificar os filtros após a navegação.

- **AC-087 → REQ-087:** num mês com Moradia R$ 1.200,00, Alimentação R$ 500,00 e Transporte R$ 200,00, a apresentação das categorias no gráfico e na legenda segue Moradia, Alimentação e Transporte; se os valores mudarem em outro mês, a ordem acompanha os novos totais.

- **AC-088 → REQ-088:** se as despesas de outubro de 2026 forem R$ 2.000,00 e as de novembro forem R$ 2.500,00, o indicador de novembro apresenta diferença de +R$ 500,00 e +25% em relação a outubro; os indicadores de receitas e resultado seguem o mesmo princípio. Se o mês anterior for zero, a diferença em reais continua disponível, mas o percentual depende da decisão pendente sobre divisão por zero.

- **AC-089 → REQ-089:** com despesas de outubro de 2026 em R$ 0,00 e novembro em R$ 500,00, mostrar ' +R$ 500,00' e 'Sem base de comparação', sem exibir percentual; quando os dois meses forem R$ 0,00, mostrar diferença de R$ 0,00 e a mesma mensagem. Com base anterior diferente de zero, manter comparação percentual normal conforme REQ-088.

- **AC-090 → REQ-090:** se outubro de 2026 apresentar resultado de −R$ 500,00 e novembro +R$ 500,00, mostrar diferença de +R$ 1.000,00 (+200%). Se outubro apresentar −R$ 500,00 e novembro −R$ 700,00, mostrar −R$ 200,00 (−40%). O percentual nunca inverte a direção da variação por causa de denominador negativo.

- **AC-091 → REQ-091:** receitas de R$ 3.000,00 aparecem em verde e despesas de R$ 2.000,00 em vermelho; resultado de +R$ 1.000,00 aparece em verde, −R$ 500,00 em vermelho e R$ 0,00 em cor neutra. Aumento de despesas de R$ 200,00 é sinalizado como desfavorável (vermelho) e redução de despesas de R$ 200,00 como favorável (verde); as variações apresentam sinais ou setas compreensíveis sem cor.

- **AC-092 → REQ-092:** na primeira abertura, o aplicativo usa o tema configurado no Android; selecionar manualmente 'Escuro' mantém a aparência escura mesmo quando o sistema está claro, inclusive após reabrir o aplicativo; ao retornar para 'Automático', uma mudança do tema do Android passa a refletir-se no aplicativo, sem prejudicar leitura de receitas, despesas ou resultados.

- **AC-093 → REQ-093:** o usuário consegue alternar diretamente entre Dashboard, Histórico, Categorias e Configurações pela barra inferior; a aba ativa fica identificada e o botão `+` permite iniciar um cadastro rápido sem precisar entrar no Histórico. A navegação não altera os dados financeiros.

- **AC-094 → REQ-094:** nas telas principais, a barra inferior apresenta Dashboard e Histórico à esquerda, botão `+` ao centro, Categorias e Configurações à direita; tocar em `+` abre o cadastro rápido e tocar nas demais abas navega normalmente, sem sobreposição que dificulte o uso.

- **AC-095 → REQ-095:** tocar no botão `+` apresenta as duas ações; tocar em 'Nova receita' abre cadastro de receita com categorias de receita e data atual; tocar em 'Nova despesa' abre cadastro de despesa com categorias de despesa e data atual; fechar o menu não registra lançamentos.

- **AC-096 → REQ-096:** abrir novo cadastro e voltar sem alterar campos fecha imediatamente; ao informar valor ou modificar qualquer campo e tentar voltar/cancelar, aparece aviso com ações 'Continuar preenchendo' e 'Descartar'; continuar mantém os dados preenchidos, descartar fecha sem criar lançamento. Valores iniciais preenchidos automaticamente, como a data atual, não contam como alteração do usuário.

- **AC-097 → REQ-097:** ao editar uma despesa avulsa, uma recorrência ou uma compra parcelada, mudar um campo e tentar voltar/cancelar apresenta confirmação; 'Continuar editando' preserva os dados ainda não salvos e 'Descartar' fecha a edição sem modificar o lançamento nem a série. Abrir a edição e sair sem alterações não apresenta aviso.

- **AC-098 → REQ-098:** ao cadastrar uma despesa com valor e data informados, selecionar '+ Nova categoria', criar 'Pets' e confirmar preserva valor/data e seleciona 'Pets' como categoria de despesa. Um nome duplicado do mesmo tipo é rejeitado sem perder os campos; cancelar a criação da categoria retorna ao formulário com o preenchimento intacto.

- **AC-099 → REQ-099:** se existir somente a categoria 'Outros' para receitas, tentar excluí-la é bloqueado com mensagem que orienta criar outra categoria de receita; categorias de despesa não substituem a exigência. Após criar uma nova categoria de receita, 'Outros' poderá ser excluída seguindo as regras de migração de registros, se aplicáveis. A mesma regra vale para despesas.

- **AC-100 → REQ-100:** no seletor de despesas, categorias como Alimentação, Educação, Moradia e Transporte aparecem nesta ordem, independentemente de quando foram criadas. Ao criar 'Academia', ela passa a aparecer antes de Alimentação; ao renomeá-la, a posição é recalculada. Receitas e despesas mantêm listas separadas.

- **AC-101 → REQ-101:** em um cadastro de despesa, digitar 'mor' no seletor mostra 'Moradia', sem exibir categorias exclusivas de receitas; limpar a pesquisa restaura a lista completa de despesas em ordem alfabética. Digitar um nome inexistente mostra a ausência de correspondências sem criar ou selecionar uma categoria automaticamente.

- **AC-102 → REQ-102:** ao iniciar o aplicativo em novembro de 2026, o Histórico abre em novembro de 2026, mesmo que outubro tenha sido o último mês consultado antes de fechar o aplicativo. Ao tocar em uma categoria do gráfico referente a outubro, o Histórico abre excepcionalmente em outubro, com o filtro recebido da navegação.

- **AC-103 → REQ-103:** ao iniciar uma nova despesa pelo botão `+` enquanto está no Dashboard, salvar com sucesso retorna ao Dashboard com os totais atualizados; se iniciado no Histórico, retorna ao Histórico com a listagem atualizada quando o lançamento corresponde ao mês/filtros ativos. Se ocorrer falha ao salvar, o formulário continua aberto com os dados informados e mensagem de erro.

- **AC-104 → REQ-104:** ao salvar uma despesa com sucesso, a tela de origem atualiza e mostra brevemente 'Despesa salva com sucesso', que desaparece sem ação do usuário; para receita, apresenta mensagem equivalente. O aviso não impede a interação com a tela e, em caso de falha, não afirma que o lançamento foi salvo.

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

- **OPEN-036 [VALIDADO em 2026-11-02]:** valor, data e categoria obrigatórios em receitas e despesas, com descrição opcional. Justificativa: manter consistência de análises por categoria sem tornar o registro demorado. Alternativas rejeitadas: exigir descrição ou permitir ausência de categoria. Impacto: validação igual nos dois tipos de lançamento e categorias separadas por tipo.

- **OPEN-037 [VALIDADO em 2026-11-02]:** todas as categorias, inclusive as iniciais, são editáveis e excluíveis. Justificativa: categorias iniciais são sugestões e não restrições para uso pessoal. Alternativas rejeitadas: proteção ou proibição da exclusão das categorias iniciais. Impacto: aplicar uniformemente as regras de transferência de lançamentos antes de excluir categorias em uso.

- **OPEN-038 [VALIDADO em 2026-11-02]:** não permitir nomes duplicados de categorias no mesmo tipo, ignorando maiúsculas e minúsculas. Categorias de tipos diferentes podem ter o mesmo nome. Justificativa: evitar confusão em filtros e relatórios. Alternativa rejeitada: permitir duplicatas. Impacto: validar criação e renomeação de categorias.

- **OPEN-039 [VALIDADO em 2026-11-02]:** somente BRL (R$), com duas casas decimais e formatação brasileira; sem suporte multimoeda. Justificativa: aplicação pessoal, sem necessidade de câmbio. Alternativa rejeitada: múltiplas moedas. Impacto: padronização de entradas, exibições, totais e testes de valores monetários.

- **OPEN-040 [VALIDADO em 2026-11-02]:** listas iniciais aprovadas: receitas — Salário, Renda extra, Reembolso, Presentes, Outros; despesas — Alimentação, Moradia, Transporte, Saúde, Lazer, Compras, Educação, Assinaturas, Outros. Justificativa: cobrir lançamentos pessoais comuns com uma lista enxuta e personalizável. Alternativa rejeitada: listas maiores ou diferentes antes do uso. Impacto: disponibilização inicial separada por tipo, sem duplicação na reabertura.

- **OPEN-041 [VALIDADO, CORRIGIDO em 2026-11-02]:** o termo 'filtrar por data e valor' foi esclarecido pelo usuário como **ordenar** o histórico por data ou valor em ambos os sentidos (crescente e decrescente), não como adicionar filtros por intervalos. Justificativa: oferecer diferentes modos de consultar a lista sem ampliar indevidamente o escopo. Alternativa descartada: filtros adicionais por intervalo de data e faixa de valores. Impacto: apenas controles de ordenação; os filtros já acordados permanecem. A ordenação padrão inicial foi definida em OPEN-042.

- **OPEN-042 [VALIDADO em 2026-11-02]:** a ordenação padrão do histórico é por data decrescente, com lançamentos mais recentes primeiro. Justificativa: facilitar a consulta ao que foi registrado recentemente. Alternativas rejeitadas: mais antigos primeiro e restaurar a última ordenação usada como padrão. Impacto: inicializar o histórico com ordenação por data decrescente, permitindo ao usuário trocar para as opções de REQ-065.

- **OPEN-043 [VALIDADO em 2026-11-02]:** mostrar o nome da categoria no histórico quando a descrição estiver vazia. Justificativa: melhorar a identificação sem forçar texto no cadastro. Alternativas rejeitadas: mostrar 'Sem descrição' ou o tipo 'Receita/Despesa'. Impacto: regra de apresentação, sem substituir o conteúdo da descrição salva.

- **OPEN-044 [VALIDADO em 2026-11-02]:** navegação mensal com setas anterior/próximo e seleção direta de mês e ano. Justificativa: agilidade em períodos próximos e acesso a meses distantes sem múltiplos toques. Alternativas rejeitadas: apenas setas ou apenas seletor. Impacto: manter sincronizados os dados visíveis com o mês de referência selecionado.

- **OPEN-045 [VALIDADO em 2026-11-02]:** navegação livre para meses futuros, com visualização de receitas e despesas previstas. Justificativa: permitir consultar o impacto futuro de lançamentos e parcelamentos. Alternativas rejeitadas: restringir a 12 meses ou impedir consulta depois do mês corrente. Impacto: relatórios e histórico devem representar corretamente meses futuros, inclusive sem lançamentos, sem impor limite artificial de período.

- **OPEN-046 [VALIDADO em 2026-11-02]:** destacar meses futuros como previstos apenas por rótulos visuais nos totais do dashboard. Justificativa: diferenciar projeções de períodos corrente e anteriores, sem introduzir estados de pagamento. Alternativa rejeitada: apresentar meses futuros sem distinção. Impacto: formatação condicional de títulos, mantendo cálculo financeiro idêntico.

- **OPEN-047 [VALIDADO em 2026-11-02]:** avisar sobre possíveis lançamentos duplicados, mas permitir salvar após confirmação. Critério de comparação: tipo, valor, data e categoria. Justificativa: evitar duplicações acidentais sem impedir compras legítimas idênticas. Alternativas rejeitadas: permitir sem alerta ou bloquear sempre. Impacto: verificação antes do salvamento e confirmação explícita, sem perda dos campos informados.

- **OPEN-048 [VALIDADO em 2026-11-02]:** exigir confirmação antes da exclusão definitiva de lançamentos avulsos. Justificativa: evitar remoção acidental de dados financeiros sem backup. Alternativas rejeitadas: exclusão imediata com desfazer e exclusão imediata sem proteção. Impacto: confirmação anterior à exclusão, atualização de agregados após a ação e preservação integral ao cancelar.

- **OPEN-049 [VALIDADO em 2026-11-02]:** permitir editar todos os campos dos lançamentos avulsos, inclusive converter receita em despesa e vice-versa. Justificativa: corrigir erros de cadastro sem excluir e recriar registros. Alternativa rejeitada: impedir alteração do tipo. Impacto: exigir recategorização compatível ao trocar o tipo e atualizar os agregados de ambos os meses/tipos envolvidos.

- **OPEN-050 [VALIDADO em 2026-11-02]:** dashboard vazio exibe indicadores zerados e orientação acionável para cadastrar a primeira receita ou despesa. Justificativa: orientar o início do uso sem interromper o acesso normal ao dashboard. Alternativas rejeitadas: dashboard sem orientação e tela separada de boas-vindas. Impacto: estado vazio contextual, conectado ao cadastro rápido e distinto de meses individuais sem lançamentos.

- **OPEN-051 [VALIDADO em 2026-11-02]:** agrupar o histórico por dia somente quando a ordenação for por data; utilizar lista contínua ao ordenar por valor. Justificativa: facilitar a leitura cronológica sem atrapalhar a classificação global por valor. Alternativa rejeitada: lista contínua em todas as ordenações. Impacto: apresentação condicional dependente do critério de ordenação REQ-065, mantendo a ordenação padrão REQ-066.

- **OPEN-052 [VALIDADO em 2026-11-02]:** o histórico agrupado por dia exibe apenas a data e seus lançamentos, sem totalizadores diários. Justificativa: preservar uma lista compacta e evitar redundância com os resumos mensais do dashboard. Alternativas rejeitadas: cabeçalhos com receitas/despesas do dia ou resultado diário. Impacto: grupos diários sem indicadores agregados, mantendo a exibição individual dos lançamentos.

- **OPEN-053 [VALIDADO em 2026-11-02]:** apresentar descrição e posição da parcela no histórico, no formato 'Celular — 3/10'. Justificativa: facilitar identificação e acompanhamento da compra mantendo a lista compacta. Alternativas rejeitadas: ocultar a posição ou exibir também o valor total da compra na lista. Impacto: rótulo derivado da série parcelada, sem alterar montantes e cálculos.

- **OPEN-054 [VALIDADO em 2026-11-02]:** utilizar ícone de repetição para identificar lançamentos recorrentes no histórico. Justificativa: permitir reconhecimento rápido sem poluir a lista. Alternativas rejeitadas: rótulo textual 'Recorrente' e ausência de identificação na lista. Impacto: sinalização visual em recorrências finitas e indefinidas, sem afetar cálculo ou edição.

- **OPEN-055 [VALIDADO em 2026-11-02]:** toque em lançamento abre primeiro a visualização de detalhes com ações de editar e excluir, incluindo dados da série quando aplicável. Justificativa: permitir consulta segura sem entrar em edição acidental. Alternativa rejeitada: abrir diretamente a edição. Impacto: tela ou painel de detalhes reutilizável com ações sujeitas às regras específicas de lançamentos avulsos, recorrências e parcelamentos.

- **OPEN-056 [VALIDADO em 2026-11-02]:** a pesquisa textual do histórico considera descrição e nome da categoria. Justificativa: encontrar lançamentos com descrição opcional e permitir busca intuitiva por categoria. Alternativa rejeitada: pesquisar apenas pela descrição e depender exclusivamente do filtro de categoria. Impacto: busca textual sobre dois atributos, preservando os filtros e a ordenação já definidos.

- **OPEN-057 [VALIDADO em 2026-11-02]:** pesquisa textual do histórico atualiza automaticamente enquanto o usuário digita. Justificativa: consulta mais ágil no aplicativo local, sem etapa extra de confirmação. Alternativa rejeitada: botão 'Buscar'. Impacto: atualização reativa da lista respeitando filtros e ordenação existentes.

- **OPEN-058 [VALIDADO em 2026-11-02]:** pesquisas sem resultados mostram apenas uma mensagem informativa, sem botão adicional para limpar. Justificativa: interface enxuta, já que o campo de busca pode ser editado e os resultados reagem automaticamente. Alternativa rejeitada: incluir botão dedicado de limpar pesquisa no estado vazio. Impacto: estado vazio informativo, sem controles extras.

- **OPEN-059 [VALIDADO em 2026-11-02]:** identificar individualmente lançamentos futuros como 'Previsto', sem modificar os cálculos. Justificativa: distinguir datas futuras no histórico, complementando os rótulos de totais mensais futuros aprovados em OPEN-046. Alternativa rejeitada: sinalizar somente os totais mensais. Impacto: sinalização visual por data de cada lançamento, sem introduzir status de pagamento.

- **OPEN-060 [VALIDADO em 2026-11-02]:** gráfico de despesas por categoria exibe apenas categorias com gastos positivos no período consultado. Justificativa: manter o gráfico e a legenda legíveis sem categorias de valor zero. Alternativa rejeitada: exibir todas as categorias inclusive sem gastos. Impacto: filtrar somente a apresentação do gráfico, sem eliminar categorias cadastradas ou afetar formulários.

- **OPEN-061 [VALIDADO em 2026-11-02]:** o gráfico de despesas por categoria mostra valor em reais e participação percentual de cada categoria com gastos. Justificativa: facilitar a análise tanto do montante quanto da proporção das despesas. Alternativas rejeitadas: somente valor ou somente percentual. Impacto: cálculo e apresentação dos percentuais no período selecionado, com tratamento de total zero.

- **OPEN-062 [VALIDADO em 2026-11-02]:** tocar em uma categoria do gráfico de despesas abre o histórico filtrado pela categoria e período consultados. Justificativa: facilitar a conferência dos lançamentos que formam cada total. Alternativas rejeitadas: apenas destacar dados no gráfico ou não permitir interação. Impacto: navegação do gráfico ao histórico com contexto de período, tipo e categoria preservado.

- **OPEN-063 [VALIDADO em 2026-11-02]:** ordenar as categorias do gráfico de despesas pelo maior gasto primeiro. Justificativa: destacar rapidamente as categorias de maior impacto financeiro. Alternativas rejeitadas: ordem alfabética e seletor para alternar ordenações. Impacto: ordenação decrescente dinâmica conforme o período consultado, sem alterar cálculos e filtros.

- **OPEN-064 [VALIDADO em 2026-11-02]:** os indicadores mensais do dashboard mostram comparação com o mês anterior tanto em reais quanto em percentual. Justificativa: facilitar a interpretação das mudanças financeiras entre meses. Alternativas rejeitadas: mostrar apenas percentual ou não incluir comparação nos indicadores. Impacto: calcular diferenças monetárias e percentuais usando meses consecutivos; regra de apresentação quando a base percentual for zero definida em OPEN-065.

- **OPEN-065 [VALIDADO em 2026-11-02]:** se o indicador no mês anterior for zero, exibir a diferença em reais e 'Sem base de comparação' em vez de percentual. Justificativa: evitar divisão por zero e comunicar o motivo da ausência do percentual. Alternativas rejeitadas: usar apenas um traço ou ocultar toda a comparação. Impacto: tratamento explícito de base zero na comparação mensal, sem alterar cálculos de totais.

- **OPEN-066 [VALIDADO em 2026-11-02]:** calcular a variação percentual do resultado usando o valor absoluto do mês anterior quando negativo. Justificativa: preservar a direção correta de melhora ou piora do resultado e manter comparação quantitativa com períodos deficitários. Alternativa rejeitada: omitir percentual sempre que o resultado anterior fosse negativo. Impacto: fórmula específica para resultado com base negativa, respeitando regra para base zero definida em OPEN-065.

- **OPEN-067 [VALIDADO em 2026-11-02]:** aplicar cores financeiras semânticas e destacar comparações pela direção de melhora ou piora financeira, com informação adicional a cores. Justificativa: leitura rápida e coerente dos indicadores. Alternativa rejeitada: indicadores predominantemente neutros. Impacto: apresentação diferenciada para receitas, despesas, resultado e respectivas variações, inclusive estados neutros.

- **OPEN-068 [VALIDADO em 2026-11-02]:** disponibilizar temas claro e escuro, seguindo o Android por padrão e permitindo seleção manual de claro, escuro ou automático. Justificativa: respeitar preferências de aparência sem comprometer clareza das informações financeiras. Alternativas rejeitadas: tema exclusivamente claro ou escuro. Impacto: configuração persistente de aparência e adaptação visual das cores semânticas em ambos os temas.

- **OPEN-069 [VALIDADO em 2026-11-02]:** navegação principal por barra inferior com quatro abas — Dashboard, Histórico, Categorias e Configurações — mantendo o botão de cadastro rápido. Justificativa: acesso direto e previsível às áreas de uso frequente. Alternativas rejeitadas: menu lateral e navegação híbrida com abas secundárias. Impacto: estrutura principal de navegação com quatro destinos e ação rápida independente.

- **OPEN-070 [VALIDADO em 2026-11-02]:** botão `+` de cadastro rápido centralizado na barra inferior, entre as quatro abas. Justificativa: facilitar o acesso frequente ao cadastro mantendo a navegação principal direta. Alternativas rejeitadas: botão flutuante no canto inferior direito ou botão no cabeçalho. Impacto: organizar a barra com dois destinos à esquerda, ação central destacada e dois destinos à direita, respeitando acessibilidade e área de toque.

- **OPEN-071 [VALIDADO em 2026-11-02]:** botão central `+` abre menu rápido com 'Nova receita' e 'Nova despesa', em vez de abrir imediatamente o formulário com despesa preselecionada. Justificativa: evitar iniciar cadastro no tipo errado e manter seleção explícita. Alternativa rejeitada: formulário direto com tipo despesa como padrão. Impacto: menu de ações simples que direciona ao formulário correspondente.

- **OPEN-072 [VALIDADO em 2026-11-02]:** avisar antes de sair de cadastros de receita ou despesa com alterações não salvas; fechar diretamente quando não houver mudanças do usuário. Justificativa: proteger informações digitadas sem criar gerenciamento de rascunhos. Alternativas rejeitadas: descarte imediato sempre e salvamento automático de rascunhos. Impacto: detecção de alterações em relação ao estado inicial, confirmação ao sair e preservação do formulário quando o usuário decidir continuar.

- **OPEN-073 [VALIDADO em 2026-11-02]:** estender a proteção de alterações não salvas aos formulários de edição de lançamentos avulsos, recorrências e parcelamentos. Justificativa: consistência com REQ-096 e prevenção de perda acidental de alterações. Alternativa rejeitada: descartar edições imediatamente sem aviso. Impacto: confirmação ao sair de edições modificadas, sem salvar automaticamente e sem alterar a política já aprovada para edição de séries.

- **OPEN-074 [VALIDADO em 2026-11-02]:** permitir criar e selecionar automaticamente uma categoria durante o preenchimento de um lançamento, sem sair nem perder os dados informados. Justificativa: manter o fluxo de cadastro rápido. Alternativa rejeitada: exigir navegação até a aba Categorias. Impacto: criação contextual de categoria vinculada ao tipo atual e reaproveitamento da validação de nomes duplicados.

- **OPEN-075 [VALIDADO em 2026-11-02]:** exigir pelo menos uma categoria para receitas e outra para despesas, bloqueando a exclusão da última de cada tipo. Justificativa: manter o cadastro sempre utilizável, já que categoria é obrigatória. Alternativa rejeitada: permitir listas de categorias vazias. Impacto: validação de exclusão por tipo sem exceção para categorias iniciais, compatível com REQ-061.

- **OPEN-076 [VALIDADO em 2026-11-02]:** ordenar alfabeticamente de A a Z as categorias nos seletores de receitas e despesas. Justificativa: facilitar a localização previsível sem depender da frequência de uso ou data de criação. Alternativas rejeitadas: ordem de criação e categorias mais utilizadas primeiro. Impacto: ordenação dinâmica em português nos seletores, sem afetar a ordenação do gráfico por maiores gastos (REQ-087).

- **OPEN-077 [VALIDADO em 2026-11-02]:** permitir pesquisa por nome nos seletores de categorias enquanto o usuário digita, mantendo ordem alfabética. Justificativa: facilitar localização de categorias em listas extensas. Alternativa rejeitada: somente lista alfabética sem pesquisa. Impacto: filtragem textual contextual por tipo de lançamento, sem alterar categorias armazenadas ou a regra de ordenação REQ-100.

- **OPEN-078 [VALIDADO em 2026-11-02]:** o Histórico inicia no mês atual a cada abertura do aplicativo, sem memorizar o último mês consultado entre sessões. Justificativa: manter o comportamento inicial previsível e consistente com o Dashboard. Alternativa rejeitada: restaurar automaticamente o último mês visualizado. Impacto: inicialização do período do Histórico e respeito à navegação contextual explícita do gráfico.

- **OPEN-079 [VALIDADO em 2026-11-02]:** após salvar lançamento, retornar à tela de origem com dados atualizados. Justificativa: concluir o cadastro de maneira simples e previsível. Alternativas rejeitadas: oferecer 'Salvar e adicionar outro' e reiniciar o formulário automaticamente para novos lançamentos. Impacto: fechamento do formulário somente após confirmação de sucesso e atualização da tela de origem.

- **OPEN-080 [VALIDADO em 2026-11-02]:** informar sucesso do cadastro por mensagem discreta e temporária após retornar à tela anterior. Justificativa: confirmar a persistência sem interromper o fluxo. Alternativas rejeitadas: não exibir confirmação e exigir fechar uma janela modal de sucesso. Impacto: feedback não bloqueante apenas após salvamento confirmado.

## Próximo passo

Revisar os requisitos com o responsável e resolver as questões relevantes com Clarify antes do Plan. Nenhuma implementação autorizada por este documento.
