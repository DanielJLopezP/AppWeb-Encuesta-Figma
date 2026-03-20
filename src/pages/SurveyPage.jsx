import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import FigmaEmbed from '../components/FigmaEmbed';
import SurveyForm from '../components/SurveyForm';
import SuccessView from '../components/SuccessView';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SurveyPage() {
  const { config, loading } = useAppStore();
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleSuccess = (data) => {
    setSubmittedData(data);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-8xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {(config.app_name || 'A').charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">{config.app_name || 'Concept Feedback'}</h1>
              <p className="text-xs text-slate-500">Estudio de viabilidad</p>
            </div>
          </div>
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-900 transition-colors px-3 py-1.5 rounded hover:bg-slate-100"
          >
            <Settings size={13} />
            <span className="hidden sm:inline">Administrar</span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <div className="max-w-8xl mx-auto h-full space-y-6">
          
          {/* Introducción */}
          {(config.show_description ?? true) && (
            <div className="max-w-3xl animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Ayúdanos a dar forma al futuro</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {config.description || 'Estamos evaluando el interés del mercado antes de desarrollar la aplicación real. Navega por este diseño conceptual (sneak peek) y ayúdanos a entender si esta herramienta te sería útil.'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full min-h-[calc(100vh-200px)]">

            {/* Figma Embed */}
            <div className="xl:col-span-8 flex flex-col rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm min-h-[500px] xl:min-h-0">
              <FigmaEmbed figmaUrl={config.figma_url} appName={config.app_name} />
            </div>

            {/* Survey Panel */}
            <div className="xl:col-span-4 flex flex-col border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
              <div className="p-6 md:p-8 flex-grow min-h-[450px]">
                {submitted ? (
                  <SuccessView data={submittedData} onReset={() => { setSubmitted(false); setSubmittedData(null); }} />
                ) : (
                  <SurveyForm questions={config.questions || []} onSuccess={handleSuccess} />
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
