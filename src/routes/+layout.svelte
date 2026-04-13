<script lang="ts">
  import Toast from '$lib/components/Toast.svelte';
  import CookieBanner from '$lib/components/CookieBanner.svelte';
  import KofiWidget from '$lib/components/KofiWidget.svelte';
  import '../app.css';

  import { onMount } from 'svelte';
  import { initAuth } from '$lib/stores/auth';

  let { children } = $props();

  onMount(() => {
    const unsubscribe = initAuth();
    return unsubscribe;
  });
</script>

<main class="min-h-screen bg-slate-900 text-slate-100">
  {@render children()}
  <Toast />
  <CookieBanner />
  <KofiWidget />
</main>
