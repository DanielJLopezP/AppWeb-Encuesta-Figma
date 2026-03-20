import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAppStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { success, error: authErr } = await login(email, pass);
      
      if (success) {
        if (onLogin) onLogin();
      } else {
        setError(authErr || 'Correo o contraseña incorrectos.');
      }
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error inesperado al intentar iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-sm animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <ShieldCheck size={26} className="text-slate-700" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Acceso Administrativo</h1>
          <p className="text-sm text-slate-500">Por favor, ingresa tus credenciales</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Ej. admin@tuempresa.com"
                required
                autoComplete="username"
                className="w-full px-4 py-3 rounded-lg text-sm text-slate-900 bg-white border border-slate-200 placeholder-slate-400 outline-none transition-colors"
                onFocus={e => e.target.style.borderColor = '#0f172a'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 rounded-lg text-sm text-slate-900 bg-white border border-slate-200 placeholder-slate-400 outline-none transition-colors"
                  onFocus={e => e.target.style.borderColor = '#0f172a'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm text-white transition-colors"
              style={{ background: loading ? '#334155' : '#0f172a' }}
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-slate-300 border-t-white rounded-full animate-spin" />Verificando...</>
              ) : (
                <><Lock size={14} />Ingresar</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
