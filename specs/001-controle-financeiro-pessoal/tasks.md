# Tarefas técnicas — App Gastos

**Data:** 2026-11-05  
**Status:** APROVADAS — I0 iniciada, validação Android pendente; T001/T002 ainda abertas  
**Base:** Constitution, spec.md (REQ/AC-001 a 130), clarifications.md, plan.md e data-model.md.

## Execução por incrementos

Execução incremental I0–I6, com teste e validação por etapa, aprovada em DEC-TECH-011. O plano integrado e as 18 tarefas foram aprovados em 2026-11-05; a implementação foi autorizada a partir de I0. Cada tarefa requer implementação, teste, evidência, revisão de erro e aprovação do gate do incremento. Não usar banco de dados real do usuário em testes.

## Backlog rastreável

- [ ] **T001 [REQ-009/AC-009, REQ-057/AC-057, REQ-058/AC-058, REQ-059/AC-059, REQ-093/AC-093, REQ-094/AC-094, REQ-095/AC-095, REQ-114/AC-114, REQ-115/AC-115] — I0:** Inspecionar repositório e configurar Expo, TypeScript, Expo Router e Android. **Dependência / prova:** nenhuma; app inicializa.

- [ ] **T002 [REQ-009/AC-009, REQ-012/AC-012, REQ-015/AC-015, REQ-023/AC-023, REQ-026/AC-026, REQ-032/AC-032, REQ-042/AC-042, REQ-043/AC-043] — I0:** Configurar Jest e ambiente SQLite real isolado. **Dependência / prova:** T001; testes de exemplo.

- [ ] **T003 [REQ-008/AC-008, REQ-009/AC-009, REQ-012/AC-012, REQ-015/AC-015, REQ-023/AC-023, REQ-026/AC-026, REQ-031/AC-031, REQ-032/AC-032, REQ-042/AC-042, REQ-043/AC-043, REQ-061/AC-061, REQ-062/AC-062, REQ-099/AC-099, REQ-119/AC-119, REQ-122/AC-122] — I1:** Implementar migrações, repositórios, constraints e transações. **Dependência / prova:** T001-T002; testes reais de migração/rollback.

- [ ] **T004 [REQ-001/AC-001, REQ-002/AC-002, REQ-004/AC-004, REQ-011/AC-011, REQ-025/AC-025, REQ-026/AC-026, REQ-055/AC-055, REQ-056/AC-056, REQ-060/AC-060, REQ-063/AC-063, REQ-088/AC-088, REQ-089/AC-089, REQ-090/AC-090, REQ-124/AC-124, REQ-125/AC-125, REQ-126/AC-126] — I1:** Implementar moeda em centavos e validações de limites. **Dependência / prova:** T002; testes de precisão e overflow.

- [ ] **T005 [REQ-006/AC-006, REQ-028/AC-028, REQ-042/AC-042, REQ-043/AC-043, REQ-044/AC-044, REQ-045/AC-045, REQ-054/AC-054, REQ-068/AC-068, REQ-069/AC-069, REQ-070/AC-070, REQ-083/AC-083, REQ-102/AC-102, REQ-116/AC-116, REQ-117/AC-117, REQ-129/AC-129, REQ-130/AC-130] — I1:** Implementar calendário local e cálculos de datas/meses. **Dependência / prova:** T002; testes em 29/30/31 e virada.

- [ ] **T006 [REQ-005/AC-005, REQ-008/AC-008, REQ-029/AC-029, REQ-030/AC-030, REQ-031/AC-031, REQ-033/AC-033, REQ-034/AC-034, REQ-061/AC-061, REQ-062/AC-062, REQ-064/AC-064, REQ-098/AC-098, REQ-099/AC-099, REQ-100/AC-100, REQ-101/AC-101] — I1:** Criar categorias iniciais e regras de tipo/unicidade. **Dependência / prova:** T003; testes de primeiro uso e invariantes.

