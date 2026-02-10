
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

console.log('✅ Supabase Config Check:', { 
  url: supabaseUrl, 
  keyLength: supabaseKey ? supabaseKey.length : 0 
});

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseKey)
