import { Request, Response } from 'express';
import { CampeaoModel } from '../models/CampeaoModel';

/**
 * Controller de Campeões
 * Gerencia as requisições HTTP relacionadas a campeões,
 * delegando a lógica de negócio ao CampeaoModel.
 */
export class CampeaoController {

  /**
   * GET /api/champions
   * Retorna lista resumida de todos os campeões.
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const campeoes = await CampeaoModel.findAll();
      res.status(200).json({
        success: true,
        data: campeoes,
      });
    } catch (error) {
      console.error('[CampeaoController.getAll] Erro:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao buscar a lista de campeões.',
      });
    }
  }

  /**
   * GET /api/champions/:id
   * Retorna os detalhes completos de um campeão, incluindo
   * suas habilidades e skins.
   */
  static async getById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);

    // Valida se o ID fornecido é um número inteiro válido
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'O parâmetro "id" deve ser um número inteiro válido.',
      });
      return;
    }

    try {
      const campeao = await CampeaoModel.findById(id);

      if (!campeao) {
        res.status(404).json({
          success: false,
          error: `Campeão com ID ${id} não encontrado.`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: campeao,
      });
    } catch (error) {
      console.error(`[CampeaoController.getById] Erro ao buscar campeão ID ${id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao buscar os detalhes do campeão.',
      });
    }
  }
}
