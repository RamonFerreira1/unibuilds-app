const fs = require('fs');

const msgs = {
  'feat: add error handling and retry UI to build creator data fetching': 'feat: adicionar tratamento de erro e interface de tentativa ao buscar dados da build',
  'fix: isolate builds per user by saving and filtering by user_nome': 'fix: isolar builds por usuario salvando e filtrando pela coluna user_nome',
  'fix: add loading state to build deletion modal': 'fix: adicionar estado de carregamento no modal de exclusao de build',
  'fix: reset build state on save, format item names in search, add loading to register': 'fix: resetar estado da build ao salvar, limpar nomes de itens na busca e adicionar loading no cadastro',
  'fix: login loading state, Smolder data, item ARAM/inactive filter': 'fix: estado de loading no login, correcao de dados do Smolder e filtro de itens inativos/ARAM',
  'fix: strip XML rarity tags from item names in TelaListaItens': 'fix: remover tags XML de raridade dos nomes dos itens',
  'fix: add metro.config.js to resolve import.meta error from Zustand ESM build': 'fix: adicionar metro.config.js para resolver erro do import.meta do Zustand',
  'fix: remove zustand middleware and replace via.placeholder with placehold.co': 'fix: remover middleware do zustand e trocar via.placeholder pelo placehold.co',
  'fix: downgrade Zustand to 4.5.5 to avoid import.meta errors on Expo Web': 'fix: voltar versao do Zustand para 4.5.5 para evitar erros na Web',
  'feat: implement real database-backed user authentication flow': 'feat: implementar fluxo real de autenticacao de usuarios no banco de dados'
};

const input = fs.readFileSync(0, 'utf-8');
const lines = input.split('\n');
const newLines = lines.map(line => {
  for (const [en, pt] of Object.entries(msgs)) {
    if (line.trim() === en) {
      return line.replace(en, pt);
    }
  }
  return line;
});
console.log(newLines.join('\n'));
