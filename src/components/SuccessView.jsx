import React from 'react';
import { CheckCircle, RotateCcw } from 'lucide-react';

const SuccessView = ({ data, onReset }) => {
  const stars = data?.answers ? Object.values(data.answers).find(v => typeof v === 'number') : null;

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[380px] text-center px-4 animate-scale-in gap-5">
      {/* Icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-200">
          <CheckCircle className="w-10 h-10 text-white" strokeWidth={1.5} />
        </div>
        <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Gracias{data?.respondent && data.respondent !== 'Anónimo' ? `, ${data.respondent}` : ''}!</h2>
        <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
          Tus respuestas han sido guardadas. Tu feedback es muy valioso para mejorar la app.
        </p>
      </div>

      {/* Stars summary */}
      {stars !== null && stars !== undefined && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-6 py-3">
          <p className="text-xs text-amber-600 font-medium mb-1.5">Tu calificación</p>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-2xl ${i < stars ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="btn-ghost mt-2"
      >
        <RotateCcw size={14} />
        Responder de nuevo
      </button>
    </div>
  );
};

export default SuccessView;
