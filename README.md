# Figma Survey App

Esta es una aplicación web moderna desarrollada con **React**, **Vite**, **TailwindCSS** y **Supabase**, diseñada para presentar prototipos interactivos de Figma junto con un sistema de encuestas y un panel de administración para la gestión de datos.

## 🚀 Características Principales

- **Visualizador de Prototipos**: Integración fluida de prototipos de Figma mediante iframes dinámicos.
- **Encuestas en Tiempo Real**: Formulario elegante con validación y envío de datos a Supabase.
- **Panel de Administración**: Visualización, filtrado y exportación de respuestas de encuestas.
- **Exportación a Excel**: Herramienta integrada para descargar las respuestas en formato `.xlsx`.
- **Diseño Glassmorphism**: Interfaz moderna con efectos de transparencia y fondos dinámicos.
- **Responsive**: Totalmente optimizado para dispositivos móviles y escritorio.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, Vite, TailwindCSS.
- **Backend / Base de Datos**: Supabase (PostgreSQL).
- **Estado**: Zustand (Store centralizado).
- **Iconos**: Lucide React.
- **Utilidades**: React Router Dom v7, XLSX.

## 📋 Requisitos para Ejecución Local

1. **Instalar Node.js**: Descarga la versión LTS desde [nodejs.org](https://nodejs.org/).
2. **Configurar Supabase**:
   - Crea un proyecto en [Supabase](https://supabase.com/).
   - Ejecuta el script `supabase_setup.sql` en el SQL Editor de Supabase para crear las tablas necesarias.
3. **Variables de Entorno**:
   - Crea un archivo `.env` en la raíz basado en `.env.example`.
   - Agrega tus credenciales:
     ```env
     VITE_SUPABASE_URL=tu_url_de_supabase
     VITE_SUPABASE_ANON_KEY=tu_anon_key
     ```

## 🔧 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 📂 Estructura del Proyecto

```text
figma-survey-app/
├── src/
│   ├── components/      # Componentes UI (FigmaEmbed, SurveyForm, SuccessView, etc.)
│   ├── lib/             # Configuración de librerías externas (supabase.js)
│   ├── pages/           # Vistas principales (SurveyPage, AdminPage)
│   ├── store/           # Gestión de estado global (useAppStore.js)
│   ├── App.jsx          # Enrutamiento principal (React Router)
│   ├── index.css        # Estilos globales y Tailwind CSS
│   └── main.jsx         # Punto de entrada
├── supabase_setup.sql   # Script SQL para la base de datos
├── .env.example         # Plantilla de variables de entorno
├── .gitignore           # Archivos e historial excluidos de Git
├── package.json         # Dependencias y scripts
└── tailwind.config.js   # Personalización de Tailwind
```

## 📸 Capturas de pantalla
![alt text](/Ejem/image.png)

