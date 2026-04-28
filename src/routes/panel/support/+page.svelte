<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { Lifebuoy, ChatCircleDots, Question, EnvelopeSimple, WhatsappLogo, ArrowLeft, PaperPlaneTilt, CheckCircle, Info } from 'phosphor-svelte';
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { db } from '$lib/firebase';
  import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
  import { toast } from 'svelte-french-toast';
  import { user } from '$lib/stores/auth';

  let isSubmitting = $state(false);
  let submitted = $state(false);

  let form = $state({
    subject: '',
    message: '',
    category: 'general'
  });

  const handleBack = () => goto('/panel');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (isSubmitting) return;
    
    isSubmitting = true;
    try {
      await addDoc(collection(db, 'support_tickets'), {
        ...form,
        userId: $user?.uid,
        userEmail: $user?.email,
        userName: $user?.displayName,
        status: 'open',
        createdAt: serverTimestamp()
      });
      submitted = true;
      toast.success('Ticket enviado con éxito');
      setTimeout(() => {
        submitted = false;
        form = { subject: '', message: '', category: 'general' };
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
    { q: '¿Puedo importar mi propio temario?', a: 'Sí, en la sección de Temario puedes crear módulos personalizados o usar los predefinidos.' }
  ];
</script>

<svelte:head>
  <title>Ayuda y Soporte | ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-zinc-950 p-6 md:p-12 relative overflow-hidden">
  <!-- Background Decorations -->
  <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
  <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

  <div class="max-w-6xl mx-auto relative z-10">
    <!-- Header -->
    <header class="mb-12" in:fly={{ y: -20, duration: 800 }}>
      <button 
        onclick={handleBack}
        class="group flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 text-sm font-medium"
      >
        <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Volver al Panel
      </button>

      <div class="flex items-center gap-4 mb-4">
        <div class="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/30 shadow-lg shadow-blue-500/10">
          <Lifebuoy size={32} weight="duotone" class="text-blue-400" />
        </div>
        <h1 class="text-4xl md:text-5xl font-outfit font-black text-white tracking-tight uppercase italic">
          Ayuda y <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Soporte</span>
        </h1>
      </div>

      <p class="text-lg text-slate-400 max-w-2xl leading-relaxed">
        ¿Tienes alguna duda o necesitas asistencia técnica? Estamos aquí para ayudarte a que tu academia de ajedrez funcione sin problemas.
      </p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Contact Form -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <ChatCircleDots size={120} weight="duotone" class="text-white" />
          </div>

          {#if !submitted}
            <div class="mb-8 relative z-10">
              <h2 class="text-2xl font-outfit font-black text-white mb-2 uppercase">Enviar un Ticket</h2>
              <p class="text-sm text-slate-400 font-medium">Nuestro equipo te responderá en menos de 24 horas laborables.</p>
            </div>

            <form onsubmit={handleSubmit} class="space-y-6 relative z-10">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="category" class="block text-[10px] font-outfit font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Categoría</label>
                  <select 
                    id="category"
                    bind:value={form.category}
                    class="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
                  >
                    <option value="general">Consulta General</option>
                    <option value="technical">Problema Técnico</option>
                    <option value="billing">Facturación / Plan</option>
                    <option value="feedback">Sugerencia / Feedback</option>
                  </select>
                </div>
                <div>
                  <label for="subject" class="block text-[10px] font-outfit font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Asunto</label>
                  <input 
                    type="text" 
                    id="subject"
                    bind:value={form.subject}
                    required
                    placeholder="Ej. Problema con Lichess"
                    class="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label for="message" class="block text-[10px] font-outfit font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Mensaje Detallado</label>
                <textarea 
                  id="message"
                  bind:value={form.message}
                  required
                  rows="5"
                  placeholder="Explícanos tu duda o problema con el mayor detalle posible..."
                  class="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                class="w-full md:w-auto px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white font-outfit font-black uppercase tracking-[0.2em] text-[10px] rounded-none shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {#if isSubmitting}
                  <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Enviando...
                {:else}
                  <PaperPlaneTilt size={20} weight="bold" />
                  Enviar Consulta
                {/if}
              </button>
            </form>
          {:else}
            <div class="py-12 text-center" in:fly={{ y: 20, duration: 400 }}>
              <div class="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                <CheckCircle size={48} weight="duotone" class="text-green-400" />
              </div>
              <h2 class="text-3xl font-outfit font-black text-white mb-3 uppercase italic">¡Mensaje Recibido!</h2>
              <p class="text-slate-400 text-sm max-w-xs mx-auto font-medium">
                Hemos recibido tu consulta correctamente. Te contactaremos pronto al email asociado a tu cuenta.
              </p>
            </div>
          {/if}
        </div>

        <!-- FAQs Section -->
        <div class="space-y-4 pt-8">
          <div class="flex items-center gap-3 mb-6">
            <Info size={24} weight="duotone" class="text-violet-400" />
            <h3 class="text-xl font-outfit font-black text-white uppercase tracking-tight">Preguntas Frecuentes</h3>
          </div>
          <div class="grid grid-cols-1 gap-4">
            {#each faqs as faq}
              <div class="bg-zinc-900/30 border border-white/5 p-6 rounded-[1.5rem] hover:bg-zinc-900/50 transition-colors">
                <p class="text-white font-bold mb-2 flex items-center gap-2">
                  <Question size={18} class="text-blue-400" />
                  {faq.q}
                </p>
                <p class="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Sidebar Info -->
      <div class="space-y-6">
        <div class="bg-gradient-to-br from-violet-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div class="relative z-10">
            <div class="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
              <WhatsappLogo size={28} weight="fill" />
            </div>
            <h3 class="text-xl font-outfit font-black uppercase tracking-tight mb-2">Canal Urgente</h3>
            <p class="text-white/70 text-sm font-medium mb-6 leading-relaxed">Si eres usuario Premium y tienes una urgencia durante un torneo o clase en vivo, contacta por WhatsApp.</p>
            <a 
              href="https://wa.me/34600000000" 
              target="_blank" 
              class="inline-flex items-center gap-3 px-6 py-3 bg-white text-indigo-700 font-outfit font-black uppercase tracking-widest text-[10px] rounded-none hover:bg-zinc-100 transition-all active:scale-95 shadow-xl"
            >
              WhatsApp Soporte
            </a>
          </div>
        </div>

        <div class="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
          <div class="space-y-4">
            <h4 class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-[0.2em]">Contacto Directo</h4>
            <div class="flex items-center gap-4 group cursor-pointer">
              <div class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-400/10 transition-all">
                <EnvelopeSimple size={20} />
              </div>
              <div>
                <p class="text-xs font-bold text-white">Email</p>
                <p class="text-[10px] text-slate-500 font-medium">soporte@chessnet.app</p>
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-white/5">
            <p class="text-[9px] text-slate-600 font-bold uppercase leading-relaxed">
              Horario de atención:<br>
              Lunes a Viernes: 09:00 - 18:00 (CET)<br>
              Sábados: 10:00 - 14:00 (CET)
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
