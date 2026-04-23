<script lang="ts">
  import { Trophy, Calendar, Globe, Database, Plus, X } from 'phosphor-svelte';
  import { fade, slide } from 'svelte/transition';
  import { user } from '$lib/stores/auth';
  import { appStore } from '$lib/stores/appStore';
  import { predictionApi } from '$lib/api/predictions';
  import { toast } from '$lib/stores/toast';

  interface Props {
    onClose: () => void;
  }

  let { onClose }: Props = $props();

  let mode = $state<'MANUAL' | 'SYSTEM' | 'LICHESS'>('MANUAL');
  let question = $state('');
  let description = $state('');
  let endDate = $state('');
  let externalId = $state('');
  let loading = $state(false);

  // Opciones predeterminadas para SÍ/NO
  const defaultOptions = [
    { id: 'yes', text: 'SÍ', totalStaked: 0, totalShares: 0 },
    { id: 'no', text: 'NO', totalStaked: 0, totalShares: 0 }
  ];

  async function handleCreate() {
    if (!$user?.uid || !question || !endDate) {
      toast.error("Por favor, rellena todos los campos obligatorios.");
      return;
    }

    loading = true;
    try {
      const activeSchool = appStore.school;
      if (!activeSchool) throw new Error("No hay una escuela activa seleccionada");
      
      // Validador de fecha defensivo
      const finalEndDate = endDate ? new Date(endDate).toISOString() : new Date(Date.now() + 3600000).toISOString();

      const marketData = {
        schoolId: activeSchool.id,
        creatorId: $user?.uid || 'ANONYMOUS',
        question,
        description,
        endDate: finalEndDate,
        options: defaultOptions,
        oracleType: mode,
        oracleConfig: {
          ...(mode === 'LICHESS' && externalId ? { externalId: externalId.trim(), tournamentId: externalId.trim() } : {}),
          validationSource: mode === 'LICHESS' ? 'LICHESS_API' : mode === 'SYSTEM' ? 'SYSTEM_DATA' : 'MANUAL'
        }
      };

      console.log("[Social] Creating challenge:", marketData);
      await predictionApi.createMarket(marketData);

      toast.success("¡Reto lanzado con éxito al muro!");
      onClose();
    } catch (e: any) {
      console.error("[Social] Creation failure:", e);
      toast.error(e.message || "Error al crear el reto");
    } finally {
      loading = false;
    }
  }
</script>

<div 
  class="creator-overlay" 
  transition:fade 
  onclick={onClose}
  onkeydown={e => e.key === 'Escape' && onClose()}
  role="button"
  tabindex="0"
  aria-label="Cerrar modal"
