import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
  console.error("🚨 DIAGNOSIS: La URL de Supabase no está configurada. Verifica las variables de entorno en Vercel (VITE_SUPABASE_URL).")
} else {
  console.log("✅ Supabase URL cargada correctamente.")
}

if (!supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
  console.error("🚨 DIAGNOSIS: La Anon Key de Supabase no está configurada. Verifica las variables de entorno en Vercel (VITE_SUPABASE_ANON_KEY).")
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key')
