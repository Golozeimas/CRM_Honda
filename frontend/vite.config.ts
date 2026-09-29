import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, searchForWorkspaceRoot } from 'vite'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  server: {
    fs: {
      // Share only the pure validator with Functions; do not expose backend secrets.
      allow: [searchForWorkspaceRoot(process.cwd()), fileURLToPath(new URL('../backend/src/domain/email.ts', import.meta.url))],
    },
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
})
