import { Router } from 'express';
import { BuildController } from '../controllers/BuildController';

const router = Router();

/**
 * Rotas de Builds
 *
 * POST /api/builds                   → Cria uma nova build
 * GET  /api/builds/user/:userId      → Lista as builds de um usuário
 */
router.post('/', BuildController.create);
router.get('/user/:userId', BuildController.getByUserId);
router.put('/:id', BuildController.update);
router.delete('/:id', BuildController.delete);

export default router;
