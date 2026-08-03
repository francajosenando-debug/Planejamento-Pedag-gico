import React, { useState } from 'react';
import { X, Search, BookMarked, Check, User, Sparkles } from 'lucide-react';
import { Story } from '../types';

interface StorySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
  onSelectStory: (story: Story) => void;
  targetTitle?: string;
}

export const StorySelectorModal: React.FC<StorySelectorModalProps> = ({
  isOpen,
  onClose,
  stories,
  onSelectStory,
  targetTitle = 'Contação de História'
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredStories = stories.filter((story) => {
    const term = searchTerm.toLowerCase();
    return (
      story.title.toLowerCase().includes(term) ||
      story.author.toLowerCase().includes(term) ||
      story.description.toLowerCase().includes(term) ||
      (story.objectives && story.objectives.toLowerCase().includes(term))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Selecionar História do Banco
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Escolha uma história para preencher a {targetTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título, autor ou palavras-chave..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Stories List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredStories.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <BookMarked className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Nenhuma história encontrada no banco com esse termo.
              </p>
            </div>
          ) : (
            filteredStories.map((story) => (
              <div
                key={story.id}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-amber-400 dark:hover:border-amber-500/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group shadow-sm"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {story.imageUrl ? (
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-16 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700 flex-shrink-0 shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-20 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-400">
                      <BookMarked className="w-8 h-8" />
                    </div>
                  )}

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {story.title}
                      </h3>
                      {story.ageRange && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                          {story.ageRange}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{story.author || 'Autor desconhecido'}</span>
                    </p>

                    {story.description && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {story.description}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectStory(story);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors flex-shrink-0"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Usar Esta História</span>
                </button>
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
