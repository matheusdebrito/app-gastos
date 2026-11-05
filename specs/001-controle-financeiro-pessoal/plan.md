# Plano técnico — App Gastos

**Data:** 2026-11-05  
**Status:** EM ELABORAÇÃO — decisões arquiteturais restantes dependem de aprovação  
**Feature:** 001-controle-financeiro-pessoal  
**Constitution:** v1.0.0, ratificada em 2026-11-02

## Insumos

- `.specify/memory/constitution.md` — princípios aprovados de simplicidade, dados locais, aritmética exata, testes e segurança.
- `specs/001-controle-financeiro-pessoal/spec.md` — REQ-001 a REQ-130 e respectivos AC-001 a AC-130.
- `specs/001-controle-financeiro-pessoal/clarifications.md` — reconciliação de decisões anteriores.
- `specs/001-controle-financeiro-pessoal/analysis.md` — parecer APTO COM RESSALVAS para planejamento.
- Na inspeção dos caminhos convencionais, `package.json`, `app.json`, `app.config.ts` e `README.md` não foram encontrados na raiz do repositório. **Não foi verificada a ausência completa de código-fonte** em outros caminhos. Antes de implementar, inspecionar a árvore completa e preservar quaisquer arquivos existentes.

## Arquitetura atual

A documentação especifica um aplicativo Android pessoal, offline, sem conta, backend ou sincronização. Não foi identificada uma configuração de aplicativo nos caminhos convencionais inspecionados. A persistência local foi aprovada como SQLite via `expo-sqlite` (DEC-TECH-002); o esquema físico ainda depende de detalhamento e revisão.

## Arquitetura proposta (sem autorização para implementar)

Aplicativo monolítico mobile com separação de responsabilidades:

1. **Interface:** telas Dashboard, Histórico, Categorias e Configurações; ação `+` central; formulários de lançamentos, recorrências e parcelamentos; estados de erro, sucesso e vazio.
2. **Casos de uso:** criação/edição/exclusão, classificação, geração/consulta de ocorrências de séries, cálculos mensais, filtros e desfazer exclusões. Não inserir regras monetárias nos componentes visuais.
3. **Domínio:** invariantes de centavos exatos, datas locais, séries finitas/indefinidas, divisão exata de parcelas e transferência atômica de categorias.
4. **Persistência:** SQLite local via `expo-sqlite`, com repositórios e migrações versionadas. As operações que envolvem múltiplos registros devem ser atômicas.
5. **Integrações externas:** nenhuma necessária para uso cotidiano. Nenhum backend, autenticação, telemetria, backup ou exportação nesta versão.

## Decisões e alternativas

### DEC-TECH-001 — Plataforma e configuração [APROVADO em 2026-11-05]

**Escolha:** Expo + React Native + TypeScript para Android.

**Justificativa:** menor custo de configuração e manutenção para app pessoal offline, preservando capacidade de módulos nativos por meio do ecossistema Expo quando necessário.

**Alternativa analisada:** React Native CLI com configuração Android nativa desde o início. Oferece controle granular, mas amplia superfície de build/configuração sem necessidade demonstrada.

**Impacto:** iniciar a estrutura do projeto com Expo na fase de implementação, manter TypeScript estrito e evitar dependência de serviços remotos para registrar/consultar finanças.

**Limite da aprovação:** escolha da plataforma aprovada; a persistência foi aprovada posteriormente em DEC-TECH-002. Bibliotecas de navegação e testes continuam sem aprovação específica.

### DEC-TECH-002 — Persistência local [APROVADO em 2026-11-05]

**Escolha:** banco de dados SQLite armazenado localmente no dispositivo, acessado por `expo-sqlite`, compatível com a versão do SDK Expo selecionada no início da implementação.

**Justificativa:** dados relacionados e consultas por mês, filtros e categoria, além de operações financeiras que precisam ser atômicas, justificam um banco relacional local.

**Alternativa rejeitada:** armazenamento chave-valor com estruturas serializadas; seria simples em protótipos, mas complicaria consistência, relações e consultas de recorrências e parcelamentos.

**Impacto:** utilizar migrações versionadas, chaves e restrições de integridade, índices conforme consultas reais e transações de escrita em alterações de séries e transferência/exclusão de categorias. Não usar SQLite como dependência de rede: tudo deve funcionar offline.

**Cuidados para o plano detalhado:** habilitar e testar efetivamente integridade referencial na conexão; definir esquema e regras de geração de ocorrências para impedir duplicações; assegurar que falhas de gravação revertam operações relacionadas; testar compatibilidade e versão de `expo-sqlite` escolhida com o SDK Expo. A aprovação da biblioteca não equivale à aprovação do esquema físico ou das demais bibliotecas.

### DEC-TECH-003 — Representação monetária [PROPOSTA TÉCNICA, NÃO APROVADA]

