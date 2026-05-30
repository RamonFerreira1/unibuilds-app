import { Router } from 'express';
import { CampeaoController } from '../controllers/CampeaoController';

const router = Router();

/**
 * Rotas de Campeões
 *
 * GET  /api/champions       → Lista resumida de todos os campeões
 * GET  /api/champions/:id   → Detalhes completos com habilidades e skins
 */
router.get('/', CampeaoController.getAll);
router.get('/:id', CampeaoController.getById);

export default router;
