<script lang="ts">
  import { fade, fly, slide } from 'svelte/transition';
  import { Lifebuoy, ChatCircleDots, Question, ArrowLeft, PaperPlaneTilt, CheckCircle, Info } from 'phosphor-svelte';
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { db } from '$lib/firebase';
  import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
  import { toast } from 'svelte-french-toast';
  import { user } from '$lib/stores/auth';
  import { appStore } from '$lib/stores/appStore';
  import { Clock as ClockIcon, ShieldCheck as ShieldIcon, Ticket as TicketIcon, CaretRight } from 'phosphor-svelte';

  let isSubmitting = $state(false);
  let submitted = $state(false);

  let form = $state({
    subject: '',
    message: '',
    category: 'general',
    schoolName: ''
  });

  const handleBack = () => goto('/panel');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (isSubmitting) return;
    
    isSubmitting = true;
    try {
      await addDoc(collection(db, 'lobby_reports'), {
        title: form.subject,
        content: form.message,
        type: form.category,
        schoolName: form.category === 'director_request' ? form.schoolName : null,
        authorId: $user?.uid,
        authorEmail: $user?.email,
        authorName: $user?.displayName || 'Usuario de ChessNet',
        authorAvatar: $user?.photoURL || null,
        status: 'open',
        priority: form.category === 'technical' ? 'high' : 'medium',
        createdAt: new Date().toISOString()
      });
      submitted = true;
      toast.success('Ticket enviado con éxito');
      setTimeout(() => {
        submitted = false;
        form = { subject: '', message: '', category: 'general', schoolName: '' };
      }, 5000);
    } catch (error) {
      console.error(error);
      toast.error('Error al enviar el ticket');
    } finally {
      isSubmitting = false;
    }
  }

  const faqs = [
    { q: '¿Cómo conecto mi cuenta de Lichess?', a: 'Ve a Configuración > Perfil y vincula tu nombre de usuario de Lichess.' },
    { q: '¿Cómo genero informes de mis alumnos?', a: 'Desde la lista de alumnos, selecciona uno y haz clic en "Actualizar Informe".' },
    { q: '¿Puedo solicitar el rol de Director?', a: 'Sí, selecciona "Solicitud de Director" en la categoría del ticket e indica el nombre de tu club.' }
  ];

  const myTickets = $derived($appStore.reports || []);
  let showTicketList = $state(false);
</script>

