<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  import { 
    Lifebuoy, 
    Warning, 
    CheckCircle, 
    Trash, 
    Envelope, 
    PaperPlaneTilt,
    User,
    Clock
  } from 'phosphor-svelte';
  import { t } from '$lib/i18n';
  import { adminApi } from '$lib/api/admin';
  import { toast } from '$lib/stores/toast';
  import { uiStore } from '$lib/stores/uiStore';
  import { formatDate } from '$lib/utils/date';

  let { tickets = [] } = $props();

  let responseText = $state<Record<string, string>>({});
  let isSending = $state<Record<string, boolean>>({});

  async function handleRespond(id: string) {
    if (!responseText[id]?.trim()) {
      toast.error($t('admin.broadcast.error'));
      return;
    }

    isSending[id] = true;
    try {
      await adminApi.respondToTicket(id, responseText[id]);
      toast.success($t('admin.announcement_success'));
      responseText[id] = '';
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    } finally {
      isSending[id] = false;
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
      await adminApi.deleteTicket(id);
      toast.success($t('admin.support.delete_ticket'));
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    }
  }

  const sortedTickets = $derived([...tickets].sort((a, b) => {
    if (a.status === 'open' && b.status !== 'open') return -1;
    if (a.status !== 'open' && b.status === 'open') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }));
</script>

<div class="space-y-6 sm:space-y-8">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-3xl sm:text-4xl font-black font-display uppercase italic tracking-[-0.05em] leading-[0.9]">Support<br/><span class="text-amber-500">Tickets</span></h2>
      <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-3 sm:mt-4 italic">{$t('admin.support.subtitle')}</p>
    </div>
  </div>

  <div class="grid grid-cols-1 gap-4 sm:gap-6">
    {#each sortedTickets as ticket (ticket.id)}
      <div 
        class="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
        in:slide
      >
        <div class="flex flex-col xl:flex-row gap-8">
          <!-- Ticket Header & Content -->
          <div class="flex-1 space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 {ticket.status === 'open' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'} rounded-2xl flex items-center justify-center border border-white/5">
                  {#if ticket.status === 'open'}
                    <Warning weight="duotone" class="w-6 h-6 animate-pulse" />
                  {:else}
                    <CheckCircle weight="duotone" class="w-6 h-6" />
                  {/if}
                </div>
                <div>
                  <div class="flex items-center gap-3">
                    <span class="text-[10px] font-black uppercase tracking-widest {ticket.status === 'open' ? 'text-amber-500' : 'text-emerald-500'}">
                      {ticket.status === 'open' ? $t('admin.support.status_open') : $t('admin.support.status_resolved')}
                    </span>
                    <span class="text-[9px] text-slate-500 font-bold uppercase">{formatDate(ticket.createdAt)}</span>
                  </div>
                  <h3 class="text-xl font-black uppercase italic tracking-tight text-white mt-1">{ticket.title}</h3>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <div class="hidden sm:flex flex-col items-end mr-4">
                  <p class="text-[9px] font-black text-slate-500 tracking-widest lowercase">{ticket.authorEmail}</p>
                  <p class="text-[10px] font-bold text-white uppercase italic">{ticket.authorName}</p>
                </div>
                <button 
                  onclick={() => handleDelete(ticket.id)}
                  class="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash weight="bold" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <p class="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium bg-black/20 p-4 sm:p-6 rounded-2xl border border-white/5">
              {ticket.content}
            </p>

            {#if ticket.adminResponse}
              <div class="p-6 bg-primary-500/5 border border-primary-500/10 rounded-2xl space-y-2">
                <div class="flex items-center gap-2 text-primary-400 text-[9px] font-black uppercase tracking-widest">
                  <Envelope weight="fill" class="w-3 h-3" />
                  {$t('support.admin_response')}
                </div>
                <p class="text-sm text-slate-300 italic">"{ticket.adminResponse}"</p>
              </div>
            {/if}
          </div>

          <!-- Response Form (if open) -->
          {#if ticket.status === 'open'}
            <div class="xl:w-80 space-y-4" in:fade>
              <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">{$t('admin.support.respond')}</p>
              <textarea 
                bind:value={responseText[ticket.id]}
                placeholder={$t('admin.support.response_placeholder')}
                class="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-medium text-white outline-none focus:border-primary-500 transition-all resize-none min-h-[120px]"
              ></textarea>
              <button 
                onclick={() => handleRespond(ticket.id)}
                disabled={isSending[ticket.id] || !responseText[ticket.id]}
                class="w-full py-4 bg-primary-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:translate-y-[-2px] active:translate-y-[0] transition-all disabled:opacity-50 shadow-lg shadow-primary-500/20"
              >
                {#if isSending[ticket.id]}
                  <div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                {:else}
                  <PaperPlaneTilt weight="bold" class="w-4 h-4" />
                {/if}
                {$t('admin.support.send_response')}
              </button>
            </div>
          {/if}
        </div>

        <!-- Background Decorative Element -->
        <div class="absolute -right-20 -bottom-20 w-40 h-40 {ticket.status === 'open' ? 'bg-amber-500/5' : 'bg-emerald-500/5'} blur-[100px] rounded-full"></div>
      </div>
    {:else}
      <div class="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] space-y-6">
        <div class="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-slate-700">
          <Lifebuoy weight="duotone" class="w-10 h-10" />
        </div>
        <p class="text-slate-500 text-xs font-bold uppercase tracking-widest">{$t('admin.support.no_tickets')}</p>
      </div>
    {/each}
  </div>
</div>
