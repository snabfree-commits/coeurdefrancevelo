import { createClient } from '@supabase/supabase-js';

// Fallback values provided previously to ensure app works even if env vars fail
const FALLBACK_URL = 'https://kvbvceinxbesfilvuopr.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2YnZjZWlueGJlc2ZpbHZ1b3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTgyMzQsImV4cCI6MjA4MTUzNDIzNH0.K-7NLeXyJeBrJ4AHvrNGC5Uo6UVUjENc2pf0oS1LdNw';

// Try process.env (injected by Vite config), then fallback
// Note: import.meta.env is removed to fix TS errors with ImportMeta type
const supabaseUrl = process.env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY;

if (!supabaseUrl) {
  console.error('Supabase URL is missing');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);