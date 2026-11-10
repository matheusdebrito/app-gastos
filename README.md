# App Gastos

Aplicativo Android pessoal de controle de despesas e receitas, com dados locais e funcionamento offline. Implementado em **Expo SDK 58**, React Native, TypeScript, Expo Router e SQLite (`expo-sqlite`).

## Como executar no Android

Requer Node.js 22 e aplicativo Expo Go compatível com SDK 58.

```bash
npm install
npx expo-doctor
npm run typecheck
npm test -- --watch=false
npx expo start --clear
```

Com o Android na mesma rede Wi-Fi do computador, leia o QR Code no Expo Go. Se a rede impedir conexão, teste `npx expo start --tunnel`.

## O que já foi implementado

- Quatro abas: Dashboard, Histórico, Categorias e Configurações; botão central de novo lançamento.
- Banco SQLite local com migração inicial, chaves estrangeiras, restrições, transações e categorias padrão.
- Cadastro e edição de receitas e despesas avulsas com valores em centavos, data, descrição opcional e categorias; aviso de possível duplicidade.
- Compras parceladas com distribuição exata do total em centavos e resíduo na última parcela.
- Recorrências finitas persistidas e recorrências indefinidas calculadas por mês sem gravações em simples consultas.
- Edição/exclusão de séries finitas como um todo; exceções pontuais de recorrências indefinidas (valor, categoria e descrição), exclusão pontual e desfazer.
- Exclusões com confirmação e opção de desfazer por 5 segundos em cada operação, sem restauro da opção após reinício.
- Histórico por mês com pesquisa, filtros, ordenação, cabeçalho de dia, detalhes e indicação de lançamentos futuros.
- Dashboard mensal com receitas, despesas, resultado, distribuições por categoria, evolução simplificada, comparação com mês anterior e identificação de período futuro.
- Categorias com criação, renomeação, exclusão confirmada e transferência atômica de vínculos.
- Tema automático/claro/escuro persistido localmente.

## Limitações e pendências conhecidas

**O aplicativo ainda não está integralmente concluído nem certificado para guardar dados financeiros reais.**

1. **Recorrência indefinida — 'esta e próximas':** edição/exclusão de uma ocorrência e todas as seguintes dependem da decisão previamente reservada ao I4 sobre precedência de exceções e alterações. Não foram habilitadas. A alteração pontual não muda a data da ocorrência.
2. **Testes em aparelho:** o CI executa TypeScript, Jest, SQL em SQLite real isolado (esquema e transações) e exporta o bundle Android, mas a instalação e navegação em Android real ainda exigem validação.
3. **Cobertura de integração:** o teste SQL com o driver SQLite da máquina não substitui testes transacionais da API nativa `expo-sqlite` no Android, nem o teste completo de migrações em dispositivos com dados anteriores.
4. **Interação e UX:** gráficos usam barras simples; seleção da evolução possui limite técnico atual de 240 meses; formulário de data usa `AAAA-MM-DD`, sem calendário nativo. Revisão integral dos 130 critérios de aceitação está pendente.
5. **Dados:** não há backup/exportação. Desinstalar o aplicativo pode eliminar os registros.

## Comandos de validação

```bash
npm run typecheck
npm test -- --watch=false
python3 -m unittest discover -s scripts -p 'test_*.py' -v
npx expo export --platform android --output-dir dist
```

As mesmas verificações são executadas no GitHub Actions em `.github/workflows/checks.yml`. A verificação com Python usa um banco em memória e nunca acessa os dados do dispositivo.

## Documentação do produto

- `specs/001-controle-financeiro-pessoal/spec.md`: requisitos e critérios aprovados
- `specs/001-controle-financeiro-pessoal/plan.md`: arquitetura e decisões técnicas
- `specs/001-controle-financeiro-pessoal/data-model.md`: modelo proposto
- `specs/001-controle-financeiro-pessoal/tasks.md`: backlog e critérios de validação
- `specs/001-controle-financeiro-pessoal/analysis.md`: rastreabilidade
