<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft, Trophy, Users, Play, Target, Calendar, Clock, MapPin, 
    Award, CheckCircle, AlertTriangle, Settings, UserPlus, RefreshCw, Crown, Medal
  } from 'lucide-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { getLocalTournamentsApi } from '$lib/api/local-tournaments';
  import { fade, fly } from 'svelte/transition';

  const tournamentId = page.params.tournamentId;
  
  // Reactividad con appStore
  let tournament = $derived($appStore.localTournaments.find(t => t.id === tournamentId));
  let students = $derived($appStore.students || []);
  let players = $derived($appStore.localTournamentPlayers.filter(p => p.tournament_id === tournamentId));
  let pairings = $derived($appStore.localTournamentPairings.filter(p => p.tournament_id === tournamentId));
  let rounds = $derived($appStore.localTournamentRounds.filter(r => r.tournament_id === tournamentId));

  let activeTab = $state('overview');
  let showRegModal = $state(false);
  let selectedStudentId = $state('');

  // Formateadores
  const formatDate = (d: string) => new Date(d).toLocaleDateString();
  const getStatusLabel = (s: string) => {
      const map: any = { draft: 'Borrador', upcoming: 'Próximo', in_progress: 'En Curso', completed: 'Finalizado' };
      return map[s] || s;
  };

  // Lógica de Registro
  const handleRegister = async () => {
    if (!selectedStudentId || !tournament || !tournamentId) return;
    
    try {
        const api = await getLocalTournamentsApi();
        await api.addPlayer(tournamentId as string, selectedStudentId);
        showRegModal = false;
        selectedStudentId = '';
    } catch (error) {
        console.error("Error registering player:", error);
        alert("Error al inscribir al jugador");
    }
  };

  // Lógica de Inicio (Generar Ronda 1)
  const handleStart = async () => {
      if (!tournament || players.length < 2 || !tournamentId) return;
      
      try {
          const api = await getLocalTournamentsApi();
          // Cambiar estado a en curso
          await api.updateTournament(tournamentId as string, { status: 'in_progress', currentRound: 1 });
          // Generar emparejamientos ronda 1
          await api.generatePairings(tournamentId as string, 1);
      } catch (error) {
          console.error("Error starting tournament:", error);
          alert("Error al iniciar el torneo");
      }
  };

  const updateResult = async (pairingId: string, result: string) => {
      if (!tournament || !tournamentId) return;
      
      try {
          const api = await getLocalTournamentsApi();
          const p = pairings.find(pair => pair.id === pairingId);
          if (p) {
              await api.updateResult(tournamentId as string, p.round_no, p.board, result as any);
          }
      } catch (error) {
          console.error("Error updating result:", error);
      }
  };

</script>

<svelte:head>
  <title>{tournament?.name || 'Cargando...'} - ChessNet</title>
</svelte:head>

