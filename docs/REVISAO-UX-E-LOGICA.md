# Revisão de design, experiência e lógica — App Gastos

**Data da revisão:** 2026-11-09  
**Objetivo de produto:** cadastrar gastos, cadastrar renda e entender quanto foi gasto em cada mês.  
**Ambiente:** Android, Expo SDK 58, TypeScript, Expo Router e SQLite local.  
**Regra de segurança:** preservar os registros e o esquema SQLite existentes; não limpar dados do Expo Go.

## Diagnóstico e correções

| Área | Problema observado no código | Decisão aplicada | Arquivos principais |
| --- | --- | --- | --- |
| Barra inferior | Rótulos sem ícones, ação + sobreposta, acesso menos evidente | Quatro abas com Material Symbols e menu do + com apenas gasto/renda | `app/(tabs)/_layout.tsx` |
| Início | Resultado e várias métricas competiam pela atenção; detalhes ocupavam muito espaço | Gasto mensal como número principal; renda e resultado como contexto; categorias em lista curta | `app/(tabs)/dashboard.tsx` |
| Formulário | Formato técnico de data, todas as categorias exibidas, opções avançadas visíveis | Data DD/MM/AAAA, seletor recolhível com pesquisa, recorrência/parcelamento sob opção discreta | `src/components/EntryForm.tsx` |
| Dados incorretos | Categoria inicial era escolhida automaticamente mesmo sem escolha consciente | Categoria deve ser selecionada para salvar um novo lançamento | `src/components/EntryForm.tsx` |
| Edição de séries | Alternar o tipo de série poderia transformar uma série antiga em um lançamento avulso | Trava da modalidade de série durante a edição; mantém edição de campos da série | `src/components/EntryForm.tsx` |
| Histórico | Muitos filtros competiam com os lançamentos; filtros aplicados por outra tela eram pouco visíveis | Lista compacta, filtros recolhíveis e identificação/limpeza dos filtros ativos | `app/(tabs)/history.tsx` |
| Categorias | Destino de transferência era solicitado antes de o usuário pedir exclusão | Transferência aparece somente após excluir categoria em uso; confirmação explícita | `app/(tabs)/categories.tsx` |
| Ajustes | Textos técnicos demais | Aparência e informação breve sobre dados locais | `app/(tabs)/settings.tsx` |
| Carregamento | Ao trocar mês, tela podia mostrar dados do período anterior até concluir consulta | Limpeza do resultado temporário e estado de carregamento | `src/hooks/useEntries.ts` |
| Duplicidade | Verificação consultava apenas entradas persistidas e não recorrências virtuais | Compara as entradas do mês, inclusive recorrências calculadas, mantendo a verificação como aviso | `src/data/database.ts`, `src/domain/finance.ts` |
| Data e valores | Entradas de data pouco naturais; limite do calendário pouco controlado | Conversão/validação DD/MM/AAAA, ano técnico 1900–9999 e limite de fim de série | `src/domain/finance.ts`, `src/data/database.ts` |
| Feedback | Faltava indicação discreta de salvamento; falha inicial do SQLite sem tentativa de recuperação | Avisos temporários, desfazer com prazo independente e botão de tentar abrir o banco novamente | `src/state/AppState.tsx`, `app/_layout.tsx` |
| Tema/Android | Contraste de ações no modo escuro e risco de sobrepor barra de status | Cores de links separadas das cores de botão e uso de inset superior em telas de abas | `src/components/UI.tsx` |

## Regras financeiras e persistência

- SQLite continua usando **o mesmo banco `app-gastos.db`**, tabelas e `user_version`. Não há migração destrutiva nesta revisão.
- Valores continuam em centavos inteiros. Receitas e gastos ficam separados por categoria e data.
- Parcelas de duração definida continuam distribuídas exatamente em centavos, com o resíduo na última.
- Recorrências indefinidas continuam calculadas ao consultar, sem gravar infinitas ocorrências.
- Operações de reclassificar/excluir uma categoria em uso continuam transacionais e com confirmação.
- A edição “esta e próximas” de uma série indefinida permanece bloqueada pela decisão funcional pendente (I4), sem inventar precedência.
- As funções avançadas foram **recolhidas**, não removidas, para preservar funcionalidades e dados existentes.

## Verificações e evidências

O workflow `.github/workflows/checks.yml` executa instalação, `npm run typecheck`, Jest, testes do esquema SQL em SQLite real isolado e exportação do bundle Android.

Os testes de domínio abrangem centavos, arredondamento de parcelas, datas 29/30/31, ano bissexto, limite de série, máscara/conversão de data e identidade financeira de lançamentos duplicados. O teste de esquema valida constraints e rollback com SQLite em memória.

**Importante:** CI verde confirma compilação e verificações automatizadas, **não** o funcionamento visual no aparelho Android. O SQLite de integração é o `sqlite3` do Python, não a ponte `expo-sqlite` do celular.

## Lacunas ainda abertas

1. **P0 — Dados locais sem backup/exportação:** limpar dados ou desinstalar o Expo Go pode eliminar registros. Não foi adicionada rotina de backup nesta revisão porque exigiria definição de exportação/restauração e validação.
2. **P1 — Testes em Android real:** precisam ser executados no dispositivo para teclado, navegação por gestos, safe area, ícones, persistência ao reabrir, modo escuro e desfazer.
3. **P1 — Recorrências indefinidas:** edição/exclusão “esta e próximas” dependem de política de precedência entre segmentos e exceções e testes de consistência.
4. **P1 — Lockfile:** `package-lock.json` do repositório não contempla todas as dependências adicionadas anteriormente (`expo-sqlite`) e agora (`expo-symbols`). O CI usa `npm install`, que resolve versões; para build reproduzível, regenerar e versionar o lockfile com `npm install` e validar com `npm ci`.
5. **P2 — Limites financeiros:** valores individuais são números inteiros seguros, mas falta uma política abrangente de limite para soma mensal extrema, sobretudo entre diferentes séries.
6. **P2 — Aceite:** ainda não foi feita a regressão completa dos 130 critérios da especificação com evidência de uso no Android, e não foram realizados testes com TalkBack e dispositivos de tamanhos variados.

## Roteiro de conferência no celular

1. Abrir Início e alternar meses; conferir os totais e o valor por categoria.
2. Tocar no +, verificar os ícones e registrar um gasto de R$ 15,90; escolher categoria, salvar e conferir o aviso de sucesso.
3. Registrar uma renda; confirmar que a tela inicial calcula o resultado `renda - gasto`.
4. Alterar um lançamento para outro mês usando DD/MM/AAAA e conferir os dois meses.
5. Abrir o Histórico, buscar, ordenar e limpar filtros; tocar em um lançamento, editar e excluir; testar Desfazer dentro de cinco segundos.
6. Editar/excluir categoria em uso e conferir se os lançamentos foram transferidos sem alterar valores.
7. Criar uma recorrência de duração definida e uma compra parcelada; testar dia 31, parcelas e períodos futuros.
8. Alternar tema claro/escuro, fechar/reabrir o Expo Go, confirmar que os registros continuam presentes.

**Critério de aceite:** não marcar tarefa como concluída apenas porque o bundle foi gerado; registrar a prova real no Android, com correções dos problemas identificados.
