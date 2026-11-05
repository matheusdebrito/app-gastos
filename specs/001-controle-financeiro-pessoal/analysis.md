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