<svelte:head>
  <title>Ayuda y Soporte | ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden font-jakarta">
  <!-- Background Decorations -->
  <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-600/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
  <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
  
  <!-- Tech Grid Overlay -->
  <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none"></div>

  <div class="max-w-7xl mx-auto relative z-10">
    <!-- Header Section -->
    <header class="mb-16" in:fly={{ y: -20, duration: 800 }}>
      <button 
        onclick={handleBack}
        class="group flex items-center gap-3 text-zinc-500 hover:text-white transition-all mb-12 text-[10px] font-black uppercase tracking-[0.3em]"
      >
        <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-2" />
        VOLVER AL PANEL
      </button>

      <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div class="space-y-4">
          <div class="flex items-center gap-6">
            <div class="w-16 h-16 bg-violet-600 text-white flex items-center justify-center font-outfit italic font-black text-3xl shadow-lg shadow-violet-600/20">
              CT
            </div>
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-[9px] font-black text-violet-400 uppercase tracking-[0.3em]">
                <span class="w-1.5 h-1.5 bg-violet-500 animate-pulse rounded-full"></span>
                ASISTENCIA OPERATIVA
              </div>
              <h1 class="text-4xl md:text-7xl font-black font-outfit uppercase italic tracking-tighter leading-[0.85] mt-3">
                CENTRO DE<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">SOPORTE</span>
              </h1>
            </div>
          </div>
        </div>

        <div class="flex w-full md:w-auto bento-card p-1.5 bg-black/40">
          <button 
            onclick={() => showTicketList = false}
            class="flex-1 md:flex-none px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all {!showTicketList ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}"
          >
            NUEVA CONSULTA
          </button>
          <button 
            onclick={() => showTicketList = true}
            class="flex-1 md:flex-none px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all {showTicketList ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'} flex items-center justify-center gap-3"
          >
            MIS TICKETS
            {#if myTickets.length > 0}
              <span class="px-2 py-0.5 bg-violet-600 text-white text-[9px] font-black">{myTickets.length}</span>
            {/if}
          </button>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <!-- Main Content Area -->
      <div class="lg:col-span-8 order-2 lg:order-1">
        {#if !showTicketList}
          <div class="bento-card p-8 md:p-12 relative overflow-hidden" in:fade>
            {#if !submitted}
              <div class="mb-12 border-b border-white/5 pb-8">
                <h2 class="text-3xl font-black font-outfit uppercase italic text-white mb-2 tracking-tighter">Apertura de Incidencia</h2>
                <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Respuesta técnica garantizada por el equipo administrativo de ChessNet.</p>
              </div>

              <form onsubmit={handleSubmit} class="space-y-10">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div class="space-y-4">
                    <label for="category" class="block text-[10px] font-black text-zinc-600 uppercase tracking-widest">CATEGORÍA DEL REPORTE</label>
                    <div class="relative group">
                      <select 
                        id="category"
                        bind:value={form.category}
                        class="w-full bg-black/40 border border-white/10 p-5 text-white text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-violet-500 transition-all appearance-none cursor-pointer backdrop-blur-md hover:bg-white/5"
                      >
                        <option value="general" class="bg-zinc-950">CONSULTA GENERAL</option>
                        <option value="technical" class="bg-zinc-950">PROBLEMA TÉCNICO</option>
                        <option value="billing" class="bg-zinc-950">FACTURACIÓN Y PLANES</option>
                        <option value="director_request" class="bg-zinc-950">SOLICITUD DE DIRECTOR</option>
                        <option value="feedback" class="bg-zinc-950">SUGERENCIA DE MEJORA</option>
                      </select>
                      <CaretRight size={14} weight="bold" class="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-zinc-600 pointer-events-none group-hover:text-violet-400 transition-colors" />
                    </div>
                  </div>

                  <div class="space-y-4">
                    <label for="subject" class="block text-[10px] font-black text-zinc-600 uppercase tracking-widest">ASUNTO DE LA CONSULTA</label>
                    <input 
                      type="text" 
                      id="subject"
                      bind:value={form.subject}
                      required
                      placeholder="EJ. ERROR DE SINCRONIZACIÓN"
                      class="w-full bg-black/40 border border-white/10 px-6 py-5 text-white text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-violet-500 transition-all backdrop-blur-md placeholder:text-zinc-800"
                    />
                  </div>
                </div>
                
                {#if form.category === 'director_request'}
                  <div in:slide class="space-y-4 bg-violet-600/5 p-8 border-l-4 border-violet-600">
                    <label for="schoolName" class="block text-[10px] font-black text-violet-400 uppercase tracking-widest">NOMBRE DEL CLUB O CENTRO</label>
                    <input 
                      type="text" 
                      id="schoolName"
                      bind:value={form.schoolName}
                      required
                      placeholder="EJ. CLUB AJEDREZ PEÓN DORADO"
                      class="w-full bg-black/40 border border-white/10 px-6 py-5 text-white text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-violet-500 transition-all backdrop-blur-md placeholder:text-zinc-800"
                    />
                    <p class="text-[9px] text-zinc-500 uppercase tracking-widest italic">La solicitud será verificada manualmente por administración.</p>
                  </div>
                {/if}

                <div class="space-y-4">
                  <label for="message" class="block text-[10px] font-black text-zinc-600 uppercase tracking-widest">DETALLES DE LA INCIDENCIA</label>
                  <textarea 
                    id="message"
                    bind:value={form.message}
                    required
                    rows="6"
                    placeholder="DESCRIBE TU CONSULTA CON EL MAYOR DETALLE POSIBLE..."
                    class="w-full bg-black/40 border border-white/10 px-6 py-5 text-white text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-violet-500 transition-all resize-none backdrop-blur-md placeholder:text-zinc-800"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  class="w-full md:w-auto px-16 py-6 bg-white hover:bg-violet-600 text-black hover:text-white font-black uppercase tracking-[0.3em] text-[11px] transition-all active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-50 shadow-xl"
                >
                  {#if isSubmitting}
                    <div class="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    PROCESANDO...
                  {:else}
                    <PaperPlaneTilt size={20} weight="bold" />
                    ENVIAR CONSULTA
                  {/if}
                </button>
              </form>
            {:else}
              <div class="py-24 text-center" in:fly={{ y: 20, duration: 400 }}>
                <div class="w-24 h-24 bg-emerald-500 text-black flex items-center justify-center mx-auto mb-10 shadow-lg shadow-emerald-500/20">
                  <CheckCircle size={48} weight="bold" />
                </div>
                <h2 class="text-5xl font-black font-outfit uppercase italic text-white mb-4 tracking-tighter">RECIBIDO CORRECTAMENTE</h2>
                <p class="text-zinc-500 text-[11px] font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                  Tu incidencia ha sido registrada en el sistema. Recibirás una respuesta en tu bandeja de entrada en breve.
                </p>
                <button 
                  onclick={() => submitted = false}
                  class="mt-12 text-[10px] font-black text-violet-400 uppercase tracking-widest hover:text-white transition-colors"
                >
                  VOLVER AL FORMULARIO
                </button>
              </div>
            {/if}
          </div>
        {:else}
          <!-- Ticket List -->
          <div class="space-y-6" in:fade>
            {#if myTickets.length === 0}
              <div class="py-40 text-center bento-card border-dashed border-white/10 bg-white/[0.01]">
                <TicketIcon size={48} weight="thin" class="mx-auto mb-6 text-zinc-800 opacity-50" />
                <p class="text-zinc-600 font-black uppercase tracking-[0.3em] text-[11px]">HISTORIAL DE CONSULTAS VACÍO</p>
              </div>
            {:else}
              {#each myTickets as ticket (ticket.id)}
                <div class="bento-card p-8 md:p-10 hover:border-violet-500/30 transition-all group relative overflow-hidden">
                  <div class="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                     <TicketIcon size={120} weight="thin" />
                  </div>

                  <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 relative z-10">
                    <div>
                      <div class="flex flex-wrap items-center gap-4 mb-5">
                        {#if ticket.status === 'resolved'}
                          <span class="px-3 py-1 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest">
                            RESUELTO
                          </span>
                        {:else if ticket.adminResponse}
                          <span class="px-3 py-1 bg-violet-600 text-white text-[9px] font-black uppercase tracking-widest animate-pulse">
                            RESPONDIDO
                          </span>
                        {:else}
                          <span class="px-3 py-1 bg-white/10 text-zinc-400 border border-white/10 text-[9px] font-black uppercase tracking-widest">
                            EN REVISIÓN
                          </span>
                        {/if}
                        <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                          TIPO: {ticket.type.toUpperCase()}
                        </span>
                        <span class="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                          REF: #{ticket.id.slice(0, 8).toUpperCase()}
                        </span>
                      </div>
                      <h3 class="text-3xl font-black font-outfit uppercase italic text-white tracking-tighter group-hover:text-violet-400 transition-colors">{ticket.title}</h3>
                    </div>
                    <div class="text-[11px] font-black text-zinc-700 uppercase tracking-widest pt-2">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div class="bg-white/[0.03] border border-white/5 p-8 mb-6 italic relative z-10">
                    <p class="text-sm text-zinc-400 leading-relaxed font-medium">"{ticket.content}"</p>
                  </div>

                  {#if ticket.adminResponse}
                    <div class="flex gap-6 items-start pl-8 border-l-4 border-violet-600 bg-violet-600/[0.03] p-8 relative z-10">
                      <div class="w-12 h-12 bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-violet-600/20">
                        <ShieldIcon size={24} weight="bold" />
                      </div>
                      <div class="space-y-2">
                        <p class="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em]">RESPUESTA ADMINISTRATIVA</p>
                        <p class="text-sm text-zinc-200 leading-relaxed font-medium">{ticket.adminResponse}</p>
                      </div>
                    </div>
                  {/if}
                </div>
              {/each}
            {/if}
          </div>
        {/if}
      </div>

      <!-- Sidebar Area -->
      <aside class="lg:col-span-4 order-1 lg:order-2 space-y-8">
        <div class="bento-card p-8">
          <div class="flex items-center gap-4 mb-10">
            <div class="w-10 h-10 bg-violet-500/10 flex items-center justify-center text-violet-500">
              <Info size={20} weight="bold" />
            </div>
            <h3 class="text-xs font-black text-white uppercase tracking-[0.3em]">GUÍA RÁPIDA</h3>
          </div>
          
          <div class="space-y-8">
            {#each faqs as faq}
              <div class="group">
                <p class="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2 group-hover:text-violet-400 transition-colors">
                  <Question size={16} weight="bold" />
                  {faq.q}
                </p>
                <p class="text-[13px] text-zinc-400 leading-relaxed font-medium pl-6">{faq.a}</p>
                <div class="h-px w-10 bg-white/5 mt-6 group-last:hidden"></div>
              </div>
            {/each}
          </div>
        </div>

        <div class="bg-gradient-to-br from-violet-600 to-indigo-700 p-10 text-white shadow-2xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative z-10">
            <div class="w-14 h-14 bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center mb-8 text-white">
              <ShieldIcon size={32} weight="fill" />
            </div>
            <h3 class="text-2xl font-outfit italic font-black uppercase tracking-tighter mb-3">CANAL SEGURO</h3>
            <p class="text-white/80 text-[11px] font-bold uppercase tracking-wider leading-relaxed">
              TODA LA GESTIÓN DE INCIDENCIAS Y ROLES SE REALIZA AQUÍ. NO COMPARTAS DATOS SENSIBLES FUERA DEL PANEL.
            </p>
          </div>
        </div>

        <div class="bento-card p-8 space-y-10">
          <div class="space-y-8">
            <h4 class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.25em] mb-4">MÉTRICAS DE SERVICIO</h4>
            
            <div class="flex items-center gap-5">
              <div class="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-violet-400 transition-colors">
                <ClockIcon size={22} />
              </div>
              <div>
                <p class="text-[11px] font-black text-white uppercase tracking-widest">Respuesta</p>
                <p class="text-[9px] text-zinc-600 font-bold uppercase tracking-wide">Media: &lt; 24h laborables</p>
              </div>
            </div>

            <div class="flex items-center gap-5">
              <div class="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-emerald-400 transition-colors">
                <CheckCircle size={22} />
              </div>
              <div>
                <p class="text-[11px] font-black text-white uppercase tracking-widest">Solicitudes</p>
                <p class="text-[9px] text-zinc-600 font-bold uppercase tracking-wide">Validación en tiempo real</p>
              </div>
            </div>
          </div>

          <div class="pt-8 border-t border-white/5">
            <p class="text-[10px] text-zinc-700 font-black uppercase leading-relaxed tracking-widest">
              SOPORTE CHESSNET V2.0<br>
              © 2026 CHESS SOCIETY
            </p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</div>
