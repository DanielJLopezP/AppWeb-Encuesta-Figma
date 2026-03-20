import React, { useState } from 'react';
import { Star, ChevronRight, User } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const QuestionField = ({ question, value, onChange }) => {
  const [hovered, setHovered] = useState(0);

  if (question.type === 'stars') {
    return (
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              className={`w-7 h-7 transition-colors duration-150 ${
                star <= (hovered || value || 0)
                  ? 'fill-slate-800 text-slate-800'
                  : 'text-slate-200 fill-slate-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  }

  if (question.type === 'radio') {
    const opts = question.options || [];
    return (
      <div className="flex flex-col gap-2">
        {opts.map((opt) => (
          <label
            key={opt}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer text-sm transition-colors ${
              value === opt
                ? 'border-slate-800 bg-slate-50 text-slate-900 font-medium'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
              value === opt ? 'border-slate-800' : 'border-slate-300'
            }`}>
              {value === opt && <div className="w-2 h-2 rounded-full bg-slate-800" />}
            </div>
            <input
              type="radio"
              name={question.id}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="hidden"
            />
            {opt}
          </label>
        ))}
      </div>
    );
  }

  if (question.type === 'textarea') {
    return (
      <textarea
        rows={3}
        required={question.required}
        placeholder={question.placeholder || ''}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="input-base resize-none"
      />
    );
  }

  // type === 'text' (default)
  return (
    <input
      type="text"
      required={question.required}
      placeholder={question.placeholder || ''}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="input-base"
    />
  );
};

const SurveyForm = ({ questions, onSuccess }) => {
  const { submitResponse } = useAppStore();
  const [answers, setAnswers] = useState({});
  const [respondent, setRespondent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validate required
    for (const q of questions) {
      if (q.required && (answers[q.id] === undefined || answers[q.id] === '' || answers[q.id] === 0)) {
        setFormError(`Por favor responde: "${q.label}"`);
        return;
      }
    }

    setSubmitting(true);
    const payload = { respondent: respondent || 'Anónimo', answers };
    const result = await submitResponse(payload);
    setSubmitting(false);

    if (result.success) {
      onSuccess(payload);
    } else {
      setFormError('Error al guardar. Intenta de nuevo.');
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center gap-3 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          <User size={24} className="text-slate-400" />
        </div>
        <p className="text-slate-500 text-sm">El administrador aún no ha configurado las preguntas.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Feedback del Concepto</h2>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">Sus respuestas nos ayudarán a entender la viabilidad del proyecto.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-grow">
        {/* Nombre opcional */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">Tu nombre (opcional)</label>
          <input
            type="text"
            placeholder="Ej. Juan García"
            value={respondent}
            onChange={(e) => setRespondent(e.target.value)}
            className="input-base"
          />
        </div>

        {/* Preguntas dinámicas */}
        {questions.map((q, i) => (
          <div key={q.id} className={`space-y-2 animate-fade-in delay-${Math.min(i * 100, 300)}`}>
            <label className="block text-sm font-medium text-slate-900">
              {q.label}
              {q.required && <span className="text-slate-400 ml-1 truncate">*</span>}
            </label>
            <QuestionField
              question={q}
              value={answers[q.id]}
              onChange={(val) => setAnswers(prev => ({ ...prev, [q.id]: val }))}
            />
          </div>
        ))}

        {formError && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{formError}</p>
        )}

        <div className="mt-auto pt-4">
          <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5">
            {submitting ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Enviando...</>
            ) : (
              <><span>Enviar mis respuestas</span><ChevronRight size={16} /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SurveyForm;
