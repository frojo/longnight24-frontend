import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://github.com/vitejs/vite/discussions/6282
// because jsonwebtoken uses Buffer
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl(), nodePolyfills()],
});
