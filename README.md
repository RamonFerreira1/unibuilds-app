# UniBuilds - Gerenciador de Builds para League of Legends 🏆

Este é o repositório principal do **UniBuilds**, um projeto acadêmico focado na criação de um aplicativo completo (Full-Stack) para gerenciar builds do jogo League of Legends.

O repositório é estruturado em um formato de **monorepo**, contendo tanto o aplicativo mobile/web (Frontend) quanto a API (Backend) e a estrutura do Banco de Dados.

## 📂 Estrutura do Monorepo

- **`/unibuilds`**: Aplicativo Frontend (React Native + Expo Web). [Acessar README do Frontend](./unibuilds/README.md)
- **`/api`**: Servidor Backend REST (Node.js + Express + TypeScript). [Acessar README da API](./api/README.md)
- **`league_of_legends.sql`**: Dump do banco de dados MySQL contendo informações vitais do jogo (Campeões, Itens, Runas).

## 🚀 Histórico de Atualizações Geral (Changelog)

Abaixo estão listadas as principais atualizações e correções feitas em todas as camadas do projeto (Front, Back e Banco de Dados):

- **[Front/Back] Adicionado tratamento de erro na interface:** Caso a API falhe ao buscar os itens da forja, o app agora exibe uma tela com a opção "Tentar Novamente", sem fechar ou travar.
- **[Back/BD] Isolamento de Builds por Usuário:** Resolvido o problema onde as builds de todos os usuários apareciam misturadas. Foi adicionada a coluna `user_nome` no Banco de Dados e as queries da API foram ajustadas para filtrar as builds de forma estritamente individual.
- **[Front] Melhorias de UX no Formulário de Builds:** O aplicativo agora reseta automaticamente o formulário inteiro (limpando runas, itens e campeões) logo após salvar uma build com sucesso.
- **[Front] Sanitização Visual:** Tags XML de raridade (ex: `<rarityLegendary>`) foram cortadas de todos os nomes de itens do jogo, tanto na lista de exibição quanto na pesquisa do modal seletor.
- **[Front/Back] Proteção contra Duplo Clique e Concorrência:** Adicionado estado de carregamento visual (spinners) nos botões de Cadastro, Login, Favoritar Build e Excluir Build. Isso impede falhas de servidor causadas por múltiplos cliques seguidos.
- **[BD] Reparo no Banco de Dados (Smolder):** O campeão Smolder, que estava corrompido, teve suas habilidades (P, Q, W, E, R) e imagens corrigidas no MySQL.
- **[Back] Autenticação Real:** Removido o sistema provisório de "placeholders" de login e implementado o fluxo real de autenticação conectando a API com a tabela de `usuarios` do banco.
