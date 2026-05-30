import app from './app';
import { testConnection } from './config/database';

const PORT = process.env.PORT || 3000;

/**
 * Ponto de entrada da aplicação UniBuilds API.
 *
 * Sequência de inicialização:
 * 1. Testa a conexão com o banco de dados
 * 2. Se bem-sucedido, inicia o servidor HTTP
 * 3. Se falhar, encerra o processo com código de erro
 */
async function startServer(): Promise<void> {
  // 1. Verifica se o banco de dados está acessível
  await testConnection();

  // 2. Inicia o servidor Express
  app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════╗');
    console.log('║          🏆  UniBuilds API  🏆              ║');
    console.log('╠════════════════════════════════════════════╣');
    console.log(`║  Servidor rodando em: http://localhost:${PORT}  ║`);
    console.log(`║  Health check: http://localhost:${PORT}/api/health ║`);
    console.log('╚════════════════════════════════════════════╝');
    console.log('');
    console.log('📡 Endpoints disponíveis:');
    console.log(`   GET  http://localhost:${PORT}/api/champions`);
    console.log(`   GET  http://localhost:${PORT}/api/champions/:id`);
    console.log(`   GET  http://localhost:${PORT}/api/items`);
    console.log(`   GET  http://localhost:${PORT}/api/items/:id`);
    console.log(`   GET  http://localhost:${PORT}/api/runes`);
    console.log(`   POST http://localhost:${PORT}/api/builds`);
    console.log(`   GET  http://localhost:${PORT}/api/builds/user/:userId`);
    console.log('');
  });
}

startServer().catch((error) => {
  console.error('❌ Falha crítica ao iniciar o servidor:', error);
  process.exit(1);
});
