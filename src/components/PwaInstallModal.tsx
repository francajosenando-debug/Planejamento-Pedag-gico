import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Share, PlusSquare, CheckCircle, Sparkles, ShieldCheck, ExternalLink, Info } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  installPrompt: any;
  onInstallNative: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  installPrompt,
  onInstallNative
}) => {
  if (!isOpen) return null;

  const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isInIframe = window.self !== window.top;

  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 my-auto">
        
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-1.5 leading-tight">
                <span>Instalar WebApp (PWA)</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                CCC Planejamento como App Nativo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Iframe Notice if opened inside preview frame */}
        {isInIframe && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <p className="font-bold">Aviso sobre o Modo de Instalação:</p>
                <p className="leading-relaxed">
                  Dentro do visualizador de testes (iframe), o navegador só permite a opção <em>"Adicionar Atalho"</em>. Para habilitar o botão de <strong>"Instalar Aplicativo Nativo (WebApp)"</strong>, abra o app em uma aba separada.
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenNewTab}
              className="w-full mt-1.5 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir em Nova Aba para Instalar</span>
            </button>
          </div>
        )}

        {/* Benefits list */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Aplicativo autônomo na Tela de Início</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Execução offline e em tela cheia (sem barra do navegador)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span>Manifesto PWA 100% certificado (Android & iOS)</span>
          </div>
        </div>

        {/* Native One-Click Install for Android/Chrome */}
        {installPrompt ? (
          <div className="space-y-3 pt-1">
            <button
              onClick={() => {
                onInstallNative();
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4.5 h-4.5" />
              <span>Instalar Aplicativo Agora</span>
            </button>
            <p className="text-[11px] text-center text-slate-400">
              Clique para instalar o WebApp nativo no seu dispositivo.
            </p>
          </div>
        ) : isIos ? (
          /* Step-by-step instructions for iOS (Safari/iPhone) */
          <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-3">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Instruções para iPhone / iPad (iOS)</span>
            </h4>
            
            <ol className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs flex-shrink-0">
                  1
                </div>
                <div>
                  Toque no botão <strong>Compartilhar</strong> <Share className="w-3.5 h-3.5 inline text-blue-600 mb-0.5" /> no rodapé do seu navegador Safari.
                </div>
              </li>

              <li className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs flex-shrink-0">
                  2
                </div>
                <div>
                  Role as opções e selecione <strong className="text-slate-900 dark:text-white flex items-center gap-1 mt-0.5 inline-flex"><PlusSquare className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200" /> "Adicionar à Tela de Início"</strong>.
                </div>
              </li>

              <li className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs flex-shrink-0">
                  3
                </div>
                <div>
                  Toque em <strong>"Adicionar"</strong> no canto superior direito.
                </div>
              </li>
            </ol>
          </div>
        ) : (
          /* General Browser instructions for Android/Chrome/Desktop */
          <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-3">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Como Instalar no Chrome / Android / PC
            </h4>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
              <p>
                1. Certifique-se de estar em uma <strong>aba aberta do navegador</strong> (fora do iframe).
              </p>
              <p>
                2. Clique no ícone de <strong>Instalar Aplicativo (⊕)</strong> na barra de endereços do Chrome ou no menu (três pontinhos ⋮).
              </p>
              <p>
                3. Selecione <strong>"Instalar aplicativo"</strong> para instalar o WebApp completo no celular ou computador.
              </p>
            </div>

            {!isInIframe && (
              <button
                onClick={handleOpenNewTab}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Reabrir em Janela Exclusiva</span>
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};

