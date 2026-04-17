<script lang="ts">
  import { 
    Pulse, 
    UserPlus, 
    Terminal, 
    Shield, 
    Clock, 
    Bug,
    Info,
    Warning
  } from 'phosphor-svelte';
  import { slide, fade } from 'svelte/transition';

  interface Props {
    activities: {
      id: string;
      type: 'user_joined' | 'system_log' | 'report';
      title: string;
      subtitle: string;
      timestamp: string;
      status?: 'info' | 'warning' | 'error' | 'success';
      meta?: any;
    }[];
  }

  let { activities }: Props = $props();

  function formatTime(timestamp: string) {
    if (!timestamp) return '--:--';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Ahora mismo';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString();
  }

  function getStatusIcon(activity: any) {
    if (activity.type === 'user_joined') return UserPlus;
    if (activity.status === 'error') return Bug;
    if (activity.status === 'warning') return Warning;
    return Info;
  }

  function getStatusColor(status?: string) {
    switch (status) {
      case 'error': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'warning': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      case 'success': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
      default: return 'bg-primary-500/20 text-primary-500 border-primary-500/30';
    }
  }
</script>

<div class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden">
  <div class="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-black/40">
    <div class="flex items-center gap-3">
      <div class="p-2 bg-primary-500/20 rounded-lg">
        <Pulse weight="bold" class="w-4 h-4 text-primary-400 animate-pulse" />
      </div>
      <h3 class="text-sm font-black uppercase tracking-widest text-white">Live Operations Pulse</h3>
    </div>
    <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg">Real-time Stream</span>
  </div>

  <div class="flex-1 overflow-y-auto max-h-[450px] p-2 space-y-2 custom-scrollbar">
    {#each activities as act (act.id)}
      {@const Icon = getStatusIcon(act)}
      <div 
        class="group flex items-center gap-4 p-4 hover:bg-white/[0.04] rounded-3xl transition-all border border-transparent hover:border-white/5"
        in:slide={{ axis: 'y' }}
      >
        <div class="relative">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center border {getStatusColor(act.status)} group-hover:scale-105 transition-transform">
            <Icon weight="duotone" class="w-6 h-6" />
          </div>
          {#if act.type === 'user_joined'}
             <div class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#1e293b] rounded-full"></div>
          {/if}
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <h4 class="text-sm font-bold text-slate-200 truncate group-hover:text-white transition-colors uppercase italic">{act.title}</h4>
            <span class="text-[9px] font-black text-slate-600 shrink-0">·</span>
            <span class="text-[9px] font-black text-slate-500 uppercase tracking-tighter shrink-0">{formatTime(act.timestamp)}</span>
          </div>
          <p class="text-[11px] text-slate-500 font-medium truncate italic">{act.subtitle}</p>
        </div>

        <div class="opacity-0 group-hover:opacity-100 transition-opacity pr-2">
           <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
              <Clock weight="bold" class="w-4 h-4" />
           </div>
        </div>
      </div>
    {:else}
      <div class="h-64 flex flex-col items-center justify-center text-slate-700 py-10 space-y-4">
        <Terminal weight="thin" class="w-12 h-12 opacity-20" />
        <p class="italic">Esperando eventos del sistema...</p>
      </div>
    {/each}
  </div>

  <div class="px-8 py-4 bg-black/20 border-t border-white/5 text-[9px] text-slate-600 flex justify-between items-center italic">
    <span>Listening to firebase.auth, firebase.firestore</span>
    <div class="flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
      <span>Socket Established</span>
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
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.1);
  }
</style>
