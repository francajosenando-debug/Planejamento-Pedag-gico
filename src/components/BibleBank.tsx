import React, { useState } from 'react';
import { 
  BookOpenCheck, 
  Plus, 
  Trash2, 
  Search, 
  Sparkles, 
  Quote, 
  Heart, 
  BookOpen, 
  Edit3, 
  X, 
  Check, 
  Layers,
  Award
} from 'lucide-react';
import { BibleLesson } from '../types';

interface BibleBankProps {
  bibleLessons: BibleLesson[];
  onSaveBibleLesson: (lesson: BibleLesson) => void;
  onDeleteBibleLesson: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export const BibleBank: React.FC<BibleBankProps> = ({
  bibleLessons = [],
  onSaveBibleLesson,
  onDeleteBibleLesson,
  onToggleFavorite
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingLesson, setViewingLesson] = useState<BibleLesson | null>(null);

  // Form State for create/edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [passage, setPassage] = useState('');
  const [keyVerse, setKeyVerse] = useState('');
  const [principle, setPrinciple] = useState('');
  const [ageRange, setAgeRange] = useState('3 a 5 anos');
  const [objectives, setObjectives] = useState('');
  const [materials, setMaterials] = useState('');
  const [development, setDevelopment] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setPassage('');
    setKeyVerse('');
    setPrinciple('');
    setAgeRange('3 a 5 anos');
    setObjectives('');
    setMaterials('');
    setDevelopment('');
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lesson: BibleLesson) => {
    setEditingId(lesson.id);
    setTitle(lesson.title);
    setPassage(lesson.passage || '');
    setKeyVerse(lesson.keyVerse || '');
    setPrinciple(lesson.principle || '');
    setAgeRange(lesson.ageRange || '3 a 5 anos');
    setObjectives(lesson.objectives || '');
    setMaterials(lesson.materials || '');
    setDevelopment(lesson.development || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !objectives.trim()) {
      alert('Por favor, preencha o título e os objetivos da aula bíblica.');
      return;
    }

    const saved: BibleLesson = {
      id: editingId || `bible-${Date.now()}`,
      userId: 'current-user',
      title: title.trim(),
      passage: passage.trim(),
      keyVerse: keyVerse.trim(),
      principle: principle.trim(),
      ageRange: ageRange.trim(),
      objectives: objectives.trim(),
      materials: materials.trim(),
      development: development.trim(),
      isFavorite: editingId ? (bibleLessons.find(b => b.id === editingId)?.isFavorite || false) : true,
      createdAt: new Date().toISOString()
    };

    onSaveBibleLesson(saved);
    setIsModalOpen(false);
    resetForm();
  };

  const safeBibleLessons = Array.isArray(bibleLessons) ? bibleLessons : [];

