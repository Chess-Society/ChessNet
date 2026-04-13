<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { Calendar, Construction, ArrowLeft } from 'lucide-svelte';
  import { goto } from '$app/navigation';
</script>

<div class="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center" in:fade>
  <div class="relative mb-8">
    <div class="absolute -inset-4 bg-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
    <div class="relative bg-[#1e293b] p-8 rounded-3xl border border-indigo-500/30 shadow-2xl">
      <div class="bg-indigo-500/10 p-4 rounded-2xl mb-4 inline-block">
        <Calendar class="w-12 h-12 text-indigo-400" />
      </div>
      <h1 class="text-3xl font-black text-white mb-2 font-display">Planificador de Clases</h1>
      <div class="flex items-center justify-center gap-2 text-indigo-400 font-bold uppercase tracking-widest text-xs mb-6">
        <Construction class="w-4 h-4" />
        Próximadamente
      </div>
      
      <p class="text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
        Estamos construyendo el sistema de planificación más avanzado para profesores de ajedrez. Muy pronto podrás diseñar sesiones, gestionar calendarios y asignar contenidos dinámicos.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
        <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <p class="text-white font-bold text-sm mb-1">📅 Calendario Grupal</p>
          <p class="text-xs text-slate-500">Gestiona horarios de todos tus centros en una sola vista.</p>
        </div>
        <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <p class="text-white font-bold text-sm mb-1">📝 Temarios Dinámicos</p>
          <p class="text-xs text-slate-500">Arrastra ejercicios y lecciones directamente a tus clases.</p>
        </div>
      </div>

      <button 
        onclick={() => goto('/panel')}
        class="flex items-center gap-2 mx-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 group"
      >
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Volver al Panel
      </button>
    </div>
  </div>
</div>

<style>
  .font-display {
    font-family: 'Outfit', sans-serif;
  }
</style>
