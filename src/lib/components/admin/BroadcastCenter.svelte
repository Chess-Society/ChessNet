<script lang="ts">
  import { t } from '$lib/i18n';
  import { 
    Megaphone, 
    PaperPlaneTilt, 
    CheckCircle, 
    Info, 
    Warning,
    ChatTeardropDots,
    Globe,
    X,
    Trash
  } from 'phosphor-svelte';
  import { serverTimestamp } from 'firebase/firestore';
  import { toast } from '$lib/stores/toast';
  import { db } from '$lib/firebase';
  import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, where, limit, updateDoc } from 'firebase/firestore';
  import { onMount } from 'svelte';

  let message = $state("");
  let title = $state("");
  let link = $state("");
  let linkText = $state("");
  let type = $state<"news" | "feature" | "improvement" | "critical">("news");
  let isSending = $state(false);
  let activeAnnouncements = $state<any[]>([]);

  onMount(() => {
    // We query without a strict where to catch both isGlobal and is_global
    const q = query(
      collection(db, "announcements"), 
      orderBy("createdAt", "desc"),
      limit(20)
    );
    const unsub = onSnapshot(q, (snap) => {
      activeAnnouncements = snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          linkText: data.linkText || data.link_text,
          isGlobal: data.isGlobal ?? data.is_global ?? false,
          createdAt: data.createdAt || data.created_at
        };
      });
    });
    return unsub;
  });

  async function handleSend() {
    if (!message.trim()) return;
    isSending = true;
    try {
      // Send to global announcements
      await addDoc(collection(db, "announcements"), {
        title: title || "Actualización del Sistema",
        message: message,
        link: link,
        linkText: linkText,
        type: type,
        authorName: "Admin ChessNet",
        authorEmail: "admin@chessnet.dev",
        createdAt: serverTimestamp(),
        isGlobal: true,
        isSystem: true
      });

      toast.success($t('admin.broadcast.success'));
      message = "";
      title = "";
      link = "";
      linkText = "";
    } catch (e) {
      console.error(e);
      toast.error($t('admin.broadcast.error'));
    } finally {
      isSending = false;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm($t('common.confirm_delete'))) return;
    try {
      await deleteDoc(doc(db, "announcements", id));
      toast.success($t('admin.announcement_success') || 'Eliminado');
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    }
  }

  async function toggleGlobal(ann: any) {
    try {
      const ref = doc(db, "announcements", ann.id);
      const newState = !ann.isGlobal;
      await updateDoc(ref, { 
        isGlobal: newState,
        is_global: newState // Sync both for legacy support
      });
      toast.success($t('admin.broadcast.success'));
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    }
  }

  const types = $derived([
    { id: 'news', icon: Info, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10', label: 'News' },
    { id: 'feature', icon: CheckCircle, color: 'text-violet-400 border-violet-500/30 bg-violet-500/10', label: 'Feature' },
    { id: 'improvement', icon: Warning, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', label: 'Update' },
    { id: 'critical', icon: Megaphone, color: 'text-red-400 border-red-500/30 bg-red-500/10', label: 'Urgent' }
  ]);
</script>

<div class="space-y-6">
  <div class="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-5 sm:p-10 rounded-none shadow-2xl space-y-6 sm:space-y-8 relative overflow-hidden group">
    <!-- Mesh Gradient Background -->
    <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 blur-[100px] rounded-none group-hover:bg-primary-500/20 transition-all duration-1000"></div>

    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h3 class="text-xl font-black font-display uppercase italic tracking-wider flex items-center gap-3 text-white">
          <Globe weight="duotone" class="w-6 h-6 text-violet-500" />
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
            class="flex flex-col items-center gap-2 p-4 rounded-none border transition-all {type === item.id ? item.color + ' border border-current shadow-lg shadow-current/5 scale-[1.02]' : 'bg-black/20 border-white/5 text-slate-500 hover:border-white/20'}"
          >
            <Icon weight="duotone" class="w-5 h-5" />
            <span class="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        {/each}
      </div>

      <!-- Title Input -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          bind:value={title}
          placeholder="Título del anuncio..."
          class="w-full bg-black/40 border border-white/10 rounded-none px-6 py-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-primary-500/50 transition-all shadow-inner"
        />
        <div class="flex gap-2">
          <input 
            bind:value={link}
            placeholder="URL (opcional)..."
            class="flex-1 bg-black/40 border border-white/10 rounded-none px-6 py-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-primary-500/50 transition-all shadow-inner"
          />
          <input 
            bind:value={linkText}
            placeholder="Texto botón..."
            class="w-1/3 bg-black/40 border border-white/10 rounded-none px-6 py-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-primary-500/50 transition-all shadow-inner"
          />
        </div>
      </div>

      <!-- Message Input -->
      <div class="relative">
        <textarea 
          bind:value={message}
          placeholder={$t('admin.broadcast.placeholder')}
          class="w-full bg-black/40 border border-white/10 rounded-none p-5 sm:p-6 min-h-[160px] text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-500/50 transition-all resize-none shadow-inner"
        ></textarea>
        
        <div class="mt-4 flex flex-col sm:flex-row items-center justify-end gap-4">
          <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">{$t('admin.broadcast.characters', { count: message.length })}</span>
          <button 
            onclick={handleSend}
            disabled={!message.trim() || isSending}
            class="w-full sm:w-auto flex items-center justify-center gap-3 px-6 sm:px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-none text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-violet-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:grayscale text-white"
          >
            {#if isSending}
              <div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-none animate-spin"></div>
            {:else}
              <PaperPlaneTilt weight="bold" class="w-4 h-4" />
            {/if}
            {$t('admin.broadcast.launch')}
          </button>
        </div>
      </div>
    </div>
  </div>

    <div class="bg-zinc-900/40 border border-white/5 p-6 rounded-none space-y-4">
      <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">{$t('admin.announcements.history')}</h4>
      <div class="space-y-3">
        {#each activeAnnouncements as ann}
          <div class="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-black/20 border border-white/5 gap-4 {ann.isGlobal ? 'border-l-2 border-l-violet-500' : 'border-l-2 border-l-zinc-700 opacity-60'}">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-white font-bold text-sm">{ann.title}</span>
                {#if ann.isGlobal}
                   <span class="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-[8px] font-black uppercase tracking-widest border border-violet-500/30">GLOBAL</span>
                {/if}
              </div>
              <p class="text-xs text-slate-500 line-clamp-1">{ann.message}</p>
            </div>
            <div class="flex items-center gap-3">
              <button 
                onclick={() => toggleGlobal(ann)}
                class="px-4 py-2 border {ann.isGlobal ? 'border-violet-500/30 text-violet-400 hover:bg-violet-500/10' : 'border-zinc-700 text-zinc-500 hover:bg-zinc-700/20'} text-[9px] font-black uppercase tracking-widest transition-all"
              >
                {ann.isGlobal ? $t('common.deactivate') : $t('common.activate')}
              </button>
              <button 
                onclick={() => handleDelete(ann.id)}
                class="p-2 text-slate-600 hover:text-red-500 transition-colors"
                title={$t('common.delete')}
              >
                <Trash weight="bold" class="w-4 h-4" />
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  <div class="flex items-center gap-4 p-4 bg-primary-500/10 border border-primary-500/20 rounded-none">
    <ChatTeardropDots weight="duotone" class="w-6 h-6 text-primary-400" />
    <p class="text-[10px] text-primary-300/80 font-medium italic">
      {$t('admin.broadcast.disclaimer')}
    </p>
  </div>
</div>
