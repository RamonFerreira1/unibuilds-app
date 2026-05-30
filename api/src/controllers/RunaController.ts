import { Request, Response } from 'express';
import { RunaModel } from '../models/RunaModel';

/**
 * Controller de Runas
 * Gerencia as requisições HTTP relacionadas às runas do jogo.
 */
export class RunaController {

  /**
   * GET /api/runes
   * Retorna todas as runas organizadas por árvore (Path),
   * separadas entre keystones (slot 0) e fendas (slots 1-3).
   * 
   * Formato de resposta:
   * [
   *   {
   *     nome_arvore: "Precisão",
   *     keystones: [...],
   *     slots: [[fenda1...], [fenda2...], [fenda3...]]
   *   },
   *   ...
   * ]
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const arvores = await RunaModel.findAllOrganizadas();
      res.status(200).json({
        success: true,
        data: arvores,
      });
    } catch (error) {
      console.error('[RunaController.getAll] Erro:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao buscar as runas.',
      });
    }
  }
}