Usar valores em centavos inteiros de forma exata, sem usar ponto flutuante binário para apuração; verificar o limite seguro de conversão e agregação entre TypeScript e persistência. Não definir teto de negócio para lançamentos; erros de capacidade técnica devem ser claros. Alinhado à Constitution e REQ-124 a REQ-126.

### DEC-TECH-004 — Datas e séries [PROPOSTA TÉCNICA, NÃO APROVADA]

Armazenar datas de cobrança como **datas de calendário** sem deslocamentos de fuso entre meses. Definir regra determinística para último dia do mês e retorno ao dia original (REQ-044, REQ-045, REQ-054). Preservar identidade e alcance de edições de séries, evitando dupla contabilização quando o aplicativo é reiniciado (REQ-015, REQ-023, REQ-026, REQ-042, REQ-043).

### DEC-TECH-005 — Exclusão e desfazer [PROPOSTA TÉCNICA, NÃO APROVADA]

Realizar exclusões confirmadas e permitir restauração em até cinco segundos por operação independente, sem persistir o direito de desfazer entre sessões, conforme REQ-105 a REQ-107 e REQ-118. Modelar reversão sem duplicação; não oferecer desfazer para categorias (REQ-119, REQ-121, REQ-122).

### DEC-TECH-006 — Estratégia das ocorrências [APROVADO em 2026-11-05]

**Escolha:** modelo híbrido. Parcelamentos e recorrências finitas terão suas ocorrências persistidas no SQLite; recorrências indefinidas serão representadas por uma definição de série e calculadas para os meses consultados, com alterações e exceções persistidas separadamente.

**Justificativa:** séries de quantidade definida possuem um conjunto finito de parcelas/ocorrências que pode ser criado e consultado diretamente. Séries indefinidas não podem gerar registros ilimitados e devem continuar consultáveis em meses futuros sem gravações apenas para leitura.

**Alternativas analisadas e rejeitadas:**
- Calcular todas as ocorrências sob demanda: reduz linhas armazenadas, mas torna consultas e edições de séries finitas mais complexas sem vantagem suficiente neste caso.
- Gerar e persistir todas as ocorrências progressivamente ao consultar períodos: acrescenta efeitos de escrita às consultas e demanda mais controle para impedir duplicações.

**Contrato da decisão:**
1. **Séries finitas:** criar exatamente X ocorrências na mesma transação da série; índice/identidade única por série e posição de ocorrência, para impedir duplicação inclusive ao reiniciar e consultar repetidamente. Edição/exclusão integral deve abranger toda a série, inclusive meses anteriores; o valor total de parcelamentos é a soma exata de suas parcelas, com diferenças de centavos na última.
2. **Séries indefinidas:** persistir definição (incluindo data inicial, dia original e regra de repetição) e o conjunto de exceções/alterações por ocorrência ou por trecho da linha do tempo. Consultar um período calcula somente as ocorrências relevantes para esse período, **sem persistir novas ocorrências por uma simples leitura**.
3. **Edição isolada:** registrar exceção apenas para a ocorrência selecionada. **Edição desta e próximas:** registrar mudança de regra a partir da ocorrência selecionada preservando o histórico anterior, inclusive quando outras exceções existirem.
4. **Exclusão isolada:** registrar exclusão pontual para série indefinida; **exclusão desta e próximas:** registrar limite de vigência/cancelamento a partir da ocorrência selecionada. A operação deve ser reversível dentro dos cinco segundos do REQ-105 a REQ-107 e REQ-118, sem deixar duas ocorrências ativas para uma mesma posição.
5. **Categorias:** ao transferir e excluir categoria em uso, atualizar em uma transação as ocorrências persistidas das séries finitas, as definições de séries indefinidas e todas as exceções/segmentos que ainda apontem para a categoria excluída; nenhuma geração futura poderá referenciar a categoria antiga.
6. **Datas:** aplicar o dia original com ajuste ao último dia apenas quando o mês não comportar aquele dia; voltar ao dia original nos meses seguintes.
7. **Consulta e agregação:** resultado de um mês deve combinar lançamentos avulsos, ocorrências persistidas de séries finitas e ocorrências calculadas de séries indefinidas, cada uma **uma única vez**, inclusive em meses futuros.

**Impacto e ressalvas:** exige um desenho explícito de séries, segmentos e exceções e testes de borda para editar/excluir e desfazer. O esquema físico e os contratos de consultas serão detalhados no modelo de dados antes da implementação; aprovação deste modelo **não autoriza** geração de código.

### DEC-TECH-007 — Representação física dos valores e transporte entre SQLite e TypeScript [APROVADO em 2026-11-05]

**Escolha:** valores financeiros em **centavos inteiros** gravados em colunas SQLite `INTEGER`, com validação rigorosa de precisão e faixa numérica em todas as entradas, conversões, operações e agregações.

