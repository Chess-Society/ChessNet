<script lang="ts">
  import { Heart, School, ArrowLeft, Sparkles } from 'lucide-svelte';
  import { fade } from 'svelte/transition';
  import Logo from '$lib/components/Logo.svelte';
  import { t, locale } from '$lib/i18n';


</script>

<svelte:head>
  <title>{$t('nav.donate')} | ChessNet</title>
  <meta name="description" content={$t('donate.subtitle')} />
</svelte:head>

<div class="min-h-screen bg-bento-bg text-surface-200 font-sans selection:bg-primary-500/30 overflow-x-hidden">
  
  <!-- Premium Background Effects -->
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary-500/15 rounded-none blur-[140px] animate-pulse"></div>
    <div class="absolute bottom-[20%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-none blur-[120px]"></div>
  </div>

  <!-- Nav -->
  <nav class="relative z-10 p-8 flex justify-between items-center max-w-7xl mx-auto">
    <a href="/" class="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group">
      <div class="relative">
        <div class="absolute -inset-2 bg-primary-500/20 rounded-none blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <Logo size="w-10 h-10" iconSize="w-6 h-6" />
      </div>
      <span class="text-2xl font-display font-black tracking-tighter text-white">ChessNet</span>
    </a>
    <div class="flex items-center gap-6 relative z-10">


      <a href="/" class="flex items-center gap-2 text-surface-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors group">
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        {$t('back')}
      </a>
    </div>
  </nav>

  <!-- Content -->
  <main class="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center" in:fade={{ duration: 1000 }}>
    <div class="mb-12">
      <div class="inline-flex items-center justify-center p-4 rounded-none bg-red-500/10 text-red-500 mb-8 border border-red-500/20 shadow-xl shadow-red-500/10 animate-pulse">
        <Heart class="w-10 h-10 fill-current" />
      </div>
      
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-widest mb-6">
        <Sparkles class="w-3.5 h-3.5" />
        <span>{$t('donate.badge')}</span>
      </div>

      <h1 class="text-4xl md:text-6xl font-display font-black tracking-tight text-white mb-8">{$t('donate.title')}</h1>
      
      <p class="text-lg md:text-xl text-surface-400 leading-relaxed mb-16 max-w-2xl mx-auto font-medium">
        {$t('donate.subtitle')}
      </p>

      <div class="bento-card border-white/10 bg-white/[0.02] p-10 md:p-16 shadow-2xl relative overflow-hidden inline-block w-full">
        <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-30"></div>
        <h3 class="text-xl font-bold text-white mb-10">{$t('donate.stripe_btn')}</h3>
        <div class="relative z-10">
          <script async src="https://js.stripe.com/v3/buy-button.js"></script>
          <stripe-buy-button
            buy-button-id="buy_btn_1ShDC7RBnPDD6EfRe0xpMg3F"
            publishable-key="pk_live_51RzKQXRBnPDD6EfRTxX5YwO774aneUhFFobOgN60B6L119zJqahr3xkTIkq9Y4U9yROltHJGfbIREKP8yrLj19cb00gLokkz1l"
          >
          </stripe-buy-button>
        </div>
      </div>

      <div class="mt-16 pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-3 gap-8 grayscale opacity-50">
         <div class="flex flex-col items-center gap-2">
           <span class="text-[10px] font-black text-surface-600 uppercase tracking-widest">{$t('donate.payment').split(': ')[0]}</span>
           <span class="text-white font-bold text-sm">STRIPE</span>
         </div>
         <div class="flex flex-col items-center gap-2">
           <span class="text-[10px] font-black text-surface-600 uppercase tracking-widest">{$t('donate.secure').split(': ')[0]}</span>
           <span class="text-white font-bold text-sm">SSL 256B</span>
         </div>
         <div class="flex flex-col items-center gap-2 col-span-2 md:col-span-1">
           <span class="text-[10px] font-black text-surface-600 uppercase tracking-widest">{$t('donate.type').split(': ')[0]}</span>
           <span class="text-white font-bold text-sm">DONATION</span>
         </div>
      </div>
    </div>
  </main>
</div>

