import pool from '../config/database';
import { Build, BuildDetalhada, CreateBuildPayload } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

/**
 * Model de Builds
 * Encapsula as queries SQL relacionadas à tabela `builds`.
 * 
 * NOTA IMPORTANTE sobre a arquitetura de builds:
 * A tabela `builds` no SQL usa colunas fixas (item_1_ID, item_2_ID, item_3_ID)
 * e não possui coluna `userId`. Para um app real, seria necessário adicionar
 * uma tabela `users` e relacionar com builds. Por ora, o `userId` será
 * gerenciado no front-end ou adicionado futuramente via migration.
 * 
 * Esta implementação é compatível com o schema existente e extensível.
 */
export class BuildModel {

  /**
   * Busca todas as builds de um "usuário" com JOINs para nome do campeão e itens.
   * 
   * Como a tabela atual não tem userId, esta query retorna todas as builds,
   * sendo possível filtrar pelo front-end. Em uma versão futura com uma
   * coluna `user_id`, basta adicionar WHERE b.user_id = ? na query.
   */
  static async findByUserId(_userId: string): Promise<BuildDetalhada[]> {
    // A query usa LEFT JOINs para não perder builds cujo item seja NULL
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
          b.ID_build,
          b.nome_build,
          c.nome                  AS nome_campeao,
          c.square_url            AS square_url,
          i1.nome                 AS item_1_nome,
          i1.imagem_url           AS item_1_img,
          i2.nome                 AS item_2_nome,
          i2.imagem_url           AS item_2_img,
          i3.nome                 AS item_3_nome,
          i3.imagem_url           AS item_3_img,
          bota.nome               AS bota_nome,
          bota.imagem_url         AS bota_img,
          r_chave.nome_runa       AS runa_chave_nome,
          r_chave.imagem_url      AS runa_chave_img
       FROM builds b
       LEFT JOIN campeoes  c      ON b.ID_campeao    = c.ID
       LEFT JOIN itens     i1     ON b.item_1_ID     = i1.ID_riot
       LEFT JOIN itens     i2     ON b.item_2_ID     = i2.ID_riot
       LEFT JOIN itens     i3     ON b.item_3_ID     = i3.ID_riot
       LEFT JOIN itens     bota   ON b.ID_bota       = bota.ID_riot
       LEFT JOIN runas     r_chave ON b.ID_runa_chave = r_chave.ID_runa
       ORDER BY b.ID_build DESC`
    );

    return rows as BuildDetalhada[];
  }

  /**
   * Cria uma nova build no banco de dados.
   * Mapeia o payload do front-end para as colunas da tabela `builds`.
   */
  static async create(payload: CreateBuildPayload): Promise<number> {
    const {
      nomeBuild = '',
      championId,
      items = [],
      bootId = '',
      spell1Id = 4,   // Flash como padrão
      spell2Id = 11,  // Golpear como padrão
      runes = [],
    } = payload;

    const [item1, item2, item3] = items;
    const [runaChave, runaFenda1, runaFenda2, runaFenda3] = runes;

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO builds
        (nome_build, ID_campeao, item_1_ID, item_2_ID, item_3_ID, ID_bota,
         ID_spell_1, ID_spell_2, ID_runa_chave, ID_runa_fenda1, ID_runa_fenda2, ID_runa_fenda3)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nomeBuild || 'Build Sem Nome',
        championId,
        item1 ?? null,
        item2 ?? null,
        item3 ?? null,
        bootId || '',
        spell1Id,
        spell2Id,
        runaChave ?? null,
        runaFenda1 ?? null,
        runaFenda2 ?? null,
        runaFenda3 ?? null,
      ]
    );

    return result.insertId;
  }

  /**
   * Busca uma build específica pelo ID com todos os dados enriquecidos.
   */
  static async findById(id: number): Promise<BuildDetalhada | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
          b.ID_build,
          b.nome_build,
          c.nome                  AS nome_campeao,
          c.square_url            AS square_url,
          i1.nome                 AS item_1_nome,
          i1.imagem_url           AS item_1_img,
          i2.nome                 AS item_2_nome,
          i2.imagem_url           AS item_2_img,
          i3.nome                 AS item_3_nome,
          i3.imagem_url           AS item_3_img,
          bota.nome               AS bota_nome,
          bota.imagem_url         AS bota_img,
          r_chave.nome_runa       AS runa_chave_nome,
          r_chave.imagem_url      AS runa_chave_img
       FROM builds b
       LEFT JOIN campeoes  c      ON b.ID_campeao    = c.ID
       LEFT JOIN itens     i1     ON b.item_1_ID     = i1.ID_riot
       LEFT JOIN itens     i2     ON b.item_2_ID     = i2.ID_riot
       LEFT JOIN itens     i3     ON b.item_3_ID     = i3.ID_riot
       LEFT JOIN itens     bota   ON b.ID_bota       = bota.ID_riot
       LEFT JOIN runas     r_chave ON b.ID_runa_chave = r_chave.ID_runa
       WHERE b.ID_build = ?`,
      [id]
    );

    return rows.length > 0 ? (rows[0] as BuildDetalhada) : null;
  }

  /**
   * Exclui uma build pelo ID.
   * Retorna true se uma linha foi afetada (excluída), false caso contrário.
   */
  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM builds WHERE ID_build = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}
