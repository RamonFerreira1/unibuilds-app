import pool from '../config/database';
import { Runa, ArvoreDeRunas } from '../types';
import { RowDataPacket } from 'mysql2';

/**
 * Model de Runas
 * Encapsula queries da tabela `runas` e organiza
 * o resultado em árvores de runas para o front-end.
 */
export class RunaModel {

  /**
   * Busca todas as runas agrupadas por árvore (nome_arvore)
   * e organizadas por slot.
   *
   * Estrutura de slots:
   * - slot 0 → Keystones (runas principais)
   * - slot 1 → Fenda 1
   * - slot 2 → Fenda 2
   * - slot 3 → Fenda 3
   */
  static async findAllOrganizadas(): Promise<ArvoreDeRunas[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT ID_runa, nome_runa, nome_arvore, descricao, imagem_url, slot
       FROM runas
       ORDER BY nome_arvore ASC, slot ASC`
    );

    const runas = rows as Runa[];

    // Agrupa as runas por árvore
    const arvoresMap = new Map<string, Runa[]>();
    for (const runa of runas) {
      if (!arvoresMap.has(runa.nome_arvore)) {
        arvoresMap.set(runa.nome_arvore, []);
      }
      arvoresMap.get(runa.nome_arvore)!.push(runa);
    }

    // Formata a resposta com separação entre keystones e slots
    const resultado: ArvoreDeRunas[] = [];
    for (const [nomeArvore, runasArvore] of arvoresMap.entries()) {
      const keystones = runasArvore.filter((r) => r.slot === 0);
      const slot1 = runasArvore.filter((r) => r.slot === 1);
      const slot2 = runasArvore.filter((r) => r.slot === 2);
      const slot3 = runasArvore.filter((r) => r.slot === 3);

      resultado.push({
        nome_arvore: nomeArvore,
        keystones,
        slots: [slot1, slot2, slot3],
      });
    }

    return resultado;
  }

  /**
   * Busca uma runa específica pelo ID.
   */
  static async findById(id: number): Promise<Runa | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT ID_runa, nome_runa, nome_arvore, descricao, imagem_url, slot
       FROM runas
       WHERE ID_runa = ?`,
      [id]
    );
    return rows.length > 0 ? (rows[0] as Runa) : null;
  }
}
