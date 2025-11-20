import { Interpretation, QuestionBlock } from './types';

// ==================================================================================
// 🎨 CONFIGURAÇÃO DA SUA LOGOMARCA
// ==================================================================================
// Coloque o link da sua imagem entre as aspas abaixo.
// Exemplo: "https://sua-empresa.com.br/logo.png"
// Se deixar vazio (""), aparecerá o ícone padrão.
// NOTA: Imagens do Google Drive devem estar com permissão "Qualquer pessoa com o link".
export const URL_DA_LOGO = "https://drive.google.com/thumbnail?id=1LbXWpO0iA_qqoSB1wG_VTvHVcpUKMnGu&sz=w1000";
// ==================================================================================

export const THEME = {
    green: '#1B4D3E',
    greenLight: '#2C6E58',
    card: '#235C4B', // Dark Green Card
    gold: '#D4AF37',
    bg: '#1B4D3E', // Dark Green Background
    white: '#FFFFFF',
    text: '#FFFFFF', // White text
    muted: '#D1D5DB', // Light Gray text
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
    { min: 0, max: 15, level: 'Estado Emocional Estável', colorBg: '#ECFDF5', colorText: '#065F46', suggestions: 'Você apresenta sinais de boa regulação emocional. Recomenda-se manter hábitos saudáveis e intervenções preventivas.' },
    { min: 16, max: 30, level: 'Ansiedade Inicial (nível adaptativo)', colorBg: '#FEFCE8', colorText: '#854D0E', suggestions: 'Sugestão CDA: Procure a ajuda de um bom terapeuta.' },
    { min: 31, max: 45, level: 'Ansiedade Moderada (estado de ameaça interna)', colorBg: '#FFF7ED', colorText: '#9A3412', suggestions: 'Ansiedade afetando decisões, humor e corpo. Sugestão CDA: Procure a ajuda de um bom terapeuta.' },
    { min: 46, max: 60, level: 'Ansiedade Elevada (ciclo ativo de estresse)', colorBg: '#FEF2F2', colorText: '#991B1B', suggestions: 'Ansiedade dominando rotina e relações. Sugestão CDA: Procure a ajuda de um bom terapeuta.' },
    { min: 61, max: 75, level: 'Ansiedade Grave (estado de hiperalerta constante)', colorBg: '#FEF2F2', colorText: '#991B1B', suggestions: 'Sinais profundos de desconexão emocional. Sugestão CDA: Procure a ajuda de um bom terapeuta.' }
];