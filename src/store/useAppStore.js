import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULT_CONFIG = {
  app_name: 'FinControl',
  description: 'Estamos evaluando el interés del mercado antes de desarrollar la aplicación real. Navega por este diseño conceptual (sneak peek) y ayúdanos a entender si esta herramienta te sería útil.',
  show_description: true,
  figma_url: 'https://embed.figma.com/proto/xBE7yev4c83ZYAkoRJLKA0/FinControl?node-id=14-96&scaling=scale-down&content-scaling=fixed&page-id=1%3A3&starting-point-node-id=14%3A96&embed-host=share',
  questions: [
    { id: '1', type: 'stars', label: '¿Qué calificación general le darías a la app?', required: true },
    { id: '2', type: 'radio', label: '¿Qué tan fácil fue usar la aplicación?', options: ['Difícil', 'Regular', 'Fácil'], required: true },
    { id: '3', type: 'text', label: '¿Te gustó el diseño?', placeholder: 'Ej. Sí, me parecieron bonitos los colores...', required: false },
    { id: '4', type: 'textarea', label: '¿Qué mejorarías?', placeholder: 'Ej. Me gustaría que el botón de inicio fuera más grande...', required: false },
  ]
};

let configCache = null;

export function useAppStore() {
  const [config, setConfig] = useState(configCache || DEFAULT_CONFIG);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(!configCache);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  // Cargar configuración desde Supabase
  const fetchConfig = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('app_config')
        .select('*')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const loaded = {
          app_name: data.app_name || DEFAULT_CONFIG.app_name,
          description: data.description || DEFAULT_CONFIG.description,
          show_description: data.show_description !== undefined ? data.show_description : DEFAULT_CONFIG.show_description,
          figma_url: data.figma_url || DEFAULT_CONFIG.figma_url,
          questions: data.questions || DEFAULT_CONFIG.questions,
        };
        configCache = loaded;
        setConfig(loaded);
      }
    } catch (err) {
      console.error('Error cargando config:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();

    // Comprobar la sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Escuchar cambios de auth (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [fetchConfig]);

  // Guardar configuración
  const saveConfig = async (newConfig) => {
    try {
      const payload = { id: 1, ...newConfig, updated_at: new Date().toISOString() };
      const { error } = await supabase.from('app_config').upsert(payload);
      if (error) throw error;
      configCache = newConfig;
      setConfig(newConfig);
      return { success: true };
    } catch (err) {
      console.error('Error guardando config:', err);
      return { success: false, error: err.message };
    }
  };

  // Enviar respuesta
  const submitResponse = async (answers) => {
    try {
      const payload = {
        answers,
        submitted_at: new Date().toISOString(),
        questions_snapshot: config.questions,
      };
      const { error } = await supabase.from('responses').insert([payload]);
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error enviando respuesta:', err);
      return { success: false, error: err.message };
    }
  };

  // Cargar respuestas (solo admin)
  const fetchResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      setResponses(data || []);
      return data || [];
    } catch (err) {
      console.error('Error cargando respuestas:', err);
      // Evitar bloquear si hay error por no estar logueado, pero limpiar array
      setResponses([]);
      return [];
    }
  };

  // Auth Methods
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { success: true, user: data.user };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return { 
    config, loading, error, saveConfig, submitResponse, fetchResponses, responses,
    session, login, logout 
  };
}
