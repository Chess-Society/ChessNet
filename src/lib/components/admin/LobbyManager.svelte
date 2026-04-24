<script lang="ts">
  import { t } from '$lib/i18n';
  import { fade, slide } from 'svelte/transition';
  import { 
    ChatTeardropDots, 
    Pulse, 
    Trash, 
    CheckCircle, 
    Clock, 
    Timer,
    IdentificationBadge
  } from 'phosphor-svelte';
  import { adminApi } from '$lib/api/admin';
  import { toast } from '$lib/stores/toast';
  import { uiStore } from '$lib/stores/uiStore';

  interface Props {
    suggestions: any[];
  }

  let { suggestions }: Props = $props();

  async function handleUpdateStatus(id: string, status: string) {
    try {
      await adminApi.updateSuggestionStatus(id, status);
      toast.success($t('admin.system.maintenance_toggle_success'));
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    }
  }

  async function handleDelete(id: string) {
    const confirmed = await uiStore.confirm({
      title: $t('admin.msg.delete_suggestion_confirm'),
      message: $t('common.undone_action'),
      type: 'danger',
      confirmText: $t('common.delete'),
      cancelText: $t('common.cancel')
    });

    if (!confirmed) return;
    try {
      await adminApi.deleteSuggestion(id);
      toast.success($t('admin.lobby.delete'));
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'implemented': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'planned': return 'text-violet-400 bg-violet-500/10 border-violet-500/20';
      default: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }
  }
</script>

<div class="space-y-8">
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div class="space-y-2">
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/5 border border-violet-500/10 text-[9px] font-mono font-black text-violet-400 uppercase tracking-[0.3em]">
        <span class="w-1.5 h-1.5 bg-violet-500 animate-pulse"></span>
        COMMUNITY_STREAM
      </div>
      <h2 class="text-4xl font-black font-display uppercase italic tracking-tighter text-white leading-none">
        {$t('admin.lobby.title')}
      </h2>
    </div>
    
    <div class="flex items-center gap-4 text-right">
      <div class="hidden md:block">
        <p class="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest">PENDING_QUEUE</p>
        <p class="text-xl font-black font-display italic text-amber-500">
          {suggestions.filter(s => s.status === 'pending').length}
        </p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 gap-px bg-white/10 border border-white/10">
    {#each suggestions as s (s.id)}
      <div 
        class="bg-[#02040a] p-8 md:p-12 group hover:bg-white/[0.01] transition-colors relative overflow-hidden"
        in:slide
      >
        <!-- Scanline pattern -->
        <div class="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10" style="background-size: 100% 2px, 3px 100%;"></div>

        <div class="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity">
          <ChatTeardropDots size={120} weight="fill" />
        </div>

        <div class="flex flex-col xl:flex-row gap-12 relative z-20">
          <div class="flex-1 space-y-8">
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 bg-zinc-900 border border-white/10 flex items-center justify-center font-mono font-black uppercase text-white text-2xl relative overflow-hidden group-hover:border-violet-500 transition-colors">
                {#if s.authorPhoto}
                  <img src={s.authorPhoto} alt="" class="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                {:else}
                  {s.authorName?.[0] || 'A'}
                {/if}
                <div class="absolute bottom-0 right-0 w-3 h-3 bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
              </div>
              <div>
                <div class="flex items-center gap-3">
                  <p class="text-sm font-black text-white uppercase tracking-widest">{s.authorName}</p>
                  <span class="px-2 py-0.5 bg-white/5 border border-white/10 text-[8px] font-mono font-black text-slate-500 uppercase">AUTH_USER</span>
                </div>
                <div class="flex items-center gap-2 mt-2">
                  <Clock size={12} class="text-slate-700" />
                  <p class="text-[9px] text-slate-600 font-mono font-black uppercase tracking-widest italic">
                    {s.createdAt ? new Date(s.createdAt).toLocaleString() : '---'}
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="inline-block px-3 py-1 {getStatusColor(s.status)} border text-[8px] font-mono font-black uppercase tracking-[0.2em]">
                {s.status === 'pending' ? 'PENDIENTE' : s.status === 'implemented' ? 'IMPLEMENTADO' : 'PLANIFICADO'}
              </div>
              <h4 class="text-3xl font-black uppercase italic tracking-tight text-white leading-[0.9]">
                {s.title}
              </h4>
              <p class="text-sm text-slate-400 leading-relaxed max-w-4xl font-medium">
                {s.content}
              </p>
            </div>
          </div>
          
          <div class="xl:w-80 space-y-6 flex-shrink-0">
              <div class="p-6 bg-white/[0.02] border border-white/5 space-y-4">
                <p class="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest">DECISION_MATRIX</p>
                
                <div class="space-y-2">
                  <button 
                    onclick={() => handleUpdateStatus(s.id, 'planned')}
                    class="w-full py-3 bg-white/5 border border-white/10 text-[9px] font-mono font-black uppercase tracking-widest hover:bg-violet-500 hover:text-white transition-all disabled:opacity-50"
                    disabled={s.status === 'planned'}
                  >
                    PLANIFICAR_DESARROLLO
                  </button>
                  <button 
                    onclick={() => handleUpdateStatus(s.id, 'implemented')}
                    class="w-full py-3 bg-white/5 border border-white/10 text-[9px] font-mono font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                    disabled={s.status === 'implemented'}
                  >
                    MARCAR_COMPLETO
                  </button>
                </div>
              </div>

              <div class="flex gap-2">
                <button 
                  onclick={() => handleDelete(s.id)}
                  class="flex-1 py-4 bg-red-500/10 text-red-500 border border-red-500/30 text-[9px] font-mono font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                >
                  DEPURAR_REGISTRO
                </button>
                <div class="w-14 bg-white/5 border border-white/10 flex items-center justify-center text-slate-700">
                  <Timer size={18} />
                </div>
              </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="p-32 text-center bg-black/40 border border-white/5 space-y-8">
        <div class="relative inline-block">
          <ChatTeardropDots size={64} class="text-slate-800" />
          <div class="absolute inset-0 bg-violet-500/20 blur-2xl rounded-full"></div>
        </div>
        <div class="space-y-2">
          <p class="text-xl font-black text-white uppercase italic tracking-tighter">QUEUE_EMPTY</p>
          <p class="text-[9px] font-mono font-black text-slate-600 uppercase tracking-[0.3em]">ALL_COMMUNITY_REQUESTS_PROCESSED</p>
        </div>
      </div>
    {/each}
  </div>
</div>
