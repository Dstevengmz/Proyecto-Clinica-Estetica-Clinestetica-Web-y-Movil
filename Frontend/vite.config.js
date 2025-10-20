// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  //agregue esto 
  optimizeDeps: {
    include: [
      '@coreui/react',
      '@coreui/icons-react',
      'sweetalert2',
      'react-phone-input-2',
    ],
  },
  //hasta aqui
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
   server: {
    host: '0.0.0.0', 
    port: 5173,       
    open: true,
    // Esto permitirá acceder tanto desde localhost como desde la IP
    hmr: {
      host: 'localhost'
    }
  }
})
