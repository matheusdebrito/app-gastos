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

A documentação especifica um aplicativo Android pessoal, offline, sem conta, backend ou sincronização. Não foi identificada uma configuração de aplicativo nos caminhos convencionais inspecionados. Nenhuma escolha de persistência local foi aprovada até esta etapa.

## Arquitetura proposta (sem autorização para implementar)

Aplicativo monolítico mobile com separação de responsabilidades:

1. **Interface:** telas Dashboard, Histórico, Categorias e Configurações; ação `+` central; formulários de lançamentos, recorrências e parcelamentos; estados de erro, sucesso e vazio.
2. **Casos de uso:** criação/edição/exclusão, classificação, geração/consulta de ocorrências de séries, cálculos mensais, filtros e desfazer exclusões. Não inserir regras monetárias nos componentes visuais.
3. **Domínio:** invariantes de centavos exatos, datas locais, séries finitas/indefinidas, divisão exata de parcelas e transferência atômica de categorias.
4. **Persistência:** repositórios locais com migrações versionadas; tecnologia definitiva pendente de aprovação. As operações que envolvem múltiplos registros devem ser atômicas.
5. **Integrações externas:** nenhuma necessária para uso cotidiano. Nenhum backend, autenticação, telemetria, backup ou exportação nesta versão.

## Decisões e alternativas

### DEC-TECH-001 — Plataforma e configuração [APROVADO em 2026-11-05]

**Escolha:** Expo + React Native + TypeScript para Android.

**Justificativa:** menor custo de configuração e manutenção para app pessoal offline, preservando capacidade de módulos nativos por meio do ecossistema Expo quando necessário.

**Alternativa analisada:** React Native CLI com configuração Android nativa desde o início. Oferece controle granular, mas amplia superfície de build/configuração sem necessidade demonstrada.

**Impacto:** iniciar a estrutura do projeto com Expo na fase de implementação, manter TypeScript estrito e evitar dependência de serviços remotos para registrar/consultar finanças.

**Limite da aprovação:** escolha da plataforma aprovada; nenhuma biblioteca de armazenamento, navegação ou testes foi automaticamente aprovada.

### DEC-TECH-002 — Persistência local [AGUARDANDO APROVAÇÃO]

**Proposta recomendada:** SQLite local por biblioteca compatível com a versão aprovada do Expo, mantendo transações para operações relacionadas e migrações de esquema.

**Alternativas reais:** armazenamento chave-valor com estrutura serializada (simples no início, pior para consultas, atualização de séries e consistência) ou banco relacional local SQLite (mais adequado para histórico, filtros, relacionamentos e edições atômicas). A seleção da biblioteca e versão deve ser validada com o ambiente Expo em implementação.

**Riscos relevantes:** exclusão de categoria deve transferir todos os vínculos existentes e futuros sem estado parcial; recorrências e parcelamentos não podem duplicar movimentos; fechamentos durante gravação não devem corromper dados.

### DEC-TECH-003 — Representação monetária [PROPOSTA TÉCNICA, NÃO APROVADA]

Usar valores em centavos inteiros de forma exata, sem usar ponto flutuante binário para apuração; verificar o limite seguro de conversão e agregação entre TypeScript e persistência. Não definir teto de negócio para lançamentos; erros de capacidade técnica devem ser claros. Alinhado à Constitution e REQ-124 a REQ-126.

### DEC-TECH-004 — Datas e séries [PROPOSTA TÉCNICA, NÃO APROVADA]

Armazenar datas de cobrança como **datas de calendário** sem deslocamentos de fuso entre meses. Definir regra determinística para último dia do mês e retorno ao dia original (REQ-044, REQ-045, REQ-054). Preservar identidade e alcance de edições de séries, evitando dupla contabilização quando o aplicativo é reiniciado (REQ-015, REQ-023, REQ-026, REQ-042, REQ-043).

### DEC-TECH-005 — Exclusão e desfazer [PROPOSTA TÉCNICA, NÃO APROVADA]

Realizar exclusões confirmadas e permitir restauração em até cinco segundos por operação independente, sem persistir o direito de desfazer entre sessões, conforme REQ-105 a REQ-107 e REQ-118. Modelar reversão sem duplicação; não oferecer desfazer para categorias (REQ-119, REQ-121, REQ-122).

## Contratos e dados (preliminares)

**Conceitos:** Categoria (tipo, nome, identidade estável); Lançamento (tipo, centavos, data de calendário, descrição opcional, categoria, eventual vínculo com série); Série (tipo recorrente ou parcelamento, duração fixa/indefinida, regra de ocorrência original, dados básicos para manutenção e exclusão). O modelo físico permanece **a definir no plano detalhado** após aprovação de persistência.

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

1. Aprovar **DEC-TECH-002**, escolha da persistência local.
2. Detalhar modelo de dados, estratégia de consultas e desenho de séries após essa escolha.
3. Revisar e aprovar plano completo; gerar `tasks.md`; reexecutar análise de rastreabilidade.
4. Só após as aprovações iniciar implementação em mudanças pequenas e verificadas.
