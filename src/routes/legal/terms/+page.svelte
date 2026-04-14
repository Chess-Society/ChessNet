<script lang="ts">
  import { ArrowLeft, AlertTriangle, FileText, Sparkles } from 'lucide-svelte';
  import Logo from '$lib/components/Logo.svelte';
</script>

<svelte:head>
  <title>Términos de Servicio | ChessNet Premium</title>
</svelte:head>

<div class="min-h-screen bg-bento-bg text-surface-200 font-sans selection:bg-primary-500/30 overflow-x-hidden">
  
  <!-- Premium Background Effects -->
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-500/5 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]"></div>
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150"></div>
  </div>

  <!-- Header -->
  <header class="relative z-10 p-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-6 sm:gap-8">
    <a href="/" class="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group">
      <div class="relative">
        <div class="absolute -inset-2 bg-primary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <Logo size="w-10 h-10" iconSize="w-6 h-6" />
      </div>
      <span class="text-2xl font-display font-black tracking-tighter text-white">ChessNet</span>
    </a>
    
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
        <FileText class="w-4 h-4 text-primary-400" />
        <span class="text-xs font-bold text-white uppercase tracking-widest">Términos Legales</span>
      </div>
      <a href="/" class="flex items-center gap-2 text-surface-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors group">
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Inicio
      </a>
    </div>
  </header>

  <main class="relative z-10 max-w-4xl mx-auto px-6 py-12">
    <!-- Beta Warning -->
    <div class="bento-card border-yellow-500/20 bg-yellow-500/5 p-6 mb-16 shadow-2xl relative overflow-hidden group">
      <div class="absolute top-0 inset-x-0 h-0.5 bg-yellow-500/30"></div>
      <div class="flex items-start gap-5">
        <div class="p-3 rounded-2xl bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 group-hover:scale-110 transition-transform">
          <AlertTriangle class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-yellow-300 mb-2 flex items-center gap-2">
            Versión Beta - Aviso de Integridad
            <span class="text-[10px] bg-yellow-500/20 px-2 py-0.5 rounded-full">ESTADO ACTUAL</span>
          </h3>
          <p class="text-yellow-200/80 text-sm leading-relaxed">
            ChessNet está en fase de despliegue y optimización continua. 
            <strong class="text-white">Los datos almacenados pueden ser reseteados</strong> durante transiciones críticas de infraestructura. 
            Recomendamos realizar exportaciones periódicas de sus listados de alumnos.
          </p>
        </div>
      </div>
    </div>

    <!-- Content Card -->
    <div class="bento-card border-white/5 bg-white/[0.02] p-8 md:p-12 shadow-2xl">
      <div class="prose prose-invert prose-primary max-w-none">
        <div class="flex items-center gap-3 text-surface-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
          <Sparkles class="w-3.5 h-3.5 text-primary-500" />
          Actualizado: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        <section class="mb-12">
          <h2 class="text-2xl font-display font-black text-white mb-6">1. Aceptación de los Términos</h2>
          <p class="text-surface-400 font-medium leading-relaxed">
            Al acceder y utilizar <span class="text-white font-bold">ChessNet</span>, usted acepta formalmente estar sujeto a estos Términos de Servicio y a todas las leyes y regulaciones locales e internacionales aplicables. El uso continuado de la plataforma implica la aceptación tácita de cualquier modificación futura.
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-display font-black text-white mb-6">2. Alcance del Ecosistema</h2>
          <p class="text-surface-400 font-medium leading-relaxed mb-6">
            ChessNet proporciona una infraestructura digital integral para profesionales del ajedrez, incluyendo pero no limitado a:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
            {#each ['Gestión de Alumnos', 'Control de Asistencia', 'Seguimiento de Habilidades', 'Pasarela de Pagos', 'Organización de Torneos', 'Analytics Avanzado'] as feature}
              <div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm">
                <div class="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                {feature}
              </div>
            {/each}
          </div>
        </section>

        <section class="mb-12 border-l-4 border-primary-500/30 pl-8 py-2 bg-primary-500/[0.02] rounded-r-2xl">
          <h2 class="text-2xl font-display font-black text-white mb-6">3. Política de Resiliencia de Datos</h2>
          <p class="text-surface-400 font-medium leading-relaxed">
            Como plataforma en evolución constante, ChessNet se reserva el derecho de modificar estructuras de base de datos que podrían requerir migraciones. Notificaremos con un margen de <span class="text-white font-bold">30 días naturales</span> cualquier cambio disruptivo que afecte la persistencia de la información.
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-display font-black text-white mb-6">4. Seguridad y Cuentas</h2>
          <p class="text-surface-400 font-medium leading-relaxed">
            El acceso se realiza exclusivamente mediante proveedores de identidad federada (Google Identity Services). Los usuarios son responsables de la seguridad de sus dispositivos y accesos. ChessNet nunca solicitará contraseñas mediante canales externos.
          </p>
        </section>

        <section class="mt-16 pt-12 border-t border-white/10">
          <div class="text-center">
            <h3 class="text-xl font-bold text-white mb-6">¿Necesitas soporte legal?</h3>
            <p class="text-surface-400 mb-8 font-medium">Nuestro equipo de cumplimiento está disponible para resolver cualquier duda sobre el tratamiento de datos.</p>
            <a href="mailto:chessnetappweb@gmail.com" class="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all group">
              Contactar Cumplimiento
              <ArrowLeft class="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </section>
      </div>
    </div>
  </main>

  <footer class="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center text-surface-600 text-[10px] font-black uppercase tracking-[0.3em]">
    &copy; {new Date().getFullYear()} ChessNet Universal • Todos los derechos reservados
  </footer>
</div>
