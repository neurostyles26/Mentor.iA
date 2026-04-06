-- Script SQL Final para MentorIA (MVP)
-- Este comando limpia TODA la estructura previa para asegurar el funcionamiento del MVP.

-- 1. Limpieza Forzada (CASCADE borra las dependencias como la tabla 'blocks')
DROP TABLE IF EXISTS public.lessons CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.blocks CASCADE; 

-- 2. Creación de Tabla de Cursos
CREATE TABLE public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    grade TEXT,
    subject TEXT,
    progress INTEGER DEFAULT 0,
    color TEXT DEFAULT 'from-primary to-blue-400',
    classes_count INTEGER DEFAULT 0
);

-- 3. Creación de Tabla de Lecciones
CREATE TABLE public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT, 
    status TEXT DEFAULT 'draft',
    type TEXT DEFAULT 'IA'
);

-- 4. Habilitar RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Seguridad
CREATE POLICY "Profesores pueden gestionar sus propios cursos" 
ON public.courses FOR ALL 
TO authenticated 
USING (auth.uid() = teacher_id)
WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Profesores pueden gestionar las lecciones de sus cursos" 
ON public.lessons FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.courses 
        WHERE id = course_id AND teacher_id = auth.uid()
    )
);

-- 6. Permitir lectura pública de lecciones
CREATE POLICY "Alumnos pueden leer lecciones" 
ON public.lessons FOR SELECT 
TO public 
USING (true);
