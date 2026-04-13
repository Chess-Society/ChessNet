<script lang="ts">
  import { Trophy, Calendar, Clock, MapPin, Target, DollarSign, ArrowLeft } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { appStore } from '$lib/stores/appStore';
  import { fade, fly } from 'svelte/transition';

  let tournament = $state({
    name: '',
    startDate: '',
    timeControl: '10 + 5',
    location: '',
    format: 'swiss',
    maxPlayers: 20,
    prizePool: 0,
    description: ''
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    
    const newTournament = {
      name: tournament.name,
      startAt: tournament.startDate,
      time_control: tournament.timeControl,
      location: tournament.location,
      format: tournament.format,
      max_players: tournament.maxPlayers,
      prize_pool: tournament.prizePool,
      description: tournament.description,
      status: 'upcoming'
    };

    await appStore.addLocalTournament(newTournament);
    goto(`/panel/torneos`);
  };

</script>

<svelte:head>
  <title>Crear Torneo - ChessNet</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" transition:fade>
  
  <div class="flex items-center gap-4 mb-10 pt-8">
     <button onclick={() => goto('/panel/torneos')} class="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
        <ArrowLeft class="w-5 h-5" />
     </button>
     <div>
        <h1 class="text-3xl font-black text-white tracking-tight">Nuevo Torneo</h1>
        <p class="text-slate-400 text-sm">Organiza un evento inolvidable para tus alumnos.</p>
     </div>
  </div>

  <form onsubmit={handleSubmit} class="space-y-8">
      <div class="bg-[#1e293b] rounded-3xl p-8 border border-slate-800 shadow-xl">
          <h3 class="text-white font-bold mb-8 flex items-center gap-2">
              <Trophy class="w-5 h-5 text-amber-500" />
              Información del Evento
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2 md:col-span-2">
                  <label for="t-name" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nombre del Torneo</label>
                  <input 
                    id="t-name"
                    type="text" 
                    bind:value={tournament.name}
                    required
                    placeholder="Ej. I Torneo Clasificatorio de Invierno"
                    class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all"
                  />
              </div>

              <div class="space-y-2">
                  <label for="t-date" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Fecha</label>
                  <div class="relative">
                      <Calendar class="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                      <input 
                        id="t-date"
                        type="date" 
                        bind:value={tournament.startDate}
                        required
                        class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all"
                      />
                  </div>
              </div>

              <div class="space-y-2">
                  <label for="t-time" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Control de Tiempo</label>
                  <div class="relative">
                      <Clock class="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                      <input 
                        id="t-time"
                        type="text" 
                        bind:value={tournament.timeControl}
                        placeholder="Ej. 10min + 5seg"
                        class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all"
                      />
                  </div>
              </div>

              <div class="space-y-2">
                  <label for="t-loc" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Ubicación / Modalidad</label>
                  <div class="relative">
                      <MapPin class="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                      <input 
                        id="t-loc"
                        type="text" 
                        bind:value={tournament.location}
                        placeholder="Ej. Club de Ajedrez Central o Online"
                        class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all"
                      />
                  </div>
              </div>

              <div class="space-y-2">
                  <label for="t-format" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Formato</label>
                  <div class="relative">
                      <Target class="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                      <select 
                        id="t-format"
                        bind:value={tournament.format}
                        class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all appearance-none"
                      >
                          <option value="swiss">Sistema Suizo</option>
                          <option value="round_robin">Liga (Round Robin)</option>
                          <option value="elimination">Eliminación Directa</option>
                      </select>
                  </div>
              </div>
          </div>
      </div>

      <div class="bg-[#1e293b] rounded-3xl p-8 border border-slate-800 shadow-xl">
          <h3 class="text-white font-bold mb-8 flex items-center gap-2">
              <DollarSign class="w-5 h-5 text-emerald-500" />
              Premios y Límites
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2">
                  <label for="t-prize" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Bolsa de Premios (€)</label>
                  <input 
                    id="t-prize"
                    type="number" 
                    bind:value={tournament.prizePool}
                    class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-all"
                  />
              </div>
              <div class="space-y-2">
                  <label for="t-max" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Máx. Jugadores</label>
                  <input 
                    id="t-max"
                    type="number" 
                    bind:value={tournament.maxPlayers}
                    class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-all"
                  />
              </div>
          </div>
      </div>

      <div class="flex justify-end gap-4">
          <button 
            type="button" 
            onclick={() => goto('/panel/torneos')}
            class="px-8 py-3 text-slate-400 font-bold hover:text-white transition-colors"
          >
            Descartar
          </button>
          <button 
            type="submit"
            class="bg-amber-600 hover:bg-amber-500 text-white font-bold px-10 py-3 rounded-2xl shadow-lg shadow-amber-900/20 transition-all hover:scale-105 active:scale-95"
          >
            Publicar Torneo
          </button>
      </div>
  </form>
</div>
