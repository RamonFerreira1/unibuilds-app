// Importamos o Zustand, uma biblioteca bem leve para salvar estados (informações) globais.
import { create } from 'zustand';

// Este é o nosso "banco de dados" temporário para saber quem está logado no app.
export const useEstadoAutenticacao = create((set) => ({
  nomeUsuario: null, // Começamos com nenhum usuário logado (null)
  
  // Função para fazer o login (salvar o nome do usuário)
  login: (nome) => set({ nomeUsuario: nome }),
  
  // Função para deslogar (limpar o nome)
  logout: () => set({ nomeUsuario: null }),
}));
