import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemap({
      hostname: 'https://veltroncapital.com',
      dynamicRoutes: ['/', '/comprar', '/estado', '/solicitar', '/terminos', '/privacidad', '/reembolso'],
      exclude: ['/admin', '/admin/login', '/descarga']
    })
  ],
})
