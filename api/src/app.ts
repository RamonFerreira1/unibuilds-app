import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importação das rotas
import championRoutes from './routes/championRoutes';
import itemRoutes from './routes/itemRoutes';
import runeRoutes from './routes/runeRoutes';
import buildRoutes from './routes/buildRoutes';
import userRoutes from './routes/userRoutes';

// Carrega as variáveis de ambiente antes de qualquer coisa
dotenv.config();

const app: Application = express();

// =============================================================
// MIDDLEWARES GLOBAIS
// =============================================================

/**
 * CORS: Permite que o Expo/React Native acesse a API.
 * Em produção, substitua `origin: '*'` pelo domínio real.
 */
app.use(cors({
  origin: '*', // Libera todas as origens em desenvolvimento
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/**
 * Parseia requisições com corpo JSON.
 * Necessário para o POST /api/builds receber o payload.
 */
app.use(express.json());

/**
 * Parseia requisições com corpo URL-encoded
 * (formulários HTML tradicionais).
 */
app.use(express.urlencoded({ extended: true }));

// =============================================================
// ROTAS DA API
// =============================================================

/**
 * Rota de health check — verifica se o servidor está ativo.
 * Útil para testes rápidos e monitoramento.
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '🚀 UniBuilds API está online!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      champions: '/api/champions',
      championById: '/api/champions/:id',
      items: '/api/items',
      itemById: '/api/items/:id',
      runes: '/api/runes',
      createBuild: 'POST /api/builds',
      userBuilds: '/api/builds/user/:userId',
      register: 'POST /api/users/register',
      login: 'POST /api/users/login'
    },
  });
});

// Monta todas as rotas sob o prefixo /api
app.use('/api/champions', championRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/runes', runeRoutes);
app.use('/api/builds', buildRoutes);
app.use('/api/users', userRoutes);

// =============================================================
// TRATAMENTO GLOBAL DE ERROS
// =============================================================

/**
 * Middleware 404 — rota não encontrada.
 * Deve ser registrado APÓS todas as rotas válidas.
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada. Verifique a URL e o método HTTP utilizado.',
  });
});

/**
 * Middleware de erro global.
 * Captura qualquer erro não tratado que chegue ao Express.
 * O parâmetro `_next` é necessário para o Express reconhecer este
 * middleware como handler de erros (4 parâmetros).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[GlobalErrorHandler]', err.message);
  res.status(500).json({
    success: false,
    error: 'Ocorreu um erro inesperado no servidor.',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;
