<script lang="ts">
  import { onMount } from 'svelte';
  import { predictionApi } from '$lib/api/predictions';
  import { user as authUser } from '$lib/stores/auth';
  import { appStore } from '$lib/stores/appStore';
  import { toast } from '$lib/stores/toast';
  import { fade, slide, scale } from 'svelte/transition';
  import { 
    TrendUp, 
    Coins, 
    Clock, 
    CheckCircle, 
    Warning, 
    UserCircle,
    Info,
    ArrowRight,
    Plus,
    X,
    PencilSimple,
    Globe,
    Lightning
  } from 'phosphor-svelte';
  import { lichessApi } from '$lib/api/lichess';
  import type { PredictionMarket } from '$lib/types/governance';

  let markets = $state<PredictionMarket[]>([]);
  let isLoading = $state(true);
  let isProcessing = $state(false);
  let isCreating = $state(false);
  let betAmount = $state(10);
  let selectedOptionId = $state<string | null>(null);

  // New market form state
  let newMarketQuestion = $state('');
  let newMarketOptions = $state(['SÍ', 'NO']);
  let oracleType = $state<'MANUAL' | 'LICHESS' | 'SYSTEM'>('MANUAL');
  let externalId = $state('');
  let endDate = $state(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16));

  const schoolId = $derived($appStore.settings?.schoolId || 'DEFAULT_SCHOOL');
  const isDirector = $derived($appStore.settings?.role === 'director' || $appStore.settings?.role === 'admin');

  // Lichess suggestions state
  let suggestions = $state<any[]>([]);
  let isFetchingSuggestions = $state(false);
  let showSuggestions = $state(false);

  async function fetchSuggestions() {
    isFetchingSuggestions = true;
    try {
      const data = await lichessApi.getTopBroadcasts();
      // Combine active and upcoming rounds
      const allRounds = [
        ...data.active.map((b: any) => ({ ...b, status: 'ACTIVE' })),
        ...data.upcoming.map((b: any) => ({ ...b, status: 'UPCOMING' }))
      ];
      suggestions = allRounds.slice(0, 5);
    } catch (e) {
      console.error(e);
      toast.error('Error al obtener datos de Lichess');
    } finally {
      isFetchingSuggestions = false;
    }
  }

  function handleUseSuggestion(suggestion: any) {
    const mapped = lichessApi.mapBroadcastToSuggestion(suggestion);
    newMarketQuestion = mapped.question;
    oracleType = 'LICHESS';
    externalId = suggestion.tour.id;
    isCreating = true;
    showSuggestions = false;
    toast.info('Formulario pre-rellenado con datos de Lichess');
  }

  onMount(async () => {
    await fetchMarkets();
  });

  async function fetchMarkets() {
    try {
      markets = await predictionApi.getMarkets(schoolId);
    } catch (e) {
      console.error('Error fetching markets:', e);
    } finally {
      isLoading = false;
    }
  }

  async function handleCreateMarket() {
    if (!newMarketQuestion) return;
    
    // Ensure we have a valid date
    const finalEndDate = endDate ? new Date(endDate).toISOString() : new Date(Date.now() + 86400000).toISOString();

    try {
      const marketData = {
        schoolId,
        creatorId: $authUser?.uid || 'SYSTEM',
        question: newMarketQuestion,
        endDate: finalEndDate,
        options: [
          { id: 'opt_0', text: 'SÍ', totalStaked: 0, totalShares: 0 },
          { id: 'opt_1', text: 'NO', totalStaked: 0, totalShares: 0 }
        ],
        oracleType,
        oracleConfig: {
          ...(oracleType === 'LICHESS' && externalId ? { externalId: externalId.trim(), tournamentId: externalId.trim() } : {}),
          validationSource: oracleType === 'LICHESS' ? 'LICHESS_API' : oracleType === 'SYSTEM' ? 'SYSTEM_DATA' : 'MANUAL'
        }
      };

      console.log("[Admin] Creating market:", marketData);
      await predictionApi.createMarket(marketData);
      
      toast.success('Hito publicado correctamente');
      isCreating = false;
      newMarketQuestion = '';
      oracleType = 'MANUAL';
      externalId = '';
      await fetchMarkets();
    } catch (e: any) {
      console.error("[Admin] Creation failure:", e);
      toast.error(e.message || 'CREATION_FAILURE');
    } finally {
      isProcessing = false;
    }
  }

  async function handleBet(marketId: string) {
    if (!selectedOptionId || !$authUser) return;
    
    isProcessing = true;
    try {
      await predictionApi.placeBet($authUser.uid, marketId, selectedOptionId, betAmount);
      toast.success('PREDICTION_LOCKED_IN');
      await fetchMarkets();
      selectedOptionId = null;
    } catch (e: any) {
      toast.error(e.message || 'TRANSACTION_FAILURE');
    } finally {
      isProcessing = false;
    }
  }

  async function handleResolve(marketId: string, optionId: string) {
    if (!confirm('CONFIRM_MARKET_RESOLUTION_AND_PAYOUT_DISTRIBUTION?')) return;
    
    isProcessing = true;
    try {
      await predictionApi.resolveMarket(marketId, optionId);
      toast.success('MARKET_RESOLVED_SUCCESSFULLY');
      await fetchMarkets();
    } catch (e: any) {
      toast.error(e.message || 'RESOLUTION_FAILURE');
    } finally {
      isProcessing = false;
    }
  }

  function getOptionPercentage(market: PredictionMarket, optionId: string) {
    if (market.totalPool === 0) return 0;
    const option = market.options.find(o => o.id === optionId);
    return option ? Math.round((option.totalStaked / market.totalPool) * 100) : 0;
  }
