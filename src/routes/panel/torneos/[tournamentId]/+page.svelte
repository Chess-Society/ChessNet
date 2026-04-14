<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft, 
    Trophy, 
    Users, 
    Play, 
    Target, 
    CalendarBlank, 
    Clock, 
    MapPin, 
    Medal, 
    CheckCircle, 
    Warning, 
    Gear,
    UserPlus, 
    ArrowsClockwise, 
    Crown, 
    CaretRight,
    Info,
    ListNumbers,
    Table,
    ChartBar,
    X
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { getLocalTournamentsApi } from '$lib/api/local-tournaments';
  import { fade, fly, scale } from 'svelte/transition';

  const tournamentId = page.params.tournamentId;
  
  // Reactivity with Svelte 5 runes
  let tournament = $derived($appStore.localTournaments.find(t => t.id === tournamentId));
  let students = $derived($appStore.students || []);
  let players = $derived($appStore.localTournamentPlayers.filter(p => p.tournament_id === tournamentId));
  let pairings = $derived($appStore.localTournamentPairings.filter(p => p.tournament_id === tournamentId));
  let rounds = $derived($appStore.localTournamentRounds.filter(r => r.tournament_id === tournamentId));

  let activeTab = $state('overview');
  let showRegModal = $state(false);
  let selectedStudentId = $state('');
  let isProcessing = $state(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'in_progress':
        return { label: 'En Curso', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
      case 'completed':
        return { label: 'Finalizado', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' };
      case 'upcoming':
        return { label: 'Próximo', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' };
      default:
        return { label: status, color: 'text-zinc-400', bg: 'bg-zinc-800', border: 'border-zinc-700' };
    }
  };

  // Logic: Registration
  const handleRegister = async () => {
    if (!selectedStudentId || !tournamentId) return;
    isProcessing = true;
    try {
        const api = await getLocalTournamentsApi();
        await api.addPlayer(tournamentId, selectedStudentId);
        showRegModal = false;
        selectedStudentId = '';
    } catch (error) {
        console.error("Error registering player:", error);
    } finally {
        isProcessing = false;
    }
  };

  // Logic: Start (Generate Round 1)
  const handleStart = async () => {
      if (!tournament || players.length < 2 || !tournamentId) return;
      isProcessing = true;
      try {
          const api = await getLocalTournamentsApi();
          await api.updateTournament(tournamentId, { status: 'in_progress', currentRound: 1 });
          await api.generatePairings(tournamentId, 1);
          activeTab = 'pairings';
      } catch (error) {
          console.error("Error starting tournament:", error);
      } finally {
          isProcessing = false;
      }
  };

  const updateResult = async (pairingId: string, result: string) => {
      if (!tournamentId) return;
      try {
          const api = await getLocalTournamentsApi();
          const p = pairings.find(pair => pair.id === pairingId);
          if (p) {
              await api.updateResult(tournamentId, p.round_no, p.board, result as any);
          }
      } catch (error) {
          console.error("Error updating result:", error);
      }
  };

</script>

<svelte:head>
  <title>{tournament?.name || 'Torneo'} - ChessNet Hub</title>
</svelte:head>

{#if !tournament}
  <div class="h-screen flex items-center justify-center text-zinc-500 font-outfit" in:fade>
    <div class="text-center group">
        <Trophy weight="duotone" class="w-16 h-16 mx-auto mb-4 text-zinc-800 group-hover:text-violet-500 transition-colors duration-500" />
        <p class="text-lg font-bold">Torneo no encontrado...</p>
        <button onclick={() => goto('/panel/torneos')} class="mt-4 text-violet-500 hover:text-violet-400 font-bold transition-colors">Volver a la lista</button>
    </div>
  </div>
{:else}
  <div class="max-w-7xl mx-auto px-6 py-8" in:fade={{ duration: 400 }}>
    
    <!-- Bento Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      <div class="flex items-center gap-6">
        <button 
          onclick={() => goto('/panel/torneos')} 
          class="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-xl group"
        >
          <ArrowLeft weight="bold" class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <div class="flex items-center gap-3 mb-2">
            {#if tournament}
              {@const status = getStatusConfig(tournament.status)}
              <span class="px-2.5 py-1 rounded-lg border text-[10px] font-outfit font-black uppercase tracking-widest {status.bg} {status.color} {status.border}">
                  {status.label}
              </span>
            {/if}
            <span class="text-zinc-600 text-[10px] font-black uppercase tracking-widest">ID: {tournamentId?.slice(-6) || '---'}</span>
          </div>
          <h1 class="text-4xl font-outfit font-black text-white tracking-tight uppercase leading-none">{tournament?.name || 'Cargando...'}</h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
          {#if tournament.status === 'upcoming'}
            <button 
                onclick={handleStart}
                disabled={players.length < 2 || isProcessing}
                class="relative group bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-outfit font-black text-xs tracking-widest flex items-center gap-3 transition-all shadow-lg shadow-violet-500/20 active:scale-95"
            >
                {#if isProcessing}
                    <ArrowsClockwise weight="bold" class="w-5 h-5 animate-spin" />
                {:else}
                    <Play weight="fill" class="w-4 h-4" />
                {/if}
                INICIAR COMPETICIÓN
            </button>
          {/if}
          <button 
            onclick={() => goto(`/panel/torneos/${tournamentId}/edit`)}
            class="w-14 h-14 bg-zinc-900 border border-zinc-800 hover:border-violet-500/50 text-zinc-400 hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-xl group"
          >
            <Gear weight="duotone" class="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
          </button>
      </div>
    </div>

    <!-- Modern Tab Hub Navigation -->
    <div class="flex flex-wrap items-center gap-2 p-1.5 bg-zinc-900/50 border border-zinc-800 rounded-[24px] mb-10 w-fit backdrop-blur-md">
        {#each [
            { id: 'overview', label: 'Resumen', icon: Info },
            { id: 'players', label: 'Participantes', icon: Users },
            { id: 'pairings', label: 'Emparejamientos', icon: Table },
            { id: 'standings', label: 'Clasificación', icon: ChartBar }
        ] as tab}
            <button 
                onclick={() => activeTab = tab.id}
                class="flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-outfit font-bold transition-all duration-300 {activeTab === tab.id ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}"
            >
                <tab.icon weight={activeTab === tab.id ? 'fill' : 'duotone'} class="w-5 h-5" />
                {tab.label}
            </button>
        {/each}
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <!-- Left: Hub Content (2/3) -->
        <div class="lg:col-span-2 space-y-8">
            
            {#if activeTab === 'overview'}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6" in:fly={{ y: 20 }}>
                    <!-- General Details Bento -->
                    <div class="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                        <div class="absolute top-0 right-0 p-8 opacity-5">
                            <CalendarBlank weight="duotone" class="w-32 h-32 text-white" />
                        </div>
                        <h3 class="text-xl font-outfit font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tight relative z-10">
                            <div class="w-11 h-11 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                                <CalendarBlank weight="duotone" class="w-6 h-6" />
                            </div>
                            Logística
                        </h3>
                        <div class="space-y-6 relative z-10">
                            <div class="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                <div class="flex items-center gap-4">
                                    <Clock weight="duotone" class="w-5 h-5 text-zinc-500" />
                                    <span class="text-xs font-outfit font-black text-zinc-400 uppercase tracking-widest">Inicio</span>
                                </div>
                                <span class="text-sm font-bold text-white">{tournament.startAt ? new Date(tournament.startAt).toLocaleDateString() : 'Pendiente'}</span>
                            </div>
                            <div class="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                <div class="flex items-center gap-4">
                                    <Target weight="duotone" class="w-5 h-5 text-zinc-500" />
                                    <span class="text-xs font-outfit font-black text-zinc-400 uppercase tracking-widest">Control</span>
                                </div>
                                <span class="text-sm font-bold text-white">{tournament.time_control || '10+5'}</span>
                            </div>
                            <div class="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                <div class="flex items-center gap-4">
                                    <MapPin weight="duotone" class="w-5 h-5 text-zinc-500" />
                                    <span class="text-xs font-outfit font-black text-zinc-400 uppercase tracking-widest">Formato</span>
                                </div>
                                <span class="text-sm font-bold text-white uppercase">{tournament.format === 'swiss' ? 'Sistema Suizo' : tournament.format}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Description Bento -->
                    <div class="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group md:col-span-1">
                        <h3 class="text-xl font-outfit font-black text-white mb-6 uppercase tracking-tight">Descripción</h3>
                        <div class="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800/50 min-h-[160px]">
                            <p class="text-zinc-400 font-plus-jakarta leading-relaxed text-sm">
                                {tournament.description || 'No se han proporcionado detalles adicionales para este torneo.'}
                            </p>
                        </div>
                    </div>
                </div>
            {/if}

            {#if activeTab === 'players'}
                <div class="bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl" in:fly={{ y: 20 }}>
                    <div class="p-8 border-b border-zinc-800 flex justify-between items-center bg-gradient-to-r from-zinc-900 to-zinc-950">
                         <div>
                             <h3 class="text-xl font-outfit font-black text-white uppercase tracking-tight">Participantes</h3>
                             <p class="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1">{players.length} Inscritos</p>
                         </div>
                         {#if tournament.status === 'upcoming'}
                            <button 
                                onclick={() => showRegModal = true}
                                class="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl font-outfit font-black text-[10px] tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-violet-500/10 active:scale-95"
                            >
                                <UserPlus weight="bold" class="w-4 h-4" /> REGISTRAR JUGADOR
                            </button>
                         {/if}
                    </div>
                    <div class="overflow-x-auto min-h-[400px]">
                        <table class="w-full text-left">
                            <thead class="bg-zinc-950/50 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                <tr>
                                    <th class="px-8 py-5">Nombre del Jugador</th>
                                    <th class="px-8 py-5">Elo / Rating</th>
                                    <th class="px-8 py-5">Estado</th>
                                    <th class="px-8 py-5 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-zinc-800">
                                {#each players as player}
                                    <tr class="hover:bg-zinc-800/30 transition-colors group">
                                        <td class="px-8 py-5">
                                            <div class="flex items-center gap-3">
                                                <div class="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 font-black group-hover:text-violet-400 group-hover:border-violet-500/30 transition-all">
                                                    {player.student_name[0].toUpperCase()}
                                                </div>
                                                <span class="font-bold text-white text-sm">{player.student_name}</span>
                                            </div>
                                        </td>
                                        <td class="px-8 py-5 text-zinc-400 font-medium text-sm">{player.rating || 1200}</td>
                                        <td class="px-8 py-5">
                                            <span class="px-2.5 py-1 rounded-lg bg-violet-500/5 text-violet-400 border border-violet-500/10 text-[10px] uppercase font-black tracking-widest">Confirmado</span>
                                        </td>
                                        <td class="px-8 py-5 text-right">
                                            <button class="p-2 text-zinc-600 hover:text-red-400 transition-colors">
                                                <X weight="bold" class="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                {/each}
                                {#if players.length === 0}
                                    <tr>
                                        <td colspan="4" class="px-8 py-20 text-center">
                                            <div class="flex flex-col items-center gap-4">
                                                <Users weight="duotone" class="w-12 h-12 text-zinc-800" />
                                                <p class="text-zinc-600 font-plus-jakarta italic text-sm">Esperando inscripciones para este evento...</p>
                                            </div>
                                        </td>
                                    </tr>
                                {/if}
                            </tbody>
                        </table>
                    </div>
                </div>
            {/if}

            {#if activeTab === 'pairings'}
                <div class="space-y-6" in:fly={{ y: 20 }}>
                    {#if rounds.length === 0}
                        <div class="bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-[32px] py-32 text-center flex flex-col items-center gap-6 shadow-2xl">
                            <div class="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-[24px] flex items-center justify-center text-zinc-700">
                                <Target weight="duotone" class="w-10 h-10" />
                            </div>
                            <div class="space-y-2">
                                <p class="text-zinc-500 font-plus-jakarta max-w-xs mx-auto text-base">Inicia el torneo para generar automáticamente los emparejamientos de la primera ronda.</p>
                            </div>
                            {#if tournament.status === 'upcoming'}
                                <button 
                                    onclick={handleStart}
                                    disabled={players.length < 2 || isProcessing}
                                    class="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-outfit font-black text-xs tracking-widest transition-all shadow-xl shadow-fuchsia-500/10 active:scale-95"
                                >
                                    GENERAR PRIMERA RONDA
                                </button>
                            {/if}
                        </div>
                    {:else}
                         {#each rounds.sort((a,b) => b.round_no - a.round_no) as round}
                            <div class="bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl mb-8">
                                <div class="bg-zinc-950/50 px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-gradient-to-r from-zinc-950 to-zinc-900">
                                    <div class="flex items-center gap-4">
                                        <div class="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
                                            <ListNumbers weight="bold" class="w-6 h-6" />
                                        </div>
                                        <h3 class="text-xl font-outfit font-black text-white uppercase tracking-tight">Ronda {round.round_no}</h3>
                                    </div>
                                    <span class="px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Estatus: Activa</span>
                                </div>
                                <div class="p-8 space-y-4 bg-zinc-900">
                                    {#each pairings.filter(p => p.round_no === round.round_no).sort((a,b) => a.board - b.board) as p}
                                        <div class="grid grid-cols-11 items-center gap-2 p-5 bg-zinc-950/40 border border-zinc-800 rounded-2xl group hover:border-violet-500/30 transition-all hover:bg-zinc-950/60 shadow-lg">
                                            <!-- Player White -->
                                            <div class="col-span-4 text-right pr-6">
                                                <p class="font-outfit font-bold text-white text-base group-hover:text-violet-300 transition-colors">{p.white_name}</p>
                                                <p class="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">Blancas</p>
                                            </div>

                                            <!-- Score Box -->
                                            <div class="col-span-3 flex justify-center">
                                                <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-1.5 flex items-center gap-1.5 shadow-inner">
                                                     <button 
                                                        onclick={() => updateResult(p.id, '1-0')}
                                                        class="w-14 h-11 rounded-lg flex items-center justify-center text-sm font-black transition-all hover:scale-105 {p.result === '1-0' ? 'bg-violet-600 text-white shadow-lg' : 'bg-zinc-950 text-zinc-600 hover:text-white hover:bg-zinc-800'}"
                                                     >
                                                        {p.result === '1-0' ? '1' : (p.result === '1/2-1/2' ? '½' : (p.result === '0-1' ? '0' : 'W'))}
                                                     </button>
                                                     <div class="w-px h-6 bg-zinc-800"></div>
                                                     <button 
                                                        onclick={() => updateResult(p.id, '0-1')}
                                                        class="w-14 h-11 rounded-lg flex items-center justify-center text-sm font-black transition-all hover:scale-105 {p.result === '0-1' ? 'bg-violet-600 text-white shadow-lg' : 'bg-zinc-950 text-zinc-600 hover:text-white hover:bg-zinc-800'}"
                                                     >
                                                        {p.result === '0-1' ? '1' : (p.result === '1/2-1/2' ? '½' : (p.result === '1-0' ? '0' : 'B'))}
                                                     </button>
                                                </div>
                                            </div>

                                            <!-- Player Black -->
                                            <div class="col-span-4 text-left pl-6">
                                                <p class="font-outfit font-bold text-white text-base group-hover:text-violet-300 transition-colors">
                                                    {p.bye ? 'DESCANSO (BYE)' : p.black_name}
                                                </p>
                                                <p class="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">Negras</p>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                         {/each}
                    {/if}
                </div>
            {/if}

            {#if activeTab === 'standings'}
                 <div class="bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl" in:fly={{ y: 20 }}>
                    <div class="p-8 border-b border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 flex justify-between items-center">
                         <h3 class="text-xl font-outfit font-black text-white flex items-center gap-3 uppercase tracking-tight">
                             <Crown weight="fill" class="w-7 h-7 text-amber-500 drop-shadow-lg" />
                             Ranking Actual
                         </h3>
                         <div class="flex items-center gap-3">
                             <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-950 px-3 py-1.5 rounded-full border border-zinc-800">Cálculo en Tiempo Real</span>
                         </div>
                    </div>
                    <div class="overflow-x-auto min-h-[400px]">
                        <table class="w-full text-left">
                            <thead class="bg-zinc-950/50 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                <tr>
                                    <th class="px-8 py-5 w-24 text-center">Pos</th>
                                    <th class="px-8 py-5">Nombre del Competidor</th>
                                    <th class="px-8 py-5 text-center">Puntos</th>
                                    <th class="px-8 py-5 text-right w-40">Desempeño</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-zinc-800">
                                {#each players.map(p => {
                                    const playerPairings = pairings.filter(pair => pair.white_student_id === p.student_id || pair.black_student_id === p.student_id);
                                    let pts = 0;
                                    playerPairings.forEach(pair => {
                                        if (pair.white_student_id === p.student_id) pts += pair.points_white || 0;
                                        else pts += pair.points_black || 0;
                                    });
                                    return { ...p, currentPoints: pts };
                                }).sort((a,b) => b.currentPoints - a.currentPoints) as player, i}
                                    <tr class="hover:bg-zinc-800/30 transition-colors group">
                                        <td class="px-8 py-5 text-center">
                                            {#if i === 0}
                                                <div class="w-10 h-10 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full flex items-center justify-center font-black mx-auto shadow-lg shadow-amber-500/5">1º</div>
                                            {:else if i === 1}
                                                <div class="w-10 h-10 bg-slate-100/10 text-slate-300 border border-slate-100/20 rounded-full flex items-center justify-center font-black mx-auto shadow-lg shadow-slate-500/5">2º</div>
                                            {:else if i === 2}
                                                <div class="w-10 h-10 bg-orange-700/10 text-orange-400 border border-orange-700/20 rounded-full flex items-center justify-center font-black mx-auto shadow-lg shadow-orange-500/5">3º</div>
                                            {:else}
                                                <span class="font-black text-zinc-700">{i+1}º</span>
                                            {/if}
                                        </td>
                                        <td class="px-8 py-5">
                                            <div class="flex items-center gap-3">
                                                <span class="font-bold text-white text-base group-hover:text-violet-300 transition-colors uppercase tracking-tight">{player.student_name}</span>
                                                {#if i === 0}<Crown weight="fill" class="w-4 h-4 text-amber-500 animate-pulse" />{/if}
                                            </div>
                                        </td>
                                        <td class="px-8 py-5 text-center">
                                            <div class="text-xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.1)]">{player.currentPoints}</div>
                                        </td>
                                        <td class="px-8 py-5 text-right">
                                            <div class="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                                                <div class="bg-violet-600 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(139,92,246,0.5)]" style="width: {(player.currentPoints / Math.max(1, rounds.length)) * 100}%"></div>
                                            </div>
                                        </td>
                                    </tr>
                                {/each}
                                {#if players.length === 0}
                                    <tr>
                                        <td colspan="4" class="px-8 py-20 text-center text-zinc-600 italic text-sm">No hay datos de clasificación disponibles aún.</td>
                                    </tr>
                                {/if}
                            </tbody>
                        </table>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Right: Sidebar Tools (1/3) -->
        <div class="space-y-8 sticky top-8" in:fly={{ x: 20, duration: 600 }}>
             
             <!-- Prizes Card -->
             <div class="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                 <div class="absolute -top-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                     <Medal weight="duotone" class="w-48 h-48 text-white" />
                 </div>
                 
                 <div class="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-6 shadow-lg shadow-amber-500/5">
                    <Medal weight="duotone" class="w-8 h-8" />
                 </div>
                 
                 <h4 class="text-xl font-outfit font-black text-white mb-2 uppercase tracking-tight relative z-10">Bolsa de Premios</h4>
                 <div class="flex items-baseline gap-2 mb-8 relative z-10">
                    <span class="text-4xl font-black text-white">{tournament.prize_pool || 0}</span>
                    <span class="text-xl font-bold text-zinc-600">€ EUR</span>
                 </div>
                 
                 <div class="space-y-4 relative z-10">
                     <div class="flex items-center justify-between p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl group/item hover:border-amber-500/30 transition-all">
                         <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500 text-xs font-black">1º</div>
                            <span class="text-xs font-outfit font-bold text-zinc-400 group-hover/item:text-white transition-colors">Trofeo de Oro + 50%</span>
                         </div>
                         <Crown weight="fill" class="w-4 h-4 text-amber-500" />
                     </div>
                     <div class="flex items-center justify-between p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl group/item hover:border-slate-400/30 transition-all">
                        <div class="flex items-center gap-3">
                           <div class="w-8 h-8 rounded-lg bg-slate-500/20 flex items-center justify-center text-slate-300 text-xs font-black">2º</div>
                           <span class="text-xs font-outfit font-bold text-zinc-400 group-hover/item:text-white transition-colors">Medalla Plata + 30%</span>
                        </div>
                        <Medal weight="fill" class="w-4 h-4 text-slate-400" />
                    </div>
                 </div>
             </div>

             <!-- Venue Card -->
             <div class="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                 <h4 class="text-lg font-outfit font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tight">
                    <MapPin weight="duotone" class="w-6 h-6 text-violet-500" />
                    Ubicación del Evento
                 </h4>
                 <div class="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
                     <p class="text-sm text-zinc-300 font-plus-jakarta leading-relaxed overflow-hidden">
                        {tournament.location || 'Dirección no especificada. Contactar vía Chat.'}
                     </p>
                 </div>
                 <button class="w-full mt-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-outfit font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3">
                    <MapPin weight="bold" class="w-4 h-4" /> VER EN MAPA
                 </button>
             </div>
        </div>
    </div>
  </div>
{/if}

<!-- Premium Registration Modal -->
{#if showRegModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xl" transition:fade>
      <div 
        class="bg-zinc-900 w-full max-w-xl rounded-[40px] border border-zinc-800 p-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden"
        in:scale={{ start: 0.9, duration: 400, opacity: 0 }}
      >
          <!-- Modal Background Decorative Element -->
          <div class="absolute -top-24 -right-24 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px]"></div>

          <button 
            onclick={() => showRegModal = false}
            class="absolute top-8 right-8 w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-all shadow-lg active:scale-90"
          >
            <X weight="bold" class="w-4 h-4" />
          </button>

          <div class="flex items-center gap-5 mb-10">
            <div class="w-16 h-16 bg-violet-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-violet-500/20">
                <UserPlus weight="duotone" class="w-8 h-8" />
            </div>
            <div>
                <h3 class="text-2xl font-outfit font-black text-white uppercase tracking-tight">Inscribir Competidor</h3>
                <p class="text-zinc-500 text-sm font-medium uppercase tracking-widest mt-1">Torneo: {tournament?.name}</p>
            </div>
          </div>

          <div class="space-y-8 mb-10">
              <div class="space-y-3">
                  <label for="student-select-premium" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Seleccionar Alumno Activo</label>
                  <div class="relative group">
                    <Users weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                    <select 
                        id="student-select-premium"
                        bind:value={selectedStudentId}
                        class="w-full bg-zinc-950 border border-zinc-800 rounded-[20px] pl-16 pr-8 py-5 text-sm text-white font-bold focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all appearance-none cursor-pointer shadow-inner"
                    >
                            <option value="">Buscar en el padrón...</option>
                            {#each students.filter(s => !players.some(p => p.student_id === s.id)) as student}
                                <option value={student.id}>{student.name.toUpperCase()} (ELO {student.rating || 1200})</option>
                            {/each}
                    </select>
                    <CaretRight weight="bold" class="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 rotate-90 pointer-events-none" />
                  </div>
              </div>

              <div class="bg-violet-600/5 border border-violet-500/20 rounded-2xl p-6 flex gap-4 items-start shadow-inner">
                  <Info weight="duotone" class="w-6 h-6 text-violet-400 shrink-0" />
                  <p class="text-[11px] text-violet-300 font-plus-jakarta leading-relaxed uppercase tracking-wider">
                      Al inscribir un jugador, se le asignará una plaza oficial en el cuadro del torneo. Asegúrate de que el alumno haya confirmado su asistencia.
                  </p>
              </div>
          </div>

          <div class="flex gap-4">
              <button 
                onclick={() => showRegModal = false}
                class="flex-1 bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white font-outfit font-bold py-5 rounded-[20px] transition-all active:scale-95 shadow-lg"
              >
                DESCARTAR
              </button>
              <button 
                onclick={handleRegister}
                disabled={!selectedStudentId || isProcessing}
                class="flex-[2] bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-outfit font-black py-5 rounded-[20px] transition-all shadow-xl shadow-violet-500/30 flex items-center justify-center gap-3 group active:scale-95"
              >
                {#if isProcessing}
                    <ArrowsClockwise weight="bold" class="w-6 h-6 animate-spin" />
                {:else}
                    <CheckCircle weight="fill" class="w-6 h-6 group-hover:scale-110 transition-transform" />
                {/if}
                CONFIRMAR REGISTRO
              </button>
          </div>
      </div>
  </div>
{/if}

<style>
    /* Premium table styling */
    table {
        border-collapse: separate;
        border-spacing: 0;
    }
    
    /* Smooth transitions for all interactive elements */
    * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    ::-webkit-scrollbar {
        width: 10px;
    }
    ::-webkit-scrollbar-track {
        background: #09090b;
    }
    ::-webkit-scrollbar-thumb {
        background: #27272a;
        border-radius: 5px;
        border: 2px solid #09090b;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #3f3f46;
    }
</style>
