import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Ideagen/',
  envPrefix: 'VITE_',   // ensures VITE_SUPABASE_* vars are exposed to the client
  server: {
    port: 5173,
    open: true,
  },
})
