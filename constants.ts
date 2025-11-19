import { Interpretation, QuestionBlock } from './types';

// ==================================================================================
// 🎨 CONFIGURAÇÃO DA SUA LOGOMARCA
// ==================================================================================
// Coloque o link da sua imagem entre as aspas abaixo.
// Exemplo: "https://sua-empresa.com.br/logo.png"
// Se deixar vazio (""), aparecerá o ícone padrão.
// NOTA: Imagens do Google Drive devem estar com permissão "Qualquer pessoa com o link".
export const URL_DA_LOGO = "https://lh3.googleusercontent.com/d/1N_ZZ3zt59n5Qom0VVwfWC0SFKCy4eLTO";
// ==================================================================================

export const THEME = {
    green: '#1B4D3E',
    greenLight: '#2C6E58',
    card: '#235C4B',
    gold: '#D4AF37',
    bg: '#1B4D3E',
    white: '#FFFFFF',
    text: '#FFFFFF',
    muted: '#A7F3D0',
    danger: '#EF4444'
};

export const TEST_DATA: QuestionBlock[] = [
    { block: 1, title: 'BLOCO 1 — Corpo Sob Alerta', subtitle: '(ansiedade fisiológica)', questions: [
        'Sinto meu coração acelerado sem motivo aparente.',
        'Tenho sensação de aperto no peito ou “falta de ar emocional”.',
        'Sinto tensão muscular constante (pescoço, ombros, mandíbula).',
        'Tenho dificuldade de relaxar, mesmo quando estou tranquila externamente.',
        'Meu corpo parece cansado, mas minha mente continua ativa demais.'
    ]},
    { block: 2, title: 'BLOCO 2 — Mente Acelerada', subtitle: '(padrões de pensamento ansiosos)', questions: [
        'Minha mente cria cenários negativos antes mesmo de acontecerem.',
        'Tenho dificuldade de “desligar” os pensamentos à noite.',
        'Sinto que minha cabeça está sempre buscando o pior resultado.',
        'Tenho pensamentos repetitivos que me drenam energia.',
        'Percebo que pequenas situações viram grandes preocupações na minha mente.'
    ]},
    { block: 3, title: 'BLOCO 3 — Emoções Intensas', subtitle: '(ansiedade emocional)', questions: [
        'Tenho uma sensação constante de que algo ruim vai acontecer.',
        'Me irrito facilmente, mesmo com coisas simples.',
        'Sinto medo ou insegurança sem saber explicar o motivo.',
        'Sinto uma inquietação interna, como se estivesse sempre “em falta”.',
        'Tenho dificuldade de sentir paz mesmo em momentos bons.'
    ]},
    { block: 4, title: 'BLOCO 4 — Comportamentos de Fuga', subtitle: '(ansiedade comportamental)', questions: [
        'Adio decisões por medo de errar.',
        'Evito situações novas porque não sei como vou me sentir.',
        'Tenho dificuldade de me expor, falar, ou mostrar quem sou.',
        'Me ocupo demais para não pensar no que me angustia.',
        'Desisto rápido quando sinto que algo me gera ansiedade.'
    ]},
    { block: 5, title: 'BLOCO 5 — Relações e Pertencimento', subtitle: '(ansiedade relacional)', questions: [
        'Sinto medo de desapontar pessoas.',
        'Busco aprovação com facilidade e me sinto mal quando não recebo.',
        'Sinto que as pessoas esperam mais de mim do que posso dar.',
        'Tenho receio de dizer “não”, mesmo quando preciso.',
        'Sinto dificuldade de confiar que sou amada/o e suficiente.'
    ]}
];

export const INTERPRETATION_RANGES: Interpretation[] = [
    { min: 0, max: 15, level: 'Estado Emocional Estável', colorBg: '#064E3B', colorText: '#6EE7B7', suggestions: 'Você apresenta sinais de boa regulação emocional. Recomenda-se manter hábitos saudáveis e intervenções preventivas.' },
    { min: 16, max: 30, level: 'Ansiedade Inicial (nível adaptativo)', colorBg: '#422006', colorText: '#FDE047', suggestions: 'Há sinais de alerta. Indica sobrecarga emocional e padrões mentais que precisam ser reorganizados. Sugestões CDA: respiração dirigida, reconstrução de crenças, e treino de presença.' },
    { min: 31, max: 45, level: 'Ansiedade Moderada (estado de ameaça interna)', colorBg: '#7C2D12', colorText: '#FFEDD5', suggestions: 'A ansiedade já afeta decisões, humor e corpo. Recomenda-se intervenção terapêutica estruturada. Sugestões CDA: regulação somática, mapeamento de gatilhos, ensaio mental, neuro-ressignificação.' },
    { min: 46, max: 60, level: 'Ansiedade Elevada (ciclo ativo de estresse)', colorBg: '#7F1D1D', colorText: '#FECACA', suggestions: 'A ansiedade já domina rotina e relações. Alta necessidade de acompanhamento terapêutico. Sugestões CDA: protocolos intensivos de aterramento, ressignificação guiada, intervenção em crenças-raiz.' },
    { min: 61, max: 75, level: 'Ansiedade Grave (estado de hiperalerta constante)', colorBg: '#450A0A', colorText: '#FCA5A5', suggestions: 'Há sinais profundos de desconexão emocional, mental e corporal. Requer intervenção imediata e contínua. Sugestões CDA: tratamento emocional profundo, estabilização, e reconstrução identitária.' }
];