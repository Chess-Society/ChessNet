<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import * as Phosphor from 'phosphor-svelte';
  import { t } from '$lib/i18n';

  let { data } = $props();

  // Helper to get icon component from name
  function getIcon(name: string) {
    // @ts-ignore
    return Phosphor[name] || Phosphor.Sparkle;
  }

  // Fallback data if collection is empty
  const defaultUpdates = [
    {
      version: '0.14.0 Beta',
      date: '2026-04-27',
      title: 'Misiones y UX Premium',
      icon: 'Trophy',
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/10',
      items: [
        {
          title: 'Rachas de Victorias',
          description: 'Nuevo tipo de misión que detecta automáticamente si un alumno gana X partidas seguidas en Lichess.',
          icon: 'Sparkle'
        },
        {
          title: 'Agenda Móvil',
          description: 'Acceso directo a la agenda de clases desde el menú inferior en dispositivos móviles.',
          icon: 'Users'
        },
        {
          title: 'Feedback de Satisfacción',
          description: 'Nuevas animaciones y feedback visual al completar desafíos para una experiencia más gratificante.',
          icon: 'Star'
        },
        {
          title: 'Control de Comunicados',
          description: 'Los comunicados masivos ahora están integrados en el plan de gestión para profesores.',
          icon: 'ShieldCheck'
        }
      ]
    },
    {
      version: '0.13.0 Beta',
      date: '2026-04-22',
      title: 'Evolución del Panel de Control',
      icon: 'RocketLaunch',
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
      items: [
        {
          title: 'Nueva Interfaz Administrativa',
          description: 'Re-ingeniería total de la interfaz administrativa para una gestión más clara y eficiente.',
          icon: 'ShieldCheck'
        },
        {
          title: 'Expansión Internacional',
          description: 'Soporte global para escuelas en cualquier país con buscador inteligente de regiones.',
          icon: 'Sparkle'
        },
        {
          title: 'Colaboración de Red',
          description: 'Los profesores ahora pueden compartir su actividad con los directores manteniendo su privacidad.',
          icon: 'Users'
        }
      ]
    }
  ];

  const updates = $derived(data.entries.length > 0 ? data.entries : defaultUpdates);
</script>

<svelte:head>
  <title>Changelog - ChessNet</title>
</svelte:head>

<div class="max-w-4xl mx-auto py-12 px-6" in:fade>
  <div class="mb-16 text-center">
    <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 mb-6">
      <Phosphor.Sparkle size={14} class="text-violet-400 animate-pulse" />
      <span class="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em]">Actualizaciones y Evolución</span>
    </div>
    <h1 class="text-5xl md:text-7xl font-display font-black text-white uppercase italic tracking-tighter mb-4 px-4 leading-[0.9]">
      CHESSNET <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500 py-2 pr-6 inline-block">CHRONICLES</span>
    </h1>
    <p class="text-zinc-500 font-bold uppercase tracking-widest text-xs">
      Descubre las últimas mejoras diseñadas para hacer tu enseñanza más eficiente.
    </p>
  </div>

  <div class="space-y-20 relative">
    <!-- Vertical Line -->
    <div class="absolute left-[39px] top-4 bottom-4 w-px bg-gradient-to-b from-violet-500/50 via-zinc-800 to-zinc-900 hidden md:block"></div>

    {#each updates as update, i}
      {@const IconComp = getIcon(update.icon)}
      <div class="relative pl-0 md:pl-24" in:fly={{ y: 20, delay: i * 100 }}>
        <!-- Version Badge (Mobile) -->
        <div class="md:hidden flex items-center gap-3 mb-6">
          <div class="px-3 py-1 {update.bgColor} {update.color} border border-current/20 text-[10px] font-black tracking-widest">
            {update.version}
          </div>
          <span class="text-[10px] text-zinc-600 font-bold tracking-widest uppercase">{update.date}</span>
        </div>

        <!-- Desktop Dot -->
        <div class="absolute left-0 top-0 hidden md:flex items-center justify-center w-20">
          <div class="w-10 h-10 {update.bgColor} {update.color} border border-current/30 flex items-center justify-center shadow-xl shadow-current/5 relative z-10">
            <IconComp size={20} weight="duotone" />
          </div>
          <div class="absolute -left-52 top-0 text-right w-48 pr-8 mt-1">
            <p class="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">{update.version}</p>
            <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1 opacity-60">{update.date}</p>
          </div>
        </div>

        <div class="bento-card !p-8 md:!p-12 relative group hover:border-white/10 transition-all">
          <div class="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <IconComp size={120} weight="duotone" />
          </div>

          <h2 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight mb-8 relative z-10">
            {update.title}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {#each update.items as item}
              {@const ItemIcon = getIcon(item.icon)}
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-none {update.bgColor} {update.color} flex items-center justify-center">
                    <ItemIcon size={16} weight="bold" />
                  </div>
                  <h3 class="text-sm font-outfit font-bold text-zinc-200 uppercase tracking-tight">{item.title}</h3>
                </div>
                <p class="text-[13px] text-zinc-500 leading-relaxed font-jakarta font-medium">
                  {item.description}
                </p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/each}
  </div>

  <div class="mt-20 p-12 bg-zinc-900/30 border border-dashed border-zinc-800 text-center">
    <p class="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2">¿Tienes una idea?</p>
    <p class="text-zinc-400 font-jakarta text-sm mb-8">Estamos construyendo el futuro del ajedrez educativo contigo.</p>
    <a href="/panel/support" class="inline-flex items-center gap-3 px-8 py-3 bg-white text-zinc-950 font-black text-[10px] uppercase tracking-widest hover:bg-violet-400 hover:text-white transition-all">
      Enviar Sugerencia
    </a>
  </div>
</div>

<style lang="postcss">
  :global(.bento-card) {
    @apply bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-none transition-all duration-300;
  }
</style>
