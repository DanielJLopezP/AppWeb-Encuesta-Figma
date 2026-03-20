import React, { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, GripVertical, Save } from 'lucide-react';

const QUESTION_TYPES = [
  { value: 'stars', label: '⭐ Estrellas (1–5)' },
  { value: 'radio', label: '🔘 Opción múltiple' },
  { value: 'text', label: '📝 Texto corto' },
  { value: 'textarea', label: '📄 Texto largo' },
];

const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

const fieldStyle = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  color: '#0f172a',
};

export default function QuestionEditor({ config, onSave }) {
  const [questions, setQuestions] = useState(config.questions || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      id: genId(),
      type: 'text',
      label: '',
      placeholder: '',
      required: false,
      options: [],
    }]);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const deleteQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const moveQuestion = (index, dir) => {
    const next = [...questions];
    const swap = index + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    setQuestions(next);
  };

  const updateOption = (qId, optIdx, value) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== qId) return q;
      const opts = [...(q.options || [])];
      opts[optIdx] = value;
      return { ...q, options: opts };
    }));
  };

  const addOption = (qId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== qId) return q;
      return { ...q, options: [...(q.options || []), ''] };
    }));
  };

  const removeOption = (qId, optIdx) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== qId) return q;
      const opts = (q.options || []).filter((_, i) => i !== optIdx);
      return { ...q, options: opts };
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...config, questions });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fade-in max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-0.5">Preguntas de la encuesta</h3>
          <p className="text-sm text-slate-500">{questions.length} pregunta{questions.length !== 1 ? 's' : ''} configurada{questions.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={addQuestion} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
            <Plus size={14} />Agregar
          </button>
          <button onClick={handleSave} disabled={saving} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors ${saved ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800'}`}>
            {saving ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
            {saved ? 'Guardado' : 'Guardar'}
          </button>
        </div>
      </div>

      {questions.length === 0 && (
        <div className="text-center py-12 rounded-xl bg-slate-50 border border-dashed border-slate-300">
          <p className="text-sm text-slate-500">No hay preguntas. Agrega la primera para empezar.</p>
        </div>
      )}

      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={q.id} className="rounded-xl p-5 space-y-4 bg-white border border-slate-200 shadow-sm relative group transition-colors hover:border-slate-300">
            {/* Header / Meta */}
            <div className="flex items-center flex-wrap gap-3">
              <div className="flex items-center gap-1 text-slate-400">
                <GripVertical size={16} className="cursor-grab hover:text-slate-600" />
                <span className="text-xs font-bold text-slate-500 w-5">{i + 1}</span>
              </div>

              {/* Tipo */}
              <select
                value={q.type}
                onChange={e => updateQuestion(q.id, 'type', e.target.value)}
                className="text-sm py-1.5 px-3 rounded-lg outline-none flex-shrink-0 bg-slate-50 border border-slate-200 text-slate-900 cursor-pointer focus:border-slate-400 focus:bg-white transition-colors"
                style={{}}
              >
                {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>

              {/* Required toggle */}
              <label className="flex items-center gap-2 text-sm cursor-pointer ml-auto font-medium text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={e => updateQuestion(q.id, 'required', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer accent-slate-900"
                />
                Obligatoria
              </label>

              {/* Move/Delete buttons */}
              <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                <button onClick={() => moveQuestion(i, -1)} disabled={i === 0} className="p-1.5 rounded-md transition-colors hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent">
                  <ChevronUp size={16} className="text-slate-500" />
                </button>
                <button onClick={() => moveQuestion(i, 1)} disabled={i === questions.length - 1} className="p-1.5 rounded-md transition-colors hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent">
                  <ChevronDown size={16} className="text-slate-500" />
                </button>
                <button onClick={() => deleteQuestion(q.id)} className="p-1.5 rounded-md transition-colors hover:bg-red-50 ml-1">
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>

            {/* Label */}
            <input
              type="text"
              value={q.label}
              onChange={e => updateQuestion(q.id, 'label', e.target.value)}
              placeholder="Texto de la pregunta..."
              className="w-full px-4 py-3 rounded-lg text-sm text-slate-900 outline-none transition-colors border border-slate-200 bg-white placeholder-slate-400"
              onFocus={e => e.target.style.borderColor = '#0f172a'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />

            {/* Placeholder (for text/textarea) */}
            {(q.type === 'text' || q.type === 'textarea') && (
              <input
                type="text"
                value={q.placeholder || ''}
                onChange={e => updateQuestion(q.id, 'placeholder', e.target.value)}
                placeholder="Texto de ayuda (placeholder)..."
                className="w-full px-4 py-2.5 rounded-lg text-sm text-slate-700 outline-none transition-colors border border-slate-200 bg-slate-50 placeholder-slate-400"
                onFocus={e => { e.target.style.borderColor = '#0f172a'; e.target.style.backgroundColor = '#ffffff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; }}
              />
            )}

            {/* Options (for radio) */}
            {q.type === 'radio' && (
              <div className="space-y-3 pt-1 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-600">Opciones de respuesta:</p>
                <div className="grid gap-2">
                  {(q.options || []).map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2 group/opt">
                      <div className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
                      <input
                        type="text"
                        value={opt}
                        onChange={e => updateOption(q.id, oi, e.target.value)}
                        placeholder={`Opción ${oi + 1}`}
                        className="flex-grow px-3 py-2 rounded-lg text-sm outline-none transition-colors border border-slate-200 bg-white placeholder-slate-400 focus:border-slate-900"
                      />
                      <button onClick={() => removeOption(q.id, oi)} className="p-2 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors flex-shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => addOption(q.id)} className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg text-slate-600 bg-slate-50 border border-slate-200 hover:bg-white hover:border-slate-300 transition-colors">
                  <Plus size={14} />Agregar opción
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
