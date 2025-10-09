/* NODE */
import path from "path";

/* VITE */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../api/.env") });
const apiUrl = process.env.BETTER_AUTH_URL || "http://localhost:8080";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
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
      { find: "~", replacement: path.resolve(__dirname, "src") },
      { find: "@", replacement: path.resolve(__dirname, "src/modules") },
    ],
  },
  server: {
    proxy: {
      "/api": {
        target: apiUrl,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
