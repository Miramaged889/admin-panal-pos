import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://pos-backend-mujwh.ondigitalocean.app",
        changeOrigin: true,
        secure: true,
      },
      "/ten": {
        target: "https://pos-backend-mujwh.ondigitalocean.app",
        changeOrigin: true,
        secure: true,
      },
      "/tenuser": {
        target: "https://pos-backend-mujwh.ondigitalocean.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
