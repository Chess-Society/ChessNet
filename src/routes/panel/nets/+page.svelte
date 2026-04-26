<script lang="ts">
  import { fade, fly, slide } from 'svelte/transition';
  import { tick } from 'svelte';
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
    ListChecks,
    Palette,
    IdentificationCard,
    Play,
    Sword,
    UserPlus,
    SealCheck as Badge
  } from 'phosphor-svelte';

  import { superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { 
    claimTierSchema, 
    buyItemSchema, 
    claimChallengeSchema, 
    equipItemSchema, 
    openCrateSchema 
  } from '$lib/schemas/nets';

  let { data } = $props();

  // Superforms Initialization
  const { form: ctForm, enhance: enhanceCT } = superForm(data.claimTierForm as any, {
    validators: zod(claimTierSchema as any),
    onUpdated({ form }) {
      if (form.valid) {
        showElectricOverlay = true;
        setTimeout(() => showElectricOverlay = false, 2000);
        toast.success('¡Recompensa reclamada!');
      }
    }
  }) as any;

  const { form: buyForm, enhance: enhanceBuy } = superForm(data.buyItemForm as any, {
    validators: zod(buyItemSchema as any),
    onUpdated({ form }) {
      if (form.valid) {
        toast.success('¡Objeto adquirido!');
      }
    }
  }) as any;

  const { form: ccForm, enhance: enhanceCC } = superForm(data.claimChallengeForm as any, {
    validators: zod(claimChallengeSchema as any),
    onUpdated({ form }) {
      if (form.valid) {
        toast.success('¡Desafío reclamado!');
      }
    }
  }) as any;

  const { form: eqForm, enhance: enhanceEQ } = superForm(data.equipItemSchema as any, {
    validators: zod(equipItemSchema as any),
    onUpdated({ form }) {
      if (form.valid) {
        toast.success('Configuración actualizada');
      }
    }
  }) as any;

  const { form: crateForm, enhance: enhanceCrate } = superForm(data.openCrateForm as any, {
    validators: zod(openCrateSchema as any),
    onUpdated({ form, result }) {
      if (form.valid && result.type === 'success') {
        const winner = (result.data as any)?.winner;
        if (winner) {
          crateResult = winner;
          showCrateResult = true;
        }
      }
    }
  }) as any;

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
  let currentTab = $state('crates');
  const tabs = [
    { id: 'crates', label: 'Cajas', icon: Package },
    { id: 'battlepass', label: 'Pase', icon: Star },
    { id: 'collection', label: 'Colección', icon: Smiley },
    { id: 'loadout', label: 'Equipamiento', icon: PaintBrush },
    { id: 'shop', label: 'Tienda', icon: Storefront }
  ];

  let activeIndex = $derived(tabs.findIndex(t => t.id === currentTab));

  // DB State
  let bpData = $derived($appStore.settings?.economy?.battlePass);
  let currentTier = $derived(bpData?.currentTier || 1);
  let currentXp = $derived(bpData?.currentXp || 0);
  let totalXp = $derived($appStore.settings?.economy?.totalXp || currentXp);
  let isPremium = $derived(bpData?.isPremium || false);
  let claimedTiers = $derived(bpData?.claimedTiers || []);
  
  // Account Level Calculation (Kick-style, separate from BP)
  const XP_PER_ACCOUNT_LEVEL = 10000;
  let accountLevel = $derived(Math.floor(totalXp / XP_PER_ACCOUNT_LEVEL) + 1);
  let accountXpProgress = $derived(totalXp % XP_PER_ACCOUNT_LEVEL);
  let xpProgress = $derived((accountXpProgress / XP_PER_ACCOUNT_LEVEL) * 100);
  
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
    { id: 'd1', title: 'Analista de Mercados', description: 'Analiza 3 mercados de predicción hoy.', progress: 1, target: 3, rewardXp: 500, completed: false },
    { id: 'd2', title: 'Voto Crítico', description: 'Vota en una propuesta de gobernanza.', progress: 1, target: 1, rewardXp: 750, completed: true },
    { id: 'd3', title: 'Socializador', description: 'Publica 2 mensajes en el feed social.', progress: 0, target: 2, rewardXp: 300, completed: false }
  ];

  const defaultWeekly: Challenge[] = [
    { id: 'w1', title: 'Oráculo Semanal', description: 'Acierta 5 predicciones esta semana.', progress: 2, target: 5, rewardXp: 2500, completed: false },
    { id: 'w2', title: 'Magnate de Nets', description: 'Consigue +100 Nets en el mercado.', progress: 45, target: 100, rewardXp: 1500, completed: false }
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
  
  let dailyTimeLeft = $state("");
  let weeklyTimeLeft = $state("");
  let monthlyTimeLeft = $state("");
  let seasonTimeLeft = $state("");

  $effect(() => {
    const updateTimers = () => {
      const now = new Date();
      
      // Daily: Next UTC midnight
      const nextDay = new Date(now);
      nextDay.setUTCHours(24, 0, 0, 0);
      const dDiff = nextDay.getTime() - now.getTime();
      dailyTimeLeft = formatTime(dDiff);

      // Weekly: Next Monday UTC
      const nextWeek = new Date(now);
      nextWeek.setUTCDate(now.getUTCDate() + (7 - (now.getUTCDay() || 7) + 1));
      nextWeek.setUTCHours(0, 0, 0, 0);
      const wDiff = nextWeek.getTime() - now.getTime();
      weeklyTimeLeft = formatTime(wDiff, true);

      // Monthly / Season: Next Month UTC
      const nextMonth = new Date(now);
      nextMonth.setUTCMonth(now.getUTCMonth() + 1, 1);
      nextMonth.setUTCHours(0, 0, 0, 0);
      const mDiff = nextMonth.getTime() - now.getTime();
      monthlyTimeLeft = formatTime(mDiff, true);
      seasonTimeLeft = formatTime(mDiff, true);
    };

    const formatTime = (ms: number, includeDays = false) => {
      if (ms < 0) return "00:00:00";
      const s = Math.floor(ms / 1000);
      const m = Math.floor(s / 60);
      const h = Math.floor(m / 60);
      const d = Math.floor(h / 24);

      if (includeDays && d > 0) {
        return `${d}d ${h % 24}h ${m % 60}m`;
      }
      return `${(h % 24).toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  });

  const season = $derived({
    number: 1,
    name: 'GÉNESIS',
    timeLeft: seasonTimeLeft,
    totalTiers: 20,
    currentTier: currentTier,
    currentXp: currentXp,
  });

  // Dynamic Season Dates
  const getSeasonRange = () => {
    const now = new Date();
    const months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
    const currentMonth = months[now.getUTCMonth()];
    const nextMonth = months[(now.getUTCMonth() + 1) % 12];
    const year = now.getUTCFullYear();
    return `${currentMonth}_${year} // ${nextMonth}_${year}`;
  };

  let seasonRange = $state(getSeasonRange());

  const baseTiers = [
    { level: 1,  type: 'free',    reward: '10 NETS',         category: 'nets',      icon: Coins,     color: 'text-amber-400',  rarity: 'BÁSICO' },
    { level: 2,  type: 'premium', reward: '20 NETS',         category: 'nets',      icon: Coins,     color: 'text-amber-400',  rarity: 'RARO' },
    { level: 3,  type: 'free',    reward: 'Módulo Alfa',     category: 'crate',     icon: Package,   color: 'text-zinc-400',   rarity: 'COMÚN' },
    { level: 4,  type: 'premium', reward: 'Azul Ártico',     category: 'nameColor', icon: Palette,   color: 'text-cyan-400',   rarity: 'RARO' },
    { level: 5,  type: 'free',    reward: '15 NETS',         category: 'nets',      icon: Coins,     color: 'text-amber-400',  rarity: 'BÁSICO' },
    { level: 6,  type: 'premium', reward: 'Módulo Gamma',    category: 'crate',     icon: Package,   color: 'text-violet-400', rarity: 'ÉPICO' },
    { level: 7,  type: 'free',    reward: 'Marco Acero',     category: 'frame',     icon: IdentificationCard, color: 'text-zinc-300', rarity: 'COMÚN' },
    { level: 8,  type: 'premium', reward: '30 NETS',         category: 'nets',      icon: Coins,     color: 'text-amber-400',  rarity: 'ÉPICO' },
    { level: 9,  type: 'free',    reward: 'Shwompy 🐸',      category: 'emote',     icon: Smiley,    color: 'text-emerald-400', rarity: 'LEGENDARIO' },
    { level: 10, type: 'premium', reward: 'Esmeralda',       category: 'nameColor', icon: Palette,   color: 'text-emerald-400', rarity: 'INFRECUENTE' },
    { level: 11, type: 'free',    reward: '20 NETS',         category: 'nets',      icon: Coins,     color: 'text-amber-400',  rarity: 'BÁSICO' },
    { level: 12, type: 'premium', reward: 'Tipografía Retro', category: 'font',      icon: TextT,     color: 'text-zinc-200',   rarity: 'RARO' },
    { level: 13, type: 'free',    reward: 'Módulo Alfa',     category: 'crate',     icon: Package,   color: 'text-zinc-400',   rarity: 'COMÚN' },
    { level: 14, type: 'premium', reward: 'Trueno Cyber',    category: 'effect',    icon: Lightning, color: 'text-yellow-400', rarity: 'ÉPICO' },
    { level: 15, type: 'free',    reward: 'Azul Ártico',     category: 'nameColor', icon: Palette,   color: 'text-cyan-400',   rarity: 'BÁSICO' },
    { level: 16, type: 'premium', reward: 'Gris Piedra',     category: 'nameColor', icon: Palette,   color: 'text-zinc-400',   rarity: 'BÁSICO' },
    { level: 17, type: 'free',    reward: 'Victoria 🏆',      category: 'emote',     icon: Smiley,    color: 'text-yellow-400', rarity: 'RARO' },
    { level: 18, type: 'premium', reward: 'MARCO MÍTICO',    category: 'frame',     icon: ImageSquare, color: 'text-red-500',  rarity: 'MÍTICO' },
    { level: 19, type: 'premium', reward: '50 NETS',         category: 'nets',      icon: Coins,     color: 'text-amber-400',  rarity: 'LEGENDARIO' },
    { level: 20, type: 'premium', reward: 'DIOS CHESSNET',   category: 'title',     icon: Trophy,    color: 'text-violet-500', rarity: 'MÍTICO' },
  ];

  let tiers = $derived(baseTiers.map(t => ({...t, claimed: claimedTiers.includes(t.level)})));

  let selectedTierLevel = $state(1);
  let selectedTier = $derived(tiers.find(t => t.level === selectedTierLevel) || tiers[0]);

  const baseDaily = [
    { id: 'daily-1', title: 'Mantén la Racha', description: 'Analiza 3 partidas hoy.', xp: 150, total: 3 },
    { id: 'daily-2', title: 'Táctico Experto', description: 'Resuelve 5 puzzles.', xp: 200, total: 5 },
    { id: 'daily-3', title: 'Expresivo', description: 'Usa 3 emotes en el feed.', xp: 100, total: 3 },
  ];



  const categoryLabels: Record<string, string> = {
    'nets': 'NETS',
    'crate': 'MÓDULO DE SUMINISTROS',
    'frame': 'MATRIZ DE AVATAR',
    'nameColor': 'ESPECTRO DE NOMBRE',
    'font': 'INTERFAZ_TIPOGRÁFICA',
    'effect': 'PROTOCOLO_VISUAL',
    'emote': 'REACCIÓN_HOLOGRÁFICA',
    'title': 'RANGO_DE_PRESTIGIO',
    'badge': 'INSIGNIA_SOCIAL'
  };

  const iconMap: Record<string, any> = {
    'nets': Coins,
    'crate': Package,
    'frame': ImageSquare,
    'nameColor': Palette,
    'font': TextT,
    'effect': Lightning,
    'emote': Smiley,
    'title': Trophy,
    'badge': Sparkle
  };

  const shopItems = baseShopItems.map(item => ({
    ...item,
    icon: iconMap[item.type] || Package
  }));
  


  let scrollContainer = $state<HTMLDivElement | null>(null);
  function scrollTimeline(dir: 'left' | 'right') {
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  }



  let collection = $derived($appStore.settings?.economy?.collection || {
    badges: [],
    emotes: [],
    fonts: [],
    colors: [],
    themes: [],
    frames: [],
    effects: []
  });

  let netsBalance = $derived($appStore.settings?.economy?.netsBalance || 0);
  let activeColor = $derived($appStore.settings?.economy?.activeColor || 'none');
  let activeFrame = $derived($appStore.settings?.economy?.activeFrame || 'none');
  let activeFont = $derived($appStore.settings?.economy?.activeFont || 'none');
  let activeBadge = $derived($appStore.settings?.economy?.activeBadge || 'none');

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



  let isOpeningCrate = $state(false);
  let showCrateResult = $state(false);
  let crateResult = $state<any>(null);
  let crateType = $state('');
  
  const possibleRewards = basePossibleRewards.map(r => ({
    ...r,
    icon: iconMap[r.type.toLowerCase()] || Package
  }));

  // Form Elements for programmatic submission
  let ctFormEl: HTMLFormElement;
  let buyFormEl: HTMLFormElement;
  let ccFormEl: HTMLFormElement;
  let eqFormEl: HTMLFormElement;
  let crateFormEl: HTMLFormElement;

  const handleClaimTier = async (tierId: number) => {
    $ctForm.tierId = tierId;
    await tick();
    ctFormEl.requestSubmit();
  };

  const handleBuyItem = async (item: any) => {
    $buyForm.itemId = item.id;
    await tick();
    buyFormEl.requestSubmit();
  };

  const handleClaimChallenge = async (challenge: any, type: 'daily' | 'weekly') => {
    $ccForm.challengeId = challenge.id;
    $ccForm.challengeType = type;
    await tick();
    ccFormEl.requestSubmit();
  };

  const handleEquipItem = async (type: 'color' | 'frame' | 'font' | 'badge' | 'emote', value: string) => {
    $eqForm.type = type;
    $eqForm.value = value;
    await tick();
    eqFormEl.requestSubmit();
  };

  const openCrate = async (type: 'basic' | 'premium' | 'legendary') => {
    $crateForm.crateType = type;
    
    isOpeningCrate = true;
    showCrateResult = false;
    crateType = type;
    
    // Start animation
    rouletteOffset = 0;
    setTimeout(() => {
      rouletteOffset = -((rouletteItems.length - 10) * 160);
    }, 100);

    await tick();
    crateFormEl.requestSubmit();
  };

  function closeCrate() {
    isOpeningCrate = false;
    showCrateResult = false;
    crateResult = null;
  }

  let rouletteOffset = $state(0);
</script>

<form method="POST" action="?/claimTier" use:enhanceCT bind:this={ctFormEl} class="hidden">
  <input type="hidden" name="tierId" bind:value={$ctForm.tierId} />
</form>

<form method="POST" action="?/buyItem" use:enhanceBuy bind:this={buyFormEl} class="hidden">
  <input type="hidden" name="itemId" bind:value={$buyForm.itemId} />
</form>

<form method="POST" action="?/claimChallenge" use:enhanceCC bind:this={ccFormEl} class="hidden">
  <input type="hidden" name="challengeId" bind:value={$ccForm.challengeId} />
  <input type="hidden" name="challengeType" bind:value={$ccForm.challengeType} />
</form>

<form method="POST" action="?/equipItem" use:enhanceEQ bind:this={eqFormEl} class="hidden">
  <input type="hidden" name="type" bind:value={$eqForm.type} />
  <input type="hidden" name="value" bind:value={$eqForm.value} />
</form>

<form method="POST" action="?/openCrate" use:enhanceCrate bind:this={crateFormEl} class="hidden">
  <input type="hidden" name="crateType" bind:value={$crateForm.crateType} />
</form>

<svelte:head>
  <title>Economía & Pase | ChessNet</title>
</svelte:head>

<div class="max-w-[1400px] mx-auto min-h-screen">
  <div class="sticky top-0 z-40 bg-[#080808]/90 backdrop-blur-xl border-b border-white/5 py-4 px-4 sm:px-8 mb-6" in:fade={{ duration: 300 }}>
    <div class="max-w-[1600px] mx-auto flex items-center justify-between">
      <div class="flex items-center gap-6">
        <h1 class="text-xl font-black text-white italic tracking-tighter uppercase">Nets</h1>
        
        <div class="hidden lg:flex items-center gap-4 border-l border-white/10 pl-6">
          <div class="flex flex-col">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Nivel de Cuenta</span>
              <span class="text-[9px] font-black text-violet-400">XP: {totalXp.toLocaleString()}</span>
            </div>
            <div class="w-48 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 relative group/xp">
              <div 
                class="h-full bg-gradient-to-r from-violet-600 via-violet-400 to-emerald-400 shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-1000 relative"
                style="width: {xpProgress}%"
              >
                <div class="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-center leading-none">
            <span class="text-[8px] font-black text-zinc-500 uppercase mb-0.5">Nivel</span>
            <span class="text-lg font-black text-white italic">{accountLevel}</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
          <div class="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-black flex items-center justify-center relative">
            {#if $user?.photoURL}
              <img src={$user.photoURL} alt="User" class="w-full h-full object-cover" />
            {:else}
              <UserCircle size={18} weight="bold" class="text-zinc-700" />
            {/if}
          </div>
          <div class="hidden sm:flex flex-col">
            <span class="text-[10px] font-black text-white truncate max-w-[80px]">{$user?.displayName || 'Usuario'}</span>
            <div class="flex items-center gap-1">
               <Coins size={10} weight="fill" class="text-amber-400" />
               <span class="text-[9px] font-mono text-amber-400 font-black">{netsBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

    <!-- Navigation Tabs -->
    <div class="px-4 sm:px-8 pb-3">
      <div class="flex items-center gap-1 sm:gap-2 p-1 bg-black/40 border border-white/5 relative overflow-hidden max-w-2xl mx-auto">
        {#each tabs as tab}
          <button
            onclick={() => currentTab = tab.id}
            class="flex-1 flex items-center justify-center gap-2.5 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all relative z-10 whitespace-nowrap
              {currentTab === tab.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}"
          >
            <tab.icon
              size={14}
              weight={currentTab === tab.id ? 'fill' : 'bold'}
              class="transition-colors {currentTab === tab.id ? 'text-violet-400' : 'text-zinc-600'}"
            />
            <span class="hidden xs:inline">{tab.label}</span>
            {#if currentTab === tab.id}
              <div class="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.6)]" in:fade></div>
            {/if}
          </button>
        {/each}
        
        <!-- Sliding Indicator Background -->
        <div 
          class="absolute inset-y-1 left-1 bg-white/5 border border-white/10 transition-all duration-300 ease-out z-0"
          style="width: calc((100% - 8px) / {tabs.length}); transform: translateX(calc({activeIndex} * 100%))"
        ></div>
      </div>
    </div>

  <div class="grid xl:grid-cols-4 gap-8 p-3 sm:p-4 lg:p-8">
    <div class="xl:col-span-3">
    {#if currentTab === 'crates'}
      <div in:fade={{ duration: 400 }}>
        <!-- Consolidated Header Card: User Stats & Active Quests -->
        <div class="mb-8 bg-zinc-900/40 backdrop-blur-md border border-white/5 relative overflow-hidden group">
          <!-- Animated Background Elements -->
          <div class="absolute inset-0 opacity-20">
            <div class="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-violet-500 to-transparent animate-[pulse_3s_infinite]"></div>
            <div class="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-emerald-500 to-transparent animate-[pulse_4s_infinite] delay-700"></div>
            <div class="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-violet-500 to-transparent animate-[pulse_3.5s_infinite] delay-300"></div>
          </div>

          <div class="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/5 relative z-10">
            <!-- Left: Call to Action -->
            <div class="p-8 lg:w-2/5 bg-gradient-to-br from-violet-500/10 to-transparent relative overflow-hidden">
               <div class="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                  <Target size={140} weight="fill" class="text-violet-500" />
               </div>
               <div class="relative z-10">
                 <div class="flex items-center gap-2 mb-4">
                   <span class="px-2 py-0.5 bg-violet-500/20 text-violet-400 border border-violet-500/30 text-[9px] font-black uppercase tracking-[0.3em]">Operación Génesis</span>
                   <span class="w-1 h-1 rounded-full bg-violet-500 animate-pulse"></span>
                   <span class="text-[9px] text-zinc-500 font-bold tracking-widest uppercase italic">Nivel {accountLevel}</span>
                 </div>
                 <h2 class="text-4xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">Tu Destino,<br/>Tu Estrategia.</h2>
                 <p class="text-[11px] text-zinc-400 leading-relaxed max-w-xs uppercase font-bold tracking-wider mb-6">Completa objetivos en el ecosistema para desbloquear tecnología exclusiva y rangos de prestigio.</p>
                 
                 <div class="flex items-center gap-6">
                    <div class="flex flex-col">
                       <span class="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">Nets Actuales</span>
                       <div class="flex items-center gap-2">
                          <Coins size={18} class="text-amber-400" weight="duotone" />
                          <span class="text-2xl font-black text-white italic">{netsBalance.toLocaleString()}</span>
                       </div>
                    </div>
                    <div class="w-px h-10 bg-white/10"></div>
                    <div class="flex flex-col">
                       <span class="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">Pase de Batalla</span>
                       <div class="flex items-center gap-2">
                          <Star size={18} class="text-violet-400" weight="duotone" />
                          <span class="text-2xl font-black text-white italic">{currentTier} <span class="text-xs text-zinc-500 not-italic">/ 20</span></span>
                       </div>
                    </div>
                 </div>
               </div>
            </div>

            <!-- Right: Active Quick Missions -->
            <div class="p-8 lg:flex-1 bg-zinc-950/20">
               <div class="flex justify-between items-center mb-6">
                 <h3 class="text-[11px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3 italic">
                    <Lightning size={18} weight="fill" class="text-emerald-500 animate-pulse" /> Protocolo de Actividad
                 </h3>
                 <span class="text-[9px] font-mono text-emerald-500/60 uppercase tracking-widest">Estado: En Curso</span>
               </div>

               <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {#each dailyChallengesDb.slice(0, 2) as challenge}
                    <div class="bg-black/40 border border-white/5 p-4 flex items-center justify-between group/m transition-all hover:border-emerald-500/30">
                       <div class="flex items-center gap-4">
                          <div class="w-10 h-10 bg-zinc-900 border border-white/10 flex items-center justify-center relative">
                             <Target size={20} class="text-zinc-600 group-hover/m:text-emerald-500 transition-colors" />
                             {#if challenge.completed}
                               <div class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center">
                                 <Check size={8} weight="bold" class="text-black" />
                               </div>
                             {/if}
                          </div>
                          <div>
                             <div class="text-[10px] font-black text-white uppercase tracking-widest mb-0.5">{challenge.title}</div>
                             <div class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-none">{challenge.description}</div>
                          </div>
                       </div>
                       <div class="text-right">
                          <div class="text-[10px] font-mono {challenge.completed ? 'text-emerald-500' : 'text-zinc-500'}">{challenge.progress} / {challenge.target}</div>
                          {#if challenge.completed && !challenge.claimed}
                            <div class="text-[8px] font-black text-emerald-500 uppercase italic mt-1">Listo</div>
                          {/if}
                       </div>
                    </div>
                  {/each}
                  <button 
                    onclick={() => currentTab = 'battlepass'}
                    class="bg-emerald-500/5 border border-emerald-500/20 p-4 flex items-center justify-center gap-3 group/b hover:bg-emerald-500/10 transition-all cursor-pointer"
                  >
                     <span class="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">Ver Todos los Retos</span>
                     <ArrowRight size={14} class="text-emerald-500 group-hover/b:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          </div>
        </div>

        <!-- Protocolo de Suministros (Crates Section) -->
        <div class="space-y-8">
          <div class="p-1 w-full bg-zinc-900 border border-white/5 relative overflow-hidden group">
             <!-- Header info -->
             <div class="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-950/50">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 bg-violet-500/10 flex items-center justify-center text-violet-500 border border-violet-500/20 perspective-1000">
                      <Package size={28} weight="duotone" class="float-animation" />
                   </div>
                   <div>
                      <h2 class="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Módulos de Suministros</h2>
                      <p class="text-[9px] text-zinc-600 font-bold tracking-[0.2em] uppercase mt-1">Nivel de Acceso: {accountLevel >= 10 ? 'ALTO' : 'ESTÁNDAR'}</p>
                   </div>
                </div>
                <div class="hidden sm:flex items-center gap-8 text-right">
                   <div>
                      <div class="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Cajas Abiertas</div>
                      <div class="text-xl font-black text-white italic">12</div>
                   </div>
                   <div class="w-px h-8 bg-white/5"></div>
                   <div>
                      <div class="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Items Únicos</div>
                      <div class="text-xl font-black text-emerald-500 italic">42</div>
                   </div>
                </div>
             </div>

             <div class="p-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {#each [
                     { id: 'daily',   label: 'Caja Diaria',   price: 0,    rarity: 'Infrecuente', icon: Package,  color: 'text-emerald-500', glow: 'emerald', desc: 'Suministro estándar para usuarios activos.' },
                     { id: 'weekly',  label: 'Caja Semanal',  price: 500,  rarity: 'Épico',       icon: Package,  color: 'text-blue-500',    glow: 'blue',    desc: 'Mayor probabilidad de componentes raros.' },
                     { id: 'monthly', label: 'Caja Maestra',  price: 2500, rarity: 'Mítico',      icon: Package,  color: 'text-amber-500',   glow: 'amber',   desc: 'Contiene el hardware más premium del nexo.' }
                   ] as crate}
                     <div class="bg-black/60 border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all flex flex-col">
                        <!-- Rarity Header -->
                        <div class="px-4 py-2 bg-white/5 flex justify-between items-center">
                           <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{crate.rarity}</span>
                           <div class="flex gap-1">
                              <div class="w-1 h-1 rounded-full bg-{crate.glow}-500"></div>
                              <div class="w-1 h-1 rounded-full bg-{crate.glow}-500/30"></div>
                           </div>
                        </div>

                        <div class="p-8 flex flex-col items-center flex-1">
                           <div class="w-32 h-32 mb-8 relative flex items-center justify-center">
                              <div class="absolute inset-0 bg-{crate.glow}-500/5 blur-3xl group-hover:blur-[60px] transition-all duration-1000"></div>
                              <crate.icon size={80} weight="duotone" class="{crate.color} relative z-10 group-hover:scale-110 transition-transform duration-700 float-animation" />
                           </div>
                           
                           <div class="text-center mb-6">
                              <h3 class="text-xl font-black text-white italic uppercase tracking-tighter mb-2">{crate.label}</h3>
                              <p class="text-[10px] text-zinc-500 font-medium uppercase tracking-wider leading-relaxed px-4">{crate.desc}</p>
                           </div>

                           <div class="w-full pt-6 border-t border-white/5 mt-auto">
                             <button
                               onclick={() => openCrate(crate)}
                               disabled={netsBalance < crate.price}
                               class="w-full py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-{crate.glow}-500 hover:text-white transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-2 group/btn"
                             >
                               {#if crate.price === 0}
                                 ABRIR GRATIS
                               {:else}
                                 <div class="flex items-center justify-center gap-2">
                                   <Coins size={14} weight="fill" />
                                   {crate.price.toLocaleString()} NETS
                                 </div>
                               {/if}
                               <ArrowRight size={14} class="group-hover/btn:translate-x-1 transition-transform" />
                             </button>
                           </div>
                        </div>
                     </div>
                   {/each}
                </div>
             </div>
          </div>
        </div>
      </div>

    {:else if currentTab === 'battlepass'}
      <div class="flex flex-col gap-8" in:fade={{ duration: 400 }}>
        <!-- Battle Pass Main Stage -->
        <div class="bg-zinc-900 border border-white/5 relative overflow-hidden flex flex-col min-h-[550px] shadow-2xl">
          <!-- Ambient Background Glow -->
          <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full"></div>
            <div class="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] {selectedTier.color.replace('text-', 'bg-')}/5 blur-[120px] rounded-full"></div>
          </div>

          <!-- Top HUD -->
          <div class="absolute top-0 left-0 right-0 p-8 flex justify-between items-start z-20">
            <div class="space-y-1">
              <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase tracking-[0.3em] inline-flex items-center gap-2">
                <div class="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                TEMPORADA 01: GENESIS
              </span>
              <div class="flex items-center gap-3 mt-2">
                <Clock size={14} class="text-zinc-500" />
                <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Finaliza en {seasonTimeLeft}</span>
              </div>
            </div>

            <div class="flex flex-col items-end">
              <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Tu Progreso</span>
              <div class="flex items-center gap-3 bg-black/40 border border-white/5 px-4 py-2">
                <div class="text-right leading-none">
                  <span class="block text-[8px] font-black text-zinc-600 uppercase">TIER</span>
                  <span class="text-lg font-black text-white italic">{season.currentTier}</span>
                </div>
                <div class="w-px h-6 bg-white/10"></div>
                <div class="text-[10px] font-mono text-zinc-400">{currentXp.toLocaleString()} <span class="text-zinc-700">/ {XP_PER_TIER.toLocaleString()} XP</span></div>
              </div>
            </div>
          </div>

          <!-- Reward Spotlight -->
          <div class="flex-1 flex flex-col items-center justify-center relative z-10 p-6 pt-32 pb-32">
            <div class="w-64 h-64 flex items-center justify-center relative group float-animation">
              <div class="absolute inset-0 bg-white/5 rounded-full scale-150 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div class="absolute inset-4 bg-scanlines opacity-5 rounded-full pointer-events-none z-20"></div>

              <selectedTier.icon 
                size={160} 
                weight="duotone" 
                class="{selectedTier.color} drop-shadow-[0_0_60px_currentColor] transition-transform duration-700 group-hover:scale-110" 
              />
            </div>

            <div class="text-center space-y-4 max-w-md mt-8">
              <div class="flex flex-col items-center gap-1">
                <span class="text-[10px] font-black uppercase tracking-[0.4em] {selectedTier.color}">✦ {selectedTier.rarity} {categoryLabels[selectedTier.category] || 'RECOMPENSA'}</span>
                <h2 class="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter italic drop-shadow-2xl">{selectedTier.reward}</h2>
              </div>
              
              <div class="pt-8 flex items-center justify-center gap-4">
                {#if selectedTier.claimed}
                  <div class="px-10 py-4 bg-zinc-900 border border-emerald-500/30 text-emerald-400 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                    <CheckCircle size={18} weight="fill" /> RECLAMADO
                  </div>
                {:else if selectedTier.level <= season.currentTier}
                   <button 
                    onclick={() => handleClaimTier(selectedTier)}
                    class="px-12 py-5 bg-emerald-500 text-black text-[12px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] relative overflow-hidden group/claim"
                   >
                     <span class="relative z-10">RECLAMAR RECOMPENSA</span>
                     <div class="absolute inset-0 bg-white opacity-0 group-hover/claim:opacity-20 transition-opacity"></div>
                   </button>
                {:else}
                  <div class="flex flex-col items-center gap-4">
                    <div class="px-8 py-3 bg-zinc-950/80 border border-white/5 text-white/30 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                       <LockKey size={16} /> DESBLOQUEA AL NIVEL {selectedTier.level}
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          </div>

          <!-- Tier Navigator -->
          <div class="absolute bottom-0 left-0 right-0 h-32 bg-black/80 backdrop-blur-xl border-t border-white/5 flex items-center z-20">
             <button onclick={() => scrollTimeline('left')} class="w-16 h-full text-zinc-600 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center border-r border-white/5">
               <CaretLeft size={32} weight="bold" />
             </button>
             
             <div bind:this={scrollContainer} class="flex-1 flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth px-8 py-4">
                {#each tiers as tier}
                  <button 
                    onclick={() => selectedTierLevel = tier.level} 
                    class="relative shrink-0 flex flex-col items-center gap-3 transition-all duration-500 {selectedTierLevel === tier.level ? 'scale-110 z-10' : 'opacity-30 hover:opacity-100'}"
                  >
                    <div class="w-16 h-16 border-2 flex items-center justify-center transition-all duration-500 relative
                      {selectedTierLevel === tier.level ? `border-current ${tier.color} bg-white/10 shadow-[0_0_20px_currentColor]` : 'border-white/5 bg-zinc-950 hover:border-white/20'}">
                      
                      <tier.icon size={28} weight={tier.claimed ? "fill" : "duotone"} class={tier.claimed ? "text-emerald-400" : "text-zinc-500"} />
                      
                      {#if tier.claimed}
                        <div class="absolute -top-2 -right-2 bg-emerald-500 text-black rounded-full p-1 border-2 border-black shadow-lg">
                          <Check size={10} weight="bold" />
                        </div>
                      {/if}

                      {#if tier.level > season.currentTier}
                        <div class="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                          <LockKey size={14} class="text-zinc-600" />
                        </div>
                      {/if}
                    </div>
                    <span class="text-[10px] font-black {selectedTierLevel === tier.level ? 'text-white' : 'text-zinc-700'}">Lvl {tier.level}</span>
                  </button>
                {/each}
             </div>
             
             <button onclick={() => scrollTimeline('right')} class="w-16 h-full text-zinc-600 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center border-l border-white/5">
               <CaretRight size={32} weight="bold" />
             </button>
          </div>
        </div>
      </div>

    {:else if currentTab === 'collection'}
      <div in:fade={{ duration: 400 }} class="space-y-12">
        <div class="flex items-end justify-between px-1">
          <h3 class="text-xs font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
            <Smiley size={18} class="text-emerald-500" /> Mi Colección
          </h3>
          <span class="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
            {collection.emotes?.length || 0} GESTOS DESBLOQUEADOS
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
          {#each (collection.emotes || []) as emote}
            <div class="aspect-square bg-zinc-900 border border-white/5 p-6 flex flex-col items-center justify-center gap-4 group hover:border-emerald-500/30 transition-all relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Smiley size={48} weight="duotone" class="text-zinc-500 group-hover:text-emerald-400 transition-colors group-hover:scale-110 duration-500" />
              <span class="text-[10px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-white transition-colors text-center">{emote}</span>
            </div>
          {/each}
          
          {#if (collection.emotes?.length || 0) === 0}
            {#each Array(6) as _, i}
              <div class="aspect-square bg-zinc-900/50 border border-dashed border-white/5 flex items-center justify-center opacity-20">
                <LockKey size={24} class="text-zinc-800" />
              </div>
            {/each}
          {/if}
        </div>
      </div>

    {:else if currentTab === 'loadout'}
      <div in:fade={{ duration: 400 }} class="space-y-12">
        <!-- Personalization Header with Preview -->
        <div class="bg-zinc-900 border border-white/5 p-10 relative overflow-hidden">
          <div class="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12">
            <PaintBrush size={180} weight="fill" />
          </div>
          
          <div class="flex flex-col lg:flex-row gap-16 items-center">
            <!-- Identity Preview (THE WOW COMPONENT) -->
            <div class="w-full lg:w-2/5 flex flex-col items-center gap-8">
              <div class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                VISUALIZADOR DE IDENTIDAD
              </div>
              
              <div class="w-full bg-black/80 border border-white/5 p-10 rounded-sm shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group border-b-emerald-500/30">
                <div class="absolute inset-0 bg-scanlines opacity-10 pointer-events-none"></div>
                <div class="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-blue-500/5 opacity-50"></div>
                
                <div class="flex items-center gap-6 relative z-10">
                  <div class="w-20 h-20 bg-zinc-900 relative flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform duration-700">
                    {#if $user?.photoURL}
                      <img src={$user.photoURL} alt="Avatar" class="w-full h-full object-cover" />
                    {:else}
                      <UserCircle size={40} weight="bold" class="text-zinc-800" />
                    {/if}
                    {#if activeFrame !== 'none'}
                      <div class="absolute inset-0 border-[4px] pointer-events-none {frameStyles[activeFrame] || ''}"></div>
                    {/if}
                  </div>
                  
                  <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-3">
                      {#if activeBadge !== 'none'}
                        <div class="p-1 bg-white/5 border border-white/10 rounded-sm">
                           <Badge size={16} weight="fill" class="text-emerald-500" />
                        </div>
                      {/if}
                      <span class="text-2xl font-black italic uppercase tracking-tighter {nameColorStyles[activeColor] || 'text-white'} {nameFontStyles[activeFont] || ''}">
                        {$user?.displayName || 'Usuario'}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                       <span class="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Módulo de Chat Activo</span>
                    </div>
                  </div>
                </div>

                <div class="mt-8 pt-8 border-t border-white/5 flex gap-4">
                   <div class="px-3 py-1 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest italic animate-pulse">COMPLETADO</div>
                   <div class="px-3 py-1 bg-emerald-500/5 text-[9px] font-black text-emerald-500/40 uppercase tracking-widest border border-emerald-500/10">SYNC_OK</div>
                </div>
              </div>
              </div>
            </div>

            <!-- Selection Controls -->
            <div class="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Marcos -->
              <div class="space-y-4">
                <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <ImageSquare size={16} /> Marco de Avatar
                </label>
                <div class="grid grid-cols-4 gap-2">
                  <button 
                    onclick={() => handleEquipItem('frame', 'none')}
                    aria-label="Quitar marco"
                    class="aspect-square bg-zinc-800 border {activeFrame === 'none' ? 'border-white' : 'border-white/5'} transition-all flex items-center justify-center opacity-50 hover:opacity-100"
                  >
                    <div class="w-6 h-6 border-2 border-dashed border-zinc-600"></div>
                  </button>
                  {#each (collection.frames || []) as frame}
                    <button 
                      onclick={() => handleEquipItem('frame', frame)}
                      class="aspect-square bg-zinc-950 border transition-all relative overflow-hidden group {activeFrame === frame ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'border-white/5 hover:border-white/20'}"
                    >
                      <div class="absolute inset-0 border-[2px] {frameStyles[frame]} opacity-40"></div>
                      {#if activeFrame === frame}
                        <div class="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                          <Check size={16} weight="bold" class="text-emerald-500" />
                        </div>
                      {/if}
                    </button>
                  {/each}
                </div>
              </div>

              <!-- Colores -->
              <div class="space-y-4">
                <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Palette size={16} /> Color de Nombre
                </label>
                <div class="grid grid-cols-4 gap-2">
                  <button 
                    onclick={() => handleEquipItem('color', 'default')}
                    aria-label="Color predeterminado"
                    class="aspect-square bg-zinc-800 border {activeColor === 'default' ? 'border-white' : 'border-white/5'} transition-all flex items-center justify-center"
                  >
                    <div class="w-6 h-6 bg-white rounded-full"></div>
                  </button>
                  {#each (collection.colors || []) as color}
                    <button 
                      onclick={() => handleEquipItem('color', color)}
                      class="aspect-square bg-zinc-950 border transition-all relative group flex items-center justify-center {activeColor === color ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'border-white/5 hover:border-white/20'}"
                    >
                      <div class="w-8 h-8 rounded-full" style="background-color: {color === 'Esmeralda' ? '#10b981' : color === 'Oro Puro' ? '#fbbf24' : color === 'Violeta Neón' ? '#8b5cf6' : '#fff'}"></div>
                      {#if activeColor === color}
                        <div class="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Check size={16} weight="bold" class="text-white" />
                        </div>
                      {/if}
                    </button>
                  {/each}
                </div>
              </div>

              <!-- Tipografía -->
              <div class="space-y-4">
                <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <TextT size={16} /> Estilo de Texto
                </label>
                <div class="space-y-2">
                  <button 
                    onclick={() => handleEquipItem('font', 'none')}
                    class="w-full py-3 px-4 bg-zinc-800 border {activeFont === 'none' ? 'border-white' : 'border-white/5'} text-[10px] font-black uppercase text-left tracking-widest transition-all"
                  >
                    Predeterminado
                  </button>
                  {#each (collection.fonts || []) as font}
                    <button 
                      onclick={() => handleEquipItem('font', font)}
                      class="w-full py-3 px-4 bg-zinc-950 border transition-all text-left group flex justify-between items-center {activeFont === font ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/5 hover:border-white/10'}"
                    >
                      <span class="text-sm font-black uppercase {nameFontStyles[font]}">{font}</span>
                      {#if activeFont === font}
                        <Check size={14} weight="bold" class="text-emerald-500" />
                      {/if}
                    </button>
                  {/each}
                </div>
              </div>

              <!-- Insignias -->
              <div class="space-y-4">
                <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Star size={16} /> Insignia de Perfil
                </label>
                <div class="grid grid-cols-4 gap-2">
                  <button 
                    onclick={() => handleEquipItem('badge', 'none')}
                    aria-label="Quitar insignia"
                    class="aspect-square bg-zinc-800 border {activeBadge === 'none' ? 'border-white' : 'border-white/5'} transition-all flex items-center justify-center opacity-50 hover:opacity-100"
                  >
                    <LockKey size={16} />
                  </button>
                  {#each (collection.badges || []) as badge}
                    <button 
                      onclick={() => handleEquipItem('badge', badge)}
                      class="aspect-square bg-zinc-950 border transition-all relative flex items-center justify-center group {activeBadge === badge ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/5 hover:border-white/20'}"
                    >
                      <Badge size={24} weight="fill" class="text-emerald-500" />
                      {#if activeBadge === badge}
                        <div class="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-black flex items-center justify-center rounded-full border-2 border-black">
                           <Check size={10} weight="bold" />
                        </div>
                      {/if}
                    </button>
                  {/each}
                </div>
              </div>
            </div>
          </div>
        </div>

    {:else if currentTab === 'shop'}
      <div in:fade={{ duration: 400 }} class="space-y-8">
        <!-- Featured Shop Card -->
        <div class="bg-gradient-to-br from-violet-600/20 to-transparent border border-violet-500/30 p-10 relative overflow-hidden group shadow-2xl">
          <div class="absolute top-0 right-0 p-10 opacity-10 rotate-12 group-hover:rotate-[20deg] transition-transform duration-700">
            <Lightning size={200} weight="fill" class="text-violet-500" />
          </div>
          <div class="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div class="w-56 h-56 bg-zinc-900 border border-white/5 flex items-center justify-center relative rotate-3 group-hover:rotate-0 transition-transform duration-500">
               <div class="absolute inset-0 bg-violet-500/20 blur-3xl rounded-full scale-125 animate-pulse"></div>
               <Rocket size={100} weight="duotone" class="text-violet-400 relative z-10" />
            </div>
            <div class="flex-1 text-center md:text-left space-y-4">
               <span class="px-3 py-1 bg-violet-500/20 text-violet-400 border border-violet-500/30 text-[10px] font-black uppercase tracking-[0.3em] inline-block">Novedad Estacional</span>
               <h2 class="text-5xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg">Protocolo Trueno</h2>
               <p class="text-zinc-500 max-w-lg text-sm">Desbloquea el set visual completo de la temporada Génesis. Incluye marco animado, efecto de trueno y gesticulador legendario.</p>
               <button class="px-12 py-5 bg-white text-black text-[12px] font-black uppercase tracking-[0.2em] hover:bg-violet-500 hover:text-white transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                 COMPRAR PACK // 12.500 NETS
               </button>
            </div>
          </div>
        </div>

        <!-- Shop Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each shopItems as item}
            {@const style = RARITY_STYLES[item.rarity] || RARITY_STYLES['Común']}
            <div class="bg-zinc-950 border {style.border} p-8 group transition-all relative overflow-hidden flex flex-col h-full scanline">
              <div class="absolute inset-0 {style.bg} opacity-5"></div>
              <div class="flex justify-between items-start relative z-10 mb-8">
                <span class="text-[9px] font-black uppercase tracking-widest px-2 py-1 {style.color} border {style.border}">{item.rarity}</span>
                <div class="flex items-center gap-2 text-amber-500 font-black text-xs bg-amber-500/5 px-2 py-1">
                   <Coins size={14} weight="fill" />
                   {item.price.toLocaleString()}
                </div>
              </div>

              <div class="flex-1 flex items-center justify-center mb-10 relative z-10">
                 <div class="absolute inset-0 blur-3xl opacity-20" style="background: radial-gradient(circle, {style.glow} 0%, transparent 70%)"></div>
                 <item.icon size={80} weight="duotone" class="{style.color} transition-transform duration-700 group-hover:scale-110" />
              </div>

              <div class="relative z-10 text-center sm:text-left">
                <h4 class="text-lg font-black text-white uppercase italic tracking-tighter mb-2">{item.name}</h4>
                <p class="text-xs text-zinc-600 font-medium leading-relaxed mb-8">{item.desc}</p>
                <button
                  onclick={() => handleBuyItem(item)}
                  disabled={netsBalance < item.price}
                  class="w-full py-4 border {style.border} {style.color} text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black hover:border-white transition-all disabled:opacity-30 disabled:grayscale"
                >
                  {#if netsBalance < item.price}
                    BLOQUEADO
                  {:else}
                    ADQUIRIR
                  {/if}
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    </div>


  <!-- Sidebar: Challenges & Streaks -->
  <div class="xl:col-span-1 order-1 xl:order-2 space-y-8">
    <!-- Premium Profile Card -->
    <div class="bg-zinc-900 border border-white/5 p-8 relative overflow-hidden group shadow-2xl">
      <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
      
      <div class="flex items-center gap-5 mb-8">
        <div class="relative shrink-0">
          <div class="w-16 h-16 bg-black border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
            {#if $user?.photoURL}
              <img src={$user.photoURL} alt="Avatar" class="w-full h-full object-cover" />
            {:else}
              <UserCircle size={32} weight="fill" class="text-zinc-800" />
            {/if}
            {#if activeFrame !== 'none'}
              <div class="absolute inset-0 border-[3px] pointer-events-none {frameStyles[activeFrame] || ''}"></div>
            {/if}
          </div>
          <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-500 text-white flex items-center justify-center font-black text-[10px] italic border-2 border-black">
            {accountLevel}
          </div>
        </div>
        
        <div class="overflow-hidden">
          <div class="flex items-center gap-2 mb-1">
             {#if activeBadge !== 'none'}
               <Badge size={14} weight="fill" class="text-violet-500" />
             {/if}
             <h4 class="text-sm font-black text-white uppercase italic tracking-tighter truncate {nameColorStyles[activeColor] || 'text-white'} {nameFontStyles[activeFont] || ''}">
               {$user?.displayName || 'USUARIO'}
             </h4>
          </div>
          <div class="flex items-center gap-2">
             <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Season Rank #{((season?.currentTier || 1) * 123) % 1000}</span>
             <span class="w-1 h-1 rounded-full bg-zinc-800"></span>
             <span class="text-[9px] font-mono text-violet-500/80 uppercase">Online</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 mt-8">
        <div class="p-3 bg-black/40 border border-white/5 flex flex-col items-center group/col hover:border-blue-500/20 transition-all">
          <span class="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Colección</span>
          <div class="flex items-center gap-2">
            <Cube size={14} weight="fill" class="text-blue-400" />
            <span class="text-xs font-mono text-white font-black">
              {(collection.emotes?.length || 0) + (collection.frames?.length || 0) + (collection.colors?.length || 0)}
            </span>
          </div>
        </div>
        <div class="p-3 bg-black/40 border border-white/5 flex flex-col items-center group/col hover:border-violet-500/20 transition-all">
          <span class="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Estatus</span>
          <div class="flex items-center gap-2">
            <Star size={14} weight="fill" class="text-violet-400" />
            <span class="text-xs font-mono text-white font-black">{currentTier}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Daily Streak -->
    <div class="bg-zinc-900 border border-white/5 p-6 shadow-xl relative overflow-hidden group">
       <div class="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Flame size={80} weight="fill" class="text-orange-500" />
       </div>
       <div class="flex justify-between items-center mb-4">
          <h4 class="text-[9px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 relative z-10">
             <Flame size={16} weight="fill" class="text-orange-500 animate-pulse" /> Racha Semanal
          </h4>
          <span class="text-[9px] font-mono text-orange-500 font-bold">DIA 3</span>
       </div>
       <div class="flex gap-1.5 relative z-10">
          {#each Array(7) as _, i}
            <div class="flex-1 h-1.5 bg-black border border-white/5 relative overflow-hidden">
               {#if i < 3}
                 <div class="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.4)]"></div>
               {/if}
            </div>
          {/each}
       </div>
       <p class="text-[8px] text-zinc-600 mt-4 font-bold tracking-widest uppercase leading-relaxed relative z-10">
          Próxima recompensa: <span class="text-orange-400">+100 NETS</span> en 2 días.
       </p>
    </div>


    <!-- Challenges Section -->
    <div class="space-y-4">
      <div class="flex justify-between items-end px-1">
        <h4 class="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
          <Target size={20} class="text-emerald-500" /> Objetivos
        </h4>
        <span class="text-[9px] font-mono text-zinc-700 tracking-widest uppercase">{dailyTimeLeft} RESTANTE</span>
      </div>

      <div class="space-y-3">
        {#each dailyChallengesDb as challenge}
          <div class="bg-zinc-900 border border-white/5 p-5 group hover:border-emerald-500/30 transition-all relative overflow-hidden">
             {#if challenge.claimed}
               <div class="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                 <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                   <Check size={14} weight="bold" /> COMPLETADO
                 </span>
               </div>
             {/if}

             <div class="flex justify-between items-start mb-4 relative z-10">
               <div class="flex-1">
                 <h5 class="text-[11px] font-black text-zinc-300 uppercase tracking-widest group-hover:text-white transition-colors leading-tight">{challenge.title}</h5>
                 <p class="text-[9px] text-zinc-600 mt-1 font-bold">{challenge.description}</p>
               </div>
               <div class="text-[11px] font-black text-emerald-500">+{challenge.rewardXp} XP</div>
             </div>

             <div class="h-1 bg-black w-full overflow-hidden relative rounded-full">
               <div class="absolute inset-y-0 left-0 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" style="width: {(challenge.progress / challenge.target) * 100}%"></div>
             </div>
             
             <div class="flex justify-between mt-3 relative z-10">
               <span class="text-[9px] font-mono text-zinc-700 font-bold tracking-widest">{challenge.progress} / {challenge.target}</span>
               {#if challenge.completed && !challenge.claimed}
                 <button 
                  onclick={() => handleClaimChallenge(challenge, 'daily')}
                  class="text-[9px] font-black text-primary-500 uppercase tracking-widest hover:text-white transition-colors"
                 >
                   RECLAMAR RECOMPENSA
                 </button>
               {/if}
             </div>
          </div>
        {/each}
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

  :global(body) {
    background-color: #050505;
    background-image: 
      radial-gradient(at 50% 0%, rgba(16, 185, 129, 0.03) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.02) 0px, transparent 50%);
  }

  /* Scanline effect for shop items */
  .bg-scanlines {
    background: linear-gradient(
      rgba(18, 16, 16, 0) 50%,
      rgba(0, 0, 0, 0.2) 50%
    );
    background-size: 100% 4px;
  }

  .perspective-1000 {
    perspective: 1000px;
  }

  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  @keyframes electricPulse {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); filter: brightness(1); }
    30% { transform: scale(1.02); box-shadow: 0 0 40px 20px rgba(16, 185, 129, 0.3); filter: brightness(1.5); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); filter: brightness(1); }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .float-animation {
    animation: floating 4s ease-in-out infinite;
  }

  @keyframes floating {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
  }
</style>
