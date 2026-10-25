import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const keyPath = path.join(rootDir, "certs/lvh.me-key.pem");
const certPath = path.join(rootDir, "certs/lvh.me.pem");

const hasCertificates = fs.existsSync(keyPath) && fs.existsSync(certPath);

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    https: hasCertificates
      ? {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath),
        }
      : undefined,
    hmr: hasCertificates
      ? {
          host: "starlight-ventures.lvh.me",
          protocol: "wss",
          clientPort: 5173,
        }
      : undefined,
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET || "http://127.0.0.1:8000",
        changeOrigin: false,
      },
    },
  },
});