- [ ] **T007 [REQ-001/AC-001, REQ-002/AC-002, REQ-003/AC-003, REQ-007/AC-007, REQ-011/AC-011, REQ-012/AC-012, REQ-057/AC-057, REQ-058/AC-058, REQ-059/AC-059, REQ-060/AC-060, REQ-071/AC-071, REQ-073/AC-073, REQ-096/AC-096, REQ-097/AC-097, REQ-103/AC-103, REQ-104/AC-104, REQ-123/AC-123, REQ-124/AC-124, REQ-125/AC-125, REQ-126/AC-126, REQ-127/AC-127, REQ-128/AC-128] — I2:** Cadastrar e editar lançamentos avulsos com formulários, foco e validações. **Dependência / prova:** T003-T006; fluxo Android offline e reinício.

- [ ] **T008 [REQ-007/AC-007, REQ-012/AC-012, REQ-072/AC-072, REQ-105/AC-105, REQ-106/AC-106, REQ-107/AC-107, REQ-118/AC-118] — I2:** Excluir avulsos e desfazer individualmente por 5 segundos. **Dependência / prova:** T007; testes de cancelamento, desfazer e reinício.

- [ ] **T009 [REQ-005/AC-005, REQ-008/AC-008, REQ-030/AC-030, REQ-031/AC-031, REQ-032/AC-032, REQ-033/AC-033, REQ-034/AC-034, REQ-061/AC-061, REQ-062/AC-062, REQ-064/AC-064, REQ-098/AC-098, REQ-099/AC-099, REQ-100/AC-100, REQ-101/AC-101, REQ-119/AC-119, REQ-120/AC-120, REQ-121/AC-121, REQ-122/AC-122, REQ-123/AC-123] — I2:** Gerenciar categorias com transferência atômica e confirmação. **Dependência / prova:** T003/T006/T007; falha simulada e rollback.

- [ ] **T010 [REQ-013/AC-013, REQ-014/AC-014, REQ-015/AC-015, REQ-016/AC-016, REQ-017/AC-017, REQ-018/AC-018, REQ-019/AC-019, REQ-020/AC-020, REQ-021/AC-021, REQ-022/AC-022, REQ-023/AC-023, REQ-044/AC-044, REQ-045/AC-045, REQ-050/AC-050] — I3:** Gerar recorrências finitas com edição/exclusão integral. **Dependência / prova:** T003-T009; X=1, X=12, unicidade e meses passados.

- [ ] **T011 [REQ-024/AC-024, REQ-025/AC-025, REQ-026/AC-026, REQ-027/AC-027, REQ-028/AC-028, REQ-046/AC-046, REQ-047/AC-047, REQ-048/AC-048, REQ-049/AC-049, REQ-050/AC-050, REQ-054/AC-054, REQ-055/AC-055, REQ-056/AC-056, REQ-077/AC-077] — I3:** Implementar parcelamentos finitos e ajuste exato da última parcela. **Dependência / prova:** T003-T010; testes de centavos e integridade.

- [ ] **T012 [REQ-013/AC-013, REQ-014/AC-014, REQ-015/AC-015, REQ-016/AC-016, REQ-017/AC-017, REQ-018/AC-018, REQ-019/AC-019, REQ-020/AC-020, REQ-021/AC-021, REQ-022/AC-022, REQ-023/AC-023, REQ-042/AC-042, REQ-043/AC-043, REQ-045/AC-045, REQ-078/AC-078] — I4:** Calcular recorrências indefinidas com exceções sem gravar ao consultar. **Dependência / prova:** T003-T011; bloqueia até definir precedência de exceções.

- [ ] **T013 [REQ-016/AC-016, REQ-017/AC-017, REQ-018/AC-018, REQ-019/AC-019, REQ-021/AC-021, REQ-022/AC-022, REQ-042/AC-042, REQ-043/AC-043, REQ-050/AC-050, REQ-105/AC-105, REQ-106/AC-106, REQ-107/AC-107, REQ-118/AC-118] — I4:** Editar/excluir ocorrências indefinidas e desfazer operações de série. **Dependência / prova:** T012; testes de segmentos/exceções e histórico.

