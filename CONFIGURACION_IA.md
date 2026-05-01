# MentorIA — Guía de Configuración del Motor de Inteligencia Artificial

**Plataforma:** MentorIA Intelligence Suite  
**Última actualización:** 30 de abril de 2026  
**Desarrollador:** Edisson — NeuralCode  
**Motor IA:** Google Gemini (API REST directa, sin SDK externo)

---

## Tabla de Contenidos

1. [Arquitectura del Sistema](#1-arquitectura-del-sistema)
2. [Requisitos Previos](#2-requisitos-previos)
3. [Obtener la API Key de Google Gemini](#3-obtener-la-api-key-de-google-gemini)
4. [Configurar la API Key en Supabase](#4-configurar-la-api-key-en-supabase)
5. [Desplegar las Edge Functions](#5-desplegar-las-edge-functions)
6. [Verificación y Pruebas](#6-verificación-y-pruebas)
7. [Modelos Disponibles y Selección](#7-modelos-disponibles-y-selección)
8. [Límites del Nivel Gratuito](#8-límites-del-nivel-gratuito)
9. [Diagnóstico de Errores Comunes](#9-diagnóstico-de-errores-comunes)
10. [Mantenimiento y Actualización de Modelos](#10-mantenimiento-y-actualización-de-modelos)

---

## 1. Arquitectura del Sistema

MentorIA utiliza una arquitectura de tres capas para la inteligencia artificial:

```
Frontend (Vercel)          Edge Functions (Supabase)         API de Google
    Vue.js           --->     Deno Runtime             --->    Gemini
 mentor-i-a.vercel.app    gjrcxmvgheeakhxoeiho.supabase.co    generativelanguage.googleapis.com
```

**Punto importante:** El frontend en Vercel NO se comunica directamente con Google. Las peticiones pasan por Supabase Edge Functions, que actúan como intermediario seguro. Esto significa que:

- Vercel solo despliega la interfaz visual (archivos `.vue`, `.js`, `.css`).
- Supabase almacena la API Key de forma segura y ejecuta las funciones de IA.
- Google recibe las peticiones desde Supabase, nunca desde el navegador del usuario.

### Funciones de IA del Proyecto

| Función | Archivo | Propósito |
|---------|---------|-----------|
| `teacher-chat` | `supabase/functions/teacher-chat/index.ts` | Chat de co-creación pedagógica con historial |
| `tutor-chat` | `supabase/functions/tutor-chat/index.ts` | Respuestas rápidas y análisis de documentos |
| `generate-lessons` | `supabase/functions/generate-lessons/index.ts` | Generación de lecciones, talleres y exámenes |

### Método de Conexión con Google

Las funciones utilizan **llamadas HTTP directas** (`fetch`) a la API REST de Google, sin depender de librerías externas como `@google/generative-ai` o `@google/genai`. Esta decisión se tomó porque:

- Las librerías de Google presentan incompatibilidades frecuentes con el entorno Deno de Supabase.
- Las versiones de las librerías cambian constantemente y rompen la compatibilidad.
- El método `fetch` nativo funciona en cualquier versión de Deno sin configuración adicional.

**Endpoint utilizado:**
```
https://generativelanguage.googleapis.com/v1beta/models/{MODELO}:generateContent?key={API_KEY}
```

---

## 2. Requisitos Previos

Antes de configurar la IA, asegurarse de tener:

- **Node.js** instalado (versión 18 o superior).
- **Supabase CLI** instalado. Si no lo tienes como comando global, se puede usar con `npx supabase`.
- **Cuenta de Google** con acceso a Google AI Studio.
- **Proyecto de Supabase** vinculado localmente (el proyecto `gjrcxmvgheeakhxoeiho`).

### Verificar que Supabase CLI funciona

```powershell
npx supabase --version
```

Si responde con un número de versión, está listo. Si no, instalar con:

```powershell
npm install -D supabase
```

---

## 3. Obtener la API Key de Google Gemini

### Paso 1: Acceder a Google AI Studio

Abrir en el navegador: **https://aistudio.google.com/app/apikey**

Iniciar sesión con una cuenta de Google personal (no institucional, ya que algunas cuentas corporativas tienen restricciones).

### Paso 2: Crear una API Key

1. Hacer clic en **"Create API Key"**.
2. Si se solicita, seleccionar un proyecto de Google Cloud existente o crear uno nuevo.
3. Copiar la llave generada. Tiene el formato: `AIzaSy...` (39 caracteres aproximadamente).

### Paso 3: Guardar la Key Localmente

Abrir el archivo `.env` en la raíz del proyecto y actualizar:

```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Nota:** Este archivo `.env` es solo para referencia local. Las Edge Functions de Supabase NO leen este archivo. La Key debe configurarse por separado en Supabase (ver sección siguiente).

### Recomendaciones sobre la API Key

- No compartir la Key en repositorios públicos.
- Si la Key se ve comprometida, revocarla inmediatamente desde Google AI Studio y generar una nueva.
- Si la cuota diaria se agota, se puede crear una Key en un proyecto de Google Cloud diferente como respaldo temporal.

---

## 4. Configurar la API Key en Supabase

Este es el paso más crítico. Sin él, las funciones devolverán error 500.

### Comando para establecer la Key

```powershell
npx supabase secrets set GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Reemplazar `AIzaSyXXX...` con la Key real obtenida en el paso anterior.

### Verificar que la Key está configurada

```powershell
npx supabase secrets list
```

En la tabla resultante, debe aparecer una fila con `GEMINI_API_KEY` y un valor en la columna `DIGEST`. Si aparece, la configuración es correcta.

### Actualizar la Key (cuando se renueve o cambie)

Ejecutar el mismo comando `secrets set` con la nueva Key. Supabase la reemplaza automáticamente:

```powershell
npx supabase secrets set GEMINI_API_KEY=NUEVA_LLAVE_AQUI
```

No es necesario redesplegar las funciones después de cambiar un secreto. Las funciones toman el nuevo valor automáticamente.

---

## 5. Desplegar las Edge Functions

### Despliegue de todas las funciones

```powershell
npx supabase functions deploy teacher-chat tutor-chat generate-lessons --no-verify-jwt
```

**Sobre el flag `--no-verify-jwt`:** Este flag permite que las funciones acepten peticiones desde el frontend sin validación estricta de JWT. Es necesario porque el frontend envía la Anon Key como autorización, no un token de sesión completo.

### Despliegue individual (cuando solo se modifica una función)

```powershell
npx supabase functions deploy teacher-chat --no-verify-jwt
```

### Verificar el estado del despliegue

```powershell
npx supabase functions list
```

Las tres funciones deben aparecer con estado `ACTIVE`.

---

## 6. Verificación y Pruebas

### Prueba directa desde la terminal

Esta prueba confirma que la función, la Key y el modelo están funcionando correctamente, sin depender del frontend:

```powershell
try {
  $response = Invoke-WebRequest -Method POST `
    -Uri "https://gjrcxmvgheeakhxoeiho.supabase.co/functions/v1/teacher-chat" `
    -ContentType "application/json" `
    -Headers @{ "Authorization" = "Bearer TU_SUPABASE_ANON_KEY" } `
    -Body '{"message":"Hola, soy un docente de prueba"}'
  $response.Content
} catch {
  $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
  $reader.ReadToEnd()
}
```

Reemplazar `TU_SUPABASE_ANON_KEY` con el valor de `VITE_SUPABASE_ANON_KEY` del archivo `.env`.

### Interpretación de resultados

| Respuesta | Significado | Acción |
|-----------|-------------|--------|
| `{"reply":"...texto de la IA..."}` | Todo funciona correctamente | Ninguna |
| `{"error":"Falta la API Key en Supabase"}` | La Key no está en los secretos | Ejecutar `secrets set` |
| `{"error":"...not found for API version..."}` | El modelo fue retirado por Google | Cambiar el nombre del modelo en las funciones |
| `{"error":"...quota exceeded..."}` | Cuota diaria agotada | Esperar al reinicio o crear nueva Key |
| `{"error":"API key not valid"}` | La Key es incorrecta o fue revocada | Generar nueva Key en AI Studio |

---

## 7. Modelos Disponibles y Selección

Google actualiza los modelos periódicamente. Para consultar qué modelos están disponibles con la Key actual:

```powershell
$key = "TU_API_KEY"
$models = Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models?key=$key"
$models.models | Where-Object { $_.supportedGenerationMethods -contains "generateContent" } | ForEach-Object { $_.name }
```

### Modelos recomendados para MentorIA (a abril de 2026)

| Modelo | Velocidad | Calidad | Costo | Recomendación |
|--------|-----------|---------|-------|---------------|
| `gemini-2.0-flash` | Alta | Buena | Gratuito | Uso principal |
| `gemini-2.0-flash-lite` | Muy alta | Aceptable | Gratuito | Respaldo si se agota la cuota del flash |
| `gemini-2.5-flash` | Alta | Muy buena | Gratuito | Alternativa avanzada |
| `gemini-2.5-pro` | Media | Excelente | Gratuito limitado | Solo para generación de contenido largo |

### Modelos retirados (no usar)

Los siguientes modelos ya no están disponibles en la API:

- `gemini-1.5-flash` — Retirado en 2026.
- `gemini-1.5-pro` — Retirado en 2026.
- `gemini-pro` — Retirado en 2026.

### Cómo cambiar el modelo

En cada archivo de función (`index.ts`), el modelo está definido en la URL del endpoint:

```typescript
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`
```

Para cambiar el modelo, reemplazar `gemini-2.0-flash` por el nombre del modelo deseado y redesplegar:

```powershell
npx supabase functions deploy teacher-chat tutor-chat generate-lessons --no-verify-jwt
```

---

## 8. Límites del Nivel Gratuito

Google Gemini tiene las siguientes restricciones en el nivel gratuito (Free Tier):

| Recurso | Límite |
|---------|--------|
| Peticiones por minuto por modelo | 15 |
| Peticiones por día por modelo | 1,500 |
| Tokens de entrada por minuto | 1,000,000 |
| Tokens de salida por minuto | Variable según modelo |

**Cuando se agotan las peticiones por minuto:** Google devuelve error 429 con un mensaje de `RESOURCE_EXHAUSTED` y un campo `retryDelay` que indica cuántos segundos esperar.

**Cuando se agotan las peticiones por día:** Google devuelve error 429 con `limit: 0`. En este caso, hay que esperar al día siguiente o usar una API Key de un proyecto diferente.

### Estrategia ante límites agotados

1. **Esperar:** La cuota por minuto se reinicia cada 60 segundos. La cuota diaria se reinicia a medianoche hora del Pacífico (aproximadamente 2:00 AM hora Colombia).

2. **Key de respaldo:** Se puede crear una segunda API Key desde un proyecto de Google Cloud diferente y tenerla lista para emergencias.

---

## 9. Diagnóstico de Errores Comunes

### Error 500 en la consola del navegador

El error 500 genérico en la consola del navegador ("Edge Function returned a non-2xx status code") no proporciona suficiente detalle. Para diagnosticarlo:

1. Abrir Chrome DevTools (F12).
2. Ir a la pestaña **Network** (Red).
3. Enviar un mensaje en el chat.
4. Buscar la petición `teacher-chat` marcada en rojo.
5. Hacer clic en ella y leer la pestaña **Response** (Respuesta).

El cuerpo de la respuesta contiene el error específico que devuelve Google.

### Tabla de errores específicos

| Error de Google | Causa | Solución |
|-----------------|-------|----------|
| `models/gemini-X is not found for API version v1beta` | El modelo fue retirado o no existe | Consultar la lista de modelos disponibles y actualizar el nombre |
| `API key not valid. Please pass a valid API key.` | La Key es incorrecta, expirada o revocada | Generar una nueva Key en Google AI Studio |
| `You exceeded your current quota` con `limit: 0` | Cuota diaria agotada | Esperar al reinicio diario o usar Key de respaldo |
| `You exceeded your current quota` con `retryDelay: Xs` | Cuota por minuto agotada | Esperar los segundos indicados |
| `User location is not supported` | Restricción geográfica de Google | Usar un modelo diferente que no tenga restricción regional |
| `Request payload size exceeds the limit` | El texto enviado es demasiado largo | Reducir el tamaño del prompt o del historial de chat |

### Comando de diagnóstico rápido

Este comando prueba la Key directamente contra Google, sin pasar por Supabase, para aislar si el problema es la Key o la función:

```powershell
$key = "TU_API_KEY"
try {
  $r = Invoke-WebRequest -Method POST `
    -Uri "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$key" `
    -ContentType "application/json" `
    -Body '{"contents":[{"parts":[{"text":"di hola"}]}]}'
  $r.Content
} catch {
  $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
  $reader.ReadToEnd()
}
```

Si este comando devuelve una respuesta exitosa pero la función de Supabase no, el problema está en la configuración de los secretos.

---

## 10. Mantenimiento y Actualización de Modelos

Google retira modelos periódicamente sin aviso prolongado. Para prevenir interrupciones:

### Verificación periódica (una vez al mes)

1. Listar los modelos disponibles con el comando de la sección 7.
2. Verificar que el modelo usado en las funciones sigue en la lista.
3. Si fue retirado, actualizar al modelo recomendado más reciente.

### Procedimiento de actualización de modelo

1. Editar los 3 archivos de función:
   - `supabase/functions/teacher-chat/index.ts`
   - `supabase/functions/tutor-chat/index.ts`
   - `supabase/functions/generate-lessons/index.ts`

2. En cada archivo, buscar la línea que contiene la URL del endpoint y cambiar el nombre del modelo:
   ```
   Antes: models/gemini-2.0-flash:generateContent
   Después: models/NUEVO-MODELO:generateContent
   ```

3. Desplegar:
   ```powershell
   npx supabase functions deploy teacher-chat tutor-chat generate-lessons --no-verify-jwt
   ```

4. Hacer commit:
   ```powershell
   git add supabase/functions/
   git commit -m "actualizar modelo de IA a NUEVO-MODELO"
   git push
   ```

### Estructura interna de una función (referencia)

```typescript
// No se importan librerías externas. Se usa fetch nativo de Deno.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // 1. Manejo de CORS (preflight)
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // 2. Leer el cuerpo de la petición
    const { message } = await req.json()

    // 3. Obtener la API Key desde los secretos de Supabase
    const API_KEY = Deno.env.get('GEMINI_API_KEY')

    // 4. Construir la URL con el modelo y la Key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`

    // 5. Hacer la petición a Google
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: message }] }]
      })
    })

    // 6. Leer y parsear la respuesta
    const data = await response.json()

    // 7. Extraer el texto generado
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    // 8. Devolver al frontend
    return new Response(JSON.stringify({ reply: text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
```

---

## Checklist de Configuración Completa

Usar esta lista cuando se configure el proyecto desde cero o se migre a un nuevo entorno:

- [ ] Cuenta de Google con acceso a Google AI Studio
- [ ] API Key generada en https://aistudio.google.com/app/apikey
- [ ] API Key guardada en el archivo `.env` local (referencia)
- [ ] API Key configurada en Supabase: `npx supabase secrets set GEMINI_API_KEY=...`
- [ ] Verificar con `npx supabase secrets list` que aparece `GEMINI_API_KEY`
- [ ] Modelo actual verificado contra la lista de modelos disponibles
- [ ] Funciones desplegadas: `npx supabase functions deploy teacher-chat tutor-chat generate-lessons --no-verify-jwt`
- [ ] Funciones activas: `npx supabase functions list` muestra estado `ACTIVE`
- [ ] Prueba directa exitosa desde terminal (ver sección 6)
- [ ] Prueba desde el navegador: el chat responde correctamente
