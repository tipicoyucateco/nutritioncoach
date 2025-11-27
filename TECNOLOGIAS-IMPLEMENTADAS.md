# 🚀 Tecnologías Implementadas en Coachito.IA

Este documento describe todas las tecnologías, frameworks, librerías y servicios utilizados en el proyecto **Coachito.IA** - Una aplicación web para evaluar el consumo de macronutrientes diarios con análisis nutricional basado en Inteligencia Artificial.

---

## 📦 Stack Principal

### **Frontend Framework**
- **React 18.3.1** - Biblioteca de JavaScript para construir interfaces de usuario modernas y reactivas
- **React DOM 18.3.1** - Renderizado de componentes React en el navegador
- **TypeScript 5.8.3** - Superset de JavaScript que añade tipado estático para mayor seguridad y productividad

### **Build Tool & Bundler**
- **Vite 5.4.19** - Herramienta de construcción ultrarrápida con Hot Module Replacement (HMR)
- **@vitejs/plugin-react-swc 3.11.0** - Plugin de React optimizado con SWC para compilación más rápida

### **Routing**
- **React Router DOM 6.30.1** - Librería de enrutamiento para aplicaciones React de una sola página (SPA)

---

## 🎨 Sistema de Diseño y UI

### **Framework CSS**
- **Tailwind CSS 3.4.17** - Framework CSS utility-first para diseño rápido y consistente
- **tailwindcss-animate 1.0.7** - Extensiones de animaciones para Tailwind CSS
- **@tailwindcss/typography 0.5.16** - Plugin de tipografía para contenido enriquecido
- **Autoprefixer 10.4.21** - Procesador CSS que añade prefijos de navegadores automáticamente
- **PostCSS 8.5.6** - Herramienta para transformar CSS con plugins

### **Componentes UI (Radix UI)**
Sistema completo de componentes accesibles y personalizables basado en **Radix UI**:
- **@radix-ui/react-accordion** - Componentes de acordeón
- **@radix-ui/react-alert-dialog** - Diálogos de alerta
- **@radix-ui/react-dialog** - Sistema de diálogos modales
- **@radix-ui/react-dropdown-menu** - Menús desplegables
- **@radix-ui/react-select** - Componentes de selección
- **@radix-ui/react-toast** - Sistema de notificaciones toast
- **@radix-ui/react-tooltip** - Tooltips informativos
- Y más de 20 componentes adicionales para una UI completa

### **Utilidades de Estilo**
- **clsx 2.1.1** - Utilidad para construir strings de className condicionalmente
- **tailwind-merge 2.6.0** - Función para fusionar clases de Tailwind CSS
- **class-variance-authority 0.7.1** - Sistema de variantes para componentes

### **Iconos**
- **Lucide React 0.462.0** - Librería de iconos moderna y ligera con más de 1,000 iconos

---

## 🤖 Inteligencia Artificial y Procesamiento

### **API de IA**
- **Groq API** - Servicio de IA para análisis nutricional
  - Modelo utilizado: **Llama 3.3 70B Versatile**
  - Integración mediante API REST para generar análisis nutricionales personalizados

### **Procesamiento de Datos**
- **Zod 3.25.76** - Librería de validación de esquemas TypeScript-first
- **React Hook Form 7.61.1** - Librería para manejo eficiente de formularios
- **@hookform/resolvers 3.10.0** - Resolvers para validación con React Hook Form

---

## 💾 Base de Datos y Persistencia

### **Base de Datos en la Nube**
- **Supabase 2.84.0** - Backend-as-a-Service (BaaS) con PostgreSQL
  - Almacenamiento de análisis nutricionales completados
  - Contador global de ejecuciones exitosas
  - Sincronización en tiempo real
  - Row Level Security (RLS) para seguridad de datos

### **Almacenamiento Local**
- **localStorage** - Almacenamiento local del navegador como respaldo cuando Supabase no está disponible

---

## 📊 Visualización y Exportación

### **Gráficos y Visualización**
- **Recharts 2.15.4** - Librería de gráficos para React basada en D3.js

### **Exportación de Documentos**
- **jsPDF 3.0.4** - Generación de archivos PDF en el cliente
- **html2canvas 1.4.1** - Captura de elementos HTML como imágenes para exportación

---

## 🔄 Gestión de Estado y Datos

### **State Management**
- **React Hooks** - useState, useEffect para gestión de estado local
- **@tanstack/react-query 5.83.0** - Librería para gestión de estado del servidor, caché y sincronización

### **Fechas y Tiempo**
- **date-fns 3.6.0** - Librería moderna de utilidades para manipulación de fechas

---

## 🎯 Componentes Especializados

### **Formularios Avanzados**
- **react-day-picker 8.10.1** - Selector de fechas accesible
- **input-otp 1.4.2** - Componente para códigos OTP

### **UI Avanzada**
- **cmdk 1.1.1** - Componente de línea de comandos estilo VS Code
- **embla-carousel-react 8.6.0** - Carousel/carrusel suave y accesible
- **react-resizable-panels 2.1.9** - Paneles redimensionables
- **vaul 0.9.9** - Componente drawer/sheet animado
- **next-themes 0.3.0** - Soporte para temas claro/oscuro

