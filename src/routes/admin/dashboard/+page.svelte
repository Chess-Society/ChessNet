<script lang="ts">
  import { adminStats, adminActivities, adminStore } from '$lib/stores/adminStore';
  import { systemConfig } from '$lib/stores/configStore';
  import { t } from '$lib/i18n';
  import { fly } from 'svelte/transition';
  
  import { 
    Pulse, 
    ArrowArcLeft, 
    Megaphone, 
    Users, 
    Ticket, 
    ListDashes,
    ChartBar
  } from 'phosphor-svelte';

  // Components
  import StatsGrid from '$lib/components/admin/StatsGrid.svelte';
  import LiveActivityFeed from '$lib/components/admin/LiveActivityFeed.svelte';

  function refresh() {
    adminStore.refreshStats();
  }
</script>

<div class="space-y-12" in:fly={{ y: 20, duration: 500 }}>
  <!-- Dashboard Header -->
  <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-white text-black flex items-center justify-center font-display italic font-black text-xl sm:text-2xl">
          01
        </div>
        <div>
          <div class="inline-flex items-center gap-2 px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 text-[8px] font-mono font-black text-violet-400 uppercase tracking-[0.3em]">
            <span class="w-1 h-1 bg-violet-500 animate-pulse"></span>
            {$t('admin.dashboard.sync')}
          </div>
          <h2 class="text-4xl sm:text-5xl md:text-7xl font-black font-display uppercase italic tracking-[-0.05em] leading-[0.8] mt-2">
            CENTRAL<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">OPERACIONES</span>
          </h2>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <a 
        href="/panel" 
        class="h-14 px-8 border border-white/10 hover:bg-white/5 text-white transition-all flex items-center gap-3 font-black text-xs uppercase tracking-widest group rounded-none no-underline"
      >
        <ArrowArcLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        VOLVER AL PANEL
      </a>

      <button 
        onclick={refresh} 
        class="h-14 px-8 bg-white hover:bg-primary-500 hover:text-white text-black transition-all flex items-center gap-3 font-black text-xs uppercase tracking-widest group rounded-none"
      >
        <Pulse class="w-5 h-5 group-hover:animate-pulse" />
        {$t('admin.dashboard.refresh')}
      </button>
    </div>
  </div>

  <!-- Quick Shortcuts -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <a 
      href="/admin/broadcast"
      class="p-6 bg-white/[0.02] border border-white/5 hover:border-primary-500/50 hover:bg-primary-500/5 transition-all text-left group no-underline"
    >
      <div class="flex items-center gap-4 mb-4">
        <div class="p-2 bg-primary-500/10 text-primary-500 border border-primary-500/20">
          <Megaphone weight="bold" size={18} />
        </div>
        <span class="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest">COMUNICACIÓN</span>
      </div>
      <h4 class="text-xs font-black text-white uppercase italic">CREAR_AVISO_GLOBAL</h4>
    </a>

    <a 
      href="/admin/users"
      class="p-6 bg-white/[0.02] border border-white/5 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all text-left group no-underline"
    >
      <div class="flex items-center gap-4 mb-4">
        <div class="p-2 bg-violet-500/10 text-violet-400 border border-violet-500/20">
          <Users weight="bold" size={18} />
        </div>
        <span class="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest">AUDITORÍA</span>
      </div>
      <h4 class="text-xs font-black text-white uppercase italic">GESTIÓN_USUARIOS</h4>
    </a>

    <a 
      href="/admin/support"
      class="p-6 bg-white/[0.02] border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left group no-underline"
    >
      <div class="flex items-center gap-4 mb-4">
        <div class="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Ticket weight="bold" size={18} />
        </div>
        <span class="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest">ATENCIÓN</span>
      </div>
      <h4 class="text-xs font-black text-white uppercase italic">TICKETS_SOPORTE</h4>
    </a>

    <a 
      href="/admin/system"
      class="p-6 bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all text-left group no-underline"
    >
      <div class="flex items-center gap-4 mb-4">
        <div class="p-2 bg-white/5 text-slate-400 border border-white/10">
          <ListDashes weight="bold" size={18} />
        </div>
        <span class="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest">MOTOR</span>
      </div>
      <h4 class="text-xs font-black text-white uppercase italic">LOGS_SISTEMA</h4>
    </a>
  </div>

  <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <!-- Monitoring Feed -->
      <div class="xl:col-span-8 space-y-8">
         <StatsGrid stats={$adminStats} />
         
         <!-- Recent Activity Preview -->
         <div class="bg-black/40 border border-white/5 p-8">
            <div class="flex items-center justify-between mb-6">
               <div class="flex items-center gap-3">
                 <ChartBar weight="fill" class="text-primary-500" />
                 <h3 class="text-xs font-mono font-black uppercase tracking-[0.3em] text-white">ÚLTIMA ACTIVIDAD</h3>
               </div>
               <a href="/admin/system" class="text-[8px] font-mono text-primary-400 uppercase tracking-widest hover:underline no-underline">Ver todos los logs</a>
            </div>
            <LiveActivityFeed activities={$adminActivities.slice(0, 10)} />
         </div>
      </div>

     <!-- Environment Info -->
     <div class="xl:col-span-4 space-y-8">
        <div class="bg-zinc-900/40 border border-white/5 p-6">
           <div class="flex items-center justify-between mb-4">
              <h4 class="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">ESTADO_ENTORNO</h4>
              <span class="text-[8px] font-black bg-emerald-500 px-1.5 py-0.5 text-black">ONLINE</span>
           </div>
           <div class="space-y-4">
             <div class="flex justify-between text-[10px] font-mono font-black">
               <span class="text-slate-700">VERSION</span>
               <span class="text-slate-400">v1.2.0-STABLE</span>
             </div>
             <div class="flex justify-between text-[10px] font-mono font-black">
               <span class="text-slate-700">MANTENIMIENTO</span>
               <span class="{$systemConfig.maintenanceMode ? 'text-red-500' : 'text-emerald-500'} italic">
                 {$systemConfig.maintenanceMode ? 'ACTIVO' : 'INACTIVO'}
               </span>
             </div>
             <div class="flex justify-between text-[10px] font-mono font-black">
               <span class="text-slate-700">REGIÓN</span>
               <span class="text-slate-400 italic">eu-west-3</span>
             </div>
           </div>
        </div>

        <div class="p-6 bg-primary-500/5 border border-primary-500/20">
          <p class="text-[8px] font-mono font-black text-primary-400 uppercase tracking-widest mb-2">REVENUE ESTIMADO</p>
          <p class="text-2xl font-black font-display italic text-white">${($adminStats.totalRevenue ?? 0).toLocaleString()}</p>
          <div class="mt-4 pt-4 border-t border-primary-500/10">
            <p class="text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest mb-1">CONVERSIÓN PREMIUM</p>
            <p class="text-lg font-black font-display italic text-primary-300">
              {(($adminStats.premiumUsers / ($adminStats.totalUsers || 1)) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
     </div>
  </div>
</div>
