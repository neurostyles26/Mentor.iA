# Mentor.iA - Arquitectura Educativa Basada en Inteligencia Artificial

Mentor.iA es una plataforma avanzada de servicios educativos diseñada para optimizar la labor docente mediante la integración de modelos de lenguaje de gran escala. La aplicación facilita la estructuración de programas académicos, la generación automatizada de material didáctico y la gestión administrativa de tiempos y recursos, proporcionando un entorno de alta fidelidad tanto para instructores como para estudiantes.

---

## Modulos Principales del Sistema

### Gestion Academica y Planeacion
- **Agenda Digital v2.5**: Modulo de gestion de tiempos que integra un calendario dinamico con sincronizacion en tiempo real para el agendamiento de sesiones sincronas y compromisos educativos.
- **Arquitectura de Cursos**: Herramienta de estructuracion jerarquica que permite definir objetivos pedagogicos y desglosarlos en unidades y lecciones coherentes.

### Inteligencia Artificial Aplicada
- **Integracion Gemma 4**: Utilizacion del modelo de lenguaje de Google optimizado para tareas pedagogicas, operando a traves de Supabase Edge Functions para garantizar latencia minima y seguridad en el procesamiento de datos.
- **Asistente ChatMentor**: Interfaz de apoyo continuo que ofrece retroalimentacion instantanea y aclaracion de conceptos complejos basada en el contexto de los cursos.
- **Generacion Automatizada de Contenido**: Motor de IA capaz de producir borradores de lecciones, ejercicios practicos y evaluaciones de forma autonoma.

### Experiencia de Usuario y Edicion
- **Editor de Bloques de Alto Rendimiento**: Interfaz de usuario intuitiva que permite la edicion de contenido enriquecido y la insercion de componentes interactivos.
- **Dashboard de Analitica**: Panel centralizado que proporciona una vision holistica del progreso del curso y la actividad de los usuarios.

---

## Especificaciones de la Arquitectura Tecnica

El sistema ha sido desarrollado bajo un paradigma moderno de aplicaciones web de una sola pagina (SPA) y una arquitectura de servicios en la nube:

- **Nucleo de Aplicacion**: Vue 3 utilizando Composition API para una logica modular y mantenible.
- **Gestor de Estado**: Pinia para la gestion reactiva de la autenticacion, flujos de chat y persistencia de cursos.
- **Sistema de Estilos**: Tailwind CSS 4, configurado para utilizar variables de entorno de diseño directamente en la capa de estilos global.
- **Infraestructura de Backend**: Supabase como plataforma integral para base de datos PostgreSQL, autenticacion (GoTrue), almacenamiento y funciones en el borde (Edge Functions).
- **Entorno de Construccion**: Vite para optimizar los tiempos de compilado y el ciclo de vida del desarrollo.

---

## Sistema de Diseño: Neural Tech

La interfaz de Mentor.iA se rige por la filosofia de diseño "Neural Tech", caracterizada por una estetica profunda de alta gama que prioriza la claridad visual y la eficiencia cognitiva.

### Fundamentos Visuales
- **Paleta de Colores**: Uso de Indigo (#6366F1) y Violeta (#8B5CF6) para componentes activos, con un fondo de negro profundo (#030712) que reduce la fatiga visual.
- **Estetica Glassmorphism**: Paneles con efectos de desenfoque de fondo y bordes sutiles para crear jerarquia visual y profundidad.
- **Tipografia**: Implementacion de la fuente Inter para garantizar legibilidad optima en diversos dispositivos.
- **Interactividad**: Micro-animaciones fluidas y efectos de iluminacion (glow) que proporcionan retroalimentacion visual instantanea a las acciones del usuario.

---

## Configuracion del Entorno de Desarrollo

### Pre-requisitos
- Node.js (Version LTS recomendada)
- Cuenta configurada en Supabase

### Pasos de Instalacion

1. Clonar el repositorio institucional:
```bash
git clone https://github.com/neurostyles26/Mentor.iA.git
```

2. Instalar las dependencias del proyecto:
```bash
npm install
```

3. Configuracion de Variables de Entorno:
Crear un archivo .env en el directorio raiz con las siguientes claves:
```env
VITE_SUPABASE_URL=URL_PROPORCIONADA_POR_SUPABASE
VITE_SUPABASE_ANON_KEY=ANON_KEY_PROPORCIONADA_POR_SUPABASE
```

4. Ejecutar el entorno de desarrollo:
```bash
npm run dev
```

---

## Despliegue y Mantenimiento

La aplicacion esta diseñada para su despliegue en infraestructuras de alto rendimiento como Vercel. Es imperativo que las claves de API sensibles, como la GOOGLE_AI_KEY, se gestionen exclusivamente a traves de los secretos de Supabase para evitar su exposicion en el lado del cliente.

---

## Licencia y Propiedad Intelectual
Este software es propiedad de la plataforma MentorIA y su uso esta restringido a los terminos y condiciones de la organizacion.

