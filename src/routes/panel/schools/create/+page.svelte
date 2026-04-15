<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { showError, showToast } from '$lib/stores/toast';
  import { 
    CaretLeft, 
    Buildings, 
    MapPin, 
    Globe, 
    Sparkle, 
    X, 
    Check,
    Info,
    ArrowRight
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';

  let { data } = $props<{ data: PageData }>();

  let name = $state('');
  let city = $state('');
  let isCreating = $state(false);

  async function createSchool() {
    if (!name.trim()) {
      showError(new Error('El nombre del centro es obligatorio'));
      return;
    }

    try {
      isCreating = true;
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: name.trim(),
          city: city.trim() || null
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al crear el centro');

      showToast.success('Centro creado correctamente');
      goto(`/panel/schools/${result.school.id}`);
    } catch (error: any) {
      showError(error, 'Error al crear el centro');
    } finally {
      isCreating = false;
    }
  }
</script>

<svelte:head>
  <title>Nuevo Centro - ChessNet</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-12 space-y-12" in:fade>
  <!-- Cabecera y Botón Volver -->
  <div class="space-y-6">
    <button 
      onclick={() => goto('/panel/schools')}
      class="flex items-center gap-2 text-zinc-500 hover:text-violet-400 transition-all group text-[10px] font-black uppercase tracking-[0.2em]"
    >
      <CaretLeft size={16} weight="bold" class="transition-transform group-hover:-translate-x-1" />
      Volver a Centros
    </button>
    
    <div class="flex items-center gap-6">
      <div class="w-16 h-16 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center text-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
        <Buildings size={32} weight="duotone" />
      </div>
      <div>
        <h1 class="text-4xl font-outfit font-black text-white tracking-tighter uppercase">Registrar Nuevo Centro</h1>
        <p class="text-zinc-500 font-jakarta text-sm">Configura una nueva ubicación para tu academia de ajedrez.</p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
    <!-- Formulario Principal -->
    <div class="lg:col-span-2 space-y-6">
      <div class="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 space-y-8 relative overflow-hidden group">
        <!-- Brillo de Acento -->
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/5 blur-[100px] rounded-full group-hover:bg-violet-500/10 transition-colors"></div>

        <div class="space-y-8 relative z-10">
          <div class="space-y-3">
            <label for="name" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Buildings size={14} weight="duotone" class="text-violet-400" />
              Nombre del Centro o Club
            </label>
            <div class="relative group/input">
              <input
                id="name"
                type="text"
                bind:value={name}
                placeholder="ej. Academia de Ajedrez Jaque Mate"
                class="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all placeholder:text-zinc-700 font-bold font-jakarta"
                required
              />
              {#if name.length > 3}
                <div class="absolute right-5 top-1/2 -translate-y-1/2 text-violet-500" in:scale>
                  <Check size={20} weight="bold" />
                </div>
              {/if}
            </div>
          </div>

          <div class="space-y-3">
            <label for="city" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <MapPin size={14} weight="duotone" class="text-violet-400" />
              Ciudad o Ubicación
            </label>
            <div class="relative group/input">
              <MapPin size={20} weight="duotone" class="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within/input:text-violet-400 transition-colors" />
              <input
                id="city"
                type="text"
                bind:value={city}
                placeholder="ej. Madrid, España"
                class="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all placeholder:text-zinc-700 font-jakarta"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-6 pt-8 border-t border-zinc-800/50 relative z-10">
          <button
            type="button"
            onclick={() => goto('/panel/schools')}
            class="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            Cancelar
          </button>
          <button
            onclick={createSchool}
            disabled={isCreating || !name.trim()}
            class="bg-violet-600 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_10px_30px_-10px_rgba(139,92,246,0.3)] flex items-center gap-3 group/btn"
          >
            {#if isCreating}
              <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Procesando...</span>
            {:else}
              <Sparkle size={18} weight="duotone" class="group-hover/btn:rotate-12 transition-transform" />
              <span>Crear Centro</span>
            {/if}
          </button>
        </div>
      </div>
    </div>

    <!-- Guía Lateral -->
    <div class="space-y-6">
      <div class="bg-violet-500/5 border border-violet-500/10 rounded-3xl p-6 space-y-6">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-violet-500/10 rounded-xl text-violet-400">
            <Info size={20} weight="duotone" />
          </div>
          <h3 class="text-xs font-black text-white uppercase tracking-widest">Siguientes Pasos</h3>
        </div>
        
        <div class="space-y-4">
          {#each [
            { text: 'Se creará un perfil único para el centro.', color: 'border-violet-500' },
            { text: 'Podrás configurar clases y horarios específicos.', color: 'border-blue-500' },
            { text: 'Vincula alumnos directamente a esta ubicación.', color: 'border-primary-500' },
            { text: 'Activa el control de asistencia y pagos.', color: 'border-amber-500' }
          ] as step}
            <div class="flex items-start gap-4 group/step">
              <div class={`mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)] flex-shrink-0 group-hover/step:scale-125 transition-transform`}></div>
              <p class="text-[11px] text-zinc-400 leading-relaxed font-bold font-jakarta group-hover/step:text-zinc-300 transition-colors uppercase tracking-tight">{step.text}</p>
            </div>
          {/each}
        </div>
      </div>

      <div class="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6 space-y-4">
        <h3 class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">¿Necesitas ayuda?</h3>
        <p class="text-[11px] text-zinc-500 leading-relaxed font-jakarta">
          Si vienes de otro sistema o tienes una lista en Excel, puedes importar tus centros y alumnos de forma masiva desde el panel de ajustes globales.
        </p>
        <button class="flex items-center gap-2 text-[10px] font-black text-violet-400 uppercase tracking-widest hover:text-white transition-colors">
          Ir a importar
          <ArrowRight size={14} weight="bold" />
        </button>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  /* Optimized for Bento Dark Layout */
</style>
