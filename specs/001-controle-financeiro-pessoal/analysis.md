# Análise de consistência — App Gastos

**Data:** 2026-11-05  
**Documentos inspecionados:** `.specify/memory/constitution.md`, `spec.md` e `clarifications.md` em `specs/001-controle-financeiro-pessoal/`.  
**Plan:** ausente. **Tasks:** ausente. Implementação e testes Android: **NÃO VERIFICADOS**.  
**Parecer:** **APTO COM RESSALVAS para iniciar o Plan**; não é uma autorização para implementar.

## Matriz de rastreabilidade

| Item | Evidência | Resultado |
|---|---|---|
| Identificadores de requisitos | REQ-001 até REQ-130 em `spec.md` | 130 requisitos identificados |
| Critérios vinculados | AC-001 até AC-130 em `spec.md` | 130 critérios; nenhum REQ sem AC e nenhum AC apontando REQ inexistente |
| Aprovações históricas | OPEN-001 até OPEN-106 e consolidação em `clarifications.md` | Decisões documentadas, com versões antigas reconciliadas |
| Tarefas associadas a REQ | `tasks.md` ausente | **NÃO VERIFICADO**; necessário antes de implementar |
| Arquitetura e validação técnica | `plan.md` ausente | **NÃO VERIFICADO**; necessário antes de implementar |

## Achados, evidências e encaminhamento

1. **MÉDIO — Divergência documental sobre backup.** A Constitution reserva a política de backup/restauração para o planejamento; `spec.md`, seção *Fora do escopo confirmado*, exclui essas funcionalidades da primeira versão. Impacto: risco de adicionar trabalho não autorizado ao escopo. Correção mínima: no Plan, registrar expressamente que o MVP não terá backup nem exportação, mantendo riscos aceitos de perda de dados; alteração da Constitution depende de aprovação específica.
2. **MÉDIO — Risco funcional aceito de perda de dados.** `spec.md`, seção *Casos de borda*, reconhece que não haverá recuperação em caso de desinstalação/perda do aparelho. Impacto: possível perda permanente do histórico. Encaminhamento: registrar a restrição e não prometer recuperabilidade.
3. **MÉDIO — Regras monetárias e de séries exigem plano de persistência e testes.** Constitution, princípios II/VI/VII; `spec.md`, REQ-025, REQ-042, REQ-055, REQ-056, REQ-105 a REQ-107 e REQ-118 a REQ-126. Impacto: inconsistência por centavos, duplicação de recorrências ou reclassificação parcial de categorias se não houver transações e idempotência. Encaminhamento: definir modelo de dados, aritmética exata, transações e testes determinísticos no Plan.
4. **BAIXO — Detalhe visual futuro não aprovado.** O usuário aprovou a identificação dos lançamentos futuros no Histórico (REQ-129) e dos meses futuros no Dashboard (REQ-130), mas não decidiu sobre o cabeçalho de mês futuro no Histórico. Impacto: somente apresentação visual. Encaminhamento: não assumir aprovação; não bloquear o núcleo.
5. **MÉDIO — Limites técnicos permanecem para Plan.** REQ-051 permite qualquer quantidade positiva de meses no gráfico e REQ-126 não impõe teto financeiro de negócio. Impacto: renderização e cálculos podem extrapolar capacidade do dispositivo. Encaminhamento: definir limites técnicos, tratamento de erro e testes sem inventar tetos financeiros arbitrários.
6. **MÉDIO — Sem plano ou tarefas versionadas.** `plan.md` e `tasks.md` ainda não existem. Impacto: implementação agora violaria o fluxo de revisão ratificado pela Constitution. Encaminhamento: elaborar Plan, obter aprovações de decisões arquiteturais, depois Tasks e nova análise.

## Parecer e próximos passos

A especificação apresenta **130 REQs e 130 ACs ligados**, com questões históricas principais reconciliadas. Não há bloqueio funcional conhecido que impeça começar a desenhar a solução. A etapa seguinte é o **Plan**, com escolha explícita de Expo versus configuração nativa, persistência e migrações, modelos de recorrência/parcelamento, limites técnicos e estratégia de testes. Após aprovação, gerar Tasks, revisar rastreabilidade e só então iniciar a implementação.

## Reanálise após o plano e backlog incremental — 2026-11-05

**Documentos novamente consultados:** `spec.md`, `plan.md` e `tasks.md`. A Constitution e as clarificações foram inspecionadas na revisão anterior; análise atual complementa, não substitui, o parecer histórico.

### Matriz de rastreabilidade atualizada

| Controle | Resultado |
|---|---|
| Requisitos REQ | 130 identificadores |
| Critérios AC vinculados | 130 identificadores, um por REQ |
| Tarefas T | 18 tarefas T001–T018 |
| Cobertura REQ → tarefa | 130/130 (referências nominais conferidas) |
| Alinhamento REQ/AC nas tarefas | Nenhuma divergência de IDs detectada |
| Execução real de testes, app Android e persistência | **NÃO VERIFICADO** — ainda não implementado |

### Achados restantes

1. **ALTO — Aprovação do plano integrado ainda pendente.** Evidência: cabeçalho `plan.md` ('PRONTO PARA REVISÃO') e `tasks.md` ('RASCUNHO PARA REVISÃO'). A decisão de executar incrementalmente foi aprovada, mas não equivale à aprovação automática de todos os contratos técnicos. **Efeito:** bloquear início de I0 até aprovação explícita do plano e backlog.
2. **MÉDIO — Precedência de exceções em recorrências indefinidas não aprovada.** Evidência: `data-model.md`, seção `series_exceptions`, e `plan.md`, seção *Detalhamento técnico para revisão*. **Efeito:** bloquear T012/T013 até regra definida e testável; não impede preparação I0–I3 após aprovação do plano.
3. **MÉDIO — Modelo físico de banco proposto, não implementado.** Evidência: `data-model.md` ainda declara modelo proposto; `plan.md` solicita revisão de UNIQUE, CHECK, FK e limites de transporte de inteiros. **Efeito:** exigir revisão do SQL e testes reais antes de migrações.
4. **MÉDIO — Escopo de backup divergente entre documentos antigos.** Evidência: Constitution reserva estratégia de recuperação ao planejamento, enquanto `spec.md` exclui backup/exportação nesta versão. **Mitigação:** o Plan adota explicitamente o escopo funcional aprovado e explicita risco de perda; a Constitution ratificada não foi reescrita sem aprovação.
5. **BAIXO — Detalhe visual de cabeçalho futuro no Histórico.** Evidência: `clarifications.md` registra como não decidido. **Efeito:** não implementar como aprovação presumida; não bloqueia o núcleo.
6. **MÉDIO — Árvore completa de código existente não inspecionada.** Evidência: `plan.md`, seção *Insumos*. **Efeito:** T001 deve inspecionar antes de criar ou substituir configuração.
7. **BAIXO — Rastreabilidade nominal não comprova adequação de testes.** A auditoria confirmou a presença dos IDs, mas não executou testes nem verificou seus contratos em código. Revisar caso a caso nos gates de incremento.

### Parecer atualizado

**APTO COM RESSALVAS PARA REVISÃO E APROVAÇÃO DO PLANO/TAREFAS.** Nenhum requisito ficou sem referência nominal no backlog. O início da implementação continua condicionado à aprovação explícita do plano integrado e à inspeção do repositório. A precedência de exceções deve ser aprovada antes do incremento I4. Nenhuma funcionalidade foi implementada nesta etapa.
