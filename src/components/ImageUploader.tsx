import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Eye, Trash2 } from 'lucide-react';

interface ImageUploaderProps {
  images?: string[]; // Array of base64 or URLs
  imageUrl?: string; // Single URL / base64 for single mode
  onImagesChange?: (urls: string[]) => void;
  onImageUrlChange?: (url: string) => void;
  multiple?: boolean;
  label?: string;
  hint?: string;
  maxFiles?: number;
  maxSizeMB?: number;
}

/**
 * Resizes an image file if needed to keep base64 strings compact and performant.
 */
const compressImage = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality));
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images = [],
  imageUrl = '',
  onImagesChange,
  onImageUrlChange,
  multiple = false,
  label = 'Upload de Imagem',
  hint = 'Formatos suportados: PNG, JPG, WEBP, GIF. Máximo 5MB por foto.',
  maxFiles = 5,
  maxSizeMB = 5
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize current items list
  const currentList = multiple ? images : (imageUrl ? [imageUrl] : []);

  const handleFiles = async (files: FileList | File[]) => {
    setErrorMessage(null);
    setIsUploading(true);

    const validFiles: File[] = [];
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage(`O arquivo "${file.name}" não é uma imagem válida.`);
        continue;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setErrorMessage(`O arquivo "${file.name}" ultrapassa o limite de ${maxSizeMB}MB.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      setIsUploading(false);
      return;
    }

    try {
      const processedUrls: string[] = [];
      for (const file of validFiles) {
        const compressedBase64 = await compressImage(file);
        processedUrls.push(compressedBase64);
      }

      if (multiple && onImagesChange) {
        const updated = [...images, ...processedUrls].slice(0, maxFiles);
        onImagesChange(updated);
      } else if (onImageUrlChange) {
        onImageUrlChange(processedUrls[0]);
      } else if (onImagesChange) {
        onImagesChange([processedUrls[0]]);
      }
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      setErrorMessage('Erro ao carregar a imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleAddUrl = () => {
    if (!urlInputValue.trim()) return;
    const trimmed = urlInputValue.trim();
    if (multiple && onImagesChange) {
      onImagesChange([...images, trimmed].slice(0, maxFiles));
    } else if (onImageUrlChange) {
      onImageUrlChange(trimmed);
    } else if (onImagesChange) {
      onImagesChange([trimmed]);
    }
    setUrlInputValue('');
    setShowUrlInput(false);
  };

  const handleRemove = (indexToRemove: number) => {
    if (multiple && onImagesChange) {
      const updated = images.filter((_, idx) => idx !== indexToRemove);
      onImagesChange(updated);
    } else if (onImageUrlChange) {
      onImageUrlChange('');
    } else if (onImagesChange) {
      onImagesChange([]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Upload de Arquivo' : 'Inserir URL da Web'}</span>
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={urlInputValue}
            onChange={(e) => setUrlInputValue(e.target.value)}
            placeholder="Cole a URL da imagem aqui (ex: https://...)"
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Adicionar
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50/60 dark:bg-slate-800/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isDragging ? 'Solte a imagem aqui' : 'Clique ou arraste imagens aqui'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {hint}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="text-xs text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-950/40 p-2 rounded-xl border border-red-200 dark:border-red-900">
          {errorMessage}
        </div>
      )}

      {/* Loading state */}
      {isUploading && (
        <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2">
          <span className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Processando e otimizando a imagem...</span>
        </div>
      )}

      {/* Preview Thumbnails */}
      {currentList.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {currentList.map((url, idx) => (
            <div
              key={idx}
              className="relative group w-20 h-20 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm"
            >
              <img
                src={url}
                alt={`Uploaded ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewModalUrl(url)}
                  className="p-1 rounded-lg bg-white/20 hover:bg-white/40 text-white"
                  title="Ver imagem inteira"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white"
                  title="Remover imagem"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Preview Modal */}
      {previewModalUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center">
            <button
              onClick={() => setPreviewModalUrl(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewModalUrl}
              alt="Visualização"
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
