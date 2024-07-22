// vite.config.ts
import { defineConfig } from "file:///C:/Users/Luis/proyects/notask/node_modules/vite/dist/node/index.js";
import path from "path";
import preact from "file:///C:/Users/Luis/proyects/notask/node_modules/@preact/preset-vite/dist/esm/index.mjs";
import svgr from "file:///C:/Users/Luis/proyects/notask/node_modules/vite-plugin-svgr/dist/index.js";
import fs from "fs";
var __vite_injected_original_dirname = "C:\\Users\\Luis\\proyects\\notask";
var vite_config_default = defineConfig(({ command }) => {
  const config = {
    plugins: [preact(), svgr()],
    define: {
      "process.env": process.env
    },
    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
      port: 1420,
      strictPort: true
    },
    // 3. to make use of `TAURI_DEBUG` and other env variables
    // https://tauri.app/v1/api/config#buildconfig.beforedevcommand
    envPrefix: ["VITE_", "TAURI_"],
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src"),
        react: "preact/compat",
        "react-dom": "preact/compat"
      }
    }
  };
  if (command === "serve") {
    config.plugins.push(emptySourcemapFix());
  }
  return config;
});
function emptySourcemapFix() {
  let currentInterval = null;
  return {
    name: "fix-source-map",
    enforce: "post",
    transform: function(source) {
      if (currentInterval) {
        return;
      }
      currentInterval = setInterval(function() {
        const nodeModulesPath = path.join(
          __vite_injected_original_dirname,
          "node_modules",
          ".vite",
          "deps"
        );
        if (fs.existsSync(nodeModulesPath)) {
          clearInterval(currentInterval);
          currentInterval = null;
          const files = fs.readdirSync(nodeModulesPath);
          files.forEach(function(file) {
            const mapFile = file + ".map";
            const mapPath = path.join(nodeModulesPath, mapFile);
            if (fs.existsSync(mapPath)) {
              const mapData = JSON.parse(fs.readFileSync(mapPath, "utf8"));
              if (!mapData.sources || mapData.sources.length == 0) {
                mapData.sources = [
                  path.relative(mapPath, path.join(nodeModulesPath, file))
                ];
                fs.writeFileSync(mapPath, JSON.stringify(mapData), "utf8");
              }
            }
          });
        }
      }, 100);
      return source;
    }
  };
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMdWlzXFxcXHByb3llY3RzXFxcXG5vdGFza1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcTHVpc1xcXFxwcm95ZWN0c1xcXFxub3Rhc2tcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0x1aXMvcHJveWVjdHMvbm90YXNrL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgUGx1Z2luLCBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgcHJlYWN0IGZyb20gJ0BwcmVhY3QvcHJlc2V0LXZpdGUnXHJcbmltcG9ydCBzdmdyIGZyb20gJ3ZpdGUtcGx1Z2luLXN2Z3InXHJcbmltcG9ydCBmcyBmcm9tICdmcydcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kIH0pID0+IHtcclxuICBjb25zdCBjb25maWcgPSB7XHJcbiAgICBwbHVnaW5zOiBbcHJlYWN0KCksIHN2Z3IoKV0sXHJcbiAgICBkZWZpbmU6IHtcclxuICAgICAgJ3Byb2Nlc3MuZW52JzogcHJvY2Vzcy5lbnYsXHJcbiAgICB9LFxyXG4gICAgLy8gVml0ZSBvcHRpb25zIHRhaWxvcmVkIGZvciBUYXVyaSBkZXZlbG9wbWVudCBhbmQgb25seSBhcHBsaWVkIGluIGB0YXVyaSBkZXZgIG9yIGB0YXVyaSBidWlsZGBcclxuICAgIC8vIDEuIHByZXZlbnQgdml0ZSBmcm9tIG9ic2N1cmluZyBydXN0IGVycm9yc1xyXG4gICAgY2xlYXJTY3JlZW46IGZhbHNlLFxyXG4gICAgLy8gMi4gdGF1cmkgZXhwZWN0cyBhIGZpeGVkIHBvcnQsIGZhaWwgaWYgdGhhdCBwb3J0IGlzIG5vdCBhdmFpbGFibGVcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBwb3J0OiAxNDIwLFxyXG4gICAgICBzdHJpY3RQb3J0OiB0cnVlLFxyXG4gICAgfSxcclxuICAgIC8vIDMuIHRvIG1ha2UgdXNlIG9mIGBUQVVSSV9ERUJVR2AgYW5kIG90aGVyIGVudiB2YXJpYWJsZXNcclxuICAgIC8vIGh0dHBzOi8vdGF1cmkuYXBwL3YxL2FwaS9jb25maWcjYnVpbGRjb25maWcuYmVmb3JlZGV2Y29tbWFuZFxyXG4gICAgZW52UHJlZml4OiBbJ1ZJVEVfJywgJ1RBVVJJXyddLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXHJcbiAgICAgICAgcmVhY3Q6ICdwcmVhY3QvY29tcGF0JyxcclxuICAgICAgICAncmVhY3QtZG9tJzogJ3ByZWFjdC9jb21wYXQnLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9XHJcbiAgaWYgKGNvbW1hbmQgPT09ICdzZXJ2ZScpIHtcclxuICAgIC8vIGRldmVsb3BtZW50XHJcbiAgICBjb25maWcucGx1Z2lucy5wdXNoKGVtcHR5U291cmNlbWFwRml4KCkgYXMgUGx1Z2luKVxyXG4gIH1cclxuICByZXR1cm4gY29uZmlnXHJcbn0pXHJcblxyXG5mdW5jdGlvbiBlbXB0eVNvdXJjZW1hcEZpeCgpIHtcclxuICBsZXQgY3VycmVudEludGVydmFsID0gbnVsbFxyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiAnZml4LXNvdXJjZS1tYXAnLFxyXG4gICAgZW5mb3JjZTogJ3Bvc3QnLFxyXG4gICAgdHJhbnNmb3JtOiBmdW5jdGlvbiAoc291cmNlKSB7XHJcbiAgICAgIGlmIChjdXJyZW50SW50ZXJ2YWwpIHtcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG4gICAgICBjdXJyZW50SW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3Qgbm9kZU1vZHVsZXNQYXRoID0gcGF0aC5qb2luKFxyXG4gICAgICAgICAgX19kaXJuYW1lLFxyXG4gICAgICAgICAgJ25vZGVfbW9kdWxlcycsXHJcbiAgICAgICAgICAnLnZpdGUnLFxyXG4gICAgICAgICAgJ2RlcHMnLFxyXG4gICAgICAgIClcclxuICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhub2RlTW9kdWxlc1BhdGgpKSB7XHJcbiAgICAgICAgICBjbGVhckludGVydmFsKGN1cnJlbnRJbnRlcnZhbClcclxuICAgICAgICAgIGN1cnJlbnRJbnRlcnZhbCA9IG51bGxcclxuICAgICAgICAgIGNvbnN0IGZpbGVzID0gZnMucmVhZGRpclN5bmMobm9kZU1vZHVsZXNQYXRoKVxyXG4gICAgICAgICAgZmlsZXMuZm9yRWFjaChmdW5jdGlvbiAoZmlsZSkge1xyXG4gICAgICAgICAgICBjb25zdCBtYXBGaWxlID0gZmlsZSArICcubWFwJ1xyXG4gICAgICAgICAgICBjb25zdCBtYXBQYXRoID0gcGF0aC5qb2luKG5vZGVNb2R1bGVzUGF0aCwgbWFwRmlsZSlcclxuICAgICAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmMobWFwUGF0aCkpIHtcclxuICAgICAgICAgICAgICBjb25zdCBtYXBEYXRhID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMobWFwUGF0aCwgJ3V0ZjgnKSlcclxuICAgICAgICAgICAgICBpZiAoIW1hcERhdGEuc291cmNlcyB8fCBtYXBEYXRhLnNvdXJjZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIG1hcERhdGEuc291cmNlcyA9IFtcclxuICAgICAgICAgICAgICAgICAgcGF0aC5yZWxhdGl2ZShtYXBQYXRoLCBwYXRoLmpvaW4obm9kZU1vZHVsZXNQYXRoLCBmaWxlKSksXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKG1hcFBhdGgsIEpTT04uc3RyaW5naWZ5KG1hcERhdGEpLCAndXRmOCcpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSwgMTAwKVxyXG4gICAgICByZXR1cm4gc291cmNlXHJcbiAgICB9LFxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1SLFNBQWlCLG9CQUFvQjtBQUN4VCxPQUFPLFVBQVU7QUFDakIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sVUFBVTtBQUNqQixPQUFPLFFBQVE7QUFKZixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFFBQVEsTUFBTTtBQUMzQyxRQUFNLFNBQVM7QUFBQSxJQUNiLFNBQVMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQUEsSUFDMUIsUUFBUTtBQUFBLE1BQ04sZUFBZSxRQUFRO0FBQUEsSUFDekI7QUFBQTtBQUFBO0FBQUEsSUFHQSxhQUFhO0FBQUE7QUFBQSxJQUViLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLFlBQVk7QUFBQSxJQUNkO0FBQUE7QUFBQTtBQUFBLElBR0EsV0FBVyxDQUFDLFNBQVMsUUFBUTtBQUFBLElBQzdCLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxRQUNwQyxPQUFPO0FBQUEsUUFDUCxhQUFhO0FBQUEsTUFDZjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0EsTUFBSSxZQUFZLFNBQVM7QUFFdkIsV0FBTyxRQUFRLEtBQUssa0JBQWtCLENBQVc7QUFBQSxFQUNuRDtBQUNBLFNBQU87QUFDVCxDQUFDO0FBRUQsU0FBUyxvQkFBb0I7QUFDM0IsTUFBSSxrQkFBa0I7QUFDdEIsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sU0FBUztBQUFBLElBQ1QsV0FBVyxTQUFVLFFBQVE7QUFDM0IsVUFBSSxpQkFBaUI7QUFDbkI7QUFBQSxNQUNGO0FBQ0Esd0JBQWtCLFlBQVksV0FBWTtBQUN4QyxjQUFNLGtCQUFrQixLQUFLO0FBQUEsVUFDM0I7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxRQUNGO0FBQ0EsWUFBSSxHQUFHLFdBQVcsZUFBZSxHQUFHO0FBQ2xDLHdCQUFjLGVBQWU7QUFDN0IsNEJBQWtCO0FBQ2xCLGdCQUFNLFFBQVEsR0FBRyxZQUFZLGVBQWU7QUFDNUMsZ0JBQU0sUUFBUSxTQUFVLE1BQU07QUFDNUIsa0JBQU0sVUFBVSxPQUFPO0FBQ3ZCLGtCQUFNLFVBQVUsS0FBSyxLQUFLLGlCQUFpQixPQUFPO0FBQ2xELGdCQUFJLEdBQUcsV0FBVyxPQUFPLEdBQUc7QUFDMUIsb0JBQU0sVUFBVSxLQUFLLE1BQU0sR0FBRyxhQUFhLFNBQVMsTUFBTSxDQUFDO0FBQzNELGtCQUFJLENBQUMsUUFBUSxXQUFXLFFBQVEsUUFBUSxVQUFVLEdBQUc7QUFDbkQsd0JBQVEsVUFBVTtBQUFBLGtCQUNoQixLQUFLLFNBQVMsU0FBUyxLQUFLLEtBQUssaUJBQWlCLElBQUksQ0FBQztBQUFBLGdCQUN6RDtBQUNBLG1CQUFHLGNBQWMsU0FBUyxLQUFLLFVBQVUsT0FBTyxHQUFHLE1BQU07QUFBQSxjQUMzRDtBQUFBLFlBQ0Y7QUFBQSxVQUNGLENBQUM7QUFBQSxRQUNIO0FBQUEsTUFDRixHQUFHLEdBQUc7QUFDTixhQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0Y7QUFDRjsiLAogICJuYW1lcyI6IFtdCn0K
