<script lang="ts">
  import { db } from '$lib/firebase';
  import { collection, query, orderBy, limit, onSnapshot, doc, deleteDoc, updateDoc, increment } from 'firebase/firestore';
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { Trash, Clock, ArrowRight, User, Tag, PencilSimple, CheckCircle, Warning } from 'phosphor-svelte';
  import { adminApi } from '$lib/api/admin';
  import { toast } from '$lib/stores/toast';
  import { user as authUser } from '$lib/stores/auth';
  import { appStore } from '$lib/stores/appStore';

  interface Props {
    onEdit?: (tx: any) => void;
  }

  let { onEdit = () => {} }: Props = $props();

  let transactions = $state<any[]>([]);
  let isLoading = $state(true);

  let isDirector = $derived($appStore.settings?.role === 'director' || $appStore.settings?.role === 'admin');

  onMount(() => {
    const q = query(collection(db, 'nets_transactions'), orderBy('createdAt', 'desc'), limit(50));
    const unsub = onSnapshot(q, (snap) => {
      transactions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      isLoading = false;
    });
    return unsub;
  });

  async function handleDelete(tx: any) {
    const revert = tx.status === 'confirmed' ? confirm('¿Deseas revertir el balance del usuario (devolver/quitar los Nets) antes de borrar el registro?') : false;
    if (!confirm('¿Seguro que quieres eliminar esta transacción?')) return;

    try {
      await adminApi.deleteNetsTransaction(tx.id, tx.userId, tx.amount, revert);
      toast.success(revert ? 'Transacción revertida y eliminada' : 'Transacción eliminada del historial');
    } catch (e) {
      toast.error('Error al eliminar');
    }
  }

  async function handleConfirm(tx: any) {
    if (!isDirector) return;
    try {
      await adminApi.confirmNetsTransaction(tx.id, tx.userId, $authUser!.uid);
      toast.success('Nets validados correctamente');
    } catch (e) {
      toast.error('Error al validar');
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<div class="pro-card p-8">
  <div class="flex items-center justify-between mb-8">
    <div class="flex items-center gap-3">
      <div class="w-1.5 h-6 bg-zinc-700"></div>
      <h3 class="text-xs font-black text-white uppercase tracking-widest">Historial de Transacciones</h3>
    </div>
    <div class="px-3 py-1 bg-zinc-950 border border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
      Últimas 50
    </div>
  </div>

  {#if isLoading}
    <div class="py-12 flex justify-center">
      <div class="w-6 h-6 border-2 border-white/10 border-t-violet-500 animate-spin"></div>
    </div>
  {:else if transactions.length === 0}
    <div class="py-12 text-center border border-dashed border-white/5">
      <p class="text-[10px] text-zinc-600 uppercase tracking-widest italic">No se han registrado transacciones aún.</p>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-white/5 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
            <th class="pb-4 font-black">Fecha</th>
            <th class="pb-4 font-black">Estado</th>
            <th class="pb-4 font-black">Concepto</th>
            <th class="pb-4 font-black text-right">Monto</th>
            {#if isDirector}
              <th class="pb-4 font-black text-right">Acciones</th>
            {/if}
          </tr>
        </thead>
        <tbody class="divide-y divide-white/[0.02]">
          {#each transactions as tx (tx.id)}
            <tr class="group" in:fade>
              <td class="py-4">
                <div class="flex items-center gap-2 text-[10px] text-zinc-500 font-medium">
                  <Clock size={12} />
                  {formatDate(tx.createdAt)}
                </div>
              </td>
              <td class="py-4">
                <div class="flex items-center gap-2">
                  {#if tx.status === 'pending'}
                    <div class="flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] font-black uppercase tracking-tighter">
                      <Clock size={10} weight="fill" />
                      Pendiente
                    </div>
                  {:else}
                    <div class="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[8px] font-black uppercase tracking-tighter">
                      <CheckCircle size={10} weight="fill" />
                      Validado
                    </div>
                  {/if}
                </div>
              </td>
              <td class="py-4">
                <div class="flex items-center gap-2 text-[10px] text-zinc-400 font-medium uppercase tracking-wider italic">
                  <Tag size={12} class="text-zinc-600" />
                  <span class="truncate max-w-[150px]">{tx.reason || 'Sin concepto'}</span>
                </div>
              </td>
              <td class="py-4 text-right">
                <span class="text-xs font-black {tx.status === 'pending' ? 'text-zinc-600' : (tx.amount >= 0 ? 'text-emerald-500' : 'text-red-500')}">
                  {tx.amount >= 0 ? '+' : ''}{tx.amount}
                </span>
              </td>
              {#if isDirector}
                <td class="py-4 text-right">
                  <div class="flex items-center justify-end gap-1">
                    {#if tx.status === 'pending'}
                      <button 
                        onclick={() => handleConfirm(tx)}
                        class="p-2 text-violet-500 hover:text-violet-400 transition-colors"
                        title="Validar registro"
                      >
                        <CheckCircle size={16} weight="bold" />
                      </button>
                    {/if}
                    <button 
                      onclick={() => onEdit(tx)}
                      class="p-2 text-zinc-700 hover:text-amber-500 transition-colors"
                      title="Editar registro"
                    >
                      <PencilSimple size={14} />
                    </button>
                    <button 
                      onclick={() => handleDelete(tx)}
                      class="p-2 text-zinc-700 hover:text-red-500 transition-colors"
                      title="Eliminar registro"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
