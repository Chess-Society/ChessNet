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
    Clock,
    ShieldCheck
  } from 'phosphor-svelte';
  import { t } from '$lib/i18n';
  import { adminApi } from '$lib/api/admin';
  import { toast } from '$lib/stores/toast';
  import { uiStore } from '$lib/stores/uiStore';
  import { formatDate } from '$lib/utils/date';

  interface Ticket {
    id: string;
    status: 'open' | 'resolved';
    createdAt: string | number | Date;
    title: string;
    authorEmail: string;
    authorName: string;
    content: string;
    type?: string;
    schoolName?: string;
    teachers?: string;
    priority?: 'high' | 'normal';
    adminResponse?: string;
  }

  let { tickets = [] }: { tickets: Ticket[] } = $props();

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

  async function handleApproveDirector(ticket: Ticket) {
    const confirmed = await uiStore.confirm({
      title: $t('admin.support.approve_director_title'),
      message: $t('admin.support.approve_director_msg', { 
        name: ticket.authorName, 
        email: ticket.authorEmail, 
        school: ticket.schoolName || 'General' 
      }),
      type: 'warning',
      confirmText: $t('common.confirm'),
      cancelText: $t('common.cancel')
    });

    if (!confirmed) return;

    isSending[ticket.id] = true;
    try {
      await adminApi.promoteToDirector(ticket.authorEmail, ticket.schoolName || 'General');
      await adminApi.respondToTicket(ticket.id, $t('admin.support.approve_director_response'));
      toast.success($t('admin.support.approve_director_success'));
    } catch (e: any) {
      toast.error(e.message || $t('common.error'));
    } finally {
      isSending[ticket.id] = false;
    }
  }

  const sortedTickets = $derived([...tickets].sort((a, b) => {
    if (a.status === 'open' && b.status !== 'open') return -1;
    if (a.status !== 'open' && b.status === 'open') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }));
</script>

