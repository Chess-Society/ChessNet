<script lang="ts">
  import { Heart, School, ArrowLeft, Sparkles } from 'lucide-svelte';
  import { fade } from 'svelte/transition';
  import Logo from '$lib/components/Logo.svelte';
</script>

<svelte:head>
  <title>Apoya el Proyecto | ChessNet Premium</title>
  <meta name="description" content="Ayuda a mantener ChessNet. Tu contribución financia los servidores y el desarrollo de nuevas herramientas para maestros." />
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
      Inicio
    </a>
  </nav>

  <!-- Content -->
  <main class="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center" in:fade={{ duration: 1000 }}>
    <div class="mb-12">
      <div class="inline-flex items-center justify-center p-4 rounded-[24px] bg-red-500/10 text-red-500 mb-8 border border-red-500/20 shadow-xl shadow-red-500/10 animate-pulse">
        <Heart class="w-10 h-10 fill-current" />
      </div>
      
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-widest mb-6">
        <Sparkles class="w-3.5 h-3.5" />
        <span>Comunidad y Pasión</span>
      </div>

      <h1 class="text-4xl md:text-6xl font-display font-black tracking-tight text-white mb-8">Apoya la <span class="text-primary-400 italic">Evolución</span></h1>
      
      <p class="text-lg md:text-xl text-surface-400 leading-relaxed mb-16 max-w-2xl mx-auto font-medium">
        ChessNet es un proyecto independiente nacido de la pasión por la enseñanza del ajedrez.
        Tu apoyo directo financia la infraestructura y el desarrollo de herramientas para miles de alumnos.
      </p>

      <div class="bento-card border-white/10 bg-white/[0.02] p-10 md:p-16 shadow-2xl relative overflow-hidden inline-block w-full">
        <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-30"></div>
        <h3 class="text-xl font-bold text-white mb-10">Donación Segura vía Stripe</h3>
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
           <span class="text-[10px] font-black text-surface-600 uppercase tracking-widest">Pago</span>
           <span class="text-white font-bold text-sm">STRIPE</span>
         </div>
         <div class="flex flex-col items-center gap-2">
           <span class="text-[10px] font-black text-surface-600 uppercase tracking-widest">Seguridad</span>
           <span class="text-white font-bold text-sm">SSL 256B</span>
         </div>
         <div class="flex flex-col items-center gap-2 col-span-2 md:col-span-1">
           <span class="text-[10px] font-black text-surface-600 uppercase tracking-widest">Tipo</span>
           <span class="text-white font-bold text-sm">DONACIÓN</span>
         </div>
      </div>
    </div>
  </main>
</div>
