<script lang="ts">
  import { Map, Lock, Cloud, Cog, Smartphone, Zap, School, ArrowLeft, ArrowRight, Sparkles } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';
  import Logo from '$lib/components/Logo.svelte';
</script>

<svelte:head>
  <title>Hoja de Ruta 2026+ | ChessNet Vision</title>
  <meta name="description" content="Explora el futuro de ChessNet. Nuestra visión estratégica para transformar la enseñanza del ajedrez digital." />
</svelte:head>

<div class="min-h-screen bg-bento-bg text-surface-200 font-sans selection:bg-primary-500/30 overflow-x-hidden">
  
  <!-- Premium Background Effects -->
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px] animate-pulse"></div>
    <div class="absolute bottom-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]"></div>
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150"></div>
  </div>

  <!-- Nav -->
  <nav class="relative z-10 p-8 flex justify-between items-center max-w-7xl mx-auto">
    <a href="/" class="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group">
      <div class="relative">
        <div class="absolute -inset-2 bg-primary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <Logo size="w-10 h-10" iconSize="w-6 h-6" />
      </div>
      <span class="text-2xl font-display font-black tracking-tighter text-white">ChessNet</span>
    </a>
    <a href="/" class="flex items-center gap-2 text-surface-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors group">
      <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      Volver
    </a>
  </nav>

  <!-- Content -->
  <main class="relative z-10 max-w-5xl mx-auto px-6 py-20">
    <div class="text-center mb-24" in:fade={{ duration: 1000 }}>
      <div class="inline-flex items-center justify-center p-4 rounded-[24px] bg-primary-500/10 text-primary-500 mb-8 border border-primary-500/20 shadow-xl shadow-primary-500/10">
        <Map class="w-10 h-10" />
      </div>
      
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-surface-400 text-[10px] font-black uppercase tracking-widest mb-6">
        <Sparkles class="w-3.5 h-3.5 text-primary-400" />
        <span>Evolución Constante</span>
      </div>

      <h1 class="text-4xl md:text-6xl font-display font-black tracking-tight text-white mb-6">Nuestra <span class="text-primary-400 italic">Visión</span></h1>
      <p class="text-lg md:text-xl text-surface-400 leading-relaxed max-w-2xl mx-auto font-medium mb-10">
        Construyendo el ecosistema definitivo para el crecimiento de academias y clubes de ajedrez.
      </p>
      
      <div class="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-5 py-2.5 rounded-2xl border border-yellow-500/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
        <Zap class="w-4 h-4" />
        Sujeto a feedback de la comunidad
      </div>
    </div>

    <div class="relative">
      <!-- Vertical Timeline Line -->
      <div class="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/50 via-white/10 to-transparent"></div>

      <div class="space-y-24 relative">
        <!-- Q1 2026 -->
        <div class="flex flex-col md:flex-row gap-8 items-start relative" in:fly={{ y: 50, duration: 800, delay: 200 }}>
          <div class="hidden md:flex flex-1 justify-end pt-2 pr-12 text-right">
            <span class="text-sm font-black text-primary-400 uppercase tracking-widest bg-primary-500/10 px-3 py-1 rounded-lg">Q1 2026</span>
          </div>
          <div class="absolute left-[-4px] md:left-1/2 md:ml-[-5px] top-4 w-2.5 h-2.5 rounded-full bg-primary-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] z-20"></div>
          <div class="flex-1 pl-8 md:pl-12">
            <div class="md:hidden mb-4">
              <span class="text-xs font-black text-primary-400 uppercase tracking-widest bg-primary-500/10 px-3 py-1 rounded-lg">Q1 2026</span>
            </div>
            <div class="bento-card border-white/5 bg-white/[0.02] p-8 hover:border-primary-500/40 transition-all group">
              <div class="flex items-center gap-4 mb-6">
                <div class="p-3 rounded-2xl bg-primary-500/10 text-primary-400 group-hover:scale-110 transition-transform">
                  <Lock class="w-6 h-6" />
                </div>
                <h3 class="text-2xl font-bold text-white tracking-tight">Seguridad Avanzada</h3>
              </div>
              <ul class="space-y-3">
                <li class="flex items-center gap-3 text-surface-400">
                  <div class="w-1.5 h-1.5 rounded-full bg-primary-500/50"></div>
                  <span class="font-medium">MFA y Seguridad Biométrica</span>
                </li>
                <li class="flex items-center gap-3 text-surface-400">
                  <div class="w-1.5 h-1.5 rounded-full bg-primary-500/50"></div>
                  <span class="font-medium">Gestión de Sesiones Activas</span>
                </li>
                <li class="flex items-center gap-3 text-surface-400">
                  <div class="w-1.5 h-1.5 rounded-full bg-primary-500/50"></div>
                  <span class="font-medium">Auditoría de Acceso en Tiempo Real</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Q2 2026 -->
        <div class="flex flex-col md:flex-row-reverse gap-8 items-start relative" in:fly={{ y: 50, duration: 800, delay: 300 }}>
          <div class="hidden md:flex flex-1 justify-start pt-2 pl-12">
            <span class="text-sm font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-lg">Q2 2026</span>
          </div>
          <div class="absolute left-[-4px] md:left-1/2 md:ml-[-5px] top-4 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-20"></div>
          <div class="flex-1 pr-0 md:pr-12 pl-8 md:pl-0">
             <div class="md:hidden mb-4">
              <span class="text-xs font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-lg">Q2 2026</span>
            </div>
            <div class="bento-card border-white/5 bg-white/[0.02] p-8 hover:border-blue-500/40 transition-all group">
              <div class="flex items-center gap-4 mb-6">
                <div class="p-3 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                  <Cloud class="w-6 h-6" />
                </div>
                <h3 class="text-2xl font-bold text-white tracking-tight">Eco-Sincronización</h3>
              </div>
              <ul class="space-y-3">
                <li class="flex items-center gap-3 text-surface-400">
                  <div class="w-1.5 h-1.5 rounded-full bg-blue-500/50"></div>
                  <span class="font-medium">Migración Masiva inteligente</span>
                </li>
                <li class="flex items-center gap-3 text-surface-400">
                  <div class="w-1.5 h-1.5 rounded-full bg-blue-500/50"></div>
                  <span class="font-medium">Integración con Drive y Dropbox</span>
                </li>
                <li class="flex items-center gap-3 text-surface-400">
                  <div class="w-1.5 h-1.5 rounded-full bg-blue-500/50"></div>
                  <span class="font-medium">Modo Offline 2.0</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Q3 2026 -->
        <div class="flex flex-col md:flex-row gap-8 items-start relative" in:fly={{ y: 50, duration: 800, delay: 400 }}>
          <div class="hidden md:flex flex-1 justify-end pt-2 pr-12 text-right">
            <span class="text-sm font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg">Q3 2026</span>
          </div>
          <div class="absolute left-[-4px] md:left-1/2 md:ml-[-5px] top-4 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20"></div>
          <div class="flex-1 pl-8 md:pl-12">
            <div class="md:hidden mb-4">
              <span class="text-xs font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg">Q3 2026</span>
            </div>
            <div class="bento-card border-white/5 bg-white/[0.02] p-8 hover:border-emerald-500/40 transition-all group">
              <div class="flex items-center gap-4 mb-6">
                <div class="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Zap class="w-6 h-6" />
                </div>
                <h3 class="text-2xl font-bold text-white tracking-tight">IA Predictiva</h3>
              </div>
              <ul class="space-y-3">
                <li class="flex items-center gap-3 text-surface-400">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
                  <span class="font-medium">Detección Automática de Talento</span>
                </li>
                <li class="flex items-center gap-3 text-surface-400">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
                  <span class="font-medium">Generación de Reportes Automática</span>
                </li>
                <li class="flex items-center gap-3 text-surface-400">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
                  <span class="font-medium">Análisis de Partidas Asistido</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Final CTA -->
    <div class="mt-32 text-center" in:fade={{ delay: 600 }}>
      <div class="bento-card border-primary-500/20 bg-primary-500/5 p-12 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles class="w-24 h-24 text-primary-500" />
        </div>
        <h2 class="text-3xl font-display font-black text-white mb-6 italic">¿Tienes una idea?</h2>
        <p class="text-surface-400 mb-10 font-medium">Nuestra hoja de ruta es un organismo vivo que crece con tus sugerencias y necesidades.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://discord.gg/G7SrFtJHnr" target="_blank" class="px-8 py-4 rounded-2xl bg-primary-500 text-white font-bold hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/25 flex items-center justify-center gap-3 group">
            Sugerir en Discord
            <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="/login" class="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            Comenzar Ahora
          </a>
        </div>
      </div>
    </div>
  </main>
</div>
