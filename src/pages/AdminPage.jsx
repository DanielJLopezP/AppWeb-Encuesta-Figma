import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import LoginForm from '../components/admin/LoginForm';
import AppSettings from '../components/admin/AppSettings';
import QuestionEditor from '../components/admin/QuestionEditor';
import ResponsesTable from '../components/admin/ResponsesTable';
import { Settings, List, BarChart2, LogOut, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TABS = [
  { id: 'settings', label: 'Configuración', icon: Settings },
  { id: 'questions', label: 'Preguntas', icon: List },
  { id: 'responses', label: 'Respuestas', icon: BarChart2 },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('settings');
  const { config, saveConfig, session, logout } = useAppStore();

  if (!session) return <LoginForm />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-slate-200 px-5 py-3 flex items-center justify-between bg-white shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <span className="text-white font-bold text-xs">
              {(config?.app_name || 'A').charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-none">Panel Administrativo</h1>
            <p className="text-xs mt-0.5 text-slate-500">{config?.app_name || 'Survey App'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors font-medium"
          >
            <ArrowLeft size={12} />Ver sitio
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-red-600 transition-colors font-medium"
          >
            <LogOut size={12} />Salir
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
        {/* Sidebar Tabs (desktop) / Top Tabs (mobile) */}
        <nav className="flex flex-row md:flex-col gap-1 p-4 md:w-56 flex-shrink-0 bg-white border-b md:border-b-0 md:border-r border-slate-200">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left w-full ${
                  active 
                    ? 'bg-slate-100 text-slate-900' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <Icon size={16} className={active ? 'text-slate-900' : 'text-slate-400'} />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {activeTab === 'settings' && (
              <AppSettings config={config} onSave={saveConfig} />
            )}
            {activeTab === 'questions' && (
              <QuestionEditor config={config} onSave={saveConfig} />
            )}
            {activeTab === 'responses' && (
              <ResponsesTable />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
