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
    { 
      id: 'news', 
      icon: Info, 
      label: 'News',
      active: 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.2)]',
      inactive: 'bg-white/[0.03] border-white/10 text-slate-500 hover:border-blue-500/40 hover:text-blue-400',
      border: 'border-l-blue-500',
      bg: 'bg-blue-500'
    },
    { 
      id: 'feature', 
      icon: CheckCircle, 
      label: 'Feature',
      active: 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.2)]',
      inactive: 'bg-white/[0.03] border-white/10 text-slate-500 hover:border-emerald-500/40 hover:text-emerald-400',
      border: 'border-l-emerald-500',
      bg: 'bg-emerald-500'
    },
    { 
      id: 'improvement', 
      icon: Warning, 
      label: 'Update',
      active: 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.2)]',
      inactive: 'bg-white/[0.03] border-white/10 text-slate-500 hover:border-amber-500/40 hover:text-amber-400',
      border: 'border-l-amber-500',
      bg: 'bg-amber-500'
    },
    { 
      id: 'critical', 
      icon: Megaphone, 
      label: 'Urgent',
      active: 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_40px_rgba(239,68,68,0.2)]',
      inactive: 'bg-white/[0.03] border-white/10 text-slate-500 hover:border-red-500/40 hover:text-red-400',
      border: 'border-l-red-500',
      bg: 'bg-red-500'
    }
  ]);

  function getAnnMeta(t: string) {
    return types.find(it => it.id === t) || types[0];
  }
</script>

