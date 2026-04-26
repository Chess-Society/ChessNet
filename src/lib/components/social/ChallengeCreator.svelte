<script lang="ts">
  import { Trophy, Calendar, Globe, Database, Plus, X } from 'phosphor-svelte';
  import { fade, slide } from 'svelte/transition';
  import { user } from '$lib/stores/auth';
  import { appStore } from '$lib/stores/appStore';
  import { toast } from '$lib/stores/toast';
  import { superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { challengeSchema } from '$lib/schemas/challenge';

  interface Props {
    form: any;
    onClose: () => void;
  }

  let { form: serverForm, onClose }: Props = $props();

  const { form, errors, enhance, submitting } = superForm(serverForm as any, {
    validators: zod(challengeSchema as any),
    onUpdated({ form }) {
      if (form.valid) {
        toast.success("¡Reto lanzado con éxito al muro!");
        onClose();
      }
    }
  }) as any;

  let loading = $derived($submitting);

  // Opciones predeterminadas para SÍ/NO
  const defaultOptions = [
    { id: 'yes', text: 'SÍ', totalStaked: 0, totalShares: 0 },
    { id: 'no', text: 'NO', totalStaked: 0, totalShares: 0 }
  ];
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
    <form 
      method="POST"
      action="?/createChallenge"
      use:enhance
      class="creator-modal pro-card p-0 overflow-hidden" 
      onclick={e => e.stopPropagation()}
      onkeydown={e => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <input type="hidden" name="mode" bind:value={$form.mode} />
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
        type="button"
        class="flex flex-col items-center p-6 gap-2 transition-all {$form.mode === 'MANUAL' ? 'bg-amber-500/10 text-amber-500' : 'text-zinc-500 hover:bg-white/5'}"
        onclick={() => $form.mode = 'MANUAL'}
      >
        <Trophy size={20} weight={$form.mode === 'MANUAL' ? 'fill' : 'bold'} />
        <span class="text-[10px] font-black uppercase tracking-widest">Manual</span>
      </button>
      <button 
        type="button"
        class="flex flex-col items-center p-6 gap-2 transition-all {$form.mode === 'SYSTEM' ? 'bg-emerald-500/10 text-emerald-500' : 'text-zinc-500 hover:bg-white/5'}"
        onclick={() => $form.mode = 'SYSTEM'}
      >
        <Database size={20} weight={$form.mode === 'SYSTEM' ? 'fill' : 'bold'} />
        <span class="text-[10px] font-black uppercase tracking-widest">Hito Datos</span>
      </button>
      <button 
        type="button"
        class="flex flex-col items-center p-6 gap-2 transition-all {$form.mode === 'LICHESS' ? 'bg-blue-500/10 text-blue-500' : 'text-zinc-500 hover:bg-white/5'}"
        onclick={() => $form.mode = 'LICHESS'}
      >
        <Globe size={20} weight={$form.mode === 'LICHESS' ? 'fill' : 'bold'} />
        <span class="text-[10px] font-black uppercase tracking-widest">Lichess</span>
      </button>
    </div>

    <div class="p-8 space-y-6 bg-zinc-950">
      <!-- Question -->
      <div class="space-y-2">
        <label for="market-question" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Pregunta del Reto</label>
        <input 
          id="market-question"
          name="question"
          bind:value={$form.question}
          placeholder={$form.mode === 'MANUAL' ? '¿Vendrá el GM invitado?' : $form.mode === 'SYSTEM' ? '¿Llegaremos a 100 check-ins?' : '¿Ganaremos la Team Battle?'}
          class="w-full bg-black border border-white/10 p-4 text-white font-bold placeholder:text-zinc-700 focus:border-amber-500/50 outline-none transition-all"
        />
        {#if $errors.question}<p class="text-[8px] text-red-500 uppercase tracking-widest">{$errors.question}</p>{/if}
      </div>

      <!-- Description -->
      <div class="space-y-2">
        <label for="market-description" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Contexto (Opcional)</label>
        <textarea 
          id="market-description"
          name="description"
          bind:value={$form.description}
          placeholder="Explica los detalles del hito para que los profes puedan evaluar su pronóstico..."
          class="w-full bg-black border border-white/10 p-4 text-white font-medium placeholder:text-zinc-700 focus:border-amber-500/50 outline-none transition-all h-24 resize-none"
        ></textarea>
        {#if $errors.description}<p class="text-[8px] text-red-500 uppercase tracking-widest">{$errors.description}</p>{/if}
      </div>

      <!-- Lichess ID (Conditional) -->
      {#if $form.mode === 'LICHESS'}
        <div class="space-y-2" transition:slide>
          <label for="lichess-id" class="text-[10px] font-black text-blue-500 uppercase tracking-widest">ID del Torneo Lichess</label>
          <input 
            id="lichess-id"
            name="externalId"
            bind:value={$form.externalId}
            placeholder="Ej: qS7W9zR4"
            class="w-full bg-black border border-blue-500/20 p-4 text-white font-bold placeholder:text-zinc-700 focus:border-blue-500/50 outline-none transition-all"
          />
          <p class="text-[9px] text-zinc-500 italic">Copia el código final de la URL del torneo (ej: lichess.org/tournament/XXXXX)</p>
          {#if $errors.externalId}<p class="text-[8px] text-red-500 uppercase tracking-widest">{$errors.externalId}</p>{/if}
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
              name="endDate"
              bind:value={$form.endDate}
              class="w-full bg-black border border-white/10 p-4 text-white font-bold focus:border-amber-500/50 outline-none transition-all"
            />
            {#if $errors.endDate}<p class="text-[8px] text-red-500 uppercase tracking-widest">{$errors.endDate}</p>{/if}
          </div>
        </div>

        <!-- Stake Info -->
        <div class="space-y-2">
          <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Validación</span>
          <div class="p-4 bg-white/5 border border-white/10 flex items-center gap-3">
            {#if $form.mode === 'MANUAL'}
              <Trophy size={16} class="text-amber-500" />
              <span class="text-[10px] font-bold text-zinc-400 uppercase">Por el Director</span>
            {:else if $form.mode === 'SYSTEM'}
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
        type="submit"
        class="px-8 py-3 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading || !$form.question || !$form.endDate}
      >
        {loading ? 'Lanzando...' : 'Publicar Reto'}
      </button>
    </div>
  </form>
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