- [ ] **T014 [REQ-003/AC-003, REQ-038/AC-038, REQ-039/AC-039, REQ-040/AC-040, REQ-041/AC-041, REQ-065/AC-065, REQ-066/AC-066, REQ-067/AC-067, REQ-068/AC-068, REQ-069/AC-069, REQ-075/AC-075, REQ-076/AC-076, REQ-077/AC-077, REQ-078/AC-078, REQ-079/AC-079, REQ-080/AC-080, REQ-081/AC-081, REQ-082/AC-082, REQ-083/AC-083, REQ-102/AC-102, REQ-108/AC-108, REQ-109/AC-109, REQ-110/AC-110, REQ-113/AC-113, REQ-117/AC-117, REQ-129/AC-129] — I5:** Construir Histórico: pesquisa, filtros, ordenação, agrupamento e detalhes. **Dependência / prova:** T007-T013; testes de filtros/meses e Android.

- [ ] **T015 [REQ-004/AC-004, REQ-005/AC-005, REQ-010/AC-010, REQ-035/AC-035, REQ-036/AC-036, REQ-037/AC-037, REQ-051/AC-051, REQ-052/AC-052, REQ-053/AC-053, REQ-068/AC-068, REQ-069/AC-069, REQ-070/AC-070, REQ-074/AC-074, REQ-084/AC-084, REQ-085/AC-085, REQ-086/AC-086, REQ-087/AC-087, REQ-088/AC-088, REQ-089/AC-089, REQ-090/AC-090, REQ-091/AC-091, REQ-111/AC-111, REQ-112/AC-112, REQ-115/AC-115, REQ-116/AC-116, REQ-130/AC-130] — I5:** Construir Dashboard: totais, gráficos, evolução, estados vazios. **Dependência / prova:** T007-T014; testes financeiros e previstos.

- [ ] **T016 [REQ-057/AC-057, REQ-058/AC-058, REQ-059/AC-059, REQ-068/AC-068, REQ-069/AC-069, REQ-092/AC-092, REQ-093/AC-093, REQ-094/AC-094, REQ-095/AC-095, REQ-096/AC-096, REQ-097/AC-097, REQ-103/AC-103, REQ-104/AC-104, REQ-108/AC-108, REQ-109/AC-109, REQ-110/AC-110, REQ-111/AC-111, REQ-112/AC-112, REQ-113/AC-113, REQ-114/AC-114, REQ-115/AC-115, REQ-116/AC-116, REQ-117/AC-117, REQ-127/AC-127, REQ-128/AC-128] — I5-I6:** Concluir navegação, botão +, estado por sessão e proteção de formulários. **Dependência / prova:** T001/T007/T014/T015; botão Voltar e reinício Android.

- [ ] **T017 [REQ-011/AC-011, REQ-060/AC-060, REQ-063/AC-063, REQ-070/AC-070, REQ-074/AC-074, REQ-082/AC-082, REQ-083/AC-083, REQ-091/AC-091, REQ-092/AC-092, REQ-096/AC-096, REQ-097/AC-097, REQ-104/AC-104, REQ-129/AC-129, REQ-130/AC-130] — I6:** Aplicar temas, acessibilidade, feedback e mensagens de erro. **Dependência / prova:** T014-T016; checagem visual e offline.

