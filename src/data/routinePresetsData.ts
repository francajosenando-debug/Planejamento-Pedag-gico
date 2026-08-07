export interface RoutinePreset {
  id: string;
  category: string;
  title: string;
  description: string;
}

export const DEFAULT_ROUTINE_PRESETS: RoutinePreset[] = [
  {
    id: 'preset-acolhida',
    category: 'Acolhida / Rotina',
    title: 'Acolhida & Devocional Inicial',
    description: '- Higienização: Uso do banheiro e organização dos pertences.\n- Chamada cantada, quadro de tempo e calendário do dia.\n- Momento de oração, louvor e devocional bíblico infantil.'
  },
  {
    id: 'preset-lanche',
    category: 'Lanche & Higiene',
    title: 'Momento do Lanche e Higienização',
    description: '- Higienização das mãos com água e sabão.\n- Oração de agradecimento pelo alimento.\n- Lanche comunitário com autonomia e estímulo às boas maneiras à mesa.'
  },
  {
    id: 'preset-parque',
    category: 'Recreação',
    title: 'Parque e Brincadeiras Livres',
    description: '- Atividade ao ar livre no parque infantil.\n- Desenvolvimento da motricidade ampla, socialização e compartilhamento de brinquedos.\n- Volta à sala com hidratação e higienização.'
  },
  {
    id: 'preset-historia',
    category: 'Contação de História',
    title: 'Hora da História em Roda',
    description: '- Organização do espaço com tapete ou almofadas.\n- Leitura dramatizada com uso de fantoches ou livro ilustrado.\n- Roda de conversa sobre os personagens e aprendizados da história.'
  },
  {
    id: 'preset-bilingue',
    category: 'Idiomas',
    title: 'Momento Bilíngue (English Time)',
    description: '- Warm-up com música em inglês (Hello Song).\n- Apresentação de vocabulário do dia com flashcards e jogos lúdicos.\n- Agradecimento e Goodbye Song.'
  },
  {
    id: 'preset-artes',
    category: 'Artes & Expressão',
    title: 'Oficina de Artes Plásticas',
    description: '- Preparação dos materiais (tintas, pincéis, colagens ou massinha).\n- Atividade de expressão artística guiada focada na coordenação motora fina.\n- Organização do material e limpeza das bancadas pelas crianças.'
  },
  {
    id: 'preset-saida',
    category: 'Encerramento',
    title: 'Organização e Despedida',
    description: '- Guardar os brinquedos e organizar mochilas.\n- Avaliação do dia em roda ("O que mais gostamos de fazer hoje?").\n- Organização da fila para entrega responsável aos pais/guardiões.'
  }
];
