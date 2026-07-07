import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      three: path.resolve(__dirname, "node_modules/three"),
      "@react-three/fiber": path.resolve(__dirname, "node_modules/@react-three/fiber"),
      "@react-three/drei": path.resolve(__dirname, "node_modules/@react-three/drei"),
    },
    dedupe: ["react", "react-dom", "three", "@react-three/fiber", "@react-three/drei"],
  }
});
