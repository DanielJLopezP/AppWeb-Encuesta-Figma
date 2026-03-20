import React from 'react';
import { Monitor, Maximize2, ExternalLink } from 'lucide-react';

const FigmaEmbed = ({ figmaUrl, appName }) => {
  const openFullscreen = () => {
    if (figmaUrl) window.open(figmaUrl, '_blank');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-white/80 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          {/* macOS dots */}
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex items-center gap-1.5 ml-1">
            <Monitor size={12} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-400">
              {appName ? `${appName} — Prototipo` : 'Visualizador de Prototipo'}
            </span>
          </div>
        </div>
        {figmaUrl && (
          <button
            onClick={openFullscreen}
            title="Abrir en pantalla completa"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-500 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50"
          >
            <ExternalLink size={12} />
            <span className="hidden sm:inline">Pantalla completa</span>
          </button>
        )}
      </div>

      {/* Iframe o Placeholder */}
      <div className="flex-grow relative bg-slate-100 figma-frame flex flex-col">
        {!figmaUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center">
              <Monitor size={28} className="text-slate-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-600 mb-1">Sin prototipo configurado</p>
              <p className="text-sm text-slate-400">Ve al panel de administración para agregar la URL de tu prototipo de Figma.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Warning Banner */}
            <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-2 flex items-center justify-center text-center z-10 relative">
              <p className="text-xs text-indigo-800 font-medium">
                <span className="font-bold mr-1">Nota:</span> 
                Este es un diseño interactivo preliminar (prototipo), no la aplicación final funcional.
              </p>
            </div>
            <div className="flex-grow relative w-full">
              <iframe
                className="absolute inset-0 w-full h-full border-0"
                src={figmaUrl}
                allowFullScreen
                title="Figma Prototype"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FigmaEmbed;
