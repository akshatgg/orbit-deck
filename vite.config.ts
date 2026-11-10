import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // allow tunnelled access (ngrok) for remote previews
  server: { allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app', '.ngrok.io'] },
  preview: { allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app', '.ngrok.io'] },
})
