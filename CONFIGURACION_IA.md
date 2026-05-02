# MentorIA — Guía de Configuración del Motor de Inteligencia Artificial

**Plataforma:** MentorIA Intelligence Suite  
**Última actualización:** 2 de mayo de 2026  
**Desarrollador:** Edisson — NeuralCode  
**Motores IA:** Google Gemini + OpenRouter (Multi-Proveedor con Auto-Recuperación)

---

## Tabla de Contenidos

1. [Arquitectura del Sistema](#1-arquitectura-del-sistema)
2. [Requisitos Previos](#2-requisitos-previos)
3. [Configuración de Google Gemini](#3-configuración-de-google-gemini)
4. [Configuración de OpenRouter (Gratuito)](#4-configuración-de-openrouter-gratuito)
5. [Configurar las API Keys en Supabase](#5-configurar-las-api-keys-en-supabase)
6. [Desplegar las Edge Functions](#6-desplegar-las-edge-functions)
7. [Verificación y Pruebas](#7-verificación-y-pruebas)
8. [Modelos Disponibles (Verificados Mayo 2026)](#8-modelos-disponibles-verificados-mayo-2026)
9. [Sistema de Auto-Recuperación](#9-sistema-de-auto-recuperación)
10. [Selector de Modelo en la Interfaz](#10-selector-de-modelo-en-la-interfaz)
11. [Límites del Nivel Gratuito](#11-límites-del-nivel-gratuito)
12. [Diagnóstico de Errores Comunes](#12-diagnóstico-de-errores-comunes)
13. [Mantenimiento y Actualización de Modelos](#13-mantenimiento-y-actualización-de-modelos)

---

## 1. Arquitectura del Sistema

MentorIA utiliza una arquitectura **Multi-Proveedor** con dos motores de IA y un sistema de auto-recuperación:

```
                                                    ┌─── Google Gemini API
Frontend (Vercel)     Edge Functions (Supabase)  ───┤    (gemini-2.5-flash)
    Vue.js        ──►     Deno Runtime           ───┤
 mentor-i-a.vercel.app  gjrcxmvgheeakhxoeiho     ───┤
                                                    └─── OpenRouter API
                                                         (gemma-4-26b-a4b-it:free)
```

**Flujo de la petición:**

1. El usuario selecciona un proveedor (Gemini o OpenRouter) en el chat.
2. El frontend envía el mensaje a Supabase indicando el proveedor elegido.
3. Supabase prueba el modelo principal del proveedor seleccionado.
4. Si falla, el sistema intenta automáticamente con los modelos de respaldo.
5. La respuesta se devuelve al chat del usuario.

### Funciones de IA del Proyecto

| Función | Archivo | Propósito |
|---------|---------|-----------|
| `teacher-chat` | `supabase/functions/teacher-chat/index.ts` | Chat de co-creación pedagógica con historial |
| `tutor-chat` | `supabase/functions/tutor-chat/index.ts` | Respuestas rápidas y análisis de documentos |
| `generate-lessons` | `supabase/functions/generate-lessons/index.ts` | Generación de lecciones, talleres y exámenes |

### Método de Conexión

Las funciones utilizan **llamadas HTTP directas** (`fetch`) a las APIs REST, sin depender de librerías externas. Esta decisión se tomó porque:

- Las librerías de Google presentan incompatibilidades frecuentes con el entorno Deno de Supabase.
- El método `fetch` nativo funciona en cualquier versión de Deno sin configuración adicional.
- Permite soportar múltiples proveedores sin dependencias adicionales.

**Endpoints utilizados:**

| Proveedor | Endpoint |
|-----------|----------|
| Google Gemini | `https://generativelanguage.googleapis.com/v1beta/models/{MODELO}:generateContent?key={API_KEY}` |
| OpenRouter | `https://openrouter.ai/api/v1/chat/completions` |

---

## 2. Requisitos Previos

Antes de configurar la IA, asegurarse de tener:

- **Node.js** instalado (versión 18 o superior).
- **Supabase CLI** instalado. Si no lo tienes como comando global, se puede usar con `npx supabase`.
- **Cuenta de Google** con acceso a Google AI Studio.
- **Cuenta de OpenRouter** (opcional, para el proveedor gratuito alternativo).
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

## 3. Configuración de Google Gemini

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

**Nota:** Este archivo `.env` es solo para referencia local. Las Edge Functions de Supabase NO leen este archivo. La Key debe configurarse por separado en Supabase (ver sección 5).

### Recomendaciones sobre la API Key

- No compartir la Key en repositorios públicos.
- Si la Key se ve comprometida, revocarla inmediatamente desde Google AI Studio y generar una nueva.
- Si la cuota diaria se agota, se puede crear una Key en un proyecto de Google Cloud diferente como respaldo temporal.

---

## 4. Configuración de OpenRouter (Gratuito)

OpenRouter es un **proveedor gratuito** que da acceso a modelos de IA de código abierto sin costo alguno. Es la alternativa ideal cuando Gemini agota su cuota o cuando se quiere ofrecer una opción libre al usuario.

### Paso 1: Crear cuenta en OpenRouter

Abrir en el navegador: **https://openrouter.ai/keys**

Iniciar sesión con Google o GitHub.

### Paso 2: Generar una API Key

1. Hacer clic en **"Create Key"**.
2. Nombrar la llave como `MentorIA` (o cualquier nombre descriptivo).
3. Copiar la llave generada. Tiene el formato: `sk-or-v1-...` (más de 60 caracteres).

### Paso 3: Guardar la Key Localmente

Agregar al archivo `.env`:

```env
OPENROUTER_API_KEY=sk-or-v1-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Características de OpenRouter

| Característica | Detalle |
|----------------|---------|
| **Costo** | 100% gratuito para modelos con sufijo `:free` |
| **Límite** | Generoso, no suele agotarse en uso educativo |
| **Modelos** | Acceso a Gemma 4, Nemotron, Mistral y más |
| **Velocidad** | Varía según el modelo (Gemma 4 es muy rápido) |

---

## 5. Configurar las API Keys en Supabase

Este es el paso más crítico. Sin él, las funciones no podrán conectarse a los proveedores de IA.

### Comando para establecer ambas Keys

```powershell
npx supabase secrets set GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
npx supabase secrets set OPENROUTER_API_KEY=sk-or-v1-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Reemplazar los valores con las Keys reales obtenidas en los pasos anteriores.

### Verificar que las Keys están configuradas

```powershell
npx supabase secrets list
```

En la tabla resultante, deben aparecer filas con `GEMINI_API_KEY` y `OPENROUTER_API_KEY` y un valor en la columna `DIGEST`. Si aparecen, la configuración es correcta.

### Actualizar una Key (cuando se renueve o cambie)

Ejecutar el mismo comando `secrets set` con la nueva Key. Supabase la reemplaza automáticamente:

```powershell
npx supabase secrets set GEMINI_API_KEY=NUEVA_LLAVE_AQUI
```

No es necesario redesplegar las funciones después de cambiar un secreto. Las funciones toman el nuevo valor automáticamente.

### También se puede configurar desde el Dashboard de Supabase

1. Ir a: **https://supabase.com/dashboard/project/gjrcxmvgheeakhxoeiho/settings/functions**
2. En la sección **"Secrets"**, agregar:
   - `GEMINI_API_KEY` → tu llave de Google
   - `OPENROUTER_API_KEY` → tu llave de OpenRouter

---

## 6. Desplegar las Edge Functions

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

## 7. Verificación y Pruebas

### Prueba directa de Gemini desde la terminal

```powershell
$key = "TU_GEMINI_API_KEY"
try {
  $r = Invoke-WebRequest -Method POST `
    -Uri "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$key" `
    -ContentType "application/json" `
    -Body '{"contents":[{"parts":[{"text":"di hola"}]}]}'
  $r.Content
} catch {
  $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
  $reader.ReadToEnd()
}
```

### Prueba directa de OpenRouter desde la terminal

```powershell
$key = "TU_OPENROUTER_API_KEY"
$headers = @{ "Authorization" = "Bearer $key"; "Content-Type" = "application/json" }
$body = '{"model":"google/gemma-4-26b-a4b-it:free","messages":[{"role":"user","content":"di hola"}]}'
try {
  $r = Invoke-WebRequest -Method POST -Uri "https://openrouter.ai/api/v1/chat/completions" -Headers $headers -Body $body
  $r.Content
} catch {
  $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
  $reader.ReadToEnd()
}
```

### Prueba de la función de Supabase

```powershell
try {
  $response = Invoke-WebRequest -Method POST `
    -Uri "https://gjrcxmvgheeakhxoeiho.supabase.co/functions/v1/teacher-chat" `
    -ContentType "application/json" `
    -Headers @{ "Authorization" = "Bearer TU_SUPABASE_ANON_KEY" } `
    -Body '{"message":"Hola, soy un docente de prueba","provider":"gemini"}'
  $response.Content
} catch {
  $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
  $reader.ReadToEnd()
}
```

Para probar con OpenRouter, cambiar `"provider":"gemini"` por `"provider":"openrouter"`.

### Interpretación de resultados

| Respuesta | Significado | Acción |
|-----------|-------------|--------|
| `{"reply":"...texto de la IA..."}` | Todo funciona correctamente | Ninguna |
| `{"reply":"❌ Error: Falta GEMINI_API_KEY."}` | La Key no está en los secretos | Ejecutar `secrets set` |
| `{"reply":"❌ Error: Gemini no respondió."}` | Todos los modelos fallaron | Verificar Key y modelos disponibles |
| `{"reply":"❌ Error: OpenRouter no respondió."}` | Todos los modelos de OpenRouter fallaron | Verificar OPENROUTER_API_KEY |

---

## 8. Modelos Disponibles (Verificados Mayo 2026)

> **Importante:** Los modelos de IA se actualizan constantemente. Los listados a continuación fueron verificados el **2 de mayo de 2026** directamente contra las APIs.

### Google Gemini — Modelos Activos

| Modelo | Velocidad | Calidad | Costo | Estado |
|--------|-----------|---------|-------|--------|
| **`gemini-2.5-flash`** | ⚡ Muy Alta | Excelente | Gratuito | ✅ Principal |
| **`gemini-2.0-flash`** | ⚡ Alta | Muy Buena | Gratuito | ✅ Respaldo 1 |
| **`gemini-2.0-flash-lite`** | ⚡⚡ Ultra | Buena | Gratuito | ✅ Respaldo 2 |
| `gemini-2.5-pro` | Media | Excepcional | Gratuito limitado | Disponible |
| `gemma-3-4b-it` | Alta | Aceptable | Gratuito | Disponible |

### Google Gemini — Modelos RETIRADOS (No Usar)

| Modelo | Estado |
|--------|--------|
| ~~`gemini-1.5-flash`~~ | ❌ Retirado en 2026 |
| ~~`gemini-1.5-flash-latest`~~ | ❌ Retirado en 2026 |
| ~~`gemini-1.5-pro`~~ | ❌ Retirado en 2026 |
| ~~`gemini-pro`~~ | ❌ Retirado en 2026 |

### OpenRouter — Modelos Gratuitos Activos

| Modelo | Parámetros | Velocidad | Estado |
|--------|-----------|-----------|--------|
| **`google/gemma-4-26b-a4b-it:free`** | 26B | ⚡ Rápido | ✅ Principal |
| **`google/gemma-4-31b-it:free`** | 31B | Media | ✅ Respaldo 1 |
| **`nvidia/nemotron-3-super-120b-a12b:free`** | 120B | Lenta | ✅ Respaldo 2 |
| `minimax/minimax-m2.5:free` | — | Media | Disponible |
| `poolside/laguna-m.1:free` | — | Media | Disponible |

### OpenRouter — Modelos RETIRADOS (No Usar)

| Modelo | Estado |
|--------|--------|
| ~~`meta-llama/llama-3.1-8b-instruct:free`~~ | ❌ Retirado |
| ~~`meta-llama/llama-3-8b-instruct:free`~~ | ❌ Retirado |
| ~~`google/gemma-2-9b-it:free`~~ | ❌ Retirado |
| ~~`mistralai/mistral-7b-instruct:free`~~ | ❌ Retirado |

### Cómo consultar modelos disponibles en tiempo real

**Para Gemini:**
```powershell
$key = "TU_API_KEY"
(Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models?key=$key").models |
  Where-Object { $_.supportedGenerationMethods -contains "generateContent" } |
  Select-Object -Property name |
  Format-Table -AutoSize
```

**Para OpenRouter:**
```powershell
$headers = @{ "Authorization" = "Bearer TU_OPENROUTER_KEY" }
(Invoke-RestMethod -Uri "https://openrouter.ai/api/v1/models" -Headers $headers).data |
  Where-Object { $_.id -like "*:free*" } |
  Select-Object -Property id -First 15 |
  Format-Table -AutoSize
```

---

## 9. Sistema de Auto-Recuperación

MentorIA implementa un **sistema de auto-recuperación inteligente** que garantiza que el usuario siempre reciba una respuesta, incluso si un modelo específico falla o es retirado.

### ¿Cómo funciona?

```
Usuario elige "Gemini"
    │
    ├──► Intenta gemini-2.5-flash     ──► ✅ Responde → FIN
    │                                  ──► ❌ Falla
    ├──► Intenta gemini-2.0-flash     ──► ✅ Responde → FIN
    │                                  ──► ❌ Falla
    ├──► Intenta gemini-2.0-flash-lite ──► ✅ Responde → FIN
    │                                  ──► ❌ Falla
    └──► Muestra mensaje de error al usuario
```

```
Usuario elige "OpenRouter"
    │
    ├──► Intenta gemma-4-26b-a4b-it:free      ──► ✅ Responde → FIN
    │                                          ──► ❌ Falla
    ├──► Intenta gemma-4-31b-it:free           ──► ✅ Responde → FIN
    │                                          ──► ❌ Falla
    ├──► Intenta nemotron-3-super-120b-a12b:free ──► ✅ Responde → FIN
    │                                          ──► ❌ Falla
    └──► Muestra mensaje de error al usuario
```

### Ventajas

- Si Google retira un modelo, el sistema automáticamente usa el siguiente disponible.
- Si OpenRouter tiene un modelo temporalmente caído, prueba con los otros.
- El usuario no nota el cambio de modelo; siempre recibe una respuesta.

---

## 10. Selector de Modelo en la Interfaz

El usuario puede cambiar entre Gemini y OpenRouter directamente desde el chat, sin necesidad de entrar a configuraciones.

### Ubicación

El selector se encuentra **debajo de la caja de texto del chat**, con dos botones tipo "pill":

- **⚡ Gemini** — Motor de Google (principal)
- **🟢 OpenRouter (Free)** — Motor gratuito alternativo

### Comportamiento

- El proveedor seleccionado se aplica a **todas las funciones** (chat, generación de lecciones, tutor).
- La selección se guarda en el estado de la aplicación y persiste durante la sesión.
- El indicador LED verde muestra cuál motor está activo.

### Archivos relacionados

| Archivo | Función |
|---------|---------|
| `src/components/ChatMentor.vue` | Componente visual del selector |
| `src/store/index.js` | Estado global del proveedor seleccionado |
| `src/store/chat.js` | Envío del parámetro `provider` a Supabase |

---

## 11. Límites del Nivel Gratuito

### Google Gemini

| Recurso | Límite |
|---------|--------|
| Peticiones por minuto por modelo | 15 |
| Peticiones por día por modelo | 1,500 |
| Tokens de entrada por minuto | 1,000,000 |
| Tokens de salida por minuto | Variable según modelo |

**Cuando se agotan las peticiones por minuto:** Google devuelve error 429 con `RESOURCE_EXHAUSTED` y un campo `retryDelay`.

**Cuando se agotan las peticiones por día:** Google devuelve error 429 con `limit: 0`. Esperar al día siguiente o cambiar a OpenRouter.

### OpenRouter (Free Tier)

| Recurso | Límite |
|---------|--------|
| Peticiones | Sin límite explícito para modelos `:free` |
| Tokens | Varía por modelo, generalmente generoso |
| Disponibilidad | Puede haber colas en horas pico |

**Estrategia ante límites agotados:**

1. **Cambiar de proveedor:** Si Gemini se agota, el usuario puede cambiar a OpenRouter desde el chat.
2. **Esperar:** La cuota por minuto de Gemini se reinicia cada 60 segundos. La cuota diaria se reinicia a medianoche hora del Pacífico (~2:00 AM Colombia).
3. **Key de respaldo:** Se puede crear una segunda API Key de Gemini desde un proyecto de Google Cloud diferente.

---

## 12. Diagnóstico de Errores Comunes

### Error 500 en la consola del navegador

El error 500 genérico ya no debería aparecer. Las funciones están configuradas para devolver mensajes descriptivos en el chat en lugar de errores HTTP.

### Tabla de errores específicos

| Error | Causa | Solución |
|-------|-------|----------|
| `❌ Error: Gemini no respondió.` | Ningún modelo de Gemini funcionó | Verificar GEMINI_API_KEY con `secrets list`. Consultar modelos disponibles. |
| `❌ Error: OpenRouter no respondió.` | Ningún modelo de OpenRouter funcionó | Verificar OPENROUTER_API_KEY. Los modelos gratuitos pueden estar temporalmente caídos. |
| `❌ Error: Falta GEMINI_API_KEY.` | La key no está en los secretos | `npx supabase secrets set GEMINI_API_KEY=...` |
| `❌ Error: Falta OPENROUTER_API_KEY.` | La key no está en los secretos | `npx supabase secrets set OPENROUTER_API_KEY=...` |
| `API key not valid` | La key es incorrecta o fue revocada | Generar nueva key en AI Studio |
| `quota exceeded` | Cuota diaria agotada | Cambiar a OpenRouter o esperar al reinicio |

### Comando de diagnóstico rápido

```powershell
# Probar Gemini directamente
$key = "TU_GEMINI_API_KEY"
try {
  $r = Invoke-WebRequest -Method POST `
    -Uri "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$key" `
    -ContentType "application/json" `
    -Body '{"contents":[{"parts":[{"text":"di hola"}]}]}'
  $r.Content
} catch {
  $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
  $reader.ReadToEnd()
}
```

---

## 13. Mantenimiento y Actualización de Modelos

Google y OpenRouter retiran modelos periódicamente sin aviso prolongado. Para prevenir interrupciones:

### Verificación periódica (una vez al mes)

1. Listar los modelos disponibles con los comandos de la sección 8.
2. Verificar que los modelos usados en las funciones siguen en la lista.
3. Si alguno fue retirado, actualizar la lista de fallback en las funciones.

### Procedimiento de actualización de modelos

1. Consultar modelos disponibles (sección 8).
2. Editar los 3 archivos de función:
   - `supabase/functions/teacher-chat/index.ts`
   - `supabase/functions/tutor-chat/index.ts`
   - `supabase/functions/generate-lessons/index.ts`

3. En cada archivo, actualizar los arrays de modelos:

   **Para Gemini:**
   ```typescript
   const geminiModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];
   ```

   **Para OpenRouter:**
   ```typescript
   const models = ['google/gemma-4-26b-a4b-it:free', 'google/gemma-4-31b-it:free', 'nvidia/nemotron-3-super-120b-a12b:free'];
   ```

4. Desplegar:
   ```powershell
   npx supabase functions deploy teacher-chat tutor-chat generate-lessons --no-verify-jwt
   ```

5. Hacer commit:
   ```powershell
   git add supabase/functions/
   git commit -m "actualizar modelos de IA"
   git push
   ```

---

## Variables de Entorno (.env)

```env
# Supabase
VITE_SUPABASE_URL=https://gjrcxmvgheeakhxoeiho.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Google Gemini
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# OpenRouter (Gratuito)
OPENROUTER_API_KEY=sk-or-v1-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Recordatorio:** Estas variables son solo para referencia local. Para que funcionen en producción, deben estar configuradas en los **Secrets de Supabase** (ver sección 5).

---

## Checklist de Configuración Completa

Usar esta lista cuando se configure el proyecto desde cero o se migre a un nuevo entorno:

### Google Gemini
- [ ] Cuenta de Google con acceso a Google AI Studio
- [ ] API Key generada en https://aistudio.google.com/app/apikey
- [ ] API Key guardada en el archivo `.env` local (referencia)
- [ ] API Key configurada en Supabase: `npx supabase secrets set GEMINI_API_KEY=...`

### OpenRouter
- [ ] Cuenta creada en https://openrouter.ai
- [ ] API Key generada en https://openrouter.ai/keys
- [ ] API Key guardada en el archivo `.env` local (referencia)
- [ ] API Key configurada en Supabase: `npx supabase secrets set OPENROUTER_API_KEY=...`

### Despliegue
- [ ] Verificar con `npx supabase secrets list` que aparecen ambas keys
- [ ] Modelos actuales verificados contra la lista de modelos disponibles
- [ ] Funciones desplegadas: `npx supabase functions deploy teacher-chat tutor-chat generate-lessons --no-verify-jwt`
- [ ] Funciones activas: `npx supabase functions list` muestra estado `ACTIVE`
- [ ] Prueba directa exitosa desde terminal (ver sección 7)
- [ ] Prueba desde el navegador: el chat responde con ambos proveedores
