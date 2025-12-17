import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    server: {
      host: true
    },
    define: {
      // Expose env variables to the client via process.env
      // We use (val || '') to ensure we don't inject 'undefined' which causes issues
      'process.env': {
        API_KEY: JSON.stringify(env.API_KEY || ''),
        VITE_SUPABASE_URL: JSON.stringify(env.VITE_SUPABASE_URL || ''),
        VITE_SUPABASE_ANON_KEY: JSON.stringify(env.VITE_SUPABASE_ANON_KEY || '')
      }
    }
  };
})