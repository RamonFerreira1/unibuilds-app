const mysql = require('mysql2/promise');

// Limpa a descrição transformando <br> em quebras de linha reais para melhor leitura
const limparDescricao = (texto) => {
  if (!texto) return '';
  let limpo = texto.replace(/<br\s*\/?>/gi, '\n');
  limpo = limpo.replace(/<\/li>|<\/p>/gi, '\n'); // garante quebra em listas
  limpo = limpo.replace(/<[^>]*>/g, ' '); // remove as outras tags colocando espaço
  limpo = limpo.replace(/[ \t]{2,}/g, ' '); // remove espaços duplos
  // Limpa espaços vazios no começo/fim das linhas e remove linhas em branco extras
  return limpo.split('\n').map(l => l.trim()).filter(l => l.length > 0).join('\n\n');
};

async function run() {
  console.log('Buscando dados originais do Data Dragon...');
  const res = await fetch('https://ddragon.leagueoflegends.com/cdn/16.11.1/data/pt_BR/item.json');
  const json = await res.json();
  const items = json.data;

  console.log('Conectando ao banco de dados...');
  const db = await mysql.createConnection({ 
    host: 'mysql-3df3d8c6-ramonferreirams11-45cd.l.aivencloud.com', 
    port: 28312, 
    user: 'avnadmin', 
    password: process.env.DB_PASS || 'REDACTED', 
    database: 'defaultdb', 
    ssl: { rejectUnauthorized: false } 
  });

  console.log('Atualizando descrições formatadas...');
  let updated = 0;
  for (const [id, item] of Object.entries(items)) {
    const rawDesc = item.description;
    const cleanDesc = limparDescricao(rawDesc);
    
    // Atualiza a tabela itens onde o ID da Riot é igual ao ID do item
    const [result] = await db.query('UPDATE itens SET descricao = ? WHERE ID_riot = ?', [cleanDesc, parseInt(id)]);
    if (result.affectedRows > 0) {
      updated++;
    }
  }

  console.log(`Finalizado! ${updated} itens foram atualizados no banco de dados com quebras de linha.`);
  await db.end();
}

run().catch(console.error);
