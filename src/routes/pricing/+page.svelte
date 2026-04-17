<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { CheckCircle, XCircle, Buildings, Scales, SquaresFour, Sparkle, Shield } from 'phosphor-svelte';
  import { initiateUpgrade } from '$lib/api/subscriptions';
  import { auth } from '$lib/firebase';
  import { onAuthStateChanged, type User } from 'firebase/auth';
  import Logo from '$lib/components/Logo.svelte';

  import { toast, showError } from '$lib/stores/toast';
  import { t, locale } from '$lib/i18n';

  let currentUser = $state<User | null>(null);
  let isAuthLoading = $state(true);

  onMount(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      currentUser = user;
      isAuthLoading = false;
    });
    return unsubscribe;
  });

  async function handleSubscribe() {
    if (!currentUser) {
      goto('/login?redirect=/pricing');
      return;
    }

    try {
      const result = await initiateUpgrade('premium', currentUser.uid, currentUser.email || undefined);
      if (result.success && result.payment_url) {
        window.location.href = result.payment_url;
      } else {
        toast.error(result.error || 'Error starting subscription');
      }
    } catch (e) {
      showError(e, 'Connection error');
    }
  }

  function toggleLocale() {
    locale.update(l => l === 'en' ? 'es' : 'en');
  }
</script>

<svelte:head>
  <title>{$t('nav.pricing')} | ChessNet Premium</title>
  <meta name="description" content="Subscription plans for chess professionals. From free to unlimited Premium." />
</svelte:head>