<div class="space-y-6">
  <div class="bg-black border border-white/10 p-8 sm:p-12 rounded-none shadow-2xl space-y-10 relative overflow-hidden group">
    <!-- Technical Background -->
    <div class="absolute top-0 right-0 p-4 opacity-5 font-mono text-[8px] leading-tight select-none pointer-events-none">
      {$t('admin.tech.auth')}: {isSending ? 'SENDING' : 'IDLE'}<br/>
      {$t('admin.tech.buffer')}: {message.length}B<br/>
      {$t('admin.tech.status')}: NOMINAL
    </div>

    <div class="flex items-center justify-between">
      <div class="space-y-2">
        <h3 class="text-2xl font-display font-black uppercase italic tracking-[0.2em] flex items-center gap-4 text-white">
          <div class="p-2 bg-primary-500/10 border border-primary-500/20">
            <Globe weight="bold" class="w-6 h-6 text-primary-500" />
          </div>
          {$t('admin.broadcast.title')}
        </h3>
        <p class="text-[9px] font-mono font-black text-slate-700 uppercase tracking-widest ml-16">{$t('admin.broadcast.subtitle')}</p>
      </div>
    </div>

    <div class="space-y-10 relative z-10">
      <!-- Message Type Selector -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {#each types as item}
          {@const Icon = item.icon}
          <button 
            onclick={() => type = item.id as any}
            class="flex flex-col items-center gap-4 p-8 rounded-none border transition-all duration-300 {type === item.id ? item.active : item.inactive}"
          >
            <Icon weight={type === item.id ? 'fill' : 'bold'} size={24} />
            <span class="text-[10px] font-mono font-black uppercase tracking-widest">{item.label}</span>
          </button>
        {/each}
      </div>

      <!-- Input Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label for="broadcast-title" class="text-[8px] font-mono font-black text-slate-800 uppercase tracking-widest ml-1">{$t('admin.tech.subject')}</label>
          <input 
            id="broadcast-title"
            bind:value={title}
            placeholder="S_SUBJECT_INPUT"
            class="w-full bg-white/[0.02] border border-white/10 rounded-none px-6 py-4 text-xs font-mono text-white placeholder:text-slate-800 outline-none focus:border-primary-500/50 transition-all uppercase"
          />
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="col-span-2 space-y-2">
            <label for="broadcast-link" class="text-[8px] font-mono font-black text-slate-800 uppercase tracking-widest ml-1">{$t('admin.tech.uri')}</label>
            <input 
              id="broadcast-link"
              bind:value={link}
              placeholder="HTTPS://INTERNAL.NET"
              class="w-full bg-white/[0.02] border border-white/10 rounded-none px-6 py-4 text-xs font-mono text-white placeholder:text-slate-800 outline-none focus:border-primary-500/50 transition-all"
            />
          </div>
          <div class="space-y-2">
            <label for="broadcast-link-text" class="text-[8px] font-mono font-black text-slate-800 uppercase tracking-widest ml-1">{$t('admin.tech.label')}</label>
            <input 
              id="broadcast-link-text"
              bind:value={linkText}
              placeholder="UI_TAG"
              class="w-full bg-white/[0.02] border border-white/10 rounded-none px-6 py-4 text-xs font-mono text-white placeholder:text-slate-800 outline-none focus:border-primary-500/50 transition-all uppercase"
            />
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="space-y-2">
        <label for="broadcast-payload" class="text-[8px] font-mono font-black text-slate-800 uppercase tracking-widest ml-1">PAYLOAD_CONTENT</label>
        <div class="relative">
          <textarea 
            id="broadcast-payload"
            bind:value={message}
            placeholder={$t('admin.broadcast.placeholder')}
            class="w-full bg-white/[0.02] border border-white/10 rounded-none p-6 min-h-[200px] text-xs font-mono text-white placeholder:text-slate-800 outline-none focus:border-primary-500/50 transition-all resize-none shadow-inner uppercase"
          ></textarea>
          
          <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/5 pt-6">
            <div class="flex items-center gap-4">
              <span class="text-[8px] font-mono font-black text-slate-800 uppercase tracking-wider">ENCODING: UTF-8</span>
              <span class="text-[8px] font-mono font-black text-slate-800 uppercase tracking-wider">BYTES: {message.length}</span>
            </div>
            <button 
              onclick={handleSend}
              disabled={!message.trim() || isSending}
              class="w-full sm:w-auto flex items-center justify-center gap-4 px-10 py-4 bg-primary-500 text-black rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-white hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
            >
              {#if isSending}
                <div class="w-4 h-4 border-2 border-black/20 border-t-black rounded-none animate-spin"></div>
                {$t('admin.announcements.sending')}
              {:else}
                <PaperPlaneTilt weight="bold" class="w-4 h-4" />
                {$t('admin.tech.launch')}
              {/if}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-black border border-white/10 p-8 rounded-none space-y-6">
    <div class="flex items-center justify-between border-b border-white/10 pb-4">
      <h4 class="text-[10px] font-mono font-black uppercase tracking-widest text-slate-600">{$t('admin.tech.archived')}</h4>
      <span class="text-[8px] font-mono text-slate-800">{activeAnnouncements.length} {$t('admin.tech.records')}</span>
    </div>
    <div class="space-y-4">
      {#each activeAnnouncements as ann}
        {@const meta = getAnnMeta(ann.type)}
        <div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all gap-6 {ann.isGlobal ? `border-l-4 ${meta.border}` : 'border-l-4 border-l-slate-900 opacity-60'}">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <span class="text-white font-black text-xs uppercase tracking-wider font-mono">{ann.title}</span>
              {#if ann.isGlobal}
                 <span class="px-2 py-0.5 {meta.bg} text-black text-[7px] font-black uppercase tracking-[0.2em]">LIVE</span>
              {/if}
            </div>
            <p class="text-[10px] font-mono text-slate-500 uppercase tracking-wide line-clamp-1 italic">{ann.message}</p>
          </div>
          <div class="flex items-center gap-4">
            <button 
              onclick={() => toggleGlobal(ann)}
              class="h-10 px-6 border {ann.isGlobal ? `${meta.border.replace('l-', '')}/30 text-white` : 'border-slate-800 text-slate-700 hover:border-white/20 hover:text-white'} text-[8px] font-mono font-black uppercase tracking-widest transition-all bg-white/[0.02]"
            >
              {ann.isGlobal ? 'DEACTIVATE' : 'RELOAD'}
            </button>
            <button 
              onclick={() => handleDelete(ann.id)}
              class="h-10 w-10 flex items-center justify-center border border-transparent hover:border-red-500/50 text-slate-800 hover:text-red-500 transition-all"
              title={$t('common.delete')}
            >
              <Trash weight="bold" class="w-4 h-4" />
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="flex items-center gap-6 p-8 bg-white/[0.02] border border-white/10 rounded-none relative overflow-hidden">
    <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 animate-pulse"></div>
    <ChatTeardropDots weight="bold" class="w-6 h-6 text-primary-500 flex-shrink-0" />
    <p class="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em] leading-relaxed">
      {$t('admin.broadcast.disclaimer')}
    </p>
  </div>
</div>
