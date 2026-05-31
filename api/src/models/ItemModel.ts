import pool from '../config/database';
import { Item } from '../types';
import { RowDataPacket } from 'mysql2';

/**
 * Model de Itens
 * Encapsula as queries SQL relacionadas à tabela `itens`.
 */
export class ItemModel {

  /**
   * Busca todos os itens do banco.
   * Filtra itens sem nome (itens internos do jogo) para mostrar
   * apenas itens relevantes ao front-end.
   */
  static async findAll(): Promise<Item[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT ID_riot, nome, descricao, preco, imagem_url
       FROM itens
       WHERE nome IS NOT NULL AND nome != ''
         AND preco > 0
         AND ID_riot < 200000
         AND nome NOT LIKE '<%>%'
       ORDER BY nome ASC`
    );
    return rows as Item[];
  }

  /**
   * Busca um item pelo seu ID Riot (ID_riot).
   */
  static async findById(id: number): Promise<Item | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT ID_riot, nome, descricao, preco, imagem_url
       FROM itens
       WHERE ID_riot = ?`,
      [id]
    );
    return rows.length > 0 ? (rows[0] as Item) : null;
  }
}
