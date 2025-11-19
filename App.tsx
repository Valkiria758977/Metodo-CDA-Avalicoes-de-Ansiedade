import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, LabelList } from 'recharts';
import { 
    THEME, 
    TEST_DATA, 
    URL_DA_LOGO, 
    INTERPRETATION_RANGES 
} from './constants';
import { AppState, Result } from './types';
import { storageService } from './services/storageService';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { Modal } from './components/Modal';
import { ProgressBar } from './components/ProgressBar';
import * as Icons from './components/Icons';

export default function App() {
    const [state, setState] = useState<AppState>({
        loading: true,
        user: null,
        view: 'test',
        answers: {},
        result: null,
        history: [],
        error: null,
        isOffline: false,
        showClearModal: false
    });
    
    // Estado para controlar erro no carregamento da logo
    const [logoError, setLogoError] = useState(false);

    // Initialize
    useEffect(() => {
        const init = async () => {
            // Simulate a small delay for loading state visualization or auth check
            setTimeout(() => {
                setState(s => ({ 
                    ...s, 
                    loading: false, 
                    isOffline: storageService.isOffline(),
                    user: { uid: storageService.getUserId() } 
                }));
            }, 500);

            // Subscribe to history updates
            const unsubscribe = storageService.subscribeHistory((history) => {
                setState(s => ({ ...s, history }));
            });
            
            return () => unsubscribe();
        };
        init();
    }, []);

    const handleAnswer = (globalIdx: number, val: number) => {
        setState(s => ({ ...s, answers: { ...s.answers, [globalIdx]: val } }));
    };

    const calculateResult = async () => {
        let total = 0;
        const blocks: Record<string, number> = { B1: 0, B2: 0, B3: 0, B4: 0, B5: 0 };
        
        for (let i = 0; i < 25; i++) {
            const val = state.answers[i] || 0;
            total += val;
            const blockIdx = Math.floor(i / 5) + 1;
            blocks[`B${blockIdx}`] += val;
        }

        const interpretation = INTERPRETATION_RANGES.find(r => total >= r.min && total <= r.max) || INTERPRETATION_RANGES[0];
        
        const resultData = {
            totalScore: total,
            blockScores: blocks,
            level: interpretation.level,
            suggestions: interpretation.suggestions,
            colorBg: interpretation.colorBg,
            colorText: interpretation.colorText,
            date: new Date().toISOString()
        };

        try {
            const savedResult = await storageService.saveResult(resultData);
            setState(s => ({ 
                ...s, 
                result: savedResult, 
                view: 'result', 
                answers: {} 
            }));
            window.scrollTo(0, 0);
        } catch (error) {
            console.error("Error saving result", error);
            setState(s => ({ ...s, error: "Erro ao salvar resultado." }));
        }
    };

    const clearHistory = async () => {
        await storageService.clearHistory();
        setState(s => ({ ...s, showClearModal: false }));
    };

    // Helpers para cores do gráfico
    const getBarColor = (val: number) => {
        if (val > 10) return "url(#colorDanger)";
        if (val > 5) return "url(#colorWarning)";
        return "url(#colorSafe)";
    };
    
    const getBarGradientClass = (val: number) => {
        if (val > 10) return "from-red-500 to-red-700";
        if (val > 5) return "from-yellow-400 to-yellow-600";
        return "from-emerald-400 to-emerald-600";
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const val = payload[0].value;
            let status = "Baixa Ansiedade";
            let color = "#34D399";
            if (val > 5) { status = "Atenção"; color = "#FBBF24"; }
            if (val > 10) { status = "Alta Ansiedade"; color = "#EF4444"; }

            return (
                <div className="bg-cda-green/90 backdrop-blur-md border border-cda-gold p-3 rounded-lg shadow-xl">
                    <p className="font-bold text-white mb-1">{label}</p>
                    <p className="text-sm text-gray-200">Pontuação: <span className="font-bold text-white text-lg">{val}</span>/15</p>
                    <p className="text-xs uppercase tracking-wider font-bold mt-1" style={{ color }}>{status}</p>
                </div>
            );
        }
        return null;
    };

    if (state.loading) return (
        <div className="min-h-screen flex items-center justify-center bg-cda-bg text-cda-gold">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cda-gold mb-4"></div>
                <div className="text-xl font-bold font-serif">Carregando Método CDA...</div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen font-sans flex flex-col bg-cda-bg text-white">
            {/* Header */}
            <header className="sticky top-0 z-40 shadow-lg bg-cda-green border-b border-cda-greenLight/50 transition-all duration-300">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4 md:gap-6">
                         <div className={`h-16 w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center overflow-hidden border-2 border-cda-gold shadow-lg shrink-0 ${URL_DA_LOGO && !logoError ? 'bg-cda-green' : 'bg-white/10 text-yellow-400'}`}>
                            {URL_DA_LOGO && !logoError ? (
                                <img 
                                    src={URL_DA_LOGO} 
                                    alt="Logo" 
                                    className="w-full h-full object-cover" 
                                    referrerPolicy="no-referrer"
                                    onError={() => setLogoError(true)}
                                />
                            ) : (
                                <Icons.LogoPlaceholder />
                            )}
                        </div>
                        
                        <div className="flex flex-col justify-center">
                            <h1 className="text-xl md:text-3xl font-bold tracking-wide font-serif leading-tight text-white">
                                Método CDA<span className="text-[0.4em] align-top ml-0.5 text-cda-gold">®</span>
                            </h1>
                            <p className="text-sm md:text-base uppercase tracking-wider opacity-90 text-cda-gold font-bold mt-1">Avaliação de Ansiedade</p>
                        </div>
                    </div>
                    <div className="text-xs opacity-60 text-right hidden md:block">
                        {state.isOffline ? 'Modo Local' : 'Conectado'}
                    </div>
                </div>
            </header>

            <div className="flex-grow">
                {/* --- View: TEST --- */}
                {state.view === 'test' && (
                    <>
                        <ProgressBar current={Object.keys(state.answers).length} total={25} />
                        <main className="max-w-3xl mx-auto p-4 pt-8 space-y-8 pb-32">
                            <Card className="border-l-4 border-cda-gold bg-cda-card">
                                <h2 className="text-lg font-bold mb-2 text-cda-gold">Orientação ao Paciente</h2>
                                <p className="text-sm text-cda-muted">
                                    Leia cada afirmação e marque de 0 a 3 o quanto ela descreve sua experiência atual.
                                    <br/><span className="font-bold mt-2 block text-white">0 – Nunca | 1 – Às vezes | 2 – Frequentemente | 3 – Quase sempre</span>
                                </p>
                            </Card>

                            {TEST_DATA.map((block, bIdx) => (
                                <div key={bIdx}>
                                    <div className="flex items-baseline border-b pb-2 mb-4 border-cda-greenLight/50">
                                        <h3 className="text-xl font-bold font-serif mr-3 text-white">{block.title}</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {block.questions.map((q, qIdx) => {
                                            const globalIdx = bIdx * 5 + qIdx;
                                            const answered = state.answers[globalIdx] !== undefined;
                                            return (
                                                <Card key={globalIdx} className={`transition-all ${answered ? 'shadow-md border-cda-gold' : 'border-cda-greenLight/30'}`} style={{ borderWidth: '1px' }}>
                                                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                                        <p className="font-medium flex-1 text-white/90">{q}</p>
                                                        <div className="flex gap-2">
                                                            {[0, 1, 2, 3].map(val => (
                                                                <button
                                                                    key={val}
                                                                    onClick={() => handleAnswer(globalIdx, val)}
                                                                    className={`w-10 h-10 rounded-lg font-bold transition-all flex items-center justify-center border`}
                                                                    style={{
                                                                        backgroundColor: state.answers[globalIdx] === val ? THEME.gold : 'transparent',
                                                                        color: state.answers[globalIdx] === val ? THEME.green : '#A7F3D0',
                                                                        borderColor: state.answers[globalIdx] === val ? THEME.gold : '#2C6E58',
                                                                        transform: state.answers[globalIdx] === val ? 'scale(1.1)' : 'scale(1)'
                                                                    }}
                                                                >
                                                                    {val}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </main>

                        <div className="fixed bottom-0 left-0 w-full p-4 bg-cda-green/95 backdrop-blur-md border-t border-cda-greenLight shadow-2xl flex justify-center gap-4 z-50">
                            <Button variant="secondary" onClick={() => setState(s => ({ ...s, view: 'history' }))} icon={Icons.History}>
                                Histórico
                            </Button>
                            <Button 
                                variant="primary" 
                                onClick={calculateResult} 
                                icon={Icons.Check}
                            >
                                Calcular Resultado
                            </Button>
                        </div>
                    </>
                )}

                {/* --- View: RESULT --- */}
                {state.view === 'result' && state.result && (
                    <main className="max-w-3xl mx-auto p-4 pt-8 animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold font-serif text-white">Resultado</h2>
                            <Button variant="secondary" onClick={() => setState(s => ({ ...s, view: 'test' }))} icon={Icons.Back}>Voltar</Button>
                        </div>

                        <div className="rounded-2xl p-8 text-center shadow-lg mb-8 border-2" style={{ backgroundColor: state.result.colorBg, borderColor: state.result.colorText }}>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-70 mb-2" style={{ color: state.result.colorText }}>Pontuação Total</p>
                            <div className="text-7xl font-bold font-serif mb-2" style={{ color: state.result.colorText }}>
                                {state.result.totalScore}<span className="text-3xl opacity-50 font-sans">/75</span>
                            </div>
                            <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm font-bold border border-white/20" style={{ color: state.result.colorText }}>
                                {state.result.level}
                            </div>
                        </div>

                        <Card className="mb-8 border-l-4 border-cda-gold">
                            <h3 className="font-bold text-lg mb-3 flex items-center text-cda-gold">
                                <span className="mr-2">💡</span> Sugestões Terapêuticas
                            </h3>
                            <p className="text-white/90 leading-relaxed">{state.result.suggestions}</p>
                        </Card>

                        <Card>
                            <h3 className="font-bold text-lg mb-6 text-white">Análise por Dimensão</h3>
                            
                            {/* Mobile View: Bars */}
                            <div className="block md:hidden space-y-6">
                                {Object.entries(state.result.blockScores).map(([key, val], idx) => (
                                    <div key={key}>
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-sm text-white/90 font-medium">{TEST_DATA[idx].title.split('—')[1]}</span>
                                            <span className="text-xs font-bold text-cda-gold bg-black/20 px-2 py-1 rounded">{val}/15</span>
                                        </div>
                                        <div className="h-3 bg-black/20 rounded-full overflow-hidden border border-white/5 relative">
                                            {/* Grid lines for mobile bars */}
                                            <div className="absolute top-0 left-1/3 w-px h-full bg-white/10"></div>
                                            <div className="absolute top-0 left-2/3 w-px h-full bg-white/10"></div>
                                            
                                            <div 
                                                className={`h-full transition-all duration-1000 bg-gradient-to-r ${getBarGradientClass(val as number)}`}
                                                style={{ width: `${((val as number)/15)*100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop View: Modern Chart */}
                            <div className="hidden md:block h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart 
                                        layout="vertical"
                                        data={Object.entries(state.result.blockScores).map(([k, v], i) => ({ 
                                            name: `B${i+1}`, 
                                            value: v, 
                                            label: TEST_DATA[i].title.split('—')[1].trim() 
                                        }))}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorSafe" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="5%" stopColor="#34D399" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0.9}/>
                                            </linearGradient>
                                            <linearGradient id="colorWarning" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#D97706" stopOpacity={0.9}/>
                                            </linearGradient>
                                            <linearGradient id="colorDanger" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#B91C1C" stopOpacity={0.9}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.1)" />
                                        <XAxis type="number" domain={[0, 15]} hide />
                                        <YAxis 
                                            dataKey="label" 
                                            type="category" 
                                            width={180} 
                                            tick={{fill: '#E5E7EB', fontSize: 13, fontWeight: 500}} 
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                                        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={30} animationDuration={1500}>
                                            <LabelList dataKey="value" position="right" fill="#D4AF37" fontSize={14} fontWeight="bold" />
                                            {Object.entries(state.result.blockScores).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={getBarColor(entry[1] as number)} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <div className="flex justify-center gap-4 mt-8">
                            <Button variant="primary" onClick={() => { setState(s => ({ ...s, view: 'test', answers: {} })); window.scrollTo(0,0); }} icon={Icons.Refresh}>Novo Teste</Button>
                            <Button variant="secondary" onClick={() => setState(s => ({ ...s, view: 'history' }))} icon={Icons.History}>Ver Histórico</Button>
                        </div>
                    </main>
                )}

                {/* --- View: HISTORY --- */}
                {state.view === 'history' && (
                    <main className="max-w-3xl mx-auto p-4 pt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold font-serif text-white">Histórico</h2>
                            <div className="flex gap-2">
                                <Button variant="secondary" onClick={() => setState(s => ({ ...s, view: 'test' }))} icon={Icons.Back}>Voltar</Button>
                                <Button variant="danger" onClick={() => setState(s => ({ ...s, showClearModal: true }))} disabled={state.history.length === 0} icon={Icons.Trash}>Limpar</Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {state.history.length === 0 && (
                                <div className="text-center py-12 text-cda-muted bg-cda-card rounded-xl border border-dashed border-cda-greenLight">
                                    Nenhum registro encontrado.
                                </div>
                            )}
                            {state.history.map((h) => (
                                <div 
                                    key={h.id} 
                                    onClick={() => { setState(s => ({ ...s, result: h, view: 'result' })); window.scrollTo(0,0); }}
                                    className="bg-cda-card p-5 rounded-xl border border-cda-greenLight/30 shadow-sm hover:shadow-md hover:border-cda-gold transition-all cursor-pointer flex justify-between items-center group"
                                >
                                    <div>
                                        <div className="font-bold text-xl mb-1" style={{ color: h.totalScore > 45 ? '#FCA5A5' : (h.totalScore < 16 ? '#6EE7B7' : THEME.gold) }}>
                                            {h.totalScore} pts
                                        </div>
                                        <div className="text-xs text-cda-muted">
                                            {new Date(h.date as string).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-white/80 group-hover:text-white">{h.level}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                )}
            </div>

            {/* Footer */}
            <footer className="py-8 text-center border-t border-cda-greenLight/20 mt-auto bg-black/10">
                <p className="font-serif text-cda-gold mb-1 font-bold tracking-wide">CDA — Curando as Dores da Alma</p>
                <p className="text-xs text-cda-muted opacity-60">&copy; {new Date().getFullYear()} • Todos os direitos reservados</p>
            </footer>

            {/* Modal Clear History */}
            {state.showClearModal && (
                <Modal 
                    title="Apagar Histórico?" 
                    onClose={
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => setState(s => ({ ...s, showClearModal: false }))}>Cancelar</Button>
                            <Button variant="danger" onClick={clearHistory}>Sim, Apagar</Button>
                        </div>
                    }
                >
                    <p>Você tem certeza que deseja apagar todo o histórico salvo? Esta ação é irreversível.</p>
                </Modal>
            )}
        </div>
    );
}