**Justificativa:** evita erros de ponto flutuante binário nos cálculos de dinheiro e mantém consultas e somatórios adequados a um banco relacional local.

**Alternativa rejeitada:** armazenar valores decimais como texto e usar uma biblioteca decimal exata; adicionaria complexidade em conversões, filtros e consultas para este caso.

**Contrato técnico obrigatório:**
1. Não calcular valores monetários em reais usando ponto flutuante; cálculos ocorrem exclusivamente em centavos inteiros.
2. Toda entrada é validada como inteiro exato e positivo dentro de faixa segura; não aceitar `NaN`, infinito, conversão truncada, frações de centavo ou perda silenciosa de dígitos.
3. A conversão de valores SQLite `INTEGER` para TypeScript e vice-versa deve preservar exatidão. O limite técnico admissível deverá ser o mínimo entre a capacidade demonstrada da biblioteca/driver e as operações envolvidas; testar especificamente valores de fronteira. Não assumir que todo `INTEGER` de 64 bits pode ser transportado sem perda como `number` do JavaScript.
4. Antes de salvar valores individuais ou totais calculados, validar que somas, subtrações, divisão de parcelas e agregações não causam estouro. Não converter `BigInt` em `number` sem checagem explícita de faixa.
5. Parcelamentos aplicam divisão inteira em centavos, atribuindo a diferença residual à última parcela (REQ-055). Valores apresentados em BRL com duas casas decimais, sem alterar o valor armazenado.
6. Em erro de limite técnico, informar o usuário com mensagem clara e não persistir operação parcialmente concluída. O limite não é uma restrição financeira de negócio.

**Rastreabilidade:** Constitution II; REQ/AC-025, 055, 056, 060, 063, 124, 125 e 126.

### DEC-TECH-008 — Migrações e camada de acesso SQLite [APROVADO em 2026-11-05]

**Escolha:** SQL direto usando `expo-sqlite`, organizado em repositórios TypeScript separados das telas e regras de negócio, com migrações SQL versionadas.

**Justificativa:** consultas e transações explícitas oferecem maior controle e facilidade de auditoria sobre integridade financeira com menos dependências. A separação por repositórios preserva manutenção e testabilidade.

**Alternativa rejeitada:** ORM ou query builder tipado, que adicionaria dependências, ferramentas de geração e configuração sem benefício suficiente para o escopo atual.

**Contrato técnico:**
1. Criar migrações incrementais numeradas, aplicadas em ordem, com versão de esquema persistida. Migrações já aplicadas não devem executar novamente em inicialização normal.
2. Abrir o SQLite e garantir esquema válido **antes** de disponibilizar telas que consultam ou alteram dados financeiros. Em falha de migração, apresentar erro recuperável e não prosseguir com esquema parcialmente atualizado.
3. Executar transações para múltiplas alterações correlatas (transferência/exclusão de categoria, criação/edição/exclusão de série finita, alterações de exceções de séries indefinidas e operação de restauração de exclusão); verificar rollback em falha.
4. Habilitar e testar integridade de chaves estrangeiras na conexão; definir restrições de unicidade para categorias do mesmo tipo e posições de ocorrências finitas, com validações adicionais no domínio.
5. Usar instruções parametrizadas para valores dinâmicos, nunca interpolar diretamente texto fornecido pelo usuário em SQL.
6. Converter e validar explicitamente os tipos de entrada/saída de cada repositório; não confiar só na tipagem TypeScript para dados persistidos.
7. Indexar consultas reais de Histórico, categorias, séries e calendário somente quando justificadas; testar desempenho de períodos longos.
8. Validar migrações sobre banco vazio e banco de versão anterior com registros, preservando dados. Antes de uma migração potencialmente destrutiva, exigir revisão e procedimento de recuperação/rollback. Não adicionar backup de produto fora de escopo sem aprovação.

**Alternativa operacional de migração:** migrações manuais com SQL inspecionável em vez de um mecanismo ORM; o executor deve validar a versão e aplicar passos transacionalmente quando suportados.

**Rastreabilidade:** REQ/AC-009, 012, 015, 023, 026, 031, 032, 041, 042, 043, 061, 064, 099, 119, 122 e 126; Constitution II, III, V, VI, VII.

### DEC-TECH-009 — Navegação mobile [AGUARDANDO APROVAÇÃO]

**Proposta A (recomendada):** Expo Router, com estrutura de rotas para as quatro abas principais e fluxo de formulários. Centralizar estado de navegação de sessão e proteger formulários com alterações não salvas; respeitar o comportamento do botão Voltar Android definido na especificação.

**Alternativa B:** React Navigation configurado diretamente, com controle explícito de stacks e abas sem convenção de roteamento por arquivos. Oferece flexibilidade, mas demanda mais configuração de rotas para o escopo atual.

