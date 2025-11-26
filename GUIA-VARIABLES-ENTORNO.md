# 🔧 Guía Paso a Paso: Configurar Variables de Entorno

Esta guía te ayudará a configurar las variables de entorno tanto para **desarrollo local** como para **producción (GitHub Pages)**.

---

## 📋 PARTE 1: Configuración para Desarrollo Local

### Paso 1: Obtener las credenciales de Supabase

1. **Ve a Supabase**: https://supabase.com
2. **Inicia sesión** o crea una cuenta si no tienes una
3. **Crea un nuevo proyecto** (si aún no lo has hecho):
   - Haz clic en "New Project"
   - Elige un nombre para tu proyecto
   - Crea una contraseña para la base de datos
   - Selecciona una región cercana a ti
   - Espera a que se cree el proyecto (tarda unos minutos)

4. **Obtén tus credenciales**:
   - Una vez creado el proyecto, ve a **Settings** (⚙️) en el menú lateral
   - Haz clic en **API**
   - Encontrarás dos valores importantes:
     - **Project URL**: Algo como `https://xxxxxxxxxxxxx.supabase.co`
     - **anon public key**: Una clave larga que empieza con `eyJ...`

### Paso 2: Crear el archivo .env local

1. **Abre el archivo `.env`** en la raíz del proyecto (ya está creado, solo necesitas completarlo)

2. **Completa los valores**:

```env
# API Key de Groq (si ya la tienes configurada, déjala igual)
VITE_GROQ_API_KEY=tu-api-key-de-groq-aqui

# Configuración de Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

**Ejemplo real** (reemplaza con tus valores):
```env
VITE_GROQ_API_KEY=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
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI4MCwiZXhwIjoxOTU0NTQzMjgwfQ.ejemplo...
```

### Paso 3: Verificar que funciona

1. **Reinicia el servidor de desarrollo** (si está corriendo):
   - Detén el servidor (Ctrl+C)
   - Ejecuta: `npm run dev`

2. **Prueba la aplicación**:
   - Completa un análisis nutricional
   - Si todo está bien, el análisis se guardará en Supabase
   - Puedes verificar en el dashboard de Supabase → Table Editor → `nutrition_analyses`

---

## 🚀 PARTE 2: Configuración para Producción (GitHub Pages)

### Paso 1: Ir a la configuración de Secrets en GitHub

1. **Abre tu repositorio en GitHub**: https://github.com/tipicoyucateco/nutritioncoach

2. **Ve a Settings**:
   - Haz clic en la pestaña **Settings** (arriba del repositorio)
   - En el menú lateral izquierdo, busca **Secrets and variables**
   - Haz clic en **Actions**

### Paso 2: Agregar el Secret de Supabase URL

1. **Haz clic en "New repository secret"** (botón verde)

2. **Configura el primer secret**:
   - **Name**: `VITE_SUPABASE_URL` (exactamente así, con mayúsculas)
   - **Secret**: Pega tu Project URL de Supabase (ejemplo: `https://abcdefghijklmnop.supabase.co`)
   - Haz clic en **Add secret**

### Paso 3: Agregar el Secret de Supabase Anon Key

1. **Haz clic nuevamente en "New repository secret"**

2. **Configura el segundo secret**:
   - **Name**: `VITE_SUPABASE_ANON_KEY` (exactamente así, con mayúsculas)
   - **Secret**: Pega tu anon public key de Supabase (la clave larga que empieza con `eyJ...`)
   - Haz clic en **Add secret**

### Paso 4: Verificar que los secrets están configurados

Deberías ver en la lista de secrets:
- ✅ `VITE_GROQ_API_KEY` (ya debería estar)
- ✅ `VITE_SUPABASE_URL` (recién agregado)
- ✅ `VITE_SUPABASE_ANON_KEY` (recién agregado)

### Paso 5: Desplegar con los nuevos secrets

1. **Opción A: Ejecutar el workflow manualmente** (recomendado):
   - Ve a la pestaña **Actions** en GitHub
   - Selecciona el workflow "Deploy to GitHub Pages"
   - Haz clic en **Run workflow** → **Run workflow** (botón verde)

2. **Opción B: Hacer un push**:
   - Haz cualquier cambio pequeño (o un commit vacío)
   - Haz push a la rama `main`
   - El workflow se ejecutará automáticamente

### Paso 6: Verificar que funciona en producción

1. **Espera a que termine el deployment** (puedes verlo en la pestaña Actions)

2. **Visita tu sitio**: https://tipicoyucateco.github.io/nutritioncoach

3. **Prueba hacer un análisis**:
   - Completa un análisis nutricional
   - Si todo está bien, debería guardarse en Supabase
   - Verifica en el dashboard de Supabase que se creó el registro

---

## ✅ Checklist de Verificación

### Desarrollo Local:
- [ ] Archivo `.env` creado en la raíz del proyecto
- [ ] `VITE_SUPABASE_URL` configurado con tu Project URL
- [ ] `VITE_SUPABASE_ANON_KEY` configurado con tu anon key
- [ ] Servidor de desarrollo reiniciado
- [ ] Análisis de prueba guardado correctamente en Supabase

### Producción (GitHub Pages):
- [ ] Secret `VITE_SUPABASE_URL` agregado en GitHub
- [ ] Secret `VITE_SUPABASE_ANON_KEY` agregado en GitHub
- [ ] Workflow ejecutado y completado exitosamente
- [ ] Sitio desplegado funciona correctamente
- [ ] Análisis de prueba guardado en Supabase desde producción

---

## 🆘 Solución de Problemas

### Error: "Supabase URL o Anon Key no están configuradas"
- **Causa**: Las variables de entorno no están configuradas
- **Solución**: Verifica que el archivo `.env` existe y tiene los valores correctos

### Error: "Error al guardar análisis en Supabase"
- **Causa**: La tabla no existe o las credenciales son incorrectas
- **Solución**: 
  1. Verifica que ejecutaste el SQL en Supabase (archivo `supabase-schema.sql`)
  2. Verifica que las credenciales en `.env` son correctas
  3. Revisa la consola del navegador para más detalles

### El contador no se actualiza
- **Causa**: Supabase no está configurado o hay un error de conexión
- **Solución**: La app usará localStorage como respaldo. Verifica la configuración de Supabase.

---

## 📝 Notas Importantes

- ⚠️ **NUNCA** subas el archivo `.env` a Git (ya está en `.gitignore`)
- ✅ El archivo `.env.example` es solo una plantilla y SÍ se sube a Git
- 🔒 Los secrets en GitHub están encriptados y solo se usan durante el build
- 🔄 Cada vez que cambies un secret, necesitas ejecutar el workflow nuevamente

---

¿Necesitas ayuda con algún paso específico? Revisa los archivos:
- `CONFIGURAR-SUPABASE.md` - Para configurar la base de datos
- `supabase-schema.sql` - Para crear la tabla en Supabase

