import { create } from 'zustand';

// Aqui salvamos todas as escolhas que o usuário faz na tela do "Criador de Builds".
// Se o usuário sair da tela e voltar, os dados continuam salvos aqui na memória.
export const useEstadoBuild = create((set) => ({
  nomeDaBuild: '', // Nome que o usuário digita para a build
  setNomeDaBuild: (nome) => set({ nomeDaBuild: nome }),
  
  buildIdEdicao: null, // ID da build sendo editada (se for edição)
  setBuildIdEdicao: (id) => set({ buildIdEdicao: id }),

  campeaoSelecionado: null, // Campeão escolhido na lista
  setCampeao: (campeao) => set({ campeaoSelecionado: campeao }),
  
  // Array de 4 espaços vazios para os itens (3 slots comuns + 1 bota)
  itensSelecionados: Array(4).fill(null), 
  
  // Função para substituir um item no array pelo item escolhido
  setItem: (indice, item) => set((estado) => {
    const novosItens = [...estado.itensSelecionados];
    novosItens[indice] = item;
    return { itensSelecionados: novosItens };
  }),
  
  // Função para remover um item do array
  removerItem: (indice) => set((estado) => {
    const novosItens = [...estado.itensSelecionados];
    novosItens[indice] = null;
    return { itensSelecionados: novosItens };
  }),
  
  arvoreDeRunas: null, // Caminho de runas escolhido (ex: Precisão)
  setArvoreDeRunas: (arvore) => set({ 
    arvoreDeRunas: arvore, 
    runaPrincipal: null, 
    fragmentos: [null, null, null] 
  }), // Sempre que muda a árvore, resetamos as runas menores
  
  runaPrincipal: null,
  setRunaPrincipal: (runa) => set({ runaPrincipal: runa }),
  
  fragmentos: [null, null, null], // 3 espaços para runas menores (shards)
  setFragmento: (indice, runa) => set((estado) => {
    const novosFragmentos = [...estado.fragmentos];
    novosFragmentos[indice] = runa;
    return { fragmentos: novosFragmentos };
  }),

  // Reseta TUDO para o estado inicial — chamado após salvar a build com sucesso
  resetarBuild: () => set({
    buildIdEdicao: null,
    nomeDaBuild: '',
    campeaoSelecionado: null,
    itensSelecionados: Array(4).fill(null),
    arvoreDeRunas: null,
    runaPrincipal: null,
    fragmentos: [null, null, null],
  }),
}));
