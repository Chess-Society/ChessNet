<script lang="ts">
  import { page } from '$app/stores';
  import { Home, RefreshCw, AlertTriangle, Sparkles } from 'lucide-svelte';
  import Logo from '$lib/components/Logo.svelte';
  
  $: status = $page.status;
  $: message = $page.error?.message || 'Ha ocurrido un error inesperado';
  $: isConfigError = message.includes('Missing Supabase environment variables');
</script>

<svelte:head>
  <title>Error {status} - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-bento-bg flex items-center justify-center p-6 font-sans selection:bg-primary-500/30 overflow-hidden">
  
  <!-- Background Effects -->
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div class="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[100px] animate-pulse"></div>
    <div class="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-primary-500/5 rounded-full blur-[120px]"></div>
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150"></div>
  </div>

  <div class="relative z-10 max-w-lg w-full text-center">
    <div class="mb-12 flex justify-center">
      <a href="/" class="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group">
        <div class="relative">
          <div class="absolute -inset-2 bg-primary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <Logo size="w-12 h-12" iconSize="w-7 h-7" />
        </div>
        <span class="text-3xl font-display font-black tracking-tighter text-white">ChessNet</span>
      </a>
    </div>

    <div class="bento-card border-white/10 bg-white/[0.02] p-10 md:p-14 shadow-2xl relative overflow-hidden">
      <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-30"></div>
      
      <div class="relative">
        <div class="text-[120px] md:text-[160px] font-display font-black leading-none text-white/5 absolute -top-10 left-1/2 -translate-x-1/2 select-none">
          {status}
        </div>
        
        <div class="relative z-10">
          <div class="flex justify-center mb-6">
            <div class="p-4 rounded-3xl bg-red-500/10 text-red-500 border border-red-500/20">
              <AlertTriangle class="w-10 h-10" />
            </div>
          </div>
          
          <h1 class="text-3xl font-display font-black text-white mb-4 tracking-tight">
            {status === 404 ? 'Jaque Mate Inesperado' : 'Error en el Tablero'}
          </h1>
          
          <p class="text-surface-400 font-medium leading-relaxed mb-10">
            {status === 404 
              ? 'La página que buscas ha sido capturada o nunca existió en este tablero.' 
              : message}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              on:click={() => window.location.reload()}
              class="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all group"
            >
              <RefreshCw class="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Reintentar
            </button>
            
            <a
              href="/"
              class="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-primary-500 text-white font-bold hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/20 group"
            >
              <Home class="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              Volver al Inicio
            </a>
          </div>
        </div>
      </div>
    </div>

    <p class="mt-12 text-surface-500 text-xs font-bold uppercase tracking-[0.2em]">
      Código de Error: {status} • ChessNet Cloud
    </p>
  </div>
</div>
