import React, { useState } from 'react';
import { Search, Music, Plus, Star, Trash2, Edit2, ExternalLink, PlayCircle } from 'lucide-react';
import { Song } from '../types';

interface SongBankProps {
  songs: Song[];
  onSaveSong: (song: Song) => void;
  onDeleteSong: (id: string) => void;
}

export const SongBank: React.FC<SongBankProps> = ({ songs, onSaveSong, onDeleteSong }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [objective, setObjective] = useState('');
  const [notes, setNotes] = useState('');

  const filtered = songs.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.author && s.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openModal = (song?: Song) => {
    if (song) {
      setEditingSong(song);
      setName(song.name);
      setAuthor(song.author || '');
      setYoutubeUrl(song.youtubeUrl || '');
      setObjective(song.objective);
      setNotes(song.notes || '');
    } else {
      setEditingSong(null);
      setName('');
      setAuthor('');
      setYoutubeUrl('');
      setObjective('');
      setNotes('');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveSong({
      id: editingSong ? editingSong.id : `song-${Date.now()}`,
      userId: editingSong ? editingSong.userId : 'current-user',
      name,
      author,
      youtubeUrl,
      objective,
      notes,
      isFavorite: editingSong ? editingSong.isFavorite : false,
      createdAt: editingSong ? editingSong.createdAt : new Date().toISOString()
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-pink-600" />
            <span>Banco de Músicas</span>
          </h1>
          <p className="text-xs text-slate-500">Cadastre cantigas, vídeos do YouTube e objetivos musicais.</p>
        </div>

        <button
          onClick={() => openModal()}
          className="px-4 py-2.5 rounded-xl bg-pink-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Música</span>
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar música..."
          className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-white dark:bg-slate-900 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map(s => (
          <div key={s.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{s.name}</h3>
                  <p className="text-xs text-slate-500">{s.author || 'Domínio Público'}</p>
                </div>
                <Music className="w-5 h-5 text-pink-500 shrink-0" />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{s.objective}</p>

              {s.youtubeUrl && (
                <a
                  href={s.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Assistir no YouTube</span>
                </a>
              )}
            </div>

            <div className="pt-2 border-t flex justify-end gap-1">
              <button onClick={() => openModal(s)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => onDeleteSong(s.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white dark:bg-slate-900 border rounded-2xl p-5 max-w-lg w-full space-y-4">
            <div className="flex justify-between font-bold text-base">
              <span>{editingSong ? 'Editar Música' : 'Cadastrar Música'}</span>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nome da música" className="w-full p-2.5 border rounded-xl" />
              <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Autor / Grupo (ex: Palavra Cantada)" className="w-full p-2.5 border rounded-xl" />
              <input type="text" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="Link do YouTube (opcional)" className="w-full p-2.5 border rounded-xl" />
              <textarea value={objective} onChange={e => setObjective(e.target.value)} placeholder="Objetivo pedagógico musical" rows={3} className="w-full p-2.5 border rounded-xl" />

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-semibold">Cancelar</button>
                <button type="submit" className="px-5 py-2 font-semibold bg-pink-600 text-white rounded-xl">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
