import React, { useState } from 'react';
import { Search, BookMarked, Plus, Star, Trash2, Edit2, X, Image as ImageIcon } from 'lucide-react';
import { Story } from '../types';
import { ImageUploader } from './ImageUploader';

interface StoryBankProps {
  stories: Story[];
  onSaveStory: (story: Story) => void;
  onDeleteStory: (id: string) => void;
}

export const StoryBank: React.FC<StoryBankProps> = ({ stories = [], onSaveStory, onDeleteStory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [objectives, setObjectives] = useState('');
  const [ageRange, setAgeRange] = useState('3 a 5 anos');
  const [imageUrl, setImageUrl] = useState('');

  const safeStories = Array.isArray(stories) ? stories : [];

  const filtered = safeStories.filter(s => 
    s && (
      (s.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.author || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const openModal = (story?: Story) => {
    if (story) {
      setEditingStory(story);
      setTitle(story.title);
      setAuthor(story.author);
      setDescription(story.description);
      setObjectives(story.objectives);
      setAgeRange(story.ageRange);
      setImageUrl(story.imageUrl || '');
    } else {
      setEditingStory(null);
      setTitle('');
      setAuthor('');
      setDescription('');
      setObjectives('');
      setAgeRange('3 a 5 anos');
      setImageUrl('');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveStory({
      id: editingStory ? editingStory.id : `story-${Date.now()}`,
      userId: editingStory ? editingStory.userId : 'current-user',
      title,
      author,
      description,
      objectives,
      ageRange,
      imageUrl,
      isFavorite: editingStory ? editingStory.isFavorite : false,
      createdAt: editingStory ? editingStory.createdAt : new Date().toISOString()
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-amber-600" />
            <span>Banco de Histórias</span>
          </h1>
          <p className="text-xs text-slate-500">Cadastre livros infantis, autores e objetivos de contação de história.</p>
        </div>

        <button
          onClick={() => openModal()}
          className="px-4 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Nova História</span>
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar título ou autor..."
          className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-white dark:bg-slate-900 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map(s => (
          <div key={s.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              {s.imageUrl ? (
                <img src={s.imageUrl} alt={s.title} className="w-full h-36 object-cover rounded-xl mb-3" />
              ) : (
                <div className="w-full h-36 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-3">
                  <BookMarked className="w-10 h-10 opacity-40" />
                </div>
              )}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">{s.ageRange}</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">{s.title}</h3>
              <p className="text-xs text-slate-500 font-medium">{s.author}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">{s.description}</p>
            </div>

            <div className="pt-2 border-t flex justify-end gap-1">
              <button onClick={() => openModal(s)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => onDeleteStory(s.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white dark:bg-slate-900 border rounded-2xl p-5 max-w-lg w-full space-y-4">
            <div className="flex justify-between font-bold text-base">
              <span>{editingStory ? 'Editar História' : 'Cadastrar História'}</span>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Título do livro" className="w-full p-2.5 border rounded-xl" />
              <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Autor(a)" className="w-full p-2.5 border rounded-xl" />
              <input type="text" value={ageRange} onChange={e => setAgeRange(e.target.value)} placeholder="Faixa etária ex: 3 a 5 anos" className="w-full p-2.5 border rounded-xl" />
              <ImageUploader
                imageUrl={imageUrl}
                onImageUrlChange={setImageUrl}
                multiple={false}
                label="Capa da História / Livro"
                hint="Envie uma foto da capa do livro ou ilustração"
              />
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Sinopse / Descrição" rows={3} className="w-full p-2.5 border rounded-xl" />
              <textarea value={objectives} onChange={e => setObjectives(e.target.value)} placeholder="Objetivos pedagógicos" rows={2} className="w-full p-2.5 border rounded-xl" />

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-semibold">Cancelar</button>
                <button type="submit" className="px-5 py-2 font-semibold bg-amber-600 text-white rounded-xl">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
