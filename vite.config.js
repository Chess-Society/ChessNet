import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    noExternal: ['@firebase/util'],
    external: ['firebase-admin']
  },
  server: {
    port: 5173,
  },
});