---

## 🔔 Notificaciones y Feedback

### **Sistema de Notificaciones**
- **Sonner 1.7.4** - Sistema de notificaciones toast moderno y elegante
- Integrado con Radix UI Toast para máxima accesibilidad

---

## 🛠️ Herramientas de Desarrollo

### **Linting y Formateo**
- **ESLint 9.32.0** - Linter de JavaScript/TypeScript
- **@eslint/js 9.32.0** - Configuración base de ESLint
- **eslint-plugin-react-hooks 5.2.0** - Reglas de ESLint para React Hooks
- **eslint-plugin-react-refresh 0.4.20** - Plugin para React Fast Refresh
- **typescript-eslint 8.38.0** - Linter de TypeScript para ESLint

### **Utilidades de Desarrollo**
- **lovable-tagger 1.1.11** - Herramienta de desarrollo para etiquetado de componentes

---

## 🚀 Despliegue y CI/CD

### **Plataforma de Hosting**
- **GitHub Pages** - Hosting estático gratuito para el sitio web

### **Automatización**
- **GitHub Actions** - CI/CD para despliegue automático
  - Build automático en cada push a `main`
  - Gestión de secrets para variables de entorno
  - Despliegue automático a GitHub Pages

### **Herramientas de Deploy**
- **gh-pages 6.3.0** - CLI para publicar en GitHub Pages

---

## 🔐 Seguridad y Configuración

### **Gestión de Variables de Entorno**
- Variables de entorno con prefijo `VITE_` para Vite
- Secrets en GitHub Actions para producción
- Archivo `.env` local para desarrollo

### **Seguridad de Datos**
- Row Level Security (RLS) en Supabase
- Autenticación mediante anon keys
- Validación de datos con Zod

---

## 📱 Características de la Aplicación

### **Responsive Design**
- Diseño completamente responsive con Tailwind CSS
- Optimizado para móviles, tablets y desktop
- Breakpoints personalizados

### **Accesibilidad**
- Componentes Radix UI con soporte ARIA completo
- Navegación por teclado
- Lectores de pantalla compatibles

### **Performance**
- Code splitting automático con Vite
- Lazy loading de componentes
- Optimización de imágenes y assets
- Caché inteligente con React Query

---

## 🌐 Integraciones Externas

### **APIs Consumidas**
1. **Groq API** - Para análisis nutricional con IA
2. **Supabase API** - Para persistencia de datos y contador global

### **Redes Sociales**
- Integración con Instagram para feedback y contacto

---

## 📈 Arquitectura del Proyecto

### **Estructura de Carpetas**
```
src/
├── components/     # Componentes reutilizables
│   └── ui/        # Componentes de UI base (shadcn/ui)
├── pages/         # Páginas de la aplicación
├── lib/           # Utilidades y configuraciones
│   ├── supabase.ts    # Cliente de Supabase
│   └── utils.ts       # Utilidades generales
└── hooks/         # Custom React hooks
```

### **Patrones de Diseño**
- Component-based architecture
- Custom hooks para lógica reutilizable
- Separation of concerns
- Type-safe development con TypeScript

---

## 🎓 Tecnologías de Aprendizaje y Mejores Prácticas

### **Paradigmas Aplicados**
- **Functional Programming** - Componentes funcionales de React
- **Declarative UI** - UI declarativa con React
- **Type Safety** - TypeScript para prevenir errores
- **Component Composition** - Composición de componentes

### **Mejores Prácticas Implementadas**
- ✅ Código modular y reutilizable
- ✅ TypeScript para type safety
- ✅ Componentes accesibles (a11y)
- ✅ Responsive design
- ✅ Optimización de performance
- ✅ Manejo de errores robusto
- ✅ Validación de datos
- ✅ Seguridad en el manejo de datos

---

## 📊 Estadísticas del Proyecto

- **Total de Dependencias**: ~50+ paquetes
- **Componentes UI**: 30+ componentes de Radix UI
- **Líneas de Código**: ~1,500+ líneas
- **Tecnologías Core**: React, TypeScript, Vite, Tailwind CSS
- **Servicios Externos**: Groq AI, Supabase

---

## 🔮 Tecnologías Futuras Potenciales

El proyecto está preparado para integrar:
- Autenticación de usuarios (Supabase Auth)
- Dashboard de estadísticas
- Historial de análisis por usuario
- Notificaciones push
- PWA (Progressive Web App)
- Testing (Jest, React Testing Library)

---

## 📝 Notas Finales

Este proyecto utiliza un stack moderno y robusto que combina:
- **Frontend moderno** con React y TypeScript
- **UI accesible** con Radix UI y Tailwind CSS
- **IA avanzada** con Groq API
- **Backend escalable** con Supabase
- **Deploy automatizado** con GitHub Actions

Todas las tecnologías están seleccionadas para proporcionar una experiencia de usuario excepcional, código mantenible y escalabilidad para el futuro.

---

*Última actualización: Diciembre 2024*

