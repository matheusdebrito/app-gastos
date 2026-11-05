# Plano técnico — App Gastos

**Data:** 2026-11-05  
**Status:** PLANO INTEGRADO E BACKLOG APROVADOS em 2026-11-05 — início de I0 autorizado; validação da implementação pendente  
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

### DEC-TECH-009 — Navegação mobile [APROVADO em 2026-11-05]

**Escolha:** Expo Router para a navegação do aplicativo Expo + React Native + TypeScript.

**Justificativa:** integração com Expo e organização das rotas por arquivos com menos configuração manual, mantendo separação entre as telas principais e os formulários.

**Alternativa rejeitada:** configurar React Navigation diretamente; exige manutenção adicional da árvore de navegadores para um aplicativo de escopo simples, sem vantagem concreta identificada.

**Contrato técnico:**
1. Quatro abas principais: Dashboard, Histórico, Categorias e Configurações. A ação `+` central abre a escolha de novo lançamento sem se transformar em uma quinta seção persistente.
2. Telas de criar e editar lançamentos, recorrências, parcelas e categorias devem permitir voltar à tela de origem, preservando a seleção de período e filtros exigida pelos requisitos.
3. O estado de navegação do Dashboard e Histórico permanece durante trocas de aba na sessão ativa; ao iniciar nova sessão, abrir o Dashboard no mês atual, com Histórico inicialmente no mês atual e sem filtros.
4. A ação Voltar do Android em outras abas principais retorna ao Dashboard; no Dashboard, seguir o comportamento padrão do Android. Formulários com mudanças não salvas exigem confirmação antes de sair, inclusive quando a saída vem do gesto/botão Voltar.
5. Novo lançamento recebe foco no valor e abre teclado numérico automaticamente; edição abre sem teclado. A navegação não pode bloquear ou perder a validação de formulários.
6. Evitar que o roteamento crie ou duplique lançamentos; ações de gravação são orquestradas por casos de uso, e a navegação ocorre somente após confirmação de sucesso.
7. Validar em Android as mudanças de abas, retorno a formulários, gestos e back stack; bibliotecas nativas subjacentes devem ser verificadas quanto à compatibilidade com a versão do Expo escolhida.

**Rastreabilidade:** REQ/AC-057 a 059, 093 a 097, 103, 108 a 115, 124 a 129 e regras de acesso às categorias.

### DEC-TECH-010 — Estratégia de testes automatizados [APROVADO em 2026-11-05]

**Escolha:** testes unitários com Jest, testes de integração exercitando SQLite **real** em ambiente de teste isolado e validação dos fluxos críticos no Android (emulador ou aparelho).

**Justificativa:** cálculos monetários, recorrências, migrações, operações atômicas e reinícios apresentam risco real de perda ou inconsistência de dados. Testes manuais, isoladamente, não cobrem adequadamente regressões de domínio e persistência.

**Alternativa rejeitada:** priorizar apenas verificações manuais de interface e alguns testes unitários, deixando integrações sem cobertura; isso contraria o princípio VI da Constitution.

**Contrato de testes:**
1. **Unidade/Jest:** centavos e faixa numérica, divisão e ajuste da última parcela, calendário incluindo ano bissexto/dias inexistentes, resultado mensal, variação, filtros, estados vazios e transformação de séries.
2. **Integração com SQLite real:** executar SQL, constraints, índices e migrações em um banco isolado e descartável, nunca no banco real do usuário ou de produção; testar gravação/leitura, rollback, falhas de migração, exclusão/reclassificação de categorias, consistência de séries e reabertura.
3. **Compatibilidade:** o mecanismo de testes precisa executar sem substituir o comportamento relevante do SQLite por mocks. Se testes Node usarem driver diferente do `expo-sqlite`, manter também testes no runtime Android/Expo para verificar discrepâncias.
4. **Fluxos Android:** abrir/fechar app, operação offline, cadastro e edição, teclado e foco, navegação e Voltar, desfazer com cinco segundos, alternância de abas, meses futuros e tema. Registrar evidências de testes executados e lacunas; automatizar UI onde viável, sem assumir que já existe infraestrutura E2E.
5. **Proteção:** não executar migrações, exclusões ou testes destrutivos contra dados reais; não reduzir asserções só para passar CI.
6. **Critérios de liberação:** unidades e integrações críticas passando; qualquer etapa Android não executada deve ser reportada explicitamente, nunca considerada validada por inferência.

