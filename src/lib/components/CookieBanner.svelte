<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Cookie, X, Shield, FileText } from 'lucide-svelte';
  import { t } from '$lib/i18n';

  let showBanner = false;
  let isVisible = false;

  onMount(() => {
    
    // Verificar si ya se aceptaron las cookies
    const cookiesAccepted = localStorage.getItem('chessnet-cookies-accepted');
    const termsAccepted = localStorage.getItem('chessnet-terms-accepted');
    
    
    if (!cookiesAccepted || !termsAccepted) {
      showBanner = true;
      // Pequeño delay para la animación
      setTimeout(() => {
        isVisible = true;
      }, 100);
    } else {
    }
  });

  const acceptAll = () => {
    localStorage.setItem('chessnet-cookies-accepted', 'true');
    localStorage.setItem('chessnet-terms-accepted', 'true');
    localStorage.setItem('chessnet-privacy-accepted', 'true');
    localStorage.setItem('chessnet-acceptance-date', new Date().toISOString());
    
    hideBanner();
  };

  const acceptNecessary = () => {
    localStorage.setItem('chessnet-cookies-accepted', 'necessary-only');
    localStorage.setItem('chessnet-terms-accepted', 'true');
    localStorage.setItem('chessnet-privacy-accepted', 'true');
    localStorage.setItem('chessnet-acceptance-date', new Date().toISOString());
    
    hideBanner();
  };

  const hideBanner = () => {
    isVisible = false;
    setTimeout(() => {
      showBanner = false;
    }, 300);
  };

  const openTerms = () => {
    goto('/legal/terms');
  };

  const openPrivacy = () => {
    goto('/legal/privacy');
  };

  const openCookies = () => {
    goto('/legal/cookies');
  };
</script>

{#if showBanner}
  <div class="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
    <div 
      class="bg-slate-800 border border-slate-600 rounded-none shadow-2xl max-w-2xl w-full pointer-events-auto transform transition-all duration-300 {isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-slate-600">
        <div class="flex items-center space-x-2">
          <Cookie class="w-5 h-5 text-blue-400" />
          <h3 class="text-lg font-semibold text-white">{$t('cookies.title')}</h3>
        </div>
        <button
          on:click={hideBanner}
          class="text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-4">
        <div class="mb-4">
          <p class="text-slate-300 text-sm mb-3">
            🚧 <strong class="text-yellow-400">{$t('cookies.beta_title')}</strong> {$t('cookies.beta_description')}
          </p>
          <p class="text-slate-300 text-sm">
            {$t('cookies.description')}
          </p>
        </div>

        <!-- Legal Links -->
        <div class="flex flex-wrap gap-4 mb-4 text-xs">
          <button
            on:click={openTerms}
            class="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <FileText class="w-3 h-3" />
            <span>{$t('legal.terms')}</span>
          </button>
          <button
            on:click={openPrivacy}
            class="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Shield class="w-3 h-3" />
            <span>{$t('legal.privacy')}</span>
          </button>
          <button
            on:click={openCookies}
            class="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Cookie class="w-3 h-3" />
            <span>{$t('legal.cookies')}</span>
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            on:click={acceptAll}
            class="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-none transition-colors"
          >
            {$t('cookies.accept_all')}
          </button>
          <button
            on:click={acceptNecessary}
            class="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-medium py-3 px-4 rounded-none transition-colors"
          >
            {$t('cookies.accept_essential')}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Backdrop blur effect */
  .fixed.inset-0::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(2px);
  }
</style>
