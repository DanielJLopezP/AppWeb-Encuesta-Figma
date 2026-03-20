import React, { useEffect, useState } from 'react';
import { Download, RefreshCw, Users, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAppStore } from '../../store/useAppStore';

export default function ResponsesTable() {
  const { fetchResponses, responses } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await fetchResponses();
    setLoading(false);
  };

  const exportToExcel = () => {
    if (responses.length === 0) return;

    // Build flat rows
    const rows = responses.map((r, idx) => {
      const base = {
        '#': idx + 1,
        'Fecha': new Date(r.submitted_at).toLocaleString('es-MX'),
        'Nombre': r.answers?.respondent || 'Anónimo',
      };

      const snap = r.questions_snapshot || [];
      const answers = r.answers?.answers || {};

      snap.forEach(q => {
        const val = answers[q.id];
        base[q.label] = Array.isArray(val) ? val.join(', ') : (val ?? '');
      });

      return base;
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Respuestas');

    // Auto column widths
    const maxLen = rows.reduce((acc, row) => {
      Object.keys(row).forEach((k, i) => {
        acc[i] = Math.max(acc[i] || 10, String(row[k]).length + 2);
      });
      return acc;
    }, {});
    ws['!cols'] = Object.values(maxLen).map(w => ({ wch: Math.min(w, 50) }));

    XLSX.writeFile(wb, `respuestas_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-0.5">Respuestas recibidas</h3>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
              <Users size={14} />{responses.length} respuesta{responses.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={loadData} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
            <RefreshCw size={14} />Actualizar
          </button>
          <button
            onClick={exportToExcel}
            disabled={responses.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Download size={14} />Exportar Excel
          </button>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-16 rounded-xl bg-slate-50 border border-dashed border-slate-300">
          <Users size={32} className="mx-auto mb-3 text-slate-400" />
          <p className="text-sm font-medium text-slate-600">Aún no hay respuestas</p>
          <p className="text-xs mt-1 text-slate-500">Cuando tus compañeros completen la encuesta aparecerán aquí.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scroll">
          {responses.map((r, idx) => {
            const snap = r.questions_snapshot || [];
            const answers = r.answers?.answers || {};
            const respondent = r.answers?.respondent || 'Anónimo';
            const date = new Date(r.submitted_at).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });

            return (
              <div key={r.id || idx} className="rounded-xl p-5 bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
                {/* Card header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shadow-sm">
                      <span className="text-xs font-bold text-white">{respondent.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{respondent}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                    <Calendar size={12} />{date}
                  </div>
                </div>

                {/* Answers */}
                <div className="space-y-3">
                  {snap.map(q => {
                    const val = answers[q.id];
                    const display = typeof val === 'number'
                      ? '★'.repeat(val) + '☆'.repeat(5 - val)
                      : (val || '—');
                    return (
                      <div key={q.id} className="flex flex-col gap-1 sm:flex-row sm:gap-4 sm:items-baseline">
                        <span className="text-xs font-medium text-slate-500 sm:w-1/3 sm:flex-shrink-0 pt-0.5">{q.label}</span>
                        <span className="text-sm font-medium text-slate-900 break-words">{display}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