**Critérios:** compatibilidade com o SDK Expo adotado, preservação de filtros e períodos entre abas, reinicialização da sessão no Dashboard, entrada em formulários a partir de múltiplas telas e feedback de confirmação ao sair.

## Contratos e dados (preliminares)

**Conceitos:** Categoria (tipo, nome, identidade estável); Lançamento (tipo, centavos, data de calendário, descrição opcional, categoria, eventual vínculo com série); Série (tipo recorrente ou parcelamento, duração fixa/indefinida, regra de ocorrência original, dados básicos para manutenção e exclusão). A tecnologia física aprovada é SQLite via `expo-sqlite` e a estratégia híbrida está aprovada (DEC-TECH-006); **o esquema de tabelas, os segmentos/exceções e contratos detalhados ainda precisam ser definidos e verificados**.

**Invariantes:** categorias não misturam receitas/despesas; nunca excluir a última categoria de um tipo; a soma das parcelas equivale exatamente ao total; valores de lançamentos são positivos; resultado mensal é receitas menos despesas sem saldo acumulado; receitas/despesas futuras contam no período da data informada.

**Contratos entre módulos:** operações devolvem sucesso ou erro explícito, não produzem sucesso falso, mantêm estado consistente. Leituras mensais e filtros devem refletir imediatamente alterações confirmadas.

## Testes e validação

- **Unidade:** cálculos em centavos, arredondamento só na última parcela, data 29/30/31, ano bissexto, limites seguros, comparação mensal e condições sem lançamentos.
- **Integração com persistência real de teste:** gravação/reabertura, migrações, inserção idempotente ou consulta sem duplicação de séries, edição/exclusão integral, rollback em falha de transferência de categoria, ações independentes de desfazer.
- **Interface/Android:** teclado no novo cadastro e sem abertura automática na edição, formulários com mudanças não salvas, navegação por abas/voltar, estado do histórico por sessão, modo claro/escuro, valores previstos.
- **Sem internet:** todos os fluxos essenciais de uso devem funcionar em modo offline.
- **Rollout:** distribuir inicialmente em ambiente Android pessoal/de desenvolvimento; não está aprovada publicação em loja. Testar instalação, reinício e migrações antes de tratar dados reais.

## Riscos e mitigação

1. **Perda permanente de dados sem backup:** risco aceito funcionalmente; não prometer recuperação de dados após desinstalação/perda do aparelho.
2. **Duplicação de recorrências:** definir identidade lógica de ocorrência e teste de reabertura/consulta repetida.
3. **Precisão monetária:** centavos exatos e validação de capacidade numérica.
4. **Integridade de múltiplas escritas:** transações e tratamento de erro no armazenamento.
5. **Desempenho com grande histórico:** consultas indexadas, renderização incremental, limite apenas técnico para seleção de períodos muito extensos.

## Mapeamento REQ/AC → componentes previstos

| Grupo | Requisitos/critério correspondente | Área |
|---|---|---|
| Movimentações e validação | REQ/AC-001 a 004, 060, 103, 124 a 128 | Formulários, domínio e persistência |
| Recorrências e parcelas | REQ/AC-013 a 028, 042 a 056 | Séries, cálculos, persistência |
| Categorias | REQ/AC-005, 008, 029 a 034, 061, 062, 064, 098 a 101, 119 a 123 | Gerenciamento e reclassificação |
| Dashboard | REQ/AC-035 a 037, 051 a 053, 111, 112, 115, 116, 130 | Consultas e UI de indicadores |
| Histórico | REQ/AC-038 a 041, 102, 108 a 110, 113, 117, 129 | Lista, filtros e navegação |
| Navegação e feedback | REQ/AC-057 a 059, 093 a 097, 103 a 107, 114, 118 | Navegação, teclado, mensagens e desfazer |

**Rastreabilidade restante:** os requisitos não mencionados nominalmente na matriz resumida continuam integralmente aplicáveis; Tasks deve mapear cada REQ/AC a uma ou mais tarefas verificáveis.

## Aprovações restantes e próximo passo

1. **DEC-TECH-002 aprovada:** SQLite via `expo-sqlite`.
2. **DEC-TECH-006 aprovada:** modelo híbrido para séries e ocorrências.
3. **DEC-TECH-007 aprovada:** centavos inteiros SQLite, com validação de transporte, agregações e limites numéricos seguros.
4. **DEC-TECH-008 aprovada:** SQL direto, repositórios TypeScript e migrações versionadas.
5. Avaliar **DEC-TECH-009**, navegação mobile.
6. Detalhar esquema, consultas, testes e comportamento de erro; revisar e aprovar plano completo; gerar `tasks.md`; reexecutar análise de rastreabilidade.
7. Só após as aprovações iniciar implementação em mudanças pequenas e verificadas.
