import React, { useState } from 'react';
import { Save, Link2, Type } from 'lucide-react';

export default function AppSettings({ config, onSave }) {
  const [appName, setAppName] = useState(config.app_name || '');
  const [description, setDescription] = useState(config.description || '');
  const [showDescription, setShowDescription] = useState(config.show_description ?? true);
  const [figmaUrl, setFigmaUrl] = useState(config.figma_url || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ ...config, app_name: appName, description: description, show_description: showDescription, figma_url: figmaUrl });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-1">Configuración de la App</h3>
        <p className="text-sm text-slate-500">Personaliza el nombre y el prototipo que se muestra a los usuarios.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
            <Type size={14} className="text-slate-500" />
            Nombre de la aplicación
          </label>
          <input
            type="text"
            value={appName}
            onChange={e => setAppName(e.target.value)}
            placeholder="Ej. FinControl"
            required
            className="w-full px-4 py-3 rounded-lg text-sm text-slate-900 bg-white border border-slate-200 outline-none transition-colors"
            onFocus={e => e.target.style.borderColor = '#0f172a'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
          <p className="text-xs text-slate-500">Este nombre aparece en el header y en el visor de prototipo.</p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
              <Type size={14} className="text-slate-500" />
              Texto de introducción (Sneak Peek)
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <span className={showDescription ? 'text-slate-900 font-medium' : 'text-slate-500'}>
                {showDescription ? 'Visible' : 'Oculto'}
              </span>
              <div 
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${showDescription ? 'bg-slate-900' : 'bg-slate-300'}`}
                onClick={() => setShowDescription(!showDescription)}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${showDescription ? 'translate-x-4.5' : 'translate-x-1'}`} />
              </div>
            </label>
          </div>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={!showDescription}
            placeholder="Ej. Estamos evaluando el interés del mercado..."
            required={showDescription}
            className={`w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors resize-none border ${showDescription ? 'bg-white text-slate-900 border-slate-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
            onFocus={e => { if(showDescription) e.target.style.borderColor = '#0f172a'; }}
            onBlur={e => { if(showDescription) e.target.style.borderColor = '#e2e8f0'; }}
          />
          <p className="text-xs text-slate-500">Este texto aparece en la página principal, antes del prototipo.</p>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
            <Link2 size={14} className="text-slate-500" />
            URL del embed de Figma
          </label>
          <textarea
            rows={3}
            value={figmaUrl}
            onChange={e => setFigmaUrl(e.target.value)}
            placeholder="https://embed.figma.com/proto/..."
            className="w-full px-4 py-3 rounded-lg text-sm text-slate-900 bg-white border border-slate-200 outline-none transition-colors resize-none"
            onFocus={e => e.target.style.borderColor = '#0f172a'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
          <p className="text-xs text-slate-500">
            En Figma: Prototype → Share → Embed → copia el link del iframe <strong className="text-slate-700">src="..."</strong>
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm text-white transition-colors ${saved ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800'}`}
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Guardando...</>
            ) : saved ? (
              <>✓ Guardado</>
            ) : (
              <><Save size={16} />Guardar cambios</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
