import React, { useState, useMemo } from 'react';
import { Search, FileText, Copy, Check } from 'lucide-react';
import { BNCC_DATA } from '../data/bnccData';

export const BnccExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('ALL');
  const [fieldFilter, setFieldFilter] = useState('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return BNCC_DATA.filter((item) => {
      const matchesSearch = 
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fieldName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAge = ageFilter === 'ALL' || item.ageGroupCode === ageFilter;
      const matchesField = fieldFilter === 'ALL' || item.fieldOfExperience === fieldFilter;

      return matchesSearch && matchesAge && matchesField;
    });
  }, [searchTerm, ageFilter, fieldFilter]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600" />
            <span>Banco Oficial BNCC – Educação Infantil</span>
          </h1>
          <p className="text-xs text-slate-500">
            Consulte a Base Nacional Comum Curricular por código, faixa etária e campos de experiência.
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por código (ex: EI03ET07) ou texto..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
            />
          </div>

          <select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="py-2 px-3 text-xs font-medium rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
          >
            <option value="ALL">Todas as Faixas Etárias</option>
            <option value="EI01">EI01 - Bebês (0 a 1a6m)</option>
            <option value="EI02">EI02 - Crianças bem pequenas (1a7m a 3a11m)</option>
            <option value="EI03">EI03 - Crianças pequenas (4a a 5a11m)</option>
          </select>

          <select
            value={fieldFilter}
            onChange={(e) => setFieldFilter(e.target.value)}
            className="py-2 px-3 text-xs font-medium rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
          >
            <option value="ALL">Todos os Campos de Experiência</option>
            <option value="EO">O eu, o outro e o nós (EO)</option>
            <option value="CG">Corpo, gestos e movimentos (CG)</option>
            <option value="TS">Traços, sons, cores e formas (TS)</option>
            <option value="EF">Escuta, fala, pensamento e imaginação (EF)</option>
            <option value="ET">Espaços, tempos, quantidades... (ET)</option>
          </select>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2 flex items-start justify-between gap-4 hover:border-sky-300 transition-all"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-xs px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-200">
                  {item.code}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {item.fieldName}
                </span>
                <span className="text-[11px] text-slate-400">
                  • {item.ageGroup}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                {item.description}
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(item.code)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
              title="Copiar Código"
            >
              {copiedCode === item.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
