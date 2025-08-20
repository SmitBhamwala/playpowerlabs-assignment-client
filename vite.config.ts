import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ["pdfjs-dist/build/pdf.worker.min.mjs"]
  },
  resolve: {
    alias: {
      components: "/src/components",
      utils: "/src/lib/utils",
      ui: "/src/components/ui",
      lib: "/src/lib",
      hooks: "/src/hooks"
    }
  }
});
