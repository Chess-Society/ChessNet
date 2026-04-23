<script lang="ts">
  import { t } from '$lib/i18n';
  import { 
    Pulse, 
    UserPlus, 
    Terminal, 
    Shield, 
    Clock, 
    Bug,
    Info,
    Warning,
    Medal,
    Sparkle
  } from 'phosphor-svelte';
  import { slide, fade } from 'svelte/transition';

  interface Props {
    activities: {
      id: string;
      type: 'user_joined' | 'system_log' | 'report' | 'insignia_unlocked';
      title: string;
      subtitle: string;
      timestamp: string;
      status?: 'info' | 'warning' | 'error' | 'success' | 'premium';
      meta?: any;
    }[];
  }

  let { activities }: Props = $props();

  function formatTime(timestamp: string) {
    if (!timestamp) return '--:--';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return $t('common.time.just_now');
    if (diff < 3600000) return $t('common.time.minutes', { n: Math.floor(diff / 60000) });
    if (diff < 86400000) return $t('common.time.hours', { n: Math.floor(diff / 3600000) });
    return date.toLocaleDateString();
  }

  function getStatusIcon(activity: any) {
    if (activity.type === 'user_joined') return UserPlus;
    if (activity.type === 'insignia_unlocked') return Medal;
    if (activity.status === 'error') return Bug;
    if (activity.status === 'warning') return Warning;
    return Info;
  }

  function getStatusColor(status?: string) {
    switch (status) {
      case 'error': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'warning': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      case 'success': return 'bg-violet-500/20 text-violet-500 border-violet-500/30';
      case 'premium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_15px_-5px_rgba(245,158,11,0.5)]';
      default: return 'bg-primary-500/20 text-primary-500 border-primary-500/30';
    }
  }
</script>

<div class="bg-black border border-white/10 rounded-none shadow-2xl flex flex-col overflow-hidden">
  <div class="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
    <div class="flex items-center gap-3">
      <div class="p-2 bg-primary-500/10 border border-primary-500/20 rounded-none">
        <Pulse weight="bold" class="w-4 h-4 text-primary-500 animate-pulse" />
      </div>
      <h3 class="text-xs font-mono font-black uppercase tracking-[0.3em] text-white">{$t('admin.activity.pulse')}</h3>
    </div>
    <span class="text-[9px] font-mono font-black text-slate-700 uppercase tracking-widest bg-white/5 px-3 py-1 border border-white/5 rounded-none">FLUJO_DE_RED</span>
  </div>

  <div class="flex-1 overflow-y-auto max-h-[450px] divide-y divide-white/5 custom-scrollbar">
    {#each activities as act (act.id)}
      {@const Icon = getStatusIcon(act)}
      <div 
        class="group flex items-center gap-6 p-6 hover:bg-white/[0.01] transition-all relative overflow-hidden"
        in:slide={{ axis: 'y' }}
      >
        <div class="relative flex-shrink-0">
          <div class="w-12 h-12 rounded-none flex items-center justify-center border {getStatusColor(act.status)} group-hover:scale-105 transition-transform bg-black">
            <Icon weight="bold" class="w-5 h-5" />
          </div>
          {#if act.type === 'user_joined'}
             <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-primary-500 border border-black rounded-none"></div>
          {/if}
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-1">
            <h4 class="text-sm font-black text-white truncate group-hover:text-primary-400 transition-colors uppercase italic font-display">{act.title}</h4>
            <div class="h-px flex-1 bg-white/[0.02] group-hover:bg-primary-500/20 transition-colors"></div>
            <span class="text-[9px] font-mono font-black text-slate-700 uppercase tracking-tighter shrink-0">{formatTime(act.timestamp)}</span>
          </div>
          <p class="text-[10px] font-mono font-black text-slate-600 uppercase tracking-wide truncate italic">{act.subtitle}</p>
        </div>

        <div class="opacity-0 group-hover:opacity-100 transition-opacity">
           <button class="h-10 w-10 bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-primary-500 transition-all rounded-none">
              <Clock weight="bold" class="w-4 h-4" />
           </button>
        </div>
      </div>
    {:else}
      <div class="h-64 flex flex-col items-center justify-center py-10 space-y-6">
        <div class="relative">
          <Terminal weight="bold" class="w-12 h-12 text-slate-900" />
          <div class="absolute inset-0 border border-slate-800 animate-pulse"></div>
        </div>
        <p class="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-700">{$t('admin.activity.waiting')}</p>
      </div>
    {/each}
  </div>

  <div class="px-8 py-5 bg-white/[0.01] border-t border-white/10 text-[8px] font-mono font-black text-slate-700 flex justify-between items-center uppercase tracking-widest">
    <div class="flex items-center gap-4">
      <span class="text-slate-800">MONITOREANDO:</span>
      <span class="flex items-center gap-1"><span class="w-1 h-1 bg-violet-500"></span> SOCKET_AUTENTICACION</span>
      <span class="flex items-center gap-1"><span class="w-1 h-1 bg-violet-500"></span> COLECCION_FS</span>
    </div>
    <div class="flex items-center gap-2 text-emerald-500/50">
      <div class="w-1.5 h-1.5 bg-emerald-500 rounded-none animate-pulse"></div>
      <span>ACTIVO</span>
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
