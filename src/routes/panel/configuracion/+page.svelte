<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    Settings, 
    User, 
    Bell, 
    Shield, 
    CreditCard, 
    Save, 
    Camera,
    Check
  } from 'lucide-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { auth } from '$lib/firebase';
  import { fade, fly } from 'svelte/transition';

  let config = $state({
    teacherName: $appStore.settings.teacherName || auth.currentUser?.displayName || '',
    teacherAvatar: $appStore.settings.teacherAvatar || auth.currentUser?.photoURL || '',
    notifications: true,
    theme: 'dark'
  });

  let saved = $state(false);

  const handleSave = () => {
    appStore.updateSettings({
      teacherName: config.teacherName,
      teacherAvatar: config.teacherAvatar
    });
    saved = true;
    setTimeout(() => saved = false, 3000);
  };

</script>

<svelte:head>
  <title>Configuración - ChessNet</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" transition:fade>
  
  <div class="flex items-center gap-3 mb-10 pt-6">
    <div class="w-12 h-12 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-slate-400">
      <Settings class="w-6 h-6" />
    </div>
    <div>
      <h1 class="text-3xl font-bold text-white tracking-tight">Configuración</h1>
      <p class="text-slate-400 text-sm">Personaliza tu perfil de profesor y ajusta tus preferencias.</p>
    </div>
  </div>

  <div class="space-y-6">
      <!-- Profile Section -->
      <div class="bg-[#1e293b] border border-slate-800 rounded-3xl p-8 shadow-xl">
          <h2 class="text-lg font-bold text-white mb-8 flex items-center gap-2">
              <User class="w-5 h-5 text-indigo-500" />
              Perfil del Profesor
          </h2>

          <div class="flex flex-col md:flex-row gap-10 items-start">
              <div class="relative group">
                  <div class="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-500 overflow-hidden relative">
                      {#if config.teacherAvatar}
                          <img src={config.teacherAvatar} alt="Avatar" class="w-full h-full object-cover" />
                      {:else}
                          <User class="w-10 h-10" />
                      {/if}
                      <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Camera class="w-6 h-6 text-white" />
                      </div>
                  </div>
              </div>

              <div class="flex-grow space-y-6 w-full">
                  <div class="space-y-2">
                      <label for="public-name" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nombre Público</label>
                      <input 
                        id="public-name"
                        type="text" 
                        bind:value={$appStore.settings.teacherName}
                        placeholder="Ej. Academia GM"
                        class="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-primary-500 outline-none transition-all placeholder:text-slate-600"
                      />
                  </div>

                  <div class="space-y-2">
                      <label for="public-email" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Correo Electrónico</label>
                      <input 
                        id="public-email"
                        type="email" 
                        bind:value={$appStore.settings.teacherEmail}
                        placeholder="contacto@academia.com"
                        class="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-primary-500 outline-none transition-all placeholder:text-slate-600"
                      />
                      <p class="text-[10px] text-slate-600 mt-1 italic">El correo no puede ser modificado por seguridad.</p>
                  </div>
              </div>
          </div>
      </div>

      <!-- Subscription Section -->
      <div class="bg-[#1e293b] border border-slate-800 rounded-3xl p-8 shadow-xl">
          <h2 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <CreditCard class="w-5 h-5 text-emerald-500" />
              Suscripción y Plan
          </h2>

          <div class="flex items-center justify-between p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <div>
                  <p class="text-white font-bold">Plan Actual: <span class="text-indigo-400 capitalize">{$appStore.settings.plan || 'Gratis'}</span></p>
                  <p class="text-xs text-slate-500 mt-1">Siguiente fecha de cobro: 01 de Mayo, 2026</p>
              </div>
              <a href="/panel/planes" class="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 px-4 py-2 rounded-lg text-xs font-bold transition-all border border-indigo-500/20">
                  Gestionar Plan
              </a>
          </div>
      </div>

      <!-- Security Section -->
      <div class="bg-[#1e293b] border border-slate-800 rounded-3xl p-8 shadow-xl">
          <h2 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Shield class="w-5 h-5 text-red-500" />
              Privacidad y Seguridad
          </h2>
          
          <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl">
                  <div>
                      <p class="text-sm font-bold text-white">Sincronización en la Nube</p>
                      <p class="text-[11px] text-slate-500">Tus datos se guardan automáticamente en Firebase cada 2 segundos tras cambios.</p>
                  </div>
                  <div class="w-10 h-6 bg-emerald-500 rounded-full relative">
                      <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
              </div>
          </div>
      </div>

      <!-- Floating Save Bar -->
      <div class="sticky bottom-6 flex justify-center z-50">
          <button 
            onclick={handleSave}
            class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            {#if saved}
              <Check class="w-5 h-5" />
              ¡Guardado Correctamente!
            {:else}
              <Save class="w-5 h-5" />
              Guardar Cambios
            {/if}
          </button>
      </div>
  </div>
</div>
