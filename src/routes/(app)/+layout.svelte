<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { LogOut, User, ChevronDown } from 'lucide-svelte';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  let showUserMenu = false;
  let isLoggingOut = false;

  $: user = data.user;

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    isLoggingOut = true;
    
    try {
      console.log('🚪 Iniciando cierre de sesión...');
      
      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Sesión cerrada exitosamente');
        // Redirigir a la página de login
        goto('/login');
      } else {
        console.error('❌ Error al cerrar sesión:', result);
        alert('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      alert('Error al cerrar sesión');
    } finally {
      isLoggingOut = false;
      showUserMenu = false;
    }
  };

  // Cerrar el menú cuando se hace click fuera
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      showUserMenu = false;
    }
  };
</script>

<svelte:window on:click={handleClickOutside} />

<div class="min-h-screen bg-slate-900">
  <!-- Header con botón de logout -->
  <header class="bg-slate-800/50 border-b border-slate-700/50 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Título -->
        <div class="flex items-center space-x-3">
          <div class="text-xl font-bold text-white">ChessNet</div>
          <div class="text-sm text-slate-400">Sistema de Gestión</div>
        </div>

        <!-- Usuario y Logout -->
        <div class="flex items-center space-x-4">
          <!-- Información del usuario -->
          {#if user}
            <div class="relative user-menu">
              <button
                on:click={() => showUserMenu = !showUserMenu}
                class="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
              >
                <div class="p-1 bg-slate-600/50 rounded-full">
                  <User class="w-4 h-4 text-slate-300" />
                </div>
                <span class="text-sm text-slate-300 max-w-32 truncate">
                  {user.email || 'Usuario'}
                </span>
                <ChevronDown class="w-4 h-4 text-slate-400 transition-transform {showUserMenu ? 'rotate-180' : ''}" />
              </button>

              <!-- Dropdown Menu -->
              {#if showUserMenu}
                <div class="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700/50 rounded-lg shadow-lg py-1 z-50">
                  <div class="px-4 py-2 border-b border-slate-700/50">
                    <div class="text-sm font-medium text-white truncate">
                      {user.email || 'Usuario'}
                    </div>
                    <div class="text-xs text-slate-400">
                      {#if $page.url.hostname === 'localhost' || $page.url.hostname === '127.0.0.1'}
                        Modo Local
                      {:else}
                        Conectado
                      {/if}
                    </div>
                  </div>
                  
                  <button
                    on:click={handleLogout}
                    disabled={isLoggingOut}
                    class="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {#if isLoggingOut}
                      <div class="animate-spin rounded-full h-4 w-4 border-2 border-red-400 border-t-transparent"></div>
                      <span class="text-sm text-slate-300">Cerrando sesión...</span>
                    {:else}
                      <LogOut class="w-4 h-4 text-red-400" />
                      <span class="text-sm text-slate-300">Cerrar Sesión</span>
                    {/if}
                  </button>
                </div>
              {/if}
            </div>
          {:else}
            <!-- En caso de que no haya usuario (no debería pasar en esta ruta) -->
            <div class="text-sm text-slate-400">No autenticado</div>
          {/if}
        </div>
      </div>
    </div>
  </header>

  <!-- Contenido principal -->
  <main>
    <slot />
  </main>
</div>