>
  <div 
    class="creator-modal pro-card p-0 overflow-hidden" 
    onclick={e => e.stopPropagation()}
    onkeydown={e => e.stopPropagation()}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <!-- Header -->
    <div class="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-950">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-500">
          <Trophy size={24} weight="bold" />
        </div>
        <div>
          <h2 class="text-xl font-black text-white uppercase tracking-tighter">Lanzar Nuevo Reto</h2>
          <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sistema de Reconocimiento y Mérito</p>
        </div>
      </div>
      <button class="p-2 text-zinc-500 hover:text-white transition-colors" onclick={onClose}>
        <X size={20} />
      </button>
    </div>

    <!-- Mode Selector -->
    <div class="grid grid-cols-3 border-b border-white/5">
      <button 
        class="flex flex-col items-center p-6 gap-2 transition-all {mode === 'MANUAL' ? 'bg-amber-500/10 text-amber-500' : 'text-zinc-500 hover:bg-white/5'}"
        onclick={() => mode = 'MANUAL'}
      >
        <Trophy size={20} weight={mode === 'MANUAL' ? 'fill' : 'bold'} />
        <span class="text-[10px] font-black uppercase tracking-widest">Manual</span>
      </button>
      <button 
        class="flex flex-col items-center p-6 gap-2 transition-all {mode === 'SYSTEM' ? 'bg-emerald-500/10 text-emerald-500' : 'text-zinc-500 hover:bg-white/5'}"
        onclick={() => mode = 'SYSTEM'}
      >
        <Database size={20} weight={mode === 'SYSTEM' ? 'fill' : 'bold'} />
        <span class="text-[10px] font-black uppercase tracking-widest">Hito Datos</span>
      </button>
      <button 
        class="flex flex-col items-center p-6 gap-2 transition-all {mode === 'LICHESS' ? 'bg-blue-500/10 text-blue-500' : 'text-zinc-500 hover:bg-white/5'}"
        onclick={() => mode = 'LICHESS'}
      >
        <Globe size={20} weight={mode === 'LICHESS' ? 'fill' : 'bold'} />
        <span class="text-[10px] font-black uppercase tracking-widest">Lichess</span>
      </button>
    </div>

    <div class="p-8 space-y-6 bg-zinc-950">
      <!-- Question -->
      <div class="space-y-2">
        <label for="market-question" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Pregunta del Reto</label>
        <input 
          id="market-question"
          bind:value={question}
          placeholder={mode === 'MANUAL' ? '¿Vendrá el GM invitado?' : mode === 'SYSTEM' ? '¿Llegaremos a 100 check-ins?' : '¿Ganaremos la Team Battle?'}
          class="w-full bg-black border border-white/10 p-4 text-white font-bold placeholder:text-zinc-700 focus:border-amber-500/50 outline-none transition-all"
        />
      </div>

      <!-- Description -->
      <div class="space-y-2">
        <label for="market-description" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Contexto (Opcional)</label>
        <textarea 
          id="market-description"
          bind:value={description}
          placeholder="Explica los detalles del hito para que los profes puedan evaluar su pronóstico..."
          class="w-full bg-black border border-white/10 p-4 text-white font-medium placeholder:text-zinc-700 focus:border-amber-500/50 outline-none transition-all h-24 resize-none"
        ></textarea>
      </div>

      <!-- Lichess ID (Conditional) -->
      {#if mode === 'LICHESS'}
        <div class="space-y-2" transition:slide>
          <label for="lichess-id" class="text-[10px] font-black text-blue-500 uppercase tracking-widest">ID del Torneo Lichess</label>
          <input 
            id="lichess-id"
            bind:value={externalId}
            placeholder="Ej: qS7W9zR4"
            class="w-full bg-black border border-blue-500/20 p-4 text-white font-bold placeholder:text-zinc-700 focus:border-blue-500/50 outline-none transition-all"
          />
          <p class="text-[9px] text-zinc-500 italic">Copia el código final de la URL del torneo (ej: lichess.org/tournament/XXXXX)</p>
        </div>
      {/if}

      <div class="grid grid-cols-2 gap-6">
        <!-- Date -->
        <div class="space-y-2">
          <label for="end-date" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fecha de Cierre</label>
          <div class="relative">
            <input 
              id="end-date"
              type="datetime-local"
              bind:value={endDate}
              class="w-full bg-black border border-white/10 p-4 text-white font-bold focus:border-amber-500/50 outline-none transition-all"
            />
          </div>
        </div>

        <!-- Stake Info -->
        <div class="space-y-2">
          <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Validación</span>
          <div class="p-4 bg-white/5 border border-white/10 flex items-center gap-3">
            {#if mode === 'MANUAL'}
              <Trophy size={16} class="text-amber-500" />
              <span class="text-[10px] font-bold text-zinc-400 uppercase">Por el Director</span>
            {:else if mode === 'SYSTEM'}
              <Database size={16} class="text-emerald-500" />
              <span class="text-[10px] font-bold text-zinc-400 uppercase">Auto por Datos</span>
            {:else}
              <Globe size={16} class="text-blue-500" />
              <span class="text-[10px] font-bold text-zinc-400 uppercase">Oráculo Lichess</span>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- Action -->
    <div class="p-6 bg-zinc-900 border-t border-white/5 flex justify-end gap-4">
      <button 
        class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
        onclick={onClose}
      >
        Cancelar
      </button>
      <button 
        class="px-8 py-3 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading || !question || !endDate}
        onclick={handleCreate}
      >
        {loading ? 'Lanzando...' : 'Publicar Reto'}
      </button>
    </div>
  </div>
</div>

<style>
  .creator-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .creator-modal {
    width: 100%;
    max-width: 600px;
    background: #000;
    box-shadow: 0 0 50px rgba(0,0,0,0.5);
  }

  input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }
</style>
