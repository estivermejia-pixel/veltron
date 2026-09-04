import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './env';

export const isSupabaseConfigured = Boolean(
  SUPABASE_CONFIG.url &&
  SUPABASE_CONFIG.anonKey &&
  (SUPABASE_CONFIG.url.startsWith('http://') || SUPABASE_CONFIG.url.startsWith('https://')) &&
  !SUPABASE_CONFIG.url.includes('YOUR_SUPABASE')
);

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase no está configurado totalmente en .env. Se usará el modo demostración local.');
}

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey)
  : null;
