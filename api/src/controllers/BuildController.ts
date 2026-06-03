import { Request, Response } from 'express';
import { BuildModel } from '../models/BuildModel';
import { CreateBuildPayload } from '../types';

/**
 * Controller de Builds
 * Gerencia a criação e consulta de builds de usuários.
 */
export class BuildController {

  /**
   * POST /api/builds
   * Recebe um payload JSON do front-end e cria uma nova build.
   * 
   * Payload esperado:
   * {
   *   "userId": "user123",
   *   "championId": 1,
   *   "items": [3031, 3046, 6333],
   *   "bootId": "3006",
   *   "spell1Id": 4,
   *   "spell2Id": 11,
   *   "runes": [8010, 9111, 9104, 8014]
   * }
   */
  static async create(req: Request, res: Response): Promise<void> {
    const payload: CreateBuildPayload = req.body;

    // ─── Validação dos campos obrigatórios ───────────────────
    if (!payload.userId) {
      res.status(400).json({
        success: false,
        error: 'O campo "userId" é obrigatório.',
      });
      return;
    }

    if (!payload.championId || isNaN(Number(payload.championId))) {
      res.status(400).json({
        success: false,
        error: 'O campo "championId" é obrigatório e deve ser um número válido.',
      });
      return;
    }

    if (!Array.isArray(payload.items)) {
      res.status(400).json({
        success: false,
        error: 'O campo "items" deve ser um array de IDs de itens.',
      });
      return;
    }

    if (payload.items.length > 3) {
      res.status(400).json({
        success: false,
        error: 'O array "items" pode conter no máximo 3 itens.',
      });
      return;
    }

    // ─── Criação da build ─────────────────────────────────────
    try {
      const newBuildId = await BuildModel.create(payload);

      // Busca a build criada com todos os dados para retornar ao front-end
      const buildCriada = await BuildModel.findById(newBuildId);

      res.status(201).json({
        success: true,
        message: 'Build criada com sucesso!',
        data: buildCriada,
      });
    } catch (error) {
      console.error('[BuildController.create] Erro ao criar build:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao criar a build. Verifique se os IDs de campeão e itens são válidos.',
      });
    }
  }

  /**
   * GET /api/builds/user/:userId
   * Retorna a lista de builds associadas a um usuário específico.
   * Os dados incluem os nomes do campeão e itens via JOIN.
   */
  static async getByUserId(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'O parâmetro "userId" é obrigatório.',
      });
      return;
    }

    try {
      const builds = await BuildModel.findByUserId(userId);

      res.status(200).json({
        success: true,
        data: builds,
        total: builds.length,
      });
    } catch (error) {
      console.error(`[BuildController.getByUserId] Erro ao buscar builds do usuário ${userId}:`, error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao buscar as builds do usuário.',
      });
    }
  }

  /**
   * DELETE /api/builds/:id
   * Exclui uma build específica do banco de dados pelo seu ID.
   */
  static async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      res.status(400).json({
        success: false,
        error: 'O parâmetro "id" é obrigatório e deve ser um número válido.',
      });
      return;
    }

    try {
      const deleted = await BuildModel.delete(Number(id));

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Build não encontrada.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Build excluída com sucesso!',
      });
    } catch (error) {
      console.error(`[BuildController.delete] Erro ao excluir build ${id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao excluir a build.',
      });
    }
  }

  /**
   * PUT /api/builds/:id
   * Atualiza uma build existente.
   */
  static async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const payload: CreateBuildPayload = req.body;

    if (!id || isNaN(Number(id))) {
      res.status(400).json({
        success: false,
        error: 'O parâmetro "id" é obrigatório e deve ser um número válido.',
      });
      return;
    }

    // ─── Validação dos campos obrigatórios ───────────────────
    if (!payload.userId) {
      res.status(400).json({
        success: false,
        error: 'O campo "userId" é obrigatório.',
      });
      return;
    }

    if (!payload.championId || isNaN(Number(payload.championId))) {
      res.status(400).json({
        success: false,
        error: 'O campo "championId" é obrigatório e deve ser um número válido.',
      });
      return;
    }

    if (!Array.isArray(payload.items)) {
      res.status(400).json({
        success: false,
        error: 'O campo "items" deve ser um array de IDs de itens.',
      });
      return;
    }

    if (payload.items.length > 3) {
      res.status(400).json({
        success: false,
        error: 'O array "items" pode conter no máximo 3 itens.',
      });
      return;
    }

    // ─── Atualização da build ─────────────────────────────────────
    try {
      const updated = await BuildModel.update(Number(id), payload);

      if (!updated) {
        res.status(404).json({
          success: false,
          error: 'Build não encontrada para atualizar.',
        });
        return;
      }

      // Busca a build atualizada com todos os dados para retornar ao front-end
      const buildAtualizada = await BuildModel.findById(Number(id));

      res.status(200).json({
        success: true,
        message: 'Build atualizada com sucesso!',
        data: buildAtualizada,
      });
    } catch (error) {
      console.error(`[BuildController.update] Erro ao atualizar build ${id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao atualizar a build. Verifique se os IDs fornecidos são válidos.',
      });
    }
  }
}
