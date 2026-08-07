import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Search, Check, Sparkles, ListChecks } from 'lucide-react';

export interface RoutinePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'title' | 'description';
  currentValue?: string;
  onSelect: (value: string, append?: boolean) => void;
}

export interface CustomDescriptionPreset {
  id: string;
  label: string;
  text: string;
}

const DEFAULT_TITLES: string[] = [
  "ROTINA / ACOLHIDA",
  "RODA DE CONVERSA / CHAMADINHA",
  "ALMOÇO / HIGIENE / BANHEIRO",
  "LANCHINHO / HIGIENIZAÇÃO",
  "PARQUE / RECREAÇÃO / PARQUINHO",
  "CONTAÇÃO DE HISTÓRIAS / RODA DE LEITURA",
  "MOMENTO BÍBLICO / DEVOCIONAL",
  "ATIVIDADE DIRIGIDA / PEDAGÓGICA",
  "MÚSICA E MOVIMENTO / EXPRESSÃO CORPORAL",
  "SONO / DESCANSO / CALMARIA",
  "DESPEDIDA / ORGANIZAÇÃO DA SALA"
];

const DEFAULT_DESCRIPTIONS: CustomDescriptionPreset[] = [
  {
    id: 'def-1',
    label: 'Acolhida e Rotina Inicial',
    text: '- Higienização: Banheiro e encher as garrafas com água.\n- Rotina: Chamada, calendário, tempo, quantos somos.\n- Oração e devocional inicial.'
  },
  {
    id: 'def-2',
    label: 'Lanche e Higienização',
    text: '- Higienização das mãos com água e sabão.\n- Lanche supervisionado incentivando a autonomia.\n- Escovação dos dentes e higiene pessoal.'
  },
  {
    id: 'def-3',
    label: 'Almoço e Descanso',
    text: '- Higienização antes e após a refeição.\n- Almoço coletivo com estímulo à alimentação saudável.\n- Momento de calmaria, música suave ou descanso.'
  },
  {
    id: 'def-4',
    label: 'Parque e Recreação',
    text: '- Recreação ao ar livre no parquinho da escola.\n- Brincadeiras dirigidas de socialização e expressão corporal.'
  },
  {
    id: 'def-5',
    label: 'Contação de Histórias',
    text: '- Acomodação dos alunos em roda no tapete.\n- Leitura dramatizada com apoio de livro, fantoches ou imagens.\n- Diálogo e participação ativa das crianças sobre a história.'
  },
  {
    id: 'def-6',
    label: 'Momento Bíblico / Devocional',
    text: '- Cantar louvores e canções educativas infantis.\n- Apresentação lúdica da passagem e princípio bíblico do dia.\n- Oração comunitária de agradecimento.'
  },
  {
    id: 'def-7',
    label: 'Música e Expressão Corporal',
    text: '- Atividades de ritmo, dança e coordenação motor ampla.\n- Uso de instrumentos musicais infantis e rodas cantadas.'
  },
  {
    id: 'def-8',
    label: 'Despedida e Encerramento',
    text: '- Organização dos brinquedos e materiais na sala de aula.\n- Arrumação das mochilas e momento de calmaria.\n- Despedida afetuosa e entrega aos responsáveis.'
  }
];

