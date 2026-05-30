import pool from '../config/database';
import { Usuario } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

/**
 * Model de Usuários
 * Encapsula as queries SQL relacionadas à tabela `usuarios`.
 */
export class UserModel {

  /**
   * Busca um usuário pelo nome (case-insensitive)
   */
  static async findByNome(nome: string): Promise<Usuario | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, nome, senha FROM usuarios WHERE LOWER(nome) = LOWER(?)',
      [nome]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0] as Usuario;
  }

  /**
   * Cria um novo usuário no banco de dados
   */
  static async create(nome: string, senha: string): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO usuarios (nome, senha) VALUES (?, ?)',
      [nome, senha]
    );

    return result.insertId;
  }
}
