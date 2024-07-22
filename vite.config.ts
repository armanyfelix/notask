import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import svgr from 'vite-plugin-svgr'
// import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react({
    babel: {
      plugins: [['module:@preact/signals-react-transform']],
    },
  }), svgr()],
  define: {
    'process.env': process.env,
  },
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 4321,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))

// function emptySourcemapFix() {
//   let currentInterval = null
//   return {
//     name: 'fix-source-map',
//     enforce: 'post',
//     transform: function (source) {
//       if (currentInterval) {
//         return
//       }
//       currentInterval = setInterval(function () {
//         const nodeModulesPath = path.join(
//           __dirname,
//           'node_modules',
//           '.vite',
//           'deps',
//         )
//         if (fs.existsSync(nodeModulesPath)) {
//           clearInterval(currentInterval)
//           currentInterval = null
//           const files = fs.readdirSync(nodeModulesPath)
//           files.forEach(function (file) {
//             const mapFile = file + '.map'
//             const mapPath = path.join(nodeModulesPath, mapFile)
//             if (fs.existsSync(mapPath)) {
//               const mapData = JSON.parse(fs.readFileSync(mapPath, 'utf8'))
//               if (!mapData.sources || mapData.sources.length == 0) {
//                 mapData.sources = [
//                   path.relative(mapPath, path.join(nodeModulesPath, file)),
//                 ]
//                 fs.writeFileSync(mapPath, JSON.stringify(mapData), 'utf8')
//               }
//             }
//           })
//         }
//       }, 100)
//       return source
//     },
//   }
// }

