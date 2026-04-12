<script lang="ts">
  import { goto } from '$app/navigation';
  import { CheckCircle, ArrowRight, BookOpen, Users, Trophy, ChevronRight } from 'lucide-svelte';
  import Logo from '$lib/components/Logo.svelte';

  let { data } = $props();

  let scrollY = $state(0);

  function goToPanel() {
    goto('/panel');
  }

  function goToLogin() {
    goto('/login');
  }
</script>

<svelte:head>
  <title>ChessNet - Gestión Profesional de Academias de Ajedrez</title>
  <meta name="title" content="ChessNet - Gestión Profesional de Academias de Ajedrez" />
  <meta name="description" content="Plataforma completa para gestionar tu academia de ajedrez: alumnos, clases, torneos, pagos y más. Diseñada por y para profesores de ajedrez." />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="ChessNet - Gestión Profesional de Academias de Ajedrez" />
  <meta property="og:description" content="Plataforma completa para gestionar tu academia de ajedrez: alumnos, clases, torneos, pagos y más." />
  <meta property="og:site_name" content="ChessNet" />
  <meta name="robots" content="index, follow" />
</svelte:head>

<svelte:window bind:scrollY />

<!-- Navbar -->
<header class={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrollY > 10 ? 'bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800' : 'bg-transparent'}`}>
  <nav class="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto" aria-label="Global">
    <div class="flex lg:flex-1">
      <a href="/" class="-m-1.5 p-1.5 text-2xl font-bold flex items-center gap-2 group">
        <div class="relative">
          <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-200"></div>
          <Logo size="w-10 h-10" iconSize="w-6 h-6" />
        </div>
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-extrabold tracking-tight">ChessNet</span>
      </a>
    </div>
    <div class="hidden lg:flex lg:gap-x-12">
      <a href="#features" class="text-sm font-medium leading-6 text-slate-200 hover:text-white hover:scale-105 transition-all">Características</a>
      <a href="/donar" class="text-sm font-medium leading-6 text-slate-200 hover:text-white hover:scale-105 transition-all">Donar</a>
      <a href="/precios" class="text-sm font-medium leading-6 text-slate-200 hover:text-white hover:scale-105 transition-all flex items-center gap-1">
        Precios
        <span class="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">BETA</span>
      </a>
      <a href="/hoja-de-ruta" class="text-sm font-medium leading-6 text-slate-200 hover:text-white hover:scale-105 transition-all">Hoja de Ruta</a>
    </div>
    <div class="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
      {#if data.isAuthenticated}
        <button onclick={goToPanel} class="rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg hover:bg-emerald-500 hover:scale-105 transition-all duration-300">
          Ir al Panel
        </button>
      {:else}
        <a href="/login" class="text-sm font-semibold leading-6 text-slate-200 hover:text-white px-4 py-2 rounded-lg">Iniciar Sesión</a>
        <a href="/login" class="rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg hover:bg-emerald-500 hover:scale-105 transition-all duration-300">Empezar Gratis</a>
      {/if}
    </div>
  </nav>
</header>

<!-- Background -->
<div class="bg-[#0f172a] min-h-screen text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden">
  <div class="fixed inset-0 z-0 opacity-20 pointer-events-none">
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
  </div>
  <div class="fixed top-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] pointer-events-none animate-pulse"></div>
  <div class="fixed bottom-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none"></div>

  <!-- Hero Section -->
  <div class="relative isolate px-6 pt-14 lg:px-8">
    <div class="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56 text-center z-10 relative">
      <div class="hidden sm:mb-8 sm:flex sm:justify-center">
        <div class="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-400 ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/5 transition-all cursor-default">
          Evoluciona tu enseñanza
          <span class="font-semibold text-emerald-400">
            <span class="absolute inset-0" aria-hidden="true"></span>
            v1.0 BETA
          </span>
        </div>
      </div>
      <h1 class="text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-6 drop-shadow-2xl">
        La plataforma definitiva para <br />
        <span class="bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">Profesores de Ajedrez</span>
      </h1>
      <p class="mt-6 text-lg leading-8 text-slate-200 max-w-2xl mx-auto">
        Gestiona tus clases particulares, grupos escolares o tu propia
        academia desde un solo lugar. Olvida el papel y profesionaliza tu
        pasión.
      </p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <button onclick={data.isAuthenticated ? goToPanel : goToLogin} class="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:shadow-emerald-500/30 hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center gap-2 group">
          Empezar Gratis
          <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <a href="#features" class="text-sm font-semibold leading-6 text-white hover:text-emerald-400 transition-colors flex items-center gap-2">
          Ver demo
          <ChevronRight class="w-4 h-4" />
        </a>
      </div>
    </div>

    <!-- Mock Dashboard Preview -->
    <div class="relative w-full max-w-6xl mx-auto -mt-20 lg:-mt-32 opacity-90 hover:opacity-100 transition-opacity duration-700">
      <div class="relative rounded-xl bg-slate-900/50 backdrop-blur-xl border border-slate-700 p-2 shadow-2xl">
        <div class="rounded-lg bg-[#0f172a] overflow-hidden border border-slate-800 h-[300px] md:h-[500px] flex items-center justify-center relative">
          <div class="absolute inset-x-0 top-0 h-12 bg-slate-900 border-b border-slate-700 flex items-center px-4 gap-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
            <div class="ml-4 w-64 h-6 bg-slate-800 rounded"></div>
          </div>
          <div class="grid grid-cols-4 gap-4 p-8 w-full mt-12 mx-auto max-w-5xl opacity-50">
            <div class="col-span-1 h-32 bg-slate-800 rounded-xl animate-pulse"></div>
            <div class="col-span-1 h-32 bg-slate-800 rounded-xl animate-pulse delay-75"></div>
            <div class="col-span-1 h-32 bg-slate-800 rounded-xl animate-pulse delay-150"></div>
            <div class="col-span-1 h-32 bg-slate-800 rounded-xl animate-pulse delay-200"></div>
            <div class="col-span-3 h-64 bg-slate-800 rounded-xl animate-pulse mt-4 delay-300"></div>
            <div class="col-span-1 h-64 bg-slate-800 rounded-xl animate-pulse mt-4 delay-500"></div>
          </div>
          <div class="absolute inset-0 flex items-center justify-center">
            <button onclick={data.isAuthenticated ? goToPanel : goToLogin} class="bg-slate-900/80 backdrop-blur border border-slate-600 text-white px-6 py-3 rounded-xl font-bold hover:scale-110 transition-transform cursor-pointer shadow-2xl">
              Entrar a la Demo Interactiva
            </button>
          </div>
        </div>
      </div>
      <div class="absolute inset-x-8 -bottom-12 h-12 bg-gradient-to-b from-emerald-500/20 to-transparent blur-2xl -z-10 mx-auto w-3/4"></div>
    </div>
  </div>

  <!-- Features Section -->
  <div id="features" class="relative py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:text-center mb-16">
        <h2 class="text-base font-semibold leading-7 text-emerald-400">Características Principales</h2>
        <p class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Todo lo que necesita un club moderno</p>
        <p class="mt-6 text-lg leading-8 text-slate-400">
          Desde pequeñas academias hasta grandes clubes, ChessNet escala contigo.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Diario de Clase -->
        <div class="relative group bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2">
          <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <BookOpen class="w-24 h-24 text-emerald-500" />
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:text-emerald-300 group-hover:scale-110 transition-all">
            <BookOpen class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Diario de Clase</h3>
          <p class="text-slate-400 leading-relaxed">Pasa lista en segundos, registra los temas impartidos y evalúa el progreso de cada sesión al instante.</p>
        </div>

        <!-- Material Didáctico -->
        <div class="relative group bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-pink-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2">
          <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <BookOpen class="w-24 h-24 text-pink-500" />
          </div>
          <div class="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-6 text-pink-400 group-hover:text-pink-300 group-hover:scale-110 transition-all">
            <BookOpen class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Material Didáctico</h3>
          <p class="text-slate-400 leading-relaxed">Organiza tu temario. Define habilidades (Celada, Apertura...) y asígnalas a tus alumnos cuando las dominen.</p>
        </div>

        <!-- Ficha de Alumno -->
        <div class="relative group bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2">
          <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users class="w-24 h-24 text-blue-500" />
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all">
            <Users class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Ficha de Alumno</h3>
          <p class="text-slate-400 leading-relaxed">Ten a mano niveles, contacto, notas privadas y estadísticas de asistencia de cada estudiante.</p>
        </div>

        <!-- Torneos Internos -->
        <div class="relative group bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-orange-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2">
          <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy class="w-24 h-24 text-orange-500" />
          </div>
          <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-6 text-orange-400 group-hover:text-orange-300 group-hover:scale-110 transition-all">
            <Trophy class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Torneos Internos</h3>
          <p class="text-slate-400 leading-relaxed">Crea competiciones para tus alumnos, genera emparejamientos y fomenta la práctica competitiva.</p>
        </div>

        <!-- Clubes y Academias -->
        <div class="relative group bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2">
          <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <School class="w-24 h-24 text-purple-500" />
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:text-purple-300 group-hover:scale-110 transition-all">
            <School class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Clubes y Academias</h3>
          <p class="text-slate-400 leading-relaxed">¿Creces? ChessNet escala contigo. Gestiona múltiples ubicaciones, profesores y cientos de alumnos.</p>
        </div>

        <!-- Próximamente -->
        <div class="relative group bg-slate-800/30 p-8 rounded-3xl border border-slate-800 border-dashed flex flex-col items-center justify-center text-center">
          <h3 class="text-xl font-bold text-white mb-2">Próximamente</h3>
          <p class="text-slate-500 text-sm">Pagos online integrados, app para padres y herramientas de marketing.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Pricing Section -->
  <div id="pricing" class="py-24 sm:py-32 bg-slate-900/30">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl sm:text-center">
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Un plan para cada nivel</h2>
        <p class="mt-6 text-lg leading-8 text-slate-400">Lleva tu escuela al siguiente nivel con ChessNet. Sin permanencia, cancela cuando quieras.</p>
      </div>

      <div class="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-x-8">
        <!-- Free Plan -->
        <div class="flex flex-col justify-between rounded-3xl bg-slate-900/50 p-8 ring-1 ring-slate-800 xl:p-10 hover:border-slate-700 transition-all border border-transparent">
          <div>
            <div class="flex items-center justify-between gap-x-4">
              <h3 id="tier-free" class="text-lg font-semibold leading-8 text-white">Ajedrecista</h3>
            </div>
            <p class="mt-4 text-sm leading-6 text-slate-400">Perfecto para empezar o gestionar una pequeña escuela local.</p>
            <p class="mt-6 flex items-baseline gap-x-1">
              <span class="text-4xl font-bold tracking-tight text-white">0€</span>
              <span class="text-sm font-semibold leading-6 text-slate-400">/mes</span>
            </p>
            <ul role="list" class="mt-8 space-y-3 text-sm leading-6 text-slate-300">
              <li class="flex gap-x-3"><CheckCircle class="h-6 w-5 flex-none text-emerald-500" /> 1 Centro / Colegio</li>
              <li class="flex gap-x-3"><CheckCircle class="h-6 w-5 flex-none text-emerald-500" /> 2 Clases simultáneas</li>
              <li class="flex gap-x-3"><CheckCircle class="h-6 w-5 flex-none text-emerald-500" /> Hasta 12 Alumnos totales</li>
              <li class="flex gap-x-3"><CheckCircle class="h-6 w-5 flex-none text-emerald-500" /> Pase de lista y Asistencia</li>
            </ul>
          </div>
          <button onclick={data.isAuthenticated ? goToPanel : goToLogin} aria-describedby="tier-free" class="mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 bg-slate-800 text-white hover:bg-slate-700 transition-all shadow-lg w-full">Empezar Gratis</button>
        </div>

        <!-- Premium Plan -->
        <div class="flex flex-col justify-between rounded-3xl bg-gradient-to-b from-indigo-900/40 to-slate-900/50 p-8 ring-2 ring-indigo-500 xl:p-10 relative overflow-hidden shadow-2xl">
          <div class="absolute top-0 right-0 p-4 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl shadow-lg">Recomendado (Beta)</div>
          <div>
            <div class="flex items-center justify-between gap-x-4">
              <h3 id="tier-premium" class="text-lg font-extrabold leading-8 text-indigo-400 flex items-center gap-2">Maestro Premium</h3>
            </div>
            <p class="mt-4 text-sm leading-6 text-slate-300">Todas las herramientas sin límites para un control profesional total.</p>
            <p class="mt-6 flex items-baseline gap-x-1">
              <span class="text-4xl font-extrabold tracking-tight text-white">1€</span>
              <span class="text-sm font-semibold leading-6 text-indigo-300">/mes</span>
            </p>
            <ul role="list" class="mt-8 space-y-3 text-sm leading-6 text-slate-200">
              <li class="flex gap-x-3 font-bold text-white"><CheckCircle class="h-6 w-5 flex-none text-indigo-400" /> Centros y Clases Ilimitados</li>
              <li class="flex gap-x-3 font-bold text-white"><CheckCircle class="h-6 w-5 flex-none text-indigo-400" /> Alumnos Ilimitados</li>
              <li class="flex gap-x-3"><CheckCircle class="h-6 w-5 flex-none text-emerald-500" /> Gestión de Torneos (Emparejamientos)</li>
              <li class="flex gap-x-3"><CheckCircle class="h-6 w-5 flex-none text-emerald-500" /> Informes PDF y Diplomas</li>
              <li class="flex gap-x-3"><CheckCircle class="h-6 w-5 flex-none text-emerald-500" /> Exportación de datos (Excel/PDF)</li>
            </ul>
          </div>
          <a href="https://buy.stripe.com/test_5kAcN87vU8Xv06s8w8?client_reference_id=beta_user" target="_blank" aria-describedby="tier-premium" class="mt-8 block rounded-md px-3 py-3 text-center text-sm font-bold leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 bg-indigo-600 text-white shadow-xl hover:bg-indigo-500 transition-all transform hover:-translate-y-1">Suscribirse Ahora</a>
        </div>
      </div>

      <div class="mt-12 text-center">
        <p class="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
          * El plan Premium está en fase Beta. El precio de 1€/mes es promocional para los primeros usuarios.
          Al suscribirte aceptas los términos de servicio de ChessNet.
        </p>
      </div>
    </div>
  </div>

  <!-- CTA Section -->
  <div class="relative isolate py-16 sm:py-24">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="relative overflow-hidden bg-slate-900 px-6 py-24 shadow-2xl rounded-3xl sm:px-24 xl:py-32 border border-slate-800">
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-slate-900 -z-10"></div>
        <h2 class="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">Tu enseñanza merece herramientas profesionales.</h2>
        <p class="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-slate-200">
          Únete a los profesores que ya han dejado atrás el caos de notas y hojas de cálculo.
        </p>
        <div class="mt-10 flex justify-center gap-x-6">
          <button onclick={data.isAuthenticated ? goToPanel : goToLogin} class="rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-slate-900 shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all hover:scale-105">Crear Cuenta Gratis</button>
        </div>
        <svg viewBox="0 0 1024 1024" class="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]" aria-hidden="true">
          <circle cx="512" cy="512" r="512" fill="url(#gradient-cta)" fill-opacity="0.2"></circle>
          <defs>
            <radialGradient id="gradient-cta">
              <stop stop-color="#10b981"></stop>
              <stop offset="1" stop-color="#0f172a"></stop>
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="bg-[#0b1120] border-t border-slate-800">
    <div class="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
      <div class="flex justify-center space-x-6 md:order-2">
        <a href="https://discord.gg/G7SrFtJHnr" target="_blank" rel="noreferrer" class="text-slate-400 hover:text-emerald-400">Discord</a>
      </div>
      <div class="mt-8 md:order-1 md:mt-0">
        <p class="text-center text-xs leading-5 text-slate-500">
          © {new Date().getFullYear()} ChessNet. Hecho con <span class="text-red-500">❤</span> para el ajedrez.
        </p>
      </div>
    </div>
  </footer>
</div>
