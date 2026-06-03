export const API_BASE_URL = 'https://unibuilds-api.onrender.com/api';

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
 * Atualiza uma build existente no banco de dados
 * @param {number} buildId ID da build a ser atualizada
 * @param {object} buildPayload Dados atualizados da build
 */
export async function atualizarBuild(buildId, buildPayload) {
  try {
    const resposta = await fetch(`${API_BASE_URL}/builds/${buildId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildPayload),
    });
    const json = await resposta.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  } catch (erro) {
    console.error(`Erro ao atualizar build ${buildId} na API:`, erro);
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

/**
 * Realiza o login do usuário na API
 * @param {string} nome Nome do jogador
 * @param {string} senha Senha
 */
export async function apiLogin(nome, senha) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos

    const resposta = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, senha }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    const json = await resposta.json();
    return json; // Retorna o json completo contendo success, message, data ou error
  } catch (erro) {
    console.error('Erro ao realizar login na API:', erro);
    if (erro.name === 'AbortError') {
      return { success: false, error: 'O servidor demorou muito para responder (pode estar hibernando). Aguarde 1 minuto e tente novamente.' };
    }
    return { success: false, error: 'Não foi possível conectar ao servidor.' };
  }
}

/**
 * Cadastra um novo usuário na API
 * @param {string} nome Nome do jogador
 * @param {string} senha Senha
 */
export async function apiCadastro(nome, senha) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos

    const resposta = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, senha }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    const json = await resposta.json();
    return json;
  } catch (erro) {
    console.error('Erro ao cadastrar usuário na API:', erro);
    if (erro.name === 'AbortError') {
      return { success: false, error: 'O servidor demorou muito para responder (pode estar hibernando). Aguarde 1 minuto e tente novamente.' };
    }
    return { success: false, error: 'Não foi possível conectar ao servidor.' };
  }
}
