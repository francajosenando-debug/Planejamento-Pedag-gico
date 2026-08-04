import React, { useState } from 'react';
import { X, Search, BookOpenCheck, Check, Sparkles, HeartHandshake, Quote } from 'lucide-react';
import { BibleLesson } from '../types';

interface BibleLessonSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  bibleLessons: BibleLesson[];
  onSelectBibleLesson: (lesson: BibleLesson) => void;
  targetTitle?: string;
}

export const BibleLessonSelectorModal: React.FC<BibleLessonSelectorModalProps> = ({
  isOpen,
  onClose,
  bibleLessons,
  onSelectBibleLesson,
  targetTitle = 'Aula Bíblica / Devocional'
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredLessons = bibleLessons.filter((lesson) => {
    const term = searchTerm.toLowerCase();
    return (
      lesson.title.toLowerCase().includes(term) ||
      (lesson.passage && lesson.passage.toLowerCase().includes(term)) ||
      (lesson.principle && lesson.principle.toLowerCase().includes(term)) ||
      (lesson.keyVerse && lesson.keyVerse.toLowerCase().includes(term)) ||
      (lesson.objectives && lesson.objectives.toLowerCase().includes(term)) ||
      (lesson.development && lesson.development.toLowerCase().includes(term))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md text-amber-300 flex items-center justify-center shadow-inner">
              <BookOpenCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight flex items-center gap-1.5">
                <span>Selecionar do Banco de Aulas Bíblicas</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h2>
              <p className="text-xs text-indigo-200">
                Preencher {targetTitle} com conteúdo e princípios cristãos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por história, passagem bíblica, versículo ou princípio..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Bible Lessons List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {filteredLessons.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <BookOpenCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Nenhuma aula bíblica encontrada no banco com esse termo.
              </p>
            </div>
          ) : (
            filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all space-y-3 shadow-sm group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-2.5">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {lesson.title}
                      </h3>
                      {lesson.passage && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 text-[11px] font-bold border border-indigo-200 dark:border-indigo-800">
                          📖 {lesson.passage}
                        </span>
                      )}
                      {lesson.principle && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[11px] font-bold border border-amber-200 dark:border-amber-800">
                          ✨ {lesson.principle}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectBibleLesson(lesson);
                      onClose();
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all flex-shrink-0"
                  >
                    <Check className="w-4 h-4" />
                    <span>Usar Esta Aula Bíblica</span>
                  </button>
                </div>

                {lesson.keyVerse && (
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 italic flex items-start gap-2">
                    <Quote className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Versículo Chave:</strong> "{lesson.keyVerse}"</span>
                  </div>
                )}

                {lesson.objectives && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    <strong className="text-slate-800 dark:text-slate-200">Objetivos:</strong> {lesson.objectives}
                  </p>
                )}

                {lesson.development && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 whitespace-pre-line line-clamp-3">
                    {lesson.development}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700/80 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
