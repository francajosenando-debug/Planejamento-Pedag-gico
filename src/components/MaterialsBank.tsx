import React, { useState } from 'react';
import { Boxes, Plus, Trash2, Search } from 'lucide-react';
import { MaterialItem } from '../types';
import { DEFAULT_MATERIALS } from '../data/materialsData';

export const MaterialsBank: React.FC = () => {
  const [materials, setMaterials] = useState<MaterialItem[]>(DEFAULT_MATERIALS);
  const [searchTerm, setSearchTerm] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Geral');

  const safeMaterials = Array.isArray(materials) ? materials : [];

  const filtered = safeMaterials.filter(m => 
    m && (
      (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: MaterialItem = {
      id: `mat-${Date.now()}`,
      name: newName,
      category: newCategory
    };
    setMaterials([...safeMaterials, newItem]);
    setNewName('');
  };

  const handleDelete = (id: string) => {
    setMaterials(safeMaterials.filter(m => m && m.id !== id));
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-teal-600" />
            <span>Banco de Materiais Pedagógicos</span>
          </h1>
          <p className="text-xs text-slate-500">Catálogo de materiais reutilizáveis para rápida seleção em aulas.</p>
        </div>

        {/* Add Form */}
        <form onSubmit={handleAdd} className="flex flex-wrap items-center gap-2 text-xs">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome do material ex: Sucatas de papelão"
            className="flex-1 min-w-[200px] p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          />
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Categoria ex: Sucata"
            className="w-36 p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold flex items-center gap-1 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </form>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar material..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border bg-white dark:bg-slate-900 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shadow-sm"
          >
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">{m.name}</div>
              <div className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">{m.category}</div>
            </div>

            <button
              onClick={() => handleDelete(m.id)}
              className="p-1 text-slate-400 hover:text-red-600"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
