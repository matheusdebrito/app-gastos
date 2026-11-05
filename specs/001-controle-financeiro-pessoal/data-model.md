# Modelo de dados proposto — App Gastos

**Data:** 2026-11-05  
**Status:** PROPOSTA TÉCNICA — aguardando revisão/aprovação junto ao Plan  
**Fonte:** `spec.md`, Constitution e decisões DEC-TECH-001/002/006/007/008/009/010.

## Princípios

- SQLite local via `expo-sqlite`; SQL explícito, repositórios TypeScript e migrações versionadas.
- Datas de lançamentos e vencimentos no formato `YYYY-MM-DD` (data de calendário, não timestamp UTC); manter o dia original de cobrança para meses curtos.
- Dinheiro em centavos inteiros positivos no SQLite. Na camada TypeScript, rejeitar conversões que não sejam inteiras e seguras; agregações devem preservar exatidão sem estouro.
- Identificadores imutáveis e chaves estrangeiras; nomes de categorias únicos sem diferenciar caixa **dentro do tipo**.
- Ausência de backend, login, backup e exportação no MVP.

## Entidades e relações propostas

### 1. `categories`

- `id` (chave primária), `type` (`income` ou `expense`), `name`, `created_at`.
- Unicidade para `type` + nome normalizado (sem distinguir caixa); validação de nomes vazios.
- Categorias iniciais sem tratamento privilegiado após criação: podem ser renomeadas e excluídas conforme os requisitos.
- Antes de excluir categoria em uso, transferir **todos** os vínculos presentes e futuros em uma transação para outra categoria do mesmo tipo. Não permitir remover a última categoria do tipo.

### 2. `entries` — lançamentos avulsos e ocorrências finitas

- `id`, `type`, `category_id`, `amount_cents`, `due_date`, `description` (opcional), `series_id` (nulo para avulso), `series_position` (nulo para avulso).
- FKs para `categories` e `series`, com política de exclusão deliberada e sem cascata que possa apagar lançamentos involuntariamente.
- Para séries finitas, unicidade de `series_id` + `series_position`, com `series_position` entre 1 e X.
- Índices por `due_date` e combinações relevantes para consulta mensal, categoria, tipo e ordem do histórico; avaliar `EXPLAIN QUERY PLAN` quando houver volume real.

### 3. `series` — configuração da recorrência ou parcelamento

- `id`, `kind` (`recurring` ou `installment`), `type`, `category_id`, `amount_cents` (recorrência mensal; parcelas podem ter valores individuais), `start_date`, `original_day`, `duration_months` (nulo apenas para recorrência indefinida), `description` e metadados de criação.
- Somente recorrência permite duração indefinida; parcelamento sempre possui X parcelas e valor total separado.
- Para séries finitas, inserir exatamente X linhas `entries` na mesma transação de criação. Em edição integral, reconstruir/atualizar a série e suas linhas transacionalmente, preservando consistência e sem duplicações.
- Garantir que a soma de parcelas positivas equivale ao valor total, inclusive ajuste do último centavo.

### 4. `series_changes` — alterações da regra de séries indefinidas

- `id`, `series_id`, `effective_position` (posição mensal na série, começando em 1), `kind` (`update_from_here` ou `end_from_here`), novos campos aplicáveis (ex.: valor, categoria, descrição e regras editáveis), `created_at`.
- Definir regra inequívoca quando duas alterações têm mesma posição: gravação transacional com substituição ou precedência estável, sem efeitos dependentes da ordem de consulta.
- Uma alteração `end_from_here` elimina a ocorrência desta posição e posteriores, sem excluir meses anteriores; atualização `update_from_here` altera somente a partir da posição escolhida.
- Posicionamento por índice mensal imutável evita deslocamento acidental de meses quando o dia original não existe.

### 5. `series_exceptions` — exceções pontuais de recorrência indefinida

- `series_id`, `position` (unicidade combinada), `kind` (`override` ou `skip`), e campos opcionais substitutos da ocorrência (valor, categoria, descrição, data).
- A exceção pontual não altera a definição da série nem o comportamento das demais posições.
- Decidir explicitamente no detalhamento a precedência entre uma exceção existente e uma atualização posterior `update_from_here`; a escolha deve preservar o escopo aprovado ('somente esta' versus 'esta e próximas') e ser coberta por testes.

### 6. `schema_migrations`

- `version`, `applied_at`, identificador/checksum opcional.
- Aplicar migrações ordenadamente com marcação de versão consistente; falhas interrompem a inicialização funcional. Usar transação quando suportado pelo conjunto de operações da migração.

## Consultas e invariantes

1. **Mês selecionado:** combinar `entries` com `due_date` no mês e as ocorrências calculadas apenas para a janela solicitada das `series` indefinidas; aplicar `series_changes` e `series_exceptions`, evitando sobreposição.
2. **Totais:** receitas e despesas somadas em centavos de forma exata; resultado = receitas − despesas, sem transferência de saldo entre meses.
3. **Datas futuras:** contam normalmente em seu mês, com indicação visual `Previsto` determinada pela data atual e sem status de pagamento.
4. **Exclusão/undo:** excluir/alterar em transação e manter informação suficiente para desfazer, dentro da sessão e pelo prazo aprovado. Não armazenar indefinidamente cópias de dados só para sustentar a janela de cinco segundos.
5. **Categoria:** garantir que o tipo da categoria corresponde ao tipo do lançamento/série, com validação de domínio e checagem de integridade; SQLite FKs sozinhas não asseguram esse vínculo cruzado.
6. **Integridade e concorrência:** serializar/especificar gravações correlatas, proteger transações contra operações concorrentes e proibir duplicação por identidade de série + posição.
7. **Mudança de data:** reclassificar valores no mês correspondente e invalidar/atualizar consultas, sem mudar automaticamente o período selecionado.

## Riscos e verificações antes da implementação

- **Precisão de inteiros SQLite:** testar conversão de e para TypeScript para limites seguros; não pressupor que o driver preserva 64 bits em `number`.
- **Migração de dados:** testar banco vazio e banco já preenchido; não executar testes destrutivos em banco real.
- **Exceção vs. mudança futura:** especificar e testar precedência sem perder edições pontuais existentes.
- **Reclassificação de categoria:** garantir atualização de `entries`, `series`, `series_changes` e `series_exceptions` na mesma transação.
- **Crescimento de séries finitas:** quantidade X deve ter validação **técnica**, evitando travamento por geração excessiva, sem inventar restrição financeira.
- **Reversão de exclusões:** desfazer cada operação sem gerar ocorrências duplicadas ou violar relações.

## Testes de integração previstos (SQLite real isolado)

- Inserção de série finita X=1, X=12, últimos dias do mês e anos bissextos.
- Reabrir o app/consultar repetidamente não cria novas ocorrências.
- Edição/exclusão integral de série finita inclui meses passados.
- Recorrência indefinida: substituição pontual, exclusão pontual, mudança a partir da posição N e interrupção a partir de N.
- Edições sucessivas com exceção existente preservam a política de precedência definida.
- Falha induzida no meio de transferência/exclusão de categoria desfaz todas as alterações.
- Centavos: 10000 / 3 = 3333, 3333, 3334; não permitir parcela de 0 centavo; rejeitar extrapolação numérica.
- Migrações reaplicadas e simulação de falha não corrompem ou apagam registros válidos.

## Próximo passo

Revisar este modelo durante a conclusão do `plan.md` e submeter as decisões arquiteturais restantes à aprovação. **Não é um esquema SQL final nem autorização para implementação.**
