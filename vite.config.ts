import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
import glsl from "vite-plugin-glsl";
import cesium from "vite-plugin-cesium";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    // runtimeErrorOverlay(), // Temporarily disabled to check WebSocket issue
    glsl(), // Add GLSL shader support
    cesium(), // Add Cesium plugin for proper asset handling
  ],
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium')
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  // Disable HMR to avoid WebSocket issues
  server: {
    hmr: false,
    fs: {
      allow: ['..']
    }
  },
  optimizeDeps: {
    include: ['cesium']
  },
  // Add support for large models and audio files
  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.mp3", "**/*.ogg", "**/*.wav"],
});
