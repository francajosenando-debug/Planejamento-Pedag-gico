import React, { useRef } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Smile, Eraser } from 'lucide-react';

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}

const COMMON_EMOJIS = ['😊', '⭐', '🎨', '🎵', '⚽', '📚', '🧩', '🌱', '☀️', '❤️', '👏', '✏️'];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Digite aqui...',
  rows = 4
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.substring(start, end);

    let replacement = '';
    if (selected) {
      replacement = `${prefix}${selected}${suffix}`;
    } else {
      replacement = `${prefix}texto${suffix}`;
    }

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const applyList = (bulletChar: string) => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.substring(start, end);

    if (!selected) {
      const newValue = value.substring(0, start) + `\n${bulletChar} ` + value.substring(end);
      onChange(newValue);
      return;
    }

    const lines = selected.split('\n');
    const formattedLines = lines.map(line => line.startsWith(bulletChar) ? line : `${bulletChar} ${line}`);
    const newValue = value.substring(0, start) + formattedLines.join('\n') + value.substring(end);
    onChange(newValue);
  };

  const insertEmoji = (emoji: string) => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newValue = value.substring(0, start) + emoji + value.substring(end);
    onChange(newValue);
  };

  return (
    <div className="space-y-1.5" id={`editor-wrapper-${label?.toLowerCase().replace(/\s+/g, '-') || 'text'}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-blue-500 transition-all shadow-sm">
        {/* Formatting Toolbar */}
        <div className="flex items-center flex-wrap gap-1 p-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs">
          <button
            type="button"
            onClick={() => applyFormat('**', '**')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Negrito (**texto**)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          
          <button
            type="button"
            onClick={() => applyFormat('*', '*')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Itálico (*texto*)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => applyFormat('__', '__')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Sublinhado"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={() => applyList('•')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Lista com marcadores"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => applyList('1.')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Lista numerada"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* Emojis palette */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[180px] sm:max-w-none">
            {COMMON_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => insertEmoji(emoji)}
                className="hover:scale-125 transition-transform text-xs p-0.5"
              >
                {emoji}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onChange('')}
            className="ml-auto p-1.5 rounded hover:bg-red-100 text-red-600 dark:hover:bg-red-950/40 transition-colors"
            title="Limpar texto"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full p-3 bg-transparent text-sm text-slate-900 dark:text-slate-100 outline-none resize-y leading-relaxed font-sans"
        />
      </div>
    </div>
  );
};
