<script lang="ts">
  import { ArrowLeft, Shield, Eye, Database, Lock, Sparkles, CheckCircle2 } from 'lucide-svelte';
  import Logo from '$lib/components/Logo.svelte';
</script>

<svelte:head>
  <title>Política de Privacidad | ChessNet Premium</title>
</svelte:head>

<div class="min-h-screen bg-bento-bg text-surface-200 font-sans selection:bg-primary-500/30 overflow-x-hidden">
  
  <!-- Premium Background Effects -->
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-[20%] -right-[10%] w-[30%] h-[30%] bg-primary-500/5 rounded-full blur-[100px]"></div>
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150"></div>
  </div>

  <!-- Header -->
  <header class="relative z-10 p-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-6 sm:gap-8">
    <a href="/" class="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group">
      <div class="relative">
        <div class="absolute -inset-2 bg-emerald-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <Logo size="w-10 h-10" iconSize="w-6 h-6" />
      </div>
      <span class="text-2xl font-display font-black tracking-tighter text-white">ChessNet</span>
    </a>
    
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
        <Shield class="w-4 h-4 text-emerald-400" />
        <span class="text-xs font-bold text-white uppercase tracking-widest">Privacidad y Datos</span>
      </div>
      <a href="/" class="flex items-center gap-2 text-surface-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors group">
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Volver
      </a>
    </div>
  </header>

  <main class="relative z-10 max-w-4xl mx-auto px-6 py-12">
    <div class="bento-card border-white/5 bg-white/[0.02] p-8 md:p-12 shadow-2xl">
      <div class="prose prose-invert prose-emerald max-w-none">
        <div class="flex items-center gap-3 text-surface-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
          <Sparkles class="w-3.5 h-3.5 text-emerald-500" />
          Protocolo de Privacidad: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        <section class="mb-16">
          <h2 class="text-3xl font-display font-black text-white mb-8 tracking-tight">1. Arquitectura de Datos</h2>
          <p class="text-surface-400 font-medium leading-relaxed mb-10">
            En <span class="text-white font-bold">ChessNet</span>, la privacidad no es una opción, es una característica de diseño. Solo procesamos la información estrictamente necesaria para la excelencia educativa.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
            <div class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group">
              <Database class="w-8 h-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 class="text-white font-bold mb-3">Identidad</h4>
              <ul class="text-xs text-surface-500 space-y-2 font-medium">
                <li>• Perfil Universal de Google</li>
                <li>• Metadatos de Autenticación</li>
                <li>• Registro de Actividad</li>
              </ul>
            </div>
            <div class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group">
              <Eye class="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 class="text-white font-bold mb-3">Uso</h4>
              <ul class="text-xs text-surface-500 space-y-2 font-medium">
                <li>• Progreso de Alumnos</li>
                <li>• Estructuras de Centros</li>
                <li>• Métricas de Torneos</li>
              </ul>
            </div>
            <div class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group">
              <Lock class="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 class="text-white font-bold mb-3">Técnico</h4>
              <ul class="text-xs text-surface-500 space-y-2 font-medium">
                <li>• Cifrado AES-256</li>
                <li>• Tokens de Sesión</li>
                <li>• Logs de Seguridad</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="mb-16">
          <h2 class="text-2xl font-display font-black text-white mb-6">2. Uso Final de la Información</h2>
          <p class="text-surface-400 font-medium leading-relaxed mb-6">Utilizamos sus datos exclusivamente para potenciar su academia:</p>
          <div class="space-y-4 not-prose">
            {#each ['Mantenimiento de Servicios Críticos', 'Optimización de Experiencia de Usuario', 'Comunicaciones Estratégicas', 'Prevención de Intrusiones'] as item}
              <div class="flex items-center gap-4 text-surface-400 font-bold text-xs uppercase tracking-widest">
                <CheckCircle2 class="w-4 h-4 text-emerald-500" />
                {item}
              </div>
            {/each}
          </div>
        </section>

        <section class="mb-16 border-l-4 border-emerald-500/30 pl-8 py-2 bg-emerald-500/[0.02] rounded-r-2xl">
          <h2 class="text-2xl font-display font-black text-white mb-6">3. Garantía de No Comercialización</h2>
          <p class="text-surface-400 font-medium leading-relaxed">
            ChessNet tiene una política de <span class="text-emerald-400 font-bold italic">Zero-Selling</span>. Nunca venderemos, alquilaremos o cederemos sus datos personales o los de sus alumnos a terceros con fines publicitarios o comerciales.
          </p>
        </section>

        <section class="mb-16">
          <h2 class="text-2xl font-display font-black text-white mb-6">4. Sus Derechos Digitales</h2>
          <p class="text-surface-400 font-medium leading-relaxed mb-8">Usted mantiene el control total sobre su información:</p>
          <div class="flex flex-wrap gap-2 not-prose">
            {#each ['Acceso', 'Rectificación', 'Supresión', 'Portabilidad', 'Oposición'] as derecho}
              <span class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase text-white tracking-wider">
                {derecho}
              </span>
            {/each}
          </div>
        </section>

        <section class="mt-20 pt-12 border-t border-white/10 text-center">
          <h3 class="text-xl font-bold text-white mb-6">Soberanía de Datos</h3>
          <p class="text-surface-400 mb-8 font-medium italic">"Tus datos son tuyos. Nosotros solo te damos las herramientas para que brillen."</p>
          <div class="inline-flex flex-col items-center gap-3">
             <span class="text-[10px] font-black text-surface-600 uppercase tracking-widest">Delegado de Protección de Datos</span>
             <a href="mailto:chessnetappweb@gmail.com" class="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">chessnetappweb@gmail.com</a>
          </div>
        </section>
      </div>
    </div>
  </main>

  <footer class="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center text-surface-600 text-[10px] font-black uppercase tracking-[0.3em]">
    Infraestructura Segura • ChessNet Cloud • EU Regions
  </footer>
</div>
