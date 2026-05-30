import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel';

/**
 * Controller de Usuários
 * Gerencia o cadastro e login de jogadores.
 */
export class UserController {

  /**
   * POST /api/users/register
   * Cadastra uma nova conta de jogador
   */
  static async register(req: Request, res: Response): Promise<void> {
    const { nome, senha } = req.body;

    if (!nome || !senha || !nome.trim() || !senha.trim()) {
      res.status(400).json({
        success: false,
        error: 'Os campos "nome" e "senha" são obrigatórios.',
      });
      return;
    }

    try {
      const nomeLimpo = nome.trim();
      const usuarioExistente = await UserModel.findByNome(nomeLimpo);

      if (usuarioExistente) {
        res.status(400).json({
          success: false,
          error: 'Este nome de jogador já está em uso!',
        });
        return;
      }

      const newUserId = await UserModel.create(nomeLimpo, senha);

      res.status(201).json({
        success: true,
        message: 'Conta criada com sucesso!',
        data: {
          id: newUserId,
          nome: nomeLimpo
        }
      });
    } catch (error) {
      console.error('[UserController.register] Erro ao cadastrar:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao criar a conta.',
      });
    }
  }

  /**
   * POST /api/users/login
   * Realiza a autenticação do jogador
   */
  static async login(req: Request, res: Response): Promise<void> {
    const { nome, senha } = req.body;

    if (!nome || !senha || !nome.trim() || !senha.trim()) {
      res.status(400).json({
        success: false,
        error: 'Os campos "nome" e "senha" são obrigatórios.',
      });
      return;
    }

    try {
      const nomeLimpo = nome.trim();
      const usuario = await UserModel.findByNome(nomeLimpo);

      if (!usuario || usuario.senha !== senha) {
        res.status(401).json({
          success: false,
          error: 'Nome do jogador ou senha incorretos.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso!',
        data: {
          id: usuario.id,
          nome: usuario.nome
        }
      });
    } catch (error) {
      console.error('[UserController.login] Erro ao logar:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao realizar o login.',
      });
    }
  }
}