  const filtered = safeBibleLessons.filter((b) => {
    if (!b) return false;
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (b.title || '').toLowerCase().includes(term) ||
      (b.passage && b.passage.toLowerCase().includes(term)) ||
      (b.principle && b.principle.toLowerCase().includes(term)) ||
      (b.keyVerse && b.keyVerse.toLowerCase().includes(term)) ||
      (b.objectives && b.objectives.toLowerCase().includes(term));
    
    if (selectedCategoryFilter === 'favoritos') {
      return matchesSearch && b.isFavorite;
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-300/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Educação Cristã Infantil</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <BookOpenCheck className="w-7 h-7 text-amber-300" />
              <span>Banco de Aulas Bíblicas & Devocionais</span>
            </h1>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Catálogo de lições bíblicas, princípios morais, versículos e histórias bíblicas estruturadas para uso rápido no planejamento semanal da Educação Infantil.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Aula Bíblica</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por história, versículo, livro ou princípio..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setSelectedCategoryFilter('todos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategoryFilter === 'todos'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Todas ({bibleLessons.length})
          </button>
          <button
            onClick={() => setSelectedCategoryFilter('favoritos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategoryFilter === 'favoritos'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Favoritas</span>
          </button>
        </div>
      </div>

      {/* Bible Lessons Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
            <BookOpenCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
              Nenhuma aula bíblica encontrada no banco.
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Clique em "Nova Aula Bíblica" acima para cadastrar lições espirituais ou devocionais para a sua turma.
            </p>
          </div>
        ) : (
          filtered.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group relative"
            >
              <div className="space-y-3">
                
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                      {lesson.title}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {lesson.passage && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                          📖 {lesson.passage}
                        </span>
                      )}
                      {lesson.principle && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-200 dark:border-amber-800">
                          ✨ {lesson.principle}
                        </span>
                      )}
                    </div>
                  </div>

                  {onToggleFavorite && (
                    <button
                      onClick={() => onToggleFavorite(lesson.id)}
                      className={`p-1.5 rounded-xl transition-colors ${
                        lesson.isFavorite
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                          : 'text-slate-300 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={lesson.isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
                    >
                      <Heart className={`w-4 h-4 ${lesson.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Key Verse Callout */}
                {lesson.keyVerse && (
                  <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 text-[11px] text-amber-950 dark:text-amber-200 italic flex items-start gap-2">
                    <Quote className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">"{lesson.keyVerse}"</span>
                  </div>
                )}

                {/* Objectives */}
                {lesson.objectives && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    <strong className="text-slate-800 dark:text-slate-200">Objetivos:</strong> {lesson.objectives}
                  </p>
                )}

                {/* Materials preview */}
                {lesson.materials && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    <strong className="text-slate-700 dark:text-slate-300">Materiais:</strong> {lesson.materials}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewingLesson(lesson)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Ver Detalhes</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(lesson)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Editar aula bíblica"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Excluir a aula bíblica "${lesson.title}"?`)) {
                        onDeleteBibleLesson(lesson.id);
                      }
                    }}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Excluir aula bíblica"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal View Details */}
      {viewingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-[11px] font-bold">
                  📖 {viewingLesson.passage || 'Aula Bíblica'}
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  {viewingLesson.title}
                </h2>
                {viewingLesson.principle && (
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                    Princípio Bíblico: {viewingLesson.principle}
                  </p>
                )}
              </div>

              <button
                onClick={() => setViewingLesson(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {viewingLesson.keyVerse && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  Versículo Chave
                </span>
                <p className="text-xs text-amber-950 dark:text-amber-100 italic font-medium">
                  "{viewingLesson.keyVerse}"
                </p>
              </div>
            )}

            {viewingLesson.objectives && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Objetivos Pedagógicos & Espirituais
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                  {viewingLesson.objectives}
                </p>
              </div>
            )}

            {viewingLesson.materials && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Materiais Necessários
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                  {viewingLesson.materials}
                </p>
              </div>
            )}

            {viewingLesson.development && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Desenvolvimento Passo a Passo da Lição
                </h4>
                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                  {viewingLesson.development}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setViewingLesson(null)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpenCheck className="w-5 h-5 text-indigo-600" />
                <span>{editingId ? 'Editar Aula Bíblica' : 'Cadastrar Nova Aula Bíblica'}</span>
              </h2>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="col-span-full">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Título da Aula Bíblica *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: A Arca de Noé - Obediência e Proteção"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Passagem Bíblica
                  </label>
                  <input
                    type="text"
                    value={passage}
                    onChange={(e) => setPassage(e.target.value)}
                    placeholder="Ex: Gênesis 6:9-22"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Princípio Bíblico / Tema
                  </label>
                  <input
                    type="text"
                    value={principle}
                    onChange={(e) => setPrinciple(e.target.value)}
                    placeholder="Ex: Obediência e Cuidado"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="col-span-full">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Versículo Chave
                  </label>
                  <input
                    type="text"
                    value={keyVerse}
                    onChange={(e) => setKeyVerse(e.target.value)}
                    placeholder='Ex: "Pela fé Noé preparou a arca... (Hebreus 11:7)"'
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="col-span-full">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Objetivos Pedagógicos e Espirituais *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={objectives}
                    onChange={(e) => setObjectives(e.target.value)}
                    placeholder="Ex: Compreender a importância da obediência a Deus e aos pais..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="col-span-full">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Materiais Necessários
                  </label>
                  <input
                    type="text"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    placeholder="Ex: Caixa de papelão, animais em pares, tintas, papel colorido."
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="col-span-full">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Desenvolvimento Passo a Passo
                  </label>
                  <textarea
                    rows={5}
                    value={development}
                    onChange={(e) => setDevelopment(e.target.value)}
                    placeholder="1. Acolhida e música&#10;2. Contação com fantoches&#10;3. Atividade de pintura..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Aula Bíblica</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
