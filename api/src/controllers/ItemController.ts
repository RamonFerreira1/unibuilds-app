import { Request, Response } from 'express';
import { ItemModel } from '../models/ItemModel';

/**
 * Controller de Itens
 * Gerencia as requisições HTTP relacionadas aos itens do jogo.
 */
export class ItemController {

  /**
   * GET /api/items
   * Retorna a lista completa de itens com nome, preço,
   * descrição e URL da imagem.
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const itens = await ItemModel.findAll();
      res.status(200).json({
        success: true,
        data: itens,
      });
    } catch (error) {
      console.error('[ItemController.getAll] Erro:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao buscar a lista de itens.',
      });
    }
  }

  /**
   * GET /api/items/:id
   * Retorna um item específico pelo seu ID Riot.
   */
  static async getById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'O parâmetro "id" deve ser um número inteiro válido.',
      });
      return;
    }

    try {
      const item = await ItemModel.findById(id);

      if (!item) {
        res.status(404).json({
          success: false,
          error: `Item com ID ${id} não encontrado.`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      console.error(`[ItemController.getById] Erro ao buscar item ID ${id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao buscar o item.',
      });
    }
  }
}
