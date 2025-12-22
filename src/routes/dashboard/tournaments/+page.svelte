<script lang="ts">
    import { onMount } from "svelte";
    import { getTournaments, type Tournament } from "$lib/services/mockData";
    import {
        Trophy,
        Calendar,
        Users,
        Swords,
        Plus,
        ChevronRight,
    } from "lucide-svelte";

    let tournaments: Tournament[] = [];
    let loading = true;

    onMount(async () => {
        tournaments = await getTournaments();
        loading = false;
    import { appStore, storeActions, type Tournament } from "$lib/services/storage";
    import { Trophy, Calendar, Users, MapPin, Plus, Medal } from "lucide-svelte";
    import { slide } from "svelte/transition";

    let store = $appStore;
    appStore.subscribe(value => store = value);

    let showForm = false;
    let newTournament: Tournament = {
        id: '',
        name: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Upcoming',
        participants: 0,
        format: 'Suizo'
    };

    function handleSubmit() {
        if (!newTournament.name) return;
        
        const tournamentToAdd = {
            ...newTournament,
            id: crypto.randomUUID()
        };
        
        storeActions.addTournament(tournamentToAdd);
        
        // Reset form (keep date)
        newTournament = { 
            id: '', 
            name: '', 
            date: new Date().toISOString().split('T')[0], 
            status: 'Upcoming', 
            participants: 0, 
            format: 'Suizo' 
        };
        showForm = false;
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
                <Trophy class="w-8 h-8 text-orange-500" /> Torneos
            </h1>
            <p class="mt-2 text-sm text-slate-400">
                Gestiona tus competiciones y ligas locales.
            </p>
        </div>
        <div class="mt-4 sm:mt-0">
            <button
                onclick={() => showForm = !showForm}
                class="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
                <Plus class="w-5 h-5" />
                Nuevo Torneo
            </button>
        </div>
    </div>

    {#if showForm}
        <div transition:slide class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 mb-8 mt-6 max-w-2xl">
            <h3 class="text-lg font-bold text-white mb-4">Organizar Nuevo Torneo</h3>
            <div class="space-y-4">
                 <div>
                    <label class="block text-sm font-medium text-slate-400 mb-1">Nombre del Torneo</label>
                    <input bind:value={newTournament.name} type="text" placeholder="Ej: Torneo de Primavera" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                </div>
                 <div class="grid grid-cols-2 gap-4">
                     <div>
                        <label class="block text-sm font-medium text-slate-400 mb-1">Fecha</label>
                        <input bind:value={newTournament.date} type="date" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-400 mb-1">Formato</label>
                        <select bind:value={newTournament.format} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white">
                            <option value="Suizo">Sistema Suizo</option>
                            <option value="Round Robin">Round Robin (Liga)</option>
                            <option value="Eliminatoria">Eliminatoria Directa</option>
                        </select>
                    </div>
                 </div>
                 <div class="flex justify-end gap-3 mt-6">
                    <button onclick={() => showForm = false} class="text-slate-400 hover:text-white px-4 py-2">Cancelar</button>
                    <button onclick={handleSubmit} class="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-medium">Crear Torneo</button>
                </div>
            </div>
        </div>
    {/if}

    <div class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         {#if store.tournaments.length === 0}
            <div class="col-span-full py-12 text-center bg-[#1e293b]/50 rounded-3xl border border-dashed border-slate-700">
                <Trophy class="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 class="text-xl font-bold text-white mb-2">No hay torneos activos</h3>
                <p class="text-slate-400 mb-6">Organiza tu primer torneo para tus alumnos.</p>
            </div>
         {:else}
            {#each store.tournaments as tournament}
                <div class="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 hover:shadow-xl hover:border-orange-500/30 transition-all flex flex-col">
                    <div class="flex justify-between items-start mb-4">
                        <div class="bg-orange-500/10 p-3 rounded-xl">
                            <Medal class="w-6 h-6 text-orange-500" />
                        </div>
                        <span class="px-2 py-1 text-xs font-bold rounded-lg uppercase
                            {tournament.status === 'Ongoing' ? 'bg-green-500/10 text-green-400' : 
                             tournament.status === 'Completed' ? 'bg-slate-700/50 text-slate-400' : 
                             'bg-blue-500/10 text-blue-400'}">
                            {tournament.status === 'Ongoing' ? 'En Curso' : 
                             tournament.status === 'Completed' ? 'Finalizado' : 'Próximo'}
                        </span>
                    </div>

                                class="flex items-center text-slate-400 text-sm"
                            >
                                <Swords class="w-4 h-4 mr-2 text-slate-500" />
                                Formato: {tournament.type}
                            </div>
                        </div>

                        <button
                            class="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-orange-600 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                            Gestionar
                            <ChevronRight class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>
