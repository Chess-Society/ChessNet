<script lang="ts">
  import { adminLogs, adminStore } from '$lib/stores/adminStore';
  import { adminApi } from '$lib/api/admin';
  import { systemConfig } from '$lib/stores/configStore';
  import { t } from '$lib/i18n';
  import { fly } from 'svelte/transition';
  import { toast } from '$lib/stores/toast';

  // Components
  import SystemConsole from '$lib/components/admin/SystemConsole.svelte';

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

  function handleClearLogs() {
    adminLogs.set([]);
  }
</script>

<div class="space-y-12" in:fly={{ y: 20, duration: 500 }}>
  <div class="flex items-center gap-6">
    <div class="w-16 h-16 bg-white text-black flex items-center justify-center font-display italic font-black text-3xl">
      06
    </div>
    <div>
       <h2 class="text-5xl font-black font-display uppercase italic tracking-tighter text-white leading-none">{$t('admin.system.engine')}</h2>
       <p class="text-slate-500 text-[10px] font-mono font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
         <span class="w-1.5 h-1.5 bg-violet-500 rounded-none animate-pulse"></span>
         {$t('admin.system.engine_desc')}
       </p>
    </div>
  </div>
  
   <!-- Production Status Console -->
   <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-6 bg-white/[0.02] border border-white/5">
        <p class="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest mb-1">CORE_ENGINE_STATUS</p>
        <div class="flex items-center gap-3">
           <div class="w-1.5 h-1.5 bg-emerald-500 rounded-none animate-pulse"></div>
           <p class="text-xl font-black font-display italic text-white uppercase">Operational</p>
        </div>
      </div>
      <div class="p-6 bg-white/[0.02] border border-white/5">
        <p class="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest mb-1">NETWORK_RELIABILITY</p>
        <p class="text-xl font-black font-display italic text-violet-400 uppercase">99.99% Guaranteed</p>
      </div>
   </div>
  
   <SystemConsole 
    logs={$adminLogs}
    maintenanceMode={$systemConfig.maintenanceMode}
    onToggleMaintenance={handleToggleMaintenance}
    onRepairData={handleRepairUsers}
    onClearLogs={handleClearLogs}
  />
</div>
