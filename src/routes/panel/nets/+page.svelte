<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { appStore } from '$lib/stores/appStore';
  import { 
    Package, 
    Star, 
    ImageSquare, 
    Trophy,
    LockKey,
    CheckCircle,
    PaintBrush,
    TextT,
    Coins,
    Smiley,
    ArrowRight,
    ArrowLeft,
    Flame
  } from 'phosphor-svelte';

  import { battlepassApi } from '$lib/api/battlepass';
  import { user } from '$lib/stores/auth';

  // Sub-navigation state
  let currentTab = $state('battlepass');
  const tabs = [
    { id: 'crates', label: 'Cajas', icon: Package },
    { id: 'battlepass', label: 'Pase de Batalla', icon: Star },
    { id: 'collection', label: 'Colección', icon: ImageSquare },
    { id: 'leaderboard', label: 'Clasificación', icon: Trophy }
  ];

  // DB State
  let bpData = $derived($appStore.settings?.economy?.battlePass);
  let currentTier = $derived(bpData?.currentTier || 1);
  let currentXp = $derived(bpData?.currentXp || 0);
  let isPremium = $derived(bpData?.isPremium || false);
  let claimedTiers = $derived(bpData?.claimedTiers || []);
  let dailyChallengesDb = $derived(bpData?.dailyChallenges || {});
  let weeklyChallengesDb = $derived(bpData?.weeklyChallenges || {});
  
  const XP_PER_TIER = 2000;
  let xpToNext = $derived(currentTier * XP_PER_TIER);

  const season = $derived({
    number: 1,
    name: 'ORÍGENES',
    timeLeft: '60D 8H',
    totalTiers: 30,
    currentTier: currentTier,
    currentXp: currentXp,
    xpToNext: xpToNext,
  });

  const baseTiers = [
    { level: 1, type: 'free', reward: 'Color: Verde Neón', icon: PaintBrush, color: 'text-violet-400' },
    { level: 2, type: 'premium', reward: '50 Nets', icon: Coins, color: 'text-amber-400' },
    { level: 3, type: 'free', reward: 'Emote: GG', icon: Smiley, color: 'text-violet-400' },
    { level: 4, type: 'premium', reward: 'Fuente: Cyber', icon: TextT, color: 'text-blue-400' },
    { level: 5, type: 'premium', reward: 'Emote: Estrella', icon: Star, color: 'text-yellow-400' },
    { level: 6, type: 'free', reward: 'Color: Rojo Fuego', icon: PaintBrush, color: 'text-red-400' },
    { level: 7, type: 'premium', reward: '100 Nets', icon: Coins, color: 'text-amber-400' },
    { level: 8, type: 'premium', reward: 'Caja Épica', icon: Package, color: 'text-fuchsia-400' },
  ];

  let tiers = $derived(baseTiers.map(t => ({...t, claimed: claimedTiers.includes(t.level)})));

  let selectedTierLevel = $state(1);
  let selectedTier = $derived(tiers.find(t => t.level === selectedTierLevel) || tiers[0]);

  const baseDaily = [
    { id: 'daily-1', name: 'Mantén la Racha', desc: 'Analiza 3 partidas hoy.', xp: 150, total: 3 },
    { id: 'daily-2', name: 'Táctico Experto', desc: 'Resuelve 5 puzzles.', xp: 200, total: 5 },
    { id: 'daily-3', name: 'Expresivo', desc: 'Usa 3 emotes en el feed.', xp: 100, total: 3 },
  ];

  let dailyChallenges = $derived(baseDaily.map(c => {
     // Default mock progress for visualization, in real app would read from DB
     const dbC = dailyChallengesDb[c.id] || { progress: c.id === 'daily-1' ? 3 : 0, claimed: false };
     return { ...c, progress: dbC.progress, claimed: dbC.claimed };
  }));

  const baseWeekly = [
    { id: 'weekly-1', name: 'Explorador de Comunidad', desc: 'Visita 10 perfiles diferentes.', xp: 1500, total: 10 },
  ];

  let weeklyChallenges = $derived(baseWeekly.map(c => {
     const dbC = weeklyChallengesDb[c.id] || { progress: 2, claimed: false };
     return { ...c, progress: dbC.progress, claimed: dbC.claimed };
  }));

  async function handleClaimTier(tier: any) {
    if (!$user) return;
    try {
      // If reward is nets, parse amount (mock logic)
      let rewardNets = 0;
      if (tier.reward.includes('Nets')) {
        rewardNets = parseInt(tier.reward);
      }
      await battlepassApi.claimTier($user.uid, tier.level, rewardNets);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleClaimChallenge(challenge: any, type: 'daily'|'weekly') {
    if (!$user) return;
    try {
      await battlepassApi.claimChallenge($user.uid, challenge.id, type, challenge.xp);
    } catch (e) {
      console.error(e);
    }
  }

  // Crate Opening State
  let isOpeningCrate = $state(false);
  let showCrateResult = $state(false);
  let crateResult = $state<any>(null);
  let crateType = $state('');
  
  const possibleRewards = [
    { name: 'Disgusted', type: 'Emote', rarity: 'Uncommon', color: 'text-emerald-400', border: 'border-emerald-500', shadow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]', bgGradient: 'from-emerald-500/20', bgGlow: 'bg-emerald-500/20', badgeBg: 'bg-emerald-500/10', icon: Smiley },
    { name: 'Sigma', type: 'Emote', rarity: 'Common', color: 'text-zinc-400', border: 'border-zinc-500', shadow: 'shadow-[0_0_20px_rgba(161,161,170,0.3)]', bgGradient: 'from-zinc-500/20', bgGlow: 'bg-zinc-500/20', badgeBg: 'bg-zinc-500/10', icon: Smiley },
    { name: 'Pissed', type: 'Emote', rarity: 'Common', color: 'text-zinc-400', border: 'border-zinc-500', shadow: 'shadow-[0_0_20px_rgba(161,161,170,0.3)]', bgGradient: 'from-zinc-500/20', bgGlow: 'bg-zinc-500/20', badgeBg: 'bg-zinc-500/10', icon: Smiley },
    { name: 'Oops', type: 'Emote', rarity: 'Common', color: 'text-zinc-400', border: 'border-zinc-500', shadow: 'shadow-[0_0_20px_rgba(161,161,170,0.3)]', bgGradient: 'from-zinc-500/20', bgGlow: 'bg-zinc-500/20', badgeBg: 'bg-zinc-500/10', icon: Smiley },
    { name: 'Tablero Dorado', type: 'Tablero', rarity: 'Legendary', color: 'text-amber-400', border: 'border-amber-500', shadow: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]', bgGradient: 'from-amber-500/20', bgGlow: 'bg-amber-500/20', badgeBg: 'bg-amber-500/10', icon: PaintBrush },
    { name: 'Cyberpunk', type: 'Fuente', rarity: 'Rare', color: 'text-blue-400', border: 'border-blue-500', shadow: 'shadow-[0_0_20px_rgba(56,189,248,0.3)]', bgGradient: 'from-blue-500/20', bgGlow: 'bg-blue-500/20', badgeBg: 'bg-blue-500/10', icon: TextT },
  ];

  let rouletteItems = $state<any[]>([]);

  function openCrate(type: string) {
    if (isOpeningCrate) return;
    crateType = type;
    isOpeningCrate = true;
    showCrateResult = false;
    crateResult = null;
    
    // Generate 40 random items for the roulette, making the 35th item the winner
    rouletteItems = Array(40).fill(0).map(() => possibleRewards[Math.floor(Math.random() * possibleRewards.length)]);
    
    // Determine winner based on crate type
    let winner;
    if (type === 'epic') {
      winner = possibleRewards.find(r => r.rarity === 'Legendary') || possibleRewards[4];
    } else if (type === 'rare') {
      winner = possibleRewards.find(r => r.rarity === 'Rare') || possibleRewards[5];
    } else {
      winner = possibleRewards.find(r => r.rarity === 'Uncommon') || possibleRewards[0];
    }
    
    rouletteItems[35] = winner;
    crateResult = winner;
    
    // Trigger transition
    rouletteOffset = 0;
    setTimeout(() => {
      rouletteOffset = -(35 * 176 + 80);
    }, 50);

    // Show result after animation (4s)
    setTimeout(() => {
      showCrateResult = true;
    }, 4500);
  }

  function closeCrate() {
    isOpeningCrate = false;
    showCrateResult = false;
    crateResult = null;
  }

  let rouletteOffset = $state(0);


</script>

<svelte:head>
  <title>Economía & Pase | ChessNet</title>
</svelte:head>

<div class="max-w-[1400px] mx-auto p-4 lg:p-8 min-h-screen">
  
  <!-- Header & Subnav -->
  <header class="mb-8" in:fade={{ duration: 500 }}>
    <div class="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
          <div class="w-8 h-8 bg-violet-500 flex items-center justify-center rotate-3 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <Package size={20} weight="fill" class="text-black" />
          </div>
          CHESS<span class="text-violet-500">NETS</span>
        </h1>
        <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">Recompensas • Batallas • Rangos</p>
      </div>

      <div class="flex items-center gap-6">
        <div class="flex flex-col items-end">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">XP</span>
            <span class="text-[10px] font-black text-white">{season.currentXp} / {season.xpToNext}</span>
          </div>
          <div class="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-violet-500 w-[15%] shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex justify-center border-b border-white/5">
      <div class="flex items-center gap-2">
        {#each tabs as tab}
          <button 
            onclick={() => currentTab = tab.id}
            class="px-6 py-4 flex items-center gap-2 relative transition-colors {currentTab === tab.id ? 'text-violet-400' : 'text-zinc-500 hover:text-white'}"
          >
            <tab.icon size={18} weight={currentTab === tab.id ? "fill" : "duotone"} />
            <span class="text-xs font-black uppercase tracking-widest">{tab.label}</span>
            {#if currentTab === tab.id}
              <div class="absolute bottom-0 left-0 w-full h-0.5 bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]" in:fly={{ y: 5, duration: 200 }}></div>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  </header>

  {#if currentTab === 'battlepass'}
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6" in:fade={{ duration: 400 }}>
      
      <!-- Left: Battle Pass Showcase -->
      <div class="xl:col-span-2 flex flex-col gap-6">
        
        <!-- Showcase Main Panel -->
        <div class="bg-[#0a0a0a] border border-white/5 relative overflow-hidden flex flex-col h-[500px]">
          
          <!-- Top Bar -->
          <div class="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
            <div class="flex items-center gap-3">
              <span class="px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                <Flame size={12} weight="fill" />
                Temporada {season.number}: {season.name}
              </span>
            </div>
            <div class="flex items-center gap-3">
              <div class="px-3 py-1 bg-zinc-900 border border-white/10 text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                ⏳ {season.timeLeft}
              </div>
              <div class="px-3 py-1 bg-violet-500 text-black text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <span class="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
                En Vivo
              </div>
            </div>
          </div>

          <!-- Showcase Content -->
          <div class="flex-1 flex flex-col items-center justify-center relative z-10 p-6 pt-20">
            <!-- Glow background based on selected item color -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-current opacity-[0.15] blur-[80px] pointer-events-none {selectedTier.color}"></div>
            
            <div class="w-40 h-40 flex items-center justify-center mb-8 relative group">
              <div class="absolute inset-0 border border-current opacity-20 rotate-45 group-hover:rotate-90 transition-all duration-700 {selectedTier.color}"></div>
              <selectedTier.icon size={80} weight="duotone" class="{selectedTier.color} drop-shadow-[0_0_30px_currentColor]" />
            </div>

            <div class="text-center space-y-2">
              <span class="text-[10px] font-black uppercase tracking-[0.3em] {selectedTier.type === 'premium' ? 'text-amber-400' : 'text-zinc-500'}">
                {selectedTier.type === 'premium' ? '♦ Recompensa Premium' : 'Recompensa Gratuita'}
              </span>
              <h2 class="text-4xl font-black text-white uppercase tracking-tighter italic">{selectedTier.reward}</h2>
              
              <div class="mt-6">
                {#if selectedTier.claimed}
                  <div class="inline-flex items-center gap-2 px-6 py-2 bg-zinc-900 border border-violet-500/30 text-violet-400 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle size={14} weight="fill" />
                    Reclamado
                  </div>
                {:else if selectedTier.level <= season.currentTier}
                  <button 
                    onclick={() => handleClaimTier(selectedTier)}
                    class="px-8 py-3 bg-violet-500 hover:bg-emerald-400 text-black text-[11px] font-black uppercase tracking-[0.2em] transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                  >
                    Reclamar Recompensa
                  </button>
                {:else}
                  <div class="inline-flex items-center gap-2 px-6 py-2 bg-zinc-900 border border-white/5 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                    <LockKey size={14} weight="fill" />
                    Desbloquea en Nivel {selectedTier.level}
                  </div>
                {/if}
              </div>
            </div>
          </div>

          <!-- Bottom Timeline -->
          <div class="h-32 bg-zinc-950/80 border-t border-white/5 p-4 flex items-center gap-2 relative z-20">
            <button class="w-8 h-full flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/5 transition-colors">
              <ArrowLeft size={16} weight="bold" />
            </button>

            <div class="flex-1 flex items-center gap-2 overflow-x-hidden px-4">
              {#each tiers as tier}
                <button 
                  onclick={() => selectedTierLevel = tier.level}
                  class="relative shrink-0 flex flex-col items-center gap-2 group transition-all duration-300"
                >
                  <div class="w-16 h-16 border flex items-center justify-center transition-all
                    {selectedTierLevel === tier.level ? `border-current bg-current/10 scale-110 ${tier.color}` : 'border-white/5 bg-white/[0.02] text-zinc-600 hover:border-white/20 hover:bg-white/5'}
                    {tier.level > season.currentTier && selectedTierLevel !== tier.level ? 'opacity-50' : ''}
                  ">
                    {#if tier.claimed}
                      <CheckCircle size={24} weight="fill" class="text-emerald-500" />
                    {:else if tier.level > season.currentTier}
                      <LockKey size={24} weight="duotone" />
                    {:else}
                      <tier.icon size={24} weight="duotone" class={tier.type === 'premium' ? 'text-amber-400' : 'text-zinc-300'} />
                    {/if}

                    <!-- Type Indicator -->
                    <div class="absolute -bottom-1 -right-1 w-3 h-3 flex items-center justify-center bg-zinc-950 border border-white/10 {tier.type === 'premium' ? 'text-amber-500' : 'text-zinc-500'}">
                      <div class="w-1 h-1 bg-current rounded-full"></div>
                    </div>
                  </div>
                  <span class="text-[9px] font-black {selectedTierLevel === tier.level ? 'text-white' : 'text-zinc-600'}">
                    LVL {tier.level}
                  </span>
                </button>
              {/each}
            </div>

            <button class="w-8 h-full flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/5 transition-colors">
              <ArrowRight size={16} weight="bold" />
            </button>
          </div>
        </div>

        <!-- Progress Footer -->
        <div class="bg-[#0a0a0a] border border-white/5 p-6 flex items-center justify-between">
          <div class="flex items-center gap-6 flex-1">
            <div class="w-14 h-14 rounded-full border-2 border-violet-500 flex items-center justify-center bg-violet-500/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <span class="text-xl font-black text-violet-400">{season.currentTier}</span>
            </div>
            <div class="flex-1 max-w-xl">
              <div class="flex justify-between mb-2">
                <span class="text-[10px] font-black text-white uppercase tracking-widest">Nivel {season.currentTier} / {season.totalTiers}</span>
                <span class="text-[10px] font-black text-zinc-500">{season.currentXp} / {season.xpToNext} XP</span>
              </div>
              <div class="h-2 bg-white/5 overflow-hidden">
                <div class="h-full bg-violet-500 w-[15%] relative">
                  <div class="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:10px_10px] animate-[progress-stripe_1s_linear_infinite]"></div>
                </div>
              </div>
            </div>
          </div>
          <button class="ml-6 px-6 py-3 border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2">
            <LockKey size={14} weight="bold" />
            {season.xpToNext - season.currentXp} XP para Nivel 20
          </button>
        </div>

      </div>

      <!-- Right: Challenges Sidebar -->
      <div class="bg-[#0a0a0a] border border-white/5 flex flex-col h-[600px] xl:h-auto">
        <div class="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
          <h3 class="text-sm font-black text-white uppercase tracking-widest">Retos</h3>
          <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Gana XP y Cajas</span>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          <!-- Daily -->
          <div class="space-y-4">
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Diarios</h4>
              <span class="text-[9px] text-zinc-600 font-bold">13H : 22M left</span>
            </div>

            {#each dailyChallenges as challenge}
              <div class="bg-zinc-950 border border-white/5 p-4 hover:border-white/10 transition-colors">
                <div class="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h5 class="text-xs font-bold text-white mb-1">{challenge.name}</h5>
                    <p class="text-[10px] text-zinc-500">{challenge.desc}</p>
                  </div>
                  <span class="text-[10px] font-black text-amber-400 shrink-0">+{challenge.xp} XP</span>
                </div>
                
                <div class="flex items-center gap-4">
                  <div class="flex-1 h-1 bg-white/5 relative">
                    <div class="absolute inset-y-0 left-0 bg-violet-500 transition-all duration-500" style="width: {(challenge.progress / challenge.total) * 100}%"></div>
                  </div>
                  {#if challenge.claimed}
                    <span class="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-[8px] font-black uppercase tracking-widest border border-violet-500/20">Claimed</span>
                  {:else if challenge.progress >= challenge.total}
                    <button 
                      onclick={() => handleClaimChallenge(challenge, 'daily')}
                      class="px-3 py-1 bg-violet-500 text-black text-[9px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                    >
                      Claim
                    </button>
                  {:else}
                    <span class="text-[9px] font-black text-zinc-600 w-12 text-right">{challenge.progress} / {challenge.total}</span>
                  {/if}
                </div>
              </div>
            {/each}
          </div>

          <!-- Weekly -->
          <div class="space-y-4">
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em]">Semanales</h4>
              <span class="text-[9px] text-zinc-600 font-bold">Resets in 3d 20h</span>
            </div>

            {#each weeklyChallenges as challenge}
              <div class="bg-zinc-950 border border-white/5 p-4 hover:border-white/10 transition-colors">
                <div class="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h5 class="text-xs font-bold text-white mb-1">{challenge.name}</h5>
                    <p class="text-[10px] text-zinc-500">{challenge.desc}</p>
                  </div>
                  <span class="text-[10px] font-black text-amber-400 shrink-0">+{challenge.xp} XP</span>
                </div>
                
                <div class="flex items-center gap-4">
                  <div class="flex-1 h-1 bg-white/5 relative">
                    <div class="absolute inset-y-0 left-0 bg-violet-500 transition-all duration-500" style="width: {(challenge.progress / challenge.total) * 100}%"></div>
                  </div>
                  {#if challenge.claimed}
                    <span class="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-[8px] font-black uppercase tracking-widest border border-violet-500/20">Claimed</span>
                  {:else if challenge.progress >= challenge.total}
                    <button 
                      onclick={() => handleClaimChallenge(challenge, 'weekly')}
                      class="px-3 py-1 bg-violet-500 text-black text-[9px] font-black uppercase tracking-widest hover:bg-violet-400 transition-colors shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                    >
                      Claim
                    </button>
                  {:else}
                    <span class="text-[9px] font-black text-zinc-600 w-12 text-right">{challenge.progress} / {challenge.total}</span>
                  {/if}
                </div>
              </div>
            {/each}

            <!-- Weekly Meta Challenge -->
            <div class="p-4 border border-amber-500/20 bg-amber-500/5 mt-4">
              <h5 class="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">XP Weekly Grant Progress</h5>
              <p class="text-[9px] text-amber-500/70">Completa todos los retos diarios esta semana para obtener un bonus masivo.</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  {:else if currentTab === 'crates'}
    <div class="h-[600px] flex flex-col p-6" in:fade={{ duration: 400 }}>
      <div class="mb-6 flex justify-between items-end border-b border-white/5 pb-4">
        <div>
          <h2 class="text-2xl font-black text-white uppercase tracking-widest mb-1">Cajas de Botín</h2>
          <p class="text-xs text-zinc-500">Abre cajas para desbloquear cosméticos exclusivos y nets.</p>
        </div>
        <div class="flex items-center gap-2 bg-zinc-900/80 px-4 py-2 border border-white/5">
          <Coins weight="fill" class="text-amber-400" size={20} />
          <span class="text-sm font-black text-white">450 <span class="text-zinc-500 text-xs">Nets</span></span>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10 content-start">
        <!-- Caja Básica -->
        <div class="group relative bg-[#0a0a0a] border border-zinc-800 hover:border-violet-500/50 p-6 flex flex-col items-center justify-center transition-all duration-500 hover:-translate-y-1">
          <div class="absolute inset-0 bg-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="w-32 h-32 relative mb-6 mt-4">
            <div class="absolute inset-0 bg-violet-500/20 blur-xl rounded-full group-hover:bg-violet-500/30 transition-all"></div>
            <Package weight="duotone" size={128} class="text-violet-400 relative z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:scale-110 transition-transform duration-500" />
          </div>
          <h3 class="text-lg font-black text-white uppercase tracking-wider mb-1">Caja Básica</h3>
          <p class="text-[10px] text-zinc-500 mb-6 uppercase tracking-widest text-center">Colores • Emotes Comunes</p>
          <button onclick={() => openCrate('basic')} class="w-full py-3 bg-zinc-900 border border-violet-500/30 text-violet-400 text-xs font-black uppercase tracking-widest hover:bg-violet-500 hover:text-black transition-all">
            Abrir por 100 Nets
          </button>
        </div>

        <!-- Caja Rara -->
        <div class="group relative bg-[#0a0a0a] border border-zinc-800 hover:border-blue-500/50 p-6 flex flex-col items-center justify-center transition-all duration-500 hover:-translate-y-1">
          <div class="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="w-32 h-32 relative mb-6 mt-4">
            <div class="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all"></div>
            <Package weight="duotone" size={128} class="text-blue-400 relative z-10 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)] group-hover:scale-110 transition-transform duration-500" />
          </div>
          <h3 class="text-lg font-black text-white uppercase tracking-wider mb-1">Caja Rara</h3>
          <p class="text-[10px] text-zinc-500 mb-6 uppercase tracking-widest text-center">Tipografías • Emotes Raros</p>
          <button onclick={() => openCrate('rare')} class="w-full py-3 bg-zinc-900 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest hover:bg-blue-500 hover:text-black transition-all">
            Abrir por 250 Nets
          </button>
        </div>

        <!-- Caja Épica -->
        <div class="group relative bg-[#0a0a0a] border border-zinc-800 hover:border-fuchsia-500/50 p-6 flex flex-col items-center justify-center transition-all duration-500 hover:-translate-y-1">
          <div class="absolute inset-0 bg-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="w-32 h-32 relative mb-6 mt-4">
            <div class="absolute inset-0 bg-fuchsia-500/20 blur-xl rounded-full group-hover:bg-fuchsia-500/30 transition-all animate-pulse"></div>
            <Package weight="duotone" size={128} class="text-fuchsia-400 relative z-10 drop-shadow-[0_0_20px_rgba(232,121,249,0.6)] group-hover:scale-110 transition-transform duration-500" />
          </div>
          <h3 class="text-lg font-black text-white uppercase tracking-wider mb-1">Caja Épica</h3>
          <p class="text-[10px] text-fuchsia-400/70 mb-6 uppercase tracking-widest text-center drop-shadow-[0_0_5px_rgba(232,121,249,0.3)]">Garantiza objeto Épico</p>
          <button onclick={() => openCrate('epic')} class="w-full py-3 bg-fuchsia-500 text-black text-xs font-black uppercase tracking-widest hover:bg-fuchsia-400 transition-all shadow-[0_0_15px_rgba(232,121,249,0.3)] hover:shadow-[0_0_25px_rgba(232,121,249,0.5)]">
            Abrir por 500 Nets
          </button>
        </div>
      </div>
    </div>
  {:else if currentTab === 'collection'}
    <div class="h-[600px] flex flex-col p-6" in:fade={{ duration: 400 }}>
      <div class="mb-6 border-b border-white/5 pb-4">
        <h2 class="text-2xl font-black text-white uppercase tracking-widest mb-1">Colección</h2>
        <p class="text-xs text-zinc-500">Personaliza tu perfil y experiencia en ChillChess.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Coleccion item: Emotes -->
        <div class="bg-[#0a0a0a] border border-white/5 p-4 hover:border-violet-500/30 transition-colors cursor-pointer group">
          <div class="w-10 h-10 bg-violet-500/10 flex items-center justify-center mb-3 group-hover:bg-violet-500/20 transition-colors">
            <Smiley size={24} weight="duotone" class="text-violet-400" />
          </div>
          <h4 class="text-sm font-bold text-white mb-1">Emotes</h4>
          <p class="text-[10px] text-zinc-500">12 / 50 Desbloqueados</p>
          <div class="mt-3 h-1 bg-white/5 w-full">
            <div class="h-full bg-violet-500 w-[24%]"></div>
          </div>
        </div>

        <!-- Coleccion item: Colores -->
        <div class="bg-[#0a0a0a] border border-white/5 p-4 hover:border-violet-500/30 transition-colors cursor-pointer group">
          <div class="w-10 h-10 bg-violet-500/10 flex items-center justify-center mb-3 group-hover:bg-violet-500/20 transition-colors">
            <PaintBrush size={24} weight="duotone" class="text-violet-400" />
          </div>
          <h4 class="text-sm font-bold text-white mb-1">Colores</h4>
          <p class="text-[10px] text-zinc-500">3 / 15 Desbloqueados</p>
          <div class="mt-3 h-1 bg-white/5 w-full">
            <div class="h-full bg-violet-500 w-[20%]"></div>
          </div>
        </div>

        <!-- Coleccion item: Tipografías -->
        <div class="bg-[#0a0a0a] border border-white/5 p-4 hover:border-blue-500/30 transition-colors cursor-pointer group">
          <div class="w-10 h-10 bg-blue-500/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
            <TextT size={24} weight="duotone" class="text-blue-400" />
          </div>
          <h4 class="text-sm font-bold text-white mb-1">Tipografías</h4>
          <p class="text-[10px] text-zinc-500">1 / 8 Desbloqueados</p>
          <div class="mt-3 h-1 bg-white/5 w-full">
            <div class="h-full bg-blue-500 w-[12%]"></div>
          </div>
        </div>
      </div>

      <div class="mt-8 border border-white/5 bg-[#0a0a0a] p-6 flex flex-col items-center justify-center flex-1">
         <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-zinc-600 mb-4">
           <Smiley size={32} weight="duotone" />
         </div>
         <h2 class="text-xl font-black text-white uppercase tracking-widest mb-2">Selecciona una categoría</h2>
         <p class="text-sm text-zinc-500 max-w-md text-center">Explora tus cosméticos desbloqueados y personaliza tu apariencia.</p>
      </div>
    </div>
  {:else}
    <!-- Placeholder for other tabs -->
    <div class="h-[600px] border border-white/5 bg-[#0a0a0a] flex flex-col items-center justify-center text-center p-8" in:fade={{ duration: 400 }}>
      <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-zinc-600 mb-4">
        <LockKey size={32} weight="duotone" />
      </div>
      <h2 class="text-xl font-black text-white uppercase tracking-widest mb-2">Sección en Desarrollo</h2>
      <p class="text-sm text-zinc-500 max-w-md">La sección de {tabs.find(t => t.id === currentTab)?.label} estará disponible próximamente en la próxima actualización.</p>
    </div>
  {/if}
</div>

{#if isOpeningCrate}
  <div class="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
    {#if !showCrateResult}
      <h2 class="absolute top-20 text-2xl font-black text-white uppercase tracking-[0.3em] animate-pulse">Abriendo Caja...</h2>
      
      <!-- Roulette Container -->
      <div class="relative w-full max-w-5xl h-64 flex items-center overflow-hidden">
        <!-- Center Indicator -->
        <div class="absolute left-1/2 top-0 bottom-0 w-1 bg-white/50 -translate-x-1/2 z-20 shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
        <div class="absolute left-1/2 top-0 bottom-0 w-32 bg-gradient-to-b from-white/10 to-transparent -translate-x-1/2 z-10 blur-xl"></div>
        
        <!-- Track -->
        <div class="flex gap-4 absolute left-1/2 transition-transform duration-[4000ms] ease-[cubic-bezier(0.15,1,0.3,1)]" 
             style="transform: translateX({rouletteOffset}px)">
          {#each rouletteItems as item, i}
            <div class="w-[160px] h-48 bg-[#0a0a0a] border-2 {item.border} rounded-xl p-4 flex flex-col items-center justify-center shrink-0 {item.shadow}">
              <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-3">
                {#if item.icon}
                  {@const Icon = item.icon}
                  <Icon size={32} weight="duotone" class={item.color} />
                {/if}
              </div>
              <h3 class="text-sm font-black text-white text-center mb-1">{item.name}</h3>
              <p class="text-[9px] font-black uppercase tracking-widest {item.color}">{item.rarity}</p>
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <!-- Result Screen -->
      <div class="flex flex-col items-center justify-center" in:fade={{ duration: 400 }}>
        <p class="text-sm font-black {crateResult.color} uppercase tracking-[0.2em] mb-4">¡NUEVO DESBLOQUEO!</p>
        
        <div class="w-64 h-80 bg-[#0a0a0a] border-2 {crateResult.border} rounded-2xl p-6 flex flex-col items-center justify-center relative {crateResult.shadow} overflow-hidden mb-8">
          <div class="absolute inset-0 bg-gradient-to-t {crateResult.bgGradient} to-transparent"></div>
          
          <div class="w-32 h-32 relative mb-6">
            <div class="absolute inset-0 {crateResult.bgGlow} blur-xl rounded-full animate-pulse"></div>
            <div class="w-full h-full flex items-center justify-center relative z-10">
              {#if crateResult.icon}
                {@const Icon = crateResult.icon}
                <Icon size={80} weight="duotone" class={crateResult.color} />
              {/if}
            </div>
          </div>
          
          <h2 class="text-2xl font-black text-white mb-1 relative z-10 text-center">{crateResult.name}</h2>
          <p class="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 relative z-10">{crateResult.type}</p>
          <div class="px-3 py-1 {crateResult.badgeBg} border border-white/5 rounded-full relative z-10">
            <p class="text-[9px] font-black uppercase tracking-widest {crateResult.color}">{crateResult.rarity}</p>
          </div>
        </div>

        <button 
          onclick={closeCrate}
          class="px-8 py-3 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all rounded-xl"
        >
          Continuar <ArrowRight weight="bold" class="inline-block ml-2" />
        </button>
      </div>
    {/if}
  </div>
{/if}

<style>
  :global(body) {
    background-color: #050505;
    background-image: 
      radial-gradient(at 50% 0%, rgba(52, 211, 153, 0.03) 0px, transparent 50%),
      radial-gradient(at 0% 100%, rgba(139, 92, 246, 0.03) 0px, transparent 50%);
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
</style>
