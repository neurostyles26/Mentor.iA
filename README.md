# MentorIA - Plataforma Educativa IA para Docentes

MentorIA es una aplicación SaaS moderna diseñada para empoderar a los profesores mediante el uso de Inteligencia Artificial. Permite la creación de cursos, generación de lecciones dinámicas y edición de contenidos de forma intuitiva, ofreciendo además una experiencia de aprendizaje optimizada para los estudiantes.

---

## Características Principales

### Para Profesores:
- Asistente de Creación de Cursos: Genera estructuras de cursos completas a partir de objetivos pedagógicos.
- Generador de Lecciones IA: Crea contenido educativo, ejercicios y quizzes automáticamente.
- Editor de Bloques Estilo Notion: Personaliza cada lección con texto, imágenes y componentes interactivos.
- Optimización con IA: Mejora y refina el contenido de tus clases con un solo clic.

### Para Estudiantes:
- Interfaz de Lectura Limpia: Entorno sin distracciones para el aprendizaje.
- Tutor IA Integrado: Asistente pedagógico disponible 24/7 para explicar conceptos complejos.
- Seguimiento de Progreso: Visualización clara del avance en cada materia.

---

## Stack Tecnológico

- Frontend: Vue 3 (Composition API) + Vite
- Estilo: Tailwind CSS v4 (Diseño Neobrutalista Premium)
- Estado: Pinia
- Backend: Supabase (Auth, Database, RLS)
- Iconos: Lucide Vue Next

---

## Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente:

### 1. Clonar el repositorio
```bash
git clone https://github.com/neurostyles26/Mentor.iA.git
cd Mentor.iA
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo .env en la raíz del proyecto basándote en el archivo .env.example:

```env
VITE_SUPABASE_URL=TU_URL_DE_SUPABASE
VITE_SUPABASE_ANON_KEY=TU_ANON_KEY_DE_SUPABASE
```

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

---

## Despliegue (Vercel)

Este proyecto está optimizado para ser desplegado en **Vercel**.

### Variables de Entorno en Vercel
Para que la aplicación funcione correctamente en producción, debes configurar las siguientes variables en el panel de Vercel:
- `VITE_SUPABASE_URL`: Tu URL de Supabase.
- `VITE_SUPABASE_ANON_KEY`: Tu Anon Key de Supabase.

> [!IMPORTANT]
> La `GOOGLE_AI_KEY` no se configura en Vercel, sino en los **Secrets de Supabase**, ya que la utilizan las Edge Functions.

---

## Base de Datos (Supabase)

Para inicializar la base de datos, ejecuta el script SQL proporcionado en el SQL Editor de tu panel de Supabase. Este script creará las tablas necesarias:
- profiles
- courses
- lessons
- blocks

Además, configura Google OAuth en la sección de Authentication para habilitar el inicio de sesión social.

---

## Filosofía de Diseño
El proyecto utiliza un estilo Neobrutalista Moderno, caracterizado por:
- Sombras sólidas y bordes definidos.
- Paleta de colores vibrantes y contrastados.
- Tipografía de alta legibilidad (Epilogue / Plus Jakarta Sans).
- Micro-animaciones fluidas para una experiencia premium.

---

## Licencia
Este proyecto es de uso privado para la plataforma MentorIA.

---
Desarrollado para transformar la educación.
