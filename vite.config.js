import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),
//     tailwindcss(),
//   ],
// })
// import { defineConfig } from "vite"
// import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://api.frontendexpert.io",
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api/, "")
      }
    }
  }
})

// https://api.frontendexpert.io/api/fe/wordle-words
