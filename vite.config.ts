import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
  plugins: [
    react({
      babel: {
        plugins: [["module:@preact/signals-react-transform"]],
      },
    }),
    tailwindcss(),
    svgr(),
  ],
  define: {
    "process.env.VITE_SUPABASE_URL": JSON.stringify(
      process.env.VITE_SUPABASE_URL,
    ),
    "process.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
      process.env.VITE_SUPABASE_ANON_KEY,
    ),
  },
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // optimizeDeps: {
  //   esbuildOptions: {
  //     plugins: [fixReactVirtualized],
  //   },
  // },
  // envPrefix: ['VITE_', 'TAURI_ENV_*'],
  // build: {
  // Tauri uses Chromium on Windows and WebKit on macOS and Linux
  // target: process.env.TAURI_ENV_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
  // don't minify for debug builds
  // minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
  // produce sourcemaps for debug builds
  // sourcemap: !!process.env.TAURI_ENV_DEBUG,
  // },
}));
