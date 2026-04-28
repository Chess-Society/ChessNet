<script lang="ts">
  import { adminUsers, adminStore } from '$lib/stores/adminStore';
  import { adminApi } from '$lib/api/admin';
  import { t } from '$lib/i18n';
  import { fly, fade } from 'svelte/transition';
  import { toast } from '$lib/stores/toast';
  import { uiStore } from '$lib/stores/uiStore';
  
  import { 
    UserCircle,
    Crown,
    X,
    ShieldCheckered,
    CheckCircle
  } from 'phosphor-svelte';

  // Components
  import UserTable from '$lib/components/admin/UserTable.svelte';

  let isLoading = $state(false);
  let isSaving = $state(false);
  let searchTimeout: any;

  // Selection/Modals
  let selectedUser = $state<any>(null);
  let showEditModal = $state(false);
  let userDetails = $state<any>(null);
  let isLoadingDetails = $state(false);

  async function handleSearchUsers(queryStr: string) {
    if (searchTimeout) clearTimeout(searchTimeout);
    
    searchTimeout = setTimeout(async () => {
      isLoading = true;
      try {
        const results = await adminApi.getUsersList(100, queryStr);
        adminUsers.set(results);
      } catch (e) {
        toast.error($t('admin.broadcast.error'));
      } finally {
        isLoading = false;
      }
    }, 300);
  }

  async function openUserDetails(user: any) {
    selectedUser = user;
    showEditModal = true;
    isLoadingDetails = true;
    try {
      const details = await adminApi.getUserDetails(user.id);
      userDetails = details;
    } catch (err) {
      toast.error($t('admin.broadcast.error'));
    } finally {
      isLoadingDetails = false;
    }
  }

  async function handleGrantPremium(userId: string, days: number) {
    isSaving = true;
    try {
      await adminApi.grantTrial(userId, days);
      toast.success($t('admin.users.grant_success'));
      // No need to manual update, real-time snapshot will catch it
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    } finally {
      isSaving = false;
    }
  }

  async function handleRevokePremium(userId: string) {
    const confirmed = await uiStore.confirm({
      title: $t('admin.msg.revoke_premium_confirm'),
      message: $t('common.undone_action'),
      type: 'danger',
      confirmText: $t('common.delete'),
      cancelText: $t('common.cancel')
    });

    if (!confirmed) return;
    isSaving = true;
    try {
      await adminApi.revokePremium(userId);
      toast.success($t('admin.users.revoke_success'));
    } catch (e: any) {
      toast.error(e.message || $t('admin.broadcast.error'));
    } finally {
      isSaving = false;
    }
  }

  async function handleImpersonate(user: any) {
    const confirmed = await uiStore.confirm({
      title: $t('admin.msg.impersonate_confirm', { email: user.email }),
      message: $t('admin.msg.impersonate_warning'),
      type: 'warning',
      confirmText: $t('common.accept'),
      cancelText: $t('common.cancel')
    });

    if (!confirmed) return;
    
    try {
      document.cookie = `impersonate_id=${user.id}; path=/; max-age=3600; SameSite=Lax`;
      document.cookie = `impersonate_email=${user.email}; path=/; max-age=3600; SameSite=Lax`;
      
      toast.success($t('admin.msg.impersonate_start', { email: user.email }));
      setTimeout(() => {
        window.location.href = `/panel`;
      }, 1000);
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    }
  }

  async function handlePromoteDirector(userId: string) {
    const schoolName = prompt("Nombre de la Escuela/Club:", "Mi Escuela de Ajedrez");
    if (!schoolName) return;

    const confirmed = await uiStore.confirm({
      title: 'Promover a Director',
      message: `¿Estás seguro de que quieres dar permisos de Director de "${schoolName}" a este usuario?`,
      type: 'warning',
      confirmText: 'PROMOVER',
      cancelText: 'CANCELAR'
    });

    if (!confirmed) return;
    isSaving = true;
    try {
      await adminApi.promoteToDirector(userId, schoolName);
      toast.success('Usuario promovido a Director correctamente');
    } catch (e: any) {
      toast.error(e.message || $t('admin.broadcast.error'));
    } finally {
      isSaving = false;
    }
  }

  function getPlanStatus(user: any) {
    const plan = user.settings?.plan;
    if (plan === 'premium' || plan === 'pro') {
      if (user.settings?.planExpiresAt && new Date(user.settings.planExpiresAt) < new Date()) {
        return 'expired';
      }
      return 'pro';
    }
    return 'free';
  }
