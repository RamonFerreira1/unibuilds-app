import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();

/**
 * Rotas de Usuários
 *
 * POST /api/users/register  → Cadastra um novo jogador
 * POST /api/users/login     → Autentica o jogador
 */
router.post('/register', UserController.register);
router.post('/login', UserController.login);

export default router;