**Rastreabilidade:** Constitution II, III, VI e VII; REQ/AC-009, 015, 023, 025, 026, 031, 032, 042 a 056, 093 a 107, 118, 124 a 130.

### DEC-TECH-011 — Desenvolvimento incremental e validação por etapa [APROVADO em 2026-11-05]

**Escolha:** desenvolver por incrementos verificáveis com testes e validação antes de avançar. Não implementar todos os módulos para só então conferir a integração.

**Justificativa:** erros estruturais em persistência, precisão monetária ou recorrências precisam ser detectados antes que outras funcionalidades dependam deles.

**Alternativa rejeitada:** implementar os módulos em sequência e deixar a validação integrada exclusivamente para o final. Aumento de risco de retrabalho e de propagação de defeitos.

**Critério de passagem:** para cada incremento, implementar o escopo selecionado, executar testes unitários e de integração pertinentes, validar o comportamento possível em Android, registrar resultados e lacunas e corrigir falhas críticas antes de iniciar a etapa seguinte. Sem execução dos testes, o incremento permanece pendente, não aprovado.

## Plano de execução incremental proposto

| Incremento | Entrega funcional | Dependência | Evidência mínima |
|---|---|---|---|
| I0 — Preparação | Inspecionar árvore e código existente, configurar Expo/TypeScript/Expo Router, Jest e ambiente de validação Android | Aprovação do plano | Projeto inicializa, checagens básicas passam |
| I1 — Fundação financeira | SQLite, migrações, repositórios, categorias iniciais, cálculos inteiros, contrato de datas e transações | I0 | Testes reais de banco, falha de migração, centavos e calendário |
| I2 — Movimentações avulsas | Novo lançamento, edição/exclusão, categorias, avisos de formulário e atualização dos totais | I1 | Fluxos de ponta a ponta no Android, dados sobrevivem a reinício/offline |
| I3 — Séries finitas | Recorrências de X meses, parcelas, datas irregulares, edição/exclusão integral | I2 | Testes de precisão, integridade, posições únicas e rollback |
| I4 — Recorrências indefinidas | Regra por mês, exceções pontuais, mudanças futuras, interrupções, desfazer | I3 | Testes de precedência, efeitos entre meses, consultas repetidas sem duplicação |
| I5 — Histórico e Dashboard | Filtros, pesquisa, ordenação, períodos, gráficos, indicadores e estados previstos | I4 | Casos de mês vazio, mudança de período, sessões e gráficos coerentes |
| I6 — Qualidade final | Temas, acessibilidade, ajustes de UX, regressão, validação Android e documentação de uso | I5 | Suites aprovadas, checagem offline/reinício e relatório das lacunas |

**Nota de dependências:** tarefas internas podem ser paralelizáveis apenas se não compartilharem migrations, dados ou contratos ainda instáveis. A ordem é referência de coordenação; não libera implementação sem aprovação do plano/tarefas.

## Detalhamento técnico para revisão antes de codificar

