<script lang="ts">
  import { scale, fade } from 'svelte/transition';
  import { appStore } from '$lib/stores/appStore';
  import { X, Coins, Gift, Warning } from 'phosphor-svelte';
  
  interface Props {
    authorName: string;
    onConfirm: (amount: number) => void;
    onClose: () => void;
  }
  
  let { authorName, onConfirm, onClose }: Props = $props();
  
  let amount = $state(10);
  const options = [5, 10, 25, 50];
  
  const userBalance = $derived($appStore.settings.economy?.netsBalance || 0);

  function handleConfirm() {
    if (amount > 0 && amount <= userBalance) {
      onConfirm(amount);
    }
  }
</script>

<div 
  class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" 
  transition:fade={{ duration: 200 }}
>
  <button class="absolute inset-0 w-full h-full cursor-default" onclick={onClose} aria-label="Cerrar modal"></button>

  <div 
    class="pro-card w-full max-w-md relative z-10 overflow-hidden border-amber-500/20"
    transition:scale={{ duration: 300, start: 0.95 }}
    role="dialog"
    aria-modal="true"
    aria-labelledby="tip-modal-title"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-6 bg-zinc-950 border-b border-white/5">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-amber-500/10 text-amber-500">
          <Gift size={20} weight="bold" />
        </div>
        <h3 id="tip-modal-title" class="text-xs font-black text-white uppercase tracking-[0.2em]">Regalar Prestigio</h3>
      </div>
      <button onclick={onClose} class="text-zinc-600 hover:text-white transition-colors">
        <X size={20} weight="bold" />
      </button>
    </div>
    
    <div class="p-8 space-y-8">
      <div class="text-center space-y-2">
        <p class="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Enviar Nets a</p>
        <p class="text-lg font-black text-white uppercase tracking-wider">{authorName}</p>
      </div>

      <!-- Balance Card -->
      <div class="flex items-center justify-between p-4 bg-zinc-950 border border-white/5 pro-grid-bg">
        <div class="flex items-center gap-2">
          <Coins size={16} class="text-amber-500" />
          <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Tu Saldo Actual</span>
        </div>
        <div class="text-sm font-black text-white tracking-widest">
          {userBalance} <span class="text-[10px] text-zinc-600">NETS</span>
        </div>
      </div>

      <!-- Quick Options -->
      <div class="space-y-4">
        <div class="text-[9px] font-black text-zinc-600 uppercase tracking-widest block text-center">Selecciona cantidad</div>
        <div class="grid grid-cols-4 gap-2">
          {#each options as opt}
            <button 
              class="group relative py-4 border transition-all {amount === opt ? 'bg-amber-500 border-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-zinc-950 border-white/5 text-zinc-400 hover:border-amber-500/50 hover:text-white'}" 
              disabled={userBalance < opt}
              onclick={() => amount = opt}
            >
              <span class="text-xs font-black tracking-tighter">{opt}</span>
              {#if amount === opt}
                <div class="absolute -top-1 -right-1 w-2 h-2 bg-white rotate-45"></div>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <!-- Custom Input -->
      <div class="space-y-3">
        <div class="relative">
          <label for="tip-amount-input" class="sr-only">Cantidad de Nets</label>
          <input 
            id="tip-amount-input"
            type="number" 
            bind:value={amount} 
            min="1" 
            max={userBalance}
            class="w-full bg-zinc-950 border border-white/5 p-4 text-center text-xl font-black text-white outline-none focus:border-amber-500/50 transition-all placeholder:text-zinc-800"
          />
          <div class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-700 tracking-widest pointer-events-none">
            NETS
          </div>
        </div>
        
        {#if amount > userBalance}
          <div class="flex items-center justify-center gap-2 text-red-500" transition:fade>
            <Warning size={14} weight="bold" />
            <span class="text-[9px] font-black uppercase tracking-widest">Saldo Insuficiente</span>
          </div>
        {/if}
      </div>
    </div>
    
    <!-- Footer -->
    <div class="flex border-t border-white/5">
      <button 
        class="flex-1 p-6 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] hover:bg-white/5 transition-all border-r border-white/5" 
        onclick={onClose}
      >
        Cancelar
      </button>
      <button 
        class="flex-[2] p-6 text-[10px] font-black text-black uppercase tracking-[0.2em] bg-amber-500 hover:bg-amber-400 transition-all disabled:opacity-20 disabled:grayscale" 
        disabled={amount <= 0 || amount > userBalance}
        onclick={handleConfirm}
      >
        Confirmar Envío
      </button>
    </div>
  </div>
</div>

<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