<div class="min-h-screen bg-bento-bg text-surface-200 font-sans selection:bg-primary-500/30 overflow-x-hidden">
  
  <!-- Decorative Background Glows -->
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary-500/15 rounded-full blur-[140px] animate-pulse"></div>
    <div class="absolute bottom-[20%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
  </div>

  <!-- Navbar -->
  <header class="fixed inset-x-0 top-0 z-50 bg-bento-bg/70 backdrop-blur-2xl border-b border-white/5 transition-all py-4">
    <nav class="flex items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto" aria-label="Global">
      <div class="flex lg:flex-1">
        <a href="/" class="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95">
          <div class="relative">
            <div class="absolute -inset-2 bg-primary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <Logo size="w-10 h-10" iconSize="w-6 h-6" />
          </div>
          <span class="text-2xl font-display font-black tracking-tighter text-white">ChessNet</span>
        </a>
      </div>
      
      <div class="flex lg:flex-1 lg:justify-end gap-3 sm:gap-6 items-center">
        <!-- Language Switcher -->
        <button 
          onclick={toggleLocale} 
          class="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-surface-400 hover:text-white hover:border-white/20 transition-all"
        >
          {$locale}
        </button>

        {#if isAuthLoading}
          <div class="w-32 h-10 bg-white/5 animate-pulse rounded-full"></div>
        {:else if currentUser}
          <a href="/panel" class="btn-primary py-2 px-6 text-sm">
            {$t('nav.goPanel')}
          </a>
        {:else}
          <a href="/login" class="text-sm font-bold text-surface-400 hover:text-white transition-colors">{$t('nav.login')}</a>
          <a href="/login" class="btn-primary py-2 px-6 text-sm">{$t('nav.startFree')}</a>
        {/if}
      </div>
    </nav>
  </header>

  <main class="relative z-10 pt-32 pb-24">
    <!-- Hero -->
    <div class="max-w-5xl mx-auto px-6 text-center mb-20 animate-fade-in">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-widest mb-8">
        <Sparkle class="w-3.5 h-3.5" />
        <span>{$t('pricing.recommended')}</span>
      </div>
      <h1 class="text-5xl md:text-7xl font-display font-black text-white mb-8 tracking-tight">
        {$t('pricing.title')}
      </h1>
      <p class="max-w-2xl mx-auto text-lg md:text-xl text-surface-400">{$t('pricing.subtitle')}</p>
    </div>

    <!-- Pricing Cards -->
    <div class="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
       <!-- Free Plan -->
       <div class="bento-card !rounded-[40px] flex flex-col group hover:border-surface-700 transition-all duration-500">
         <div class="p-12 flex-1">
            <h3 class="text-2xl font-bold text-white mb-2">{$t('pricing.free.title')}</h3>
            <p class="text-surface-500 text-sm mb-8">{$t('pricing.free.desc')}</p>
            <div class="flex items-baseline gap-1 mb-10">
              <span class="text-6xl font-black text-white italic">{$t('pricing.free.price')}</span>
              <span class="text-surface-600 font-bold uppercase tracking-widest text-[10px]">{$t('pricing.free.period')}</span>
            </div>
            <ul class="space-y-5 text-surface-400 font-medium text-sm">
               <li class="flex items-center gap-3">
                 <CheckCircle class="w-5 h-5 text-surface-700" />
                 <span>{$t('pricing.free.feat1')}</span>
               </li>
               <li class="flex items-center gap-3">
                 <CheckCircle class="w-5 h-5 text-surface-700" />
                 <span>{$t('pricing.free.feat2')}</span>
               </li>
               <li class="flex items-center gap-3">
                 <CheckCircle class="w-5 h-5 text-surface-700" />
                 <span>{$t('pricing.free.feat3')}</span>
               </li>
               <li class="flex items-center gap-3">
                 <CheckCircle class="w-5 h-5 text-surface-700" />
                 <span>{$t('pricing.free.feat4')}</span>
               </li>
            </ul>
         </div>
         <div class="p-12 pt-0">
            <button onclick={() => goto('/login')} class="btn-secondary w-full py-5 text-lg font-bold">{$t('nav.startFree')}</button>
         </div>
       </div>

       <!-- Premium Plan -->
       <div class="bento-card !rounded-[40px] border-primary-500/40 bg-primary-500/[0.02] flex flex-col shadow-2xl shadow-primary-500/10 relative overflow-hidden group">
          <div class="absolute top-0 right-0 px-8 py-3 bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">{$t('pricing.recommended')}</div>
          <div class="p-12 flex-1">
            <h3 class="text-2xl font-bold text-primary-400 mb-2">{$t('pricing.premium.title')}</h3>
            <p class="text-surface-400/80 text-sm mb-8">{$t('pricing.premium.desc')}</p>
            <div class="flex items-baseline gap-1 mb-10">
              <span class="text-6xl font-black text-white italic">{$t('pricing.premium.price')}</span>
              <span class="text-primary-500/60 font-bold uppercase tracking-widest text-[10px]">{$t('pricing.premium.period')}</span>
            </div>
            <ul class="space-y-5 text-surface-200 font-semibold text-sm">
               <li class="flex items-center gap-3">
                 <Shield class="w-5 h-5 text-primary-400" />
                 <span>{$t('pricing.premium.feat1')}</span>
               </li>
               <li class="flex items-center gap-3">
                 <Shield class="w-5 h-5 text-primary-400" />
                 <span>{$t('pricing.premium.feat2')}</span>
               </li>
               <li class="flex items-center gap-3">
                 <Shield class="w-5 h-5 text-primary-400" />
                 <span>{$t('pricing.premium.feat3')}</span>
               </li>
               <li class="flex items-center gap-3">
                 <Shield class="w-5 h-5 text-primary-400" />
                 <span>{$t('pricing.premium.feat4')}</span>
               </li>
            </ul>
          </div>
          <div class="p-12 pt-0">
             <button onclick={handleSubscribe} class="btn-primary w-full py-5 text-lg font-extrabold shadow-xl shadow-primary-500/20">{$t('pricing.premium.cta')}</button>
          </div>
       </div>
    </div>

    <!-- Comparison -->
    <div class="max-w-5xl mx-auto px-6">
      <div class="bento-card !p-0 border-white/5 overflow-hidden">
        <div class="p-8 border-b border-white/5 bg-white/[0.01]">
          <h3 class="text-2xl font-bold text-white flex items-center gap-3">
             <Scales class="w-6 h-6 text-primary-400" />
             {$t('pricing.comparison.title')}
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/[0.02]">
                <th class="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-surface-600">{$t('pricing.comparison.module')}</th>
                <th class="py-6 px-10 text-center text-xs font-bold uppercase text-surface-400 tracking-tighter">{$t('pricing.free.title')}</th>
                <th class="py-6 px-10 text-center text-xs font-black uppercase text-primary-400 tracking-tighter bg-primary-500/[0.03]">{$t('pricing.premium.title')}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              {#each [
                [$t('pricing.table.feat1'), $t('pricing.free.feat3'), $t('pricing.table.unlimited')],
                [$t('pricing.table.feat2'), $t('pricing.table.limited'), $t('pricing.table.unlimited')],
                [$t('pricing.table.feat3'), $t('pricing.table.yes'), $t('pricing.table.yes')],
                [$t('pricing.table.feat4'), $t('pricing.table.no'), $t('pricing.table.yes')],
                [$t('pricing.table.feat5'), $t('pricing.table.no'), $t('pricing.table.yes')],
                [$t('pricing.table.feat6'), $t('pricing.table.no'), $t('pricing.table.yes')],
                [$t('pricing.table.feat7'), $t('pricing.table.basic'), $t('pricing.table.priority')]
              ] as [title, free, premium]}
                <tr class="hover:bg-white/[0.01] transition-colors">
                  <td class="py-5 px-10 text-sm font-medium text-surface-300">{title}</td>
                  <td class="py-5 px-10 text-center text-sm font-bold text-surface-500">{free}</td>
                  <td class="py-5 px-10 text-center text-sm font-black text-white bg-primary-500/[0.03]">{premium}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- FAQ -->
    <div class="max-w-3xl mx-auto px-6 mt-32">
      <h3 class="text-3xl font-display font-black text-white text-center mb-16 italic">{$t('pricing.faq.title')}</h3>
      <div class="space-y-12">
        <div class="group">
          <h4 class="text-lg font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
            {$t('pricing.faq.q1')}
          </h4>
          <p class="text-surface-500 leading-relaxed">
            {$t('pricing.faq.a1')}
          </p>
        </div>
        <div class="group">
          <h4 class="text-lg font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
            {$t('pricing.faq.q2')}
          </h4>
          <p class="text-surface-500 leading-relaxed">
            {$t('pricing.faq.a2')}
          </p>
        </div>
        <div class="group">
          <h4 class="text-lg font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
            {$t('pricing.faq.q3').replace('{currency}', '1' + $t('common.currency'))}
          </h4>
          <p class="text-surface-500 leading-relaxed">
            {$t('pricing.faq.a3')}
          </p>
        </div>
      </div>
    </div>
  </main>

  <footer class="py-12 px-6 border-t border-white/5 relative z-10">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div class="flex items-center gap-3">
        <Logo size="w-8 h-8" iconSize="w-5 h-5" />
        <span class="text-xl font-display font-black tracking-tighter text-white">ChessNet</span>
      </div>
      <p class="text-surface-500 text-sm font-medium">© {new Date().getFullYear()} ChessNet. Crafted with <span class="text-primary-500">violet passion</span> for chess.</p>
      <div class="flex flex-wrap justify-center gap-6">
        <a href="/pricing" class="text-surface-500 hover:text-white transition-colors text-sm">{$t('nav.pricing')}</a>
        <a href="/roadmap" class="text-surface-500 hover:text-white transition-colors text-sm">{$t('nav.roadmap')}</a>
        <a href="/donate" class="text-surface-500 hover:text-white transition-colors text-sm">{$t('nav.donate')}</a>
        <a href="/legal/terms" class="text-surface-500 hover:text-white transition-colors text-sm">{$t('legal.terms')}</a>
        <a href="/legal/privacy" class="text-surface-500 hover:text-white transition-colors text-sm">{$t('legal.privacy')}</a>
      </div>
    </div>
  </footer>
</div>

<style lang="postcss">
  .animate-fade-in {
    animation: fadeIn 1s ease-out forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
