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

<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <!-- System Health Card -->
  <div class="lg:col-span-1 space-y-6">
    <div class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 p-8 rounded-none shadow-2xl relative overflow-hidden group">
      <div class="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
        <Shield weight="duotone" class="w-24 h-24" />
      </div>
      
      <h3 class="text-xl font-black font-display uppercase italic tracking-wider mb-8 flex items-center gap-3 text-white">
        <Shield weight="duotone" class="w-6 h-6 text-primary-500" />
        {$t('admin.system.security_title')}
      </h3>

      <div class="space-y-6">
        <div class="flex items-center justify-between p-4 bg-black/20 rounded-none border border-white/5">
          <div>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{$t('admin.system.maintenance_label')}</p>
            <p class="text-xs font-bold {maintenanceMode ? 'text-red-400' : 'text-violet-400'} uppercase">
              {maintenanceMode ? $t('admin.system.active') : $t('admin.system.inactive')}
            </p>
          </div>
          <button 
            onclick={onToggleMaintenance}
            class="px-4 py-2 rounded-none text-[9px] font-black uppercase tracking-widest transition-all {maintenanceMode ? 'bg-red-500 text-white' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}"
          >
            {maintenanceMode ? $t('admin.system.turn_off') : $t('admin.system.turn_on')}
          </button>
        </div>

        <div class="p-4 bg-black/20 rounded-none border border-white/5 space-y-3">
          <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{$t('admin.system.data_optimization')}</p>
          <button 
            onclick={onRepairData}
            class="w-full py-4 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-violet-500 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Database weight="fill" class="w-4 h-4" />
            {$t('admin.system.sync_indices')}
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Status -->
    <div class="bg-gradient-to-br from-primary-500/20 to-violet-500/20 backdrop-blur-xl border border-white/10 p-8 rounded-none shadow-2xl">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-10 h-10 rounded-none bg-white/10 flex items-center justify-center">
          <Pulse class="w-5 h-5 text-white animate-pulse" />
        </div>
        <h4 class="font-black uppercase italic tracking-widest text-sm text-white">{$t('admin.system.server_status')}</h4>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{$t('admin.system.api_latency')}</p>
          <p class="text-xl font-bold font-display italic text-white">24ms</p>
        </div>
        <div class="space-y-1">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{$t('admin.system.uptime')}</p>
          <p class="text-xl font-bold font-display italic text-violet-400">99.9%</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Real-time Console Log -->
  <div class="lg:col-span-2 bg-[#0f172a] border border-white/5 rounded-none shadow-2xl overflow-hidden flex flex-col">
    <div class="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-black/40">
      <div class="flex items-center gap-3">
        <Terminal weight="bold" class="w-5 h-5 text-primary-500" />
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          {$t('admin.system.console_title')}
          <span class="inline-flex w-2 h-2 rounded-none bg-primary-500 animate-pulse"></span>
        </h3>
      </div>
      <div class="flex items-center gap-2">
        <button 
          onclick={onClearLogs}
          class="p-2 text-slate-600 hover:text-red-400 transition-colors"
          title={$t('admin.system.clear_console')}
        >
          <Trash weight="bold" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto max-h-[500px] p-6 font-mono text-[11px] space-y-2 custom-scrollbar">
      {#each logs as log (log.id)}
        <div class="flex gap-4 group hover:bg-white/[0.02] p-1 rounded transition-colors" in:slide>
          <span class="text-slate-600 shrink-0 select-none">[{formatTime(log.timestamp)}]</span>
          <span class="px-2 h-4 flex items-center rounded-none shrink-0 border {getStatusColor(log.status)} font-black uppercase text-[8px] tracking-tighter">
            {log.status || 'INFO'}
          </span>
          <div class="flex-1">
            <span class="text-slate-300 font-bold uppercase tracking-tight">{log.type || log.action}:</span>
            <span class="text-slate-500 ml-2 italic">
               {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
            </span>
          </div>
        </div>
      {/each}
      
      {#if logs.length === 0}
        <div class="h-full flex flex-col items-center justify-center text-slate-700 py-10 space-y-4">
          <Bug weight="thin" class="w-12 h-12 opacity-20" />
          <p class="italic text-white">{$t('admin.system.waiting_events')}</p>
        </div>
      {/if}
    </div>

    <div class="px-8 py-4 bg-black/20 border-t border-white/5 text-[9px] text-slate-600 flex justify-between items-center italic">
      <span>Connected to firebase-production-instance-01</span>
      <span>UTF-8 Bash-Agent</span>
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
