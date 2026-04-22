import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('phosphor-svelte') || id.includes('lucide-svelte')) {
            return 'vendor-icons';
          }
          if (id.includes('firebase')) {
            return 'vendor-firebase';
          }
        }
      }
    }
  },
  ssr: {
    noExternal: ['@firebase/util'],
    external: ['firebase-admin']
  },
  server: {
    port: 5173,
  },
});

