import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      server: { entry: "server.js" },
      start: { entry: "start.js" },
      router: { entry: "router.jsx" },
    }),
    nitro({ preset: process.env.VERCEL ? "vercel" : "node-server" }),
    viteReact(),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    port: 5173,
  }
});
