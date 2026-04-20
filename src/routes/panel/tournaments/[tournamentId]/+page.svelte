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
    X,
    Printer,
    ArrowClockwise,
    ArrowCounterClockwise,
    UserMinus,
    Trash,
    Circle,
    Flag,
    Handshake
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { getLocalTournamentsApi } from '$lib/api/local-tournaments';
  import { fade, fly, scale } from 'svelte/transition';
  import { t } from '$lib/i18n';
  import { showToast, showError } from '$lib/stores/toast';
  import TournamentBracket from '$lib/components/tournaments/TournamentBracket.svelte';
  import TournamentCrosstable from '$lib/components/tournaments/TournamentCrosstable.svelte';
  import { uiStore } from '$lib/stores/uiStore';

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
  let manualPlayerName = $state('');
  let isProcessing = $state(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'in_progress':
        return { label: $t('tournaments.status_in_progress'), color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' };
      case 'completed':
        return { label: $t('tournaments.status_completed'), color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' };
      case 'upcoming':
        return { label: $t('tournaments.status_upcoming'), color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' };
      default:
        return { label: status, color: 'text-zinc-400', bg: 'bg-zinc-800', border: 'border-zinc-700' };
    }
  };

  // Logic: Registration
  const handleRegister = async () => {
    if ((!selectedStudentId && !manualPlayerName) || !tournamentId) return;
    isProcessing = true;
    try {
        const api = await getLocalTournamentsApi();
        if (manualPlayerName) {
            await api.addManualPlayer(tournamentId, manualPlayerName);
        } else {
            await api.addPlayer(tournamentId, selectedStudentId);
        }
        showToast.success($t('tournaments.player_registered'));
        showRegModal = false;
        selectedStudentId = '';
        manualPlayerName = '';
    } catch (error: any) {
        console.error("Error registering player:", error);
        showError(error.message || $t('tournaments.error_registering_player'));
    } finally {
        isProcessing = false;
    }
  };

  // Logic: Start (Generate Round 1)
  const handleStart = async () => {
      if (!tournament || players.length < 2 || !tournamentId) return;

      const confirmed = await uiStore.confirm({
          title: $t('tournaments.start_tournament_confirm'),
          confirmText: $t('common.confirm')
      });

      if (!confirmed) return;

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

  // Check if current round is finished
  const currentRoundFinished = $derived(
    tournament && 
    rounds.length > 0 && 
    pairings.filter(p => p.round_no === (tournament.currentRound || 1)).length > 0 &&
    pairings.filter(p => p.round_no === (tournament.currentRound || 1)).every(p => p.result !== undefined || p.bye)
  );

  const sortedStandings = $derived(
    players.map(p => {
        const playerPairings = pairings.filter(pair => pair.white_student_id === p.student_id || pair.black_student_id === p.student_id);
        let pts = 0; let buchholz = 0; let sb = 0;
        playerPairings.forEach(pair => {
            if (!pair.result && !pair.bye) return;
            const isWhite = pair.white_student_id === p.student_id;
            const pPts = isWhite ? pair.points_white || 0 : pair.points_black || 0;
            pts += pPts;
            const oppId = isWhite ? pair.black_student_id : pair.white_student_id;
            if (oppId) {
                const oppResults = pairings.filter(p2 => (p2.white_student_id === oppId || p2.black_student_id === oppId) && (p2.result || p2.bye));
                let oppTotalPts = 0;
                oppResults.forEach(r => {
                    if (r.white_student_id === oppId) oppTotalPts += r.points_white || 0;
                    else oppTotalPts += r.points_black || 0;
                });
                buchholz += oppTotalPts;
                if (pPts === 1) sb += oppTotalPts;
                else if (pPts === 0.5) sb += (oppTotalPts * 0.5);
            }
        });
        const tb1 = (tournament?.format === 'round_robin') ? sb : buchholz;
        const tb2 = (tournament?.format === 'round_robin') ? buchholz : sb;
        return { ...p, currentPoints: pts, tb1, tb2 };
    }).sort((a,b) => {
        if (b.currentPoints !== a.currentPoints) return b.currentPoints - a.currentPoints;
        if (b.tb1 !== a.tb1) return b.tb1 - a.tb1;
        return b.tb2 - a.tb2;
    })
  );

  const handleNextRound = async () => {
    if (!tournamentId || !tournament) return;
    const nextRoundNo = (tournament.currentRound || 0) + 1;
    
    // Check if tournament is actually finished
    if (tournament.format === 'knockout') {
        const lastRoundPairings = pairings.filter(p => p.round_no === (tournament.currentRound || 1));
        if (lastRoundPairings.length === 1 && !lastRoundPairings[0].bye) {
            // It was the final
            await handleFinishTournament();
            return;
        }
    } else if (tournament.format === 'swiss' || tournament.format === 'round_robin') {
        if (nextRoundNo > (tournament.roundsPlanned || 0)) {
            await handleFinishTournament();
            return;
        }
    }

    isProcessing = true;
    try {
        const api = await getLocalTournamentsApi();
        await api.updateTournament(tournamentId, { currentRound: nextRoundNo });
        await api.generatePairings(tournamentId, nextRoundNo);
        showToast.success($t('tournaments.round_generated'));
    } catch (error) {
        console.error("Error generating next round:", error);
        showError($t('tournaments.error_generating_round'));
    } finally {
        isProcessing = false;
    }
  };

  const handleFinishTournament = async () => {
    if (!tournamentId) return;
    isProcessing = true;
    try {
        const api = await getLocalTournamentsApi();
        await api.updateTournament(tournamentId, { status: 'completed' });
        showToast.success($t('tournaments.status_completed'));
        activeTab = 'standings';
    } catch (error) {
        console.error("Error finishing tournament:", error);
    } finally {
        isProcessing = false;
    }
  };

  const handleResetRound = async () => {
    if (!tournamentId || !tournament) return;
    const currentRoundNo = tournament.currentRound || 1;
    const confirmed = await uiStore.confirm({
      title: $t('tournaments.confirm_reset_round'),
      message: $t('common.undone_action'),
      type: 'danger',
      confirmText: $t('common.reset'),
      cancelText: $t('common.cancel')
    });

    if (!confirmed) return;

    isProcessing = true;
    try {
        const api = await getLocalTournamentsApi();
        await api.resetRound(tournamentId, currentRoundNo);
        showToast.success($t('tournaments.round_reset_success'));
    } catch (error) {
        console.error("Error resetting round:", error);
        showError($t('tournaments.error_resetting_round'));
    } finally {
        isProcessing = false;
    }
  };

  const handleWithdrawPlayer = async (studentId: string, currentStatus?: string) => {
    if (!tournamentId) return;
    const isWithdrawn = currentStatus === 'withdrawn';
    
    try {
        const api = await getLocalTournamentsApi();
        if (isWithdrawn) {
             await api.reactivatePlayer(tournamentId, studentId);
        } else {
             await api.withdrawPlayer(tournamentId, studentId);
        }
        showToast.success(!isWithdrawn ? $t('tournaments.player_withdrawn') : $t('tournaments.player_reactivated'));
    } catch (error) {
        console.error("Error updating player status:", error);
    }
  };

  const removePlayer = async (studentId: string) => {
      if (!tournamentId) return;
      const confirmed = await uiStore.confirm({
          title: $t('tournaments.confirm_remove_player'),
          message: $t('common.undone_action'),
          type: 'danger',
          confirmText: $t('common.delete'),
          cancelText: $t('common.cancel')
      });
      if (!confirmed) return;
      
      try {
          const api = await getLocalTournamentsApi();
          await api.removePlayer(tournamentId, studentId);
          showToast.success($t('tournaments.player_removed'));
      } catch (error) {
          console.error("Error removing player:", error);
          showError(error);
      }
  };

  const handlePrintStandings = () => {
    window.print();
  };

  const handlePrintRound = () => {
    // Add temporary class to filter view if needed, but simple window.print() works with our CSS
    const currentTab = activeTab;
    window.print();
  };

  const calculateTournamentProgress = () => {
    if (!tournament || !tournament.roundsPlanned) return 0;
    if (tournament.status === 'completed') return 100;
    const totalPairings = pairings.length;
    const completedPairings = pairings.filter(p => p.result !== undefined || p.bye).length;
    if (totalPairings === 0) return 0;
    return Math.floor((completedPairings / (players.length * (tournament.roundsPlanned || 1) / 2)) * 100);
  };

</script>

<svelte:head>
  <title>{tournament?.name || 'Torneo'} - ChessNet Dashboard</title>
</svelte:head>

{#if !tournament}
  <div class="h-screen flex items-center justify-center text-zinc-500 font-outfit" in:fade>
    <div class="text-center group">
        <Trophy weight="duotone" class="w-16 h-16 mx-auto mb-4 text-zinc-800 group-hover:text-violet-500 transition-colors duration-500" />
        <p class="text-lg font-bold">{$t('tournaments.not_found')}</p>
        <button onclick={() => goto('/panel/tournaments')} class="mt-4 text-violet-500 hover:text-violet-400 font-bold transition-colors">{$t('tournaments.back')}</button>
    </div>
  </div>
{:else}
  <div class="max-w-7xl mx-auto px-6 py-8" in:fade={{ duration: 400 }}>
    
    <!-- Bento Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      <div class="flex items-center gap-6">
        <button 
          onclick={() => goto('/panel/tournaments')} 
          class="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-xl group"
        >
          <ArrowLeft weight="bold" class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <div class="flex items-center gap-3 mb-2">
            {#if tournament}
              {@const status = getStatusConfig(tournament.status)}
              <span class="px-2.5 py-1 rounded-none border text-[10px] font-outfit font-black uppercase tracking-widest {status.bg} {status.color} {status.border}">
                  {status.label}
              </span>
            {/if}
            <span class="text-zinc-600 text-[10px] font-black uppercase tracking-widest bg-zinc-950/30 px-3 py-1 rounded-none border border-zinc-800">{$t('common.reference')}: {tournamentId?.slice(-6).toUpperCase() || '---'}</span>
          </div>
          <h1 class="text-4xl font-outfit font-black text-white tracking-tight uppercase leading-none">{tournament?.name || $t('common.loading')}</h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
          {#if tournament.status === 'upcoming'}
            <button 
                onclick={handleStart}
                disabled={players.length < 2 || isProcessing}
                class="relative group bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-none font-outfit font-black text-xs tracking-widest flex items-center gap-3 transition-all shadow-lg shadow-violet-500/20 active:scale-95"
            >
                {#if isProcessing}
                    <ArrowsClockwise weight="bold" class="w-5 h-5 animate-spin" />
                {:else}
                    <Play weight="fill" class="w-4 h-4" />
                {/if}
                {$t('tournaments.start_competition')}
            </button>
          {/if}
          <button 
            onclick={() => goto(`/panel/tournaments/${tournamentId}/edit`)}
            class="w-14 h-14 bg-zinc-900 border border-zinc-800 hover:border-violet-500/50 text-zinc-400 hover:text-white rounded-none flex items-center justify-center transition-all shadow-xl group"
            title={$t('tournaments.manage_title')}
          >
            <Gear weight="duotone" class="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
          </button>
      </div>
    </div>

    <!-- Modern Tab Hub Navigation -->
    <div class="flex flex-wrap items-center gap-2 p-1.5 bg-zinc-900/50 border border-zinc-800 rounded-none mb-10 w-fit backdrop-blur-md">
        {#each [
            { id: 'overview', label: $t('tournaments.tab_overview'), icon: Info },
            { id: 'players', label: $t('tournaments.tab_players'), icon: Users },
            { id: 'pairings', label: $t('tournaments.tab_pairings'), icon: Table },
            ...(tournament?.format === 'knockout' ? [{ id: 'brackets', label: $t('tournaments.tab_brackets'), icon: Target }] : []),
            ...(tournament?.format === 'round_robin' ? [{ id: 'crosstable', label: $t('tournaments.tab_crosstable'), icon: ChartBar }] : []),
            { id: 'standings', label: $t('tournaments.tab_standings'), icon: Trophy }
        ] as tab}
            <button 
                onclick={() => activeTab = tab.id}
                class="flex items-center gap-2.5 px-6 py-3 rounded-none text-sm font-outfit font-bold transition-all duration-300 {activeTab === tab.id ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}"
            >
                <tab.icon weight={activeTab === tab.id ? 'fill' : 'duotone'} class="w-5 h-5" />
                {tab.label}
            </button>
        {/each}
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-24">
        
        <!-- Left: Dashboard Content (2/3) -->
        <div class="lg:col-span-2 space-y-8">
            
            {#if activeTab === 'overview'}
                <div class="space-y-8" in:fly={{ y: 20 }}>
                    <!-- Tournament Progress Section -->
                    <div class="bg-zinc-900 border border-zinc-800 rounded-none p-8 shadow-2xl relative overflow-hidden group">
                        <div class="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-100"></div>
                        <div class="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                            <div class="w-32 h-32 relative shrink-0">
                                <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle class="text-zinc-800" stroke-width="8" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50"/>
                                    <circle class="text-violet-500 transition-all duration-1000 ease-out" stroke-width="8" stroke-dasharray="263.89" stroke-dashoffset={263.89 - (calculateTournamentProgress() / 100) * 263.89} stroke-linecap="round" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50"/>
                                </svg>
                                <div class="absolute inset-0 flex flex-col items-center justify-center">
                                    <span class="text-2xl font-black text-white">{calculateTournamentProgress()}%</span>
                                    <span class="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{$t('common.status_in_progress')}</span>
                                </div>
                            </div>
                            <div class="flex-1 space-y-4 text-center md:text-left">
                                <h3 class="text-2xl font-outfit font-black text-white uppercase tracking-tight">{$t('tournaments.competition_engine')}</h3>
                                <p class="text-zinc-400 text-sm leading-relaxed max-w-md">
                                    {$t('tournaments.live_panel_desc')} {$t('tournaments.live_panel_manual')}
                                </p>
                                <div class="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                    <div class="flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-none text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                        <Trophy size={14} class="text-amber-500" />
                                        {tournament.format?.toUpperCase() || 'SWISS'}
                                    </div>
                                    <div class="flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-none text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                        <Users size={14} class="text-indigo-500" />
                                        {players.length} / {tournament.max_players || '∞'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        <!-- Advanced Logistics Bento -->
                        <div class="bg-zinc-900 border border-zinc-800 rounded-none p-8 shadow-2xl relative overflow-hidden group">
                            <div class="absolute top-0 right-0 p-8 opacity-5">
                                <CalendarBlank weight="duotone" class="w-32 h-32 text-white" />
                            </div>
                            <h3 class="text-xl font-outfit font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tight relative z-10">
                                <div class="w-11 h-11 bg-indigo-500/10 rounded-none flex items-center justify-center text-indigo-400">
                                    <CalendarBlank weight="duotone" class="w-6 h-6" />
                                </div>
                                {$t('tournaments.logistics')}
                            </h3>
                            <div class="space-y-4 relative z-10">
                                {#each [
                                    { icon: Clock, label: $t('tournaments.start'), value: tournament.startAt ? new Date(tournament.startAt).toLocaleDateString() : $t('tournaments.date_pending') },
                                    { icon: Target, label: $t('tournaments.time_control'), value: tournament.time_control || '10+5' },
                                    { icon: ListNumbers, label: $t('tournaments.rounds'), value: `${tournament.currentRound || 0} / ${tournament.roundsPlanned || '?'}` },
                                    { icon: MapPin, label: $t('tournaments.venue'), value: (tournament.location || 'Local').slice(0, 20) + ((tournament.location?.length ?? 0) > 20 ? '...' : '') }
                                ] as item}
                                    <div class="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-none hover:bg-zinc-950 hover:border-zinc-800 transition-all">
                                        <div class="flex items-center gap-4">
                                            <item.icon weight="duotone" class="w-5 h-5 text-zinc-600" />
                                            <span class="text-[10px] font-outfit font-black text-zinc-500 uppercase tracking-widest">{item.label}</span>
                                        </div>
                                        <span class="text-xs font-bold text-white">{item.value}</span>
                                    </div>
                                {/each}
                            </div>
                        </div>

                        <!-- Stats & Performance Bento -->
                        <div class="bg-zinc-900 border border-zinc-800 rounded-none p-8 shadow-2xl relative overflow-hidden group">
                            <h3 class="text-xl font-outfit font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tight relative z-10">
                                <div class="w-11 h-11 bg-violet-500/10 rounded-none flex items-center justify-center text-violet-400">
                                    <ChartBar weight="duotone" class="w-6 h-6" />
                                </div>
                                {$t('reports.performance_title')}
                            </h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-none text-center space-y-2">
                                    <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">{$t('tournaments.participants.elo')}</span>
                                    <span class="text-2xl font-black text-white tracking-tighter">
                                        {players.length > 0 ? (players.reduce((a,b) => a + (b.rating || 1200), 0) / players.length).toFixed(0) : '1200'}
                                    </span>
                                    <span class="text-[8px] font-bold text-violet-500 block uppercase">AVG ELO</span>
                                </div>
                                <div class="p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-none text-center space-y-2">
                                    <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">{$t('tournaments.prizes.total')}</span>
                                    <span class="text-2xl font-black text-amber-400 tracking-tighter">
                                        {tournament.prize_pool || 0}€
                                    </span>
                                    <span class="text-[8px] font-bold text-amber-500/50 block uppercase">LIQUID POOL</span>
                                </div>
                            </div>
                            <!-- Small Chart Decor -->
                            <div class="mt-8 flex items-end gap-1 h-12 px-2">
                                {#each Array(15) as _, i}
                                    <div class="flex-1 bg-violet-600/20 rounded-none hover:bg-violet-500 transition-all duration-500 group-hover:h-full" style="height: {20 + Math.random() * 80}%"></div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {/if}

            {#if activeTab === 'players'}
                <div class="bg-zinc-900 border border-zinc-800 rounded-none overflow-hidden shadow-2xl" in:fly={{ y: 20 }}>
                    <div class="p-8 border-b border-zinc-800 flex justify-between items-center bg-gradient-to-r from-zinc-900 to-zinc-950">
                         <div>
                             <h3 class="text-xl font-outfit font-black text-white uppercase tracking-tight">{$t('tournaments.participants')}</h3>
                             <p class="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1">{players.length} {$t('tournaments.registered_count')}</p>
                         </div>
                         {#if tournament.status === 'upcoming'}
                            <button 
                                onclick={() => showRegModal = true}
                                class="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-none font-outfit font-black text-[10px] tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-violet-500/10 active:scale-95"
                            >
                                <UserPlus weight="bold" class="w-4 h-4" /> {$t('tournaments.register_player')}
                            </button>
                         {/if}
                    </div>
                    <div class="overflow-x-auto min-h-[400px]">
                        <table class="w-full text-left">
                            <thead class="bg-zinc-950/50 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                <tr>
                                    <th class="px-8 py-5 w-24">{$t('tournaments.participants.seed')}</th>
                                    <th class="px-8 py-5">{$t('tournaments.participants.name')}</th>
                                    <th class="px-8 py-5">{$t('tournaments.participants.elo')}</th>
                                    <th class="px-8 py-5">{$t('tournaments.participants.status')}</th>
                                    <th class="px-8 py-5 text-right">{$t('tournaments.participants.actions')}</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-zinc-800">
                                {#each players.sort((a,b) => (b.rating || 1200) - (a.rating || 1200)) as player, idx}
                                    <tr class="hover:bg-zinc-800/30 transition-colors group {player.status === 'withdrawn' ? 'opacity-40 grayscale' : ''}">
                                        <td class="px-8 py-5">
                                            <div class="text-xs font-black text-zinc-700">#{idx + 1}</div>
                                        </td>
                                        <td class="px-8 py-5">
                                            <div class="flex items-center gap-3">
                                                <div class="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-600 font-black group-hover:text-violet-400 group-hover:border-violet-500/30 transition-all">
                                                    {player.student_name?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div class="flex flex-col">
                                                    <span class="font-bold text-white text-sm uppercase tracking-tight">{player.student_name}</span>
                                                    {#if player.status === 'withdrawn'}
                                                        <span class="text-[8px] text-red-500 font-black tracking-widest uppercase">{$t('tournaments.status_withdrawn')}</span>
                                                    {/if}
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-8 py-5 text-zinc-400 font-medium text-sm">
                                            <div class="flex items-center gap-2">
                                                <Target size={14} class="text-zinc-700" />
                                                {player.rating || 1200}
                                            </div>
                                        </td>
                                        <td class="px-8 py-5">
                                            <span class="px-2.5 py-1 rounded-none {player.status === 'withdrawn' ? 'bg-red-500/5 text-red-400 border-red-500/10' : 'bg-violet-500/5 text-violet-400 border-violet-500/10'} border text-[10px] uppercase font-black tracking-widest">{player.status === 'withdrawn' ? $t('tournaments.status_withdrawn') : $t('tournaments.status.confirmed')}</span>
                                        </td>
                                        <td class="px-8 py-5 text-right">
                                            <div class="flex items-center justify-end gap-2">
                                                <button 
                                                    onclick={() => handleWithdrawPlayer(player.student_id, player.status)}
                                                    class="p-2 hover:bg-zinc-800 rounded-none transition-colors text-zinc-500 hover:text-red-400"
                                                    title={player.status === 'withdrawn' ? $t('tournaments.player_reactivated') : $t('tournaments.player_withdrawn')}
                                                >
                                                    {#if player.status === 'withdrawn'}
                                                        <ArrowClockwise weight="bold" class="w-4 h-4" />
                                                    {:else}
                                                        <UserMinus weight="bold" class="w-4 h-4" />
                                                    {/if}
                                                </button>
                                                <button 
                                                    onclick={() => removePlayer(player.student_id)}
                                                    disabled={rounds.length > 0}
                                                    class="p-2 hover:bg-zinc-800 rounded-none transition-colors text-zinc-500 hover:text-red-400 disabled:opacity-30"
                                                    title={$t('tournaments.delete_permanently')}
                                                >
                                                    <Trash weight="bold" class="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                {/each}
                                {#if players.length === 0}
                                    <tr>
                                        <td colspan="4" class="px-8 py-20 text-center">
                                            <div class="flex flex-col items-center gap-4">
                                                <Users weight="duotone" class="w-12 h-12 text-zinc-800" />
                                                <p class="text-zinc-600 font-plus-jakarta italic text-sm">{$t('tournaments.wait_registrations')}</p>
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
                        <div class="bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-none py-32 text-center flex flex-col items-center gap-6 shadow-2xl">
                            <div class="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-700">
                                <Target weight="duotone" class="w-10 h-10" />
                            </div>
                            <div class="space-y-2">
                                <p class="text-zinc-500 font-plus-jakarta max-w-xs mx-auto text-base">{$t('tournaments.start_pairing_desc')}</p>
                            </div>
                            {#if tournament.status === 'upcoming'}
                                <button 
                                    onclick={handleStart}
                                    disabled={players.length < 2 || isProcessing}
                                    class="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-none font-outfit font-black text-xs tracking-widest transition-all shadow-xl shadow-fuchsia-500/10 active:scale-95"
                                >
                                    {$t('tournaments.generate_first_round')}
                                </button>
                            {/if}
                        </div>
                    {:else}
                         <!-- Round Management Header -->
                         <div class="flex items-center justify-between mb-8 bg-zinc-900/40 p-6 rounded-none border border-zinc-800">
                             <div class="flex items-center gap-4">
                                 <div class="w-12 h-12 bg-violet-600 rounded-none flex items-center justify-center text-white shadow-xl shadow-violet-500/20">
                                     <ListNumbers weight="bold" class="w-6 h-6" />
                                 </div>
                                 <div>
                                     <h3 class="text-xl font-outfit font-black text-white uppercase tracking-tight">{$t('tournaments.round')} {tournament.currentRound || 1}</h3>
                                     <p class="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                                         {pairings.filter(p => p.round_no === (tournament.currentRound || 1) && (p.result !== undefined || p.bye)).length} / {pairings.filter(p => p.round_no === (tournament.currentRound || 1)).length} {$t('tournaments.games_completed')}
                                     </p>
                                 </div>
                             </div>
                             
                             <div class="flex items-center gap-3">
                                 <button 
                                    onclick={handlePrintRound}
                                    class="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-none transition-all active:scale-95 flex items-center gap-2"
                                    title={$t('tournaments.print_round')}
                                 >
                                    <Printer weight="bold" class="w-5 h-5" />
                                 </button>

                                 {#if currentRoundFinished && tournament.status !== 'completed'}
                                     <button 
                                        onclick={handleNextRound}
                                        disabled={isProcessing}
                                        class="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-none font-outfit font-black text-[10px] tracking-widest transition-all shadow-lg shadow-violet-500/10 active:scale-95 flex items-center gap-2"
                                     >
                                        {#if isProcessing}
                                            <ArrowsClockwise weight="bold" class="w-4 h-4 animate-spin" />
                                        {/if}
                                        {(tournament.format === 'knockout' && pairings.filter(p => p.round_no === (tournament.currentRound || 1)).length === 1) ? $t('tournaments.finish_tournament') : $t('tournaments.generate_next_round')}
                                        <CaretRight weight="bold" class="w-3 h-3" />
                                     </button>
                                 {/if}

                                 <button 
                                    onclick={handleResetRound}
                                    disabled={isProcessing}
                                    class="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-none transition-all active:scale-95"
                                    title={$t('tournaments.reset_round')}
                                 >
                                    <ArrowCounterClockwise weight="bold" class="w-5 h-5" />
                                 </button>
                             </div>
                         </div>

                         {#each rounds.sort((a,b) => b.round_no - a.round_no) as round}
                            <div class="bg-zinc-900 border border-zinc-800 rounded-none overflow-hidden shadow-2xl mb-8 group/round">
                                <div class="bg-zinc-950/50 px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-gradient-to-r from-zinc-950 to-zinc-900">
                                    <div class="flex items-center gap-4">
                                        <h3 class="text-lg font-outfit font-black text-white uppercase tracking-tight">{$t('tournaments.round')} {round.round_no}</h3>
                                    </div>
                                    {#if round.round_no === tournament.currentRound}
                                        <span class="px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-none text-[10px] font-black uppercase tracking-widest animate-pulse">{$t('tournaments.status_active')}</span>
                                    {:else}
                                        <span class="px-3 py-1 bg-zinc-800 text-zinc-500 border border-zinc-700 rounded-none text-[10px] font-black uppercase tracking-widest">{$t('tournaments.status_closed')}</span>
                                    {/if}
                                </div>
                                <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-900">
                                    {#each pairings.filter(p => p.round_no === round.round_no).sort((a,b) => a.board - b.board) as p}
                                        <div class="flex flex-col bg-zinc-950/40 border border-zinc-800 rounded-none group/match hover:border-violet-500/30 transition-all hover:bg-zinc-950/60 shadow-lg relative overflow-hidden">
                                            <!-- Board Number -->
                                            <div class="absolute top-0 right-0 p-3 opacity-10 group-hover/match:opacity-20 transition-opacity">
                                                <span class="text-4xl font-black italic">#{p.board}</span>
                                            </div>

                                            <div class="p-6 space-y-4">
                                                <!-- White Player -->
                                                <div class="flex items-center justify-between">
                                                    <div class="flex items-center gap-3">
                                                        <div class="w-8 h-8 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">W</div>
                                                        <span class="font-bold text-white text-sm truncate max-w-[120px]">{p.white_name}</span>
                                                    </div>
                                                    {#if p.result === '1-0' || p.result === '0-1'}
                                                        <div class="px-3 py-1 bg-violet-600 text-white rounded-none text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-500/20">{$t('tournaments.win')}</div>
                                                    {:else if p.result === '1/2-1/2'}
                                                        <div class="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-none text-[10px] font-black uppercase tracking-widest">{$t('tournaments.draw')}</div>
                                                    {/if}
                                                </div>

                                                <!-- Black Player -->
                                                <div class="flex items-center justify-between">
                                                    <div class="flex items-center gap-3">
                                                        <div class="w-8 h-8 rounded-none bg-white border border-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-900 shadow-inner">B</div>
                                                        <span class="font-bold text-white text-sm truncate max-w-[120px]">{p.bye ? $t('tournaments.bye') : p.black_name}</span>
                                                    </div>
                                                    {#if p.result === '0-1'}
                                                        <div class="px-3 py-1 bg-violet-600 text-white rounded-none text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-500/20">{$t('tournaments.white_wins').split(' ')[0]}</div>
                                                    {:else if p.result === '1/2-1/2'}
                                                        <div class="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-none text-[10px] font-black uppercase tracking-widest">{$t('tournaments.draw')}</div>
                                                    {/if}
                                                </div>
                                            </div>

                                            <!-- Rapid Result Selector -->
                                            <div class="bg-zinc-950 mt-auto border-t border-zinc-800/50 p-3 grid grid-cols-3 gap-2">
                                                {#each [
                                                    { label: '1-0', value: '1-0', tip: $t('tournaments.white_wins'), icon: Crown, color: 'text-amber-500 hover:bg-amber-500/10' },
                                                    { label: '½-½', value: '1/2-1/2', tip: $t('tournaments.draw'), icon: Handshake, color: 'text-zinc-400 hover:bg-white/5' },
                                                    { label: '0-1', value: '0-1', tip: $t('tournaments.black_wins'), icon: Circle, color: 'text-indigo-400 hover:bg-indigo-500/10' }
                                                ] as res}
                                                    <button 
                                                        onclick={() => updateResult(p.id, res.value)}
                                                        disabled={p.bye}
                                                        class="group/res py-3 rounded-none text-[10px] font-black uppercase tracking-[0.2em] transition-all flex flex-col items-center gap-1.5 {p.result === res.value ? 'bg-violet-600 text-white shadow-lg' : 'bg-zinc-900/50 text-zinc-500 hover:text-white border border-transparent hover:border-zinc-800'}"
                                                        title={res.tip}
                                                    >
                                                        <res.icon size={16} weight={p.result === res.value ? 'fill' : 'duotone'} class={p.result === res.value ? 'text-white' : res.color.split(' ')[0]} />
                                                        {res.label}
                                                    </button>
                                                {/each}
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                         {/each}
                    {/if}
                </div>
            {/if}

            {#if activeTab === 'brackets'}
                <div class="bg-zinc-900 border border-zinc-800 rounded-none p-8 shadow-2xl overflow-hidden min-h-[600px]" in:fly={{ y: 20 }}>
                    <div class="mb-8">
                        <h3 class="text-xl font-outfit font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <Target weight="fill" class="w-6 h-6 text-violet-500" />
                            {$t('tournaments.visual_bracket')}
                        </h3>
                    </div>
                    <TournamentBracket {pairings} {players} currentRound={tournament.currentRound} format={tournament.format} />
                </div>
            {/if}

            {#if activeTab === 'crosstable'}
                <div class="bg-zinc-900 border border-zinc-800 rounded-none p-8 shadow-2xl overflow-hidden min-h-[600px]" in:fly={{ y: 20 }}>
                    <div class="mb-8">
                        <h3 class="text-xl font-outfit font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <ChartBar weight="fill" class="w-6 h-6 text-violet-500" />
                            {$t('tournaments.crosstable_view')}
                        </h3>
                    </div>
                    <TournamentCrosstable {players} {pairings} />
                </div>
            {/if}

            {#if activeTab === 'standings'}
                 <div class="bg-zinc-900 border border-zinc-800 rounded-none overflow-hidden shadow-2xl print-area" in:fly={{ y: 20 }}>
                     <div class="p-8 border-b border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 flex justify-between items-center">
                          <h3 class="text-xl font-outfit font-black text-white flex items-center gap-3 uppercase tracking-tight">
                              <Crown weight="fill" class="w-7 h-7 text-amber-500 drop-shadow-lg" />
                              {$t('tournaments.tab_standings')}
                          </h3>
                          <div class="flex items-center gap-3 no-print">
                              <button 
                                onclick={handlePrintStandings}
                                class="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-none font-outfit font-black text-[10px] tracking-widest transition-all"
                              >
                                <Printer weight="bold" class="w-4 h-4" />
                                {$t('tournaments.export_pdf')}
                              </button>
                              <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-950 px-3 py-1.5 rounded-none border border-zinc-800">{$t('tournaments.realtime_calc')}</span>
                          </div>
                     </div>

                     <!-- Podium Visual -->
                     <div class="p-8 bg-zinc-950 border-b border-zinc-900 flex justify-center items-end gap-2 md:gap-6 min-h-[240px]">

                        {#if sortedStandings.length >= 2}
                            <!-- 2nd Place -->
                            <div class="flex flex-col items-center gap-3">
                                <div class="w-16 h-16 bg-slate-100/10 border border-slate-400/20 rounded-none flex items-center justify-center text-slate-300 shadow-xl" in:scale={{ delay: 200 }}>
                                    <span class="text-xl font-black">2</span>
                                </div>
                                <div class="w-24 md:w-32 h-20 bg-gradient-to-b from-slate-100/10 to-transparent rounded-none border-x border-t border-slate-100/10 flex flex-col items-center justify-center p-2">
                                    <span class="text-[9px] font-black text-slate-300 uppercase tracking-tighter truncate w-full text-center">{sortedStandings[1].student_name}</span>
                                    <span class="text-xs font-black text-white">{sortedStandings[1].currentPoints}pts</span>
                                </div>
                            </div>
                        {/if}

                        {#if sortedStandings.length >= 1}
                            <!-- 1st Place -->
                            <div class="flex flex-col items-center gap-3 relative -top-4">
                                <div class="w-20 h-20 bg-amber-500/10 border border-amber-400/30 rounded-none flex items-center justify-center text-amber-500 shadow-[0_0_40px_rgba(251,191,36,0.2)]" in:scale={{ delay: 400 }}>
                                    <Crown weight="fill" class="w-10 h-10" />
                                </div>
                                <div class="w-28 md:w-40 h-32 bg-gradient-to-b from-amber-500/20 to-transparent rounded-none border-x border-t border-amber-500/20 flex flex-col items-center justify-center p-4">
                                    <span class="text-[11px] font-black text-amber-500 uppercase tracking-tight text-center leading-tight mb-1">{sortedStandings[0].student_name}</span>
                                    <span class="text-2xl font-black text-white">{sortedStandings[0].currentPoints}pts</span>
                                </div>
                            </div>
                        {/if}

                        {#if sortedStandings.length >= 3}
                            <!-- 3rd Place -->
                            <div class="flex flex-col items-center gap-3">
                                <div class="w-16 h-16 bg-orange-700/10 border border-orange-700/20 rounded-none flex items-center justify-center text-orange-400 shadow-xl" in:scale={{ delay: 600 }}>
                                    <span class="text-xl font-black">3</span>
                                </div>
                                <div class="w-24 md:w-32 h-16 bg-gradient-to-b from-orange-700/10 to-transparent rounded-none border-x border-t border-orange-700/10 flex flex-col items-center justify-center p-2">
                                    <span class="text-[9px] font-black text-orange-400 uppercase tracking-tighter truncate w-full text-center">{sortedStandings[2].student_name}</span>
                                    <span class="text-xs font-black text-white">{sortedStandings[2].currentPoints}pts</span>
                                </div>
                            </div>
                        {/if}
                     </div>

                     <div class="overflow-x-auto min-h-[400px]">
                         <table class="w-full text-left">
                             <thead class="bg-zinc-950/50 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                 <tr>
                                     <th class="px-8 py-5 w-24 text-center">{$t('tournaments.pos')}</th>
                                     <th class="px-8 py-5">{$t('tournaments.participants')}</th>
                                     <th class="px-8 py-5 text-center">{$t('tournaments.points')}</th>
                                     {#if tournament.format !== 'knockout'}
                                         <th class="px-8 py-5 text-center">
                                             {tournament.format === 'round_robin' ? $t('tournaments.tiebreak_sb') : $t('tournaments.tiebreak_bh')}
                                         </th>
                                         <th class="px-8 py-5 text-center">
                                             {tournament.format === 'round_robin' ? $t('tournaments.tiebreak_bh') : $t('tournaments.tiebreak_sb')}
                                         </th>
                                     {/if}
                                     <th class="px-8 py-5 text-right w-40">{$t('tournaments.performance')}</th>
                                 </tr>
                             </thead>
                             <tbody class="divide-y divide-zinc-800">
                                 {#each sortedStandings as player, i}
                                     <tr class="hover:bg-zinc-800/30 transition-colors group {player.status === 'withdrawn' ? 'opacity-40 grayscale' : ''}">
                                         <td class="px-8 py-5 text-center">
                                             {#if i === 0}
                                                 <div class="w-10 h-10 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-none flex items-center justify-center font-black mx-auto shadow-lg shadow-amber-500/5">1º</div>
                                             {:else if i === 1}
                                                 <div class="w-10 h-10 bg-slate-100/10 text-slate-300 border border-slate-100/20 rounded-none flex items-center justify-center font-black mx-auto shadow-lg shadow-slate-500/5">2º</div>
                                             {:else if i === 2}
                                                 <div class="w-10 h-10 bg-orange-700/10 text-orange-400 border border-orange-700/20 rounded-none flex items-center justify-center font-black mx-auto shadow-lg shadow-orange-500/5">3º</div>
                                             {:else}
                                                 <span class="font-black text-zinc-700">{i+1}º</span>
                                             {/if}
                                         </td>
                                         <td class="px-8 py-5">
                                             <div class="flex items-center gap-3">
                                                 <span class="font-bold text-white text-base group-hover:text-violet-300 transition-colors uppercase tracking-tight">{player.student_name}</span>
                                                 {#if i === 0}<Crown weight="fill" class="w-4 h-4 text-amber-500 animate-pulse" />{/if}
                                                 {#if player.status === 'withdrawn'}
                                                     <span class="text-[10px] font-bold bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-none uppercase">{$t('tournaments.withdrawn_short')}</span>
                                                 {/if}
                                             </div>
                                         </td>
                                         <td class="px-8 py-5 text-center">
                                             <div class="text-xl font-black text-amber-400 drop-shadow-[0_0_100px_rgba(251,191,36,0.1)]">{player.currentPoints}</div>
                                         </td>
                                         {#if tournament.format !== 'knockout'}
                                             <td class="px-8 py-5 text-center">
                                                 <div class="text-sm font-bold text-zinc-500">{player.tb1}</div>
                                             </td>
                                             <td class="px-8 py-5 text-center border-l border-zinc-800/10">
                                                 <div class="text-sm font-bold text-zinc-600">{player.tb2}</div>
                                             </td>
                                         {/if}
                                         <td class="px-8 py-5 text-right font-outfit">
                                             <div class="flex items-center justify-end gap-3">
                                                 <div class="w-24 bg-zinc-950 h-1.5 rounded-none overflow-hidden border border-zinc-800">
                                                     <div class="bg-violet-600 h-full transition-all duration-1000" style="width: {(player.currentPoints / Math.max(1, tournament.roundsPlanned || 1)) * 100}%"></div>
                                                 </div>
                                                 <span class="text-[10px] font-black text-zinc-600">{( (player.currentPoints / Math.max(1, tournament.roundsPlanned || 1)) * 100 ).toFixed(0)}%</span>
                                             </div>
                                         </td>
                                     </tr>
                                 {/each}
                                 {#if players.length === 0}
                                     <tr>
                                         <td colspan="6" class="px-8 py-20 text-center text-zinc-600 italic text-sm">{$t('tournaments.no_standings')}</td>
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
             <div class="bg-zinc-900 border border-zinc-800 rounded-none p-8 shadow-2xl relative overflow-hidden group">
                 <div class="absolute -top-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                     <Medal weight="duotone" class="w-48 h-48 text-white" />
                 </div>
                 
                 <div class="w-14 h-14 bg-amber-500/10 rounded-none flex items-center justify-center text-amber-500 mb-6 shadow-lg shadow-amber-500/5">
                    <Medal weight="duotone" class="w-8 h-8" />
                 </div>
                 
                 <h4 class="text-xl font-outfit font-black text-white mb-2 uppercase tracking-tight relative z-10">{$t('tournaments.prize_pool')}</h4>
                 <div class="flex items-baseline gap-2 mb-8 relative z-10">
                    <span class="text-4xl font-black text-white">{tournament.prize_pool || 0}</span>
                    <span class="text-xl font-bold text-zinc-600">€ EUR</span>
                 </div>
                 
                 <div class="space-y-4 relative z-10">
                     <div class="flex items-center justify-between p-4 bg-zinc-950/80 border border-zinc-800 rounded-none group/item hover:border-amber-500/30 transition-all">
                         <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-none bg-amber-500/20 flex items-center justify-center text-amber-500 text-xs font-black">{$t('tournaments.prizes.first')}</div>
                            <span class="text-xs font-outfit font-bold text-zinc-400 group-hover/item:text-white transition-colors">{$t('tournaments.prizes.first_desc')}</span>
                         </div>
                         <Crown weight="fill" class="w-4 h-4 text-amber-500" />
                     </div>
                     <div class="flex items-center justify-between p-4 bg-zinc-950/80 border border-zinc-800 rounded-none group/item hover:border-slate-400/30 transition-all">
                        <div class="flex items-center gap-3">
                           <div class="w-8 h-8 rounded-none bg-slate-500/20 flex items-center justify-center text-slate-300 text-xs font-black">{$t('tournaments.prizes.second')}</div>
                           <span class="text-xs font-outfit font-bold text-zinc-400 group-hover/item:text-white transition-colors">{$t('tournaments.prizes.second_desc')}</span>
                        </div>
                        <Medal weight="fill" class="w-4 h-4 text-slate-400" />
                    </div>
                 </div>
             </div>

             <!-- Venue Card -->
             <div class="bg-zinc-900 border border-zinc-800 rounded-none p-8 shadow-2xl relative overflow-hidden">
                 <h4 class="text-lg font-outfit font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tight">
                    <MapPin weight="duotone" class="w-6 h-6 text-violet-500" />
                    {$t('tournaments.venue')}
                 </h4>
                 <div class="p-6 bg-zinc-950 border border-zinc-800 rounded-none">
                     <p class="text-sm text-zinc-300 font-plus-jakarta leading-relaxed overflow-hidden">
                        {tournament.location || $t('tournaments.address_not_specified')}
                     </p>
                 </div>
                 <button class="w-full mt-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-none font-outfit font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3">
                    <MapPin weight="bold" class="w-4 h-4" /> {$t('tournaments.view_on_map')}
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
        class="bg-zinc-900 w-full max-w-xl rounded-none border border-zinc-800 p-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden"
        in:scale={{ start: 0.9, duration: 400, opacity: 0 }}
      >
          <!-- Modal Background Decorative Element -->
          <div class="absolute -top-24 -right-24 w-64 h-64 bg-violet-600/10 rounded-none blur-[80px]"></div>

          <button 
            onclick={() => showRegModal = false}
            class="absolute top-8 right-8 w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-500 hover:text-white transition-all shadow-lg active:scale-90"
          >
            <X weight="bold" class="w-4 h-4" />
          </button>

          <div class="flex items-center gap-5 mb-10">
            <div class="w-16 h-16 bg-violet-600 rounded-none flex items-center justify-center text-white shadow-xl shadow-violet-500/20">
                <UserPlus weight="duotone" class="w-8 h-8" />
            </div>
            <div>
                <h3 class="text-2xl font-outfit font-black text-white uppercase tracking-tight">{$t('tournaments.register_player')}</h3>
                <p class="text-zinc-500 text-sm font-medium uppercase tracking-widest mt-1">{$t('tournaments.name_label')}: {tournament?.name}</p>
            </div>
          </div>

          <div class="space-y-8 mb-10">
              <div class="space-y-3">
                  <label for="student-select-premium" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.searching_students')}</label>
                  <div class="relative group">
                    <Users weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                    <select 
                        id="student-select-premium"
                        bind:value={selectedStudentId}
                        class="w-full bg-zinc-950 border border-zinc-800 rounded-none pl-16 pr-8 py-5 text-sm text-white font-bold focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all appearance-none cursor-pointer shadow-inner"
                    >
                            <option value="">{$t('tournaments.searching_students')}</option>
                            {#each students.filter(s => !players.some(p => p.student_id === s.id)) as student}
                                <option value={student.id}>{student.name.toUpperCase()} (ELO {student.rating || 1200})</option>
                            {/each}
                    </select>
                    <CaretRight weight="bold" class="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 rotate-90 pointer-events-none" />
                  </div>
              </div>

              <div class="relative flex items-center gap-4 py-2">
                  <div class="h-px bg-zinc-800 flex-1"></div>
                  <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{$t('tournaments.manual_registration')}</span>
                  <div class="h-px bg-zinc-800 flex-1"></div>
              </div>

              <div class="space-y-3">
                  <label for="manual-name" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">{$t('tournaments.player_name_label')}</label>
                  <div class="relative group">
                    <UserPlus weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                    <input 
                        id="manual-name"
                        type="text"
                        placeholder="{$t('tournaments.form.player_name_placeholder')}"
                        bind:value={manualPlayerName}
                        class="w-full bg-zinc-950 border border-zinc-800 rounded-none pl-16 pr-8 py-5 text-sm text-white font-bold placeholder:text-zinc-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all shadow-inner"
                    />
                  </div>
              </div>

              <div class="bg-violet-600/5 border border-violet-500/20 rounded-none p-6 flex gap-4 items-start shadow-inner">
                  <Info weight="duotone" class="w-6 h-6 text-violet-400 shrink-0" />
                  <p class="text-[11px] text-violet-300 font-plus-jakarta leading-relaxed uppercase tracking-wider">
                      {$t('tournaments.register_player_desc')}
                  </p>
              </div>
          </div>

          <div class="flex gap-4">
              <button 
                onclick={() => showRegModal = false}
                class="flex-1 bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white font-outfit font-bold py-5 rounded-none transition-all active:scale-95 shadow-lg"
              >
                {$t('tournaments.discard')}
              </button>
              <button 
                onclick={handleRegister}
                disabled={(!selectedStudentId && !manualPlayerName) || isProcessing}
                class="flex-[2] bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-outfit font-black py-5 rounded-none transition-all shadow-xl shadow-violet-500/30 flex items-center justify-center gap-3 group active:scale-95"
              >
                {#if isProcessing}
                    <ArrowsClockwise weight="bold" class="w-6 h-6 animate-spin" />
                {:else}
                    <CheckCircle weight="fill" class="w-6 h-6 group-hover:scale-110 transition-transform" />
                {/if}
                {$t('tournaments.confirm_registration')}
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

