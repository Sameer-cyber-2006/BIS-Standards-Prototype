import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// SIH26107 prototype frontend - talks to the Spring Boot backend on :8080
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
