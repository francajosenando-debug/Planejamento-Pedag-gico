import React, { useState } from 'react';
import { X, Sparkles, Send, Check, Calendar, BookOpen, AlertCircle, Layers } from 'lucide-react';
import { SavedLesson, WeeklyPlanning } from '../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLesson?: (lesson: Partial<SavedLesson>) => void;
  onApplyPlanning?: (planning: WeeklyPlanning) => void;
  onSaveToBank?: (lesson: SavedLesson) => void;
  defaultClass?: string;
  defaultTeacher?: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyLesson,
  onApplyPlanning,
  onSaveToBank,
  defaultClass = 'KINDER 3',
  defaultTeacher = 'Profe Camila'
}) => {
  const [activeMode, setActiveMode] = useState<'planning' | 'lesson'>('planning');

  // Full Weekly Planning State
  const [planningTheme, setPlanningTheme] = useState('');
  const [planningClassName, setPlanningClassName] = useState(defaultClass);
  const [planningAgeGroup, setPlanningAgeGroup] = useState('Crianças pequenas (4 a 5 anos - EI03)');

  // Single Lesson State
  const [prompt, setPrompt] = useState('');
  const [ageGroup, setAgeGroup] = useState('Crianças pequenas (4 a 5 anos - EI03)');
  const [subject, setSubject] = useState('Matemática');

  // Loading & Results
  const [loading, setLoading] = useState(false);
  const [generatedPlanning, setGeneratedPlanning] = useState<any>(null);
  const [generatedLesson, setGeneratedLesson] = useState<any>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Generate Full Weekly Planning
  const handleGeneratePlanning = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planningTheme.trim()) return;

    setLoading(true);
    setError('');
    setGeneratedPlanning(null);

    try {
      const res = await fetch('/api/ai/generate-planning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: planningTheme,
          ageGroup: planningAgeGroup,
          className: planningClassName,
          teacher: defaultTeacher
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Falha ao gerar planejamento com IA');
      }

      setGeneratedPlanning(data.planning);
    } catch (err: any) {
      console.error("Erro AI Planning:", err);
      setError(err?.message || "Ocorreu um erro ao gerar o planejamento semanal com IA.");
    } finally {
      setLoading(false);
    }
  };

  // Generate Single Lesson
  const handleGenerateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setGeneratedLesson(null);

    try {
      const res = await fetch('/api/ai/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, ageGroup, subject }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Falha ao comunicar com a IA');
      }

      setGeneratedLesson(data.lesson);
    } catch (err: any) {
      console.error("Erro IA Assistant:", err);
      setError(err?.message || "Ocorreu um erro ao gerar o plano de aula com IA.");
    } finally {
      setLoading(false);
    }
  };

  // Apply Generated Full Planning
  const handleApplyPlanning = () => {
    if (!generatedPlanning) return;

    const newPlanning: WeeklyPlanning = {
      id: `planning-ai-${Date.now()}`,
      userId: 'current-user',
      className: generatedPlanning.className || planningClassName || 'KINDER 3',
      year: new Date().getFullYear().toString(),
      teacher: defaultTeacher,
      period: 'Vespertino',
      week: `Semana IA – ${planningTheme.slice(0, 20)}`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      generalTheme: generatedPlanning.generalTheme || planningTheme,
      project: generatedPlanning.project || '',
      bookWorked: generatedPlanning.bookWorked || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      days: {
        segunda: {
          dayName: 'Segunda-feira',
          dateStr: 'Dia 1',
          routine: generatedPlanning.days?.segunda?.routine?.map((r: any, i: number) => ({
            id: `r-1-${i}`,
            time: r.time || '13:00 – 13:30',
            title: r.title || 'ACOLHIDA / ROTINA',
            description: r.description || '',
            order: i
          })) || [],
          lessons: generatedPlanning.days?.segunda?.lessons?.map((l: any, i: number) => ({
            id: `l-1-${i}`,
            subject: l.subject || 'LINGUAGEM',
            time: l.time || '13:30 – 14:30',
            theme: l.theme || 'Atividade',
            objectives: l.objectives || '',
            bnccCodes: l.bnccCodes || [],
            development: l.development || '',
            materials: l.materials || []
          })) || []
        },
        terca: {
          dayName: 'Terça-feira',
          dateStr: 'Dia 2',
          routine: generatedPlanning.days?.terca?.routine?.map((r: any, i: number) => ({
            id: `r-2-${i}`,
            time: r.time || '13:00 – 13:30',
            title: r.title || 'ACOLHIDA / ROTINA',
            description: r.description || '',
            order: i
          })) || [],
          lessons: generatedPlanning.days?.terca?.lessons?.map((l: any, i: number) => ({
            id: `l-2-${i}`,
            subject: l.subject || 'MATEMÁTICA',
            time: l.time || '13:30 – 14:30',
            theme: l.theme || 'Atividade',
            objectives: l.objectives || '',
            bnccCodes: l.bnccCodes || [],
            development: l.development || '',
            materials: l.materials || []
          })) || []
        },
        quarta: {
          dayName: 'Quarta-feira',
          dateStr: 'Dia 3',
          routine: generatedPlanning.days?.quarta?.routine?.map((r: any, i: number) => ({
            id: `r-3-${i}`,
            time: r.time || '13:00 – 13:30',
            title: r.title || 'ACOLHIDA / ROTINA',
            description: r.description || '',
            order: i
          })) || [],
          lessons: generatedPlanning.days?.quarta?.lessons?.map((l: any, i: number) => ({
            id: `l-3-${i}`,
            subject: l.subject || 'ARTES',
            time: l.time || '13:30 – 14:30',
            theme: l.theme || 'Atividade',
            objectives: l.objectives || '',
            bnccCodes: l.bnccCodes || [],
            development: l.development || '',
            materials: l.materials || []
          })) || []
        },
        quinta: {
          dayName: 'Quinta-feira',
          dateStr: 'Dia 4',
          routine: generatedPlanning.days?.quinta?.routine?.map((r: any, i: number) => ({
            id: `r-4-${i}`,
            time: r.time || '13:00 – 13:30',
            title: r.title || 'ACOLHIDA / ROTINA',
            description: r.description || '',
            order: i
          })) || [],
          lessons: generatedPlanning.days?.quinta?.lessons?.map((l: any, i: number) => ({
            id: `l-4-${i}`,
            subject: l.subject || 'NATUREZA E SOCIEDADE',
            time: l.time || '13:30 – 14:30',
            theme: l.theme || 'Atividade',
            objectives: l.objectives || '',
            bnccCodes: l.bnccCodes || [],
            development: l.development || '',
            materials: l.materials || []
          })) || []
        },
        sexta: {
          dayName: 'Sexta-feira',
          dateStr: 'Dia 5',
          routine: generatedPlanning.days?.sexta?.routine?.map((r: any, i: number) => ({
            id: `r-5-${i}`,
            time: r.time || '13:00 – 13:30',
            title: r.title || 'ACOLHIDA / ROTINA',
            description: r.description || '',
            order: i
          })) || [],
          lessons: generatedPlanning.days?.sexta?.lessons?.map((l: any, i: number) => ({
            id: `l-5-${i}`,
            subject: l.subject || 'MUSICALIZAÇÃO',
            time: l.time || '13:30 – 14:30',
            theme: l.theme || 'Atividade',
            objectives: l.objectives || '',
            bnccCodes: l.bnccCodes || [],
            development: l.development || '',
            materials: l.materials || []
          })) || []
        }
      }
    };

    if (onApplyPlanning) {
      onApplyPlanning(newPlanning);
    }
    onClose();
  };

  // Apply Single Lesson
  const handleApplyLesson = () => {
    if (!generatedLesson) return;
    if (onApplyLesson) {
      onApplyLesson({
        name: generatedLesson.nome || 'Aula Gerada por IA',
        subject: generatedLesson.disciplina || subject,
        theme: generatedLesson.tema || prompt,
        objectives: generatedLesson.objetivos || '',
        bnccCodes: generatedLesson.bnccCodes || [],
        development: generatedLesson.desenvolvimento || '',
        materials: generatedLesson.materiais || [],
        games: generatedLesson.brincadeiras || '',
        notes: generatedLesson.observacoes || ''
      });
    }
    onClose();
  };

  const handleSaveBank = () => {
    if (!generatedLesson) return;
    if (onSaveToBank) {
      const newLesson: SavedLesson = {
        id: `ai-lesson-${Date.now()}`,
        userId: 'current-user',
        name: generatedLesson.nome || 'Aula Gerada por IA',
        subject: generatedLesson.disciplina || subject,
        theme: generatedLesson.tema || prompt,
        objectives: generatedLesson.objetivos || '',
        bnccCodes: generatedLesson.bnccCodes || [],
        development: generatedLesson.desenvolvimento || '',
        materials: generatedLesson.materiais || [],
        games: generatedLesson.brincadeiras || '',
        notes: generatedLesson.observacoes || '',
        isFavorite: true,
        createdAt: new Date().toISOString()
      };
      onSaveToBank(newLesson);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full h-[88vh] flex flex-col overflow-hidden"
        id="ai-assistant-modal-container"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-blue-900/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Assistente Pedagógico IA
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gere planejamentos semanais completos ou aulas individuais com BNCC.
              </p>
            </div>
          </div>
          <button
            id="ai-modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-5 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center gap-2 shrink-0">
          <button
            id="ai-mode-planning-tab"
            onClick={() => {
              setActiveMode('planning');
              setError('');
            }}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${
              activeMode === 'planning'
                ? 'border-purple-600 text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Planejamento Semanal Completo (5 Dias)</span>
          </button>

          <button
            id="ai-mode-lesson-tab"
            onClick={() => {
              setActiveMode('lesson');
              setError('');
            }}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${
              activeMode === 'lesson'
                ? 'border-purple-600 text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Plano de Aula Individual</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* MODE 1: Full Planning Form */}
          {activeMode === 'planning' && (
            <form onSubmit={handleGeneratePlanning} className="space-y-3 bg-purple-50/40 dark:bg-purple-950/20 p-4 rounded-2xl border border-purple-200 dark:border-purple-900/40">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Qual é o Tema Geral do Planejamento Semanal?
                </label>
                <input
                  id="ai-planning-theme-input"
                  type="text"
                  value={planningTheme}
                  onChange={(e) => setPlanningTheme(e.target.value)}
                  placeholder="Ex: Semana da Água, Higiene e Meio Ambiente"
                  className="w-full p-3 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nome da Turma
                  </label>
                  <input
                    id="ai-planning-class-input"
                    type="text"
                    value={planningClassName}
                    onChange={(e) => setPlanningClassName(e.target.value)}
                    placeholder="Ex: KINDER 3"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Faixa Etária / Estágio
                  </label>
                  <select
                    id="ai-planning-age-select"
                    value={planningAgeGroup}
                    onChange={(e) => setPlanningAgeGroup(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Bebês (0 a 1 ano e 6 meses - EI01)">EI01 - Bebês (0 a 1a6m)</option>
                    <option value="Crianças bem pequenas (1a7m a 3a11m - EI02)">EI02 - Crianças bem pequenas</option>
                    <option value="Crianças pequenas (4 a 5 anos - EI03)">EI03 - Crianças pequenas (4 a 5 anos)</option>
                  </select>
                </div>
              </div>

              <button
                id="ai-generate-planning-btn"
                type="submit"
                disabled={loading || !planningTheme.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-yellow-300" />
                    <span>Gerando Planejamento Completo de 5 Dias com IA...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gerar Planejamento Semanal Completo (5 Dias)</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE 2: Single Lesson Form */}
          {activeMode === 'lesson' && (
            <form onSubmit={handleGenerateLesson} className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  O que você deseja trabalhar na aula?
                </label>
                <textarea
                  id="ai-prompt-input"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex: Quero trabalhar o numeral 8 utilizando massinha de modelar e circuito motor."
                  rows={3}
                  className="w-full p-3 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Faixa Etária
                  </label>
                  <select
                    id="ai-age-select"
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Bebês (0 a 1 ano e 6 meses - EI01)">EI01 - Bebês (0 a 1a6m)</option>
                    <option value="Crianças bem pequenas (1a7m a 3a11m - EI02)">EI02 - Crianças bem pequenas</option>
                    <option value="Crianças pequenas (4 a 5 anos - EI03)">EI03 - Crianças pequenas (4 a 5 anos)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Disciplina
                  </label>
                  <select
                    id="ai-subject-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="LINGUAGEM">LINGUAGEM</option>
                    <option value="MATEMÁTICA">MATEMÁTICA</option>
                    <option value="ARTES">ARTES</option>
                    <option value="NATUREZA E SOCIEDADE">NATUREZA E SOCIEDADE</option>
                    <option value="MUSICALIZAÇÃO">MUSICALIZAÇÃO</option>
                    <option value="EDUCAÇÃO FÍSICA">EDUCAÇÃO FÍSICA</option>
                    <option value="AULA BÍBLICA / DEVOCIONAL">AULA BÍBLICA / DEVOCIONAL</option>
                  </select>
                </div>
              </div>

              <button
                id="ai-generate-btn"
                type="submit"
                disabled={loading || !prompt.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-yellow-300" />
                    <span>Elaborando plano pedagógico com IA...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gerar Plano de Aula Completo</span>
                  </>
                )}
              </button>
            </form>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center gap-2 text-red-700 dark:text-red-300 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Generated Planning Preview */}
          {activeMode === 'planning' && generatedPlanning && (
            <div className="space-y-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-purple-200 dark:border-purple-900/50 shadow-md animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    PLANEJAMENTO SEMANAL DE 5 DIAS GERADO
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    Tema: {generatedPlanning.generalTheme}
                  </h3>
                </div>
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                  {generatedPlanning.className}
                </span>
              </div>

              {generatedPlanning.project && (
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <strong>Projeto:</strong> {generatedPlanning.project}
                </div>
              )}

              {generatedPlanning.bookWorked && (
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <strong>Livro Recomendado:</strong> {generatedPlanning.bookWorked}
                </div>
              )}

              {/* Days List Preview */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Resumo das Aividades Diárias Geradas:
                </div>

                {['segunda', 'terca', 'quarta', 'quinta', 'sexta'].map((dKey, idx) => {
                  const dayObj = generatedPlanning.days?.[dKey];
                  const labels: Record<string, string> = {
                    segunda: 'Segunda-feira',
                    terca: 'Terça-feira',
                    quarta: 'Quarta-feira',
                    quinta: 'Quinta-feira',
                    sexta: 'Sexta-feira'
                  };

                  return (
                    <div key={dKey} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{labels[dKey]}</span>
                        <span className="text-[10px] text-purple-600 font-semibold">{dayObj?.lessons?.length || 0} Aula(s)</span>
                      </div>

                      {dayObj?.lessons?.map((l: any, lIdx: number) => (
                        <div key={lIdx} className="pl-2 border-l-2 border-purple-400 text-slate-700 dark:text-slate-300">
                          <span className="font-semibold">{l.subject}:</span> {l.theme} {l.bnccCodes?.length ? `(BNCC: ${l.bnccCodes.join(', ')})` : ''}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Generated Lesson Preview */}
          {activeMode === 'lesson' && generatedLesson && (
            <div className="space-y-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-purple-200 dark:border-purple-900/50 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                  {generatedLesson.disciplina || subject}
                </span>
                <span className="text-xs text-slate-500 font-medium">Plano Gerado</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {generatedLesson.nome || 'Plano de Aula'}
              </h3>

              {generatedLesson.bnccCodes?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {generatedLesson.bnccCodes.map((code: string) => (
                    <span key={code} className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200">
                      BNCC: {code}
                    </span>
                  ))}
                </div>
              )}

              {generatedLesson.objetivos && (
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  <div className="font-semibold text-slate-900 dark:text-white mb-0.5">Objetivos:</div>
                  <p className="whitespace-pre-line">{generatedLesson.objetivos}</p>
                </div>
              )}

              {generatedLesson.desenvolvimento && (
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  <div className="font-semibold text-slate-900 dark:text-white mb-0.5">Desenvolvimento da Aula:</div>
                  <div 
                    className="whitespace-pre-line leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800"
                    dangerouslySetInnerHTML={{ __html: generatedLesson.desenvolvimento }}
                  />
                </div>
              )}

              {generatedLesson.materiais?.length > 0 && (
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Materiais: </span>
                  {Array.isArray(generatedLesson.materiais) ? generatedLesson.materiais.join(', ') : generatedLesson.materiais}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {activeMode === 'planning' && generatedPlanning && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end gap-2 shrink-0">
            <button
              id="ai-apply-full-planning-btn"
              onClick={handleApplyPlanning}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Abrir no Editor de Planejamento</span>
            </button>
          </div>
        )}

        {activeMode === 'lesson' && generatedLesson && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <button
              id="ai-save-bank-btn"
              onClick={handleSaveBank}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition-colors"
            >
              Salvar no Banco de Aulas
            </button>

            <button
              id="ai-apply-lesson-btn"
              onClick={handleApplyLesson}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Usar neste Planejamento</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

