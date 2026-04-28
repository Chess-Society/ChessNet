<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/api/admin';
  import { t } from '$lib/i18n';
  import { fly, fade } from 'svelte/transition';
  import { toast } from '$lib/stores/toast';
  import { uiStore } from '$lib/stores/uiStore';
  
  import { 
    ShieldCheckered,
    CheckCircle,
    XCircle,
    Clock,
    MagnifyingGlass,
    Buildings
  } from 'phosphor-svelte';

  let schools = $state<any[]>([]);
  let isLoading = $state(true);
  let isSaving = $state(false);
  let searchQuery = $state("");

  const filteredSchools = $derived(
    schools.filter(s => 
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  onMount(async () => {
    await refresh();
  });

  async function refresh() {
    isLoading = true;
    try {
      schools = await adminApi.getAllSchools();
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    } finally {
      isLoading = false;
    }
  }

  async function handleUpdateStatus(schoolId: string, status: 'active' | 'pending' | 'suspended') {
    const statusLabels = {
      active: 'Activar',
      pending: 'Poner en Pendiente',
      suspended: 'Suspender'
    };

    const confirmed = await uiStore.confirm({
      title: `${statusLabels[status]} Escuela`,
      message: `¿Estás seguro de que deseas cambiar el estado de esta escuela a ${status.toUpperCase()}?`,
      type: status === 'suspended' ? 'danger' : 'warning',
      confirmText: 'CONFIRMAR',
      cancelText: 'CANCELAR'
    });

    if (!confirmed) return;

    isSaving = true;
    try {
      await adminApi.updateSchoolStatus(schoolId, status);
      toast.success('Estado actualizado correctamente');
      await refresh();
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    } finally {
      isSaving = false;
    }
  }
</script>

<div class="space-y-12" in:fly={{ y: 20, duration: 500 }}>
  <div class="flex items-center justify-between gap-6">
    <div class="flex items-center gap-6">
      <div class="w-16 h-16 bg-white text-black flex items-center justify-center font-display italic font-black text-3xl">
        07
      </div>
      <div>
         <h2 class="text-5xl font-black font-display uppercase italic tracking-tighter text-white leading-none">Gestión de Clubes</h2>
         <p class="text-slate-500 text-[10px] font-mono font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
           <span class="w-1.5 h-1.5 bg-primary-500 rounded-none"></span>
           VALIDACIÓN Y CONTROL DE CENTROS
         </p>
      </div>
    </div>

    <div class="flex items-center gap-4 bg-white/5 border border-white/10 px-4 h-12 w-full max-w-md">
      <MagnifyingGlass class="text-slate-500" />
      <input 
        bind:value={searchQuery}
        placeholder="BUSCAR CLUB O CIUDAD..."
        class="bg-transparent border-none text-white text-[10px] font-mono font-black uppercase tracking-widest focus:ring-0 w-full"
      />
    </div>
  </div>

  {#if isLoading}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each Array(6) as _}
        <div class="h-48 bg-white/[0.02] border border-white/5 animate-pulse"></div>
      {/each}
    </div>
  {:else if filteredSchools.length === 0}
    <div class="h-[40vh] flex flex-col items-center justify-center text-slate-500 gap-4 border border-dashed border-white/10">
      <Buildings size={48} weight="thin" />
      <p class="font-mono text-[10px] uppercase tracking-widest">No se encontraron clubes</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredSchools as school}
        <div class="bg-black/40 border border-white/5 p-6 flex flex-col justify-between group hover:border-primary-500/30 transition-all">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="px-2 py-0.5 text-[8px] font-mono font-black uppercase tracking-widest {school.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : school.status === 'suspended' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}">
                {school.status || 'PENDIENTE'}
              </div>
              <Buildings weight="thin" class="text-slate-700 group-hover:text-primary-500 transition-colors" size={20} />
            </div>
            <h3 class="text-lg font-black font-display italic uppercase text-white truncate mb-1">{school.name}</h3>
            <p class="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">{school.city || 'Sin ciudad'} • {school.teacherId?.slice(0, 8)}...</p>
          </div>

          <div class="mt-8 flex items-center gap-2">
            {#if school.status !== 'active'}
              <button 
                onclick={() => handleUpdateStatus(school.id, 'active')}
                class="flex-1 h-10 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-black border border-emerald-500/20 text-[9px] font-mono font-black uppercase tracking-widest transition-all"
              >
                ACTIVAR
              </button>
            {/if}
            {#if school.status !== 'suspended'}
              <button 
                onclick={() => handleUpdateStatus(school.id, 'suspended')}
                class="flex-1 h-10 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 text-[9px] font-mono font-black uppercase tracking-widest transition-all"
              >
                SUSPENDER
              </button>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
