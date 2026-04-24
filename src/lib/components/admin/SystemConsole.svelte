<script lang="ts">
  import { t } from '$lib/i18n';
  import { 
    Terminal, 
    Shield, 
    Database, 
    Warning,
    Pulse,
    Clock,
    XCircle,
    CheckCircle,
    Trash,
    Bug
  } from 'phosphor-svelte';
  import { fade, slide } from 'svelte/transition';

  interface Props {
    logs: any[];
    maintenanceMode: boolean;
    onToggleMaintenance: () => void;
    onRepairData: () => void;
    onClearLogs: () => void;
  }

  let { logs, maintenanceMode, onToggleMaintenance, onRepairData, onClearLogs }: Props = $props();

  function formatTime(timestamp: string) {
    if (!timestamp) return '--:--';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'error': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'success': return 'text-violet-400 bg-violet-500/10 border-violet-500/20';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  }
</script>

<div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
  <!-- System Health Card -->
  <div class="lg:col-span-1 space-y-6">
    <div class="bg-black border border-white/10 p-8 rounded-none shadow-2xl relative overflow-hidden group">
      <div class="absolute top-0 right-0 p-4 opacity-5 font-mono text-[8px] leading-tight select-none">
        SEC_LEVEL: 04<br/>
        ENCRYPTION: AES-256
      </div>
      
      <h3 class="text-xs font-mono font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-4 text-white">
        <div class="p-2 bg-primary-500/10 border border-primary-500/20">
          <Shield weight="bold" class="w-5 h-5 text-primary-500" />
        </div>
        {$t('admin.system.security_title')}
      </h3>

      <div class="space-y-6">
        <div class="flex items-center justify-between p-5 bg-white/[0.01] rounded-none border border-white/5">
          <div class="space-y-1">
            <p class="text-[8px] font-mono font-black text-slate-800 uppercase tracking-widest">MAINT_STATUS</p>
            <p class="text-[10px] font-mono font-black {maintenanceMode ? 'text-red-500' : 'text-emerald-500'} uppercase">
              {maintenanceMode ? 'ACTIVE_PROTECT' : 'NOMINAL_OPER'}
            </p>
          </div>
          <button 
            onclick={onToggleMaintenance}
            class="px-4 py-2 rounded-none text-[8px] font-mono font-black uppercase tracking-widest transition-all {maintenanceMode ? 'bg-red-500 text-black' : 'bg-white/5 text-slate-500 border border-white/10 hover:border-white/30 hover:text-white'}"
          >
            {maintenanceMode ? 'DISABLE' : 'ENGAGE'}
          </button>
        </div>

        <div class="p-5 bg-white/[0.01] rounded-none border border-white/5 space-y-4">
          <p class="text-[8px] font-mono font-black text-slate-800 uppercase tracking-widest">DATA_INTEGRITY</p>
          <button 
            onclick={onRepairData}
            class="w-full py-4 bg-primary-500 text-black rounded-none text-[9px] font-mono font-black uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center gap-3"
          >
            <Database weight="bold" class="w-4 h-4" />
            REPAIR_INDICES
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Status -->
    <div class="bg-black border border-white/10 p-8 rounded-none shadow-2xl relative overflow-hidden">
      <div class="flex items-center gap-4 mb-8">
        <div class="w-10 h-10 rounded-none bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
          <Pulse weight="bold" class="w-5 h-5 text-primary-500 animate-pulse" />
        </div>
        <h4 class="font-mono font-black uppercase tracking-[0.2em] text-xs text-white">{$t('admin.system.server_status')}</h4>
      </div>
      <div class="grid grid-cols-1 gap-6">
        <div class="flex items-center gap-3">
          <div class="w-1.5 h-1.5 bg-emerald-500 animate-pulse"></div>
          <p class="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Core Status: Normal</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Real-time Console Log -->
  <div class="lg:col-span-3 bg-black border border-white/10 rounded-none shadow-2xl overflow-hidden flex flex-col">
    <div class="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
      <div class="flex items-center gap-4">
        <div class="p-2 bg-white/5 border border-white/10">
          <Terminal weight="bold" class="w-4 h-4 text-white" />
        </div>
        <h3 class="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
          {$t('admin.system.console_title')}
          <span class="inline-flex w-1.5 h-1.5 bg-primary-500 animate-pulse"></span>
        </h3>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-[8px] font-mono text-slate-800 tracking-tighter">STREAM: ACTIVE</span>
        <button 
          onclick={onClearLogs}
          class="h-8 w-8 flex items-center justify-center text-slate-700 hover:text-red-500 border border-transparent hover:border-red-500/20 transition-all"
          title={$t('admin.system.clear_console')}
        >
          <Trash weight="bold" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto max-h-[550px] divide-y divide-white/[0.02] custom-scrollbar">
      {#each logs as log (log.id)}
        <div class="flex gap-6 group hover:bg-white/[0.01] p-5 transition-colors" in:slide>
          <span class="text-slate-800 shrink-0 font-mono text-[9px] tracking-tighter uppercase">[{formatTime(log.timestamp)}]</span>
          <span class="px-2 h-4 flex items-center rounded-none shrink-0 border {getStatusColor(log.status)} font-mono font-black uppercase text-[7px] tracking-tighter">
            {log.status || 'INFO'}
          </span>
          <div class="flex-1 min-w-0">
            <span class="text-slate-500 font-mono font-black uppercase text-[9px] tracking-wider">{log.type || log.action}:</span>
            <span class="text-slate-700 ml-4 font-mono text-[10px] uppercase break-all">
               {log.message || (typeof log.details === 'string' ? log.details : JSON.stringify(log.details))}
            </span>
          </div>
        </div>
      {:else}
        <div class="h-64 flex flex-col items-center justify-center py-20 space-y-6">
          <div class="relative">
            <Bug weight="bold" class="w-12 h-12 text-slate-900" />
            <div class="absolute inset-0 border border-slate-800 animate-pulse"></div>
          </div>
          <p class="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-800">{$t('admin.system.waiting_events')}</p>
        </div>
      {/each}
    </div>

    <div class="px-8 py-5 bg-white/[0.01] border-t border-white/10 text-[8px] font-mono font-black text-slate-800 flex justify-between items-center uppercase tracking-[0.2em]">
      <div class="flex items-center gap-6">
        <span>INSTANCE: PRODUCTION</span>
        <span>MODE: CLOUD_FS</span>
      </div>
      <div class="flex items-center gap-2 text-emerald-500/30">
        <div class="w-1.5 h-1.5 bg-emerald-500/50 rounded-none"></div>
        <span>SYNC_ESTABLISHED</span>
      </div>
    </div>
  </div>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.1);
  }
</style>
