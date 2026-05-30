import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function importDb() {
  console.log('🚀 Iniciando conexão com o banco de dados Aiven MySQL na nuvem...');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' 
      ? { rejectUnauthorized: false } 
      : undefined,
    multipleStatements: true // Permite executar múltiplos comandos SQL de uma vez só!
  });

  try {
    const sqlPath = path.join(__dirname, '../../league_of_legends.sql');
    console.log(`📂 Lendo arquivo SQL local em: ${sqlPath}`);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('⚡ Executando scripts SQL de criação de tabelas e sementes de campeões, itens e runas...');
    console.log('⏳ Isso pode levar entre 30 a 60 segundos. Por favor, aguarde...');
    
    // Executa todo o script SQL
    await connection.query(sql);
    
    console.log('✅ Banco de dados importado com sucesso para a nuvem Aiven!');
  } catch (error) {
    console.error('❌ Erro durante a importação do banco de dados:', error);
  } finally {
    await connection.end();
  }
}

importDb();
