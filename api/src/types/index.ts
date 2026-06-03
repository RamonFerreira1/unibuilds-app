// =============================================================
// Tipagens TypeScript que espelham as tabelas do banco de dados
// league_of_legends
// =============================================================

// ─── Campeões ─────────────────────────────────────────────────

export interface Campeao {
  ID: number;
  nome: string;
  titulo: string | null;
  splash_url: string;
  loading_url: string;
  square_url: string;
}

export interface Habilidade {
  ID_habilidade: string;
  ID_campeao: number;
  tecla: string;
  nome_habilidade: string;
  descricao: string;
  imagem_url: string;
}

export interface Skin {
  ID_skin: number;
  ID_campeao: number;
  nome_skin: string;
  num_skin: number;
  splash_url: string;
  loading_url: string;
}

export interface CampeaoDetalhado extends Campeao {
  habilidades: Habilidade[];
  skins: Skin[];
}

// ─── Itens ────────────────────────────────────────────────────

export interface Item {
  ID_riot: number;
  nome: string | null;
  descricao: string | null;
  preco: number | null;
  imagem_url: string;
}

// ─── Runas ────────────────────────────────────────────────────

export interface Runa {
  ID_runa: number;
  nome_runa: string;
  nome_arvore: string;
  descricao: string;
  imagem_url: string;
  slot: number;
}

export interface ArvoreDeRunas {
  nome_arvore: string;
  keystones: Runa[];     // slot === 0
  slots: Runa[][];       // slots 1, 2, 3 agrupados
}

// ─── Spells ───────────────────────────────────────────────────

export interface Spell {
  ID_spell: number;
  nome: string;
  descricao: string;
  cooldown: number;
  imagem_url: string;
}

// ─── Builds ───────────────────────────────────────────────────

export interface Build {
  ID_build: number;
  ID_campeao: number | null;
  item_1_ID: number | null;
  item_2_ID: number | null;
  item_3_ID: number | null;
  ID_bota: string;
  ID_spell_1: number;
  ID_spell_2: number;
  ID_runa_chave: number | null;
  ID_runa_fenda1: number | null;
  ID_runa_fenda2: number | null;
  ID_runa_fenda3: number | null;
}

/**
 * Payload esperado na criação de uma build (POST /api/builds)
 */
export interface CreateBuildPayload {
  userId: string;       // Identificador do usuário do front-end
  nomeBuild?: string;   // Nome personalizado da build
  championId: number;   // ID do campeão
  items: number[];      // Array de até 3 IDs de itens (sem botas)
  bootId?: string;      // ID da bota (varchar)
  spell1Id?: number;
  spell2Id?: number;
  runes?: number[];     // [ID_runa_chave, ID_runa_fenda1, ID_runa_fenda2, ID_runa_fenda3]
}

/**
 * Resultado de build enriquecido com JOINs para exibição
 */
export interface BuildDetalhada {
  ID_build: number;
  nome_build: string | null;
  ID_campeao: number | null;
  item_1_ID: number | null;
  item_2_ID: number | null;
  item_3_ID: number | null;
  ID_bota: string | null;
  ID_runa_chave: number | null;
  ID_runa_fenda1: number | null;
  ID_runa_fenda2: number | null;
  ID_runa_fenda3: number | null;
  nome_campeao: string;
  square_url: string;
  item_1_nome: string | null;
  item_1_img: string | null;
  item_2_nome: string | null;
  item_2_img: string | null;
  item_3_nome: string | null;
  item_3_img: string | null;
  bota_nome: string | null;
  bota_img: string | null;
  runa_chave_nome: string | null;
  runa_chave_img: string | null;
}

// ─── Usuários ─────────────────────────────────────────────────

export interface Usuario {
  id: number;
  nome: string;
  senha?: string;
}

// ─── Respostas Padrão da API ──────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
