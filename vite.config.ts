import { defineConfig, loadEnv } from "vite";
import process from "node:process";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";
// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  //SSL certifcate

  const target = env.VITE_API_URL || "https://localhost:7138/api";
  return defineConfig({
    server: {
      proxy: {
        "/api": {
          target: target,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    plugins: [react(), tailwindcss(), mkcert()],
    css: {
      postcss: {},
    },
  });
});
