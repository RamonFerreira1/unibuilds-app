import { Router } from 'express';
import { RunaController } from '../controllers/RunaController';

const router = Router();

/**
 * Rotas de Runas
 *
 * GET  /api/runes   → Todas as runas agrupadas por árvore (Precisão, Dominação, etc.)
 */
router.get('/', RunaController.getAll);

export default router;
