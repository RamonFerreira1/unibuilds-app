import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Cria e retorna um pool de conexões com o banco de dados MySQL.
 * Utilizamos um pool (em vez de uma única conexão) para melhor
 * desempenho e gestão de múltiplas requisições simultâneas.
 */
const pool = mysql2.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'league_of_legends',
  // Garante que os resultados venham como objetos JS, não arrays
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Tipagem correta para datas e outros tipos
  typeCast: true,
  // Configuração dinâmica de SSL para bancos na nuvem
  ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' 
    ? { rejectUnauthorized: false } 
    : undefined
});

/**
 * Função utilitária para testar a conexão na inicialização do servidor.
 */
export async function testConnection(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    connection.release();
  } catch (error) {
    console.error('❌ Falha ao conectar ao banco de dados:', error);
    process.exit(1); // Encerra o servidor se não conseguir conectar
  }
}

export default pool;
