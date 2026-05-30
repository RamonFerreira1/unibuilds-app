import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

// Este é o nosso estado global para saber quem está logado no app e quais contas existem.
// Ele persiste as contas salvas localmente para que o usuário não as perca ao atualizar a página.
export const useEstadoAutenticacao = create(
  persist(
    (set, get) => ({
      nomeUsuario: null, // Começamos com nenhum usuário logado (null)
      
      // Contas salvas inicialmente (padrão)
      contasCadastradas: [
        { nome: 'invocador', senha: '123' },
        { nome: 'admin', senha: 'admin' }
      ],
      
      // Tenta cadastrar uma nova conta
      cadastrarConta: (nome, senha) => {
        const contas = get().contasCadastradas;
        const jaExiste = contas.some(c => c.nome.toLowerCase() === nome.toLowerCase());
        
        if (jaExiste) {
          return { sucesso: false, mensagem: "Este nome de jogador já está em uso!" };
        }
        
        set({
          contasCadastradas: [...contas, { nome, senha }]
        });
        return { sucesso: true };
      },
      
      // Tenta fazer o login verificando as credenciais no array de contas
      login: (nome, senha) => {
        const contas = get().contasCadastradas;
        const contaValida = contas.find(
          c => c.nome.toLowerCase() === nome.toLowerCase() && c.senha === senha
        );
        
        if (contaValida) {
          set({ nomeUsuario: contaValida.nome });
          return { sucesso: true };
        }
        
        return { sucesso: false, mensagem: "Nome do jogador ou senha incorretos." };
      },
      
      // Função para deslogar (limpar o nome)
      logout: () => set({ nomeUsuario: null }),
    }),
    {
      name: 'unibuilds-auth-data',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
