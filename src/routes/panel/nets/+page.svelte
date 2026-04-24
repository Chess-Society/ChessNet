<script lang="ts">
  import { fade, fly, slide } from 'svelte/transition';
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
    Flame,
    Lightning,
    Storefront,
    UserCircle,
    User,
    Sparkle,
    Rocket,
    Clock,
    Calendar,
    CaretLeft,
    CaretRight,
    Check,
    ArrowUp,
    Target,
    Cube,
    ListChecks
  } from 'phosphor-svelte';

  import { battlepassApi } from '$lib/api/battlepass';
  import { user } from '$lib/stores/auth';
  import { toast } from '$lib/stores/toast';
  import { 
    XP_PER_TIER, 
    RARITY_STYLES, 
    frameStyles, 
    nameColorStyles, 
    nameFontStyles, 
    shopItems as baseShopItems, 
    possibleRewards as basePossibleRewards 
  } from '$lib/data/economy';

  // Sub-navigation state
  let currentTab = $state('battlepass');
  const tabs = [
    { id: 'battlepass', label: 'Pase de Batalla', icon: Star },
    { id: 'crates', label: 'Cajas', icon: Package },
    { id: 'shop', label: 'Tienda', icon: Storefront },
    { id: 'collection', label: 'Personalizar', icon: UserCircle }
  ];

  let activeIndex = $derived(tabs.findIndex(t => t.id === currentTab));

  // DB State
  let bpData = $derived($appStore.settings?.economy?.battlePass);
  let currentTier = $derived(bpData?.currentTier || 1);
  let currentXp = $derived(bpData?.currentXp || 0);
  let isPremium = $derived(bpData?.isPremium || false);
  let claimedTiers = $derived(bpData?.claimedTiers || []);
  
  interface Challenge {
    id: string;
    title: string;
    description: string;
    progress: number;
    target: number;
    rewardXp: number;
    completed: boolean;
    claimed?: boolean;
  }

  const defaultDaily: Challenge[] = [
    { id: 'd1', title: 'Analista Nato', description: 'Analiza 3 de tus partidas hoy.', progress: 1, target: 3, rewardXp: 500, completed: false },
    { id: 'd2', title: 'Resolución Letal', description: 'Completa 5 puzzles sin fallar.', progress: 5, target: 5, rewardXp: 750, completed: true },
    { id: 'd3', title: 'Socializador', description: 'Publica 2 mensajes en el feed.', progress: 0, target: 2, rewardXp: 300, completed: false }
  ];

  const defaultWeekly: Challenge[] = [
    { id: 'w1', title: 'Veterano Semanal', description: 'Gana 10 partidas clasificatorias.', progress: 4, target: 10, rewardXp: 2500, completed: false },
    { id: 'w2', title: 'Mente Brillante', description: 'Consigue una precisión de +90% en 3 juegos.', progress: 1, target: 3, rewardXp: 1500, completed: false }
  ];

  let dailyChallengesDb = $derived<Challenge[]>(
    (bpData?.dailyChallenges 
      ? (Array.isArray(bpData.dailyChallenges) ? bpData.dailyChallenges : Object.values(bpData.dailyChallenges)) 
      : defaultDaily) as Challenge[]
  );
  
  let weeklyChallengesDb = $derived<Challenge[]>(
    (bpData?.weeklyChallenges 
      ? (Array.isArray(bpData.weeklyChallenges) ? bpData.weeklyChallenges : Object.values(bpData.weeklyChallenges)) 
      : defaultWeekly) as Challenge[]
  );
  
  
  const season = $derived({
    number: 1,
    name: 'GÉNESIS',
    timeLeft: '45D 12H',
    totalTiers: 20,
    currentTier: currentTier,
    currentXp: currentXp,
  });

  const baseTiers = [
    { level: 1, type: 'free', reward: 'Hola 👋', category: 'emote', icon: Smiley, color: 'text-zinc-400', rarity: 'COMÚN' },
    { level: 2, type: 'premium', reward: '25 Nets', category: 'currency', icon: Coins, color: 'text-amber-400', rarity: 'COMÚN' },
    { level: 3, type: 'free', reward: 'Gris Piedra', category: 'color', icon: PaintBrush, color: 'text-zinc-500', rarity: 'POCO COMÚN' },
    { level: 4, type: 'premium', reward: 'Cyber', category: 'font', icon: TextT, color: 'text-blue-400', rarity: 'RARO' },
    { level: 5, type: 'premium', reward: '50 Nets', category: 'currency', icon: Coins, color: 'text-amber-400', rarity: 'POCO COMÚN' },
    { level: 6, type: 'free', reward: 'Pensando 🤔', category: 'emote', icon: Smiley, color: 'text-zinc-400', rarity: 'POCO COMÚN' },
    { level: 7, type: 'premium', reward: 'Violeta Neón', category: 'color', icon: PaintBrush, color: 'text-violet-400', rarity: 'ÉPICO' },
    { level: 8, type: 'premium', reward: '75 Nets', category: 'currency', icon: Coins, color: 'text-amber-400', rarity: 'RARO' },
    { level: 9, type: 'free', reward: 'Corazón ❤️', category: 'emote', icon: Smiley, color: 'text-red-400', rarity: 'POCO COMÚN' },
    { level: 10, type: 'premium', reward: 'MARCO ELITE', category: 'frame', icon: ImageSquare, color: 'text-emerald-400', rarity: 'LEGENDARIO' },
    { level: 11, type: 'free', reward: 'Rojo Fuego', category: 'color', icon: PaintBrush, color: 'text-red-500', rarity: 'RARO' },
    { level: 12, type: 'premium', reward: '100 Nets', category: 'currency', icon: Coins, color: 'text-amber-400', rarity: 'ÉPICO' },
    { level: 13, type: 'free', reward: 'Elegante', category: 'font', icon: TextT, color: 'text-zinc-300', rarity: 'RARO' },
    { level: 14, type: 'premium', reward: 'Efecto Trueno', category: 'effect', icon: Lightning, color: 'text-yellow-400', rarity: 'ÉPICO' },
    { level: 15, type: 'free', reward: '50 Nets', category: 'currency', icon: Coins, color: 'text-amber-400', rarity: 'RARO' },
    { level: 16, type: 'premium', reward: 'Dorado', category: 'color', icon: PaintBrush, color: 'text-amber-500', rarity: 'LEGENDARIO' },
    { level: 17, type: 'free', reward: 'Llorando 😂', category: 'emote', icon: Smiley, color: 'text-yellow-400', rarity: 'RARO' },
    { level: 18, type: 'premium', reward: 'MARCO MÍTICO', category: 'frame', icon: ImageSquare, color: 'text-red-500', rarity: 'MÍTICO' },
    { level: 19, type: 'premium', reward: '250 Nets', category: 'currency', icon: Coins, color: 'text-amber-400', rarity: 'LEGENDARIO' },
    { level: 20, type: 'premium', reward: 'CHESSNET GOD', category: 'title', icon: Trophy, color: 'text-violet-500', rarity: 'DIVINO' },
  ];

  let tiers = $derived(baseTiers.map(t => ({...t, claimed: claimedTiers.includes(t.level)})));

  let selectedTierLevel = $state(1);
  let selectedTier = $derived(tiers.find(t => t.level === selectedTierLevel) || tiers[0]);

  const baseDaily = [
    { id: 'daily-1', title: 'Mantén la Racha', description: 'Analiza 3 partidas hoy.', xp: 150, total: 3 },
    { id: 'daily-2', title: 'Táctico Experto', description: 'Resuelve 5 puzzles.', xp: 200, total: 5 },
    { id: 'daily-3', title: 'Expresivo', description: 'Usa 3 emotes en el feed.', xp: 100, total: 3 },
  ];

  async function handleClaimTier(tier: any) {
    if (!$user) return;
    if (claimedTiers.includes(tier.level)) {
      toast.error('Este nivel ya ha sido reclamado');
      return;
    }
    if (currentTier < tier.level) {
      toast.error('Nivel insuficiente para reclamar');
      return;
    }
    
    try {
      let rewardObj: { type: string, value: any } = { type: tier.category, value: tier.reward };
      
      if (tier.category === 'nets') {
        rewardObj.value = parseInt(tier.reward);
      } else if (tier.category === 'crate') {
        rewardObj.value = tier.reward.includes('Épica') ? 'epic' : (tier.reward.includes('Rara') ? 'rare' : 'basic');
      }
      
      await battlepassApi.claimTier($user.uid, tier.level, rewardObj);
      triggerPulse();
    } catch (e) {
      console.error(e);
    }
  }



  const categoryLabels: Record<string, string> = {
    'currency': 'MONEDA VIRTUAL',
    'emote': 'EMOTE EXCLUSIVO',
    'color': 'COLOR DE NOMBRE',
    'font': 'FUENTE ESPECIAL',
    'frame': 'MARCO DE AVATAR',
    'effect': 'EFECTO VISUAL',
    'title': 'TÍTULO DE PRESTIGIO'
  };

  const iconMap: Record<string, any> = {
    'currency': Coins,
    'color': PaintBrush,
    'frame': ImageSquare,
    'font': TextT,
    'emote': Smiley,
    'title': Trophy
  };

  const shopItems = baseShopItems.map(item => ({
    ...item,
    icon: iconMap[item.type] || Package
  }));
  async function handleBuyItem(item: any) {
    if (!$user) return;
    if (netsBalance < item.price) {
      toast.error('Nets insuficientes');
      return;
    }

    try {
      await battlepassApi.buyShopItem($user.uid, item);
      triggerPulse();
      toast.success(`¡Has comprado ${item.name}!`);
    } catch (e) {
      console.error(e);
      toast.error('Error al realizar la compra');
    }
  }

  let scrollContainer = $state<HTMLDivElement | null>(null);
  function scrollTimeline(dir: 'left' | 'right') {
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  }

  async function handleClaimChallenge(challenge: any, type: 'daily'|'weekly') {
    if (!$user) return;
    if (challenge.claimed) {
      toast.error('Este reto ya ha sido reclamado');
      return;
    }
    if (!challenge.completed) {
      toast.error('El reto no ha sido completado');
      return;
    }

    try {
      await battlepassApi.claimChallenge($user.uid, challenge.id, type, challenge.xp || challenge.rewardXp);
      triggerPulse();
      toast.success('¡Recompensa reclamada!');
    } catch (e) {
      console.error(e);
      toast.error('Error al reclamar el reto');
    }
  }

  let collection = $derived($appStore.settings?.economy?.collection || {
    badges: [],
    emotes: [],
    fonts: [],
    colors: [],
    themes: [],
    frames: []
  });

  let netsBalance = $derived($appStore.settings?.economy?.netsBalance || 0);
  let activeColor = $derived($appStore.settings?.economy?.activeColor || 'none');
  let activeFrame = $derived($appStore.settings?.economy?.activeFrame || 'none');
  let activeFont = $derived($appStore.settings?.economy?.activeFont || 'none');

  let showPulse = $state(false);
  let showElectricOverlay = $state(false);
  function triggerPulse() {
    showPulse = true;
    showElectricOverlay = true;
    setTimeout(() => {
      showPulse = false;
      showElectricOverlay = false;
    }, 600);
  }

  async function handleEquipItem(type: 'color' | 'frame' | 'font', value: string) {
    if (!$user) return;
    try {
      await battlepassApi.equipItem($user.uid, type, value);
      triggerPulse();
    } catch (e) {
      console.error(e);
    }
  }

  let isOpeningCrate = $state(false);
  let showCrateResult = $state(false);
  let crateResult = $state<any>(null);
  let crateType = $state('');
  
  const possibleRewards = basePossibleRewards.map(r => ({
    ...r,
    icon: iconMap[r.type.toLowerCase()] || Package
  }));

  let rouletteItems = $state<any[]>([]);

  async function openCrate(type: string) {
    if (isOpeningCrate || !$user) return;
    const price = type === 'epic' ? 500 : (type === 'rare' ? 250 : 100);
    if (netsBalance < price) return;

    crateType = type;
    isOpeningCrate = true;
    showCrateResult = false;
    crateResult = null;
    
    rouletteItems = Array(40).fill(0).map(() => possibleRewards[Math.floor(Math.random() * possibleRewards.length)]);
    
    try {
      const winnerData = await battlepassApi.openCrate($user.uid, price, type);
      
      let winner = possibleRewards.find(r => r.name === winnerData.name) || possibleRewards[0];
      
      rouletteItems[35] = winner;
      crateResult = winner;
      
      rouletteOffset = 0;
      setTimeout(() => { rouletteOffset = -(35 * 176 + 80); }, 50);

      setTimeout(() => {
        triggerPulse();
        showCrateResult = true;
      }, 4500);

    } catch (e) {
      console.error(e);
      isOpeningCrate = false;
      toast.error('Error al abrir la caja');
    }
  }

  function closeCrate() {
    isOpeningCrate = false;
    showCrateResult = false;
    crateResult = null;
  }

  let rouletteOffset = $state(0);


  let timeLeft = $state("");
  $effect(() => {
    const updateTime = () => {
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setUTCHours(24, 0, 0, 0);
      const diff = nextMidnight.getTime() - now.getTime();
      
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      timeLeft = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  });

</script>

<svelte:head>
  <title>Economía & Pase | ChessNet</title>
</svelte:head>

<div class="max-w-[1400px] mx-auto min-h-screen">
  <!-- KickCrates-style top bar -->
  <div class="sticky top-20 z-30 bg-[#0a0a0a] border-b border-white/5 {showPulse ? 'electric-pulse' : ''}" in:fade={{ duration: 300 }}>
    <!-- Brand row -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-white/5">
      <h1 class="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
        <div class="w-7 h-7 bg-violet-500 flex items-center justify-center rotate-3 shadow-[0_0_15px_rgba(139,92,246,0.5)]">
          <Package size={16} weight="fill" class="text-black" />
        </div>
        CHESS<span class="text-violet-400">NETS</span>
        <span class="text-[9px] font-black text-zinc-600 normal-case tracking-widest italic ml-1 hidden sm:inline-block">Recompensas · Batallas · Rangos</span>
      </h1>
      <div class="flex items-center gap-3 px-4 py-2 bg-violet-500/10 border border-violet-500/20">
        <Coins size={14} weight="fill" class="text-amber-400" />
        <span class="text-[11px] font-black text-white font-mono">{(netsBalance ?? 0).toLocaleString()}</span>
        <span class="text-[9px] text-zinc-500 font-black uppercase">NETS</span>
      </div>
    </div>
    <!-- Tab row -->
    <div class="bg-[#0d0d0f] border-b border-white/5 p-2 px-4 sm:px-6">
      <div class="max-w-2xl mx-auto flex p-1 bg-black/40 border border-white/5 relative overflow-hidden">
        {#each tabs as tab}
          <button
            onclick={() => currentTab = tab.id}
            class="flex-1 flex items-center justify-center gap-2.5 py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all relative z-10 whitespace-nowrap
              {currentTab === tab.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}"
          >
            <tab.icon
              size={14}
              weight={currentTab === tab.id ? 'fill' : 'bold'}
              class="transition-colors {currentTab === tab.id ? 'text-violet-400' : 'text-zinc-600'}"
            />
            <span class="hidden xs:inline">{tab.label}</span>
          </button>
        {/each}
        
        <!-- Sliding Indicator -->
        <div 
          class="absolute top-1 bottom-1 left-1 bg-white/5 border border-white/10 transition-all duration-300 ease-out z-0"
          style="width: calc((100% - 8px) / {tabs.length}); transform: translateX(calc({activeIndex} * 100%))"
        ></div>
      </div>
    </div>
  </div>

  <div class="p-3 sm:p-4 lg:p-8">

  <div class="grid grid-cols-1 xl:grid-cols-4 gap-6 sm:gap-8">
    <div class="xl:col-span-3 order-2 xl:order-1">

  {#if currentTab === 'battlepass'}
    <div class="flex flex-col gap-8" in:fade={{ duration: 400 }}>
      <!-- Main Battle Pass Header & Reward Preview -->
      <div class="bg-[#0a0a0b] border border-white/5 relative overflow-hidden flex flex-col min-h-[500px] sm:min-h-[550px] shadow-2xl">
        <!-- Top Indicators -->
        <div class="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <div class="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
              Temporada {season.number} disponible
            </span>
            <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} /> {season.timeLeft}
            </span>
          </div>
          <div class="flex items-center gap-4">
             <div class="flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-white/10">
               <Calendar size={14} class="text-amber-500" />
               <span class="text-[9px] font-black text-white uppercase tracking-widest">{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
             </div>
             <div class="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20">
               <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
               <span class="text-[9px] font-black text-emerald-500 uppercase tracking-widest">ACTIVO</span>
             </div>
          </div>
        </div>

        <!-- Reward Preview Center -->
        <div class="flex-1 flex flex-col items-center justify-center relative z-10 p-6 pt-24 pb-32">
          <!-- Season Title -->
          <div class="absolute top-24 left-8 text-left">
            <h3 class="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-1">TEMPORADA {season.number}</h3>
            <h2 class="text-2xl font-black text-white uppercase tracking-tighter italic">{season.name}</h2>
          </div>

          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-current opacity-[0.1] blur-[100px] pointer-events-none {selectedTier.color}"></div>
          
          <div class="w-48 h-48 flex items-center justify-center mb-10 relative group float-animation">
            <div class="absolute inset-0 bg-white/5 rounded-full scale-150 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <selectedTier.icon size={120} weight="duotone" class="{selectedTier.color} drop-shadow-[0_0_50px_currentColor] transition-transform duration-700 group-hover:scale-110" />
          </div>

          <div class="text-center space-y-4 max-w-md">
            <div class="flex flex-col items-center gap-1">
              <span class="text-[9px] font-black uppercase tracking-[0.3em] {selectedTier.color}">✦ {selectedTier.rarity} {categoryLabels[selectedTier.category] || 'RECOMPENSA'}</span>
              <h2 class="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter italic drop-shadow-sm">{selectedTier.reward}</h2>
            </div>
            
            <div class="pt-6 flex items-center justify-center gap-4">
              {#if selectedTier.claimed}
                <div class="px-8 py-3 bg-zinc-900 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <Check size={16} weight="bold" /> RECLAMADO
                </div>
                <div class="px-4 py-3 bg-zinc-900/50 border border-white/5 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                  TIER {selectedTier.level}
                </div>
              {:else if selectedTier.level <= season.currentTier}
                 <button 
                  onclick={() => handleClaimTier(selectedTier)}
                  class="px-10 py-4 bg-emerald-500 text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                 >
                   RECLAMAR TIER {selectedTier.level}
                 </button>
              {:else}
                <button class="px-8 py-3 bg-zinc-900/80 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] cursor-not-allowed flex items-center gap-2">
                   <LockKey size={14} /> DESBLOQUEAR AL NIVEL {selectedTier.level}
                </button>
                <div class="px-4 py-3 bg-zinc-900/50 border border-white/5 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                  TIER {selectedTier.level}
                </div>
              {/if}
            </div>
          </div>
        </div>

        <!-- Horizontal Tier Selector -->
        <div class="absolute bottom-0 left-0 right-0 h-28 bg-[#0d0d0f]/90 backdrop-blur-md border-t border-white/5 p-4 flex items-center gap-4 z-20">
           <button onclick={() => scrollTimeline('left')} class="w-12 h-full text-zinc-600 hover:text-white transition-colors bg-black/20 flex items-center justify-center"><CaretLeft size={24} /></button>
           <div bind:this={scrollContainer} class="flex-1 flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-4">
              {#each tiers as tier, i}
                <button 
                  onclick={() => selectedTierLevel = tier.level} 
                  class="relative shrink-0 flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110 active:scale-95 {selectedTierLevel === tier.level ? 'scale-110 z-10' : 'opacity-40 hover:opacity-100 hover:scale-105'}"
                >
                  <div class="w-14 h-14 border-2 flex items-center justify-center transition-all duration-300 {selectedTierLevel === tier.level ? `border-current ${tier.color} bg-white/10` : 'border-white/5 bg-zinc-950'}">
                    <tier.icon size={20} weight={tier.claimed ? "fill" : "bold"} class={tier.claimed ? "text-emerald-400" : "text-zinc-600"} />
                    {#if tier.claimed}
                      <div class="absolute -top-1 -right-1 bg-emerald-500 text-black rounded-full p-0.5 border-2 border-[#0d0d0f]">
                        <Check size={8} weight="bold" />
                      </div>
                    {/if}
                  </div>
                  <span class="text-[9px] font-black {selectedTierLevel === tier.level ? 'text-white' : 'text-zinc-700'}">{tier.level}</span>
                </button>
              {/each}
           </div>
           <button onclick={() => scrollTimeline('right')} class="w-12 h-full text-zinc-600 hover:text-white transition-colors bg-black/20 flex items-center justify-center"><CaretRight size={24} /></button>
           
           <!-- Jump to tier button -->
           <div class="pl-4 border-l border-white/5 h-full hidden lg:flex items-center">
             <button class="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-widest whitespace-nowrap hover:bg-amber-500 hover:text-black transition-all flex items-center gap-2">
                <ArrowUp size={14} weight="bold" /> IR AL NIVEL {season.currentTier + 1}
             </button>
           </div>
        </div>
      </div>

      <!-- Bottom Progress Bar -->
      <div class="bg-[#0a0a0b] border border-white/5 p-4 sm:p-8 shadow-lg">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-zinc-900 border-2 border-amber-500 flex items-center justify-center text-amber-500 font-black text-xl italic">
                {season.currentTier}
              </div>
              <div>
                <h4 class="text-sm font-black text-white uppercase tracking-wider">Tier {season.currentTier} <span class="text-zinc-600">/ 30</span></h4>
                <p class="text-[10px] font-mono text-zinc-500 tracking-widest">{currentXp} / 7500 XP</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">{7500 - currentXp} XP PARA EL NIVEL {season.currentTier + 1}</span>
            </div>
          </div>
          <div class="h-2 bg-zinc-900 w-full overflow-hidden relative xp-wave">
             <div class="absolute inset-0 bg-amber-500/10 animate-pulse"></div>
             <div class="h-full bg-amber-500 transition-all duration-1000 shadow-[0_0_10px_#f59e0b]" style="width: {(currentXp / 7500) * 100}%"></div>
          </div>
        </div>
      </div>
    </div>
  {:else if currentTab === 'shop'}
    <div class="flex flex-col gap-8" in:fade={{ duration: 400 }}>
      <!-- Featured Rotation -->
      <div class="bg-violet-950/10 border border-violet-500/20 p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-4">
           <span class="text-[10px] font-black text-violet-400 uppercase tracking-[0.3em] flex items-center gap-2">
             <Lightning size={14} weight="fill" /> Rotación en: {timeLeft}
           </span>
        </div>
        <div class="w-48 h-48 bg-zinc-900 border border-white/5 flex items-center justify-center relative group">
           <div class="absolute inset-0 bg-violet-500/20 blur-3xl group-hover:blur-[50px] transition-all"></div>
           <Star size={100} weight="duotone" class="text-violet-500 relative z-10" />
        </div>
        <div class="flex-1 space-y-4 text-center md:text-left">
           <div>
             <span class="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest">OFERTA DEL DÍA</span>
             <h3 class="text-3xl font-black text-white uppercase tracking-tighter italic mt-2">Pack Orígenes</h3>
           </div>
           <p class="text-xs text-zinc-500 max-w-md">Incluye el Marco "Génesis", el Color "Ultra Violeta" y una Caja Épica garantizada.</p>
           <button class="px-10 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-violet-500 hover:text-white transition-all flex items-center justify-center md:justify-start gap-3">
             <Coins size={18} weight="fill" /> 10.000 Nets
           </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {#each shopItems as item}
          {@const rs = RARITY_STYLES[item.rarity] || RARITY_STYLES['Common']}
          <div class="bg-zinc-950 border {rs.border} p-4 sm:p-6 group transition-all flex flex-col relative overflow-hidden scanline {item.rarity === 'Legendary' || item.rarity === 'Mythic' ? 'shimmer-premium' : ''}">
            <div class="absolute inset-0 {rs.bg} opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="flex justify-between items-start mb-6 relative z-10">
              <span class="text-[9px] font-black uppercase px-2 py-0.5 border {rs.border} {rs.color} tracking-widest {rs.bg}">
                {rs.label}
              </span>
              <div class="flex items-center gap-1 text-[11px] font-black text-amber-400 bg-amber-500/10 px-2 py-1">
                <Coins size={14} weight="fill" />
                {item.price}
              </div>
            </div>
            <div class="flex-1 flex items-center justify-center mb-6 relative py-8 z-10">
               <div class="absolute inset-0 blur-2xl opacity-30" style="background: radial-gradient(circle, {rs.glow} 0%, transparent 70%)"></div>
               <item.icon size={80} weight="duotone" class="{rs.color} relative z-10 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div class="relative z-10">
              <h4 class="text-sm font-black text-white uppercase tracking-widest mb-1">{item.name}</h4>
              <p class="text-xs text-zinc-500 mb-6 line-clamp-2">{item.desc}</p>
              <button
                onclick={() => handleBuyItem(item)}
                disabled={netsBalance < item.price}
                class="w-full py-3 border {rs.border} {rs.color} text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all disabled:opacity-30 flex items-center justify-center gap-2"
              >
                {#if netsBalance < item.price}
                  <LockKey size={14} /> Bloqueado
                {:else}
                  <Storefront size={14} /> Adquirir
                {/if}
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else if currentTab === 'crates'}
    {@const crateData = [
      { type: 'season', label: 'Caja de Temporada', price: 1000, frequency: 'SEASON', rarity: 'Legendary', desc: 'Objetos exclusivos de esta temporada. ¡Corre antes de que se acaben!', borderCls: 'border-amber-500/50', glowCls: 'bg-amber-500/5', iconCls: 'text-amber-500', btnCls: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-500', ready: false, timer: '7d 5h 24m' },
      { type: 'daily',  label: 'Caja Diaria',      price: 0,    frequency: 'DAILY',  rarity: 'Uncommon',  desc: 'Vuelve cada día para una oportunidad de unboxing gratis.',   borderCls: 'border-emerald-500',    glowCls: 'bg-emerald-500/10', iconCls: 'text-emerald-500', btnCls: 'bg-emerald-500 hover:bg-white text-black', ready: true, timer: '18h 45m' },
      { type: 'weekly', label: 'Caja Semanal',     price: 250,  frequency: 'WEEKLY', rarity: 'Rare',      desc: 'Objetos infrecuentes y más. Mejores probabilidades.',       borderCls: 'border-blue-500/50',    glowCls: 'bg-blue-500/5',    iconCls: 'text-blue-500',    btnCls: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-500', ready: false, timer: '2d 18h' },
      { type: 'monthly',label: 'Caja Mensual',     price: 500,  frequency: 'MONTHLY',rarity: 'Legendary', desc: 'Bienes premium. La paciencia tiene su recompensa.',         borderCls: 'border-amber-500/50',   glowCls: 'bg-amber-500/5',   iconCls: 'text-amber-500',   btnCls: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-500', ready: false, timer: '20d 18h' },
    ]}
    <div class="space-y-8" in:fade={{ duration: 400 }}>
      <div class="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Cajas Disponibles</div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each crateData as crate}
          <div class="bg-[#0a0a0b] border {crate.borderCls} p-8 flex flex-col items-center group transition-all relative overflow-hidden h-full">
            <div class="absolute top-0 left-0 p-3">
              <span class="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{crate.frequency}</span>
            </div>
            
            <div class="w-24 h-24 my-6 relative flex items-center justify-center">
              <div class="absolute inset-0 {crate.glowCls} blur-2xl rounded-full"></div>
              <Package size={80} weight="duotone" class="{crate.iconCls} relative z-10 group-hover:scale-110 transition-transform duration-500" />
            </div>

            <div class="flex-1 text-center mb-6">
              <h3 class="text-sm font-black text-white uppercase tracking-wider mb-2">{crate.label}</h3>
              <p class="text-[10px] text-zinc-500 leading-relaxed mb-4">{crate.desc}</p>
              
              <div class="flex flex-col gap-1 items-center">
                <span class="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">Se reinicia en:</span>
                <span class="text-[10px] font-mono text-white">{crate.timer}</span>
              </div>
            </div>

            <button
              onclick={() => crate.ready && openCrate(crate.type)}
              class="w-full py-3.5 {crate.btnCls} text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30"
              disabled={!crate.ready && netsBalance < crate.price}
            >
              {#if crate.ready}
                ABRIR CAJA
              {:else}
                NO DISPONIBLE
              {/if}
            </button>
          </div>
        {/each}
      </div>
    </div>
  {:else if currentTab === 'collection'}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8" in:fade={{ duration: 400 }}>
       <!-- Frames Section -->
       <div class="space-y-6">
          <h3 class="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
            <ImageSquare size={16} /> Marcos de Avatar
          </h3>
          <div class="grid grid-cols-2 gap-4">
            {#each (collection.frames || []) as frame}
              <button 
                onclick={() => handleEquipItem('frame', frame)}
                class="p-4 bg-zinc-950 border transition-all flex flex-col items-center gap-3 {activeFrame === frame ? 'border-violet-500 bg-violet-500/5' : 'border-white/5 hover:border-white/20'}"
              >
                <div class="w-12 h-12 bg-zinc-900 border border-white/10 flex items-center justify-center relative">
                   <User size={24} weight="bold" class="text-zinc-700" />
                   {#if activeFrame === frame}
                     <div class="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 text-black flex items-center justify-center rounded-full">
                        <CheckCircle size={10} weight="fill" />
                     </div>
                   {/if}
                </div>
                <span class="text-[10px] font-black text-white uppercase tracking-tighter">{frame}</span>
              </button>
            {/each}
            {#if (collection.frames?.length || 0) === 0}
               <div class="col-span-2 py-12 text-center border border-dashed border-white/5">
                  <p class="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Sin Marcos</p>
               </div>
            {/if}
          </div>
       </div>

       <!-- Colors Section -->
       <div class="space-y-6">
          <h3 class="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
            <PaintBrush size={16} /> Colores de Nombre
          </h3>
          <div class="grid grid-cols-2 gap-4">
            {#each (collection.colors || []) as color}
              <button 
                onclick={() => handleEquipItem('color', color)}
                class="p-4 bg-zinc-950 border transition-all flex flex-col items-center gap-3 {activeColor === color ? 'border-violet-500 bg-violet-500/5' : 'border-white/5 hover:border-white/20'}"
              >
                <div class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                   <div class="w-6 h-6 rounded-full" style="background-color: currentColor"></div>
                </div>
                <span class="text-[10px] font-black text-white uppercase tracking-tighter">{color}</span>
              </button>
            {/each}
            {#if (collection.colors?.length || 0) === 0}
               <div class="col-span-2 py-12 text-center border border-dashed border-white/5">
                  <p class="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Sin Colores</p>
               </div>
            {/if}
          </div>
       </div>

       <!-- Fonts Section -->
       <div class="space-y-6">
          <h3 class="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
            <TextT size={16} /> Tipografías
          </h3>
          <div class="grid grid-cols-2 gap-4">
            {#each (collection.fonts || []) as font}
              <button 
                onclick={() => handleEquipItem('font', font)}
                class="p-4 bg-zinc-950 border transition-all flex flex-col items-center gap-3 {activeFont === font ? 'border-violet-500 bg-violet-500/5' : 'border-white/5 hover:border-white/20'}"
              >
                <div class="w-full h-12 flex items-center justify-center text-xl font-bold">Aa</div>
                <span class="text-[10px] font-black text-white uppercase tracking-tighter">{font}</span>
              </button>
            {/each}
            {#if (collection.fonts?.length || 0) === 0}
               <div class="col-span-2 py-12 text-center border border-dashed border-white/5">
                  <p class="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Sin Fuentes</p>
               </div>
            {/if}
          </div>
       </div>
    </div>
  {/if}
</div>

<!-- Sidebar: Profile Preview -->
<div class="flex flex-col gap-6 order-1 xl:order-2">
  <!-- Sidebar: Profile & Challenges -->
  <div class="flex flex-col gap-6" in:fade={{ duration: 400, delay: 200 }}>
    <!-- Profile Identity Card -->
    <div class="bg-[#0a0a0b] border border-white/5 p-6 relative overflow-hidden group shadow-xl">
      <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
      
      <div class="flex items-center gap-4 mb-6">
        <div class="relative">
          <div class="absolute -inset-1 bg-amber-500/20 rounded-none blur opacity-0 group-hover:opacity-100 transition duration-700"></div>
          <div class="w-16 h-16 bg-zinc-900 relative flex items-center justify-center border border-white/10 overflow-hidden">
            {#if $user?.photoURL}
              <img src={$user.photoURL} alt="Avatar" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            {:else}
              <User size={30} weight="bold" class="text-zinc-700" />
            {/if}
            {#if activeFrame !== 'none'}
              <div class="absolute inset-0 border-[3px] pointer-events-none {frameStyles[activeFrame] || ''}"></div>
            {/if}
          </div>
        </div>
        
        <div class="flex-1 overflow-hidden">
          <h3 class="text-sm font-black uppercase tracking-tighter italic truncate">
            <span class="{nameColorStyles[activeColor] || 'text-white'} {nameFontStyles[activeFont] || ''}">
              {$user?.displayName || 'USUARIO'}
            </span>
          </h3>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-1.5 py-0.5 border border-amber-500/20">LEVEL {season.currentTier}</span>
            <span class="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{currentXp % 7500} / 7500 XP</span>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-zinc-500 bg-black/40 p-2.5 border border-white/5 group/bal">
          <span class="flex items-center gap-2 transition-colors group-hover/bal:text-white"><Coins size={14} weight="fill" class="text-amber-500" /> Balance Nets</span>
          <span class="text-white font-mono text-xs">{(netsBalance ?? 0).toLocaleString()}</span>
        </div>
        <div class="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-zinc-500 bg-black/40 p-2.5 border border-white/5 group/col">
          <span class="flex items-center gap-2 transition-colors group-hover/col:text-white"><Cube size={14} weight="fill" class="text-violet-500" /> Objetos</span>
          <span class="text-white font-mono text-xs">
            {(collection.badges?.length || 0) + (collection.emotes?.length || 0) + (collection.fonts?.length || 0) + (collection.colors?.length || 0) + (collection.frames?.length || 0)}
          </span>
        </div>
      </div>
    </div>

    <!-- Challenges Section (Only for Battle Pass) -->
    {#if currentTab === 'battlepass'}
      <div class="flex flex-col gap-4" in:slide={{ duration: 400 }}>
        <!-- Section Header -->
        <div class="flex justify-between items-end mb-2">
           <h4 class="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
             <Target size={16} class="text-emerald-500" /> RETOS DIARIOS
           </h4>
           <span class="text-[9px] font-mono text-zinc-600 tracking-widest">REINICIO EN 12H</span>
        </div>

        <div class="space-y-3">
          {#each dailyChallengesDb as challenge}
            <div class="bg-[#0a0a0b] border border-white/5 p-3 sm:p-4 relative group hover:border-emerald-500/30 transition-all duration-300">
              <div class="flex justify-between items-start mb-3 gap-2">
                <div class="flex-1">
                  <h5 class="text-[10px] font-black text-zinc-300 uppercase tracking-widest leading-tight group-hover:text-white transition-colors">{challenge.title}</h5>
                  <p class="text-[9px] text-zinc-600 mt-1 font-medium">{challenge.description}</p>
                </div>
                <div class="flex flex-col items-end gap-1">
                  <div class="flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20">
                    <span class="text-[9px] font-black text-amber-500">+{challenge.rewardXp}</span>
                    <Lightning size={10} weight="fill" class="text-amber-500" />
                  </div>
                  {#if challenge.claimed}
                    <span class="text-[8px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                      <Check size={10} weight="bold" /> RECLAMADO
                    </span>
                  {:else if challenge.completed}
                    <button 
                      onclick={() => handleClaimChallenge(challenge, 'daily')}
                      class="px-2 py-1 bg-emerald-500 text-black text-[8px] font-black uppercase tracking-widest hover:bg-white transition-all flex items-center gap-1"
                    >
                      <Check size={10} weight="bold" /> RECLAMAR
                    </button>
                  {/if}
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="relative h-1 bg-zinc-900 overflow-hidden">
                <div 
                  class="absolute h-full transition-all duration-1000 {challenge.claimed ? 'bg-zinc-800' : (challenge.completed ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-600 group-hover:bg-zinc-400')}" 
                  style="width: {Math.min((challenge.progress / challenge.target) * 100, 100)}%"
                ></div>
              </div>
              <div class="flex justify-between mt-2">
                 <span class="text-[8px] font-mono text-zinc-700 tracking-widest uppercase italic">{challenge.progress} / {challenge.target}</span>
              </div>
            </div>
          {/each}
        </div>

        <!-- Weekly Challenges -->
        <div class="mt-4 flex justify-between items-end mb-2">
           <h4 class="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
             <Trophy size={16} class="text-amber-500" /> RETOS SEMANALES
           </h4>
        </div>
        
        <div class="space-y-3">
          {#each weeklyChallengesDb as challenge}
            <div class="bg-[#0a0a0b] border border-white/5 p-3 sm:p-4 relative group hover:border-violet-500/30 transition-all duration-300">
              <div class="flex justify-between items-start mb-3 gap-2">
                <div class="flex-1">
                  <h5 class="text-[10px] font-black text-zinc-300 uppercase tracking-widest leading-tight group-hover:text-white transition-colors">{challenge.title}</h5>
                  <p class="text-[9px] text-zinc-600 mt-1 font-medium">{challenge.description}</p>
                </div>
                <div class="flex flex-col items-end gap-1">
                  <div class="flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20">
                    <span class="text-[9px] font-black text-amber-500">+{challenge.rewardXp}</span>
                    <Lightning size={10} weight="fill" class="text-amber-500" />
                  </div>
                  {#if challenge.claimed}
                    <span class="text-[8px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                      <Check size={10} weight="bold" /> RECLAMADO
                    </span>
                  {:else if challenge.completed}
                    <button 
                      onclick={() => handleClaimChallenge(challenge, 'weekly')}
                      class="px-2 py-1 bg-violet-500 text-white text-[8px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-1"
                    >
                      <Check size={10} weight="bold" /> RECLAMAR
                    </button>
                  {/if}
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="relative h-1 bg-zinc-900 overflow-hidden">
                <div 
                  class="absolute h-full transition-all duration-1000 {challenge.claimed ? 'bg-zinc-800' : (challenge.completed ? 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]' : 'bg-zinc-600 group-hover:bg-zinc-400')}" 
                  style="width: {Math.min((challenge.progress / challenge.target) * 100, 100)}%"
                ></div>
              </div>
              <div class="flex justify-between mt-2">
                 <span class="text-[8px] font-mono text-zinc-700 tracking-widest uppercase italic">{challenge.progress} / {challenge.target}</span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <!-- Daily Streak (Visible on other tabs) -->
      <div class="bg-zinc-950/50 border border-white/5 p-6 shadow-lg">
         <h4 class="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <Flame size={16} weight="fill" class="text-orange-500" /> Racha Diaria
         </h4>
         <div class="flex gap-2">
            {#each Array(7) as _, i}
              <div class="flex-1 aspect-square bg-zinc-900 border border-white/5 flex items-center justify-center {i < 3 ? 'bg-orange-500/20 border-orange-500/30 text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.1)]' : 'text-zinc-800'}">
                 <span class="text-[10px] font-black">{i + 1}</span>
              </div>
            {/each}
         </div>
      </div>
    {/if}
  </div>
  </div>
</div>
</div>
</div>

{#if isOpeningCrate}
  <div class="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center" in:fade>
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
       <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/10 blur-[150px] rounded-full"></div>
    </div>

    {#if !showCrateResult}
      <div class="text-center space-y-12 w-full" in:fly={{ y: 20 }}>
        <h2 class="text-2xl font-black text-white uppercase tracking-[0.4em] italic">Abriendo Caja {crateType}...</h2>
        
        <div class="relative w-full h-44 border-y border-white/5 bg-zinc-950/50 flex items-center justify-center overflow-hidden">
          <div class="absolute top-0 bottom-0 left-1/2 w-1 bg-violet-500 z-20 shadow-[0_0_20px_rgba(139,92,246,0.8)]"></div>
          
          <div 
            class="flex items-center gap-4 px-[50%] transition-transform duration-[4s] cubic-bezier(0.15, 0, 0.15, 1)"
            style="transform: translateX({rouletteOffset}px)"
          >
            {#each rouletteItems as item}
              <div class="w-32 sm:w-40 h-28 sm:h-32 bg-zinc-900 border {item.border} flex flex-col items-center justify-center gap-2 shrink-0">
                <item.icon size={24} weight="duotone" class="{item.color} sm:w-[32px] sm:h-[32px]" />
                <span class="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-zinc-500">{item.rarity}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {:else}
      <div class="text-center space-y-8 max-w-sm" in:fly={{ y: 40, duration: 800 }}>
        <div class="w-48 h-48 bg-zinc-900 border-2 {crateResult.border} flex items-center justify-center relative mx-auto group">
           <div class="absolute inset-0 {crateResult.color.replace('text-', 'bg-')}/20 blur-3xl animate-pulse"></div>
           <crateResult.icon size={100} weight="duotone" class="{crateResult.color} relative z-10" />
        </div>
        
        <div class="space-y-2">
          <span class="text-[10px] font-black {crateResult.color} uppercase tracking-[0.3em]">{crateResult.rarity}</span>
          <h2 class="text-4xl font-black text-white uppercase tracking-tighter italic">{crateResult.name}</h2>
          <p class="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Objeto añadido a tu colección</p>
        </div>

        <button 
          onclick={closeCrate}
          class="w-full py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-violet-500 hover:text-white transition-all"
        >
          CONTINUAR
        </button>
      </div>
    {/if}
  </div>
{/if}

<!-- Electric Overlay for claims -->
{#if showElectricOverlay}
  <div class="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center" transition:fade={{ duration: 150 }}>
     <!-- Flash Overlay -->
     <div class="absolute inset-0 bg-white/10 animate-pulse"></div>
     
     <!-- Electric Arcs -->
     <div class="absolute inset-0 overflow-hidden mix-blend-overlay opacity-40">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] rotate-12">
           <div class="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-400 to-transparent w-px animate-[ping_0.2s_infinite]"></div>
           <div class="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500 to-transparent w-px translate-x-48 animate-[ping_0.3s_infinite]"></div>
           <div class="absolute inset-0 bg-gradient-to-t from-transparent via-violet-500 to-transparent w-px -translate-x-48 animate-[ping_0.4s_infinite]"></div>
        </div>
     </div>

     <!-- Main Text Pulse -->
     <div class="relative scale-150 animate-bounce flex flex-col items-center">
       <span class="text-7xl font-black text-white italic tracking-tighter drop-shadow-[0_0_40px_rgba(255,255,255,0.8)] uppercase">¡Reclamado!</span>
       <span class="text-amber-400 text-xs font-black uppercase tracking-[0.5em] mt-4 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">Pulso Eléctrico</span>
       <div class="absolute -inset-8 border-4 border-white/30 animate-ping opacity-50"></div>
     </div>
  </div>
{/if}

<style>
  .electric-pulse {
    animation: electricPulse 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes electricPulse {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7); filter: brightness(1); }
    30% { transform: scale(1.02); box-shadow: 0 0 40px 20px rgba(139, 92, 246, 0.3); filter: brightness(1.5); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); filter: brightness(1); }
  }

  /* Premium Micro-interactions */
  .shimmer-premium {
    position: relative;
    overflow: hidden;
  }
  .shimmer-premium::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 0%,
      transparent 40%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 60%,
      transparent 100%
    );
    animation: shimmer 3s infinite linear;
  }

  @keyframes shimmer {
    0% { transform: translate(-30%, -30%) rotate(0deg); }
    100% { transform: translate(30%, 30%) rotate(0deg); }
  }

  .float-animation {
    animation: floating 3s ease-in-out infinite;
  }

  @keyframes floating {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
  }

  .neon-trace {
    position: relative;
  }
  .neon-trace::before {
    content: '';
    position: absolute;
    inset: -1px;
    background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
    background-size: 200% 100%;
    animation: trace 2s linear infinite;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .neon-trace:hover::before {
    opacity: 1;
  }

  @keyframes trace {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .xp-wave {
    position: relative;
    overflow: hidden;
  }
  .xp-wave::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: translateX(-100%);
    animation: wave 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes wave {
    100% { transform: translateX(100%); }
  }

  .roulette-container::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 4px;
    background: #8b5cf6;
    box-shadow: 0 0 20px #8b5cf6;
    z-index: 50;
    transform: translateX(-50%);
  }
  
  :global(body) {
    background-color: #050505;
    background-image: 
      radial-gradient(at 50% 0%, rgba(139, 92, 246, 0.05) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(244, 63, 94, 0.02) 0px, transparent 50%);
  }

  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  /* Scanline effect for shop items */
  .scanline {
    position: relative;
  }
  .scanline::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      rgba(18, 16, 16, 0) 50%,
      rgba(0, 0, 0, 0.1) 50%
    ),
    linear-gradient(
      90deg,
      rgba(255, 0, 0, 0.02),
      rgba(0, 255, 0, 0.01),
      rgba(0, 0, 255, 0.02)
    );
    background-size: 100% 2px, 3px 100%;
    pointer-events: none;
    opacity: 0.3;
  }

  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
</style>
