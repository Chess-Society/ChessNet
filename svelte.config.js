import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      edge: false, // Usa Netlify Functions estándar
      split: false // Agrupa APIs para evitar cold-starts multiples
    })
  }
};

export default config;
