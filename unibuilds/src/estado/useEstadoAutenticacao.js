import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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

// Este é o nosso estado global para saber quem está logado no app.
// Ele persiste apenas o nomeUsuario para que o login se mantenha ativo no F5.
export const useEstadoAutenticacao = create(
  persist(
    (set, get) => ({
      nomeUsuario: null, // Começamos com nenhum usuário logado (null)
      
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
          set({ nomeUsuario: resposta.data.nome });
          return { sucesso: true };
        }
        return { 
          sucesso: false, 
          mensagem: resposta.error || "Nome do jogador ou senha incorretos." 
        };
      },
      
      // Função para deslogar (limpar o nome)
      logout: () => set({ nomeUsuario: null }),
    }),
    {
      name: 'unibuilds-auth-data',
      storage: createJSONStorage(() => safeStorage),
      // Salva apenas o nomeUsuario no local storage para segurança
      partialize: (state) => ({ nomeUsuario: state.nomeUsuario }),
    }
  )
);
