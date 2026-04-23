<script lang="ts">
  import { adminApi } from '$lib/api/admin';
  import { user as authUser } from '$lib/stores/auth';
  import { appStore } from '$lib/stores/appStore';
  import { Coins, Plus, PaperPlaneTilt, Info, UsersThree, Warning } from 'phosphor-svelte';
  import { toast } from '$lib/stores/toast';
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  interface Props {
    editingTransaction?: any;
    onCancelEdit?: () => void;
  }

  let { editingTransaction = null, onCancelEdit = () => {} }: Props = $props();

  let teachers = $state<any[]>([]);
  let selectedTeacherId = $state('');
  let amount = $state(0);
  let reason = $state('');
  let type = $state<'NETS' | 'ADJUST'>('NETS');
  let adjustTarget = $state<'NETS'>('NETS');
  let isSubmitting = $state(false);

  // Check if user is Director
  let isDirector = $derived($appStore.settings?.role === 'director' || $appStore.settings?.role === 'admin');

  onMount(async () => {
    if (isDirector) {
      try {
        teachers = await adminApi.getUsersList(100);
      } catch (e) {
        console.error(e);
      }
    }
  });

  $effect(() => {
    if (editingTransaction) {
      selectedTeacherId = editingTransaction.userId;
      amount = editingTransaction.amount;
      reason = editingTransaction.reason;
      type = 'NETS'; // Currently only supporting editing Nets transactions
    }
  });

  async function handleGrant() {
    if (!selectedTeacherId || (type !== 'ADJUST' && amount === 0) || !reason) {
      toast.error('Completa todos los campos');
      return;
    }

    isSubmitting = true;
    try {
      if (editingTransaction) {
        await adminApi.updateNetsTransaction(
          editingTransaction.id,
          selectedTeacherId,
          editingTransaction.amount,
          amount,
          reason
        );
        toast.success('Registro actualizado correctamente');
        onCancelEdit();
      } else {
        if (type === 'NETS') {
          await adminApi.addNets(selectedTeacherId, amount, reason);
          toast.success(`Nets asignados correctamente`);
        } else {
          const updateData: any = {};
          if (adjustTarget === 'NETS') updateData.netsBalance = amount;
          
          await adminApi.updateUserEconomy(selectedTeacherId, updateData);
          toast.success(`Balance ajustado manualmente`);
        }
      }
      
      // Reset
      amount = 0;
      reason = '';
      selectedTeacherId = '';
    } catch (error: any) {
      toast.error(error.message || 'Error al procesar la transacción');
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="pro-card p-8 relative overflow-hidden">
  {#if !isDirector}
    <div class="flex flex-col items-center justify-center py-12 text-center" in:fade>
      <div class="w-16 h-16 bg-zinc-950 border border-white/5 flex items-center justify-center text-zinc-700 mb-6 pro-grid-bg">
        <Coins size={32} weight="thin" />
      </div>
      <h3 class="text-xs font-black text-white uppercase tracking-widest mb-2">Mis Logros</h3>
      <p class="text-[10px] text-zinc-500 max-w-xs uppercase tracking-widest leading-loose">
        Como Profesor, ganas Nets mediante tu actividad diaria. El Director valida tu rendimiento para otorgar influencia y Nets adicionales.
      </p>
    </div>
  {:else}
    <div class="relative z-10">
      <div class="flex items-center gap-3 mb-8">
        <div class="w-1.5 h-8 {editingTransaction ? 'bg-amber-500' : 'bg-violet-500'} shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
        <h2 class="text-xl font-black text-white uppercase tracking-[0.2em]">
          {editingTransaction ? 'Editando Transacción' : 'Gestión de Nets'}
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Left: Transaction Config -->
        <div class="space-y-6">
          <div class="flex gap-2 p-1 bg-zinc-950 border border-white/5">
            <button 
              class="flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all {type === 'NETS' ? 'bg-violet-600 text-white' : 'text-zinc-600 hover:text-zinc-400'}"
              onclick={() => { type = 'NETS'; amount = 0; }}
            >
              Asignar Nets
            </button>

            <button 
              class="flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all {type === 'ADJUST' ? 'bg-amber-600 text-white' : 'text-zinc-600 hover:text-zinc-400'}"
              onclick={() => { type = 'ADJUST'; amount = 0; }}
            >
              Ajustar Perfil
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label for="teacher" class="pro-label">Seleccionar Usuario</label>
              <select 
                id="teacher"
                bind:value={selectedTeacherId}
                class="pro-input appearance-none"
                disabled={!!editingTransaction}
              >
                <option value="">Elegir destinatario...</option>
                {#each teachers as teacher}
                  <option value={teacher.id}>{teacher.displayName || teacher.email}</option>
                {/each}
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="amount" class="pro-label">
                  {#if type === 'NETS'}Nets a Otorgar{:else}Nuevo Valor Total{/if}
                </label>
                <div class="relative">
                  <input 
                    id="amount"
                    type="number" 
                    bind:value={amount}
                    class="pro-input pr-12"
                    placeholder="0"
                  />
                  <div class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 font-black text-[10px]">
                    NETS
                  </div>
                </div>
              </div>
              <div>
                {#if type === 'ADJUST'}
                  <label for="target" class="pro-label">Campo a Ajustar</label>
                  <select 
                    id="target"
                    bind:value={adjustTarget}
                    class="pro-input appearance-none"
                  >
                    <option value="NETS">Balance de Nets</option>
                  </select>
                {:else}
                  <label for="reason" class="pro-label">Motivo / Concepto</label>
                  <input 
                    id="reason"
                    type="text" 
                    bind:value={reason}
                    placeholder="Ej: Gran torneo organizado"
                    class="pro-input"
                  />
                {/if}
              </div>
            </div>
            
            {#if type === 'ADJUST'}
              <div>
                <label for="reason_adj" class="pro-label">Razón del Ajuste</label>
                <input 
                  id="reason_adj"
                  type="text" 
                  bind:value={reason}
                  placeholder="Ej: Corrección por error de sistema"
                  class="pro-input"
                />
              </div>
            {/if}
          </div>
        </div>

        <!-- Right: Preview & Security -->
        <div class="flex flex-col">
          <div class="flex-1 p-6 bg-zinc-950/50 border border-white/5 relative group">
            <div class="absolute inset-0 opacity-5 pro-grid-bg"></div>
            
            <div class="relative z-10">
              <h4 class="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Vista previa de la operación</h4>
              
              {#if !selectedTeacherId || (type !== 'ADJUST' && amount === 0)}
                <div class="flex flex-col items-center justify-center h-24 text-zinc-700 italic text-[10px] uppercase tracking-widest">
                  Configure los detalles para previsualizar
                </div>
              {:else}
                <div class="space-y-4" in:fade>
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] text-zinc-500 uppercase tracking-widest">Tipo:</span>
                    <span class="text-xs font-black text-white uppercase tracking-wider">
                      {#if type === 'NETS'}Transacción de Nets{:else}Sobreescritura de Balance{/if}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] text-zinc-500 uppercase tracking-widest">
                      {type === 'ADJUST' ? 'Nuevo Valor:' : 'Monto:'}
                    </span>
                    <span class="text-lg font-black {type === 'ADJUST' ? 'text-amber-400' : (amount > 0 ? 'text-emerald-400' : 'text-red-400')}">
                      {type !== 'ADJUST' && amount > 0 ? '+' : ''}{amount}
                    </span>
                  </div>
                  <div class="pt-4 border-t border-white/5">
                    <p class="text-[10px] text-zinc-500 leading-relaxed">
                      Esta acción es <span class="text-white font-bold italic underline">irreversible</span>. Los cambios se verán reflejados en el balance del usuario de inmediato.
                    </p>
                  </div>
                </div>
              {/if}
            </div>
          </div>

          <div class="flex gap-4 mt-4">
            {#if editingTransaction}
              <button 
                onclick={onCancelEdit}
                class="pro-button-secondary flex-1 py-4 flex items-center justify-center gap-3"
              >
                Cancelar
              </button>
            {/if}
            <button 
              onclick={handleGrant}
              disabled={isSubmitting || !selectedTeacherId || (type !== 'ADJUST' && amount === 0) || !reason}
              class="pro-button-primary {editingTransaction ? 'flex-[2] bg-amber-600 hover:bg-amber-500' : 'w-full'} py-4 flex items-center justify-center gap-3"
            >
              {#if isSubmitting}
                <div class="w-4 h-4 border-2 border-white/20 border-t-white animate-spin"></div>
                <span>Procesando...</span>
              {:else}
                <PaperPlaneTilt size={18} weight="bold" />
                <span>{editingTransaction ? 'Actualizar Registro' : 'Ejecutar Transacción'}</span>
              {/if}
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Decorative -->
  <div class="absolute -top-12 -left-12 w-32 h-32 bg-violet-600/5 blur-3xl rounded-full"></div>
</div>
