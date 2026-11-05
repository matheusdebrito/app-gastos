# App Gastos

Aplicativo financeiro **pessoal para Android**, offline e sem backend. Desenvolvimento orientado pelas especificações em `specs/001-controle-financeiro-pessoal/`.

## Estado atual

**Incremento I0 — estrutura inicial versionada, não validada em Android.** As telas são marcadores visuais; não cadastram nem armazenam movimentações. Não utilizar com dados reais.

## Tecnologia

- Expo SDK 57 + React Native + TypeScript (referência ao template oficial SDK 57, adequado ao Expo Go durante transição para SDK 58)
- Expo Router (quatro abas e ação central de novo lançamento)
- Persistência aprovada para I1: SQLite via `expo-sqlite`
- Testes: Jest; integrações SQLite reais isoladas previstas para I1

## Como verificar localmente

Pré-requisitos: Node.js LTS, npm e ambiente Android ou Expo Go compatível.

```bash
npm install
npm run typecheck
npm test -- --watch=false
npm run android
```

O `npm install` cria o lockfile. Antes da implementação de persistência no incremento I1, instalar a versão compatível com o SDK ativo usando `npx expo install expo-sqlite`.

**Limitação da execução inicial:** o ambiente de preparação não alcançou `registry.npmjs.org` (erro de DNS `EAI_AGAIN`), portanto as dependências, o typecheck, Jest e a execução Android **não foram verificados**. Não declarar T001/T002 completos até essa validação.

## Organização

- `app/`: rotas e telas Expo Router.
- `src/components/`: componentes visuais sem regra de domínio.
- `__tests__/`: testes Jest de preparação.
- `specs/`: especificação, arquitetura, modelo de dados, tarefas e análises.

A precedência de exceções versus alterações futuras de recorrências indefinidas permanece pendente e bloqueia I4, não I0.
