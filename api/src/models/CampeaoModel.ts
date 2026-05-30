import pool from '../config/database';
import { Campeao, CampeaoDetalhado, Habilidade, Skin } from '../types';
import { RowDataPacket } from 'mysql2';

/**
 * Model de Campeões
 * Encapsula todas as queries SQL relacionadas à tabela `campeoes`,
 * `habilidades` e `skins`.
 */
export class CampeaoModel {
  
  /**
   * Busca todos os campeões com informações resumidas para listagem.
   * Retorna apenas os campos necessários para o front-end exibir
   * uma grade/lista de campeões (ID, nome, título, ícone quadrado).
   */
  static async findAll(): Promise<Campeao[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT ID, nome, titulo, square_url
       FROM campeoes
       ORDER BY nome ASC`
    );
    return rows as Campeao[];
  }

  /**
   * Busca um campeão pelo ID, incluindo suas habilidades e skins.
   * Realiza consultas separadas para manter a clareza e evitar
   * duplicação de dados em JOINs com múltiplas tabelas.
   */
  static async findById(id: number): Promise<CampeaoDetalhado | null> {
    // 1. Busca dados principais do campeão
    const [campeaoRows] = await pool.query<RowDataPacket[]>(
      `SELECT ID, nome, titulo, splash_url, loading_url, square_url
       FROM campeoes
       WHERE ID = ?`,
      [id]
    );

    if (campeaoRows.length === 0) {
      return null;
    }

    const campeao = campeaoRows[0] as Campeao;

    // 2. Busca as habilidades deste campeão
    const [habilidadeRows] = await pool.query<RowDataPacket[]>(
      `SELECT ID_habilidade, ID_campeao, tecla, nome_habilidade, descricao, imagem_url
       FROM habilidades
       WHERE ID_campeao = ?
       ORDER BY FIELD(tecla, 'P', 'Q', 'W', 'E', 'R')`,
      [id]
    );

    // 3. Busca as skins deste campeão
    const [skinRows] = await pool.query<RowDataPacket[]>(
      `SELECT ID_skin, ID_campeao, nome_skin, num_skin, splash_url, loading_url
       FROM skins
       WHERE ID_campeao = ?
       ORDER BY num_skin ASC`,
      [id]
    );

    return {
      ...campeao,
      habilidades: habilidadeRows as Habilidade[],
      skins: skinRows as Skin[],
    };
  }
}
