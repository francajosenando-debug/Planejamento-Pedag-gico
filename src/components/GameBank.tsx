import React, { useState } from 'react';
import { Search, Gamepad2, Plus, Star, Trash2, Edit2, X } from 'lucide-react';
import { Game } from '../types';

interface GameBankProps {
  games: Game[];
  onSaveGame: (game: Game) => void;
  onDeleteGame: (id: string) => void;
}

export const GameBank: React.FC<GameBankProps> = ({ games, onSaveGame, onDeleteGame }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Circuito Motor');
  const [materials, setMaterials] = useState('');
  const [description, setDescription] = useState('');
  const [objectives, setObjectives] = useState('');
  const [ageRange, setAgeRange] = useState('4 a 5 anos');

  const filtered = games.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (game?: Game) => {
    if (game) {
      setEditingGame(game);
      setName(game.name);
      setCategory(game.category);
      setMaterials(game.materials);
      setDescription(game.description);
      setObjectives(game.objectives);
      setAgeRange(game.ageRange);
    } else {
      setEditingGame(null);
      setName('');
      setCategory('Circuito Motor');
      setMaterials('');
      setDescription('');
      setObjectives('');
      setAgeRange('4 a 5 anos');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveGame({
      id: editingGame ? editingGame.id : `game-${Date.now()}`,
      userId: editingGame ? editingGame.userId : 'current-user',
      name,
      category,
      materials,
      description,
      objectives,
      ageRange,
      isFavorite: editingGame ? editingGame.isFavorite : false,
      createdAt: editingGame ? editingGame.createdAt : new Date().toISOString()
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-indigo-600" />
            <span>Banco de Brincadeiras e Jogos</span>
          </h1>
          <p className="text-xs text-slate-500">Cadastre circuitos motores, brincadeiras de roda e dinâmicas.</p>
        </div>

        <button
          onClick={() => openModal()}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Brincadeira</span>
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar brincadeira ou categoria..."
          className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-white dark:bg-slate-900 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map(g => (
          <div key={g.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">{g.category}</span>
                <span className="text-[10px] text-slate-400">{g.ageRange}</span>
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{g.name}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-4">{g.description}</p>
              {g.materials && <p className="text-[11px] text-slate-500 mt-2"><strong>Materiais:</strong> {g.materials}</p>}
            </div>

            <div className="pt-2 border-t flex justify-end gap-1">
              <button onClick={() => openModal(g)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => onDeleteGame(g.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white dark:bg-slate-900 border rounded-2xl p-5 max-w-lg w-full space-y-4">
            <div className="flex justify-between font-bold text-base">
              <span>{editingGame ? 'Editar Brincadeira' : 'Cadastrar Brincadeira'}</span>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nome da brincadeira" className="w-full p-2.5 border rounded-xl" />
              <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Categoria (ex: Circuito Motor, Roda)" className="w-full p-2.5 border rounded-xl" />
              <input type="text" value={ageRange} onChange={e => setAgeRange(e.target.value)} placeholder="Faixa etária ex: 4 a 5 anos" className="w-full p-2.5 border rounded-xl" />
              <input type="text" value={materials} onChange={e => setMaterials(e.target.value)} placeholder="Materiais necessários" className="w-full p-2.5 border rounded-xl" />
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Regras e explicação da brincadeira" rows={4} className="w-full p-2.5 border rounded-xl" />
              <textarea value={objectives} onChange={e => setObjectives(e.target.value)} placeholder="Objetivos pedagógicos" rows={2} className="w-full p-2.5 border rounded-xl" />

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-semibold">Cancelar</button>
                <button type="submit" className="px-5 py-2 font-semibold bg-indigo-600 text-white rounded-xl">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
