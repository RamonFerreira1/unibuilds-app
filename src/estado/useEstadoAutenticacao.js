// Importamos o Zustand, uma biblioteca bem leve para salvar estados (informações) globais.
import { create } from 'zustand';

// Este é o nosso "banco de dados" temporário para saber quem está logado no app e quais contas existem.
export const useEstadoAutenticacao = create((set, get) => ({
  nomeUsuario: null, // Começamos com nenhum usuário logado (null)
  
  // Contas salvas localmente em memória
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
}));