</script>

<div class="flex flex-col gap-6 font-mono">
  <!-- Header section -->
  <div class="flex items-center justify-between border-b border-white/10 pb-4">
    <div class="flex items-center gap-3">
      <div class="w-2 h-2 bg-amber-500 animate-pulse"></div>
      <h2 class="text-xs font-black uppercase tracking-[0.3em] text-white">Hitos de Pronóstico</h2>
    </div>
    
    {#if isDirector && !isCreating}
      <div class="flex items-center gap-3">
        <button 
          onclick={() => { showSuggestions = !showSuggestions; if (showSuggestions) fetchSuggestions(); }}
          class="flex items-center gap-2 px-3 py-1 {showSuggestions ? 'bg-blue-500 text-black' : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'} text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-black transition-all"
        >
          <Globe size={12} weight="bold" />
          Sugerencias Lichess
        </button>
        <button 
          onclick={() => isCreating = true}
          class="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-[9px] font-black text-amber-500 uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all"
        >
          <Plus size={12} weight="bold" />
          Crear Hito
        </button>
      </div>
    {/if}
  </div>

  <!-- Suggestions List -->
  {#if showSuggestions}
    <div class="bg-blue-500/5 border border-blue-500/20 p-6 space-y-4" transition:slide>
      <div class="flex items-center justify-between">
        <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 italic flex items-center gap-2">
          <Lightning size={14} weight="fill" />
          Torneos Relevantes en Lichess
        </h3>
        <button onclick={() => showSuggestions = false} class="text-slate-500 hover:text-white">
          <X size={16} />
        </button>
      </div>

      {#if isFetchingSuggestions}
        <div class="py-8 flex flex-col items-center justify-center gap-3 opacity-50">
          <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent animate-spin"></div>
          <span class="text-[8px] font-black uppercase tracking-widest">Sincronizando con Lichess...</span>
        </div>
      {:else if suggestions.length === 0}
        <p class="text-[9px] text-slate-500 uppercase italic">No se encontraron torneos activos en este momento.</p>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each suggestions as s}
            <button 
              onclick={() => handleUseSuggestion(s)}
              class="text-left bg-black/40 border border-white/5 p-4 hover:border-blue-500/50 transition-all group"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-[8px] font-black px-2 py-0.5 {s.status === 'ACTIVE' ? 'bg-emerald-500 text-black' : 'bg-blue-500 text-black'} uppercase tracking-tighter">
                  {s.status === 'ACTIVE' ? 'EN VIVO' : 'PRÓXIMO'}
                </span>
                <span class="text-[8px] font-mono text-slate-500">{s.tour.tier}nd Tier</span>
              </div>
              <h4 class="text-[11px] font-black text-white uppercase leading-tight mb-1 group-hover:text-blue-400">{s.tour.name}</h4>
              <p class="text-[9px] text-slate-500 uppercase tracking-tighter italic">{s.round.name}</p>
              <div class="mt-3 pt-3 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all">
                <span class="text-[8px] font-black text-blue-400 uppercase">Usar Plantilla</span>
                <ArrowRight size={10} class="text-blue-400" />
              </div>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
    <div class="hidden md:flex items-center gap-4 text-[9px] font-black">
      <div class="flex items-center gap-1.5 text-slate-500 uppercase">
        <Clock size={12} />
        <span>Sesiones activas: {markets?.filter(m => m?.status === 'OPEN').length || 0}</span>
      </div>
      <div class="flex items-center gap-1.5 text-amber-500 uppercase">
        <Coins size={12} />
        <span>Volumen Total: {markets?.reduce((acc, m) => acc + (m?.totalPool || 0), 0) || 0} Nets</span>
      </div>
    </div>

  {#if isCreating}
    <div 
      class="bg-amber-500/5 border border-amber-500/20 p-6 space-y-6"
      transition:slide
    >
      <div class="flex items-center justify-between">
        <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 italic">Configuración de Nuevo Hito Académico</h3>
        <button onclick={() => isCreating = false} class="text-slate-500 hover:text-white">
          <X size={16} />
        </button>
      </div>

      <div class="space-y-4">
        <div class="space-y-2">
          <label for="market-question" class="text-[8px] font-black text-slate-600 uppercase tracking-widest">Pregunta del hito (ej. ¿Completará el Grupo A el módulo de aperturas?)</label>
          <input 
            id="market-question"
            type="text" 
            bind:value={newMarketQuestion}
            placeholder="Escribe el hito aquí..."
            class="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm font-black text-white focus:border-amber-500/50 outline-none uppercase italic"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-black/40 border border-white/5 p-3 flex items-center justify-between">
             <span class="text-[9px] font-black text-slate-500">OPCIÓN A</span>
             <span class="text-xs font-black text-white tracking-widest">SÍ</span>
          </div>
          <div class="bg-black/40 border border-white/5 p-3 flex items-center justify-between">
             <span class="text-[9px] font-black text-slate-500">OPCIÓN B</span>
             <span class="text-xs font-black text-white tracking-widest">NO</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Oracle Config -->
          <div class="space-y-4">
            <div class="space-y-2">
              <label for="oracle-type" class="text-[8px] font-black text-slate-600 uppercase tracking-widest">Protocolo de Validación</label>
              <select 
                id="oracle-type"
                bind:value={oracleType}
                class="w-full bg-black/60 border border-white/10 px-4 py-3 text-xs font-black text-white focus:border-amber-500/50 outline-none uppercase"
              >
                <option value="MANUAL">Manual (Director)</option>
                <option value="LICHESS">Lichess API (Automático)</option>
                <option value="SYSTEM">Datos del Sistema</option>
              </select>
            </div>

            {#if oracleType === 'LICHESS'}
              <div class="space-y-2" transition:slide>
                <label for="external-id" class="text-[8px] font-black text-blue-500 uppercase tracking-widest">ID de Torneo Lichess</label>
                <input 
                  id="external-id"
                  type="text" 
                  bind:value={externalId}
                  placeholder="Ej: qS7W9zR4"
                  class="w-full bg-black/60 border border-blue-500/20 px-4 py-3 text-xs font-black text-white focus:border-blue-500/50 outline-none"
                />
              </div>
            {/if}
          </div>

          <!-- Date -->
          <div class="space-y-2">
            <label for="market-end-date" class="text-[8px] font-black text-slate-600 uppercase tracking-widest">Fecha de Cierre (Pronósticos)</label>
            <input 
              id="market-end-date"
              type="datetime-local" 
              bind:value={endDate}
              class="w-full bg-black/60 border border-white/10 px-4 py-3 text-xs font-black text-white focus:border-amber-500/50 outline-none"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-4">
        <button 
          onclick={() => isCreating = false}
          class="px-6 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all"
        >
          Cancelar
        </button>
        <button 
          onclick={handleCreateMarket}
          disabled={!newMarketQuestion || isProcessing}
          class="px-8 py-2.5 bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 disabled:opacity-20 transition-all"
        >
          {isProcessing ? 'Procesando...' : 'Publicar Hito'}
        </button>
      </div>
    </div>
  {/if}

  {#if isLoading}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
      {#each Array(2) as _}
        <div class="h-48 bg-white/5 border border-white/5"></div>
      {/each}
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each markets as market (market.id)}
        <div 
          class="bg-black/40 border {market?.status === 'OPEN' ? 'border-white/5 hover:border-amber-500/30' : 'border-white/10 grayscale opacity-60'} transition-all p-6 relative group overflow-hidden"
          in:fade
        >
          <!-- Status Badge -->
          <div class="absolute top-0 right-0 flex">
            {#if isDirector && market?.status === 'OPEN'}
              <button 
                onclick={() => {
                  // Emit event or call a prop to open edit modal
                  // For now, we'll assume the parent handles this or we can dispatch an event
                  const event = new CustomEvent('editMarket', { detail: market });
                  window.dispatchEvent(event);
                }}
                class="px-2 py-1 bg-white/5 text-slate-400 hover:bg-amber-500 hover:text-black transition-all border-l border-b border-white/10"
                title="Editar Hito"
              >
                <PencilSimple size={12} weight="bold" />
              </button>
            {/if}
            <div class="px-3 py-1 text-[8px] font-black uppercase tracking-widest {market?.status === 'OPEN' ? 'bg-amber-500 text-black' : 'bg-white/10 text-slate-500'}">
              {market?.status || 'UNKNOWN'}
            </div>
          </div>

          <!-- Market Content -->
          <div class="mb-6">
            <p class="text-[9px] text-slate-600 uppercase tracking-widest mb-2 italic">Ref. Hito: {market?.id?.slice(0, 8) || '...'}</p>
            <h3 class="text-lg font-black text-white leading-tight uppercase italic">{market?.question || 'Cargando...'}</h3>
          </div>

          <!-- Options -->
          <div class="space-y-3 mb-8">
            {#each market.options as option}
              <div class="relative group/opt">
                <button 
                  disabled={market?.status !== 'OPEN' || isProcessing}
                  onclick={() => selectedOptionId = option.id}
                  class="w-full relative flex items-center justify-between px-4 py-3 border {selectedOptionId === option.id ? 'border-amber-500 bg-amber-500/10' : 'border-white/5 bg-white/[0.02]'} transition-all text-left z-10"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-1.5 h-1.5 {selectedOptionId === option.id ? 'bg-amber-500 animate-pulse' : 'bg-white/10'}"></div>
                    <span class="text-xs font-black uppercase tracking-tighter {selectedOptionId === option.id ? 'text-white' : 'text-slate-400'}">
                      {option.text}
                    </span>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] font-black text-white">{getOptionPercentage(market, option.id)}%</span>
                  </div>
                  
                  <!-- Progress Bar Background (inside button) -->
                  <div 
                    class="absolute inset-0 bg-white/[0.03] pointer-events-none transition-all duration-1000 -z-10" 
                    style="width: {getOptionPercentage(market, option.id)}%"
                  ></div>
                </button>

                <!-- Admin Resolve Button (outside the option button) -->
                {#if isDirector && market?.status === 'OPEN'}
                  <button 
                    onclick={(e) => { e.stopPropagation(); handleResolve(market?.id, option.id); }}
                    class="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/opt:opacity-100 p-2 bg-emerald-500 text-black transition-all hover:scale-110 z-20"
                    title="Resolver como ganador"
                  >
                    <CheckCircle size={14} weight="bold" />
                  </button>
                {/if}
              </div>
            {/each}
          </div>

          <!-- Action Footer -->
          {#if market?.status === 'OPEN'}
            <div class="flex items-center gap-4 pt-4 border-t border-white/5">
              <div class="flex-1 flex items-center bg-black/60 border border-white/10 px-3 py-2">
                <label for="bet-amount-{market?.id}" class="text-[8px] font-black text-slate-600 mr-3 uppercase">Cantidad:</label>
                <input 
                  id="bet-amount-{market?.id}"
                  type="number" 
                  bind:value={betAmount} 
                  min="1" 
                  max={$appStore?.settings?.economy?.netsBalance || 100}
                  class="bg-transparent text-amber-500 text-xs font-black focus:outline-none w-full"
                />
                <span class="text-[9px] font-black text-amber-500/5 ml-2">NETS</span>
              </div>
              <button 
                onclick={() => handleBet(market?.id)}
                disabled={!selectedOptionId || isProcessing || betAmount <= 0}
                class="px-6 py-2.5 bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 disabled:opacity-20 transition-all flex items-center gap-2 group"
              >
                Confirmar Pronóstico
                <ArrowRight size={14} weight="bold" class="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          {:else if market?.status === 'RESOLVED'}
            <div class="flex items-center justify-between pt-4 border-t border-white/10 text-emerald-400">
               <div class="flex items-center gap-2">
                 <CheckCircle size={16} weight="fill" />
                 <span class="text-[10px] font-black uppercase tracking-widest">Resuelto</span>
               </div>
               <span class="text-[10px] font-mono italic opacity-60">Total repartido: {market?.totalPool || 0} NETS</span>
            </div>
          {/if}

          <!-- Decorative edge -->
          <div class="absolute bottom-0 left-0 w-1 h-0 bg-amber-500 group-hover:h-full transition-all duration-500"></div>
        </div>
      {:else}
        <div class="col-span-full h-64 border border-dashed border-white/10 flex flex-col items-center justify-center opacity-20">
          <TrendUp size={48} weight="thin" class="mb-4" />
          <p class="text-xs uppercase tracking-[0.4em]">NO_ACTIVE_MARKETS_FOUND</p>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
</style>
