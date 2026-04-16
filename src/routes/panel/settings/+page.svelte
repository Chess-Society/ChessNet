<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    Gear, 
    User, 
    Bell, 
    ShieldCheck, 
    CreditCard, 
    At,
    Camera,
    Check,
    FloppyDisk,
    Sparkle,
    Lock
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { auth } from '$lib/firebase';
  import { fade, fly } from 'svelte/transition';

  let config = $state({
    teacherName: $appStore.settings.teacherName || auth.currentUser?.displayName || '',
    teacherAvatar: $appStore.settings.teacherAvatar || auth.currentUser?.photoURL || '',
    teacherEmail: $appStore.settings.teacherEmail || auth.currentUser?.email || '',
    notifications: true,
    theme: 'dark'
  });

  let saved = $state(false);

  const handleSave = () => {
    appStore.updateSettings({
      teacherName: config.teacherName,
      teacherAvatar: config.teacherAvatar,
      teacherEmail: config.teacherEmail
    });
    saved = true;
    setTimeout(() => saved = false, 3000);
  };

</script>

<svelte:head>
  <title>Settings - ChessNet</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-8" transition:fade>
  
  <div class="flex items-center gap-4 mb-12">
    <div class="w-14 h-14 bg-violet-600/10 border border-violet-500/20 rounded-2xl flex items-center justify-center text-violet-500 shadow-xl shadow-violet-500/5">
      <Gear weight="duotone" class="w-8 h-8" />
    </div>
    <div>
      <h1 class="text-3xl font-outfit font-extrabold text-white tracking-tight">Settings</h1>
      <p class="text-slate-400 font-plus-jakarta text-sm">Customize your experience and manage your teaching profile.</p>
    </div>
  </div>

  <div class="space-y-8">
      <!-- Profile Section -->
      <div class="bento-card p-10">
          <h2 class="text-xl font-outfit font-bold text-white mb-10 flex items-center gap-3">
              <User weight="duotone" class="w-6 h-6 text-violet-500" />
              Teacher Profile
          </h2>

          <div class="flex flex-col md:flex-row gap-12 items-start">
              <div class="relative group">
                  <div class="w-28 h-28 rounded-full bg-zinc-950 border-2 border-white/5 flex items-center justify-center text-slate-700 overflow-hidden relative shadow-2xl transition-transform duration-500 group-hover:scale-105">
                      {#if config.teacherAvatar}
                          <img src={config.teacherAvatar} alt="Avatar" class="w-full h-full object-cover" />
                      {:else}
                          <User weight="duotone" class="w-12 h-12" />
                      {/if}
                      <div class="absolute inset-0 bg-violet-600/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Camera weight="bold" class="w-8 h-8 text-white" />
                      </div>
                  </div>
              </div>

              <div class="flex-grow space-y-8 w-full">
                  <div class="space-y-3">
                      <label for="public-name" class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Public Name</label>
                      <input 
                        id="public-name"
                        type="text" 
                        bind:value={config.teacherName}
                        placeholder="e.g. GM Academy"
                        class="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-violet-500/50 outline-none transition-all placeholder:text-slate-700 shadow-inner"
                      />
                  </div>

                  <div class="space-y-3">
                      <label for="public-email" class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Contact Email</label>
                      <div class="relative">
                        <At weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input 
                          id="public-email"
                          type="email" 
                          bind:value={config.teacherEmail}
                          placeholder="contact@academy.com"
                          class="w-full bg-zinc-950/30 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-sm text-slate-400 cursor-not-allowed outline-none transition-all placeholder:text-slate-700"
                          disabled
                        />
                      </div>
                      <p class="text-[10px] text-slate-500 mt-2 flex items-center gap-1.5 ml-1 pt-1">
                        <Lock weight="bold" class="w-3 h-3" />
                        The login email cannot be modified for security reasons.
                      </p>
                  </div>
              </div>
          </div>
      </div>

      <!-- Subscription Section -->
      <div class="bento-card p-10">
          <h2 class="text-xl font-outfit font-bold text-white mb-8 flex items-center gap-3">
              <CreditCard weight="duotone" class="w-6 h-6 text-violet-500" />
              Subscription and Plan
          </h2>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 bg-zinc-950/50 border border-white/5 rounded-3xl shadow-inner group">
              <div class="flex items-center gap-5">
                <div class="w-12 h-12 bg-violet-600/10 rounded-2xl flex items-center justify-center text-violet-500">
                  <Sparkle weight="duotone" class="w-6 h-6" />
                </div>
                <div>
                    <p class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest mb-1">Your current level</p>
                    <p class="text-white font-outfit font-black text-xl uppercase tracking-tight">Plan {$appStore.settings.plan || 'Free'}</p>
                </div>
              </div>
              <a href="/panel/upgrade" class="btn-pill bg-white text-black py-3 px-8 text-xs font-outfit font-black uppercase tracking-widest shadow-xl hover:bg-zinc-200 inline-flex items-center gap-2 group">
                  Manage
                  <Gear weight="bold" class="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
              </a>
          </div>
      </div>

      <!-- Security Section -->
      <div class="bento-card p-10">
          <h2 class="text-xl font-outfit font-bold text-white mb-8 flex items-center gap-3">
              <ShieldCheck weight="duotone" class="w-6 h-6 text-violet-500" />
              Privacy and Security
          </h2>
          
          <div class="space-y-4">
              <div class="flex items-center justify-between p-6 bg-zinc-950/30 rounded-2xl border border-white/5">
                  <div class="max-w-md">
                      <p class="text-sm font-outfit font-bold text-white mb-1">Smart Sync</p>
                      <p class="text-[11px] text-slate-500 font-plus-jakarta leading-relaxed">Your data is automatically backed up to Google Cloud's high-availability infrastructure after each interaction.</p>
                  </div>
                  <div class="w-12 h-7 bg-violet-600 rounded-full relative shadow-[0_0_15px_rgba(139,92,246,0.25)] border border-violet-400/20">
                      <div class="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-lg"></div>
                  </div>
              </div>
          </div>
      </div>

      <!-- Floating Save Bar -->
      <div class="sticky bottom-8 flex justify-center z-50 pt-10 pointer-events-none">
          <button 
            onclick={handleSave}
            class="btn-pill bg-violet-600 hover:bg-violet-500 text-white font-outfit font-black px-10 py-5 shadow-violet-flare flex items-center gap-3 transition-all hover:scale-105 active:scale-95 pointer-events-auto"
          >
            {#if saved}
              <Check weight="bold" class="w-5 h-5" />
              Synced!
            {:else}
              <FloppyDisk weight="duotone" class="w-5 h-5" />
              Save Changes
            {/if}
          </button>
      </div>
  </div>
</div>
