<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { showError, showToast } from '$lib/utils/toast';
  import { ArrowLeft, School, MapPin, Globe, Sparkles, X, Check } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { fade, fly } from 'svelte/transition';

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
      goto(`/schools/${result.school.id}`);
    } catch (error) {
      showError(error, 'Error al crear el centro');
    } finally {
      isCreating = false;
    }
  }
</script>

<svelte:head>
  <title>Nuevo Centro - ChessNet</title>
</svelte:head>

<div class="max-w-3xl mx-auto space-y-8 animate-fade-in" in:fade>
  <!-- Breadcrumb & Title -->
  <div class="space-y-4">
    <button 
      onclick={() => goto('/schools')}
      class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest"
    >
      <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      Volver a Centros
    </button>
    
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10">
        <School class="w-6 h-6" />
      </div>
      <div>
        <h1 class="text-3xl font-black text-white tracking-tight uppercase">Registrar Nuevo Centro</h1>
        <p class="text-surface-500 text-sm">Configura una nueva sede para tu academia de ajedrez.</p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- Main Form -->
    <div class="md:col-span-2 space-y-6">
      <div class="glass-panel p-8 space-y-8 border-t-4 border-primary-500">
        <div class="space-y-6">
          <div class="space-y-2">
            <label for="name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Nombre del Centro Educational</label>
            <div class="relative group">
              <input
                id="name"
                type="text"
                bind:value={name}
                placeholder="Ej: Colegio San Ramón y San Antonio"
                class="w-full bg-surface-950 border border-surface-800 rounded-xl px-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all placeholder:text-surface-700 font-bold"
                required
              />
              {#if name.length > 3}
                <div class="absolute right-4 top-1/2 -translate-y-1/2 text-primary-500" in:scale>
                  <Check class="w-5 h-5" />
                </div>
              {/if}
            </div>
          </div>

          <div class="space-y-2">
            <label for="city" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Ciudad o Localidad</label>
            <div class="relative group">
              <MapPin class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-700 group-focus-within:text-primary-400 transition-colors" />
              <input
                id="city"
                type="text"
                bind:value={city}
                placeholder="Ej: Madrid, España"
                class="w-full bg-surface-950 border border-surface-800 rounded-xl pl-12 pr-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all placeholder:text-surface-700"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-4 pt-4 border-t border-surface-900">
          <button
            type="button"
            onclick={() => goto('/schools')}
            class="px-6 py-3 text-surface-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
          >
            Cancelar
          </button>
          <button
            onclick={createSchool}
            disabled={isCreating || !name.trim()}
            class="bg-primary-500 text-black px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/20 flex items-center gap-3"
          >
            {#if isCreating}
              <div class="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
              <span>Creando...</span>
            {:else}
              <Sparkles class="w-4 h-4" />
              <span>Crear Centro</span>
            {/if}
          </button>
        </div>
      </div>
    </div>

    <!-- Sidebar Info -->
    <div class="space-y-6">
      <div class="glass-panel p-6 space-y-4 bg-primary-500/5 border-primary-500/10">
        <h3 class="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
          <Sparkles class="w-4 h-4 text-primary-400" />
          ¿Qué sucede ahora?
        </h3>
        <ul class="space-y-3">
          {#each [
            'Se creará un perfil único para el centro.',
            'Se habilitará la gestión de clases y grupos.',
            'Podrás vincular estudiantes al centro.',
            'Se activará el seguimiento de pagos.'
          ] as tip}
            <li class="flex items-start gap-2">
              <div class="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] flex-shrink-0"></div>
              <p class="text-xs text-surface-400 leading-relaxed font-medium">{tip}</p>
            </li>
          {/each}
        </ul>
      </div>

      <div class="glass-panel p-6 space-y-4">
        <h3 class="text-sm font-black text-white uppercase tracking-widest">Ayuda</h3>
        <p class="text-xs text-surface-500 leading-relaxed">
          Si necesitas importar datos masivos desde un Excel, contacta con soporte o utiliza la herramienta de importación en el Dashboard.
        </p>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  /* School create styles */
</style>
