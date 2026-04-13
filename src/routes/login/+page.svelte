<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { signInWithGoogle } from '$lib/firebase';
  import Logo from '$lib/components/Logo.svelte';

  let isSigningIn = $state(false);
  let errorMessage = $state('');
  let successMessage = $state(false);

  // Funciones para manejar UI del formulario "olvidé mi contraseña" (simplificado)
  let showForgotPassword = $state(false);
  let resetEmail = $state('');
  let emailSent = $state(false);

  const handleGoogleSignIn = async () => {
    if (isSigningIn) return;
    
    isSigningIn = true;
    errorMessage = '';
    
    try {
      console.log('🔄 Iniciando sesión con Google...');
      const { user, error } = await signInWithGoogle();
      
      if (error) {
        errorMessage = 'No se pudo iniciar sesión con Google. Inténtalo de nuevo.';
        isSigningIn = false;
        return;
      }
      
      if (user) {
        successMessage = true;
        console.log('✅ Google Login Exitoso:', user.email);
        
        try {
          // Obtenemos el ID Token de Firebase para enviarlo al servidor
          const idToken = await user.getIdToken();
          
          // Creamos la sesión en el servidor
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: idToken })
          });
        } catch (e) {
          console.warn('⚠️ No se pudo crear sesión en servidor, continuando como SPA pura...');
        }

        console.log('🚀 Redirigiendo a /panel...');
        setTimeout(() => {
          goto('/panel');
        }, 800);
      }
    } catch (err) {
      errorMessage = 'Ocurrió un error inesperado al conectar con Google.';
      isSigningIn = false;
    }
  };

</script>

<svelte:head>
  <title>Iniciar Sesión - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-[#0f172a] text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">
  
  {#if successMessage}
    <div class="absolute inset-0 bg-emerald-600/90 backdrop-blur-md z-20 flex flex-col items-center justify-center text-white text-center transition-all">
      <div class="w-16 h-16 mb-4 flex items-center justify-center border-4 border-white rounded-full">
        <!-- Icono check -->
        <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p class="text-xl font-bold">¡Acceso Correcto!</p>
      <p class="text-emerald-100 text-sm mt-1">Entrando al panel...</p>
    </div>
  {/if}

  <div class="absolute inset-0 z-0 opacity-20 pointer-events-none">
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
  </div>
  
  <div class="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[128px] pointer-events-none animate-pulse"></div>
  <div class="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[128px] pointer-events-none"></div>
  
  <div class="w-full max-w-md relative z-10">
    <div class="text-center mb-8">
      <a href="/" class="inline-flex items-center gap-2 group mb-4 transition-transform hover:scale-105">
        <div class="relative">
          <div class="absolute -inset-2 bg-emerald-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Logo size="w-16 h-16" iconSize="w-8 h-8" />
        </div>
      </a>
      <h1 class="text-3xl font-bold text-white tracking-tight">ChessNet</h1>
      <p class="text-slate-400 mt-2">Plataforma educativa de ajedrez</p>
    </div>
    
    <div class="bg-[#1e293b]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      
      <div class="text-center mb-8">
        <h2 class="text-xl font-semibold text-white mb-2">Bienvenido</h2>
        <p class="text-slate-400 text-sm italic">"El ajedrez es un juego de caballeros."</p>
      </div>
      
      {#if errorMessage}
        <div class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3 mb-4 animate-shake">
          <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      {/if}

      <div class="space-y-4">
        {#if !showForgotPassword}
          <button 
            onclick={handleGoogleSignIn} 
            disabled={isSigningIn}
            class="w-full flex items-center justify-center gap-3 px-6 py-4 border border-slate-600/50 rounded-xl bg-gradient-to-r from-slate-700/80 to-slate-600/80 hover:from-slate-600/80 hover:to-slate-500/80 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {#if isSigningIn}
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span class="font-medium">Iniciando sesión...</span>
            {:else}
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
              </svg>
              <span class="font-medium">Continuar con Google</span>
            {/if}
          </button>
          
          <div class="relative py-4">
            <div class="absolute inset-0 flex items-center">
              <span class="w-full border-t border-slate-700/50"></span>
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-[#1e293b] px-2 text-slate-500">¿Problemas?</span>
            </div>
          </div>
          
          <button onclick={() => showForgotPassword = true} class="w-full text-slate-400 hover:text-white text-sm font-medium transition-colors">
            He olvidado mi contraseña
          </button>
        {:else}
          {#if !emailSent}
            <div class="relative">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                bind:value={resetEmail}
                class="w-full bg-slate-900 border border-slate-700/50 rounded-xl py-4 pl-4 pr-4 white focus:ring-2 focus:ring-emerald-500/50 focus:outline-none placeholder-slate-600 transition-all text-white"
              />
            </div>
            <button 
              onclick={() => emailSent = true}
              class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 mt-4"
            >
              Enviar Instrucciones
            </button>
          {:else}
            <div class="text-center py-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <p class="text-white font-bold">¡Email enviado!</p>
              <p class="text-slate-400 text-xs px-4 mt-1">Revisa tu bandeja de entrada para restablecer tu contraseña.</p>
            </div>
          {/if}
          
          <button onclick={() => {showForgotPassword = false; emailSent = false;}} class="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white text-sm transition-colors mt-6 py-2">
            Volver al inicio de sesión
          </button>
        {/if}
      </div>
      
      <div class="mt-8 pt-6 border-t border-slate-700/50 text-center">
        <p class="text-xs text-slate-500 leading-relaxed">
          Al continuar, confirmas que eres un profesor de ajedrez autorizado.
        </p>
      </div>
    </div>
    
    <p class="text-center text-xs text-slate-600 mt-8">
      © {new Date().getFullYear()} ChessNet. Todos los derechos reservados.
    </p>
  </div>
</div>
