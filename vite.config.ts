import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotEnv from 'dotenv'
dotEnv.config()
// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [react()],
})