<div class="space-y-8 sm:space-y-12">
  <div class="flex items-center justify-between border-b border-white/10 pb-8">
    <div class="space-y-2">
      <h2 class="text-4xl sm:text-5xl font-black font-display uppercase italic tracking-tighter leading-[0.85] text-white">
        {$t('admin.tech.incident_control').split('_')[0]}<br/><span class="text-primary-500">{$t('admin.tech.incident_control').split('_')[1]}</span>
      </h2>
      <p class="text-slate-700 text-[10px] font-mono font-black uppercase tracking-[0.4em] mt-4 italic">{$t('admin.support.subtitle')}</p>
    </div>
    <div class="hidden sm:block text-right font-mono text-[8px] text-slate-800 uppercase tracking-widest leading-loose">
      {$t('admin.tech.auth')}: ENABLED<br/>
      {$t('admin.tech.status')}: PRIORITY_FIRST<br/>
      {$t('admin.tech.buffer')}: {tickets.length} RECORDS
    </div>
  </div>

  <div class="grid grid-cols-1 gap-8">
    {#each sortedTickets as ticket (ticket.id)}
      <div 
        class="bg-black border border-white/10 p-8 sm:p-10 rounded-none shadow-2xl relative overflow-hidden group"
        in:slide
      >
        <div class="flex flex-col xl:flex-row gap-10">
          <!-- Ticket Header & Content -->
          <div class="flex-1 space-y-8">
            <div class="flex items-center justify-between gap-6 border-b border-white/5 pb-6">
              <div class="flex items-center gap-6">
                <div class="w-14 h-14 {ticket.status === 'open' ? 'bg-primary-500/10 text-primary-500 border-primary-500/20' : 'bg-white/5 text-slate-800 border-white/10'} rounded-none flex items-center justify-center border group-hover:scale-105 transition-transform">
                  {#if ticket.status === 'open'}
                    <Warning weight="bold" class="w-7 h-7 animate-pulse" />
                  {:else}
                    <CheckCircle weight="bold" class="w-7 h-7" />
                  {/if}
                </div>
                <div class="space-y-1">
                  <div class="flex items-center gap-4">
                    <span class="text-[9px] font-mono font-black uppercase tracking-wider {ticket.status === 'open' ? 'text-primary-500' : 'text-slate-700'}">
                      {ticket.status === 'open' ? $t('admin.tech.status_pending') : $t('admin.tech.status_resolved')}
                    </span>
                    {#if ticket.priority === 'high'}
                      <span class="px-3 py-1 bg-red-600 text-black text-[8px] font-mono font-black uppercase tracking-wider animate-pulse">
                        {$t('admin.tech.priority_critical')}
                      </span>
                    {/if}
                    <span class="text-[8px] font-mono font-black text-slate-800 uppercase tracking-widest">{formatDate(ticket.createdAt)}</span>
                  </div>
                  <h3 class="text-2xl font-display font-black uppercase italic tracking-tight text-white mt-2">{ticket.title}</h3>
                </div>
              </div>

              <div class="flex items-center gap-6">
                <div class="hidden sm:flex flex-col items-end gap-1">
                  <p class="text-[9px] font-mono font-black text-white uppercase italic tracking-wider">{ticket.authorName}</p>
                  <p class="text-[8px] font-mono text-slate-800 uppercase tracking-widest">{ticket.authorEmail}</p>
                </div>
                <button 
                  onclick={() => handleDelete(ticket.id)}
                  class="h-12 w-12 flex items-center justify-center border border-white/10 text-slate-800 hover:text-red-500 hover:border-red-500/20 transition-all rounded-none"
                >
                  <Trash weight="bold" class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div class="relative">
               <div class="absolute -left-10 top-0 bottom-0 w-px bg-white/5"></div>
               <p class="text-sm sm:text-base text-slate-500 leading-relaxed font-mono uppercase tracking-wide bg-white/[0.01] p-8 border border-white/5 italic">
                 "{ticket.content}"
               </p>
            </div>

            {#if ticket.type === 'director_request' || ticket.schoolName || ticket.teachers}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {#if ticket.schoolName}
                  <div class="p-6 bg-white/[0.02] border border-white/5 rounded-none space-y-2">
                    <p class="text-[8px] font-mono font-black text-slate-800 uppercase tracking-widest">{$t('admin.tech.school_id')}</p>
                    <p class="text-sm font-display font-black text-white uppercase italic tracking-wider">{ticket.schoolName}</p>
                  </div>
                {/if}
                {#if ticket.teachers}
                  <div class="p-6 bg-white/[0.02] border border-white/5 rounded-none space-y-2">
                    <p class="text-[8px] font-mono font-black text-slate-800 uppercase tracking-widest">{$t('admin.tech.faculty_data')}</p>
                    <p class="text-xs font-mono text-slate-600 uppercase tracking-tight leading-relaxed">{ticket.teachers}</p>
                  </div>
                {/if}
              </div>
            {/if}

            {#if ticket.adminResponse}
              <div class="p-8 bg-primary-500/5 border border-primary-500/10 rounded-none relative overflow-hidden">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"></div>
                <div class="flex items-center gap-3 text-primary-500 text-[9px] font-mono font-black uppercase tracking-widest mb-4">
                  <div class="w-1.5 h-1.5 bg-primary-500 animate-pulse"></div>
                  {$t('admin.tech.admin_response')}
                </div>
                <p class="text-sm font-mono text-primary-400 uppercase tracking-wide italic">"{ticket.adminResponse}"</p>
              </div>
            {/if}

            {#if ticket.type === 'director_request' && ticket.status === 'open'}
              <div class="pt-6" in:fade>
                <button 
                  onclick={() => handleApproveDirector(ticket)}
                  disabled={isSending[ticket.id]}
                  class="flex items-center justify-center gap-4 px-10 py-5 bg-emerald-600 text-black border border-emerald-500 hover:bg-white transition-all font-mono font-black text-[10px] uppercase tracking-[0.4em] w-full sm:w-auto"
                >
                  <ShieldCheck weight="bold" class="w-6 h-6" />
                  {$t('admin.support.approve_director_btn')}
                </button>
              </div>
            {/if}
          </div>

          <!-- Response Form (if open) -->
          {#if ticket.status === 'open'}
            <div class="xl:w-96 space-y-6 flex flex-col justify-end" in:fade>
              <div class="space-y-4">
                <div class="flex items-center justify-between px-2">
                   <label for="response-textarea-{ticket.id}" class="text-[8px] font-mono font-black text-slate-800 uppercase tracking-widest">{$t('admin.tech.encode_response')}</label>
                   <span class="text-[8px] font-mono text-slate-900">MODE: SECURE_TX</span>
                </div>
                <textarea 
                  id="response-textarea-{ticket.id}"
                  bind:value={responseText[ticket.id]}
                  placeholder="INPUT_RESPONSE_DATA..."
                  class="w-full bg-white/[0.02] border border-white/10 rounded-none p-6 text-xs font-mono text-white placeholder:text-slate-900 outline-none focus:border-primary-500 transition-all resize-none min-h-[160px] uppercase"
                ></textarea>
                <button 
                  onclick={() => handleRespond(ticket.id)}
                  disabled={isSending[ticket.id] || !responseText[ticket.id]}
                  class="w-full py-5 bg-white text-black hover:bg-primary-500 transition-all rounded-none text-[10px] font-mono font-black uppercase tracking-widest flex items-center justify-center gap-4 disabled:opacity-20"
                >
                  {#if isSending[ticket.id]}
                    <div class="w-4 h-4 border-2 border-black/20 border-t-black rounded-none animate-spin"></div>
                  {:else}
                    <PaperPlaneTilt weight="bold" class="w-5 h-5" />
                  {/if}
                  {$t('admin.tech.transmit')}
                </button>
              </div>
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <div class="py-32 text-center border-4 border-dashed border-white/[0.02] rounded-none space-y-10">
        <div class="w-24 h-24 bg-white/5 rounded-none flex items-center justify-center mx-auto text-slate-900">
          <Lifebuoy weight="bold" class="w-12 h-12" />
        </div>
        <p class="text-slate-800 text-[10px] font-mono font-black uppercase tracking-[0.5em]">SYSTEM_QUEUE_EMPTY</p>
      </div>
    {/each}
  </div>
</div>