{#if !tournament}
  <div class="h-screen flex items-center justify-center text-slate-500" transition:fade>
    Torneo no encontrado...
  </div>
{:else}
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" transition:fade>
    
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pt-8">
      <div class="flex items-center gap-4">
        <button onclick={() => goto('/panel/torneos')} class="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </button>
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
                {getStatusLabel(tournament.status)}
            </span>
          </div>
          <h1 class="text-3xl font-black text-white tracking-tight">{tournament.name}</h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
          {#if tournament.status === 'upcoming'}
            <button 
                onclick={handleStart}
                disabled={players.length < 2}
                class="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
            >
                <Play class="w-5 h-5" />
                Iniciar Torneo
            </button>
          {/if}
          <button class="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl font-bold border border-slate-700 transition-all">
              <Settings class="w-5 h-5" />
          </button>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex border-b border-slate-800 mb-8 overflow-x-auto no-scrollbar">
        {#each ['overview', 'players', 'pairings', 'standings'] as tab}
            <button 
                onclick={() => activeTab = tab}
                class="px-6 py-4 text-sm font-bold capitalize transition-all border-b-2 {activeTab === tab ? 'border-amber-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}"
            >
                {tab === 'overview' ? 'Resumen' : tab === 'players' ? 'Participantes' : tab === 'pairings' ? 'Emparejamientos' : 'Clasificación'}
            </button>
        {/each}
    </div>

    <!-- Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Main Column -->
        <div class="lg:col-span-2 space-y-8">
            {#if activeTab === 'overview'}
                <div class="bg-[#1e293b] rounded-3xl p-8 border border-slate-800">
                    <h3 class="text-white font-bold mb-6 flex items-center gap-2">
                        <Calendar class="w-5 h-5 text-indigo-500" />
                        Detalles del Evento
                    </h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Fecha de Inicio</p>
                            <p class="text-sm text-white">{tournament.start_date || tournament.startAt || 'N/A'}</p>
                        </div>
                        <div>
                            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Control de Tiempo</p>
                            <p class="text-sm text-white">{tournament.time_control || 'Standard'}</p>
                        </div>
                        <div>
                            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Formato</p>
                            <p class="text-sm text-white capitalize">{tournament.format}</p>
                        </div>
                    </div>
                    <div class="mt-8 pt-8 border-t border-slate-800">
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Descripción</p>
                        <p class="text-sm text-slate-400 leading-relaxed">{tournament.description || 'Sin descripción adicional.'}</p>
                    </div>
                </div>
            {/if}

            {#if activeTab === 'players'}
                <div class="bg-[#1e293b] rounded-3xl border border-slate-800 overflow-hidden">
                    <div class="p-6 border-b border-slate-800 flex justify-between items-center">
                         <h3 class="text-white font-bold">Listado de Inscritos</h3>
                         {#if tournament.status === 'upcoming'}
                            <button 
                                onclick={() => showRegModal = true}
                                class="text-xs bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-lg hover:bg-indigo-600/20 transition-all font-bold"
                            >
                                <UserPlus class="w-4 h-4 inline-block mr-1" /> Registrar
                            </button>
                         {/if}
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead class="bg-slate-900/50 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <tr>
                                    <th class="px-6 py-4">Jugador</th>
                                    <th class="px-6 py-4">Elo Estimado</th>
                                    <th class="px-6 py-4">Estado</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800">
                                {#each players as player}
                                    <tr class="hover:bg-slate-800/50 transition-colors">
                                        <td class="px-6 py-4 font-bold text-white">{player.student_name}</td>
                                        <td class="px-6 py-4 text-slate-400">{player.rating || 1200}</td>
                                        <td class="px-6 py-4">
                                            <span class="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-black">Confirmado</span>
                                        </td>
                                    </tr>
                                {/each}
                                {#if players.length === 0}
                                    <tr>
                                        <td colspan="3" class="px-6 py-12 text-center text-slate-500 italic text-sm">No hay jugadores registrados.</td>
                                    </tr>
                                {/if}
                            </tbody>
                        </table>
                    </div>
                </div>
            {/if}

            {#if activeTab === 'pairings'}
                <div class="space-y-4">
                    {#if rounds.length === 0}
                        <div class="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl py-20 text-center">
                            <Target class="w-12 h-12 text-slate-700 mx-auto mb-4" />
                            <p class="text-slate-500 font-bold">Inicia el torneo para generar los emparejamientos.</p>
                        </div>
                    {:else}
                         {#each rounds.sort((a,b) => b.round_no - a.round_no) as round}
                            <div class="bg-[#1e293b] rounded-3xl border border-slate-800 overflow-hidden mb-6">
                                <div class="bg-slate-900/50 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                                    <h3 class="text-white font-bold">Ronda {round.round_no}</h3>
                                    <span class="text-[10px] font-black uppercase tracking-widest text-emerald-400">Activa</span>
                                </div>
                                <div class="p-6 space-y-4">
                                    {#each pairings.filter(p => p.round_no === round.round_no).sort((a,b) => a.board - b.board) as p}
                                        <div class="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800 group hover:border-slate-700 transition-all">
                                            <div class="flex-1 text-right pr-4 font-bold text-white">
                                                {p.white_name}
                                            </div>
                                            <div class="px-4 py-2 bg-slate-800 rounded-xl text-xs font-black text-slate-500 flex items-center gap-3">
                                                 <button 
                                                    onclick={() => updateResult(p.id, '1-0')}
                                                    class="hover:text-amber-500 transition-colors {p.result === '1-0' ? 'text-amber-500' : ''}"
                                                 >{p.result === '1-0' ? '1' : (p.result === '1/2-1/2' ? '½' : (p.result === '0-1' ? '0' : 'White'))}</button>
                                                 <span class="text-slate-700">-</span>
                                                 <button 
                                                    onclick={() => updateResult(p.id, '0-1')}
                                                    class="hover:text-amber-500 transition-colors {p.result === '0-1' ? 'text-amber-500' : ''}"
                                                 >{p.result === '0-1' ? '1' : (p.result === '1/2-1/2' ? '½' : (p.result === '1-0' ? '0' : 'Black'))}</button>
                                            </div>
                                            <div class="flex-1 text-left pl-4 font-bold text-white">
                                                {p.bye ? 'BYE' : p.black_name}
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
                 <div class="bg-[#1e293b] rounded-3xl border border-slate-800 overflow-hidden">
                    <div class="p-6 border-b border-slate-800">
                         <h3 class="text-white font-bold flex items-center gap-2">
                             <Crown class="w-5 h-5 text-amber-500" />
                             Clasificación Provisional
                         </h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead class="bg-slate-900/50 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <tr>
                                    <th class="px-6 py-4 w-16">Pos</th>
                                    <th class="px-6 py-4">Nombre</th>
                                    <th class="px-6 py-4 text-center">Puntos</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800">
                                {#each players.map(p => {
                                    const playerPairings = pairings.filter(pair => pair.white_student_id === p.student_id || pair.black_student_id === p.student_id);
                                    let pts = 0;
                                    playerPairings.forEach(pair => {
                                        if (pair.white_student_id === p.student_id) pts += pair.points_white || 0;
                                        else pts += pair.points_black || 0;
                                    });
                                    return { ...p, currentPoints: pts };
                                }).sort((a,b) => b.currentPoints - a.currentPoints) as player, i}
                                    <tr class="hover:bg-slate-800/50 transition-colors">
                                        <td class="px-6 py-4 font-black text-slate-500">{i+1}</td>
                                        <td class="px-6 py-4">
                                            <div class="flex items-center gap-2">
                                                <span class="font-bold text-white">{player.student_name}</span>
                                                {#if i === 0}<Crown class="w-4 h-4 text-amber-500" />{/if}
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 text-center font-black text-amber-400">{player.currentPoints}</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
             <div class="bg-gradient-to-br from-amber-600/20 to-orange-600/10 p-6 rounded-3xl border border-amber-500/20">
                 <Medal class="w-8 h-8 text-amber-500 mb-4" />
                 <h4 class="text-white font-black text-lg mb-1">Premios y Trofeos</h4>
                 <p class="text-sm text-slate-400 mb-4">Total en premios: <span class="text-white font-bold">{tournament.prize_pool || 0} €</span></p>
                 <div class="space-y-2">
                     <div class="flex justify-between text-xs text-slate-300">
                         <span>1er Puesto</span>
                         <span class="font-bold text-amber-400">Trofeo de Oro</span>
                     </div>
                     <div class="flex justify-between text-xs text-slate-300">
                        <span>2do Puesto</span>
                        <span class="font-bold text-slate-300">Medalla de Plata</span>
                    </div>
                 </div>
             </div>

             <div class="bg-[#1e293b] p-6 rounded-3xl border border-slate-800">
                 <h4 class="text-white font-bold mb-4">Ubicación</h4>
                 <div class="flex items-start gap-3">
                     <MapPin class="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                     <p class="text-sm text-slate-400">{tournament.location || 'Consultar con el organizador.'}</p>
                 </div>
             </div>
        </div>
    </div>
  </div>
{/if}

<!-- Quick Registration Modal -->
{#if showRegModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" transition:fade>
      <div 
        class="bg-[#1e293b] w-full max-w-md rounded-3xl border border-slate-700 p-8 shadow-2xl"
        in:fly={{ y: 20 }}
      >
          <h3 class="text-xl font-black text-white mb-2">Inscribir Jugador</h3>
          <p class="text-slate-400 text-sm mb-8">Selecciona un alumno activo de tu base de datos para registrarlo en el evento.</p>

          <div class="space-y-6 mb-8">
              <div class="space-y-2">
                  <label for="student-select" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Alumno</label>
                  <select 
                    id="student-select"
                    bind:value={selectedStudentId}
                    class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none transition-all appearance-none"
                  >
                        <option value="">Seleccionar alumno...</option>
                        {#each students.filter(s => !players.some(p => p.student_id === s.id)) as student}
                            <option value={student.id}>{student.name} ({student.rating || 1200} Elo)</option>
                        {/each}
                  </select>
              </div>
          </div>

          <div class="flex gap-4">
              <button 
                onclick={() => showRegModal = false}
                class="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <button 
                onclick={handleRegister}
                disabled={!selectedStudentId}
                class="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-indigo-900/40"
              >
                Inscribir
              </button>
          </div>
      </div>
  </div>
{/if}

<style>
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
