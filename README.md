# 🥗 Coachito.IA

**Coachito.IA** es una aplicación web moderna para evaluar tu consumo de macronutrientes diarios. Utiliza Inteligencia Artificial para generar análisis nutricionales personalizados basados en tus datos personales y comidas del día.

🌐 **Sitio en vivo**: [https://tipicoyucateco.github.io/nutritioncoach](https://tipicoyucateco.github.io/nutritioncoach)

## ✨ Características

- 📊 **Análisis Nutricional con IA** - Análisis detallado de macronutrientes usando Groq AI (Llama 3.3)
- 💾 **Persistencia en Base de Datos** - Guarda todos los análisis en Supabase
- 📈 **Contador Global** - Contador incremental de análisis completados en toda la plataforma
- 📄 **Exportación a PDF** - Genera PDFs profesionales de tus análisis
- 📱 **Diseño Responsive** - Optimizado para móviles, tablets y desktop
- ♿ **Accesible** - Componentes accesibles con soporte ARIA completo

## Project info

**URL**: https://lovable.dev/projects/ee3a6fbf-c4b5-4b56-b552-fda0a6cd1d0c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ee3a6fbf-c4b5-4b56-b552-fda0a6cd1d0c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🛠️ Tecnologías Utilizadas

Este proyecto utiliza un stack moderno y robusto. Para una descripción completa y detallada, consulta el documento **[TECNOLOGIAS-IMPLEMENTADAS.md](./TECNOLOGIAS-IMPLEMENTADAS.md)**.

### Stack Principal

- **React 18.3** - Framework de UI moderno y reactivo
- **TypeScript 5.8** - Tipado estático para mayor seguridad
- **Vite 5.4** - Build tool ultrarrápido con HMR
- **Tailwind CSS 3.4** - Framework CSS utility-first
- **React Router 6.3** - Enrutamiento para SPA

### UI y Componentes

- **Radix UI** - Sistema completo de componentes accesibles (30+ componentes)
- **shadcn/ui** - Componentes de UI construidos sobre Radix UI
- **Lucide React** - Librería de iconos moderna
- **Sonner** - Sistema de notificaciones toast

### Backend y Servicios

- **Supabase** - Backend-as-a-Service con PostgreSQL para persistencia de datos
- **Groq API** - Servicio de IA para análisis nutricional (Llama 3.3 70B)

### Herramientas Adicionales

- **jsPDF** - Generación de PDFs en el cliente
- **React Query** - Gestión de estado del servidor y caché
- **React Hook Form + Zod** - Validación de formularios
- **Recharts** - Visualización de datos con gráficos

### Despliegue

- **GitHub Pages** - Hosting estático
- **GitHub Actions** - CI/CD automatizado

📖 **Ver documentación completa**: [TECNOLOGIAS-IMPLEMENTADAS.md](./TECNOLOGIAS-IMPLEMENTADAS.md)

## 🚀 Despliegue

### Desarrollo Local

```sh
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Configuración Requerida

Antes de ejecutar el proyecto, necesitas configurar las variables de entorno:

1. Crea un archivo `.env` en la raíz del proyecto
2. Agrega las siguientes variables:
   ```env
   VITE_GROQ_API_KEY=tu-api-key-de-groq
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   ```

📖 **Guía completa**: [GUIA-VARIABLES-ENTORNO.md](./GUIA-VARIABLES-ENTORNO.md)

### Producción

El proyecto se despliega automáticamente a GitHub Pages mediante GitHub Actions cuando se hace push a la rama `main`.

**Configuración de Secrets en GitHub**:
- `VITE_GROQ_API_KEY` - API key de Groq
- `VITE_SUPABASE_URL` - URL de tu proyecto Supabase
- `VITE_SUPABASE_ANON_KEY` - Anon key de Supabase

📖 **Guía de configuración**: [CONFIGURAR-SUPABASE.md](./CONFIGURAR-SUPABASE.md)

## 📚 Documentación Adicional

- **[TECNOLOGIAS-IMPLEMENTADAS.md](./TECNOLOGIAS-IMPLEMENTADAS.md)** - Descripción completa de todas las tecnologías
- **[CONFIGURAR-SUPABASE.md](./CONFIGURAR-SUPABASE.md)** - Guía para configurar Supabase
- **[GUIA-VARIABLES-ENTORNO.md](./GUIA-VARIABLES-ENTORNO.md)** - Configuración de variables de entorno
- **[supabase-schema.sql](./supabase-schema.sql)** - Esquema SQL para la base de datos

## 🤝 Contribuir

¿Tienes una idea o comentario? Mándame un DM en [Instagram](https://www.instagram.com/tipicoyucateco/) y cuéntamelo. Tu opinión me sirve un montón.

## 📄 Licencia

Este proyecto es privado.

---

**Desarrollado con ❤️ usando React, TypeScript y IA**
