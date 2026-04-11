import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
  console.error("DIAGNOSIS: VITE_SUPABASE_URL is MISSING or INVALID.")
}
if (!supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
  console.error("DIAGNOSIS: VITE_SUPABASE_ANON_KEY is MISSING or INVALID.")
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key')