</script>

<div class="space-y-12" in:fly={{ y: 20, duration: 500 }}>
  <div class="flex items-center gap-6">
    <div class="w-16 h-16 bg-white text-black flex items-center justify-center font-display italic font-black text-3xl">
      02
    </div>
    <div>
       <h2 class="text-5xl font-black font-display uppercase italic tracking-tighter text-white leading-none">{$t('admin.users.list_title')}</h2>
       <p class="text-slate-500 text-[10px] font-mono font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
         <span class="w-1.5 h-1.5 bg-primary-500 rounded-none"></span>
         {$t('admin.users.list_subtitle')}
       </p>
    </div>
  </div>

  <UserTable 
     users={$adminUsers} 
     onEdit={openUserDetails}
     onImpersonate={handleImpersonate}
     onSearch={handleSearchUsers}
  />
</div>

<!-- User Detail Modal (Replicated from original with slight improvements) -->
{#if showEditModal && selectedUser}
  {@const status = getPlanStatus(selectedUser)}
  {@const expiry = selectedUser.settings?.planExpiresAt ? new Date(selectedUser.settings.planExpiresAt) : null}
  <div class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 bg-black/95 backdrop-blur-xl" transition:fade>
    <div 
      class="bg-[#02040a] w-full max-w-2xl border-t sm:border border-white/10 shadow-2xl overflow-hidden relative h-[95vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto rounded-none"
      transition:fly={{ y: 100, duration: 400 }}
    >
      <!-- Modal Header -->
      <div class="sticky top-0 z-10 px-8 py-5 border-b border-white/10 flex items-center justify-between bg-[#02040a]/95 backdrop-blur-xl">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-violet-400 rounded-none">
            <UserCircle class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-mono font-black uppercase tracking-widest text-white">{$t('admin.modal.command_manager')}</h3>
            <p class="text-[9px] font-mono text-slate-600 uppercase mt-0.5 truncate max-w-[200px]">{selectedUser?.email}</p>
          </div>
        </div>
        <button 
          onclick={() => showEditModal = false}
          class="w-8 h-8 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all cursor-pointer text-white rounded-none"
        >
          <X weight="bold" class="w-4 h-4" />
        </button>
      </div>

      <div class="p-8 space-y-8">
         <!-- Entity Counts -->
         <div class="grid grid-cols-3 gap-px bg-white/10 border border-white/10">
            {#each [
              { label: $t('admin.stats.schools'), val: userDetails?.schools || 0 },
              { label: $t('admin.stats.classes'), val: userDetails?.classes || 0 },
              { label: $t('admin.stats.students'), val: userDetails?.students || 0 }
            ] as ent}
              <div class="bg-[#02040a] p-5 text-center">
                <p class="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest mb-2 truncate">{ent.label}</p>
                {#if isLoadingDetails}
                  <div class="h-7 w-12 bg-white/5 animate-pulse mx-auto rounded-none"></div>
                {:else}
                  <span class="text-3xl font-black font-display italic text-white leading-none">{ent.val}</span>
                {/if}
              </div>
            {/each}
         </div>


          <!-- Premium Management Section -->
          <div class="bg-zinc-900/20 border border-white/5 p-6 space-y-8">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 {status === 'pro' ? 'bg-amber-500/20 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'bg-slate-500/10 text-slate-500'} flex items-center justify-center border {status === 'pro' ? 'border-amber-500/30' : 'border-white/10'}">
                  <Crown weight={status === 'pro' ? 'fill' : 'bold'} class="w-6 h-6" />
                </div>
                <div>
                  <p class="text-[8px] font-mono font-black text-slate-500 uppercase tracking-[0.3em]">ESTADO SUSCRIPCIÓN</p>
                  <h4 class="text-xl font-black font-display italic uppercase tracking-tight {status === 'pro' ? 'text-amber-500' : status === 'expired' ? 'text-rose-500' : 'text-slate-400'}">
                    {status === 'pro' ? 'Premium Active' : status === 'expired' ? 'Plan Expirado' : 'Plan Gratuito'}
                  </h4>
                </div>
              </div>
              
              {#if selectedUser.settings?.planExpiresAt}
                <div class="text-right">
                  <p class="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest">FECHA DE CADUCIDAD</p>
                  <p class="text-sm font-black font-display italic text-white">{new Date(selectedUser.settings.planExpiresAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</p>
                </div>
              {/if}
            </div>

            <!-- Visual Progress Bar -->
            {#if status === 'pro' && selectedUser.settings?.planExpiresAt && expiry}
              {@const now = new Date()}
              {@const total = 30 * 24 * 60 * 60 * 1000} 
              {@const remaining = expiry.getTime() - now.getTime()}
              {@const percentage = Math.max(0, Math.min(100, (remaining / total) * 100))}
              <div class="space-y-3">
                <div class="flex items-center justify-between text-[10px] font-mono font-black uppercase">
                  <span class="text-amber-500/80">Tiempo restante</span>
                  <span class="text-white">{Math.ceil(remaining / (1000 * 60 * 60 * 24))} días</span>
                </div>
                <div class="h-2 w-full bg-black border border-white/5 relative overflow-hidden">
                  <div 
                    class="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 transition-all duration-1000" 
                    style="width: {percentage}%"
                  >
                    <div class="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <div class="flex justify-between text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest">
                  <span>Iniciado</span>
                  <span>{percentage.toFixed(1)}% de cobertura</span>
                  <span>Expiración</span>
                </div>
              </div>
            {/if}

            <!-- Action Buttons -->
            <div class="space-y-4">
              <p class="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest text-center">CONCEDER TIEMPO ADICIONAL</p>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10 overflow-hidden shadow-2xl">
                {#each [3, 7, 30, 365] as days}
                  {@const baseDate = status === 'pro' && selectedUser.settings?.planExpiresAt ? new Date(selectedUser.settings.planExpiresAt) : new Date()}
                  {@const newDate = new Date(baseDate)}
                  {@const _ = newDate.setDate(newDate.getDate() + days)}
                  <button 
                    onclick={() => handleGrantPremium(selectedUser?.id, days)}
                    disabled={isSaving}
                    class="py-6 px-2 bg-[#02040a] text-[10px] font-mono font-black uppercase tracking-widest transition-all hover:bg-amber-500 hover:text-black disabled:opacity-50 text-slate-400 cursor-pointer rounded-none flex flex-col items-center gap-2 group"
                  >
                    <span class="text-lg group-hover:scale-110 transition-transform">+{days}d</span>
                    <div class="flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span class="text-[6px] text-black font-black uppercase">Nueva fecha:</span>
                      <span class="text-[8px] text-black font-black">{newDate.toLocaleDateString()}</span>
                    </div>
                  </button>
                {/each}
              </div>

              {#if status === 'pro' || status === 'expired'}
                <button 
                  onclick={() => handleRevokePremium(selectedUser?.id)}
                  class="w-full py-4 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 text-[10px] font-mono font-black uppercase tracking-widest transition-all cursor-pointer rounded-none mt-4"
                >
                  CANCELAR SUSCRIPCIÓN INMEDIATAMENTE
                </button>
              {/if}
            </div>
          </div>

          <!-- Roles Section -->
          <div class="space-y-4 pt-6 border-t border-white/5">
            <div class="flex items-center gap-3">
              <ShieldCheckered weight="duotone" class="w-4 h-4 text-emerald-500" />
              <p class="text-[9px] font-mono font-black text-slate-500 uppercase tracking-[0.3em]">ROLES Y PERMISOS</p>
            </div>
            
            {#if selectedUser?.settings?.role === 'director'}
              <div class="p-4 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <CheckCircle weight="fill" class="text-emerald-500" />
                  <span class="text-[10px] font-mono font-black text-emerald-400 uppercase">EL USUARIO YA ES DIRECTOR</span>
                </div>
              </div>
            {:else}
              <button 
                onclick={() => handlePromoteDirector(selectedUser?.id)}
                disabled={isSaving}
                class="w-full py-3.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-mono font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all cursor-pointer rounded-none disabled:opacity-50"
              >
                PROMOVER A DIRECTOR
              </button>
            {/if}
          </div>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
</style>