- [ ] **T018 [REQ-001/AC-001, REQ-002/AC-002, REQ-003/AC-003, REQ-004/AC-004, REQ-005/AC-005, REQ-006/AC-006, REQ-007/AC-007, REQ-008/AC-008, REQ-009/AC-009, REQ-010/AC-010, REQ-011/AC-011, REQ-012/AC-012, REQ-013/AC-013, REQ-014/AC-014, REQ-015/AC-015, REQ-016/AC-016, REQ-017/AC-017, REQ-018/AC-018, REQ-019/AC-019, REQ-020/AC-020, REQ-021/AC-021, REQ-022/AC-022, REQ-023/AC-023, REQ-024/AC-024, REQ-025/AC-025, REQ-026/AC-026, REQ-027/AC-027, REQ-028/AC-028, REQ-029/AC-029, REQ-030/AC-030, REQ-031/AC-031, REQ-032/AC-032, REQ-033/AC-033, REQ-034/AC-034, REQ-035/AC-035, REQ-036/AC-036, REQ-037/AC-037, REQ-038/AC-038, REQ-039/AC-039, REQ-040/AC-040, REQ-041/AC-041, REQ-042/AC-042, REQ-043/AC-043, REQ-044/AC-044, REQ-045/AC-045, REQ-046/AC-046, REQ-047/AC-047, REQ-048/AC-048, REQ-049/AC-049, REQ-050/AC-050, REQ-051/AC-051, REQ-052/AC-052, REQ-053/AC-053, REQ-054/AC-054, REQ-055/AC-055, REQ-056/AC-056, REQ-057/AC-057, REQ-058/AC-058, REQ-059/AC-059, REQ-060/AC-060, REQ-061/AC-061, REQ-062/AC-062, REQ-063/AC-063, REQ-064/AC-064, REQ-065/AC-065, REQ-066/AC-066, REQ-067/AC-067, REQ-068/AC-068, REQ-069/AC-069, REQ-070/AC-070, REQ-071/AC-071, REQ-072/AC-072, REQ-073/AC-073, REQ-074/AC-074, REQ-075/AC-075, REQ-076/AC-076, REQ-077/AC-077, REQ-078/AC-078, REQ-079/AC-079, REQ-080/AC-080, REQ-081/AC-081, REQ-082/AC-082, REQ-083/AC-083, REQ-084/AC-084, REQ-085/AC-085, REQ-086/AC-086, REQ-087/AC-087, REQ-088/AC-088, REQ-089/AC-089, REQ-090/AC-090, REQ-091/AC-091, REQ-092/AC-092, REQ-093/AC-093, REQ-094/AC-094, REQ-095/AC-095, REQ-096/AC-096, REQ-097/AC-097, REQ-098/AC-098, REQ-099/AC-099, REQ-100/AC-100, REQ-101/AC-101, REQ-102/AC-102, REQ-103/AC-103, REQ-104/AC-104, REQ-105/AC-105, REQ-106/AC-106, REQ-107/AC-107, REQ-108/AC-108, REQ-109/AC-109, REQ-110/AC-110, REQ-111/AC-111, REQ-112/AC-112, REQ-113/AC-113, REQ-114/AC-114, REQ-115/AC-115, REQ-116/AC-116, REQ-117/AC-117, REQ-118/AC-118, REQ-119/AC-119, REQ-120/AC-120, REQ-121/AC-121, REQ-122/AC-122, REQ-123/AC-123, REQ-124/AC-124, REQ-125/AC-125, REQ-126/AC-126, REQ-127/AC-127, REQ-128/AC-128, REQ-129/AC-129, REQ-130/AC-130] — I6:** Executar regressão unitária, SQLite real, Android e relatório de aceite. **Dependência / prova:** T001-T017; relatórios de testes e lacunas.

## Gates de validação

- **I0:** verificar a árvore do repositório, não sobrescrever código existente, validar Expo, TypeScript, router, Android e ambiente de testes.
- **I1:** migrations em banco vazio e preenchido, falhas/rollback, centavos e datas testados com SQLite real.
- **I2:** cadastros, edição, categorias e exclusões funcionais offline, persistência após reinício e rollback em falhas.
- **I3:** parcelas e séries finitas geradas exatamente uma vez, com centavos exatos e edição/exclusão integrais.
- **I4:** definir a precedência de exceções versus edições futuras antes de implementar; validar recorrências indefinidas e consultas sem gravação.
- **I5:** histórico, dashboard, navegação e indicadores coerentes com dados, mês selecionado e filtros.
- **I6:** regressão automatizada e validação Android com evidências, sem declarar validado o que não foi executado.

## Riscos e pré-condições

