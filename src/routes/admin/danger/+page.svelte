<script lang="ts">
  import { adminApi } from '$lib/api/admin';
  import { systemConfig } from '$lib/stores/configStore';
  import { t } from '$lib/i18n';
  import { fly } from 'svelte/transition';
  import { toast } from '$lib/stores/toast';

  // Components
  import DangerZone from '$lib/components/admin/DangerZone.svelte';

  let isSaving = $state(false);

  async function handleToggleMaintenance() {
    const next = !$systemConfig.maintenanceMode;
    isSaving = true;
    try {
      await adminApi.toggleMaintenanceMode(next);
      toast.success($t('admin.system.maintenance_toggle_success'));
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    } finally {
      isSaving = false;
    }
  }

  async function handleRepairUsers() {
    isSaving = true;
    try {
      const res = await adminApi.repairUsersData();
      toast.success($t('admin.msg.sync_complete', { count: res.count }));
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    } finally {
      isSaving = false;
    }
  }
</script>

<div class="space-y-12" in:fly={{ y: 20, duration: 500 }}>
  <div class="flex items-center gap-6">
    <div class="w-16 h-16 bg-red-600 text-white flex items-center justify-center font-display italic font-black text-3xl">
      !!
    </div>
    <div>
       <h2 class="text-5xl font-black font-display uppercase italic tracking-tighter text-white leading-none">ZONA CRÍTICA</h2>
       <p class="text-slate-500 text-[10px] font-mono font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
         <span class="w-1.5 h-1.5 bg-red-500 rounded-none animate-bounce"></span>
         OPERACIONES DE ALTO RIESGO
       </p>
    </div>
  </div>

  <DangerZone 
    onRepairIntegrity={handleRepairUsers}
    onToggleMaintenance={handleToggleMaintenance}
    maintenanceMode={$systemConfig.maintenanceMode}
    {isSaving}
  />
</div>
