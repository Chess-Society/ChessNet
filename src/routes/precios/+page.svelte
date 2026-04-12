<script lang="ts">
  import { goto } from '$app/navigation';
  import { CheckCircle, X, School } from 'lucide-svelte';
  import { Scale } from 'lucide-svelte';

  function goToLogin() {
    goto('/login');
  }
</script>

<svelte:head>
  <title>Precios | ChessNet</title>
  <meta name="description" content="Planes transparentes para profesores de ajedrez. Desde gratis hasta Premium por solo 1€/mes." />
</svelte:head>

<!-- Navbar -->
<header class="fixed inset-x-0 top-0 z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800">
  <nav class="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto" aria-label="Global">
    <div class="flex lg:flex-1">
      <a href="/" class="-m-1.5 p-1.5 text-2xl font-bold flex items-center gap-2 group">
        <div class="relative">
          <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-200"></div>
          <div class="relative bg-slate-900 rounded-lg p-1">
            <School class="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-extrabold tracking-tight">ChessNet</span>
      </a>
    </div>
    <div class="hidden lg:flex lg:gap-x-12">
      <a href="/#features" class="text-sm font-medium leading-6 text-slate-200 hover:text-white transition-all">Características</a>
      <a href="/donar" class="text-sm font-medium leading-6 text-slate-200 hover:text-white transition-all">Donar</a>
      <a href="/precios" class="text-sm font-medium leading-6 text-emerald-400 transition-all">Precios</a>
      <a href="/hoja-de-ruta" class="text-sm font-medium leading-6 text-slate-200 hover:text-white transition-all">Hoja de Ruta</a>
    </div>
    <div class="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
      <a href="/login" class="text-sm font-semibold leading-6 text-slate-200 hover:text-white px-4 py-2 rounded-lg">Iniciar Sesión</a>
      <a href="/login" class="rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg hover:bg-emerald-500 hover:scale-105 transition-all duration-300">Empezar Gratis</a>
    </div>
  </nav>
</header>

