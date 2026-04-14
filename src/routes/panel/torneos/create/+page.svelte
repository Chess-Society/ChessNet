<script lang="ts">
  import { 
    Trophy, 
    CalendarBlank, 
    Clock, 
    MapPin, 
    Target, 
    Coins, 
    ArrowLeft,
    Users,
    Info,
    CheckCircle,
    CaretRight,
    UsersThree
  } from 'phosphor-svelte';
  import { goto } from '$app/navigation';
  import { appStore } from '$lib/stores/appStore';
  import { fade, fly, scale } from 'svelte/transition';

  let tournament = $state({
    name: '',
    startDate: '',
    timeControl: '15 + 10',
    location: '',
    format: 'swiss',
    maxPlayers: 16,
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

  const getFormatLabel = (f: string) => {
    switch(f) {
      case 'swiss': return 'Sistema Suizo';
      case 'round_robin': return 'Todos contra Todos';
      case 'elimination': return 'Eliminación Directa';
      default: return f;
    }
  };

</script>

<svelte:head>
  <title>Nuevo Torneo - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-8" in:fade={{ duration: 300 }}>
  
  <!-- Back & Header -->
  <div class="flex items-center gap-6 mb-12">
    <button 
      onclick={() => goto('/panel/torneos')} 
      class="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-lg"
      aria-label="Volver"
    >
      <ArrowLeft weight="bold" class="w-5 h-5" />
    </button>
    <div>
      <h1 class="text-4xl font-outfit font-black text-white tracking-tight">Organizar Torneo</h1>
      <p class="text-zinc-500 font-plus-jakarta text-base mt-1">Configura los detalles de tu próximo evento competitivo.</p>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
    <!-- Left: Form Sections -->
    <div class="lg:col-span-2 space-y-8">
      <form onsubmit={handleSubmit} id="tournament-form" class="space-y-8">
        
        <!-- Section 1: Basic Info -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-8 opacity-5">
            <Trophy weight="duotone" class="w-32 h-32 text-white" />
          </div>
          
          <h3 class="text-xl font-outfit font-bold text-white mb-8 flex items-center gap-3 relative z-10">
            <div class="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-500">
              <Info weight="duotone" class="w-6 h-6" />
            </div>
            Información General
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div class="space-y-2 md:col-span-2">
              <label for="t-name" class="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Nombre del Torneo</label>
              <input 
                id="t-name"
                type="text" 
                bind:value={tournament.name}
                required
                placeholder="Ej. I Copa de Talentos 'Bobby Fischer'"
                class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all placeholder:text-zinc-700 shadow-inner"
              />
            </div>

            <div class="space-y-2 md:col-span-2">
              <label for="t-desc" class="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Descripción (Opcional)</label>
              <textarea 
                id="t-desc"
                bind:value={tournament.description}
                placeholder="Describe los objetivos, premios o reglas especiales..."
                rows="3"
                class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all placeholder:text-zinc-700 shadow-inner resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Section 2: Logistics & Rules -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl overflow-hidden">
          <h3 class="text-xl font-outfit font-bold text-white mb-8 flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
              <CalendarBlank weight="duotone" class="w-6 h-6" />
            </div>
            Logística y Formato
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="t-date" class="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Fecha del Evento</label>
              <div class="relative">
                <CalendarBlank weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input 
                  id="t-date"
                  type="date" 
                  bind:value={tournament.startDate}
                  required
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-14 pr-5 py-4 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all shadow-inner [color-scheme:dark]"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label for="t-time" class="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Control de Tiempo</label>
              <div class="relative">
                <Clock weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input 
                  id="t-time"
                  type="text" 
                  bind:value={tournament.timeControl}
                  placeholder="Ej. 10min + 5seg"
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-14 pr-5 py-4 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all placeholder:text-zinc-700 shadow-inner"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label for="t-loc" class="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Ubicación</label>
              <div class="relative">
                <MapPin weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input 
                  id="t-loc"
                  type="text" 
                  bind:value={tournament.location}
                  placeholder="Ej. Sede Central o Online"
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-14 pr-5 py-4 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all placeholder:text-zinc-700 shadow-inner"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label for="t-format" class="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Formato de Juego</label>
              <div class="relative">
                <Target weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 pointer-events-none" />
                <select 
                  id="t-format"
                  bind:value={tournament.format}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-14 pr-5 py-4 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all appearance-none cursor-pointer shadow-inner"
                >
                  <option value="swiss">Sistema Suizo</option>
                  <option value="round_robin">Liga (Round Robin)</option>
                  <option value="elimination">Eliminación Directa</option>
                </select>
                <CaretRight weight="bold" class="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 rotate-90 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Players & Prizes -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl overflow-hidden">
          <h3 class="text-xl font-outfit font-bold text-white mb-8 flex items-center gap-3">
            <div class="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-500">
              <Coins weight="duotone" class="w-6 h-6" />
            </div>
            Capacidad y Premios
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="t-max" class="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Límite de Jugadores</label>
              <div class="relative">
                <UsersThree weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input 
                  id="t-max"
                  type="number" 
                  bind:value={tournament.maxPlayers}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-14 pr-5 py-4 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label for="t-prize" class="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Bolsa de Premios (€)</label>
              <div class="relative">
                <Coins weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input 
                  id="t-prize"
                  type="number" 
                  bind:value={tournament.prizePool}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-14 pr-5 py-4 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Right: Sticky Preview & Actions -->
    <div class="lg:col-span-1">
      <div class="sticky top-8 space-y-6">
        
        <!-- Live Preview Card -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 shadow-2xl overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-100 transition-opacity"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-8">
              <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-950 px-3 py-1.5 rounded-full border border-zinc-800">Vista Previa</span>
              <div class="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-violet-500">
                <Trophy weight="duotone" class="w-6 h-6" />
              </div>
            </div>

            <div class="space-y-6">
              <div>
                <h4 class="text-2xl font-outfit font-black text-white leading-tight uppercase truncate">
                  {tournament.name || 'Nombre del Torneo'}
                </h4>
                <div class="mt-2 flex">
                  <span class="px-2.5 py-1 rounded-lg border text-[10px] font-outfit font-black uppercase tracking-widest bg-violet-500/10 text-violet-400 border-violet-500/20">
                    PRÓXIMO
                  </span>
                </div>
              </div>

              <div class="space-y-4 pt-4 border-t border-zinc-800/50">
                <div class="flex items-center gap-3 text-zinc-400 font-plus-jakarta text-sm">
                  <CalendarBlank weight="duotone" class="w-5 h-5 text-zinc-500" />
                  <span>{tournament.startDate ? new Date(tournament.startDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }) : 'Fecha pendiente'}</span>
                </div>
                <div class="flex items-center gap-3 text-zinc-400 font-plus-jakarta text-sm">
                  <Target weight="duotone" class="w-5 h-5 text-zinc-500" />
                  <span>{getFormatLabel(tournament.format)}</span>
                </div>
                <div class="flex items-center gap-3 text-zinc-400 font-plus-jakarta text-sm">
                  <UsersThree weight="duotone" class="w-5 h-5 text-zinc-500" />
                  <span>Máx. {tournament.maxPlayers} Jugadores</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Card -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
          <p class="text-zinc-500 text-sm font-plus-jakarta mb-6 text-center italic">
            "El ajedrez es un campo en el que la organización es tan vital como el ataque."
          </p>
          
          <div class="flex flex-col gap-3">
            <button 
              form="tournament-form"
              type="submit"
              class="w-full bg-violet-600 hover:bg-violet-500 text-white font-outfit font-black py-4 rounded-2xl transition-all shadow-lg shadow-violet-500/20 active:scale-95 flex items-center justify-center gap-2 group"
            >
              <CheckCircle weight="bold" class="w-6 h-6 group-hover:scale-110 transition-transform" />
              PUBLICAR EVENTO
            </button>
            <button 
              onclick={() => goto('/panel/torneos')}
              class="w-full bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 font-outfit font-bold py-4 rounded-2xl transition-all active:scale-95"
            >
              DESCARTAR
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

<style>
  /* Custom scrollbar for textareas if needed */
  textarea::-webkit-scrollbar {
    width: 6px;
  }
  textarea::-webkit-scrollbar-track {
    background: transparent;
  }
  textarea::-webkit-scrollbar-thumb {
    background: #27272a;
    border-radius: 10px;
  }
</style>
