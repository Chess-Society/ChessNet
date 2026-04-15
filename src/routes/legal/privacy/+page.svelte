<script lang="ts">
  import { ArrowLeft, Shield, Eye, Database, Lock, Sparkles, CheckCircle2 } from 'lucide-svelte';
  import Logo from '$lib/components/Logo.svelte';
</script>

<svelte:head>
  <title>Privacy Policy | ChessNet Premium</title>
</svelte:head>

<div class="min-h-screen bg-bento-bg text-surface-200 font-sans selection:bg-primary-500/30 overflow-x-hidden">
  
  <!-- Premium Background Effects -->
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary-500/10 rounded-full blur-[140px] "></div>
    <div class="absolute bottom-[20%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]"></div>
  </div>

  <!-- Header -->
  <header class="relative z-10 p-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-6 sm:gap-8">
    <a href="/" class="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group">
      <div class="relative">
        <div class="absolute -inset-2 bg-violet-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <Logo size="w-10 h-10" iconSize="w-6 h-6" />
      </div>
      <span class="text-2xl font-display font-black tracking-tighter text-white">ChessNet</span>
    </a>
    
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
        <Shield class="w-4 h-4 text-violet-400" />
        <span class="text-xs font-bold text-white uppercase tracking-widest">Privacy & Data</span>
      </div>
      <a href="/" class="flex items-center gap-2 text-surface-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors group">
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </a>
    </div>
  </header>

  <main class="relative z-10 max-w-4xl mx-auto px-6 py-12">
    <div class="bento-card border-white/5 bg-white/[0.02] p-8 md:p-12 shadow-2xl">
      <div class="prose prose-invert prose-violet max-w-none">
        <div class="flex items-center gap-3 text-surface-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
          <Sparkles class="w-3.5 h-3.5 text-violet-500" />
          Privacy Protocol: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        <section class="mb-16">
          <h2 class="text-3xl font-display font-black text-white mb-8 tracking-tight">1. Data Architecture</h2>
          <p class="text-surface-400 font-medium leading-relaxed mb-10">
            At <span class="text-white font-bold">ChessNet</span>, privacy is not an option; it's a design feature. We only process information strictly necessary for educational excellence.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
            <div class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group">
              <Database class="w-8 h-8 text-violet-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 class="text-white font-bold mb-3">Identity</h4>
              <ul class="text-xs text-surface-500 space-y-2 font-medium">
                <li>• Google Universal Profile</li>
                <li>• Authentication Metadata</li>
                <li>• Activity Logging</li>
              </ul>
            </div>
            <div class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group">
              <Eye class="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 class="text-white font-bold mb-3">Usage</h4>
              <ul class="text-xs text-surface-500 space-y-2 font-medium">
                <li>• Student Progress</li>
                <li>• Center Structures</li>
                <li>• Tournament Metrics</li>
              </ul>
            </div>
            <div class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group">
              <Lock class="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 class="text-white font-bold mb-3">Technical</h4>
              <ul class="text-xs text-surface-500 space-y-2 font-medium">
                <li>• AES-256 Encryption</li>
                <li>• Session Tokens</li>
                <li>• Security Logs</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="mb-16">
          <h2 class="text-2xl font-display font-black text-white mb-6">2. Information Purpose</h2>
          <p class="text-surface-400 font-medium leading-relaxed mb-6">We use your data exclusively to power your academy:</p>
          <div class="space-y-4 not-prose">
            {#each ['Maintenance of Critical Services', 'User Experience Optimization', 'Strategic Communications', 'Intrusion Prevention'] as item}
              <div class="flex items-center gap-4 text-surface-400 font-bold text-xs uppercase tracking-widest">
                <CheckCircle2 class="w-4 h-4 text-violet-500" />
                {item}
              </div>
            {/each}
          </div>
        </section>

        <section class="mb-16 border-l-4 border-violet-500/30 pl-8 py-2 bg-violet-500/[0.02] rounded-r-2xl">
          <h2 class="text-2xl font-display font-black text-white mb-6">3. Zero-Selling Guarantee</h2>
          <p class="text-surface-400 font-medium leading-relaxed">
            ChessNet has a <span class="text-violet-400 font-bold italic">Zero-Selling</span> policy. We will never sell, rent, or lease your personal data or those of your students to third parties for advertising or commercial purposes.
          </p>
        </section>

        <section class="mb-16">
          <h2 class="text-2xl font-display font-black text-white mb-6">4. Your Digital Rights</h2>
          <p class="text-surface-400 font-medium leading-relaxed mb-8">You maintain full control over your information:</p>
          <div class="flex flex-wrap gap-2 not-prose">
            {#each ['Access', 'Rectification', 'Erasure', 'Portability', 'Objection'] as derecho}
              <span class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase text-white tracking-wider">
                {derecho}
              </span>
            {/each}
          </div>
        </section>

        <section class="mt-20 pt-12 border-t border-white/10 text-center">
          <h3 class="text-xl font-bold text-white mb-6">Data Sovereignty</h3>
          <p class="text-surface-400 mb-8 font-medium italic">"Your data is yours. We only provide the tools to make it shine."</p>
          <div class="inline-flex flex-col items-center gap-3">
             <span class="text-[10px] font-black text-surface-600 uppercase tracking-widest">Data Protection Officer</span>
             <a href="mailto:chessnetappweb@gmail.com" class="text-violet-400 font-bold hover:text-violet-300 transition-colors">chessnetappweb@gmail.com</a>
          </div>
        </section>
      </div>
    </div>
  </main>

  <footer class="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center text-surface-600 text-[10px] font-black uppercase tracking-[0.3em]">
    Secure Infrastructure • ChessNet Cloud • EU Regions
  </footer>
</div>
