# Configuración de Secrets en GitHub

Para que la aplicación funcione correctamente en GitHub Pages, necesitas configurar el secret `VITE_GROQ_API_KEY`.

## Pasos para configurar el secret:

1. Ve a tu repositorio en GitHub: `https://github.com/tipicoyucateco/nutritioncoach`

2. Haz clic en **Settings** (Configuración)

3. En el menú lateral, haz clic en **Secrets and variables** → **Actions**

4. Haz clic en **New repository secret** (Nuevo secreto del repositorio)

5. Configura el secret:
   - **Name**: `VITE_GROQ_API_KEY`
   - **Secret**: Pega tu API key de Groq (la que tienes en tu archivo `.env` local)
   - Haz clic en **Add secret**

6. Una vez configurado, el workflow de GitHub Actions usará automáticamente este secret durante el build.

## Nota importante:

- El secret solo se usa durante el build en GitHub Actions
- No se expone en el código fuente ni en el sitio desplegado
- Cada vez que hagas push a `main`, el workflow se ejecutará automáticamente y desplegará con la API key configurada

