import { Router } from 'express';
import { ItemController } from '../controllers/ItemController';

const router = Router();

/**
 * Rotas de Itens
 *
 * GET  /api/items      → Lista completa de itens com preço e atributos
 * GET  /api/items/:id  → Detalhes de um item específico
 */
router.get('/', ItemController.getAll);
router.get('/:id', ItemController.getById);

export default router;
