import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      usePolling: true,   // 🔥 FIX UTAMA
      interval: 100       // (opsional biar lebih responsif)
    },
     hmr: {
    overlay: true
  }
  }
})