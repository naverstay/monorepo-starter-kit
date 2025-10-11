import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import dotenv from "dotenv";
import detect from "detect-port";

dotenv.config({ path: path.resolve(__dirname, "../api/.env") });

const DEFAULT_PORT = 8080;

export default defineConfig(async () => {
  const resolvedPort = await detect(DEFAULT_PORT);
  const apiUrl = process.env.BETTER_AUTH_URL || "http://localhost";

  console.log("resolvedPort", resolvedPort);

  return {
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        generatedRouteTree: "./src/modules/shared/providers/routeTree.gen.ts",
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: [
        { find: "@", replacement: path.resolve(__dirname, "src") },
        { find: "@modules", replacement: path.resolve(__dirname, "src/modules") },
      ],
    },
    server: {
      port: resolvedPort,
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