export const RoutinePresetModal: React.FC<RoutinePresetModalProps> = ({
  isOpen,
  onClose,
  mode,
  currentValue = '',
  onSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appendOption, setAppendOption] = useState(false);

  // Custom User Titles State
  const [customTitles, setCustomTitles] = useState<string[]>([]);
  const [newTitleInput, setNewTitleInput] = useState('');
  const [showAddTitleForm, setShowAddTitleForm] = useState(false);

  // Custom User Descriptions State
  const [customDescriptions, setCustomDescriptions] = useState<CustomDescriptionPreset[]>([]);
  const [newDescLabel, setNewDescLabel] = useState('');
  const [newDescText, setNewDescText] = useState('');
  const [showAddDescForm, setShowAddDescForm] = useState(false);

  // Load custom presets from localStorage on open
  useEffect(() => {
    if (!isOpen) return;

    try {
      const savedTitles = localStorage.getItem('custom_routine_titles');
      if (savedTitles) {
        setCustomTitles(JSON.parse(savedTitles));
      }

      const savedDescs = localStorage.getItem('custom_routine_descriptions');
      if (savedDescs) {
        setCustomDescriptions(JSON.parse(savedDescs));
      }
    } catch (e) {
      console.error("Erro ao carregar modelos do localStorage", e);
    }

    setSearchTerm('');
    setNewTitleInput('');
    setNewDescLabel('');
    setNewDescText('');
    setShowAddTitleForm(false);
    setShowAddDescForm(false);
  }, [isOpen]);

  if (!isOpen) return null;

  // Title Management
  const handleAddCustomTitle = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitleInput.trim();
    if (!trimmed) return;

    if (customTitles.includes(trimmed) || DEFAULT_TITLES.includes(trimmed)) {
      alert('Este título já existe na lista!');
      return;
    }

    const updated = [trimmed, ...customTitles];
    setCustomTitles(updated);
    try {
      localStorage.setItem('custom_routine_titles', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setNewTitleInput('');
    setShowAddTitleForm(false);
  };

  const handleDeleteCustomTitle = (titleToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customTitles.filter(t => t !== titleToDelete);
    setCustomTitles(updated);
    try {
      localStorage.setItem('custom_routine_titles', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Description Management
  const handleAddCustomDescription = (e: React.FormEvent) => {
    e.preventDefault();
    const label = newDescLabel.trim() || 'Novo Modelo de Descrição';
    const text = newDescText.trim();
    if (!text) return;

    const newPreset: CustomDescriptionPreset = {
      id: `custom-desc-${Date.now()}`,
      label,
      text
    };

    const updated = [newPreset, ...customDescriptions];
    setCustomDescriptions(updated);
    try {
      localStorage.setItem('custom_routine_descriptions', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setNewDescLabel('');
    setNewDescText('');
    setShowAddDescForm(false);
  };

  const handleDeleteCustomDesc = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customDescriptions.filter(d => d.id !== idToDelete);
    setCustomDescriptions(updated);
    try {
      localStorage.setItem('custom_routine_descriptions', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered lists
  const allTitles = [...customTitles, ...DEFAULT_TITLES];
  const filteredTitles = allTitles.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

  const allDescriptions = [...customDescriptions, ...DEFAULT_DESCRIPTIONS];
  const filteredDescriptions = allDescriptions.filter(
    d => d.label.toLowerCase().includes(searchTerm.toLowerCase()) || d.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {mode === 'title' ? <ListChecks className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {mode === 'title' ? 'Modelos de Título para Rotina' : 'Modelos de Descrição para Rotina'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {mode === 'title' 
                  ? 'Selecione um título pré-configurado ou adicione um novo' 
                  : 'Escolha um modelo pronto para preencher rapidamente a descrição'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Mode Controls */}
        <div className="p-4 space-y-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={mode === 'title' ? 'Buscar título...' : 'Buscar modelo de descrição...'}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {mode === 'description' && currentValue && currentValue.trim().length > 0 && (
            <div className="flex items-center gap-4 text-xs pt-1">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Ao selecionar:</span>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="radio"
                  name="appendMode"
                  checked={!appendOption}
                  onChange={() => setAppendOption(false)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Substituir texto atual</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="radio"
                  name="appendMode"
                  checked={appendOption}
                  onChange={() => setAppendOption(true)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Anexar ao texto atual</span>
              </label>
            </div>
          )}
        </div>

        {/* Content List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          
          {/* TITLE MODE */}
          {mode === 'title' && (
            <>
              {/* Add New Title Button/Form */}
              {!showAddTitleForm ? (
                <button
                  type="button"
                  onClick={() => setShowAddTitleForm(true)}
                  className="w-full py-2.5 px-3 border border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl text-blue-600 dark:text-blue-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Novo Título de Rotina</span>
                </button>
              ) : (
                <form onSubmit={handleAddCustomTitle} className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-200">Novo Título Personalizado:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTitleInput}
                      onChange={(e) => setNewTitleInput(e.target.value)}
                      placeholder="Ex: HORA DA LEITURA E CONTAÇÃO"
                      autoFocus
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddTitleForm(false)}
                      className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              {/* List of Titles */}
              <div className="space-y-1.5 pt-1">
                {filteredTitles.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">Nenhum título encontrado.</p>
                ) : (
                  filteredTitles.map((title) => {
                    const isCustom = customTitles.includes(title);
                    const isSelected = currentValue === title;

                    return (
                      <div
                        key={title}
                        onClick={() => {
                          onSelect(title);
                          onClose();
                        }}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 font-bold text-blue-700 dark:text-blue-300'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-xs font-semibold truncate">{title}</span>
                          {isCustom && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex-shrink-0">
                              Personalizado
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                          {isCustom && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteCustomTitle(title, e)}
                              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-950/60 text-slate-400 hover:text-red-600 transition-colors"
                              title="Excluir este título personalizado"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* DESCRIPTION MODE */}
          {mode === 'description' && (
            <>
              {/* Add New Description Button/Form */}
              {!showAddDescForm ? (
                <button
                  type="button"
                  onClick={() => setShowAddDescForm(true)}
                  className="w-full py-2.5 px-3 border border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl text-blue-600 dark:text-blue-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Novo Modelo de Descrição</span>
                </button>
              ) : (
                <form onSubmit={handleAddCustomDescription} className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-200">Novo Modelo Personalizado:</span>
                  <input
                    type="text"
                    value={newDescLabel}
                    onChange={(e) => setNewDescLabel(e.target.value)}
                    placeholder="Nome do modelo (ex: Rotina da Manhã - Infantil II)"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <textarea
                    value={newDescText}
                    onChange={(e) => setNewDescText(e.target.value)}
                    placeholder="- Descrição detalhada do modelo..."
                    rows={3}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddDescForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                    >
                      Salvar Modelo
                    </button>
                  </div>
                </form>
              )}

              {/* List of Description Presets */}
              <div className="space-y-2 pt-1">
                {filteredDescriptions.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">Nenhum modelo de descrição encontrado.</p>
                ) : (
                  filteredDescriptions.map((desc) => {
                    const isCustom = desc.id.startsWith('custom-desc-');

                    return (
                      <div
                        key={desc.id}
                        onClick={() => {
                          onSelect(desc.text, appendOption);
                          onClose();
                        }}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 text-left transition-all cursor-pointer group relative"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{desc.label}</span>
                            {isCustom && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                Personalizado
                              </span>
                            )}
                          </span>

                          <div className="flex items-center gap-1">
                            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              Usar este modelo
                            </span>
                            {isCustom && (
                              <button
                                type="button"
                                onClick={(e) => handleDeleteCustomDesc(desc.id, e)}
                                className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-950/60 text-slate-400 hover:text-red-600 transition-colors"
                                title="Excluir este modelo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line bg-white/60 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50">
                          {desc.text}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
