import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: path.resolve(__dirname, "server/vercel-handler.ts"),
      name: "api",
      fileName: "handler",
      formats: ["es"],
    },
    outDir: "dist/api",
    emptyOutDir: true,
    target: "node22",
    ssr: true,
    rollupOptions: {
      external: [
        "fs",
        "path",
        "url",
        "http",
        "https",
        "os",
        "crypto",
        "stream",
        "util",
        "events",
        "buffer",
        "querystring",
        "child_process",
        "node:http",
        "express",
        "cors",
        "dotenv",
        "dotenv/config",
        "@supabase/supabase-js",
        "zod",
      ],
      output: {
        format: "es",
        entryFileNames: "handler.mjs",
      },
    },
    minify: false,
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
