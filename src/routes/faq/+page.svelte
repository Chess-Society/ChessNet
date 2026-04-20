<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { 
    Question, 
    ArrowLeft, 
    CaretRight,
    Buildings,
    Users,
    Wallet,
    ShieldCheck,
    DeviceMobile,
    Lifebuoy
  } from 'phosphor-svelte';
  import { t } from '$lib/i18n';
  import { goto } from '$app/navigation';

  const faqs = [
    {
      id: 'general',
      icon: Question,
      title: 'General',
      items: [
        {
          q: '¿Qué es ChessNet?',
          a: 'ChessNet es una plataforma integral diseñada para monitores y academias de ajedrez. Te permite gestionar escuelas, alumnos, clases, asistencia y torneos desde un único lugar.'
        },
        {
          q: '¿Es gratuito?',
          a: 'Contamos con un plan gratuito funcional que permite gestionar hasta 1 centro y un número limitado de alumnos. Los planes Premium eliminan estas restricciones y añaden funciones avanzadas como contabilidad y torneos ilimitados.'
        }
      ]
    },
    {
      id: 'management',
      icon: Buildings,
      title: 'Gestión',
      items: [
        {
          q: '¿Cómo añado una nueva escuela?',
          a: 'Desde el panel principal, entra en "Escuelas" y haz clic en el botón "+". Solo necesitas el nombre del centro para empezar.'
        },
        {
          q: '¿Puedo exportar los datos?',
          a: 'Sí, la plataforma permite generar informes de asistencia y registros contables que puedes imprimir o guardar para tu gestión administrativa.'
        }
      ]
    },
    {
      id: 'mobile',
      icon: DeviceMobile,
      title: 'Móvil',
      items: [
        {
          q: '¿Tiene aplicación móvil?',
          a: 'ChessNet es una PWA (Progressive Web App). Puedes instalarla en tu iPhone o Android añadiéndola a la pantalla de inicio desde tu navegador, funcionando exactamente como una app nativa.'
        }
      ]
    },
    {
      id: 'security',
      icon: ShieldCheck,
      title: 'Seguridad',
      items: [
        {
          q: '¿Están mis datos seguros?',
          a: 'Toda tu información está protegida mediante encriptación SSL y almacenada de forma segura en los servidores de Google Firebase (Europa). Solo tú tienes acceso a los datos de tus alumnos.'
        },
        {
          q: '¿Cómo puedo eliminar mi cuenta?',
          a: 'Puedes solicitar la eliminación permanente de tus datos desde la sección "Ajustes" > "Zona de Peligro". Ten en cuenta que esta acción es irreversible y borrará todo tu historial, alumnos y centros vinculados.'
        }
      ]
    }
  ];

  let activeCategory = $state('general');
</script>

<svelte:head>
  <title>FAQ - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-slate-300 py-12 px-6 sm:py-20" in:fade>
  <div class="max-w-5xl mx-auto space-y-16">
    
    <!-- Header -->
    <div class="flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="space-y-4 text-center md:text-left">
        <button 
          onclick={() => history.back()}
          class="inline-flex items-center gap-2 text-violet-400 font-black uppercase tracking-widest text-[10px] hover:gap-4 transition-all"
        >
          <ArrowLeft weight="bold" /> Volver
        </button>
        <h1 class="text-4xl sm:text-6xl font-outfit font-black text-white tracking-tighter uppercase italic leading-none">
          Preguntas <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">Frecuentes</span>
        </h1>
        <p class="text-slate-500 font-medium max-w-lg">
          Todo lo que necesitas saber para dominar la gestión de tu academia de ajedrez con ChessNet.
        </p>
      </div>
      <div class="w-24 h-24 bg-violet-600/10 rounded-none flex items-center justify-center text-violet-500 border border-violet-500/20 shadow-2xl shadow-violet-500/10">
        <Lifebuoy size={48} weight="duotone" />
      </div>
    </div>

    <!-- Features Bento -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Categories Sidebar -->
      <div class="md:col-span-1 space-y-2">
        {#each faqs as category}
          <button 
            onclick={() => activeCategory = category.id}
            class="w-full flex items-center gap-3 px-6 py-4 rounded-none transition-all border font-outfit font-bold uppercase tracking-widest text-[10px] {activeCategory === category.id ? 'bg-white text-zinc-950 border-white shadow-xl scale-105' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}"
          >
            <category.icon weight={activeCategory === category.id ? 'bold' : 'duotone'} size={18} />
            {category.title}
          </button>
        {/each}
      </div>

      <!-- FAQ Content -->
      <div class="md:col-span-3 space-y-4">
        {#each faqs.find(c => c.id === activeCategory)?.items || [] as item}
          <div 
            class="bg-zinc-900/50 border border-white/5 p-8 rounded-none backdrop-blur-xl hover:bg-white/[0.02] transition-colors group"
            in:fly={{ y: 20, duration: 400 }}
          >
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-none bg-violet-600/10 flex items-center justify-center text-violet-400 shrink-0 group-hover:scale-110 transition-transform">
                <Question weight="bold" size={16} />
              </div>
              <div class="space-y-4">
                <h3 class="text-lg font-outfit font-black text-white italic tracking-tight">{item.q}</h3>
                <p class="text-slate-500 font-medium leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        {/each}
        
        <div class="p-10 bg-gradient-to-br from-violet-600/20 to-indigo-900/20 border border-violet-500/20 rounded-none text-center space-y-6">
          <p class="text-white font-outfit font-bold">¿No encuentras lo que buscas?</p>
          <a href="/panel/support" class="inline-flex h-12 px-8 bg-violet-600 hover:bg-violet-500 text-white rounded-none items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all">
            Hablar con Soporte
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

