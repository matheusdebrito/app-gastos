# App Gastos — Constitution

> Status: PROPOSTA — aguardando aprovação do responsável pelo projeto.
> Este documento define princípios de engenharia, não a lista detalhada de funcionalidades.

## Contexto e limites do produto

O App Gastos é um aplicativo **pessoal para Android**, voltado ao registro e à consulta de receitas, despesas, categorias e evolução das finanças do usuário. Será desenvolvido com **React Native e TypeScript** e utilizará **persistência local no aparelho**. É um projeto para uso próprio, sem plano de distribuição comercial ou publicação em lojas de aplicativos.

Decisões confirmadas:
- Android como plataforma-alvo inicial.
- Sem conta, login, backend ou dependência de serviço remoto para o uso cotidiano.
- Os registros financeiros devem continuar disponíveis após fechar ou reiniciar o aplicativo.
- Simplicidade de uso e manutenção acima de recursos voltados a múltiplos usuários.

Decisões reservadas para a etapa de planejamento: Expo versus configuração nativa; biblioteca de persistência local (SQLite é candidata); estratégia de backup, restauração, exportação e eventual proteção de acesso local.

## Princípios fundamentais

### I. Simplicidade orientada à necessidade (OBRIGATÓRIO)

Cada funcionalidade DEVE atender a um problema concreto do uso diário. A implementação DEVE privilegiar a solução mais simples que preserve clareza, integridade dos dados e capacidade de manutenção. NÃO criar backend, autenticação, sincronização na nuvem, serviços distribuídos, gerenciamento de usuários ou abstrações genéricas sem nova decisão expressa e justificada. Recursos especulativos permanecem fora do escopo.

### II. Integridade dos dados financeiros (OBRIGATÓRIO)

Valores monetários DEVEM ser armazenados e calculados em unidades inteiras da menor denominação (por exemplo, centavos de real) ou em representação decimal exata, nunca em ponto flutuante binário para apurações. Regras de sinal, datas, fuso, categorias, edição e exclusão DEVEM ser explícitas e testadas. A interface NÃO DEVE apresentar totais inconsistentes com os lançamentos persistidos. Operações de escrita relacionadas DEVEM ser atômicas sempre que o armazenamento oferecer transações.

### III. Offline primeiro e controle dos dados (OBRIGATÓRIO)

O aplicativo DEVE funcionar sem internet nas operações essenciais de registro e consulta. Dados pessoais e financeiros DEVEM permanecer no dispositivo, salvo exportação ou backup iniciados conscientemente pelo usuário. NÃO incluir telemetria, analytics, publicidade, rastreadores ou envio externo de dados financeiros por padrão. Persistência DEVE sobreviver ao encerramento e reinício normais do aplicativo. Desinstalação, troca ou perda do dispositivo exigem uma estratégia específica de recuperação a ser decidida no planejamento, sem prometer preservação automática.

### IV. Interface mobile direta e acessível (OBRIGATÓRIO)

Registrar uma receita ou despesa DEVE exigir o mínimo razoável de passos. Informações de saldo, entradas, saídas e despesas por categoria DEVEM ter apresentação inequívoca, especialmente em telas pequenas. Formulários DEVEM ter mensagens de validação compreensíveis, estados vazios e feedback de sucesso/erro. A navegação DEVE funcionar por toque, sem depender de conexão ou recursos externos.

### V. Código claro e responsabilidade separada (OBRIGATÓRIO)

Adotar React Native com TypeScript e checagem estrita quando suportada. Separar componentes de interface, regras de negócio e acesso à persistência; não acoplar cálculos financeiros a telas ou consultas de banco. Preferir módulos pequenos, nomes descritivos e dependências justificadas. NÃO introduzir camadas, padrões ou bibliotecas complexas sem benefício verificável. A implementação DEVE permitir mudanças futuras sem reescrita desnecessária.

### VI. Testes proporcionais ao risco (OBRIGATÓRIO)

Toda regra de cálculo financeiro, agregação mensal, atribuição por categoria e alteração de lançamentos DEVE possuir testes automatizados. Persistência e migrações DEVEM ser verificadas com testes de integração adequados. Fluxos essenciais DEVEM ser validados em Android, incluindo uso offline, reinício do aplicativo, estados vazios, dados inválidos e edição/exclusão. Testes DEVEM ser determinísticos; não enfraquecer verificações apenas para obter aprovação.

### VII. Mudanças seguras e verificáveis (OBRIGATÓRIO)

Mudanças de esquema de dados DEVEM preservar registros existentes ou explicitar riscos e procedimento de recuperação. Alterações destrutivas de dados, migrações, decisões arquiteturais e novas dependências com custos ou exposição de dados EXIGEM aprovação prévia. Não apagar dados reais para corrigir defeitos sem autorização. Antes de declarar uma funcionalidade concluída, demonstrar evidências de execução dos testes e da validação adequada; quando não houver ambiente Android disponível, registrar explicitamente o que não foi testado.

### VIII. Especificação antes de implementação, sem burocracia excessiva (OBRIGATÓRIO)

Para funcionalidades relevantes, seguir: Constitution → Specify → Clarify (quando necessário) → Plan → Tasks → Analyze → Implement → Verify. Requisitos DEVEM ter identificadores estáveis `REQ-001`, critérios `AC-001` e tarefas `T001`, com rastreabilidade conforme aplicável. Para correções pequenas, é permitido reproduzir → corrigir → testar → documentar. A fase de especificação define **o que** o produto faz; a de planejamento, **como** será construído. Não codificar funcionalidades relevantes antes da aprovação dos respectivos requisitos e decisões críticas.

## Restrições e critérios de decisão

- **Plataforma:** Android inicial; não ampliar para iOS sem nova decisão.
- **Tecnologia confirmada:** React Native + TypeScript.
- **Dados:** local-first; persistência e política de backup serão definidas no plano.
- **Infraestrutura:** sem servidor, conta, login ou serviços pagos necessários ao funcionamento básico.
- **Moeda e regras de período:** especificar antes da implementação; não presumir suporte multimoeda ou comportamento de lançamentos recorrentes.
- **Privacidade:** aplicar princípio de minimização de permissões e dependências; qualquer exportação deve ser ação intencional.
- **Trade-offs:** preferir confiabilidade e clareza a funcionalidades extras, micro-otimizações ou arquiteturas prematuras.

## Governança e fluxo de revisão

1. Esta Constitution orienta especificações, planos, tarefas, implementação e revisão.
2. Toda exceção a princípio obrigatório requer justificativa, impacto, alternativa considerada e aprovação documentada.
3. Novos requisitos ou mudanças importantes devem ser classificados como `ABERTO`, `ASSUMIDO` ou `VALIDADO`; premissas não equivalem a decisões aprovadas.
4. Antes de cada entrega, conferir aderência a esta Constitution, critérios de aceitação e evidências de testes.
5. Alterações neste documento requerem histórico de mudança, justificativa e revisão de artefatos afetados.
6. Até aprovação explícita do responsável, esta versão é **proposta**, não ratificada.

**Versão:** 0.1.0 (proposta) | **Ratificação:** pendente | **Última revisão:** 2026-11-02
