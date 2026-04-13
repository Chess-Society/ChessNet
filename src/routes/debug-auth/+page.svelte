<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let debugInfo: any = {};
  let cookies: any[] = [];
  let sessionInfo: any = {};

  onMount(async () => {
    // Obtener información de debug del servidor
    try {
      const response = await fetch('/api/debug-auth');
      if (response.ok) {
        debugInfo = await response.json();
      }
    } catch (error) {
      console.error('Error fetching debug info:', error);
    }

    // Obtener cookies del cliente
    cookies = document.cookie.split(';').map(cookie => {
      const [name, value] = cookie.trim().split('=');
      return { name, value: value || 'EMPTY' };
    });

    // Obtener información de la sesión
    sessionInfo = {
      pathname: $page.url.pathname,
      search: $page.url.search,
      hash: $page.url.hash,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
  });

  function goToLogin() {
    goto('/login');
  }

  function goToDashboard() {
    goto('/panel');
  }

  function clearCookies() {
    // Limpiar cookies de Supabase
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    location.reload();
  }
</script>

<svelte:head>
  <title>Debug Auth - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-slate-900 text-white p-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">🔍 Debug de Autenticación</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Información del Servidor -->
      <div class="bg-slate-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">📊 Información del Servidor</h2>
        <pre class="text-sm bg-slate-900 p-4 rounded overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
      </div>

      <!-- Cookies del Cliente -->
      <div class="bg-slate-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">🍪 Cookies del Cliente</h2>
        <div class="space-y-2">
          {#each cookies as cookie}
            <div class="text-sm bg-slate-900 p-2 rounded">
              <strong>{cookie.name}:</strong> {cookie.value}
            </div>
          {/each}
        </div>
      </div>

      <!-- Información de la Sesión -->
      <div class="bg-slate-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">🌐 Información de la Sesión</h2>
        <pre class="text-sm bg-slate-900 p-4 rounded overflow-auto">{JSON.stringify(sessionInfo, null, 2)}</pre>
      </div>

      <!-- Acciones -->
      <div class="bg-slate-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">⚡ Acciones</h2>
        <div class="space-y-3">
          <button on:click={goToLogin} class="w-full btn-primary">
            Ir a Login
          </button>
          <button on:click={goToDashboard} class="w-full btn-secondary">
            Ir a Dashboard
          </button>
          <button on:click={clearCookies} class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            Limpiar Cookies
          </button>
          <button on:click={() => location.reload()} class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Recargar Página
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
