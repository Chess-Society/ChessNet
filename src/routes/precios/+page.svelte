<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { CheckCircle2, XCircle, School, Scale, LayoutDashboard, Sparkles, ShieldCheck } from 'lucide-svelte';
  import { initiateUpgrade } from '$lib/api/subscriptions';
  import { auth } from '$lib/firebase';
  import { onAuthStateChanged, type User } from 'firebase/auth';
  import Logo from '$lib/components/Logo.svelte';

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
      goto('/login?redirect=/precios');
      return;
    }

    try {
      const result = await initiateUpgrade('premium', currentUser.uid, currentUser.email || undefined);
      if (result.success && result.payment_url) {
        window.location.href = result.payment_url;
      } else {
        alert(result.error || 'Error al iniciar suscripción');
      }
    } catch (e) {
      alert('Error de conexión');
    }
  }
</script>

<svelte:head>
  <title>Precios | ChessNet Premium</title>
  <meta name="description" content="Planes de suscripción para profesionales del ajedrez. Desde gratis hasta Premium ilimitado." />
</svelte:head>

<div class="min-h-screen bg-bento-bg text-surface-200 font-sans selection:bg-primary-500/30 overflow-x-hidden">
  
  <!-- Decorative Background Glows -->
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px] animate-pulse"></div>
    <div class="absolute bottom-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]"></div>
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150"></div>
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
      
      <div class="flex lg:flex-1 lg:justify-end gap-6 items-center">
        {#if isAuthLoading}
          <div class="w-32 h-10 bg-white/5 animate-pulse rounded-full"></div>
        {:else if currentUser}
          <a href="/panel" class="btn-primary py-2 px-6 text-sm">
            Ir al Panel
          </a>
        {:else}
          <a href="/login" class="text-sm font-bold text-surface-400 hover:text-white transition-colors">Entrar</a>
          <a href="/login" class="btn-primary py-2 px-6 text-sm">Empezar Gratis</a>
        {/if}
      </div>
    </nav>
  </header>

  <main class="relative z-10 pt-32 pb-24">
    <!-- Hero -->
    <div class="max-w-5xl mx-auto px-6 text-center mb-20 animate-fade-in">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-widest mb-8">
        <Sparkles class="w-3.5 h-3.5" />
        <span>Precios Transparentes</span>
      </div>
      <h1 class="text-5xl md:text-7xl font-display font-black text-white mb-8 tracking-tight">Olvida las cuotas <br /> <span class="text-primary-400 italic">Abusivas</span></h1>
      <p class="max-w-2xl mx-auto text-lg md:text-xl text-surface-400">Democratizando la tecnología para profesores de ajedrez. Sin permanencias, sin letra pequeña.</p>
    </div>

    <!-- Pricing Cards -->
    <div class="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
       <!-- Free Plan -->
       <div class="bento-card !rounded-[40px] flex flex-col group hover:border-surface-700 transition-all duration-500">
         <div class="p-12 flex-1">
            <h3 class="text-2xl font-bold text-white mb-2">Ajedrecista</h3>
            <p class="text-surface-500 text-sm mb-8">Ideal para clases particulares o grupos reducidos.</p>
            <div class="flex items-baseline gap-1 mb-10">
              <span class="text-6xl font-black text-white italic">0€</span>
              <span class="text-surface-600 font-bold uppercase tracking-widest text-[10px]">/ Siempre</span>
            </div>
            <ul class="space-y-5 text-surface-400 font-medium text-sm">
               <li class="flex items-center gap-3">
                 <CheckCircle2 class="w-5 h-5 text-surface-700" />
                 <span>1 Colegio / Centro educativo</span>
               </li>
               <li class="flex items-center gap-3">
                 <CheckCircle2 class="w-5 h-5 text-surface-700" />
                 <span>2 Clases o Grupos simultáneos</span>
               </li>
               <li class="flex items-center gap-3">
                 <CheckCircle2 class="w-5 h-5 text-surface-700" />
                 <span>Hasta 12 Alumnos totales</span>
               </li>
               <li class="flex items-center gap-3">
                 <CheckCircle2 class="w-5 h-5 text-surface-700" />
                 <span>Pase de lista y Asistencia</span>
               </li>
            </ul>
         </div>
         <div class="p-12 pt-0">
            <button onclick={() => goto('/login')} class="btn-secondary w-full py-5 text-lg font-bold">Empezar Gratis</button>
         </div>
       </div>

       <!-- Premium Plan -->
       <div class="bento-card !rounded-[40px] border-primary-500/40 bg-primary-500/[0.02] flex flex-col shadow-2xl shadow-primary-500/10 relative overflow-hidden group">
          <div class="absolute top-0 right-0 px-8 py-3 bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">RECOMENDADO</div>
          <div class="p-12 flex-1">
            <h3 class="text-2xl font-bold text-primary-400 mb-2">Maestro Premium</h3>
            <p class="text-surface-400/80 text-sm mb-8">El control total sin límites para tu academia.</p>
            <div class="flex items-baseline gap-1 mb-10">
              <span class="text-6xl font-black text-white italic">1€</span>
              <span class="text-primary-500/60 font-bold uppercase tracking-widest text-[10px]">/ Mes (Beta)</span>
            </div>
            <ul class="space-y-5 text-surface-200 font-semibold text-sm">
               <li class="flex items-center gap-3">
                 <ShieldCheck class="w-5 h-5 text-primary-400" />
                 <span>Centros y Clases Ilimitados</span>
               </li>
               <li class="flex items-center gap-3">
                 <ShieldCheck class="w-5 h-5 text-primary-400" />
                 <span>Alumnos Ilimitados</span>
               </li>
               <li class="flex items-center gap-3">
                 <ShieldCheck class="w-5 h-5 text-primary-400" />
                 <span>Gestión de Torneos (Pareos Pro)</span>
               </li>
               <li class="flex items-center gap-3">
                 <ShieldCheck class="w-5 h-5 text-primary-400" />
                 <span>Diplomas, Informes PDF y Excel</span>
               </li>
            </ul>
          </div>
          <div class="p-12 pt-0">
             <button onclick={handleSubscribe} class="btn-primary w-full py-5 text-lg font-extrabold shadow-xl shadow-primary-500/20">Suscribirse Ahora</button>
          </div>
       </div>
    </div>

    <!-- Comparison -->
    <div class="max-w-5xl mx-auto px-6">
      <div class="bento-card !p-0 border-white/5 overflow-hidden">
        <div class="p-8 border-b border-white/5 bg-white/[0.01]">
          <h3 class="text-2xl font-bold text-white flex items-center gap-3">
             <Scale class="w-6 h-6 text-primary-400" />
             Tabla Comparativa
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/[0.02]">
                <th class="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-surface-600">Módulo</th>
                <th class="py-6 px-10 text-center text-xs font-bold uppercase text-surface-400 tracking-tighter">Ajedrecista</th>
                <th class="py-6 px-10 text-center text-xs font-black uppercase text-primary-400 tracking-tighter bg-primary-500/[0.03]">Premium</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              {#each [
                ['Gestión de Alumnos', 'Hasta 12', 'Ilimitados'],
                ['Centros y Grupos', 'Limitado', 'Ilimitados'],
                ['Pase de Lista', 'Sí', 'Sí'],
                ['Torneos e Pareos', 'No', 'Sí'],
                ['Exportar Datos', 'No', 'Sí'],
                ['Diplomas Automáticos', 'No', 'Sí'],
                ['Soporte 24/7', 'Básico', 'Prioritario']
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
      <h3 class="text-3xl font-display font-black text-white text-center mb-16 italic">Preguntas de Maestros</h3>
      <div class="space-y-12">
        <div class="group">
          <h4 class="text-lg font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">¿Puedo cancelar en cualquier momento?</h4>
          <p class="text-surface-500 leading-relaxed">Sin duda. No hay permanencia ni procesos complicados. Un clic en tu perfil y estarás libre de cargos para el siguiente mes.</p>
        </div>
        <div class="group">
          <h4 class="text-lg font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">¿Qué pasa si mis datos crecen?</h4>
          <p class="text-surface-500 leading-relaxed">ChessNet está construido sobre infraestructura Google Cloud para escalar. Tus datos estarán seguros y accesibles ya tengas 10 o 10.000 alumnos.</p>
        </div>
        <div class="group">
          <h4 class="text-lg font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">¿Por qué solo 1€?</h4>
          <p class="text-surface-500 leading-relaxed">Estamos en fase de lanzamiento. Queremos que la barrera de entrada sea inexistente para que los profesores nos ayuden a pulir la herramienta ideal.</p>
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
      <div class="flex gap-6">
        <a href="https://discord.gg/G7SrFtJHnr" target="_blank" class="text-surface-500 hover:text-white transition-colors">Discord</a>
        <a href="/legal" class="text-surface-500 hover:text-white transition-colors">Legal</a>
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
