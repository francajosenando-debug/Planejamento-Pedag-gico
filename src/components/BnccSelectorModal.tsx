import React, { useState, useMemo } from 'react';
import { X, Search, Check, FileText, Filter } from 'lucide-react';
import { BNCC_DATA } from '../data/bnccData';
import { BNCCItem } from '../types';

interface BnccSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCodes: string[];
  onSelectCodes: (codes: string[]) => void;
}

export const BnccSelectorModal: React.FC<BnccSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedCodes,
  onSelectCodes,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState<string>('ALL');
  const [fieldFilter, setFieldFilter] = useState<string>('ALL');
  const [tempCodes, setTempCodes] = useState<string[]>(selectedCodes);

  // Sync temp state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTempCodes(selectedCodes);
    }
  }, [isOpen, selectedCodes]);

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

  if (!isOpen) return null;

  const toggleCode = (code: string) => {
    if (tempCodes.includes(code)) {
      setTempCodes(tempCodes.filter((c) => c !== code));
    } else {
      setTempCodes([...tempCodes, code]);
    }
  };

  const handleApply = () => {
    onSelectCodes(tempCodes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full h-[85vh] flex flex-col overflow-hidden"
        id="bncc-modal-container"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Banco de Objetivos da BNCC
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selecione os objetivos para vincular à sua aula.
              </p>
            </div>
          </div>
          <button
            id="bncc-modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input 
              id="bncc-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por código (ex: EI03ET07) ou palavra-chave..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Age Filter */}
            <select
              id="bncc-age-filter"
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none font-medium"
            >
              <option value="ALL">Todas as Faixas Etárias</option>
              <option value="EI01">EI01 - Bebês (0 a 1 ano e 6 meses)</option>
              <option value="EI02">EI02 - Crianças bem pequenas (1a7m a 3a11m)</option>
              <option value="EI03">EI03 - Crianças pequenas (4a a 5a11m)</option>
            </select>

            {/* Field Filter */}
            <select
              id="bncc-field-filter"
              value={fieldFilter}
              onChange={(e) => setFieldFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none font-medium"
            >
              <option value="ALL">Todos os Campos de Experiência</option>
              <option value="EO">O eu, o outro e o nós (EO)</option>
              <option value="CG">Corpo, gestos e movimentos (CG)</option>
              <option value="TS">Traços, sons, cores e formas (TS)</option>
              <option value="EF">Escuta, fala, pensamento e imaginação (EF)</option>
              <option value="ET">Espaços, tempos, quantidades... (ET)</option>
            </select>

            <div className="ml-auto text-xs text-slate-500 font-medium">
              {tempCodes.length} selecionado(s)
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-slate-100 dark:divide-slate-800">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Nenhum objetivo da BNCC encontrado com os filtros atuais.
            </div>
          ) : (
            filteredItems.map((item) => {
              const isSelected = tempCodes.includes(item.code);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCode(item.code)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-sky-600 border-sky-600 text-white'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-xs px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200">
                        {item.code}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {item.fieldName}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-auto">
                        {item.ageGroupCode}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setTempCodes([])}
            className="text-xs text-slate-500 hover:text-red-600 dark:hover:text-red-400 font-medium"
          >
            Limpar Seleção
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-500/20 transition-all"
            >
              Aplicar Objetivos ({tempCodes.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
