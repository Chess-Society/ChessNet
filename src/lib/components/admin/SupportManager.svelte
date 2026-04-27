<script lang="ts">
  import { appStore } from '$lib/stores/appStore';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/stores/toast';
  import { uiStore } from '$lib/stores/uiStore';
  import { adminApi } from '$lib/api/admin';
  import { db } from '$lib/firebase';
  import { doc, updateDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';
  import { 
    Ticket, 
    UserPlus, 
    CheckCircle, 
    XCircle, 
    Clock, 
    ChatCircleDots,
    Trash,
    ShieldCheck,
    EnvelopeSimple,
    UserCircle
  } from 'phosphor-svelte';
  import { slide, fade } from 'svelte/transition';

  let selectedTicketId = $state<string | null>(null);
  let adminComment = $state('');
  let isProcessing = $state(false);
  let filterStatus = $state<'all' | 'open' | 'resolved'>('open');

  const tickets = $derived($appStore.reports || []);
  const filteredTickets = $derived(
    tickets.filter(t => filterStatus === 'all' || t.status === filterStatus)
  );
  const selectedTicket = $derived(
    tickets.find(t => t.id === selectedTicketId) || null
  );

  async function updateStatus(id: string, status: 'open' | 'resolved') {
    try {
      await updateDoc(doc(db, 'lobby_reports', id), { 
        status,
        updatedAt: new Date().toISOString()
      });
      toast.success(status === 'resolved' ? 'Ticket resuelto' : 'Ticket reabierto');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function deleteTicket(id: string) {
    const confirmed = await uiStore.confirm({
      title: 'Eliminar Ticket',
      message: '¿Estás seguro de que deseas eliminar este ticket permanentemente?',
      type: 'danger'
    });
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'lobby_reports', id));
      if (selectedTicketId === id) selectedTicketId = null;
      toast.success('Ticket eliminado');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handlePromoteToDirector(ticket: any) {
    const confirmed = await uiStore.confirm({
      title: 'Promover a Director',
      message: `¿Deseas promover a ${ticket.authorEmail} como Director de "${ticket.schoolName}"?`,
      type: 'warning'
    });
    if (!confirmed) return;

    isProcessing = true;
    try {
      await adminApi.promoteToDirector(ticket.authorEmail, ticket.schoolName);
      
      // Mark ticket as resolved automatically
      await updateDoc(doc(db, 'lobby_reports', ticket.id), { 
        status: 'resolved',
        adminNote: 'Promoción realizada con éxito.',
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Usuario promovido y ticket resuelto');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      isProcessing = false;
    }
  }

  async function addAdminNote() {
    if (!selectedTicketId || !adminComment.trim()) return;
    
    isProcessing = true;
    try {
      await updateDoc(doc(db, 'lobby_reports', selectedTicketId), { 
        adminResponse: adminComment,
        updatedAt: new Date().toISOString()
      });
      adminComment = '';
      toast.success('Nota guardada');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      isProcessing = false;
    }
  }
</script>

<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[600px]">
  <!-- Left Sidebar: Ticket List -->
  <div class="lg:col-span-4 flex flex-col gap-4 bg-slate-900/50 border border-white/5 rounded-2xl p-4 overflow-hidden">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-sm font-black uppercase tracking-tighter text-white flex items-center gap-2">
        <Ticket size={18} class="text-indigo-400" />
        Tickets de Soporte
      </h3>
      <div class="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
        {#each ['open', 'resolved', 'all'] as s}
          <button 
            onclick={() => filterStatus = s as any}
            class="px-2 py-1 text-[10px] font-bold uppercase rounded transition-all {filterStatus === s ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'}"
          >
            {s === 'open' ? 'Abiertos' : s === 'resolved' ? 'Listos' : 'Todos'}
          </button>
        {/each}
      </div>
    </div>

    <div class="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
      {#if filteredTickets.length === 0}
        <div class="flex flex-col items-center justify-center py-12 text-slate-500 italic text-sm">
          <Clock size={32} class="mb-2 opacity-20" />
          No hay tickets en esta categoría
        </div>
      {/if}

      {#each filteredTickets as ticket (ticket.id)}
        <button 
          onclick={() => selectedTicketId = ticket.id}
          class="w-full text-left p-3 rounded-xl border transition-all relative group {selectedTicketId === ticket.id ? 'bg-indigo-500/10 border-indigo-500/50 ring-1 ring-indigo-500/50' : 'bg-black/20 border-white/5 hover:border-white/20'}"
        >
          <div class="flex items-start justify-between gap-2 mb-1">
            <span class="text-[10px] font-black uppercase tracking-widest {ticket.priority === 'high' ? 'text-rose-400' : 'text-slate-500'}">
              {ticket.type}
            </span>
            <span class="text-[9px] font-mono text-slate-500">
              {new Date(ticket.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h4 class="text-xs font-bold text-white truncate mb-1">
            {ticket.title}
          </h4>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
              {#if ticket.authorAvatar}
                <img src={ticket.authorAvatar} alt="" class="w-full h-full object-cover" />
              {:else}
                <UserCircle size={12} class="text-slate-500" />
              {/if}
            </div>
            <span class="text-[10px] text-slate-400 truncate flex-1">
              {ticket.authorName}
            </span>
            {#if ticket.source === 'portal'}
              <span class="text-[8px] px-1 bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded font-black uppercase">Portal</span>
            {/if}
          </div>

          {#if ticket.status === 'resolved'}
            <div class="absolute top-2 right-2">
              <CheckCircle size={14} weight="fill" class="text-emerald-400" />
            </div>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <!-- Main Content: Ticket Detail -->
  <div class="lg:col-span-8 bg-slate-900/50 border border-white/5 rounded-2xl flex flex-col overflow-hidden relative">
    {#if selectedTicket}
      <!-- Header -->
      <div class="p-6 border-b border-white/5 bg-black/20">
        <div class="flex items-start justify-between gap-4 mb-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-wider">
                {selectedTicket.type}
              </span>
              {#if selectedTicket.priority === 'high'}
                <span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-wider animate-pulse">
                  ALTA PRIORIDAD
                </span>
              {/if}
              <span class="text-[11px] font-mono text-slate-500">
                ID: {selectedTicket.id}
              </span>
              {#if selectedTicket.source === 'portal'}
                <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-wider border border-blue-500/30">
                  PORTAL FAMILIAR
                </span>
              {/if}
            </div>
            <h2 class="text-xl font-black text-white tracking-tight">
              {selectedTicket.title}
            </h2>
          </div>

          <div class="flex gap-2">
            {#if selectedTicket.status === 'open'}
              <button 
                onclick={() => updateStatus(selectedTicket.id, 'resolved')}
                class="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black rounded-lg border border-emerald-500/20 transition-all text-xs font-bold uppercase"
              >
                <CheckCircle size={18} />
                Resolver
              </button>
            {:else}
              <button 
                onclick={() => updateStatus(selectedTicket.id, 'open')}
                class="flex items-center gap-2 px-3 py-2 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black rounded-lg border border-amber-500/20 transition-all text-xs font-bold uppercase"
              >
                <Clock size={18} />
                Reabrir
              </button>
            {/if}
            <button 
              onclick={() => deleteTicket(selectedTicket.id)}
              class="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-black rounded-lg border border-rose-500/20 transition-all"
            >
              <Trash size={20} />
            </button>
          </div>
        </div>

        <div class="flex flex-wrap gap-4">
          <div class="flex items-center gap-2 text-slate-400">
            <UserCircle size={16} />
            <span class="text-xs">{selectedTicket.authorName}</span>
          </div>
          <div class="flex items-center gap-2 text-slate-400">
            <EnvelopeSimple size={16} />
            <span class="text-xs">{selectedTicket.authorEmail}</span>
          </div>
          <div class="flex items-center gap-2 text-slate-400 ml-auto">
            <Clock size={16} />
            <span class="text-xs">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div class="bg-black/40 border border-white/5 rounded-2xl p-6 mb-8">
          <div class="flex items-center gap-2 mb-4 text-slate-500">
            <ChatCircleDots size={18} />
            <span class="text-[10px] font-black uppercase tracking-widest">Contenido del Ticket</span>
          </div>
          <p class="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {selectedTicket.content}
          </p>

          {#if selectedTicket.type === 'director_request'}
            <div class="mt-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20" transition:slide>
              <div class="flex items-center gap-3 mb-4">
                <ShieldCheck size={24} class="text-indigo-400" />
                <div>
                  <h4 class="text-xs font-black text-white uppercase tracking-wider">Acción Administrativa Especial</h4>
                  <p class="text-[10px] text-slate-400">Este usuario ha solicitado ser promovido a Director.</p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="bg-black/30 p-3 rounded-lg border border-white/5">
                  <span class="block text-[9px] font-black text-slate-500 uppercase mb-1">Escuela</span>
                  <span class="text-xs text-white font-bold">{selectedTicket.schoolName}</span>
                </div>
                <div class="bg-black/30 p-3 rounded-lg border border-white/5">
                  <span class="block text-[9px] font-black text-slate-500 uppercase mb-1">Usuario</span>
                  <span class="text-xs text-white font-bold">{selectedTicket.authorEmail}</span>
                </div>
              </div>
              <button 
                onclick={() => handlePromoteToDirector(selectedTicket)}
                disabled={isProcessing || selectedTicket.status === 'resolved'}
                class="w-full flex items-center justify-center gap-2 py-3 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-indigo-500/20"
              >
                <UserPlus size={18} />
                {isProcessing ? 'Procesando...' : 'Promover a Director ahora'}
              </button>
            </div>
          {/if}
        </div>

        <!-- Admin Note Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 text-slate-500">
            <ShieldCheck size={18} />
            <span class="text-[10px] font-black uppercase tracking-widest">Respuesta / Notas Internas</span>
          </div>
          
          {#if selectedTicket.adminResponse}
            <div class="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 mb-4">
              <p class="text-xs text-emerald-100/70 italic leading-relaxed">
                "{selectedTicket.adminResponse}"
              </p>
              <div class="flex items-center gap-2 mt-2 text-[9px] text-emerald-500/50 uppercase font-black">
                <CheckCircle size={12} />
                Nota Guardada
              </div>
            </div>
          {/if}

          <div class="relative group">
            <textarea 
              bind:value={adminComment}
              placeholder="Escribe una respuesta para el usuario o una nota interna..."
              class="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all min-h-[100px] resize-none"
            ></textarea>
            <button 
              onclick={addAdminNote}
              disabled={isProcessing || !adminComment.trim()}
              class="absolute bottom-4 right-4 px-4 py-2 bg-white text-black hover:bg-indigo-400 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Guardar Nota
            </button>
          </div>
        </div>
      </div>
    {:else}
      <div class="flex-1 flex flex-col items-center justify-center text-slate-500 p-12 text-center">
        <div class="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
          <Ticket size={40} class="opacity-20" />
        </div>
        <h3 class="text-lg font-black text-white/50 uppercase tracking-tighter mb-2">Selector de Tickets</h3>
        <p class="text-sm max-w-xs">Selecciona un ticket de la lista de la izquierda para ver los detalles y realizar acciones.</p>
      </div>
    {/if}
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
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
</style>