- **Integridade de SQLite:** ativar e verificar chaves estrangeiras; transações para escrever séries finitas, alterações de regras, transferências de categoria e desfazer; consultas parametrizadas. Migrations devem verificar versão, executar em ordem e recusar uso com esquema parcialmente migrado.
- **Modelo de dados:** seguir as entidades propostas em `data-model.md`: categorias, entradas avulsas/ocorrências finitas, séries, mudanças de regra e exceções. Refinar CHECK, UNIQUE e FK no SQL de migrations, incluindo prevenção de categorias de tipo incompatível e ocorrências duplicadas.
- **Recorrências indefinidas:** derivar a ocorrência por posição mensal, aplicar alterações de segmento e exceções, somente na janela solicitada. Definir **antes de implementar I4** a precedência entre exceções existentes e edições futuras. Proposta sujeita a teste/revisão: exceção pontual preservada quando uma edição posterior é criada, salvo quando o usuário altera deliberadamente aquele mesmo mês; não presumir aprovação desta política.
- **Exclusão e desfazer:** as exclusões são confirmadas e efetivas. Reverter transacionalmente se o usuário acionar Desfazer em até 5 segundos, sem recuperar prazo após reinício; múltiplos desfazeres independentes. Não incluir desfazer categorias.
- **Saldos e agregação:** centavos como inteiros no armazenamento; evitar operação financeira em número de ponto flutuante. Validar valores e **totais de agregação**, inclusive casos em que a soma excede limites de conversão segura. Na dúvida, rejeitar operação com mensagem e sem gravação parcial.
- **Datas:** usar data local de calendário, com formato validado; preservar dia original em séries mensais, ajustar mês curto e retornar ao dia normal no próximo mês válido.
- **Limite operacional:** escolher faixas técnicas verificáveis para quantidades de parcelas e janelas de gráficos com tratamento de entradas excessivas e renderização incremental, nunca um teto financeiro de negócio. Medir desempenho em histórico volumoso.
- **Testes:** Jest nas regras de domínio; integração com banco SQLite real isolado em cada etapa de persistência, acrescida de testes de compatibilidade do driver no ambiente Expo; fluxos Android nos marcos que envolvem UI.
- **Migração e recuperação:** bancos SQLite locais podem falhar durante atualização ou ficar incompatíveis com esquema novo. Registrar versão, executar alterações compatíveis e abortar com erro visível em falha; qualquer migração destrutiva requer revisão específica. **Backup/exportação do produto continuam fora do escopo**, com risco de perda aceito.
- **Privacidade:** não usar bibliotecas de telemetria nem enviar registros financeiros a servidores; logs de depuração não devem expor informações financeiras reais.

## Critérios de prontidão para implementação

1. **APROVADO em 2026-11-05:** plano integrado e backlog de 18 tarefas aprovados para execução incremental; `data-model.md` é base de trabalho, sujeita a revisão de contratos e migrations não destrutivas.
2. Revisar tarefas `tasks.md` e rastreabilidade REQ/AC; nenhum requisito crítico pode ficar sem teste ou tarefa.
3. Inspecionar a árvore completa do repositório para impedir sobrescrita de código preexistente.
4. Validar versões compatíveis de SDK Expo, `expo-sqlite`, Expo Router e bibliotecas de teste em documentação oficial no início de I0 (sem fixar versões potencialmente desatualizadas neste documento).
5. Confirmar que não serão executadas migrations contra dados reais durante testes.
6. Antes da fase I4, fechar e testar a política de precedência entre alterações de segmentos e exceções de recorrências indefinidas.

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

- **DEC-TECH-011 aprovada:** desenvolvimento incremental e testes por etapa.
- **Plano integrado e modelo de dados:** documentos prontos para **revisão e aprovação**, não aprovados automaticamente pela decisão de desenvolver incrementalmente.
- **Próximo passo:** preparar `tasks.md`, verificar rastreabilidade e corrigir achados importantes antes de liberar I0.
- **Bloqueio específico para I4:** precedência de exceção versus alteração futura não é decisão aprovada.
- **Implementação:** ainda não iniciada nem autorizada por este documento.

## Registro de autorização e execução — 2026-11-05

- **Autorização explícita do responsável:** plano técnico integrado e 18 tarefas aprovados; iniciar I0 de implementação; pendência de precedência das exceções preservada antes de I4.
- **Repositório inspecionado:** árvore completa de `master` via API GitHub, sem código de aplicativo preexistente; apenas diretórios de Spec Kit e especificação antes do primeiro commit de código. Nenhum arquivo existente foi removido.
- **Código I0 versionado:** configuração Expo SDK 57/TypeScript/Expo Router, quatro rotas de abas e ação central de novo lançamento, telas claramente identificadas como marcadores, Jest smoke e README de execução.
- **Fonte de versões:** template oficial do Expo SDK 57 consultado para versões principais, ainda sujeito à checagem de compatibilidade na instalação local.
- **Validação não concluída:** tentativa de consultar o registro npm no ambiente de preparação falhou por DNS `EAI_AGAIN`. Portanto instalação, `tsc`, Jest, Metro e execução Android **NÃO VERIFICADOS**. T001 e T002 permanecem abertas até execução real.
- **Sem alterações em dados reais ou migrações:** nenhuma persistência implementada na I0.
