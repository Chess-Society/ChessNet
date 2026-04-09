<script lang="ts">
  import Toast from '$lib/components/Toast.svelte';
  import CookieBanner from '$lib/components/CookieBanner.svelte';
  import KofiWidget from '$lib/components/KofiWidget.svelte';
  import '../app.css';

  let { children } = $props();

  // Auth store disabled - using server-side authentication only
  // This prevents conflicts between server and client auth validation
  console.log('🔄 Layout mounted - Auth store DISABLED, using server-side auth only');
</script>

<main class="min-h-screen bg-slate-900 text-slate-100">
  {@render children()}
  <Toast />
  <CookieBanner />
  <KofiWidget />
</main>
