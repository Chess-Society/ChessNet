<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  import { Trophy, ChartBar, Clock, CheckCircle, XCircle, HandPointing, Globe, ArrowsLeftRight, Warning, SealCheck, ShieldCheckered, PencilSimple } from 'phosphor-svelte';
  import { onMount } from 'svelte';
  import { collection, query, where, onSnapshot } from 'firebase/firestore';
  import { db } from '$lib/firebase';
  import { user as authUser } from '$lib/stores/auth';
  import { appStore } from '$lib/stores/appStore';
  import { toast } from '$lib/stores/toast';
  import { predictionApi } from '$lib/api/predictions';
  import type { PredictionMarket, PredictionBet } from '$lib/types/governance';

  interface Props {
    market: PredictionMarket;
    onEdit?: (m: PredictionMarket) => void;
  }

  let { market, onEdit }: Props = $props();
  const isEconomyEnabled = $derived($appStore.schools?.[0]?.economyEnabled !== false);
  const isDirector = $derived($appStore.settings?.role === 'director' || $appStore.settings?.role === 'admin');

  let isBetting = $state(false);
  let isSelling = $state(false);
  let isDisputing = $state(false);
  let loadingOracle = $state(false);
  let userPositions = $state<PredictionBet[]>([]);
  let betAmount = $state(10); 

  const isExpired = $derived(market?.endDate ? new Date(market.endDate) < new Date() : false);
  const isResolved = $derived(market ? market.status === 'RESOLVED' : false);
  const isPending = $derived(market ? market.status === 'PENDING' : false);
  const isDisputed = $derived(market ? market.status === 'DISPUTED' : false);
  const totalPool = $derived(market ? market.totalPool || 0 : 0);

  const yesOption = $derived(market?.options ? (market.options.find(o => o.text?.toUpperCase() === 'SÍ' || o.id === 'yes') || market.options[0]) : null);
  const noOption = $derived(market?.options ? (market.options.find(o => o.text?.toUpperCase() === 'NO' || o.id === 'no') || market.options[1]) : null);

  const yesPrice = $derived(totalPool > 0 && yesOption ? (yesOption.totalStaked || 1) / totalPool : 0.5);
  const noPrice = $derived(1 - yesPrice);
  const yesPercent = $derived(Math.round(yesPrice * 100));
  const noPercent = $derived(100 - yesPercent);

  const userYesPosition = $derived(userPositions.find(p => p.optionId === yesOption?.id));
  const userNoPosition = $derived(userPositions.find(p => p.optionId === noOption?.id));

  onMount(() => {
    if (!$authUser?.uid || !market?.id) return;
    const q = query(collection(db, "prediction_bets"), where("marketId", "==", market.id), where("userId", "==", $authUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      userPositions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PredictionBet));
    });
    return unsubscribe;
  });

  const timeLeft = $derived(() => {
    if (!market?.endDate) return '...';
    try {
      const end = new Date(market.endDate).getTime();
      const now = new Date().getTime();
      const diff = end - now;
      if (diff <= 0) return 'Cerrado';
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } catch (e) { return '---'; }
  });

  async function handleBet(optionId: string | undefined) {
    if (!$authUser?.uid || !market?.id || !optionId || isBetting || isExpired || isResolved || isPending || isDisputed) return;
    if ($authUser.uid === market?.creatorId) {
      toast.error("Como creador, no puedes participar.");
      return;
    }
    isBetting = true;
    try {
      await predictionApi.placeBet($authUser.uid, market.id, optionId, betAmount);
      toast.success(`¡Posición abierta!`);
    } catch (e: any) {
      toast.error(e.message || "Error al comprar");
    } finally { isBetting = false; }
  }

  async function handleSell(optionId: string | undefined, shares: number) {
    if (!$authUser?.uid || !market?.id || !optionId || isSelling || isExpired || isResolved || isPending || isDisputed) return;
    isSelling = true;
    try {
      await predictionApi.sellPosition($authUser.uid, market.id, optionId, shares);
      toast.success("Posición cerrada.");
    } catch (e: any) {
      toast.error(e.message || "Error al vender");
    } finally { isSelling = false; }
  }

  async function proposeResolution(optionId: string | undefined) {
    if (!isDirector || !market?.id || !optionId) return;
    loadingOracle = true;
    try {
      await predictionApi.proposeResolution(market.id, optionId);
      toast.success("Resolución propuesta. Fase de disputa iniciada.");
    } catch (e: any) { toast.error(e.message || "Error al proponer"); }
    finally { loadingOracle = false; }
  }

  async function handleDispute() {
    if (!$authUser?.uid || !market?.id || isDisputing) return;
    isDisputing = true;
    try {
      await predictionApi.disputeMarket($authUser.uid, market.id);
      toast.warning("Hito disputado. Un administrador revisará el caso.");
    } catch (e: any) { toast.error(e.message || "Error al disputar"); }
    finally { isDisputing = false; }
  }

  async function finalizeMarket(optionId: string | undefined) {
    if (!isDirector || !market?.id || !optionId) return;
    loadingOracle = true;
    try {
      await predictionApi.finalizeMarket(market.id, optionId);
      toast.success("Hito finalizado y liquidado.");
    } catch (e: any) { toast.error(e.message || "Error al finalizar"); }
    finally { loadingOracle = false; }
  }

  async function handleOracleConsult() {
    if (!market?.oracleConfig?.externalId || market?.oracleConfig?.validationSource !== 'LICHESS_API') return;
    loadingOracle = true;
    try {
      const response = await fetch(`https://lichess.org/api/tournament/${market.oracleConfig.externalId}`);
      const data = await response.json();
      if (data.isFinished) toast.success("Oráculo: Torneo Finalizado.");
      else toast.info("Torneo en curso...");
    } catch (e: any) { toast.error("Error: " + e.message); }
    finally { loadingOracle = false; }
  }
