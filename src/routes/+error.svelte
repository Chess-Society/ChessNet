<script lang="ts">
  import { page } from '$app/stores';
  import { Home, RefreshCw, AlertTriangle } from 'lucide-svelte';
  
  $: status = $page.status;
  $: message = $page.error?.message || 'Ha ocurrido un error inesperado';
  $: isConfigError = message.includes('Missing Supabase environment variables');
</script>

<svelte:head>
  <title>Error {status} - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
  <div class="max-w-md w-full text-center">
    <div class="bg-slate-800 rounded-2xl p-8 shadow-2xl">
      <div class="text-6xl font-bold text-red-500 mb-4">
        {status}
      </div>
      
      <h1 class="text-2xl font-bold text-white mb-4">
        {status === 404 ? 'Página no encontrada' : isConfigError ? 'Error de configuración' : 'Error del servidor'}
      </h1>
      
      <p class="text-slate-300 mb-8">
        {isConfigError 
          ? 'Las variables de entorno de Supabase no están configuradas correctamente. Por favor, contacta al administrador.'
          : message}
      </p>
      
      {#if isConfigError}
        <div class="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-2 text-yellow-400 mb-2">
            <AlertTriangle class="w-4 h-4" />
            <span class="font-medium">Error de configuración</span>
          </div>
          <p class="text-sm text-yellow-200">
            El sitio necesita las variables de entorno de Supabase para funcionar correctamente.
          </p>
        </div>
      {/if}
      
      <div class="space-y-4">
        <button
          on:click={() => window.location.reload()}
          class="w-full btn-primary flex items-center justify-center gap-2"
        >
          <RefreshCw class="w-4 h-4" />
          Recargar página
        </button>
        
        <button
          on:click={() => window.location.href = '/'}
          class="w-full btn-secondary flex items-center justify-center gap-2"
        >
          <Home class="w-4 h-4" />
          Ir al inicio
        </button>
      </div>
    </div>
  </div>
</div>