<main class="pt-20 bg-[#0f172a] min-h-screen text-white">
  <!-- Hero -->
  <div class="py-16 sm:py-24 relative overflow-hidden">
    <div class="absolute inset-0 z-0 opacity-10">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    </div>
    <div class="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
      <h1 class="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">Planes Transparentes</h1>
      <p class="max-w-2xl mx-auto text-lg text-slate-400">Olvida las cuotas abusivas. En ChessNet creemos en democratizar la tecnología para los profesores de ajedrez.</p>
    </div>
  </div>

  <!-- Pricing Cards -->
  <div id="pricing" class="py-24 sm:py-32 bg-slate-900/30">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-x-8">
        <!-- Free Plan -->
        <div class="flex flex-col justify-between rounded-3xl bg-slate-900/50 p-8 ring-1 ring-slate-800 xl:p-10 hover:border-slate-700 transition-all border border-transparent">
          <div>
            <h3 class="text-lg font-semibold leading-8 text-white">Ajedrecista</h3>
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
          <button onclick={goToLogin} class="mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 bg-slate-800 text-white hover:bg-slate-700 transition-all shadow-lg w-full">Empezar Gratis</button>
        </div>

        <!-- Premium Plan -->
        <div class="flex flex-col justify-between rounded-3xl bg-gradient-to-b from-indigo-900/40 to-slate-900/50 p-8 ring-2 ring-indigo-500 xl:p-10 relative overflow-hidden shadow-2xl">
          <div class="absolute top-0 right-0 p-4 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl shadow-lg">Recomendado (Beta)</div>
          <div>
            <h3 class="text-lg font-extrabold leading-8 text-indigo-400 flex items-center gap-2">Maestro Premium</h3>
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
          <a href="https://buy.stripe.com/test_5kAcN87vU8Xv06s8w8?client_reference_id=beta_user" target="_blank" class="mt-8 block rounded-md px-3 py-3 text-center text-sm font-bold leading-6 bg-indigo-600 text-white shadow-xl hover:bg-indigo-500 transition-all transform hover:-translate-y-1">Suscribirse Ahora</a>
        </div>
      </div>
    </div>
  </div>

  <!-- Comparison Table -->
  <div class="py-24 max-w-7xl mx-auto px-6 lg:px-8">
    <h3 class="text-2xl font-bold mb-12 text-center flex items-center justify-center gap-3">
      <Scale class="w-8 h-8 text-emerald-500" />
      Comparativa Detallada
    </h3>
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-slate-700">
            <th class="py-6 px-4 text-slate-500 font-medium font-sans uppercase tracking-widest text-xs">Característica</th>
            <th class="py-6 px-4 text-center font-bold text-white uppercase tracking-widest text-sm">Ajedrecista (Gratis)</th>
            <th class="py-6 px-4 text-center font-black text-indigo-400 uppercase tracking-widest text-sm bg-indigo-500/5">Maestro Premium</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
          <tr>
            <td class="py-6 px-4 text-slate-300">Colegios / Centros</td>
            <td class="py-6 px-4 text-center text-slate-400 font-medium">1</td>
            <td class="py-6 px-4 text-center text-white font-bold bg-indigo-500/5">Ilimitado</td>
          </tr>
          <tr>
            <td class="py-6 px-4 text-slate-300">Clases / Grupos</td>
            <td class="py-6 px-4 text-center text-slate-400 font-medium">2</td>
            <td class="py-6 px-4 text-center text-white font-bold bg-indigo-500/5">Ilimitado</td>
          </tr>
          <tr>
            <td class="py-6 px-4 text-slate-300">Alumnos Totales</td>
            <td class="py-6 px-4 text-center text-slate-400 font-medium">12</td>
            <td class="py-6 px-4 text-center text-white font-bold bg-indigo-500/5">Ilimitado</td>
          </tr>
          <tr>
            <td class="py-6 px-4 text-slate-300">Asistencia y Diario</td>
            <td class="py-6 px-4 text-center text-emerald-400"><CheckCircle class="mx-auto w-5 h-5" /></td>
            <td class="py-6 px-4 text-center text-emerald-400 bg-indigo-500/5"><CheckCircle class="mx-auto w-5 h-5" /></td>
          </tr>
          <tr>
            <td class="py-6 px-4 text-slate-300">Torneos Internos</td>
            <td class="py-6 px-4 text-center text-red-500/50"><X class="mx-auto w-5 h-5" /></td>
            <td class="py-6 px-4 text-center text-emerald-400 bg-indigo-500/5"><CheckCircle class="mx-auto w-5 h-5" /></td>
          </tr>
          <tr>
            <td class="py-6 px-4 text-slate-300">Generación de Diplomas</td>
            <td class="py-6 px-4 text-center text-red-500/50"><X class="mx-auto w-5 h-5" /></td>
            <td class="py-6 px-4 text-center text-emerald-400 bg-indigo-500/5"><CheckCircle class="mx-auto w-5 h-5" /></td>
          </tr>
          <tr>
            <td class="py-6 px-4 text-slate-300">Exportar a Excel/PDF</td>
            <td class="py-6 px-4 text-center text-red-500/50"><X class="mx-auto w-5 h-5" /></td>
            <td class="py-6 px-4 text-center text-emerald-400 bg-indigo-500/5"><CheckCircle class="mx-auto w-5 h-5" /></td>
          </tr>
          <tr>
            <td class="py-6 px-4 text-slate-300">Soporte Prioritario</td>
            <td class="py-6 px-4 text-center text-red-500/50"><X class="mx-auto w-5 h-5" /></td>
            <td class="py-6 px-4 text-center text-emerald-400 bg-indigo-500/5"><CheckCircle class="mx-auto w-5 h-5" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- FAQ -->
  <div class="py-24 bg-slate-900/50">
    <div class="max-w-3xl mx-auto px-6">
      <h3 class="text-3xl font-bold mb-12 text-center">Preguntas Frecuentes</h3>
      <div class="space-y-8">
        <div>
          <h4 class="text-lg font-bold text-white mb-2">¿Puedo cancelar en cualquier momento?</h4>
          <p class="text-slate-400">Sí, no hay permanencia. Si cancelas, seguirás teniendo acceso premium hasta que acabe tu mes en curso.</p>
        </div>
        <div>
          <h4 class="text-lg font-bold text-white mb-2">¿Qué pasa si supero los 12 alumnos en el plan gratis?</h4>
          <p class="text-slate-400">El sistema te pedirá que actualices al plan Maestro Premium para poder añadir más estudiantes. No bloquearemos los que ya tengas.</p>
        </div>
        <div>
          <h4 class="text-lg font-bold text-white mb-2">¿Cómo funciona la suscripción (Beta)?</h4>
          <p class="text-slate-400">Estamos en fase Beta. Al suscribirte por 1€/mes, nos ayudas a financiar los servidores y a crear nuevas funciones. El precio se mantendrá para los "early adopters".</p>
        </div>
      </div>
    </div>
  </div>
</main>

<!-- Footer -->
<footer class="bg-[#0b1120] border-t border-slate-800">
  <div class="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
    <div class="flex justify-center space-x-6 md:order-2">
      <a href="https://discord.gg/G7SrFtJHnr" target="_blank" rel="noreferrer" class="text-slate-400 hover:text-emerald-400">Discord</a>
    </div>
    <div class="mt-8 md:order-1 md:mt-0">
      <p class="text-center text-xs leading-5 text-slate-500">© {new Date().getFullYear()} ChessNet. Hecho con <span class="text-red-500">❤</span> para el ajedrez.</p>
    </div>
  </div>
</footer>
