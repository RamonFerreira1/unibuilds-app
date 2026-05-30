// Banco de dados falso para as Runas.
// As runas são agrupadas em "Árvores" (ex: Precisão, Dominação).

// Uma pequena função auxiliar para gerar runas repetidas e não precisarmos escrever tudo manualmente
const gerarRunasDeExemplo = (nomeDoEspaco, quantidade) => {
  return Array.from({ length: quantidade }).map((_, i) => ({
    id: `${nomeDoEspaco}-${i + 1}`,
    nome: `${nomeDoEspaco} ${i + 1}`,
    imagem: `https://via.placeholder.com/50/06101E/C8AA6E?text=R${i+1}`
  }));
};

export const dadosRunas = [
  {
    id: 'precisao',
    nome: 'Precisão',
    imagem: 'https://via.placeholder.com/60/0a1428/00bff3?text=Prec',
    runasPrincipais: [
      { id: 'p-k1', nome: 'Pressione o Ataque', imagem: 'https://via.placeholder.com/60/06101E/C8AA6E?text=PtA' },
      { id: 'p-k2', nome: 'Ritmo Fatal', imagem: 'https://via.placeholder.com/60/06101E/C8AA6E?text=RF' },
      { id: 'p-k3', nome: 'Conquistador', imagem: 'https://via.placeholder.com/60/06101E/C8AA6E?text=Conq' },
    ],
    espaco1: gerarRunasDeExemplo('Precisão Espaço 1', 3),
    espaco2: gerarRunasDeExemplo('Precisão Espaço 2', 3),
    espaco3: gerarRunasDeExemplo('Precisão Espaço 3', 3),
  },
  {
    id: 'dominacao',
    nome: 'Dominação',
    imagem: 'https://via.placeholder.com/60/06101E/C8AA6E?text=Dom',
    runasPrincipais: [
      { id: 'd-k1', nome: 'Eletrocutar', imagem: 'https://via.placeholder.com/60/0a1428/00bff3?text=Elec' },
      { id: 'd-k2', nome: 'Colheita Sombria', imagem: 'https://via.placeholder.com/60/0a1428/00bff3?text=CS' },
      { id: 'd-k3', nome: 'Chuva de Lâminas', imagem: 'https://via.placeholder.com/60/0a1428/00bff3?text=CL' },
    ],
    espaco1: gerarRunasDeExemplo('Dominação Espaço 1', 3),
    espaco2: gerarRunasDeExemplo('Dominação Espaço 2', 3),
    espaco3: gerarRunasDeExemplo('Dominação Espaço 3', 3),
  },
  {
    id: 'feiticaria',
    nome: 'Feitiçaria',
    imagem: 'https://via.placeholder.com/60/0a1428/00bff3?text=Sor',
    runasPrincipais: [
      { id: 's-k1', nome: 'Invocar Aery', imagem: 'https://via.placeholder.com/60/06101E/C8AA6E?text=Aery' },
      { id: 's-k2', nome: 'Cometa Arcano', imagem: 'https://via.placeholder.com/60/06101E/C8AA6E?text=Com' },
      { id: 's-k3', nome: 'Ímpeto Gradual', imagem: 'https://via.placeholder.com/60/06101E/C8AA6E?text=IG' },
    ],
    espaco1: gerarRunasDeExemplo('Feitiçaria Espaço 1', 3),
    espaco2: gerarRunasDeExemplo('Feitiçaria Espaço 2', 3),
    espaco3: gerarRunasDeExemplo('Feitiçaria Espaço 3', 3),
  }
];
