import React, { useState } from 'react';
import { X, Sparkles, Send, Check, BookOpen, Layers, FileText, AlertCircle } from 'lucide-react';
import { SavedLesson } from '../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLesson?: (lesson: Partial<SavedLesson>) => void;
  onSaveToBank?: (lesson: SavedLesson) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyLesson,
  onSaveToBank,
}) => {
  const [prompt, setPrompt] = useState('');
  const [ageGroup, setAgeGroup] = useState('Crianças pequenas (4 a 5 anos - EI03)');
  const [subject, setSubject] = useState('Matemática');
  const [loading, setLoading] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<any>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
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

  const handleApply = () => {
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
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full h-[85vh] flex flex-col overflow-hidden"
        id="ai-assistant-modal-container"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-blue-900/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Assistente Pedagógico IA
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gere planos de aula completos e alinhados à BNCC em segundos.
              </p>
            </div>
          </div>
          <button
            id="ai-modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Prompt Form */}
          <form onSubmit={handleGenerate} className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
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
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
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
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                >
                  <option value="Linguagem">Linguagem</option>
                  <option value="Matemática">Matemática</option>
                  <option value="Artes">Artes</option>
                  <option value="Natureza e Sociedade">Natureza e Sociedade</option>
                  <option value="Musicalização">Musicalização</option>
                  <option value="Educação Física">Educação Física</option>
                  <option value="Ensino Religioso/Devocional">Devocional / Bíblica</option>
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

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center gap-2 text-red-700 dark:text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Generated Result Preview */}
          {generatedLesson && (
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
                  <p className="whitespace-pre-line leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    {generatedLesson.desenvolvimento}
                  </p>
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

        {/* Footer */}
        {generatedLesson && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-2">
            <button
              id="ai-save-bank-btn"
              onClick={handleSaveBank}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition-colors"
            >
              Salvar no Banco de Aulas
            </button>

            <button
              id="ai-apply-planning-btn"
              onClick={handleApply}
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
