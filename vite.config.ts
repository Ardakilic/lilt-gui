import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: "0.0.0.0", // Listen on all network interfaces (required for Docker)
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
});
