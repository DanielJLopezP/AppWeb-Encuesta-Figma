# Figma Survey App

Esta es una aplicación web desarrollada con React, Vite y TailwindCSS diseñada para presentar un prototipo interactivo de Figma de tu aplicación móvil junto con una encuesta para recolectar opiniones de los usuarios.

## Descripción del Proyecto

La aplicación tiene un diseño moderno, limpio y minimalista (estilo "Glassmorphism"). La pantalla se divide en dos secciones principales:
1. **Visualizador de Prototipo:** Un iframe integrado que muestra tu diseño interactivo de Figma.
2. **Encuesta de Usuario:** Un formulario elegante en el que el usuario puede calificar su experiencia, indicar la facilidad de uso, comentar el diseño y aportar áreas de mejora.

## Requisitos para ejecutarlo

Dado que probablamente tu sistema no tiene **Node.js** ni **npm** instalados, es indispensable que los instales primero para poder probar este proyecto en local:
1. Descarga e instala Node.js desde la [página oficial](https://nodejs.org/).
2. Asegúrate de instalar la versión LTS (Recomendada para la mayoría).
3. Una vez instalado, reinicia tu terminal o línea de comandos.

## Instalación de dependencias

Abre tu terminal, navega a la carpeta de este proyecto (`figma-survey-app`) y ejecuta:

```bash
cd figma-survey-app
npm install
```

## Cómo iniciar el proyecto

Para correr el servidor de desarrollo en modo local, ejecuta:

```bash
npm run dev
```

Luego abre tu navegador en la URL que indique la consola (usualmente `http://localhost:5173`).

## Explicación de la estructura del proyecto

```text
figma-survey-app/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes reutilizables de UI
│   │   ├── FigmaEmbed.jsx     # Componente encargado de renderizar el iframe
│   │   ├── SurveyForm.jsx     # Formulario de la encuesta principal
│   │   └── SuccessView.jsx    # Pantalla de éxito tras el envío
│   ├── App.jsx          # Aplicación principal donde se maneja el estado del formulario global
│   ├── index.css        # Directivas de Tailwind y utilidades CSS globales (glass, etc.)
│   └── main.jsx         # Punto de entrada de la aplicación React
├── package.json         # Dependencias del proyecto
├── tailwind.config.js   # Configuración de los estilos, colores y animaciones de Tailwind
└── vite.config.js       # Configuración básica de empaquetado de Vite
```


## Capturas de pantalla del proyecto
![alt text](/Ejem/image.png)

