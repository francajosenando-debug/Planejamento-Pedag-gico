import { BibleLesson } from '../types';

export const SAMPLE_BIBLE_LESSONS: BibleLesson[] = [
  {
    id: 'bible-lesson-1',
    userId: 'default-user',
    title: 'A Arca de Noé - Obediência e Proteção',
    passage: 'Gênesis 6:9-22 e cap. 7 e 8',
    keyVerse: 'Pela fé Noé, divinamente avisado das coisas que ainda não se viam, temeu e preparou a arca. (Hebreus 11:7)',
    principle: 'Obediência e Cuidado de Deus',
    objectives: 'Compreender que obedecer a Deus traz proteção e benção. Desenvolver o amor e o cuidado com os animais e com a natureza.',
    ageRange: '3 a 6 anos',
    materials: 'Caixa de papelão em formato de arca, gravuras ou bichinhos de brinquedo em pares, papel colorido, tinta gouache e algodão.',
    development: `1. ACOLHIDA & MÚSICA: Cantar a música "Os Animais Entraram na Arca" acompanhada de gestos lúdicos.
2. HISTÓRIA ILUSTRADA: Apresentar Noé construindo a arca obedecendo a Deus. Colocar cada par de bichinhos dentro da arca de papelão.
3. MOMENTO DE REFLEXÃO: Explicar como Noé cuidou da sua família e dos animais porque confiou nas ordens de Deus.
4. ATIVIDADE PRÁTICA: Pintura a dedo da arca e colagem de algodão para fazer as nuvens e o arco-íris da promessa.
5. ORAÇÃO FINAL: Agradecer a Deus pela nossa família, pela nossa casa e pela proteção divina.`,
    isFavorite: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'bible-lesson-2',
    userId: 'default-user',
    title: 'Davi e o Gigante Golias - Fé e Coragem',
    passage: '1 Samuel 17:1-50',
    keyVerse: 'O Senhor é a minha luz e a minha salvação; a quem temerei? (Salmos 27:1)',
    principle: 'Coragem e Confiança em Deus',
    objectives: 'Ensinar que mesmo sendo pequeninos podemos vencer grandes desafios com a ajuda e a presença de Deus.',
    ageRange: '3 a 6 anos',
    materials: 'Pedrinhas de papel/EVA amassado, coroa de papelão, cajado de pastorzinho e painel do gigante.',
    development: `1. RODINHA DE CONVERSA: Perguntar quem já sentiu medo do escuro ou de barulhos e como Deus nos dá coragem.
2. HISTÓRIA DRAMATIZADA: Apresentar o pequeno pastor Davi que cuidava das ovelhinhas e confiou no Senhor para enfrentar o gigante Golias.
3. DINÂMICA LÚDICA: Atirar 5 pedrinhas de papel em um alvo para simbolizar a vitória da fé sobre o medo.
4. VERSÍCULO MEMORIZADO: Repetir o Salmo 27:1 com palmas rítmicas.
5. ORAÇÃO: Pedir a Deus um coração valente e cheio de fé todos os dias.`,
    isFavorite: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'bible-lesson-3',
    userId: 'default-user',
    title: 'O Bom Samaritano - Amor ao Próximo',
    passage: 'Lucas 10:25-37',
    keyVerse: 'Ame o seu próximo como a si mesmo. (Lucas 10:27)',
    principle: 'Empatia, Bondade e Amizade',
    objectives: 'Estimular atitudes de ajuda aos colegas, compaixão e amor prático no dia a dia da sala de aula.',
    ageRange: '3 a 6 anos',
    materials: 'Ataduras de gaze ou tecido, maleta de primeiro socorros infantil de brinquedo, historinha com fantoches.',
    development: `1. SENSIBILIZAÇÃO: Mostrar figuras de crianças ajudando umas às outras a se levantar ou dividir um brinquedo.
2. HISTÓRIA DA PARÁBOLA: Contar a história do viajante ferido e como o bom samaritano parou para cuidar com carinho.
3. TEATRINHO DE FANTOCHES: Encenar a parábola convidando as crianças a fazer o "curativo do amor".
4. COMPROMISSO DO DIA: Fazer uma boa ação para um coleguinha na hora do lanche.
5. ORAÇÃO FINAL: Pedir a Deus um coração bondoso e generoso.`,
    isFavorite: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'bible-lesson-4',
    userId: 'default-user',
    title: 'Jesus Acalma a Tempestade - Paz no Coração',
    passage: 'Marcos 4:35-41',
    keyVerse: 'Acalma-te, emudece! E o vento aquietou-se, e fez-se grande bonança. (Marcos 4:39)',
    principle: 'Paz e Soberania de Jesus',
    objectives: 'Compreender que Jesus tem todo o poder sobre os elementos e nos traz paz mesmo nos momentos difíceis.',
    ageRange: '3 a 6 anos',
    materials: 'Bacia com água, barquinhos de papel, borrifador de água e tecido azul para simular o mar.',
    development: `1. EXPERIÊNCIA SENSORIAL: Mexer no tecido azul e borrifar gotinhas de água simulando a tempestade no mar da Galileia.
2. HISTÓRIA NARRADA: Mostrar os discípulos assustados no barco enquanto Jesus dormia em paz, e como ao Seu comando tudo ficou calmo.
3. DINÂMICA DA PAZ: Respirar fundo e dizer "Paz de Jesus no meu coração".
4. CONFECÇÃO DE BARQUINHOS: Dobradura simples de barco de papel para cada criança levar para casa.
5. ORAÇÃO: Agradecer a Jesus pela segurança e pela paz que Ele nos dá.`,
    isFavorite: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'bible-lesson-5',
    userId: 'default-user',
    title: 'A Criação do Mundo - Gratidão pelo Criador',
    passage: 'Gênesis 1:1-31',
    keyVerse: 'No princípio criou Deus os céus e a terra. (Gênesis 1:1)',
    principle: 'Gratidão e Preservação da Natureza',
    objectives: 'Reconhecer Deus como o amoroso Criador de tudo o que existe e praticar o cuidado com o meio ambiente.',
    ageRange: '3 a 6 anos',
    materials: 'Lanterna, folhas de árvores, frutas frescas para degustação, fotos de animais e céu estrelado.',
    development: `1. CAMINHO DOS DIAS DA CRIAÇÃO: Perpassar os 6 dias da criação com estímulos visuais, táteis e gustativos.
2. CONTAÇÃO DE HISTÓRIA: Apresentar a beleza das plantas, dos frutos, dos animais e do ser humano criados por Deus.
3. ATIVIDADE DE DEGUSTAÇÃO: Provar frutas deliciosas criadas por Deus e agradecer.
4. PAINEL COLETIVO: Fazer uma colagem com elementos da natureza (folhas secas, flores, fotos de bichinhos).
5. ORAÇÃO DE LOUVOR: Celebrar a grandeza e o amor do nosso Deus Criador.`,
    isFavorite: true,
    createdAt: new Date().toISOString()
  }
];
