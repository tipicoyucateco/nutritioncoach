# 📊 CONFIGURACIÓN DE SUPABASE

Esta aplicación ahora guarda los análisis nutricionales completados en una base de datos de Supabase.

## Pasos para configurar Supabase

### Paso 1: Crear un proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta (si no tienes una)
2. Crea un nuevo proyecto
3. Anota la **URL del proyecto** y la **Anon Key** (las encontrarás en Settings → API)

### Paso 2: Crear la tabla en Supabase

1. Ve al **SQL Editor** en tu proyecto de Supabase
2. Copia y pega el contenido del archivo `supabase-schema.sql` que está en la raíz del proyecto
3. Ejecuta el SQL para crear la tabla `nutrition_analyses`

### Paso 3: Configurar las variables de entorno

#### Para desarrollo local:

1. Crea un archivo `.env` en la raíz del proyecto (si no existe)
2. Agrega las siguientes variables:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

#### Para producción (GitHub Pages):

1. Ve a: https://github.com/tipicoyucateco/nutritioncoach/settings/secrets/actions
2. O ve a: Settings → Secrets and variables → Actions
3. Crea dos nuevos secrets:
   - **Name**: `VITE_SUPABASE_URL`
     **Secret**: `https://tu-proyecto.supabase.co`
   - **Name**: `VITE_SUPABASE_ANON_KEY`
     **Secret**: `tu-anon-key-aqui`

### Paso 4: Configurar Row Level Security (RLS) - Opcional

Por defecto, el SQL incluye las políticas comentadas. Si quieres restringir el acceso:

1. Ve al SQL Editor en Supabase
2. Descomenta las políticas de RLS en el archivo `supabase-schema.sql`
3. Ajusta las políticas según tus necesidades de seguridad

## Funcionalidades implementadas

✅ **Guardar análisis**: Cada vez que se completa un análisis, se guarda automáticamente en Supabase
✅ **Actualizar análisis**: Se puede actualizar un análisis existente (preparado para futuras funcionalidades)
✅ **Contador global**: El contador de análisis completados se sincroniza con Supabase
✅ **Fallback a localStorage**: Si Supabase no está configurado, la app sigue funcionando con localStorage

## Estructura de datos

Cada análisis guardado incluye:
- Datos personales (nombre, género, edad, peso, altura, objetivo, nivel de actividad)
- Comidas del día (desayuno, almuerzo, cena, snacks)
- Resultado del análisis generado por IA
- Fechas de creación y actualización

## Notas importantes

- Si no configuras Supabase, la aplicación seguirá funcionando normalmente usando localStorage como respaldo
- Los datos se guardan automáticamente después de cada análisis exitoso
- El contador de análisis se sincroniza con Supabase al cargar la página