</script>

<div class="prediction-card pro-card p-6 mb-6" class:resolved={isResolved} class:pending={isPending} class:disputed={isDisputed} transition:fade>
  <div class="flex items-start justify-between mb-4">
    <div class="flex items-center gap-3">
      <div class="p-2 {isDisputed ? 'bg-red-500/10 text-red-500' : isPending ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-500/10 text-amber-500'} border border-current opacity-80">
        {#if isDisputed} <Warning size={20} weight="bold" />
        {:else if isPending} <SealCheck size={20} weight="bold" />
        {:else} <Trophy size={20} weight="bold" /> {/if}
      </div>
      <div>
        <h4 class="text-[11px] font-black text-white uppercase tracking-widest">Hito de Gobernanza</h4>
        <div class="flex items-center gap-2 mt-1">
          <Clock size={12} class="text-zinc-600" />
          <span class="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
            {#if isResolved} Resuelto
            {:else if isDisputed} EN DISPUTA
            {:else if isPending} Resolución Pendiente
            {:else} Cierra en: {timeLeft()} {/if}
          </span>
        </div>
      </div>
    </div>
    
    <div class="flex items-center gap-2">
      {#if isDirector && !isResolved}
        <button 
          onclick={() => onEdit?.(market)}
          class="p-1.5 hover:bg-white/5 text-zinc-600 hover:text-white transition-all border border-transparent hover:border-white/10"
          title="Editar Hito"
        >
          <PencilSimple size={14} weight="bold" />
        </button>
      {/if}
      {#if isResolved}
        <div class="px-2 py-1 bg-white text-black text-[9px] font-black uppercase tracking-widest">Resuelto</div>
      {:else if isDisputed}
        <div class="px-2 py-1 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest animate-pulse">Disputado</div>
      {:else if isPending}
        <div class="px-2 py-1 bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest">Verificación</div>
      {:else}
        <div class="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase">Activo</div>
      {/if}
    </div>
  </div>

  <h3 class="text-lg font-black text-white uppercase tracking-tight leading-none mb-2">
    {market?.question || 'Cargando...'}
  </h3>
  
  {#if market?.description}
    <p class="text-[10px] text-zinc-500 font-medium leading-relaxed mb-6 italic">
      {market?.description}
    </p>
  {/if}

  <div class="space-y-4">
    <div class="relative h-2 bg-zinc-900 border border-white/5 overflow-hidden flex">
      <div class="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]" style="width: {yesPercent}%"></div>
      <div class="h-full bg-red-500 transition-all duration-1000" style="width: {noPercent}%"></div>
    </div>

    {#if !isEconomyEnabled}
      <div class="p-6 bg-zinc-950 border border-white/5 text-center">
        <p class="text-[9px] text-zinc-600 uppercase font-black tracking-widest italic leading-relaxed">Gestión Académica Pausada</p>
      </div>
    {:else}
      <div class="grid grid-cols-2 gap-4">
        <!-- Opción SÍ -->
        <div class="flex flex-col gap-2">
          <button 
            onclick={() => handleBet(yesOption?.id)}
            disabled={isBetting || isExpired || isResolved || isPending || isDisputed}
            class="group relative flex flex-col items-center p-4 border transition-all bg-zinc-950 border-white/5 hover:border-emerald-500/20 disabled:opacity-50"
          >
            <span class="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1 group-hover:text-emerald-500/60">SÍ</span>
            <div class="flex items-center gap-2">
              <span class="text-xs font-black text-emerald-500">{yesPercent}%</span>
              <span class="text-[10px] text-zinc-600 font-bold">({yesPrice.toFixed(2)} Nets)</span>
            </div>
            {#if (isResolved || isPending) && market?.resultOptionId === yesOption?.id}
              <div class="absolute -bottom-2 bg-emerald-500 text-[8px] font-black px-2 py-0.5 text-black uppercase tracking-tighter">Propuesto</div>
            {/if}
          </button>

          {#if userYesPosition && !isResolved}
            <div class="p-2 bg-emerald-500/5 border border-emerald-500/20 flex flex-col gap-1">
              <span class="text-[8px] font-black text-emerald-500/60 uppercase">Pronóstico: {userYesPosition.sharesOwned.toFixed(1)} Nets</span>
              {#if !isPending && !isDisputed}
                <button onclick={() => handleSell(yesOption?.id, userYesPosition!.sharesOwned)} class="w-full py-1 bg-white text-black text-[8px] font-black uppercase hover:bg-emerald-500 transition-colors">Vender</button>
              {/if}
            </div>
          {/if}
        </div>

        <!-- Opción NO -->
        <div class="flex flex-col gap-2">
          <button 
            onclick={() => handleBet(noOption?.id)}
            disabled={isBetting || isExpired || isResolved || isPending || isDisputed}
            class="group relative flex flex-col items-center p-4 border transition-all bg-zinc-950 border-white/5 hover:border-red-500/20 disabled:opacity-50"
          >
            <span class="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1 group-hover:text-red-500/60">NO</span>
            <div class="flex items-center gap-2">
              <span class="text-xs font-black text-red-500">{noPercent}%</span>
              <span class="text-[10px] text-zinc-600 font-bold">({noPrice.toFixed(2)} Nets)</span>
            </div>
            {#if (isResolved || isPending) && market?.resultOptionId === noOption?.id}
              <div class="absolute -bottom-2 bg-red-500 text-[8px] font-black px-2 py-0.5 text-black uppercase tracking-tighter">Propuesto</div>
            {/if}
          </button>

          {#if userNoPosition && !isResolved}
            <div class="p-2 bg-red-500/5 border border-red-500/20 flex flex-col gap-1">
              <span class="text-[8px] font-black text-red-500/60 uppercase">Pronóstico: {userNoPosition.sharesOwned.toFixed(1)} Nets</span>
              {#if !isPending && !isDisputed}
                <button onclick={() => handleSell(noOption?.id, userNoPosition!.sharesOwned)} class="w-full py-1 bg-white text-black text-[8px] font-black uppercase hover:bg-red-500 transition-colors">Vender</button>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>

  <!-- Fase Optimista: Disputa -->
  {#if isPending && !isResolved}
    <div class="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 space-y-3">
      <p class="text-[9px] font-black text-amber-500 uppercase leading-tight">
        Se ha propuesto un resultado. Si crees que es incorrecto, puedes disputarlo.
      </p>
      <div class="flex gap-2">
        <button 
          onclick={handleDispute}
          disabled={isDisputing}
          class="flex-1 py-2 bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
        >
          <Warning size={12} weight="fill" /> Disputar Resultado
        </button>
        {#if isDirector}
          <button 
            onclick={() => finalizeMarket(market.resultOptionId)}
            class="flex-1 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
          >
            Confirmar (Admin)
          </button>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Fase de Disputa: Resolución Admin -->
  {#if isDisputed}
    <div class="mt-4 p-4 bg-red-500/10 border border-red-500/20 space-y-3">
      <div class="flex items-center gap-2">
        <ShieldCheckered size={16} class="text-red-500" />
        <span class="text-[9px] font-black text-white uppercase">Intervención Requerida</span>
      </div>
      <p class="text-[9px] text-zinc-500 leading-relaxed font-bold">
        Este hito ha sido disputado. Un administrador debe dar el veredicto final.
      </p>
      {#if isDirector}
        <div class="grid grid-cols-2 gap-2 mt-2">
          <button onclick={() => finalizeMarket(yesOption?.id)} class="py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 text-[8px] font-black uppercase hover:bg-emerald-500 hover:text-black transition-all">Veredicto: {yesOption?.text}</button>
          <button onclick={() => finalizeMarket(noOption?.id)} class="py-2 bg-red-500/20 border border-red-500/30 text-red-500 text-[8px] font-black uppercase hover:bg-red-500 hover:text-black transition-all">Veredicto: {noOption?.text}</button>
        </div>
      {/if}
    </div>
  {/if}

  {#if isDirector && isExpired && !isResolved && !isPending && !isDisputed}
    <div class="mt-4 p-4 bg-zinc-950 border border-violet-500/20 space-y-3">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <HandPointing size={14} class="text-violet-400" />
          <span class="text-[9px] font-black text-white uppercase tracking-widest">Resolver Hito (Director)</span>
        </div>
        {#if market.oracleConfig?.validationSource === 'LICHESS_API'}
          <button 
            onclick={handleOracleConsult}
            disabled={loadingOracle}
            class="flex items-center gap-1 px-2 py-0.5 bg-violet-500/10 border border-violet-500/30 text-[8px] font-black text-violet-400 uppercase hover:bg-violet-500 hover:text-black transition-all"
          >
            <Globe size={10} /> {loadingOracle ? 'Consultando...' : 'Consultar Oráculo'}
          </button>
        {/if}
      </div>
      <div class="grid grid-cols-2 gap-2">
        <button onclick={() => proposeResolution(yesOption?.id)} class="py-2 bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-black text-emerald-400 uppercase hover:bg-emerald-500 hover:text-black transition-all">Propuesta: {yesOption?.text}</button>
        <button onclick={() => proposeResolution(noOption?.id)} class="py-2 bg-red-500/10 border border-red-500/30 text-[9px] font-black text-red-400 uppercase hover:bg-red-500 hover:text-black transition-all">Propuesta: {noOption?.text}</button>
      </div>
    </div>
  {/if}

  <div class="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <ChartBar size={14} class="text-zinc-600" />
      <span class="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Pool: {totalPool.toFixed(0)} Nets</span>
    </div>
    <div class="flex items-center gap-1.5">
      <span class="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">Inversión:</span>
      <input type="number" bind:value={betAmount} min="1" max="100" class="w-12 bg-white/5 border border-white/10 text-[10px] font-black text-white text-center py-0.5 outline-none focus:border-amber-500/50" />
      <span class="text-[8px] font-bold text-zinc-500 uppercase">Nets</span>
    </div>
  </div>
</div>

<style>
  .prediction-card { position: relative; overflow: hidden; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid rgba(255, 255, 255, 0.05); }
  .prediction-card:hover { border-color: rgba(255, 255, 255, 0.1); transform: translateY(-2px); }
  .prediction-card.resolved { opacity: 0.8; filter: grayscale(0.1); }
  .prediction-card.pending { border-color: rgba(245, 158, 11, 0.3); }
  .prediction-card.disputed { border-color: rgba(239, 68, 68, 0.4); }
  
  .prediction-card::after {
    content: ''; position: absolute; top: 0; right: 0; width: 60px; height: 60px;
    background: linear-gradient(45deg, transparent 50%, rgba(251, 191, 36, 0.03) 50%);
  }
</style>
