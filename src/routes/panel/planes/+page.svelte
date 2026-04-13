<script lang="ts">
  import { CreditCard, Check, Zap, Trophy, Shield, Info, AlertTriangle } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';
  import { appStore } from '$lib/stores/appStore';
  import { page } from '$app/stores';
  
  let isPremium = $derived($appStore.settings.plan === 'premium');
  let reason = $derived($page.url.searchParams.get('reason'));
  
  const handleUpgrade = () => {
    // Aquí iría el checkout de Stripe
    alert('Redirigiendo a Stripe Checkout...');
  };
</script>

<svelte:head>
  <title>Planes y Suscripción - ChessNet</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 py-12" transition:fade>
  
  {#if reason === 'premium_required'}
    <div class="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-4 text-amber-400" in:fly={{ y: -20 }}>
        <AlertTriangle class="w-6 h-6 shrink-0" />
        <div>
            <p class="font-bold">Función Premium</p>
            <p class="text-xs">Has intentado acceder a una función excluiva para suscriptores. Mejora tu plan para desbloquearla.</p>
        </div>
    </div>
  {:else if reason === 'limit_reached'}
    <div class="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-4 text-red-400" in:fly={{ y: -20 }}>
        <AlertTriangle class="w-6 h-6 shrink-0" />
        <div>
            <p class="font-bold">Límite de Alumnos Alcanzado</p>
            <p class="text-xs">Has alcanzado el límite de 12 alumnos en tu plan gratuito. Pásate a Premium para gestionar alumnos ilimitados.</p>
        </div>
    </div>
  {/if}
  <div class="text-center mb-16">
    <h1 class="text-4xl font-extrabold text-white mb-4 tracking-tight">Potencia tu Academia</h1>
    <p class="text-slate-400 text-lg max-w-2xl mx-auto">
      Elige el plan que mejor se adapte a tus necesidades y desbloquea herramientas avanzadas de gestión y enseñanza.
    </p>
  </div>

  <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
    <!-- Free Plan -->
    <div class="bg-[#1e293b] border border-slate-800 rounded-3xl p-8 relative flex flex-col {!isPremium ? 'ring-2 ring-slate-500 shadow-2xl shadow-slate-900' : 'opacity-80'}">
      {#if !isPremium}
        <span class="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full border border-slate-600">Plan Actual</span>
      {/if}
      
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-2">Gratis</h2>
        <p class="text-slate-500 text-sm">Perfecto para empezar con pocos alumnos.</p>
        <div class="mt-4 flex items-baseline gap-1">
          <span class="text-4xl font-black text-white">0€</span>
          <span class="text-slate-500 text-sm">/mes</span>
        </div>
      </div>

      <ul class="space-y-4 mb-10 flex-grow">
        <li class="flex items-start gap-3 text-slate-300 text-sm">
          <Check class="w-5 h-5 text-emerald-500 shrink-0" />
          <span>Hasta 12 estudiantes</span>
        </li>
        <li class="flex items-start gap-3 text-slate-300 text-sm">
          <Check class="w-5 h-5 text-emerald-500 shrink-0" />
          <span>Gestión de clases y centros</span>
        </li>
        <li class="flex items-start gap-3 text-slate-300 text-sm">
          <Check class="w-5 h-5 text-emerald-500 shrink-0" />
          <span>Control de asistencia básico</span>
        </li>
        <li class="flex items-start gap-3 text-slate-500 text-sm">
          <Shield class="w-5 h-5 opacity-40 shrink-0" />
          <span class="line-through">Sin informes avanzados</span>
        </li>
      </ul>

      <button 
        disabled={!isPremium}
        class="w-full py-4 px-6 rounded-2xl font-bold transition-all {isPremium ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-700 text-white cursor-default'}"
      >
        {isPremium ? 'Bajar a Gratis' : 'Plan Actual'}
      </button>
    </div>

    <!-- Premium Plan -->
    <div class="bg-gradient-to-b from-indigo-950/40 to-[#1e293b] border border-indigo-500/30 rounded-3xl p-8 relative flex flex-col {isPremium ? 'ring-2 ring-indigo-500 shadow-2xl shadow-indigo-900' : 'hover:border-indigo-500/50 transition-all duration-300'}">
      {#if isPremium}
        <span class="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full border border-indigo-500 shadow-lg">Plan Actual</span>
      {/if}
      
      <div class="absolute top-8 right-8 text-indigo-400">
        <Zap class="w-8 h-8 fill-indigo-400/20" />
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-2">Premium</h2>
        <p class="text-indigo-200/60 text-sm">Escala tu academia al siguiente nivel.</p>
        <div class="mt-4 flex items-baseline gap-1">
          <span class="text-4xl font-black text-white">12€</span>
          <span class="text-slate-500 text-sm">/mes</span>
        </div>
      </div>

      <ul class="space-y-4 mb-10 flex-grow">
        <li class="flex items-start gap-3 text-white text-sm">
          <Check class="w-5 h-5 text-indigo-400 shrink-0" />
          <span class="font-medium">Estudiantes ilimitados</span>
        </li>
        <li class="flex items-start gap-3 text-white text-sm">
          <Check class="w-5 h-5 text-indigo-400 shrink-0" />
          <span class="font-medium">Informes y análisis avanzados</span>
        </li>
        <li class="flex items-start gap-3 text-white text-sm">
          <Check class="w-5 h-5 text-indigo-400 shrink-0" />
          <span class="font-medium">Gestión de torneos y logros</span>
        </li>
        <li class="flex items-start gap-3 text-white text-sm">
          <Check class="w-5 h-5 text-indigo-400 shrink-0" />
          <span class="font-medium">Sistema de pagos (Próximamente)</span>
        </li>
        <li class="flex items-start gap-3 text-white text-sm">
          <Check class="w-5 h-5 text-indigo-400 shrink-0" />
          <span class="font-medium">Soporte prioritario</span>
        </li>
      </ul>

      <button 
        onclick={handleUpgrade}
        disabled={isPremium}
        class="w-full py-4 px-6 rounded-2xl font-bold transition-all shadow-xl {isPremium ? 'bg-indigo-900/50 text-indigo-300 cursor-default' : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/20 active:scale-95'}"
      >
        {isPremium ? 'Ya eres Premium' : 'Mejorar a Premium'}
      </button>
    </div>
  </div>

  <div class="mt-16 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center max-w-4xl mx-auto">
    <div class="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
        <Info class="w-8 h-8" />
    </div>
    <div>
        <h3 class="text-white font-bold mb-2">Garantía de Satisfacción</h3>
        <p class="text-slate-500 text-sm">Si no estás satisfecho con las funciones Premium en tus primeros 14 días, te devolvemos el dinero sin preguntas. Queremos que ChessNet sea la mejor herramienta para tu academia.</p>
    </div>
  </div>
</div>
