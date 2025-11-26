import { createClient } from '@supabase/supabase-js';

// Obtener las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL o Anon Key no están configuradas. Las funciones de base de datos no estarán disponibles.');
}

// Crear el cliente de Supabase
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Tipos para los análisis nutricionales
export interface NutritionAnalysis {
  id?: string;
  name?: string;
  gender: string;
  age: string;
  weight: string;
  height: string;
  goal: string;
  activity_level: string;
  meals: {
    breakfast: Array<{
      id: string;
      quantity: string;
      unit: 'gramos' | 'mililitros' | 'piezas';
      name: string;
    }>;
    lunch: Array<{
      id: string;
      quantity: string;
      unit: 'gramos' | 'mililitros' | 'piezas';
      name: string;
    }>;
    dinner: Array<{
      id: string;
      quantity: string;
      unit: 'gramos' | 'mililitros' | 'piezas';
      name: string;
    }>;
    snacks: Array<{
      id: string;
      quantity: string;
      unit: 'gramos' | 'mililitros' | 'piezas';
      name: string;
    }>;
  };
  analysis_result: string;
  created_at?: string;
  updated_at?: string;
}

// Función para guardar un análisis en Supabase
export async function saveAnalysis(analysis: Omit<NutritionAnalysis, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
  if (!supabase) {
    console.warn('Supabase no está configurado. No se puede guardar el análisis.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('nutrition_analyses')
      .insert({
        name: analysis.name || null,
        gender: analysis.gender,
        age: analysis.age,
        weight: analysis.weight,
        height: analysis.height,
        goal: analysis.goal,
        activity_level: analysis.activity_level,
        meals: analysis.meals,
        analysis_result: analysis.analysis_result,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error al guardar análisis en Supabase:', error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error('Error inesperado al guardar análisis:', error);
    return null;
  }
}

// Función para actualizar un análisis existente
export async function updateAnalysis(
  id: string,
  updates: Partial<Omit<NutritionAnalysis, 'id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase no está configurado. No se puede actualizar el análisis.');
    return false;
  }

  try {
    const { error } = await supabase
      .from('nutrition_analyses')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error al actualizar análisis en Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error inesperado al actualizar análisis:', error);
    return false;
  }
}

// Función para obtener todos los análisis (opcional, para futuras funcionalidades)
export async function getAllAnalyses(): Promise<NutritionAnalysis[]> {
  if (!supabase) {
    console.warn('Supabase no está configurado. No se pueden obtener los análisis.');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('nutrition_analyses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener análisis de Supabase:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error inesperado al obtener análisis:', error);
    return [];
  }
}

// Función para obtener el conteo total de análisis
export async function getAnalysisCount(): Promise<number> {
  if (!supabase) {
    console.warn('Supabase no está configurado. No se puede obtener el conteo.');
    return 0;
  }

  try {
    const { count, error } = await supabase
      .from('nutrition_analyses')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error al obtener conteo de análisis:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error inesperado al obtener conteo:', error);
    return 0;
  }
}

