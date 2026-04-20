<script lang="ts">
  import { ArrowLeft, Cookie, BarChart, Settings, Shield, Sparkles, CheckCircle2 } from 'lucide-svelte';
  import Logo from '$lib/components/Logo.svelte';
</script>

<svelte:head>
  <title>Cookie Policy | ChessNet Premium</title>
</svelte:head>

<div class="min-h-screen bg-bento-bg text-surface-200 font-sans selection:bg-primary-500/30 overflow-x-hidden">
  
  <!-- Premium Background Effects -->
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary-500/10 rounded-none blur-[140px] "></div>
    <div class="absolute bottom-[20%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-none blur-[100px]"></div>
  </div>

  <!-- Header -->
  <header class="relative z-10 p-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-6 sm:gap-8">
    <a href="/" class="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group">
      <div class="relative">
        <div class="absolute -inset-2 bg-violet-500/20 rounded-none blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <Logo size="w-10 h-10" iconSize="w-6 h-6" />
      </div>
      <span class="text-2xl font-display font-black tracking-tighter text-white">ChessNet</span>
    </a>
    
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-3 px-4 py-2 rounded-none bg-white/5 border border-white/10">
        <Cookie class="w-4 h-4 text-violet-400" />
        <span class="text-xs font-bold text-white uppercase tracking-widest">Cookie Management</span>
      </div>
      <a href="/" class="flex items-center gap-2 text-surface-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors group">
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Home
      </a>
    </div>
  </header>

  <main class="relative z-10 max-w-4xl mx-auto px-6 py-12">
    <div class="bento-card border-white/5 bg-white/[0.02] p-8 md:p-12 shadow-2xl">
      <div class="prose prose-invert prose-violet max-w-none">
        <div class="flex items-center gap-3 text-surface-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
          <Sparkles class="w-3.5 h-3.5 text-violet-500" />
          Experience Protocol: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        <section class="mb-16">
          <h2 class="text-3xl font-display font-black text-white mb-8 tracking-tight">Anatomy of Experience</h2>
          <p class="text-surface-400 font-medium leading-relaxed mb-10">
            We use intelligent storage technologies to ensure your management dashboard operates with the precision of a Grandmaster.
          </p>
          
          <div class="space-y-6 not-prose">
            <!-- Essential -->
            <div class="p-6 md:p-8 rounded-none bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all group relative overflow-hidden">
               <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Shield class="w-24 h-24" />
               </div>
               <div class="flex items-center gap-4 mb-6">
                 <div class="p-3 rounded-none bg-emerald-500/10 text-emerald-400">
                   <Shield class="w-6 h-6" />
                 </div>
                 <h3 class="text-xl font-bold text-white tracking-tight">Infrastructure Cookies</h3>
               </div>
               <p class="text-surface-400 text-sm font-medium mb-6">Fundamental for the security and persistence of your session.</p>
               <div class="flex flex-wrap gap-2">
                 {#each ['chessnet-auth', 'token-persistence', 'cross-origin-lock'] as cookie}
                   <code class="px-2 py-1 rounded bg-black/40 border border-white/5 text-[10px] text-white font-mono">{cookie}</code>
                 {/each}
               </div>
            </div>

            <!-- Analytics -->
            <div class="p-6 md:p-8 rounded-none bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all group relative overflow-hidden">
               <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <BarChart class="w-24 h-24" />
               </div>
               <div class="flex items-center gap-4 mb-6">
                 <div class="p-3 rounded-none bg-blue-500/10 text-blue-400">
                   <BarChart class="w-6 h-6" />
                 </div>
                 <h3 class="text-xl font-bold text-white tracking-tight">Strategic Metrics</h3>
               </div>
               <p class="text-surface-400 text-sm font-medium mb-6">Allow us to optimize performance and the interface based on real usage flow.</p>
               <div class="flex flex-wrap gap-2">
                 {#each ['_ga_metrics', '_gid_identity', 'performance-audit'] as cookie}
                   <code class="px-2 py-1 rounded bg-black/40 border border-white/5 text-[10px] text-white font-mono">{cookie}</code>
                 {/each}
               </div>
            </div>

            <!-- Preferences -->
            <div class="p-6 md:p-8 rounded-none bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all group relative overflow-hidden">
               <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Settings class="w-24 h-24" />
               </div>
               <div class="flex items-center gap-4 mb-6">
                 <div class="p-3 rounded-none bg-purple-500/10 text-purple-400">
                   <Settings class="w-6 h-6" />
                 </div>
                 <h3 class="text-xl font-bold text-white tracking-tight">Interface Personalization</h3>
               </div>
               <p class="text-surface-400 text-sm font-medium mb-6">Remember your visual settings, language, and preferred bento-card distribution.</p>
               <div class="flex flex-wrap gap-2">
                 {#each ['user-theme', 'layout-state', 'i18n-preference'] as cookie}
                   <code class="px-2 py-1 rounded bg-black/40 border border-white/5 text-[10px] text-white font-mono">{cookie}</code>
                 {/each}
               </div>
            </div>
          </div>
        </section>

        <section class="mb-16">
          <h2 class="text-2xl font-display font-black text-white mb-6">Temporal Persistence</h2>
          <div class="bento-card border-white/5 bg-white/[0.01] overflow-hidden not-prose">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-white/5">
                  <th class="px-6 py-4 text-[10px] font-black uppercase text-surface-500 tracking-widest">Dimension</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase text-surface-500 tracking-widest">Duration</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase text-surface-500 tracking-widest">Impact</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr>
                  <td class="px-6 py-4 text-xs font-bold text-white">Volatile Session</td>
                  <td class="px-6 py-4 text-xs text-surface-400">Browser Closure</td>
                  <td class="px-6 py-4 text-xs text-surface-400 italic">Critical</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 text-xs font-bold text-white">Persistent State</td>
                  <td class="px-6 py-4 text-xs text-surface-400">30 - 365 Days</td>
                  <td class="px-6 py-4 text-xs text-surface-400 italic">Optimization</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 text-xs font-bold text-white">External Metrics</td>
                  <td class="px-6 py-4 text-xs text-surface-400">24 Months</td>
                  <td class="px-6 py-4 text-xs text-surface-400 italic">Evolution</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="mb-16 border-l-4 border-violet-500/30 pl-8 py-2 bg-violet-500/[0.02] rounded-r-2xl">
          <h2 class="text-2xl font-display font-black text-white mb-6">4. Sovereignty Control</h2>
          <p class="text-surface-400 font-medium leading-relaxed">
            You maintain absolute control. You can revoke your consent at any time through your browser settings. Please note that disabling <span class="text-white font-bold">Infrastructure</span> cookies will prevent access to ChessNet's authenticated features.
          </p>
        </section>

        <section class="mt-20 pt-12 border-t border-white/10">
          <div class="flex flex-col items-center text-center">
            <div class="p-4 rounded-none bg-white/5 mb-6">
              <Cookie class="w-12 h-12 text-violet-500 animate-bounce" />
            </div>
            <h3 class="text-xl font-bold text-white mb-4">Technological Integrity</h3>
            <p class="text-surface-400 mb-8 max-w-lg font-medium">We rigorously comply with e-Privacy and GDPR directives to ensure transparent browsing.</p>
            <a href="mailto:chessnetappweb@gmail.com" class="text-xs font-black uppercase tracking-[0.2em] text-violet-500 hover:text-violet-400 transition-colors">
              Technical Inquiries: chessnetappweb@gmail.com
            </a>
          </div>
        </section>
      </div>
    </div>
  </main>

  <footer class="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center text-surface-600 text-[10px] font-black uppercase tracking-[0.3em]">
    Transparency Guarantee • ChessNet Analytics Engine
  </footer>
</div>

