import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/idea-craft/",
  plugins: [react()].filter(Boolean),
  server: {
    port: 8080,
    host: "::",
    allowedHosts: [
      // Allow all hosts with a subdomain ending with lovableproject.com
      "fef6ecf6-ba69-4bce-9ac5-d13267729f85.lovableproject.com",
      "*.lovableproject.com",
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
