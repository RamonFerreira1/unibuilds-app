// Este arquivo funciona como um "banco de dados falso" (Mock) para os itens do jogo.
// Como não temos um backend (servidor real) ainda, criamos esses dados na mão para testar a interface.

export const dadosItens = [
  {
    id: '1',
    nome: 'Gume do Infinito',
    preco: 3400,
    atributos: '+65 Dano de Ataque\n+20% Chance de Acerto Crítico',
    descricao: 'Ataques críticos causam mais dano.',
    imagem: 'https://placehold.co//06101E/C8AA6E?text=Gume'
  },
  {
    id: '2',
    nome: 'Capuz da Morte de Rabadon',
    preco: 3600,
    atributos: '+120 Poder de Habilidade',
    descricao: 'Aumenta seu Poder de Habilidade total em 35%.',
    imagem: 'https://placehold.co//0a1428/00bff3?text=Rabadon'
  },
  {
    id: '3',
    nome: 'Armadura de Espinhos',
    preco: 2700,
    atributos: '+350 Vida\n+70 Armadura',
    descricao: 'Ao ser atingido por um ataque, reflete Dano Mágico ao atacante e aplica Feridas Dolorosas.',
    imagem: 'https://placehold.co//06101E/C8AA6E?text=Espinhos'
  },
  {
    id: '4',
    nome: 'Força da Trindade',
    preco: 3333,
    atributos: '+40 Dano de Ataque\n+35% Velocidade de Ataque\n+300 Vida\n+20 Aceleração de Habilidade',
    descricao: 'Após usar uma habilidade, o próximo ataque causará Dano Físico adicional.',
    imagem: 'https://placehold.co//0a1428/00bff3?text=Trindade'
  },
  // Gerando alguns itens extras automaticamente com o uso de um laço for (Array.map) para não digitar um por um
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: String(i + 5),
    nome: `Item Mágico ${i + 5}`,
    preco: 2500 + (i * 100),
    atributos: `+${20 + i} Atributo Genérico`,
    descricao: 'Este item concede atributos fantásticos para o combate nas trincheiras de Summoners Rift.',
    imagem: `https://placehold.co//06101E/C8AA6E?text=Item${i+5}`
  }))
];
