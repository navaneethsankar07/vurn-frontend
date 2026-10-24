import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import fs from "node:fs";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    host: true,
    port: 5173,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "certs/lvh.me-key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "certs/lvh.me.pem")),
    },
    hmr: {
      host: "starlight-ventures.lvh.me",
      protocol: "wss",
      clientPort: 5173,
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: false,
      },
    },
  },
});
