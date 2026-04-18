<script lang="ts">
  import { t } from '$lib/i18n';
  import { 
    Megaphone, 
    PaperPlaneTilt, 
    CheckCircle, 
    Info, 
    Warning,
    ChatTeardropDots,
    Globe
  } from 'phosphor-svelte';
  import { toast } from '$lib/stores/toast';
  import { db } from '$lib/firebase';
  import { collection, addDoc } from 'firebase/firestore';

  let message = $state("");
  let type = $state<"info" | "warning" | "success" | "critical">("info");
  let isSending = $state(false);

  async function handleSend() {
    if (!message.trim()) return;
    isSending = true;
    try {
      // Send to lobby_announcements (which displays in the lobby chat)
      await addDoc(collection(db, "lobby_announcements"), {
        content: message,
        type: type,
        authorName: "Admin ChessNet",
        authorEmail: "admin@chessnet.dev",
        createdAt: new Date().toISOString(),
        isSystem: true
      });

      toast.success($t('admin.broadcast.success'));
      message = "";
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    } finally {
      isSending = false;
    }
  }

  const types = $derived([
    { id: 'info', icon: Info, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10', label: $t('admin.broadcast.type_info') },
    { id: 'success', icon: CheckCircle, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', label: $t('admin.broadcast.type_success') },
    { id: 'warning', icon: Warning, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', label: $t('admin.broadcast.type_warning') },
    { id: 'critical', icon: Megaphone, color: 'text-red-400 border-red-500/30 bg-red-500/10', label: $t('admin.broadcast.type_critical') }
  ]);
</script>

<div class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden group">
  <!-- Mesh Gradient Background -->
  <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 blur-[100px] rounded-full group-hover:bg-primary-500/20 transition-all duration-1000"></div>

  <div class="flex items-center justify-between">
    <div class="space-y-1">
      <h3 class="text-xl font-black font-display uppercase italic tracking-wider flex items-center gap-3 text-white">
        <Globe weight="duotone" class="w-6 h-6 text-primary-500" />
        {$t('admin.broadcast.title')}
      </h3>
      <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-9">{$t('admin.broadcast.subtitle')}</p>
    </div>
  </div>

  <div class="space-y-6 relative z-10">
    <!-- Message Type Selector -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      {#each types as item}
        {@const Icon = item.icon}
        <button 
          onclick={() => type = item.id as any}
          class="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all {type === item.id ? item.color + ' border border-current shadow-lg shadow-current/5 scale-[1.02]' : 'bg-black/20 border-white/5 text-slate-500 hover:border-white/20'}"
        >
          <Icon weight="duotone" class="w-5 h-5" />
          <span class="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
        </button>
      {/each}
    </div>

    <!-- Message Input -->
    <div class="relative">
      <textarea 
        bind:value={message}
        placeholder={$t('admin.broadcast.placeholder')}
        class="w-full bg-black/40 border border-white/10 rounded-3xl p-6 min-h-[160px] text-sm text-white placeholder:text-slate-600 outline-none focus:border-primary-500/50 transition-all resize-none shadow-inner"
      ></textarea>
      
      <div class="absolute bottom-6 right-6 flex items-center gap-4">
        <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">{$t('admin.broadcast.characters', { count: message.length })}</span>
        <button 
          onclick={handleSend}
          disabled={!message.trim() || isSending}
          class="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-primary-500 to-violet-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:grayscale text-white"
        >
          {#if isSending}
            <div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          {:else}
            <PaperPlaneTilt weight="bold" class="w-4 h-4" />
          {/if}
          {$t('admin.broadcast.launch')}
        </button>
      </div>
    </div>
  </div>

  <div class="flex items-center gap-4 p-4 bg-primary-500/10 border border-primary-500/20 rounded-2xl">
    <ChatTeardropDots weight="duotone" class="w-6 h-6 text-primary-400" />
    <p class="text-[10px] text-primary-300/80 font-medium italic">
      {$t('admin.broadcast.disclaimer')}
    </p>
  </div>
</div>
