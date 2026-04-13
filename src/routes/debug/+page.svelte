<script lang="ts">
  import { onMount } from 'svelte';

  let debugInfo = 'Iniciando diagnóstico...';
  let cookieAnalysis = '';
  let timingInfo = '';

  onMount(() => {
    try {
      console.log('🔍 DEBUG PAGE - Análisis completo de cookies');
      
      // 1. Análisis inmediato
      const immediateCookies = document.cookie;
      console.log('🍪 document.cookie INMEDIATO:', immediateCookies);
      
      // 2. Análisis detallado
      const allCookies = document.cookie.split(';').map(c => c.trim()).filter(c => c !== '');
      console.log('🍪 Cookies parseadas:', allCookies);
      
      // 3. Análisis específico de sb-*
      const sbCookies = allCookies.filter(c => c.startsWith('sb-'));
      console.log('🍪 Cookies sb-*:', sbCookies);
      
      // 4. Análisis de formato
      const accessToken = allCookies.find(c => c.startsWith('sb-access-token'));
      const refreshToken = allCookies.find(c => c.startsWith('sb-refresh-token'));
      
      if (accessToken) {
        const [name, value] = accessToken.split('=');
        console.log('🔑 Access Token - Name:', name, 'Value length:', value?.length);
      }
      
      if (refreshToken) {
        const [name, value] = refreshToken.split('=');
        console.log('🔄 Refresh Token - Name:', name, 'Value length:', value?.length);
      }
      
      // 5. Información del navegador
      console.log('🌐 User Agent:', navigator.userAgent);
      console.log('🌐 Location:', window.location.href);
      console.log('🌐 Domain:', window.location.hostname);
      
      // 6. Generar reporte
      debugInfo = `
ANÁLISIS COMPLETO:
- Total cookies: ${allCookies.length}
- Cookies sb-*: ${sbCookies.length}
- Access Token: ${accessToken ? 'ENCONTRADO' : 'NO ENCONTRADO'}
- Refresh Token: ${refreshToken ? 'ENCONTRADO' : 'NO ENCONTRADO'}
- document.cookie: "${immediateCookies}"
      `.trim();
      
      cookieAnalysis = `
COOKIES DETALLADAS:
${allCookies.map(c => `- ${c}`).join('\n')}

COOKIES SB-*:
${sbCookies.map(c => `- ${c}`).join('\n')}
      `.trim();
      
      // 7. Análisis de timing
      setTimeout(() => {
        const delayedCookies = document.cookie;
        console.log('🍪 document.cookie DESPUÉS de 1s:', delayedCookies);
        
        if (delayedCookies !== immediateCookies) {
          console.log('⚠️ Las cookies cambiaron después de 1 segundo');
          timingInfo = '⚠️ TIMING ISSUE: Las cookies cambiaron después de 1s';
        } else {
          timingInfo = '✅ No hay problema de timing';
        }
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error en debug:', error);
      debugInfo = `❌ Error: ${(error as Error).message}`;
    }
  });
</script>

<svelte:head>
  <title>Debug - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-slate-900 p-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-white mb-8">🔍 Debug de Cookies</h1>
    
    <div class="bg-slate-800 rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold text-white mb-4">Información General</h2>
      <pre class="text-green-400 text-sm whitespace-pre-wrap">{debugInfo}</pre>
    </div>
    
    <div class="bg-slate-800 rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold text-white mb-4">Análisis de Timing</h2>
      <pre class="text-yellow-400 text-sm whitespace-pre-wrap">{timingInfo}</pre>
    </div>
    
    <div class="bg-slate-800 rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold text-white mb-4">Cookies Detalladas</h2>
      <pre class="text-blue-400 text-sm whitespace-pre-wrap">{cookieAnalysis}</pre>
    </div>
    
    <div class="bg-slate-800 rounded-lg p-6">
      <h2 class="text-xl font-semibold text-white mb-4">Instrucciones</h2>
      <ol class="text-slate-300 space-y-2">
        <li>1. Abre DevTools → Console</li>
        <li>2. Recarga esta página</li>
        <li>3. Copia todos los logs que empiecen con 🍪</li>
        <li>4. Envíame esos logs para análisis</li>
      </ol>
    </div>
  </div>
</div>
