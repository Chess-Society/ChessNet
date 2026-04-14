<script lang="ts">
  import { ArrowLeft, Cookie, BarChart, Settings, Shield, Sparkles, CheckCircle2 } from 'lucide-svelte';
  import Logo from '$lib/components/Logo.svelte';
</script>

<svelte:head>
  <title>Política de Cookies | ChessNet Premium</title>
</svelte:head>

<div class="min-h-screen bg-bento-bg text-surface-200 font-sans selection:bg-primary-500/30 overflow-x-hidden">
  
  <!-- Premium Background Effects -->
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-[20%] -right-[10%] w-[30%] h-[30%] bg-primary-500/5 rounded-full blur-[100px]"></div>
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150"></div>
  </div>

  <!-- Header -->
  <header class="relative z-10 p-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-6 sm:gap-8">
    <a href="/" class="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group">
      <div class="relative">
        <div class="absolute -inset-2 bg-orange-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <Logo size="w-10 h-10" iconSize="w-6 h-6" />
      </div>
      <span class="text-2xl font-display font-black tracking-tighter text-white">ChessNet</span>
    </a>
    
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
        <Cookie class="w-4 h-4 text-orange-400" />
        <span class="text-xs font-bold text-white uppercase tracking-widest">Gestión de Cookies</span>
      </div>
      <a href="/" class="flex items-center gap-2 text-surface-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors group">
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Inicio
      </a>
    </div>
  </header>

  <main class="relative z-10 max-w-4xl mx-auto px-6 py-12">
    <div class="bento-card border-white/5 bg-white/[0.02] p-8 md:p-12 shadow-2xl">
      <div class="prose prose-invert prose-orange max-w-none">
        <div class="flex items-center gap-3 text-surface-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
          <Sparkles class="w-3.5 h-3.5 text-orange-500" />
          Protocolo de Experiencia: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        <section class="mb-16">
          <h2 class="text-3xl font-display font-black text-white mb-8 tracking-tight">Anatomía de la Experiencia</h2>
          <p class="text-surface-400 font-medium leading-relaxed mb-10">
            Utilizamos tecnologías de almacenamiento inteligente para garantizar que su tablero de gestión funcione con la precisión de un gran maestro.
          </p>
          
          <div class="space-y-6 not-prose">
            <!-- Esenciales -->
            <div class="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
               <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Shield class="w-24 h-24" />
               </div>
               <div class="flex items-center gap-4 mb-6">
                 <div class="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                   <Shield class="w-6 h-6" />
                 </div>
                 <h3 class="text-xl font-bold text-white tracking-tight">Cookies de Infraestructura</h3>
               </div>
               <p class="text-surface-400 text-sm font-medium mb-6">Fundamentales para la seguridad y persistencia de su sesión.</p>
               <div class="flex flex-wrap gap-2">
                 {#each ['chessnet-auth', 'token-persistence', 'cross-origin-lock'] as cookie}
                   <code class="px-2 py-1 rounded bg-black/40 border border-white/5 text-[10px] text-white font-mono">{cookie}</code>
                 {/each}
               </div>
            </div>

            <!-- Análisis -->
            <div class="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all group relative overflow-hidden">
               <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <BarChart class="w-24 h-24" />
               </div>
               <div class="flex items-center gap-4 mb-6">
                 <div class="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                   <BarChart class="w-6 h-6" />
                 </div>
                 <h3 class="text-xl font-bold text-white tracking-tight">Métricas Estratégicas</h3>
               </div>
               <p class="text-surface-400 text-sm font-medium mb-6">Nos permiten optimizar el rendimiento y la interfaz según el flujo de uso real.</p>
               <div class="flex flex-wrap gap-2">
                 {#each ['_ga_metrics', '_gid_identity', 'performance-audit'] as cookie}
                   <code class="px-2 py-1 rounded bg-black/40 border border-white/5 text-[10px] text-white font-mono">{cookie}</code>
                 {/each}
               </div>
            </div>

            <!-- Preferencias -->
            <div class="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all group relative overflow-hidden">
               <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Settings class="w-24 h-24" />
               </div>
               <div class="flex items-center gap-4 mb-6">
                 <div class="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                   <Settings class="w-6 h-6" />
                 </div>
                 <h3 class="text-xl font-bold text-white tracking-tight">Personalización de Interfaz</h3>
               </div>
               <p class="text-surface-400 text-sm font-medium mb-6">Recuerdan su configuración visual, idioma y distribución preferida de bento-cards.</p>
               <div class="flex flex-wrap gap-2">
                 {#each ['user-theme', 'layout-state', 'i18n-preference'] as cookie}
                   <code class="px-2 py-1 rounded bg-black/40 border border-white/5 text-[10px] text-white font-mono">{cookie}</code>
                 {/each}
               </div>
            </div>
          </div>
        </section>

        <section class="mb-16">
          <h2 class="text-2xl font-display font-black text-white mb-6">Persistencia Temporal</h2>
          <div class="bento-card border-white/5 bg-white/[0.01] overflow-hidden not-prose">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-white/5">
                  <th class="px-6 py-4 text-[10px] font-black uppercase text-surface-500 tracking-widest">Dimensión</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase text-surface-500 tracking-widest">Duración</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase text-surface-500 tracking-widest">Impacto</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr>
                  <td class="px-6 py-4 text-xs font-bold text-white">Sesión Volátil</td>
                  <td class="px-6 py-4 text-xs text-surface-400">Cierre de Navegador</td>
                  <td class="px-6 py-4 text-xs text-surface-400 italic">Crítico</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 text-xs font-bold text-white">Estado Persistente</td>
                  <td class="px-6 py-4 text-xs text-surface-400">30 - 365 Días</td>
                  <td class="px-6 py-4 text-xs text-surface-400 italic">Optimización</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 text-xs font-bold text-white">Métricas Externas</td>
                  <td class="px-6 py-4 text-xs text-surface-400">24 Meses</td>
                  <td class="px-6 py-4 text-xs text-surface-400 italic">Evolución</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="mb-16 border-l-4 border-orange-500/30 pl-8 py-2 bg-orange-500/[0.02] rounded-r-2xl">
          <h2 class="text-2xl font-display font-black text-white mb-6">4. Control de Soberanía</h2>
          <p class="text-surface-400 font-medium leading-relaxed">
            Usted mantiene el control absoluto. Puede revocar su consentimiento en cualquier momento mediante la configuración de su navegador. Tenga en cuenta que la desactivación de cookies de <span class="text-white font-bold">Infraestructura</span> impedirá el acceso a las funciones autenticadas de ChessNet.
          </p>
        </section>

        <section class="mt-20 pt-12 border-t border-white/10">
          <div class="flex flex-col items-center text-center">
            <div class="p-4 rounded-full bg-white/5 mb-6">
              <Cookie class="w-12 h-12 text-orange-500 animate-bounce" />
            </div>
            <h3 class="text-xl font-bold text-white mb-4">Integridad Tecnológica</h3>
            <p class="text-surface-400 mb-8 max-w-lg font-medium">Cumplimos rigurosamente con las directivas e-Privacy y GDPR para asegurar una navegación transparente.</p>
            <a href="mailto:chessnetappweb@gmail.com" class="text-xs font-black uppercase tracking-[0.2em] text-orange-500 hover:text-orange-400 transition-colors">
              Consultas Técnicas: chessnetappweb@gmail.com
            </a>
          </div>
        </section>
      </div>
    </div>
  </main>

  <footer class="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center text-surface-600 text-[10px] font-black uppercase tracking-[0.3em]">
    Garantía de Transparencia • ChessNet Analytics Engine
  </footer>
</div>
