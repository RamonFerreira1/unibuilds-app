import { create } from 'zustand';
import { apiLogin, apiCadastro } from '../servicos/api';

// Mecanismo de armazenamento seguro compatível com Web (localStorage) e Mobile (sem quebrar se ausente)
const safeStorage = {
  getItem: (name) => {
    try {
      return typeof window !== 'undefined' && window.localStorage
        ? window.localStorage.getItem(name)
        : null;
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(name, value);
      }
    } catch {}
  },
  removeItem: (name) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(name);
      }
    } catch {}
  }
};

// Recupera o estado inicial mantendo a estrutura original do Zustand persist (para não deslogar quem já tem sessão local)
let usuarioInicial = null;
try {
  const stored = safeStorage.getItem('unibuilds-auth-data');
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed && parsed.state && parsed.state.nomeUsuario) {
      usuarioInicial = parsed.state.nomeUsuario;
    }
  }
} catch (e) {}

// Este é o nosso estado global para saber quem está logado no app.
// Persistência manual do nomeUsuario para que o login se mantenha ativo no F5 (sem quebrar por causa do import.meta no bundler).
export const useEstadoAutenticacao = create((set, get) => ({
  nomeUsuario: usuarioInicial, // Começamos com nenhum usuário logado, exceto se houver cache local
  
  // Tenta cadastrar uma nova conta na API real
  cadastrarConta: async (nome, senha) => {
    const resposta = await apiCadastro(nome, senha);
    if (resposta.success) {
      return { sucesso: true };
    }
    return { 
      sucesso: false, 
      mensagem: resposta.error || "Não foi possível criar a conta. Tente novamente." 
    };
  },
  
  // Tenta fazer o login verificando as credenciais na API real
  login: async (nome, senha) => {
    const resposta = await apiLogin(nome, senha);
    if (resposta.success) {
      // Salva no localStorage mantendo a estrutura pra retrocompatibilidade
      safeStorage.setItem('unibuilds-auth-data', JSON.stringify({ state: { nomeUsuario: resposta.data.nome }, version: 0 }));
      set({ nomeUsuario: resposta.data.nome });
      return { sucesso: true };
    }
    return { 
      sucesso: false, 
      mensagem: resposta.error || "Nome do jogador ou senha incorretos." 
    };
  },
  
  // Função para deslogar (limpar o nome)
  logout: () => {
    safeStorage.removeItem('unibuilds-auth-data');
    set({ nomeUsuario: null });
  },
}));
