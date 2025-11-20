# ⚠️ CONFIGURACIÓN REQUERIDA: Secret de GitHub

## Problema actual
El sitio está desplegado pero sin la API key de Groq configurada, por eso muestra el error.

## Solución: Configurar el Secret

### Paso 1: Ve a la configuración de Secrets
1. Abre: https://github.com/tipicoyucateco/nutritioncoach/settings/secrets/actions
2. O ve a: Settings → Secrets and variables → Actions

### Paso 2: Crear el Secret
1. Haz clic en **"New repository secret"**
2. **Name**: `VITE_GROQ_API_KEY` (exactamente así, con mayúsculas)
3. **Secret**: `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`
4. Haz clic en **"Add secret"**

### Paso 3: Ejecutar el Workflow
Una vez configurado el secret, tienes dos opciones:

**Opción A: Ejecutar manualmente (recomendado)**
1. Ve a: https://github.com/tipicoyucateco/nutritioncoach/actions
2. Selecciona el workflow "Deploy to GitHub Pages"
3. Haz clic en **"Run workflow"** → **"Run workflow"** (botón verde)

**Opción B: Hacer un push (automático)**
- Haz cualquier cambio pequeño y haz push, el workflow se ejecutará automáticamente

## Verificación
Una vez que el workflow termine (puedes verlo en la pestaña "Actions"), el sitio se actualizará automáticamente con la API key configurada.

## Nota importante
El deploy que hicimos con `npm run deploy` (gh-pages) no usa el secret. Solo el workflow de GitHub Actions lo usa. Por eso necesitas ejecutar el workflow después de configurar el secret.

