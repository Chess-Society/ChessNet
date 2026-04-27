<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { Heart, ArrowLeft, InstagramLogo, Globe, HandHeart, Sparkle, X, PaperPlaneTilt, CheckCircle } from 'phosphor-svelte';
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { db } from '$lib/firebase';
  import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
  import { toast } from 'svelte-french-toast';

  interface Project {
    id: string;
    name: string;
    logo: string;
    description: string;
    impact: string;
    links: {
      instagram?: string;
      web?: string;
    };
    color: string;
    borderColor: string;
  }

  const projects: Project[] = [
    {
      id: 'rexher-cup',
      name: 'Rexher Cup',
      logo: '/images/rexher-cup-logo.png',
      description: 'Una competición de ajedrez innovadora, gratuita y de alta calidad técnica. Su compromiso con la democratización del ajedrez competitivo es excepcional.',
      impact: 'Fomento del ajedrez base y alta competición gratuita.',
      links: {
        instagram: 'https://www.instagram.com/rexhercup'
      },
      color: 'from-orange-500/20 to-amber-500/20',
      borderColor: 'border-orange-500/30'
    },
    {
      id: '123chess',
      name: '123CHESS.ME',
      logo: '/images/123chess-logo.png',
      description: 'Plataforma líder en la digitalización de la enseñanza del ajedrez. Ofrece herramientas interactivas tanto para entrenadores como para alumnos, optimizando el aprendizaje pedagógico.',
      impact: 'Modernización del ecosistema educativo y pedagógico del ajedrez.',
      links: {
        web: 'https://123chess.me/es'
      },
      color: 'from-blue-500/20 to-indigo-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'mindchess',
      name: 'MindChess App',
      logo: '/images/mindchess-logo.png',
      description: 'Una aplicación innovadora enfocada en el entrenamiento mental y la visualización. Ayuda a los jugadores a mejorar su memoria y cálculo táctico mediante ejercicios gamificados.',
      impact: 'Entrenamiento cognitivo especializado y gamificación del aprendizaje.',
      links: {
        web: 'https://apps.apple.com/fi/app/mindchess/id6745103930'
      },
      color: 'from-purple-500/20 to-fuchsia-500/20',
      borderColor: 'border-purple-500/30'
    }
  ];

  let showModal = $state(false);
  let isSubmitting = $state(false);
  let submitted = $state(false);

  let form = $state({
    projectName: '',
    contactEmail: '',
    link: '',
    message: ''
  });

  const handleBack = () => goto('/panel');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (isSubmitting) return;
    
    isSubmitting = true;
    try {
      await addDoc(collection(db, 'support_requests'), {
        ...form,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      submitted = true;
      toast.success('¡Propuesta enviada con éxito!');
      setTimeout(() => {
        showModal = false;
        submitted = false;
        form = { projectName: '', contactEmail: '', link: '', message: '' };
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error('Error al enviar la propuesta');
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Proyectos Apoyados | ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-zinc-950 p-6 md:p-12 relative overflow-hidden">
  <!-- Background Decorations -->
  <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
  <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

  <div class="max-w-5xl mx-auto relative z-10">
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
        <div class="p-3 rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/30 shadow-lg shadow-rose-500/10">
          <HandHeart size={32} weight="duotone" class="text-rose-400" />
        </div>
        <h1 class="text-4xl md:text-5xl font-outfit font-black text-white tracking-tight">
          Proyectos que <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">apoyamos</span>
        </h1>
      </div>

      <p class="text-lg text-slate-400 max-w-2xl leading-relaxed">
        En ChessNet creemos firmemente en la colaboración. Estos proyectos comparten nuestra visión de mejorar el sector del ajedrez, aportando valor, innovación y pasión a la comunidad.
      </p>
    </header>

    <!-- Projects Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each projects as project, i}
        <div 
          in:fly={{ y: 30, duration: 800, delay: 200 + (i * 100) }}
          class="group relative"
        >
          <div class="absolute -inset-0.5 bg-gradient-to-r {project.color} opacity-0 group-hover:opacity-100 transition duration-500 blur-xl rounded-[2rem]"></div>
          
          <div class="relative bg-zinc-900/50 backdrop-blur-xl border {project.borderColor} p-8 rounded-[2rem] hover:bg-zinc-800/50 transition-all duration-300">
            <div class="flex flex-col md:flex-row gap-8 items-start">
              <!-- Logo Container -->
              <div class="relative shrink-0">
                <div class="absolute inset-0 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img 
                  src={project.logo} 
                  alt={project.name} 
                  class="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover shadow-2xl relative z-10 border border-white/5 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <!-- Content -->
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                  <h2 class="text-2xl font-outfit font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                    {project.name}
                  </h2>
                  <Sparkle size={16} weight="fill" class="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <p class="text-slate-400 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                <div class="bg-white/5 rounded-xl p-4 mb-6 border border-white/5">
                  <span class="text-[10px] font-outfit font-black text-rose-400 uppercase tracking-widest block mb-1">Impacto Positivo</span>
                  <p class="text-slate-300 text-xs font-medium">
                    {project.impact}
                  </p>
                </div>

                <!-- Links -->
                <div class="flex items-center gap-4">
                  {#if project.links.instagram}
                    <a 
                      href={project.links.instagram} 
                      target="_blank" 
                      class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30 rounded-full text-xs font-bold text-white transition-all hover:scale-105 active:scale-95"
                    >
                      <InstagramLogo size={14} weight="bold" />
                      Instagram
                    </a>
                  {/if}
                  {#if project.links.web}
                    <a 
                      href={project.links.web} 
                      target="_blank" 
                      class="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold text-white transition-all hover:scale-105 active:scale-95"
                    >
                      <Globe size={14} weight="bold" />
                      Web Oficial
                    </a>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}

      <!-- Interactive Collaboration Card -->
      <button 
        onclick={() => showModal = true}
        in:fly={{ y: 30, duration: 800, delay: 400 }}
        class="relative border-2 border-dashed border-zinc-800 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center group hover:border-rose-500/50 hover:bg-rose-500/5 transition-all duration-500 cursor-pointer w-full appearance-none"
      >
        <div class="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-rose-500/30 transition-all">
          <HandHeart size={24} class="text-zinc-600 group-hover:text-rose-400 transition-colors" />
        </div>
        <h3 class="text-zinc-500 group-hover:text-white font-outfit font-bold mb-2 transition-colors">¿Quieres colaborar?</h3>
        <p class="text-zinc-600 group-hover:text-slate-400 text-xs max-w-[200px] transition-colors">
          Haz clic aquí para enviarnos tu propuesta y unir fuerzas.
        </p>
      </button>
    </div>

    <!-- Footer Quote -->
    <footer class="mt-24 text-center pb-12" in:fade={{ duration: 1000, delay: 600 }}>
      <div class="w-12 h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent mx-auto mb-8"></div>
      <p class="font-outfit text-xl text-slate-500 italic">
        "Juntos, hacemos el ajedrez más grande."
      </p>
    </footer>
  </div>
</div>

<!-- Collaboration Modal -->
{#if showModal}
  <div 
    class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
    in:fade={{ duration: 200 }}
  >
    <button 
      type="button"
      class="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default w-full h-full border-none" 
      onclick={() => !isSubmitting && (showModal = false)}
      aria-label="Cerrar modal"
    ></button>
    
    <div 
      class="relative bg-zinc-900 border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
      in:fly={{ y: 40, duration: 400 }}
    >
      <div class="p-8 md:p-10">
        <button 
          onclick={() => showModal = false}
          class="absolute top-6 right-6 p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        {#if !submitted}
          <div class="mb-8">
            <h2 class="text-2xl font-outfit font-black text-white mb-2">Unir fuerzas</h2>
            <p class="text-sm text-slate-400">Cuéntanos sobre tu proyecto y cómo podemos colaborar para mejorar el ajedrez.</p>
          </div>

          <form onsubmit={handleSubmit} class="space-y-4">
            <div>
              <label for="projectName" class="block text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Nombre del Proyecto</label>
              <input 
                type="text" 
                id="projectName"
                bind:value={form.projectName}
                required
                placeholder="Ej. Torneo ChessMaster"
                class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="contactEmail" class="block text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Email de Contacto</label>
                <input 
                  type="email" 
                  id="contactEmail"
                  bind:value={form.contactEmail}
                  required
                  placeholder="hola@tuproyecto.com"
                  class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all"
                />
              </div>
              <div>
                <label for="link" class="block text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Link (Web/IG)</label>
                <input 
                  type="text" 
                  id="link"
                  bind:value={form.link}
                  required
                  placeholder="instagram.com/..."
                  class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label for="message" class="block text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Tu propuesta</label>
              <textarea 
                id="message"
                bind:value={form.message}
                required
                rows="4"
                placeholder="Cuéntanos brevemente vuestra visión..."
                class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              class="w-full mt-4 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-outfit font-bold py-4 rounded-2xl shadow-xl shadow-rose-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {#if isSubmitting}
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Enviando...
              {:else}
                <PaperPlaneTilt size={20} weight="bold" />
                Enviar Propuesta
              {/if}
            </button>
          </form>
        {:else}
          <div class="py-12 text-center" in:fly={{ y: 20, duration: 400 }}>
            <div class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
              <CheckCircle size={40} weight="duotone" class="text-green-400" />
            </div>
            <h2 class="text-3xl font-outfit font-black text-white mb-3">¡Propuesta recibida!</h2>
            <p class="text-slate-400 text-sm max-w-xs mx-auto">
              Gracias por querer mejorar el ajedrez con nosotros. Revisaremos tu proyecto y te contactaremos muy pronto.
            </p>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  :global(body) {
    background-color: #09090b;
  }
</style>
