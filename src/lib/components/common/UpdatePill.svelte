<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { X, Megaphone, CheckCircle, Warning } from 'phosphor-svelte';
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n';
  import { db } from '$lib/firebase';
  import { collection, query, orderBy, onSnapshot, limit, where } from 'firebase/firestore';

  let newsDismissed = $state(false);
  let latestAnnouncement = $state<any>(null);

  onMount(() => {
    // Check if dismissed this session
    if (sessionStorage.getItem('update_pill_dismissed') === 'true') {
      newsDismissed = true;
    }

    // Listen for announcements
    const q = query(collection(db, 'lobby_announcements'), orderBy('createdAt', 'desc'), limit(1));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        latestAnnouncement = { id: snap.docs[0].id, ...snap.docs[0].data() };
      }
    });

    return unsub;
  });

  function dismiss() {
    newsDismissed = true;
    sessionStorage.setItem('update_pill_dismissed', 'true');
  }

  function getAnnouncementColor(a: any) {
    if (a.isGlobal || a.type === 'critical') return 'from-red-500 to-rose-600';
    if (a.type === 'feature') return 'from-emerald-500 to-teal-600';
    if (a.type === 'improvement') return 'from-amber-500 to-orange-600';
    return 'from-violet-500 to-indigo-600';
  }

  function getIcon(type: string) {
    if (type === 'feature') return CheckCircle;
    if (type === 'critical') return Warning;
    return Megaphone;
  }

  const showPill = $derived.by(() => {
    if (newsDismissed || !latestAnnouncement) return false;
    
    // Prevent showing old notifications (max 48h)
    const created = new Date(latestAnnouncement.createdAt).getTime();
    const now = Date.now();
    const diff = now - created;
    const isRecent = diff < (48 * 60 * 60 * 1000); 

    return isRecent;
  });
</script>

{#if showPill}
  {@const Icon = getIcon(latestAnnouncement.type)}
  <div 
    class="fixed bottom-28 lg:bottom-10 left-1/2 -translate-x-1/2 z-[200] w-[95%] max-w-md px-4"
    in:fly={{ y: 50, duration: 800, delay: 1000 }}
    out:fade
  >
    <div class="relative group">
      <!-- Glow effect -->
      <div class="absolute -inset-1 bg-gradient-to-r {getAnnouncementColor(latestAnnouncement)} rounded-none opacity-30 group-hover:opacity-100 transition-opacity blur-xl"></div>
      
      <div class="relative bg-zinc-900/90 backdrop-blur-3xl p-2 rounded-none border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] flex items-center gap-4 overflow-hidden">
        
        <!-- Icon section -->
        <div class="w-14 h-14 bg-gradient-to-br {getAnnouncementColor(latestAnnouncement)} rounded-none flex items-center justify-center text-white shadow-2xl flex-shrink-0">
          <Icon weight="fill" size={24} />
        </div>

        <!-- Text section -->
        <div class="flex-1 min-w-0 py-1">
          <div class="flex items-center gap-2 mb-0.5">
            <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <p class="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">
              {#if latestAnnouncement.type === 'feature'}
                Funcionalidad
              {:else}
                {latestAnnouncement.type || $t('lobby.update_label')}
              {/if}
            </p>
          </div>
          <h4 class="text-sm font-black text-white uppercase italic tracking-tight truncate leading-tight">
            {latestAnnouncement.title || $t('lobby.news')}
          </h4>
          <p class="text-[10px] text-zinc-400 font-medium truncate mt-0.5 opacity-80">
            {latestAnnouncement.content || latestAnnouncement.message || $t('lobby.news_desc')}
          </p>
        </div>

        <!-- Close button -->
        <button 
          onclick={dismiss}
          class="p-4 mr-1 hover:bg-white/5 text-zinc-600 hover:text-white rounded-none transition-all group/close"
          aria-label={$t('lobby.dismiss')}
        >
          <X weight="bold" size={18} class="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>
    </div>
  </div>
{/if}
