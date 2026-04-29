<script lang="ts">
  import { fade, fly, scale } from 'svelte/transition';
  import { Heart, ArrowLeft, InstagramLogo, Globe, HandHeart, Sparkle, X, PaperPlaneTilt, CheckCircle, Warning, Plus, Lightning } from 'phosphor-svelte';
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

  const formatLabel = (str: string | undefined | null) => {
    if (!str) return '';
    return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

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

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" in:fade>
  
  <!-- Header Section -->
  <header class="pt-12 mb-16 space-y-8" in:fly={{ y: 20, duration: 800 }}>
    <div class="space-y-4">
      <div class="flex items-center gap-2">
        <div class="h-[2px] w-8 bg-rose-500"></div>
        <h2 class="text-rose-400 text-[10px] font-black uppercase tracking-[0.4em]">Ecosistema ChessNet</h2>
      </div>
      <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div class="max-w-3xl">
          <h1 class="text-5xl lg:text-7xl font-outfit font-black text-white tracking-tighter uppercase leading-[0.85]">
            Proyectos que <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-white to-orange-400 italic">Apoyamos</span>
          </h1>
          <p class="text-zinc-500 text-lg font-medium tracking-tight font-jakarta mt-6 border-l-2 border-white/5 pl-6 max-w-xl">
            En ChessNet creemos firmemente en la colaboración. Estos proyectos comparten nuestra visión de mejorar el sector del ajedrez, aportando valor, innovación y pasión a la comunidad.
          </p>
        </div>
        
        <div class="flex flex-wrap items-center gap-4">
          <button 
            onclick={() => showModal = true}
            class="px-10 h-14 bg-white text-black hover:bg-rose-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl active:scale-95"
          >
            <Plus weight="bold" size={18} />
            Sugerir Proyecto
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Projects Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    {#each projects as project, i}
      <div 
        in:fly={{ y: 30, duration: 800, delay: i * 100 }}
        class="group relative"
      >
        <div class="absolute -inset-0.5 bg-gradient-to-r {project.color} opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"></div>
        
        <div class="bento-card p-8 bg-zinc-950/40 backdrop-blur-xl border {project.borderColor} hover:bg-zinc-900/60 transition-all duration-300">
          <div class="flex flex-col lg:flex-row gap-8 items-start">
            <!-- Logo Container -->
            <div class="relative shrink-0">
              <div class="absolute inset-0 bg-white/5 blur-2xl rounded-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img 
                src={project.logo} 
                alt={project.name} 
                class="w-24 h-24 lg:w-32 lg:h-32 rounded-none object-cover shadow-2xl relative z-10 border border-white/10 group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <!-- Content -->
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-4">
                <h2 class="text-3xl font-outfit font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-500 transition-all uppercase tracking-tighter italic">
                  {formatLabel(project.name)}
                </h2>
                <Sparkle size={20} weight="fill" class="text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <p class="text-zinc-500 text-sm font-medium leading-relaxed mb-6 border-l border-white/5 pl-4">
                {project.description}
              </p>

              <div class="bg-white/[0.02] border border-white/5 p-5 mb-8">
                <span class="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] block mb-2">Misión Estratégica</span>
                <p class="text-zinc-400 text-xs font-bold uppercase tracking-tight">
                  {formatLabel(project.impact)}
                </p>
              </div>

              <!-- Links -->
              <div class="flex flex-wrap items-center gap-4">
                {#if project.links.instagram}
                  <a 
                    href={project.links.instagram} 
                    target="_blank" 
                    class="px-6 py-3 bg-zinc-950/40 border border-white/10 text-zinc-400 hover:text-white hover:border-rose-500/50 transition-all text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group/link"
                  >
                    <InstagramLogo size={14} weight="bold" class="group-hover/link:scale-110 transition-transform" />
                    Instagram
                  </a>
                {/if}
                {#if project.links.web}
                  <a 
                    href={project.links.web} 
                    target="_blank" 
                    class="px-6 py-3 bg-zinc-950/40 border border-white/10 text-zinc-400 hover:text-white hover:border-blue-500/50 transition-all text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group/link"
                  >
                    <Globe size={14} weight="bold" class="group-hover/link:scale-110 transition-transform" />
                    Web Oficial
                  </a>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}

    <!-- Collaboration Placeholder -->
    <div 
      in:fly={{ y: 30, duration: 800, delay: 400 }}
      class="bento-card border-dashed border-white/10 p-12 flex flex-col items-center justify-center text-center gap-8 group hover:border-rose-500/40 transition-all bg-zinc-950/20"
    >
      <div class="w-20 h-20 bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:border-rose-500/30 transition-all duration-500">
        <HandHeart size={32} weight="duotone" class="text-zinc-600 group-hover:text-rose-400 transition-colors" />
      </div>
      <div class="space-y-4">
        <h3 class="text-2xl font-outfit font-black text-white uppercase tracking-tighter italic">¿Nueva Alianza?</h3>
        <p class="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] max-w-[240px] leading-loose">
          ESTAMOS ABIERTOS A PROPUESTAS QUE MEJOREN EL MUNDO DEL AJEDREZ.
        </p>
      </div>
      <button 
        onclick={() => showModal = true}
        class="px-8 py-4 bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all text-[10px] font-black uppercase tracking-[0.2em]"
      >
        Enviar Propuesta
      </button>
    </div>
  </div>

  <!-- Footer Quote -->
  <footer class="mt-24 text-center pb-12" in:fade={{ duration: 1000, delay: 600 }}>
    <div class="w-12 h-[1px] bg-white/10 mx-auto mb-8"></div>
    <p class="font-outfit text-3xl font-black text-zinc-800 uppercase tracking-tighter italic">
      "Juntos, hacemos el ajedrez más grande."
    </p>
  </footer>
</div>

<!-- Collaboration Modal -->
{#if showModal}
  <div 
    class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
    in:fade={{ duration: 200 }}
  >
    <button 
      type="button"
      class="absolute inset-0 bg-black/90 backdrop-blur-xl cursor-default w-full h-full border-none" 
      onclick={() => !isSubmitting && (showModal = false)}
      aria-label="Cerrar modal"
    ></button>
    
    <div 
      class="relative bg-zinc-950 border border-white/10 w-full max-w-xl p-1 md:p-1 overflow-hidden shadow-2xl"
      in:fly={{ y: 40, duration: 400 }}
    >
      <div class="relative bg-zinc-950 border border-white/5 p-8 md:p-12">
        <!-- Decoration -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-3xl rounded-none"></div>

        <button 
          onclick={() => !isSubmitting && (showModal = false)}
          class="absolute top-8 right-8 text-zinc-600 hover:text-white transition-colors"
        >
          <X size={24} weight="bold" />
        </button>

        <div class="mb-10">
          <div class="flex items-center gap-3 mb-4">
            <PaperPlaneTilt size={32} weight="fill" class="text-rose-500" />
            <h2 class="text-4xl font-outfit font-black text-white uppercase tracking-tighter">Propuesta</h2>
          </div>
          <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-loose">
            DESCRIBE TU PROYECTO Y CÓMO PODEMOS COLABORAR PARA POTENCIAR LA COMUNIDAD.
          </p>
        </div>

        {#if submitted}
          <div class="py-12 flex flex-col items-center justify-center text-center space-y-6" in:scale>
            <div class="w-20 h-20 bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 mb-4">
              <CheckCircle size={40} weight="fill" />
            </div>
            <h3 class="text-2xl font-black text-white uppercase tracking-tighter">¡Recibido!</h3>
            <p class="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-loose max-w-xs">
              HEMOS RECIBIDO TU PROPUESTA. NUESTRO EQUIPO LA REVISARÁ CON DETALLE.
            </p>
          </div>
        {:else}
          <form onsubmit={handleSubmit} class="space-y-6">
            <div class="space-y-2">
              <label for="projectName" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Nombre del Proyecto</label>
              <input
                id="projectName"
                type="text"
                required
                bind:value={form.projectName}
                placeholder="EJ: REXHER CUP"
                class="w-full bg-zinc-900 border border-white/10 px-6 py-4 text-white font-bold placeholder:text-zinc-700 focus:border-rose-500/50 outline-none transition-all"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label for="email" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Email de Contacto</label>
                <input
                  id="email"
                  type="email"
                  required
                  bind:value={form.contactEmail}
                  placeholder="CONTACTO@PROYECTO.COM"
                  class="w-full bg-zinc-900 border border-white/10 px-6 py-4 text-white font-bold placeholder:text-zinc-700 focus:border-rose-500/50 outline-none transition-all"
                />
              </div>
              <div class="space-y-2">
                <label for="link" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Link (Web/IG)</label>
                <input
                  id="link"
                  type="url"
                  bind:value={form.link}
                  placeholder="HTTPS://..."
                  class="w-full bg-zinc-900 border border-white/10 px-6 py-4 text-white font-bold placeholder:text-zinc-700 focus:border-rose-500/50 outline-none transition-all"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label for="message" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Propuesta de Colaboración</label>
              <textarea
                id="message"
                required
                bind:value={form.message}
                rows="4"
                placeholder="CUÉNTANOS TU IDEA..."
                class="w-full bg-zinc-900 border border-white/10 px-6 py-4 text-white font-bold placeholder:text-zinc-700 focus:border-rose-500/50 outline-none transition-all resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              class="w-full bg-white text-black hover:bg-rose-600 hover:text-white py-5 font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {#if isSubmitting}
                <div class="w-5 h-5 border-2 border-black/20 border-t-black animate-spin"></div>
                Enviando...
              {:else}
                <PaperPlaneTilt size={20} weight="bold" />
                Enviar Propuesta
              {/if}
            </button>
          </form>
        {/if}
      </div>
    </div>
  </div>
{/if}
