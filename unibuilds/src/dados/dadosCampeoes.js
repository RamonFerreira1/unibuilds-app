// Banco de dados falso para os campeões.
// Contém informações completas como história (lore), habilidades e skins.

export const dadosCampeoes = [
  {
    id: '1',
    nome: 'Aatrox',
    titulo: 'A Espada Darkin',
    imagem: 'https://placehold.co//06101E/C8AA6E?text=Aatrox',
    historia: 'Antigamente defensores honrados de Shurima contra o Vazio, Aatrox e seus irmãos acabaram se tornando uma ameaça ainda maior para Runeterra...',
    passiva: { nome: 'Postura do Arauto da Morte', descricao: 'Periodicamente, o próximo ataque básico de Aatrox causa Dano Físico adicional...', imagem: 'https://via.placeholder.com/50' },
    habilidades: [
      { nome: 'A Espada Darkin', descricao: 'Aatrox bate sua espada no chão, causando Dano Físico.', imagem: 'https://via.placeholder.com/50' },
      { nome: 'Correntes Infernais', descricao: 'Aatrox bate no chão, causando dano ao primeiro inimigo atingido.', imagem: 'https://via.placeholder.com/50' },
      { nome: 'Avanço Umbral', descricao: 'Passivo: Aatrox cura-se quando causa dano a Campeões.', imagem: 'https://via.placeholder.com/50' },
      { nome: 'Aniquilador de Mundos', descricao: 'Aatrox libera sua forma demoníaca...', imagem: 'https://via.placeholder.com/50' },
    ],
    skins: [
      { nome: 'Aatrox Clássico', imagem: 'https://placehold.co//06101E/C8AA6E?text=Classic' },
      { nome: 'Aatrox Justiceiro', imagem: 'https://placehold.co//0a1428/00bff3?text=Justiceiro' },
    ]
  },
  {
    id: '2',
    nome: 'Ahri',
    titulo: 'A Raposa de Nove Caudas',
    imagem: 'https://placehold.co//06101E/C8AA6E?text=Ahri',
    historia: 'Com uma conexão inata com o poder latente de Runeterra, Ahri é uma vastaya capaz de transformar magia em orbes de energia bruta...',
    passiva: { nome: 'Roubo de Essência', descricao: 'Ahri recebe acúmulos de Furto de Essência.', imagem: 'https://via.placeholder.com/50' },
    habilidades: [
      { nome: 'Orbe da Ilusão', descricao: 'Ahri lança e puxa de volta seu orbe...', imagem: 'https://via.placeholder.com/50' },
      { nome: 'Fogo de Raposa', descricao: 'Ahri libera fogo de raposa que busca inimigos.', imagem: 'https://via.placeholder.com/50' },
      { nome: 'Encanto', descricao: 'Ahri lança um beijo que causa dano e encanta.', imagem: 'https://via.placeholder.com/50' },
      { nome: 'Ímpeto Espiritual', descricao: 'Ahri avança, causando dano a inimigos próximos.', imagem: 'https://via.placeholder.com/50' },
    ],
    skins: [
      { nome: 'Ahri Clássica', imagem: 'https://placehold.co//06101E/C8AA6E?text=Classic' },
      { nome: 'Ahri Fliperama', imagem: 'https://placehold.co//0a1428/00bff3?text=Fliperama' },
    ]
  },
  // Mais campeões de exemplo gerados automaticamente para economizar linhas
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: String(i + 3),
    nome: `Campeão ${i + 3}`,
    titulo: `O Guerreiro ${i + 3}`,
    imagem: `https://placehold.co//06101E/C8AA6E?text=Champ${i+3}`,
    historia: 'Esta é uma história (lore) de teste gerada apenas para preencher o layout e testar o nosso design...',
    passiva: { nome: 'Habilidade Passiva', descricao: 'Acontece automaticamente no jogo.', imagem: 'https://via.placeholder.com/50' },
    habilidades: [
      { nome: 'Magia 1', descricao: 'Lança fogo.', imagem: 'https://via.placeholder.com/50' },
      { nome: 'Defesa 2', descricao: 'Cria escudo.', imagem: 'https://via.placeholder.com/50' },
      { nome: 'Velocidade 3', descricao: 'Corre muito rápido.', imagem: 'https://via.placeholder.com/50' },
      { nome: 'Poder Especial 4', descricao: 'Habilidade suprema do campeão.', imagem: 'https://via.placeholder.com/50' },
    ],
    skins: [
      { nome: 'Skin Padrão', imagem: 'https://placehold.co//06101E/C8AA6E?text=Skin1' },
      { nome: 'Skin Alternativa', imagem: 'https://placehold.co//0a1428/00bff3?text=Skin2' },
    ]
  }))
];