1. Plano integrado e as tarefas foram aprovados para iniciar I0 em 2026-11-05; o modelo de dados continua sujeito a verificações técnicas de SQL, migrações e integridade antes de I1.
2. T012-T013 exigem antes a política de precedência entre exceções pontuais e alterações a partir de uma ocorrência.
3. Validar compatibilidade de versões Expo, expo-sqlite, Expo Router e Jest na execução do I0, sem presumir APIs não testadas.
4. Nunca rodar migrações ou testes destrutivos no banco do usuário; sem backup ou exportação na primeira versão, risco de perda persiste.
5. A árvore completa foi inspecionada antes do primeiro commit de código; não havia aplicativo preexistente e nenhum documento foi sobrescrito.

## Rastreabilidade

Cada REQ/AC-001 a 130 está referenciado em tarefa funcional T001-T017, quando aplicável, e no teste transversal T018. A nova análise deverá verificar a cobertura e a pertinência das tarefas antes de aprovação.

## Registro parcial de execução I0 — 2026-11-05

- **T001 [EM ANDAMENTO]:** árvore completa do repositório inspecionada; scaffold Expo SDK 57 + TypeScript, Expo Router, quatro abas e botão central `+` implementados com telas marcadas como placeholders. TypeScript e exportação do bundle Android passaram no GitHub Actions. **Falta:** validar navegação no aplicativo aberto em Android real/emulador.
- **T002 [EM ANDAMENTO]:** Jest configurado com teste smoke executado com sucesso no GitHub Actions. **Falta:** ambiente de integração com SQLite real isolado e verificações correspondentes antes de I1.
- **Evidência:** GitHub Actions run [42090836655](https://github.com/matheusdebrito/app-gastos/actions/runs/42090836655), concluída com sucesso: `npm install`, `npm run typecheck`, `npm test -- --watch=false` e exportação do bundle Android.
- **Limitações:** não houve execução Android ou SQLite; não marcar T001/T002 como `[x]` até cumprir critérios completos. Nenhum dado do usuário foi acessado.

## Registro de implementação parcial — 2026-11-09/10

**Autorização adicional:** o responsável solicitou desenvolver o aplicativo até o fim. Foram adiantadas entregas funcionais de múltiplos incrementos, **sem declarar gates encerrados** onde ainda não houve validação Android. Este registro não equivale a aceite final nem aprova pendências I4.

- **T001/T002 (parcial):** estrutura Expo SDK 58, Expo Router, Jest e CI; testes de esquema SQLite real isolado em Python, mas sem teste do runtime `expo-sqlite` no Android.
- **T003/T006 (parcial):** migração inicial, tabelas SQLite, categorias predefinidas, chaves estrangeiras, transações de reclassificação; falta verificar no aparelho e expansão de casos de falha.
- **T004/T005 (código e testes unitários executados):** centavos inteiros, validação de limites, ajuste de parcelas, datas e últimos dias do mês. Ainda não classificados como concluídos por dependências de validação integrada.
- **T007/T008/T009 (código implementado, validação Android pendente):** formulários, tipos, categorias, duplicidade, exclusões e desfazer de 5 segundos.
- **T010/T011 (código implementado, validação Android pendente):** séries finitas e parcelamentos, com atualização/exclusão integral transacional.
- **T012/T013 (parcial e bloqueado):** recorrências indefinidas calculadas, exceções pontuais e desfazer; **não implementadas** alterações/exclusões “esta e próximas” por falta da decisão de precedência. Data de ocorrência virtual não pode ser alterada.
- **T014/T015/T016/T017 (código implementado parcialmente, validação Android pendente):** Histórico, Dashboard, navegação, tema, feedback e ajustes de UI. Gráficos simplificados, limite operacional de 240 meses e revisão de UX e 130 ACs pendentes.
- **T018 (não concluída):** apenas testes unitários, do esquema real SQLite isolado e exportação de bundle; sem testes no dispositivo, migrações no SQLite nativo ou suíte de aceitação integral.

**Rastreamento:** GitHub Actions `checks.yml` verifica instalação, TypeScript, Jest, constraints/rollback no SQLite em memória e exportação do bundle Android. Para declarar cada T concluída, executar testes de aceitação e registrar evidências reais. Todas as caixas permanecem abertas por prudência.
