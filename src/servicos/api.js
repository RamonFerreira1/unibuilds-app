// Configuração central da API REST do UniBuilds
// IMPORTANTE: Altere o IP para o IP do seu computador na rede local (como verificado via ipconfig)
export const API_BASE_URL = 'http://192.168.0.110:3000/api';

/**
 * Busca a lista resumida de todos os campeões
 */
export async function obterCampeoes() {
  try {
    const resposta = await fetch(`${API_BASE_URL}/champions`);
    const json = await resposta.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  } catch (erro) {
    console.error('Erro ao obter campeões da API:', erro);
    throw erro;
  }
}

/**
 * Busca os detalhes completos de um campeão por ID (incluindo habilidades e skins)
 */
export async function obterDetalheCampeao(id) {
  try {
    const resposta = await fetch(`${API_BASE_URL}/champions/${id}`);
    const json = await resposta.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  } catch (erro) {
    console.error(`Erro ao obter detalhes do campeão ${id} da API:`, erro);
    throw erro;
  }
}

/**
 * Busca a lista completa de itens
 */
export async function obterItens() {
  try {
    const resposta = await fetch(`${API_BASE_URL}/items`);
    const json = await resposta.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  } catch (erro) {
    console.error('Erro ao obter itens da API:', erro);
    throw erro;
  }
}

/**
 * Busca as runas organizadas por árvore
 */
export async function obterRunas() {
  try {
    const resposta = await fetch(`${API_BASE_URL}/runes`);
    const json = await resposta.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  } catch (erro) {
    console.error('Erro ao obter runas da API:', erro);
    throw erro;
  }
}

/**
 * Salva uma nova build no banco de dados
 * @param {object} buildPayload Dados da build
 */
export async function criarBuild(buildPayload) {
  try {
    const resposta = await fetch(`${API_BASE_URL}/builds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildPayload),
    });
    const json = await resposta.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  } catch (erro) {
    console.error('Erro ao criar build na API:', erro);
    throw erro;
  }
}

/**
 * Busca as builds de um determinado usuário
 * @param {string} userId ID do usuário
 */
export async function obterBuildsDoUsuario(userId) {
  try {
    const resposta = await fetch(`${API_BASE_URL}/builds/user/${userId}`);
    const json = await resposta.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  } catch (erro) {
    console.error(`Erro ao obter builds do usuário ${userId}:`, erro);
    throw erro;
  }
}

/**
 * Exclui uma build específica do banco de dados pelo seu ID
 * @param {number} buildId ID da build
 */
export async function excluirBuild(buildId) {
  try {
    const resposta = await fetch(`${API_BASE_URL}/builds/${buildId}`, {
      method: 'DELETE',
    });
    const json = await resposta.json();
    if (!json.success) throw new Error(json.error);
    return json;
  } catch (erro) {
    console.error(`Erro ao excluir build ${buildId}:`, erro);
    throw erro;
  }
}
