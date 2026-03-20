-- =====================================================
-- SETUP SQL PARA FIGMA SURVEY APP
-- Ejecuta esto en Supabase > SQL Editor
-- =====================================================

-- Tabla: configuración de la app (preguntas, nombre, URL Figma)
CREATE TABLE IF NOT EXISTS app_config (
  id          INT PRIMARY KEY DEFAULT 1,
  app_name    TEXT NOT NULL DEFAULT 'FinControl (BETA)',
  description TEXT NOT NULL DEFAULT 'Estamos evaluando el interés del mercado en esta solución. Navega por el prototipo interactivo (es un diseño conceptual, no funcional aún) y déjanos tu opinión.',
  show_description BOOLEAN NOT NULL DEFAULT true,
  figma_url   TEXT,
  questions   JSONB NOT NULL DEFAULT '[]',
  updated_at  TIMESTAMPTZ DEFAULT now(),
  -- Solo puede existir una fila (id = 1)
  CONSTRAINT single_row CHECK (id = 1)
);

-- Tabla: respuestas de los usuarios
CREATE TABLE IF NOT EXISTS responses (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answers             JSONB NOT NULL DEFAULT '{}',
  questions_snapshot  JSONB NOT NULL DEFAULT '[]',
  submitted_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice por fecha para ordenar rápido
CREATE INDEX IF NOT EXISTS responses_submitted_at_idx ON responses (submitted_at DESC);

-- =====================================================
-- POLÍTICAS DE ACCESO (RLS) — IMPORTANTE
-- =====================================================

-- Habilitar RLS en ambas tablas
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses  ENABLE ROW LEVEL SECURITY;

-- Política: CUALQUIERA puede leer la configuración
DROP POLICY IF EXISTS "read_config" ON app_config;
CREATE POLICY "read_config" ON app_config
  FOR SELECT USING (true);

-- Política: SOLO AUTENTICADOS pueden actualizar la configuración
DROP POLICY IF EXISTS "write_config" ON app_config;
CREATE POLICY "write_config" ON app_config
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "insert_config" ON app_config;
CREATE POLICY "insert_config" ON app_config
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política: CUALQUIERA puede insertar respuestas (usuarios de la encuesta)
DROP POLICY IF EXISTS "insert_responses" ON responses;
CREATE POLICY "insert_responses" ON responses
  FOR INSERT WITH CHECK (true);

-- Política: SOLO AUTENTICADOS pueden leer respuestas
DROP POLICY IF EXISTS "read_responses" ON responses;
CREATE POLICY "read_responses" ON responses
  FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- Insertar config inicial (si no existe)
-- =====================================================
INSERT INTO app_config (id, app_name, description, show_description, figma_url, questions)
VALUES (
  1,
  'FinControl (Prototipo)',
  'Estamos evaluando el interés del mercado antes de desarrollar la aplicación real. Navega por este diseño conceptual (sneak peek) y ayúdanos a entender si esta herramienta te sería útil.',
  true,
  'https://embed.figma.com/proto/xBE7yev4c83ZYAkoRJLKA0/FinControl?node-id=14-96&scaling=scale-down&content-scaling=fixed&page-id=1%3A3&starting-point-node-id=14%3A96&embed-host=share',
  '[
    {"id":"1","type":"radio","label":"Tras ver el concepto, ¿usarías esta aplicación en tu día a día?","options":["Definitivamente sí","Probablemente sí","No estoy seguro/a","Probablemente no","Definitivamente no"],"required":true},
    {"id":"2","type":"text","label":"¿Qué problema principal esperas que te resuelva esta app?","placeholder":"Ej. Organizar mejor mis gastos diarios...","required":true},
    {"id":"3","type":"radio","label":"¿Cuánto estarías dispuesto/a a pagar mensualmente por ella si ya estuviera terminada?","options":["$0 (Solo versión gratuita)","Menos de $50 MXN","$50 - $100 MXN","Más de $100 MXN"],"required":true},
    {"id":"4","type":"stars","label":"Generalmente, ¿qué calificación le das al concepto visual (diseño)?","required":true},
    {"id":"5","type":"textarea","label":"¿Algún comentario o sugerencia clave antes de que la construyamos?","placeholder":"Ej. Creo que le hace falta una vista de calendario...","required":false}
  ]'
)
ON CONFLICT (id) DO UPDATE SET 
  description = EXCLUDED.description,
  show_description = EXCLUDED.show_description,
  questions = EXCLUDED.questions;
