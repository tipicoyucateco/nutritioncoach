-- Schema SQL para crear la tabla de análisis nutricionales en Supabase
-- Ejecuta este SQL en el SQL Editor de tu proyecto de Supabase

-- Crear la tabla de análisis nutricionales
CREATE TABLE IF NOT EXISTS nutrition_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  gender TEXT NOT NULL,
  age TEXT NOT NULL,
  weight TEXT NOT NULL,
  height TEXT NOT NULL,
  goal TEXT NOT NULL,
  activity_level TEXT NOT NULL,
  meals JSONB NOT NULL,
  analysis_result TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_nutrition_analyses_created_at ON nutrition_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nutrition_analyses_goal ON nutrition_analyses(goal);

-- Habilitar Row Level Security (RLS) - Opcional: descomenta si quieres restringir el acceso
-- ALTER TABLE nutrition_analyses ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción pública (ajusta según tus necesidades de seguridad)
-- CREATE POLICY "Permitir inserción pública" ON nutrition_analyses
--   FOR INSERT
--   TO anon, authenticated
--   WITH CHECK (true);

-- Política para permitir lectura pública (ajusta según tus necesidades de seguridad)
-- CREATE POLICY "Permitir lectura pública" ON nutrition_analyses
--   FOR SELECT
--   TO anon, authenticated
--   USING (true);

-- Política para permitir actualización pública (ajusta según tus necesidades de seguridad)
-- CREATE POLICY "Permitir actualización pública" ON nutrition_analyses
--   FOR UPDATE
--   TO anon, authenticated
--   USING (true)
--   WITH CHECK (true);

-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_nutrition_analyses_updated_at
  BEFORE UPDATE ON nutrition_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

