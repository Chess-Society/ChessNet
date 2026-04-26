import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extension: '.md'
    })
  ],
  kit: {
    adapter: adapter({
      edge: false, // Use standard functions for better compatibility with Firebase
      split: false
    }),
    paths: {
      relative: false
    }
  }
};

export default config;
